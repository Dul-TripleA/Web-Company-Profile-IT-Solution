import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader, type NavItem } from '@/components/layout/site-header';
import { SiteHeaderFallback } from '@/components/layout/site-header-fallback';
import { TopBar } from '@/components/layout/top-bar';
import { JsonLd } from '@/components/shared/json-ld';
import { SERVICES, getServiceCopy } from '@/content/services';
import { SITE } from '@/content/site';
import { LOCALES, hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import '../globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const homeHref = localizedPath(locale);
  const navItems: NavItem[] = [
    { id: 'home', label: dict.nav.home, href: homeHref },
    { id: 'about', label: dict.nav.about, href: localizedPath(locale, '/about') },
    {
      id: 'pages',
      label: dict.nav.pages,
      children: [
        { label: dict.nav.technology, href: `${homeHref}#technology` },
        { label: dict.nav.workflow, href: `${homeHref}#workflow` },
        // DISEMBUNYIKAN (section Reviews disembunyikan, 2026-10): { label: dict.nav.reviews, href: `${homeHref}#reviews` },
      ],
    },
    {
      id: 'services',
      label: dict.nav.services,
      // Aktif di /services dan detailnya, serta saat section #services di beranda sedang dibaca.
      activePrefix: localizedPath(locale, '/services'),
      sections: ['services'],
      children: [
        ...SERVICES.map((service) => ({
          label: getServiceCopy(service, locale).title,
          href: localizedPath(locale, `/services/${service.slug}`),
        })),
        { label: dict.nav.allServices, href: localizedPath(locale, '/services') },
      ],
    },
    { id: 'portfolio', label: dict.nav.portfolio, href: localizedPath(locale, '/portfolio') },
    { id: 'blog', label: dict.nav.blog, href: localizedPath(locale, '/blog') },
    { id: 'contact', label: dict.nav.contact, href: localizedPath(locale, '/contact') },
  ];

  return (
    <html lang={locale} className={plusJakartaSans.variable}>
      <body suppressHydrationWarning={true}>
        {/* Tanpa JavaScript animasi tidak berjalan; tampilkan semua konten Reveal apa adanya. */}
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <a
          href="#main-content"
          className="sr-only z-[60] rounded-full bg-brand px-4 py-2 text-sm font-bold text-forest focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.nav.skipToContent}
        </a>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd(locale)} />
        <TopBar dict={dict.topBar} />
        {/* Suspense: SiteHeader membaca pathname, yang baru diketahui saat request di rute dinamis (mis. /blog/[slug]). */}
        <Suspense fallback={<SiteHeaderFallback brand={SITE.name} homeHref={homeHref} />}>
          <SiteHeader
            locale={locale}
            brand={SITE.name}
            homeHref={homeHref}
            items={navItems}
            cta={{ label: dict.common.freeConsultation, href: localizedPath(locale, '/contact') }}
            labels={{
              mainNavigation: dict.nav.mainNavigation,
              openMenu: dict.nav.openMenu,
              closeMenu: dict.nav.closeMenu,
              language: dict.nav.language,
            }}
          />
        </Suspense>
        <main id="main-content">{children}</main>
        <SiteFooter locale={locale} dict={dict.footer} />
      </body>
    </html>
  );
}
