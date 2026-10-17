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
    // DISEMBUNYIKAN (nomor telepon masih dummy, 2026-10): telephone: SITE.phone,
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

export function blogPostingJsonLd(
  locale: Locale,
  post: {
    slug: string;
    title: string;
    description: string;
    image: string;
    publishedAt: string;
    updatedAt: string;
    authorName: string;
  },
) {
  const url = absoluteUrl(localizedPath(locale, `/blog/${post.slug}`));
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: locale,
    mainEntityOfPage: url,
    url,
    author: {
      '@type': post.authorName === SITE.name ? 'Organization' : 'Person',
      name: post.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.legalName,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/images/logo/logo-full.png') },
    },
  };
}
