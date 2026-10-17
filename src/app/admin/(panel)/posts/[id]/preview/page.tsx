import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { Markdown } from '@/components/shared/markdown';
import { requireAdmin } from '@/features/admin/auth';
import { CARD } from '@/features/admin/components/ui';
import { getPost } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Pratinjau artikel' };

// Memakai komponen Markdown yang sama dengan halaman publik, sehingga yang terlihat di sini
// sama dengan hasil terbit. Menampilkan draft, jadi hanya untuk admin.
export default async function PreviewPostPage({ params }: PageProps<'/admin/posts/[id]/preview'>) {
  await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <>
      <p className="mb-4 text-sm">
        <Link
          href={`/admin/posts/${post.id}`}
          className="font-semibold text-forest hover:underline"
        >
          Kembali ke editor
        </Link>
      </p>
      <article className={`${CARD} mx-auto max-w-3xl`}>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-forest">{post.title}</h1>
        <p className="mb-6 text-slate-800">{post.excerpt}</p>
        <Markdown>{post.content}</Markdown>
      </article>
    </>
  );
}
