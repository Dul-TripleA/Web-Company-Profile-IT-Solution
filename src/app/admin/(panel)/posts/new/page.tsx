import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/auth';
import { PostForm } from '@/features/admin/components/post-form';
import { CARD } from '@/features/admin/components/ui';
import { createPost } from '@/features/admin/post-actions';
import { listCategories } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Artikel baru' };

const EMPTY = {
  locale: 'id',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  coverAlt: '',
  status: 'DRAFT',
  publishedAt: '',
  authorName: 'Do It',
  categoryId: '',
  seoTitle: '',
  seoDescription: '',
};

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await listCategories();

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-forest">Artikel baru</h1>
      <div className={CARD}>
        <PostForm
          action={createPost}
          initial={EMPTY}
          categories={categories}
          submitLabel="Simpan artikel"
        />
      </div>
    </>
  );
}
