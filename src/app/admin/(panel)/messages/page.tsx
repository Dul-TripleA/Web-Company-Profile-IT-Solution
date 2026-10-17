import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/features/admin/auth';
import { FilterTabs } from '@/features/admin/components/filter-tabs';
import { CheckIcon, MailIcon } from '@/features/admin/components/icons';
import { PageHeader } from '@/features/admin/components/page-header';
import { MessageStatusPill } from '@/features/admin/components/status-pill';
import { BUTTON, BUTTON_SECONDARY, CARD } from '@/features/admin/components/ui';
import { setMessageHandled } from '@/features/admin/other-actions';
import { MESSAGES_PAGE_SIZE, countUnhandledMessages, listMessages } from '@/features/admin/queries';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Pesan' };

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
});

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

export default async function AdminMessagesPage({ searchParams }: PageProps<'/admin/messages'>) {
  await requireAdmin();
  const query = await searchParams;
  const onlyUnhandled = first(query.filter) === 'unhandled';
  const page = parsePageParam(first(query.page) || '1') ?? 1;

  const [{ rows, total }, unhandled] = await Promise.all([
    listMessages(page, onlyUnhandled),
    countUnhandledMessages(),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / MESSAGES_PAGE_SIZE));
  const base = onlyUnhandled ? '/admin/messages?filter=unhandled&' : '/admin/messages?';

  return (
    <>
      <PageHeader
        title="Pesan kontak"
        description="Pesan dari form kontak situs. Balas lewat email, lalu tandai sudah ditangani."
      />

      <div className="mb-5">
        <FilterTabs
          label="Filter pesan"
          tabs={[
            { href: '/admin/messages', label: 'Semua', active: !onlyUnhandled },
            {
              href: '/admin/messages?filter=unhandled',
              label: 'Belum ditangani',
              active: onlyUnhandled,
              count: unhandled,
            },
          ]}
        />
      </div>

      {rows.length === 0 ? (
        <p className={`${CARD} text-sm text-slate-700`}>
          {onlyUnhandled ? 'Semua pesan sudah ditangani.' : 'Belum ada pesan.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className={`${CARD} ${row.handled ? '' : 'border-l-4 border-l-brand-strong'}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-900">{row.name}</h2>
                    <MessageStatusPill handled={row.handled} />
                  </div>
                  <p className="mt-1 text-sm break-words text-slate-700">
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ''}
                    {row.service ? ` · ${row.service}` : ''}
                  </p>
                  <p className="text-xs text-slate-600">{dateFormat.format(row.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`mailto:${row.email}`} className={BUTTON_SECONDARY}>
                    <MailIcon className="h-4 w-4" />
                    Balas
                  </a>
                  <form action={setMessageHandled.bind(null, row.id, !row.handled)}>
                    <button type="submit" className={row.handled ? BUTTON_SECONDARY : BUTTON}>
                      {row.handled ? null : <CheckIcon className="h-4 w-4" />}
                      {row.handled ? 'Tandai belum ditangani' : 'Tandai sudah ditangani'}
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm whitespace-pre-wrap text-slate-900">
                {row.message}
              </p>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 ? (
        <nav
          aria-label="Halaman pesan"
          className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm"
        >
          {page > 1 ? (
            <Link href={`${base}page=${page - 1}`} className={BUTTON_SECONDARY}>
              Sebelumnya
            </Link>
          ) : (
            <span />
          )}
          <span className="text-slate-700">
            Halaman {page} dari {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={`${base}page=${page + 1}`} className={BUTTON_SECONDARY}>
              Berikutnya
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  );
}
