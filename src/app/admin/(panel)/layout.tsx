import { Suspense } from 'react';
import { requireAdmin } from '@/features/admin/auth';
import { logout } from '@/features/admin/auth-actions';
import { AdminShell } from '@/features/admin/components/admin-shell';
import { countUnhandledMessages } from '@/features/admin/queries';

async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const unhandledMessages = await countUnhandledMessages();
  return (
    <AdminShell user={user} unhandledMessages={unhandledMessages} logoutAction={logout}>
      {children}
    </AdminShell>
  );
}

// Pengecekan sesi memakai cookie (data runtime), jadi dibungkus Suspense. Setiap halaman dan
// Server Action tetap memanggil requireAdmin() sendiri.
export default function PanelLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-forest-deep" aria-busy="true" aria-label="Memuat" />
      }
    >
      <Shell>{children}</Shell>
    </Suspense>
  );
}
