import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { Markdown } from '@/components/shared/markdown';
import { requireAdmin } from '@/features/admin/auth';
import { FilterTabs } from '@/features/admin/components/filter-tabs';
import { PageHeader } from '@/features/admin/components/page-header';
import { CARD } from '@/features/admin/components/ui';
import { getPost } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Pratinjau artikel' };

const LANGUAGE_LABEL = { id: 'Indonesia', en: 'English' } as const;

// Memakai komponen Markdown yang sama dengan halaman publik, sehingga yang terlihat di sini
// sama dengan hasil terbit. Menampilkan draft, jadi hanya untuk admin.
export default async function PreviewPostPage({
  params,
  searchParams,
}: PageProps<'/admin/posts/[id]/preview'>) {
  await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [found, query] = await Promise.all([getPost(id), searchParams]);
  if (!found) notFound();

  const requested = query.lang === 'en' ? 'en' : 'id';
  const translation =
    found.translations.find((item) => item.locale === requested) ?? found.translations[0];
  if (!translation) notFound();

  return (
    <>
      <PageHeader
        title="Pratinjau"
        description="Tampilan isi seperti di situs. Belum tentu sudah terbit."
        back={{ href: `/admin/posts/${id}`, label: 'Kembali ke editor' }}
      />
      {found.translations.length > 1 ? (
        <div className="mb-5">
          <FilterTabs
            label="Bahasa pratinjau"
            tabs={found.translations.map((item) => ({
              href: `/admin/posts/${id}/preview?lang=${item.locale}`,
              label: LANGUAGE_LABEL[item.locale as 'id' | 'en'] ?? item.locale,
              active: item.locale === translation.locale,
            }))}
          />
        </div>
      ) : null}
      <article lang={translation.locale} className={`${CARD} mx-auto max-w-3xl sm:p-10`}>
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-forest">
          {translation.title}
        </h2>
        <p className="mb-6 text-slate-700">{translation.excerpt}</p>
        <Markdown>{translation.content}</Markdown>
      </article>
    </>
  );
}
