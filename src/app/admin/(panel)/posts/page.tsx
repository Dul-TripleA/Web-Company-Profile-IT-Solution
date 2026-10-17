import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/features/admin/auth';
import { FilterTabs } from '@/features/admin/components/filter-tabs';
import { LanguageFlags } from '@/features/admin/components/flag';
import { PlusIcon, SearchIcon } from '@/features/admin/components/icons';
import { PageHeader } from '@/features/admin/components/page-header';
import { RowActions } from '@/features/admin/components/row-actions';
import { PostStatusPill, postState } from '@/features/admin/components/status-pill';
import { BUTTON, BUTTON_SECONDARY, CARD, INPUT } from '@/features/admin/components/ui';
import { deletePost } from '@/features/admin/post-actions';
import { listPosts, type PostFilter } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Artikel' };

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeZone: 'Asia/Jakarta',
});

const FILTER_TABS: { value: PostFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'published', label: 'Terbit' },
  { value: 'scheduled', label: 'Terjadwal' },
  { value: 'draft', label: 'Draft' },
];

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

export default async function AdminPostsPage({ searchParams }: PageProps<'/admin/posts'>) {
  await requireAdmin();
  const params = await searchParams;
  const statusParam = first(params.status);
  const filter = FILTER_TABS.some((tab) => tab.value === statusParam)
    ? (statusParam as PostFilter)
    : 'all';
  const query = first(params.q).slice(0, 100);
  const rows = await listPosts({ filter, query });

  const hrefFor = (status: PostFilter) => {
    const search = new URLSearchParams();
    if (status !== 'all') search.set('status', status);
    if (query) search.set('q', query);
    const text = search.toString();
    return text ? `/admin/posts?${text}` : '/admin/posts';
  };

  const items = rows.map((row) => {
    const state = postState(row.status, row.publishedAt);
    const viewLocale = row.locales.includes('id') ? 'id' : row.locales[0];
    return {
      ...row,
      state,
      actions: (labels: 'always' | 'wide') => (
        <RowActions
          labels={labels}
          name={row.title}
          editHref={`/admin/posts/${row.id}`}
          previewHref={`/admin/posts/${row.id}/preview`}
          viewHref={
            state === 'published' && viewLocale ? `/${viewLocale}/blog/${row.slug}` : undefined
          }
          deleteAction={deletePost.bind(null, row.id)}
          deleteMessage={`Hapus artikel "${row.title}" secara permanen?`}
        />
      ),
    };
  });

  return (
    <>
      <PageHeader
        title="Artikel"
        description="Tulis, jadwalkan, dan terbitkan artikel blog dalam dua bahasa."
        actions={
          <Link href="/admin/posts/new" className={BUTTON}>
            <PlusIcon className="h-4 w-4" />
            Artikel baru
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          label="Filter status artikel"
          tabs={FILTER_TABS.map((tab) => ({
            href: hrefFor(tab.value),
            label: tab.label,
            active: tab.value === filter,
          }))}
        />
        <form role="search" action="/admin/posts" className="flex gap-2 lg:w-80">
          {filter !== 'all' ? <input type="hidden" name="status" value={filter} /> : null}
          <label htmlFor="post-search" className="sr-only">
            Cari judul atau slug
          </label>
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="post-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Cari judul atau slug"
              className={`${INPUT} pl-9`}
            />
          </div>
          <button type="submit" className={BUTTON_SECONDARY}>
            Cari
          </button>
        </form>
      </div>

      {items.length === 0 ? (
        <div className={`${CARD} text-center`}>
          <p className="text-sm text-slate-700">
            {query || filter !== 'all'
              ? 'Tidak ada artikel yang cocok dengan filter ini.'
              : 'Belum ada artikel.'}
          </p>
          {query || filter !== 'all' ? (
            <Link
              href="/admin/posts"
              className="mt-2 inline-block text-sm font-semibold text-forest underline"
            >
              Hapus filter
            </Link>
          ) : null}
        </div>
      ) : (
        <>
          {/* Desktop: tabel. */}
          <div className={`${CARD} hidden p-0 sm:p-0 md:block`}>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Daftar artikel</caption>
              <thead className="text-xs text-slate-600">
                <tr>
                  <th scope="col" className="px-6 pt-5 pb-3 font-semibold">
                    Judul
                  </th>
                  <th scope="col" className="px-3 pt-5 pb-3 font-semibold">
                    Bahasa
                  </th>
                  <th scope="col" className="px-3 pt-5 pb-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-3 pt-5 pb-3 font-semibold">
                    Tanggal terbit
                  </th>
                  <th scope="col" className="px-6 pt-5 pb-3 text-right font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="max-w-md px-6 py-4">
                      <Link
                        href={`/admin/posts/${row.id}`}
                        className="font-semibold text-slate-900 hover:text-forest hover:underline"
                      >
                        {row.title}
                      </Link>
                      <span className="block truncate text-xs text-slate-600">/{row.slug}</span>
                    </td>
                    <td className="px-3 py-4">
                      <LanguageFlags locales={row.locales} />
                    </td>
                    <td className="px-3 py-4">
                      <PostStatusPill state={row.state} />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-slate-700">
                      {row.publishedAt ? dateFormat.format(row.publishedAt) : '-'}
                    </td>
                    <td className="px-6 py-4">{row.actions('wide')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ponsel: kartu dengan aksi di bawah. */}
          <ul className="space-y-3 md:hidden">
            {items.map((row) => (
              <li key={row.id} className={CARD}>
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/posts/${row.id}`} className="font-semibold text-slate-900">
                    {row.title}
                  </Link>
                  <PostStatusPill state={row.state} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <LanguageFlags locales={row.locales} />
                  <span>
                    {row.publishedAt ? dateFormat.format(row.publishedAt) : 'belum terbit'}
                  </span>
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">{row.actions('always')}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
