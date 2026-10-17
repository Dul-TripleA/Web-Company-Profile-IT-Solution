'use server';

import { and, eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { requireAdmin } from './auth';
import { POST_FIELDS, postFormSchema, toPostValues } from './post-schema';
import type { AdminFormState } from './state';

const POSTS_TAG = 'posts';

function readValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(POST_FIELDS.map((field) => [field, String(formData.get(field) ?? '')]));
}

function errorCode(error: unknown): string | undefined {
  const code = (error as { code?: string; cause?: { code?: string } } | null) ?? {};
  return code.code ?? code.cause?.code;
}

/** Validasi + simpan. Mengembalikan galat form, atau id artikel bila berhasil. */
async function save(
  id: string | null,
  formData: FormData,
): Promise<AdminFormState | { id: string }> {
  const values = readValues(formData);
  const parsed = postFormSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      fieldErrors[field] ??= issue.message;
    }
    return { fieldErrors, values, message: 'Periksa kembali isian yang ditandai.' };
  }

  const data = toPostValues(parsed.data);
  const db = getDb();

  try {
    if (data.categoryId) {
      const [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(and(eq(categories.id, data.categoryId), eq(categories.locale, data.locale)));
      if (!category) {
        return {
          fieldErrors: { categoryId: 'Kategori tidak ada atau bahasanya berbeda' },
          values,
          message: 'Periksa kembali isian yang ditandai.',
        };
      }
    }

    if (id) {
      const [row] = await db
        .update(posts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning({ id: posts.id });
      if (!row) return { fieldErrors: {}, values, message: 'Artikel tidak ditemukan.' };
      return { id: row.id };
    }

    const [row] = await db.insert(posts).values(data).returning({ id: posts.id });
    if (!row) throw new Error('insert returned no row');
    return { id: row.id };
  } catch (error) {
    if (errorCode(error) === '23505') {
      return {
        fieldErrors: { slug: 'Slug sudah dipakai artikel lain pada bahasa ini' },
        values,
        message: 'Periksa kembali isian yang ditandai.',
      };
    }
    console.error('savePost failed:', error instanceof Error ? error.name : 'unknown');
    return { fieldErrors: {}, values, message: 'Gagal menyimpan. Coba lagi.' };
  }
}

export async function createPost(_previous: AdminFormState, formData: FormData) {
  await requireAdmin();
  const result = await save(null, formData);
  if (!('id' in result)) return result;
  updateTag(POSTS_TAG);
  redirect(`/admin/posts/${result.id}?saved=1`);
}

export async function updatePost(id: string, _previous: AdminFormState, formData: FormData) {
  await requireAdmin();
  const result = await save(id, formData);
  if (!('id' in result)) return result;
  updateTag(POSTS_TAG);
  return { saved: true, message: 'Tersimpan.', fieldErrors: {}, values: readValues(formData) };
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  await getDb().delete(posts).where(eq(posts.id, id));
  updateTag(POSTS_TAG);
  redirect('/admin/posts');
}
