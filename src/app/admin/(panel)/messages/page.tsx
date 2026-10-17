import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/features/admin/auth';
import { BUTTON_SECONDARY, CARD } from '@/features/admin/components/ui';
import { setMessageHandled } from '@/features/admin/other-actions';
import { MESSAGES_PAGE_SIZE, listMessages } from '@/features/admin/queries';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Pesan' };

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
});

export default async function AdminMessagesPage({ searchParams }: PageProps<'/admin/messages'>) {
  await requireAdmin();
  const query = await searchParams;
  const pageValue = Array.isArray(query.page) ? query.page[0] : query.page;
  const page = parsePageParam(pageValue ?? '1') ?? 1;

  const { rows, total } = await listMessages(page);
  const pageCount = Math.max(1, Math.ceil(total / MESSAGES_PAGE_SIZE));

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-forest">Pesan kontak</h1>

      {rows.length === 0 ? (
        <p className={CARD}>Belum ada pesan.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.id} className={CARD}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-forest">{row.name}</p>
                  <p className="text-sm text-slate-800">
                    <a href={`mailto:${row.email}`} className="underline">
                      {row.email}
                    </a>
                    {row.phone ? ` · ${row.phone}` : ''}
                    {row.service ? ` · ${row.service}` : ''}
                  </p>
                  <p className="text-xs text-slate-700">{dateFormat.format(row.createdAt)}</p>
                </div>
                <form action={setMessageHandled.bind(null, row.id, !row.handled)}>
                  <button type="submit" className={BUTTON_SECONDARY}>
                    {row.handled ? 'Tandai belum ditangani' : 'Tandai sudah ditangani'}
                  </button>
                </form>
              </div>
              <p className="mt-3 text-sm whitespace-pre-wrap text-slate-900">{row.message}</p>
              <p className="mt-3 text-xs font-semibold text-slate-800">
                {row.handled ? 'Sudah ditangani' : 'Belum ditangani'}
              </p>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 ? (
        <nav aria-label="Halaman pesan" className="mt-6 flex items-center gap-4 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/messages?page=${page - 1}`}
              className="font-semibold text-forest underline"
            >
              Sebelumnya
            </Link>
          ) : null}
          <span>
            Halaman {page} dari {pageCount}
          </span>
          {page < pageCount ? (
            <Link
              href={`/admin/messages?page=${page + 1}`}
              className="font-semibold text-forest underline"
            >
              Berikutnya
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
