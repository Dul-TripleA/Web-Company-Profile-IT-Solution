'use server';

import { and, eq, notInArray } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { categories, postTranslations, posts } from '@/lib/db/schema';
import { requireAdmin } from './auth';
import { POST_FIELDS, toPostRecords, validatePost } from './post-schema';
import type { AdminFormState } from './state';

const POSTS_TAG = 'posts';
const CHECK_FORM = 'Periksa kembali isian yang ditandai.';

function readValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(POST_FIELDS.map((field) => [field, String(formData.get(field) ?? '')]));
}

function errorCode(error: unknown): string | undefined {
  const value = (error as { code?: string; cause?: { code?: string } } | null) ?? {};
  return value.code ?? value.cause?.code;
}

/** Validasi + simpan artikel dan terjemahannya. Mengembalikan galat form, atau id artikel. */
async function save(
  id: string | null,
  formData: FormData,
): Promise<AdminFormState | { id: string; slug: string }> {
  const raw = readValues(formData);
  const { issues, values } = validatePost(raw);
  if (issues.length > 0) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of issues) fieldErrors[issue.field] ??= issue.message;
    return { fieldErrors, values: raw, message: CHECK_FORM };
  }

  const { post, translations } = toPostRecords(values);
  const db = getDb();

  try {
    if (post.categoryId) {
      const [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, post.categoryId));
      if (!category) {
        return {
          fieldErrors: { categoryId: 'Kategori tidak ditemukan' },
          values: raw,
          message: CHECK_FORM,
        };
      }
    }

    const postId = await db.transaction(async (tx) => {
      const [row] = id
        ? await tx
            .update(posts)
            .set({ ...post, updatedAt: new Date() })
            .where(eq(posts.id, id))
            .returning({ id: posts.id })
        : await tx.insert(posts).values(post).returning({ id: posts.id });
      if (!row) return null;

      for (const translation of translations) {
        await tx
          .insert(postTranslations)
          .values({ ...translation, postId: row.id })
          .onConflictDoUpdate({
            target: [postTranslations.postId, postTranslations.locale],
            set: translation,
          });
      }
      // Bahasa yang dikosongkan (mis. versi Inggris dihapus) ikut dihapus.
      await tx.delete(postTranslations).where(
        and(
          eq(postTranslations.postId, row.id),
          notInArray(
            postTranslations.locale,
            translations.map((item) => item.locale),
          ),
        ),
      );
      return row.id;
    });

    if (!postId) return { fieldErrors: {}, values: raw, message: 'Artikel tidak ditemukan.' };
    return { id: postId, slug: post.slug };
  } catch (error) {
    if (errorCode(error) === '23505') {
      return {
        fieldErrors: { slug: 'Slug sudah dipakai artikel lain' },
        values: raw,
        message: CHECK_FORM,
      };
    }
    console.error('savePost failed:', error instanceof Error ? error.name : 'unknown');
    return { fieldErrors: {}, values: raw, message: 'Gagal menyimpan. Coba lagi.' };
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
  return {
    saved: true,
    message: 'Perubahan tersimpan.',
    fieldErrors: {},
    values: { ...readValues(formData), slug: result.slug },
  };
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  await getDb().delete(posts).where(eq(posts.id, id));
  updateTag(POSTS_TAG);
  redirect('/admin/posts');
}
