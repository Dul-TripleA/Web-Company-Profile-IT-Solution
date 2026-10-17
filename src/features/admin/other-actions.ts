'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { categories, contactMessages } from '@/lib/db/schema';
import { requireAdmin } from './auth';
import { slugify } from './post-schema';
import type { AdminFormState } from './state';

const POSTS_TAG = 'posts';

const categorySchema = z.object({
  locale: z.enum(['id', 'en'], 'Pilih bahasa'),
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(60, 'Nama maksimal 60 karakter'),
});

function errorCode(error: unknown): string | undefined {
  const value = (error as { code?: string; cause?: { code?: string } } | null) ?? {};
  return value.code ?? value.cause?.code;
}

export async function createCategory(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse({
    locale: String(formData.get('locale') ?? ''),
    name: String(formData.get('name') ?? ''),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors };
  }

  const slug = slugify(parsed.data.name);
  if (!slug) return { fieldErrors: { name: 'Nama harus memuat huruf atau angka' } };

  try {
    await getDb()
      .insert(categories)
      .values({ ...parsed.data, slug });
  } catch (error) {
    if (errorCode(error) === '23505') {
      return { fieldErrors: { name: 'Kategori dengan slug yang sama sudah ada' } };
    }
    console.error('createCategory failed:', error instanceof Error ? error.name : 'unknown');
    return { fieldErrors: {}, message: 'Gagal menyimpan. Coba lagi.' };
  }
  updateTag(POSTS_TAG);
  revalidatePath('/admin', 'layout');
  return { saved: true, message: 'Kategori ditambahkan.', fieldErrors: {} };
}

/** Hanya nama yang berubah; slug tetap agar URL kategori tidak putus. */
export async function renameCategory(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const name = z.string().trim().min(2).max(60).safeParse(formData.get('name'));
  if (!name.success) return;
  await getDb().update(categories).set({ name: name.data }).where(eq(categories.id, id));
  updateTag(POSTS_TAG);
  revalidatePath('/admin', 'layout');
}

/** Artikel di kategori ini tidak ikut terhapus; kategorinya menjadi kosong (FK set null). */
export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();
  await getDb().delete(categories).where(eq(categories.id, id));
  updateTag(POSTS_TAG);
  revalidatePath('/admin', 'layout');
}

export async function setMessageHandled(id: string, handled: boolean): Promise<void> {
  await requireAdmin();
  await getDb().update(contactMessages).set({ handled }).where(eq(contactMessages.id, id));
  revalidatePath('/admin', 'layout');
}
