'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/button-link';
import { ChevronDownIcon, CloseIcon, MenuIcon } from '@/components/ui/icons';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';
import {
  collectSectionIds,
  navItemCurrent,
  navLinkCurrent,
  pickActiveSection,
  type NavContext,
} from './nav-active';

export type NavLink = { label: string; href: string };
export type NavItem = {
  id: string;
  label: string;
  href?: string;
  children?: NavLink[];
  /** false untuk tautan ke halaman yang belum ada, agar tidak memicu prefetch 404 di setiap halaman. */
  prefetch?: boolean;
  /** Item aktif untuk semua path berawalan ini (default: `href`), mis. `/id/services` mencakup detailnya. */
  activePrefix?: string;
  /** Id section di beranda yang membuat item ini aktif saat digulir ke sana. */
  sections?: string[];
};

type SiteHeaderProps = {
  locale: Locale;
  brand: string;
  homeHref: string;
  items: NavItem[];
  cta: NavLink;
  labels: { mainNavigation: string; openMenu: string; closeMenu: string; language: string };
};

// Tinggi top bar sebelum diukur di browser (satu baris, desktop).
const FALLBACK_TOP_BAR_HEIGHT = 32;
// Tinggi baris logo + tombol menu (py-5 + tombol 44px) di header.
const MOBILE_NAV_BAR_HEIGHT = 88;

const NAV_LINK =
  'relative py-1 transition-colors duration-200 hover:text-brand after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100';

export function SiteHeader({ locale, brand, homeHref, items, cta, labels }: SiteHeaderProps) {
  const pathname = usePathname();
  const [top, setTop] = useState(FALLBACK_TOP_BAR_HEIGHT);
  const [solid, setSolid] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Header menempel di bawah top bar, lalu naik ke atas dan menjadi solid setelah top bar tergulir.
  useEffect(() => {
    let frame = 0;
    function update() {
      const topBarHeight = document.getElementById('top-bar')?.offsetHeight ?? 0;
      const scrollY = window.scrollY;
      setSolid(scrollY >= topBarHeight);
      setTop(Math.max(topBarHeight - scrollY, 0));
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const isHome = pathname === homeHref;

  // Section beranda yang sedang dibaca; hanya dihitung di beranda.
  const sectionKey = collectSectionIds(items).join(',');
  const [scrollSection, setScrollSection] = useState<string | null>(null);
  useEffect(() => {
    if (!isHome || !sectionKey) return;
    const ids = sectionKey.split(',');
    let frame = 0;
    function update() {
      const sections = ids.flatMap((id) => {
        const element = document.getElementById(id);
        return element ? [{ id, top: element.getBoundingClientRect().top }] : [];
      });
      setScrollSection(pickActiveSection(sections, window.innerHeight * 0.4));
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome, sectionKey]);

  const navContext: NavContext = {
    pathname,
    homeHref,
    activeSection: isHome ? scrollSection : null,
  };

  function closeAll() {
    setOpenDropdown(null);
    setMobileOpen(false);
  }

  return (
    <header
      id="main-header"
      style={{ top }}
      className={cn(
        'fixed left-0 z-40 w-full text-white transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-in-out',
        solid || mobileOpen ? 'bg-forest/95 shadow-xl backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <nav
        aria-label={labels.mainNavigation}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 transition-all duration-500"
      >
        <Link href={homeHref} className="flex items-center" onClick={closeAll}>
          <Image
            src="/images/logo/logo-full.png"
            alt={brand}
            width={886}
            height={293}
            loading="eager"
            className="h-11 w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-200 lg:flex">
          {items.map((item) => {
            const current = navItemCurrent(item, navContext);
            if (!item.children) {
              return (
                <li key={item.id}>
                  <Link
                    href={item.href ?? homeHref}
                    prefetch={item.prefetch}
                    aria-current={current ?? undefined}
                    data-active={current ? 'true' : undefined}
                    className={current ? 'text-brand transition-colors duration-200' : NAV_LINK}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            const open = openDropdown === item.id;
            return (
              <li
                key={item.id}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.id)}
                onMouseLeave={() => setOpenDropdown(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null);
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenDropdown(open ? null : item.id)}
                  data-active={current ? 'true' : undefined}
                  className={cn(
                    'group flex cursor-pointer items-center gap-1.5 py-1 transition-colors duration-200 hover:text-brand',
                    current && 'text-brand',
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronDownIcon
                    className={cn(
                      'h-3.5 w-3.5 opacity-70 transition-all duration-300',
                      open && 'rotate-180 text-brand opacity-100',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'absolute top-full left-0 pt-3 transition-all duration-200',
                    open
                      ? 'visible translate-y-0 opacity-100'
                      : 'invisible translate-y-1 opacity-0',
                  )}
                >
                  <ul className="min-w-56 rounded-2xl border border-emerald-900/60 bg-forest-deep p-2 shadow-2xl">
                    {item.children.map((child) => {
                      const childCurrent = navLinkCurrent(child, navContext);
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeAll}
                            aria-current={childCurrent ?? undefined}
                            className={cn(
                              'block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-brand/10 hover:text-brand',
                              childCurrent ? 'bg-brand/10 text-brand' : 'text-slate-200',
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} label={labels.language} className="max-sm:hidden" />
          <ButtonLink href={cta.href} className="max-sm:hidden">
            {cta.label}
          </ButtonLink>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:text-brand lg:hidden"
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          id="mobile-menu"
          // Header menempel di bawah top bar (offset `top`), jadi tinggi panel dikurangi offset itu
          // ditambah tinggi baris logo (±88px) agar seluruh menu muat di layar dan bisa digulir.
          style={{ maxHeight: `calc(100dvh - ${top + MOBILE_NAV_BAR_HEIGHT}px)` }}
          className="overflow-y-auto border-t border-emerald-900/60 px-6 pb-6 lg:hidden"
        >
          <ul className="flex flex-col py-2 text-base font-medium text-slate-200">
            {items.map((item) => {
              const current = navItemCurrent(item, navContext);
              return (
                <li key={item.id} className="border-b border-emerald-900/40 py-3 last:border-b-0">
                  {item.children ? (
                    <>
                      <span
                        data-active={current ? 'true' : undefined}
                        className={cn(
                          'text-xs font-bold tracking-wider uppercase',
                          current ? 'text-brand' : 'text-slate-400',
                        )}
                      >
                        {item.label}
                      </span>
                      <ul className="mt-2 flex flex-col gap-1">
                        {item.children.map((child) => {
                          const childCurrent = navLinkCurrent(child, navContext);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={closeAll}
                                aria-current={childCurrent ?? undefined}
                                className={cn(
                                  'block py-1.5 text-sm hover:text-brand',
                                  childCurrent && 'text-brand',
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.href ?? homeHref}
                      prefetch={item.prefetch}
                      onClick={closeAll}
                      aria-current={current ?? undefined}
                      data-active={current ? 'true' : undefined}
                      className={cn('block hover:text-brand', current && 'text-brand')}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <LanguageSwitcher locale={locale} label={labels.language} />
            <ButtonLink href={cta.href} onClick={closeAll}>
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
