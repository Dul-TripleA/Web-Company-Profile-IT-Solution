import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/features/admin/auth';
import { PostForm } from '@/features/admin/components/post-form';
import { BUTTON_DANGER, BUTTON_SECONDARY, CARD } from '@/features/admin/components/ui';
import { deletePost, updatePost } from '@/features/admin/post-actions';
import { toJakartaInputValue } from '@/features/admin/post-schema';
import { getPost, listCategories } from '@/features/admin/queries';
import { localizedPath, type Locale } from '@/i18n/config';

export const metadata: Metadata = { title: 'Ubah artikel' };

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps<'/admin/posts/[id]'>) {
  await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [post, categories, query] = await Promise.all([
    getPost(id),
    listCategories(),
    searchParams,
  ]);
  if (!post) notFound();

  const publicHref = localizedPath(post.locale as Locale, `/blog/${post.slug}`);
  const initial = {
    locale: post.locale,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage ?? '',
    coverAlt: post.coverAlt ?? '',
    status: post.status,
    publishedAt: toJakartaInputValue(post.publishedAt),
    authorName: post.authorName,
    categoryId: post.categoryId ?? '',
    seoTitle: post.seoTitle ?? '',
    seoDescription: post.seoDescription ?? '',
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-forest">Ubah artikel</h1>
        <div className="flex flex-wrap gap-3">
          <Link href={`/admin/posts/${post.id}/preview`} className={BUTTON_SECONDARY}>
            Pratinjau
          </Link>
          {post.status === 'PUBLISHED' ? (
            <Link href={publicHref} target="_blank" className={BUTTON_SECONDARY}>
              Lihat di situs
            </Link>
          ) : null}
        </div>
      </div>

      <div className={CARD}>
        <PostForm
          action={updatePost.bind(null, post.id)}
          initial={initial}
          categories={categories}
          submitLabel="Simpan perubahan"
          savedNotice={query.saved === '1'}
        />
      </div>

      <details className={`${CARD} mt-6`}>
        <summary className="cursor-pointer text-sm font-semibold text-red-800">
          Hapus artikel
        </summary>
        <form action={deletePost.bind(null, post.id)} className="mt-4 space-y-3">
          <p className="text-sm text-slate-800">
            Artikel dihapus permanen dan tidak bisa dikembalikan.
          </p>
          <button type="submit" className={BUTTON_DANGER}>
            Ya, hapus permanen
          </button>
        </form>
      </details>
    </>
  );
}
