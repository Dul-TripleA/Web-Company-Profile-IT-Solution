import { describe, expect, it } from 'vitest';
import {
  collectSectionIds,
  navItemCurrent,
  navLinkCurrent,
  pickActiveSection,
  type NavContext,
} from './nav-active';
import type { NavItem } from './site-header';

const HOME = '/id';

const home: NavItem = { id: 'home', label: 'Beranda', href: HOME };
const about: NavItem = { id: 'about', label: 'Tentang', href: '/id/about' };
const pages: NavItem = {
  id: 'pages',
  label: 'Halaman',
  children: [
    { label: 'Teknologi', href: '/id#technology' },
    { label: 'Alur', href: '/id#workflow' },
  ],
};
const services: NavItem = {
  id: 'services',
  label: 'Layanan',
  activePrefix: '/id/services',
  sections: ['services'],
  children: [
    { label: 'Web', href: '/id/services/web-development' },
    { label: 'Semua', href: '/id/services' },
  ],
};
const contact: NavItem = { id: 'contact', label: 'Kontak', href: '/id/contact' };

function ctx(pathname: string, activeSection: string | null = null): NavContext {
  return { pathname, homeHref: HOME, activeSection };
}

describe('navItemCurrent', () => {
  it('Beranda aktif di beranda bila tidak ada section yang dibaca', () => {
    expect(navItemCurrent(home, ctx('/id'))).toBe('page');
  });

  it('Beranda tidak aktif saat section lain sedang dibaca atau di halaman lain', () => {
    expect(navItemCurrent(home, ctx('/id', 'services'))).toBeNull();
    expect(navItemCurrent(home, ctx('/id/about'))).toBeNull();
  });

  it('item halaman aktif di path-nya', () => {
    expect(navItemCurrent(about, ctx('/id/about'))).toBe('page');
    expect(navItemCurrent(about, ctx('/id'))).toBeNull();
    expect(navItemCurrent(contact, ctx('/id/contact'))).toBe('page');
  });

  it('awalan path tidak cocok dengan path yang kebetulan berawalan sama', () => {
    expect(navItemCurrent(about, ctx('/id/about-us'))).toBeNull();
  });

  it('Layanan aktif di /services dan detailnya', () => {
    expect(navItemCurrent(services, ctx('/id/services'))).toBe('page');
    expect(navItemCurrent(services, ctx('/id/services/ui-ux-design'))).toBe('page');
  });

  it('Layanan aktif saat section #services di beranda dibaca', () => {
    expect(navItemCurrent(services, ctx('/id', 'services'))).toBe('location');
    expect(navItemCurrent(services, ctx('/id', 'workflow'))).toBeNull();
  });

  it('Halaman aktif lewat tautan #hash anaknya', () => {
    expect(navItemCurrent(pages, ctx('/id', 'technology'))).toBe('location');
    expect(navItemCurrent(pages, ctx('/id', 'workflow'))).toBe('location');
    expect(navItemCurrent(pages, ctx('/id'))).toBeNull();
    expect(navItemCurrent(pages, ctx('/id/about', 'workflow'))).toBeNull();
  });
});

describe('navLinkCurrent', () => {
  it('tautan #hash aktif hanya di beranda saat section-nya dibaca', () => {
    const link = { label: 'x', href: '/id#workflow' };
    expect(navLinkCurrent(link, ctx('/id', 'workflow'))).toBe('location');
    expect(navLinkCurrent(link, ctx('/id', 'technology'))).toBeNull();
    expect(navLinkCurrent(link, ctx('/en', 'workflow'))).toBeNull();
  });

  it('tautan halaman aktif hanya pada path yang persis sama', () => {
    const link = { label: 'x', href: '/id/services' };
    expect(navLinkCurrent(link, ctx('/id/services'))).toBe('page');
    expect(navLinkCurrent(link, ctx('/id/services/web-development'))).toBeNull();
  });
});

describe('collectSectionIds', () => {
  it('mengumpulkan id dari `sections` dan tautan #hash tanpa duplikat', () => {
    expect(collectSectionIds([home, about, pages, services, contact]).sort()).toEqual([
      'services',
      'technology',
      'workflow',
    ]);
  });
});

describe('pickActiveSection', () => {
  const sections = [
    { id: 'services', top: 900 },
    { id: 'technology', top: 1700 },
    { id: 'workflow', top: 2300 },
  ];

  it('null di atas section pertama', () => {
    expect(pickActiveSection(sections, 400)).toBeNull();
  });

  it('memilih section terakhir yang melewati garis baca', () => {
    expect(pickActiveSection(sections, 1000)).toBe('services');
    expect(pickActiveSection(sections, 1800)).toBe('technology');
  });

  it('tetap pada section terakhir setelah semuanya terlewati', () => {
    expect(pickActiveSection(sections, 99999)).toBe('workflow');
  });

  it('tidak bergantung pada urutan array', () => {
    expect(pickActiveSection([...sections].reverse(), 1800)).toBe('technology');
  });
});
