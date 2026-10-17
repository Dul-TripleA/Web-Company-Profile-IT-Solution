import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/auth';
import { PageHeader } from '@/features/admin/components/page-header';
import { PostForm } from '@/features/admin/components/post-form';
import { createPost } from '@/features/admin/post-actions';
import { categoryLabel, postFormValues } from '@/features/admin/post-initial';
import { listCategories } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Artikel baru' };

export default async function NewPostPage() {
  const user = await requireAdmin();
  const categories = await listCategories();

  return (
    <>
      <PageHeader
        title="Artikel baru"
        description="Simpan sebagai draft dulu bila belum siap terbit."
        back={{ href: '/admin/posts', label: 'Semua artikel' }}
      />
      <PostForm
        action={createPost}
        initial={postFormValues(null, [], user.firstName)}
        categories={categories.map((category) => ({
          id: category.id,
          label: categoryLabel(category),
        }))}
        submitLabel="Simpan artikel"
      />
    </>
  );
}
