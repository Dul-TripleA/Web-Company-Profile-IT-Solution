'use server';

import { and, eq, notInArray } from 'drizzle-orm';
import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { portfolioProjects, portfolioTranslations } from '@/lib/db/schema';
import { requireAdmin } from './auth';
import { PROJECT_FIELDS, validateProject } from './portfolio-schema';
import type { AdminFormState } from './state';

const PORTFOLIO_TAG = 'portfolio';
const CHECK_FORM = 'Periksa kembali isian yang ditandai.';

function readValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    PROJECT_FIELDS.map((field) => [field, String(formData.get(field) ?? '')]),
  );
}

function errorCode(error: unknown): string | undefined {
  const value = (error as { code?: string; cause?: { code?: string } } | null) ?? {};
  return value.code ?? value.cause?.code;
}

async function save(
  id: string | null,
  formData: FormData,
): Promise<AdminFormState | { id: string }> {
  const raw = readValues(formData);
  const { issues, project, translations } = validateProject(raw);
  if (issues.length > 0) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of issues) fieldErrors[issue.field] ??= issue.message;
    return { fieldErrors, values: raw, message: CHECK_FORM };
  }

  try {
    const projectId = await getDb().transaction(async (tx) => {
      const [row] = id
        ? await tx
            .update(portfolioProjects)
            .set({ ...project, updatedAt: new Date() })
            .where(eq(portfolioProjects.id, id))
            .returning({ id: portfolioProjects.id })
        : await tx
            .insert(portfolioProjects)
            .values(project)
            .returning({ id: portfolioProjects.id });
      if (!row) return null;

      for (const translation of translations) {
        await tx
          .insert(portfolioTranslations)
          .values({ ...translation, projectId: row.id })
          .onConflictDoUpdate({
            target: [portfolioTranslations.projectId, portfolioTranslations.locale],
            set: translation,
          });
      }
      await tx.delete(portfolioTranslations).where(
        and(
          eq(portfolioTranslations.projectId, row.id),
          notInArray(
            portfolioTranslations.locale,
            translations.map((item) => item.locale),
          ),
        ),
      );
      return row.id;
    });
    if (!projectId) return { fieldErrors: {}, values: raw, message: 'Proyek tidak ditemukan.' };
    return { id: projectId };
  } catch (error) {
    if (errorCode(error) === '23505') {
      return {
        fieldErrors: { slug: 'Slug sudah dipakai proyek lain' },
        values: raw,
        message: CHECK_FORM,
      };
    }
    console.error('saveProject failed:', error instanceof Error ? error.name : 'unknown');
    return { fieldErrors: {}, values: raw, message: 'Gagal menyimpan. Coba lagi.' };
  }
}

function refresh() {
  updateTag(PORTFOLIO_TAG);
  revalidatePath('/admin', 'layout');
}

export async function createProject(_previous: AdminFormState, formData: FormData) {
  await requireAdmin();
  const result = await save(null, formData);
  if (!('id' in result)) return result;
  refresh();
  redirect(`/admin/portfolio/${result.id}?saved=1`);
}

export async function updateProject(id: string, _previous: AdminFormState, formData: FormData) {
  await requireAdmin();
  const result = await save(id, formData);
  if (!('id' in result)) return result;
  refresh();
  return {
    saved: true,
    message: 'Perubahan tersimpan.',
    fieldErrors: {},
    values: readValues(formData),
  };
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();
  await getDb().delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  refresh();
  redirect('/admin/portfolio');
}
