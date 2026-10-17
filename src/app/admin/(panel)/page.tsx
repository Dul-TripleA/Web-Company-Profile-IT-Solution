import Link from 'next/link';
import { requireAdmin } from '@/features/admin/auth';
import { CARD } from '@/features/admin/components/ui';
import { getDashboardCounts } from '@/features/admin/queries';

export default async function AdminDashboardPage() {
  await requireAdmin();
  const counts = await getDashboardCounts();

  const items = [
    { label: 'Artikel terbit', value: counts.published, href: '/admin/posts' },
    { label: 'Draft', value: counts.drafts, href: '/admin/posts' },
    { label: 'Pesan belum ditangani', value: counts.unhandledMessages, href: '/admin/messages' },
  ];

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-forest">Ringkasan</h1>
      <ul className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.label} className={CARD}>
            <Link href={item.href} className="block hover:underline">
              <span className="block text-3xl font-extrabold text-forest">{item.value}</span>
              <span className="text-sm text-slate-800">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
