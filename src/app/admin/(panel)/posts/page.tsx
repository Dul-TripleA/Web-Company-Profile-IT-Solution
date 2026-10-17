import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/features/admin/auth';
import { BUTTON, CARD } from '@/features/admin/components/ui';
import { listPosts } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Artikel' };

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
});

function statusLabel(status: string, publishedAt: Date | null) {
  if (status === 'DRAFT') return 'Draft';
  return publishedAt && publishedAt.getTime() > Date.now() ? 'Terjadwal' : 'Terbit';
}

export default async function AdminPostsPage() {
  await requireAdmin();
  const rows = await listPosts();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-forest">Artikel</h1>
        <Link href="/admin/posts/new" className={BUTTON}>
          Artikel baru
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className={CARD}>Belum ada artikel.</p>
      ) : (
        <div className={`${CARD} overflow-x-auto p-0`}>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Daftar artikel</caption>
            <thead className="border-b border-slate-200 text-xs text-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Judul
                </th>
                <th scope="col" className="px-4 py-3">
                  Bahasa
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Terbit
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${row.id}`}
                      className="font-semibold text-forest hover:underline"
                    >
                      {row.title}
                    </Link>
                    <span className="block text-xs text-slate-700">/{row.slug}</span>
                  </td>
                  <td className="px-4 py-3">{row.locale}</td>
                  <td className="px-4 py-3">{statusLabel(row.status, row.publishedAt)}</td>
                  <td className="px-4 py-3">
                    {row.publishedAt ? dateFormat.format(row.publishedAt) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
