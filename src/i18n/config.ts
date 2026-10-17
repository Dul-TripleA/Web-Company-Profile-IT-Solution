export const LOCALES = ['id', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'id';

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Path internal dengan prefiks locale. `localizedPath('en', '/blog')` -> `/en/blog`. */
export function localizedPath(locale: Locale, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}
