import type { NavItem, NavLink } from './site-header';

export type NavContext = {
  pathname: string;
  homeHref: string;
  /** Section di beranda yang sedang dibaca (hasil gulir), atau null di area atas/tanpa section. */
  activeSection: string | null;
};

/** `page`: halaman yang sedang dibuka. `location`: section di dalam beranda. */
export type NavCurrent = 'page' | 'location' | null;

function hashOf(href: string): string | null {
  return href.includes('#') ? (href.split('#')[1] ?? null) : null;
}

function pathOf(href: string): string {
  return href.split('#')[0] ?? href;
}

function matchesPath(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function navLinkCurrent(link: NavLink, ctx: NavContext): NavCurrent {
  const hash = hashOf(link.href);
  if (hash) {
    return ctx.pathname === ctx.homeHref && ctx.activeSection === hash ? 'location' : null;
  }
  return ctx.pathname === link.href ? 'page' : null;
}

export function navItemCurrent(item: NavItem, ctx: NavContext): NavCurrent {
  const onHome = ctx.pathname === ctx.homeHref;

  if (onHome && ctx.activeSection && item.sections?.includes(ctx.activeSection)) return 'location';

  const base = item.activePrefix ?? (item.href ? pathOf(item.href) : undefined);
  if (base === ctx.homeHref) return onHome && ctx.activeSection === null ? 'page' : null;
  if (base && matchesPath(ctx.pathname, base)) return 'page';

  for (const child of item.children ?? []) {
    const current = navLinkCurrent(child, ctx);
    if (current) return current;
  }
  return null;
}

/** Id section di beranda yang dikaitkan dengan item menu (lewat `sections` atau tautan `#hash`). */
export function collectSectionIds(items: NavItem[]): string[] {
  const ids = new Set<string>();
  for (const item of items) {
    for (const id of item.sections ?? []) ids.add(id);
    for (const child of item.children ?? []) {
      const hash = hashOf(child.href);
      if (hash) ids.add(hash);
    }
  }
  return [...ids];
}

/**
 * Section yang aktif = yang paling akhir melewati garis baca. Setelah section terakhir terlewati
 * (mis. di footer) section itu tetap aktif; di atas section pertama hasilnya null.
 */
export function pickActiveSection(
  sections: { id: string; top: number }[],
  line: number,
): string | null {
  let active: { id: string; top: number } | null = null;
  for (const section of sections) {
    if (section.top <= line && (!active || section.top > active.top)) active = section;
  }
  return active?.id ?? null;
}
