import { SITE } from '@/content/site';
import { localizedPath, type Locale } from '@/i18n/config';
import { SITE_URL, absoluteUrl } from '@/lib/site';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.legalName,
    url: SITE_URL,
    email: SITE.email,
    telephone: SITE.phone,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: absoluteUrl(localizedPath(locale)),
    inLanguage: locale,
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(locale: Locale, items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

export function serviceJsonLd(
  locale: Locale,
  service: { name: string; description: string; path: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: absoluteUrl(localizedPath(locale, service.path)),
    inLanguage: locale,
    provider: { '@type': 'Organization', name: SITE.legalName, url: SITE_URL },
  };
}
