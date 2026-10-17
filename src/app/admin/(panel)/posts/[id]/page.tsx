import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/features/admin/auth';
import { ConfirmButton } from '@/features/admin/components/form-controls';
import { ExternalIcon, EyeIcon, TrashIcon } from '@/features/admin/components/icons';
import { PageHeader } from '@/features/admin/components/page-header';
import { PostForm } from '@/features/admin/components/post-form';
import { PostStatusPill, postState } from '@/features/admin/components/status-pill';
import { BUTTON_DANGER, BUTTON_SECONDARY } from '@/features/admin/components/ui';
import { deletePost, updatePost } from '@/features/admin/post-actions';
import { categoryLabel, postFormValues } from '@/features/admin/post-initial';
import { getPost, listCategories } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Ubah artikel' };

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps<'/admin/posts/[id]'>) {
  const user = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [found, categories, query] = await Promise.all([
    getPost(id),
    listCategories(),
    searchParams,
  ]);
  if (!found) notFound();
  const { post, translations } = found;

  const state = postState(post.status, post.publishedAt);
  const title = translations.find((item) => item.locale === 'id')?.title ?? post.slug;
  const viewLocale = translations.some((item) => item.locale === 'id') ? 'id' : 'en';

  return (
    <>
      <PageHeader
        title="Ubah artikel"
        description={title}
        back={{ href: '/admin/posts', label: 'Semua artikel' }}
        actions={
          <>
            <PostStatusPill state={state} />
            <Link href={`/admin/posts/${post.id}/preview`} className={BUTTON_SECONDARY}>
              <EyeIcon className="h-4 w-4" />
              Pratinjau
            </Link>
            {state === 'published' ? (
              <a
                href={`/${viewLocale}/blog/${post.slug}`}
                target="_blank"
                rel="noopener"
                className={BUTTON_SECONDARY}
              >
                <ExternalIcon className="h-4 w-4" />
                Lihat di situs
              </a>
            ) : null}
            <form action={deletePost.bind(null, post.id)}>
              <ConfirmButton
                message={`Hapus artikel "${title}" secara permanen? Bila hanya ingin menyembunyikan, matikan "Terbitkan di situs".`}
                className={BUTTON_DANGER}
              >
                <TrashIcon className="h-4 w-4" />
                Hapus
              </ConfirmButton>
            </form>
          </>
        }
      />

      <PostForm
        action={updatePost.bind(null, post.id)}
        initial={postFormValues(post, translations, user.firstName)}
        categories={categories.map((category) => ({
          id: category.id,
          label: categoryLabel(category),
        }))}
        submitLabel="Simpan perubahan"
        savedNotice={query.saved === '1'}
      />
    </>
  );
}
