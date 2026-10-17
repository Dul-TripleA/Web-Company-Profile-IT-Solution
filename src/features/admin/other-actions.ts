'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { categories, categoryTranslations, contactMessages } from '@/lib/db/schema';
import { requireAdmin } from './auth';
import { slugify } from './post-schema';
import type { AdminFormState } from './state';

const POSTS_TAG = 'posts';

// Satu kategori untuk semua bahasa. Nama Indonesia wajib; nama Inggris opsional (situs memakai
// nama Indonesia bila kosong).
const namesSchema = z.object({
  name_id: z.string().trim().min(2, 'Nama minimal 2 karakter').max(60, 'Nama maksimal 60 karakter'),
  name_en: z.string().trim().max(60, 'Nama maksimal 60 karakter'),
});

function readNames(formData: FormData) {
  return namesSchema.safeParse({
    name_id: String(formData.get('name_id') ?? ''),
    name_en: String(formData.get('name_en') ?? ''),
  });
}

function fieldErrorsOf(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  return fieldErrors;
}

function errorCode(error: unknown): string | undefined {
  const value = (error as { code?: string; cause?: { code?: string } } | null) ?? {};
  return value.code ?? value.cause?.code;
}

type Db = ReturnType<typeof getDb>;
type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

async function writeNames(tx: Tx, categoryId: string, names: { name_id: string; name_en: string }) {
  for (const [locale, name] of [
    ['id', names.name_id],
    ['en', names.name_en],
  ] as const) {
    if (name) {
      await tx
        .insert(categoryTranslations)
        .values({ categoryId, locale, name })
        .onConflictDoUpdate({
          target: [categoryTranslations.categoryId, categoryTranslations.locale],
          set: { name },
        });
    } else {
      await tx
        .delete(categoryTranslations)
        .where(
          and(
            eq(categoryTranslations.categoryId, categoryId),
            eq(categoryTranslations.locale, locale),
          ),
        );
    }
  }
}

function refresh() {
  updateTag(POSTS_TAG);
  revalidatePath('/admin', 'layout');
}

export async function createCategory(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = readNames(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  const slug = slugify(parsed.data.name_id);
  if (!slug) return { fieldErrors: { name_id: 'Nama harus memuat huruf atau angka' } };

  try {
    await getDb().transaction(async (tx) => {
      const [row] = await tx.insert(categories).values({ slug }).returning({ id: categories.id });
      if (row) await writeNames(tx, row.id, parsed.data);
    });
  } catch (error) {
    if (errorCode(error) === '23505') {
      return { fieldErrors: { name_id: 'Kategori dengan slug yang sama sudah ada' } };
    }
    console.error('createCategory failed:', error instanceof Error ? error.name : 'unknown');
    return { fieldErrors: {}, message: 'Gagal menyimpan. Coba lagi.' };
  }
  refresh();
  return { saved: true, message: 'Kategori ditambahkan.', fieldErrors: {} };
}

/** Hanya nama yang berubah; slug tetap agar URL kategori tidak putus. */
export async function updateCategoryNames(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = readNames(formData);
  if (!parsed.success) return;
  await getDb().transaction((tx) => writeNames(tx, id, parsed.data));
  refresh();
}

/** Artikel di kategori ini tidak ikut terhapus; kategorinya menjadi kosong (FK set null). */
export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();
  await getDb().delete(categories).where(eq(categories.id, id));
  refresh();
}

export async function setMessageHandled(id: string, handled: boolean): Promise<void> {
  await requireAdmin();
  await getDb().update(contactMessages).set({ handled }).where(eq(contactMessages.id, id));
  revalidatePath('/admin', 'layout');
}
