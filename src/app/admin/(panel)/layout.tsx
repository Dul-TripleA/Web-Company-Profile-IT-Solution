import Link from 'next/link';
import { Suspense } from 'react';
import { requireAdmin } from '@/features/admin/auth';
import { logout } from '@/features/admin/auth-actions';
import { BUTTON_SECONDARY } from '@/features/admin/components/ui';

const NAV = [
  { href: '/admin', label: 'Ringkasan' },
  { href: '/admin/posts', label: 'Artikel' },
  { href: '/admin/categories', label: 'Kategori' },
  { href: '/admin/messages', label: 'Pesan' },
];

async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <span className="text-sm font-extrabold text-forest">Do It Admin</span>
          <nav aria-label="Navigasi admin" className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 text-sm font-semibold text-slate-800 hover:text-forest hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="text-sm text-slate-800">Halo, {user.firstName}</span>
          <form action={logout}>
            <button type="submit" className={BUTTON_SECONDARY}>
              Keluar
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}

// Pengecekan sesi memakai cookie (data runtime), jadi dibungkus Suspense. Setiap halaman dan
// Server Action tetap memanggil requireAdmin() sendiri.
export default function PanelLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-slate-700">Memuat...</p>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
