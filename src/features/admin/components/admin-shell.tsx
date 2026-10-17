'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  BriefcaseIcon,
  CloseIcon,
  DashboardIcon,
  DocumentIcon,
  ExternalIcon,
  InboxIcon,
  LogoutIcon,
  MenuIcon,
  TagIcon,
} from './icons';

type AdminShellProps = {
  user: { firstName: string; username: string };
  unhandledMessages: number;
  logoutAction: () => Promise<void>;
  children: ReactNode;
};

const NAV = [
  { href: '/admin', label: 'Ringkasan', icon: DashboardIcon, exact: true },
  { href: '/admin/posts', label: 'Artikel', icon: DocumentIcon },
  { href: '/admin/categories', label: 'Kategori', icon: TagIcon },
  { href: '/admin/portfolio', label: 'Portofolio', icon: BriefcaseIcon },
  { href: '/admin/messages', label: 'Pesan', icon: InboxIcon, badge: true },
];

function Sidebar({
  user,
  unhandledMessages,
  logoutAction,
  pathname,
}: Omit<AdminShellProps, 'children'> & { pathname: string }) {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6 text-slate-300">
      <Link href="/admin" className="flex items-center gap-2 px-2">
        <Image
          src="/images/logo/logo-full.png"
          alt="Do It"
          width={886}
          height={293}
          className="h-8 w-auto"
        />
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-200">
          Admin
        </span>
      </Link>

      <nav aria-label="Navigasi admin" className="flex-1">
        <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-wider text-slate-400 uppercase">
          Navigasi
        </p>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-brand' : ''}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && unhandledMessages > 0 ? (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[0.7rem] font-bold text-forest-deep">
                      {unhandledMessages}
                      <span className="sr-only"> pesan belum ditangani</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 mb-2 px-3 text-[0.65rem] font-semibold tracking-wider text-slate-400 uppercase">
          Situs
        </p>
        <a
          href="/id"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/5 hover:text-white"
        >
          <ExternalIcon />
          Lihat situs
        </a>
      </nav>

      <div className="rounded-2xl bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-forest-deep"
          >
            {user.firstName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.firstName}</p>
            <p className="truncate text-xs text-slate-400">@{user.username}</p>
          </div>
        </div>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/15 transition-colors hover:bg-white/10 pointer-coarse:min-h-11"
          >
            <LogoutIcon className="h-4 w-4" />
            Keluar
          </button>
        </form>
      </div>
    </div>
  );
}

/** Kerangka admin: sidebar tetap di desktop, laci (drawer) di layar kecil. */
export function AdminShell({ user, unhandledMessages, logoutAction, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Laci tertutup saat pindah halaman.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const sidebarProps = { user, unhandledMessages, logoutAction, pathname };

  return (
    <div className="min-h-screen bg-forest-deep lg:flex">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-full bg-brand px-4 py-2 text-sm font-bold text-forest-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Lewati ke konten
      </a>

      {/* Desktop: sidebar tetap. */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar {...sidebarProps} />
        </div>
      </aside>

      {/* Ponsel/tablet: bilah atas + laci. */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-forest-deep px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/logo/logo-full.png"
            alt="Do It"
            width={886}
            height={293}
            className="h-7 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-drawer"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white ring-1 ring-white/20 hover:bg-white/10"
        >
          <MenuIcon />
          <span className="sr-only">Buka menu</span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden" id="admin-drawer">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu admin"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-forest-deep shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10"
              autoFocus
            >
              <CloseIcon />
              <span className="sr-only">Tutup menu</span>
            </button>
            <Sidebar {...sidebarProps} />
          </div>
        </div>
      ) : null}

      <main
        id="admin-main"
        className="min-h-screen min-w-0 flex-1 bg-admin-canvas px-4 py-6 sm:px-6 lg:my-3 lg:mr-3 lg:min-h-[calc(100vh-1.5rem)] lg:rounded-3xl lg:px-10 lg:py-8"
      >
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
