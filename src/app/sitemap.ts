import type { MetadataRoute } from 'next';
import { SERVICES } from '@/content/services';
import { DEFAULT_LOCALE, LOCALES, localizedPath } from '@/i18n/config';
import { absoluteUrl } from '@/lib/site';

const STATIC_PATHS = ['/', '/about', '/services', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...SERVICES.map((service) => `/services/${service.slug}`)];

  return paths.flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(
      LOCALES.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]),
    );
    languages['x-default'] = absoluteUrl(localizedPath(DEFAULT_LOCALE, path));

    return LOCALES.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      alternates: { languages },
      priority: path === '/' ? 1 : 0.7,
    }));
  });
}
