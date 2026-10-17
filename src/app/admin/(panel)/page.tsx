import Link from 'next/link';
import { requireAdmin } from '@/features/admin/auth';
import { ArrowLeftIcon, PlusIcon } from '@/features/admin/components/icons';
import { PageHeader } from '@/features/admin/components/page-header';
import { PostStatusPill, postState } from '@/features/admin/components/status-pill';
import { BUTTON, CARD, CARD_TITLE } from '@/features/admin/components/ui';
import { getDashboardCounts, listMessages, listPosts } from '@/features/admin/queries';

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
});

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
    >
      {label}
      <ArrowLeftIcon className="h-4 w-4 rotate-180" />
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const [counts, recentPosts, recentMessages] = await Promise.all([
    getDashboardCounts(),
    listPosts({ limit: 5 }),
    listMessages(1, true, 5),
  ]);

  return (
    <>
      <PageHeader
        title="Ringkasan"
        description={`Halo, ${user.firstName}. Ini keadaan situs hari ini.`}
        actions={
          <Link href="/admin/posts/new" className={BUTTON}>
            <PlusIcon className="h-4 w-4" />
            Artikel baru
          </Link>
        }
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <li>
          <Link
            href="/admin/posts?status=published"
            className="block h-full rounded-2xl bg-forest-deep p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:p-6"
          >
            <span className="text-xs font-medium text-slate-300">Artikel terbit</span>
            <span className="mt-2 block text-4xl font-extrabold">{counts.published}</span>
            <span className="mt-2 block text-xs text-brand">Tampil di blog</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/posts?status=scheduled"
            className={`${CARD} block h-full transition-transform hover:-translate-y-0.5`}
          >
            <span className="text-xs font-medium text-slate-600">Terjadwal</span>
            <span className="mt-2 block text-4xl font-extrabold text-slate-900">
              {counts.scheduled}
            </span>
            <span className="mt-2 block text-xs text-slate-600">
              Terbit otomatis sesuai tanggal
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/posts?status=draft"
            className={`${CARD} block h-full transition-transform hover:-translate-y-0.5`}
          >
            <span className="text-xs font-medium text-slate-600">Draft</span>
            <span className="mt-2 block text-4xl font-extrabold text-slate-900">
              {counts.drafts}
            </span>
            <span className="mt-2 block text-xs text-slate-600">Belum tampil di situs</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/messages"
            className="block h-full rounded-2xl bg-admin-mint p-5 shadow-sm transition-transform hover:-translate-y-0.5 sm:p-6"
          >
            <span className="text-xs font-medium text-forest">Pesan belum ditangani</span>
            <span className="mt-2 block text-4xl font-extrabold text-forest-deep">
              {counts.unhandledMessages}
            </span>
            <span className="mt-2 block text-xs text-forest">Dari form kontak</span>
          </Link>
        </li>
      </ul>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className={CARD} aria-labelledby="recent-posts">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="recent-posts" className={CARD_TITLE}>
              Artikel terakhir diubah
            </h2>
            <SeeAll href="/admin/posts" label="Semua" />
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-slate-600">
              Belum ada artikel.{' '}
              <Link href="/admin/posts/new" className="font-semibold text-forest underline">
                Tulis yang pertama
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg py-3 hover:bg-slate-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {post.title}
                      </span>
                      <span className="text-xs text-slate-600">
                        diubah {dateFormat.format(post.updatedAt)}
                      </span>
                    </span>
                    <PostStatusPill state={postState(post.status, post.publishedAt)} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={CARD} aria-labelledby="recent-messages">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="recent-messages" className={CARD_TITLE}>
              Pesan menunggu
            </h2>
            <SeeAll href="/admin/messages" label="Buka inbox" />
          </div>
          {recentMessages.rows.length === 0 ? (
            <p className="text-sm text-slate-600">Semua pesan sudah ditangani.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentMessages.rows.map((message) => (
                <li key={message.id} className="py-3">
                  <p className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold text-slate-900">{message.name}</span>
                    <span className="shrink-0 text-xs text-slate-600">
                      {dateFormat.format(message.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-700">{message.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
