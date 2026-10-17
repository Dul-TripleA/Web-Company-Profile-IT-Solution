import type { Metadata } from 'next';
import { DEFAULT_LOCALE, LOCALES, localizedPath, type Locale } from '@/i18n/config';
import { absoluteUrl } from '@/lib/site';

const OG_LOCALE: Record<Locale, string> = { id: 'id_ID', en: 'en_US' };
const SITE_NAME = 'Do It';
const MAX_DESCRIPTION = 160;
/** Gambar OG bawaan (1200x630) di public/; dipakai bila halaman tidak memberi gambar sendiri. */
export const DEFAULT_OG_IMAGE = '/og-default.png';

export function truncate(text: string, max = MAX_DESCRIPTION): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

type BuildMetadataInput = {
  locale: Locale;
  /** Path tanpa prefiks locale, mis. `/services`. `/` untuk beranda. */
  path?: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
  image?: string;
  /**
   * false untuk halaman yang hanya ada di satu bahasa (mis. artikel): tanpa hreflang dan
   * alternateLocale supaya tidak menunjuk ke halaman yang tidak ada.
   */
  translations?: boolean;
  /** Tanggal ISO untuk `type: 'article'`. */
  publishedTime?: string;
  modifiedTime?: string;
  /** URL umpan RSS yang diiklankan di <head>. */
  rssUrl?: string;
  /** true untuk halaman contoh/placeholder yang belum boleh diindeks. */
  noindex?: boolean;
};

export function buildMetadata({
  locale,
  path = '/',
  title,
  description,
  type = 'website',
  image,
  translations = true,
  publishedTime,
  modifiedTime,
  rssUrl,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((item) => [item, absoluteUrl(localizedPath(item, path))]),
  );
  languages['x-default'] = absoluteUrl(localizedPath(DEFAULT_LOCALE, path));
  const summary = truncate(description);
  const imageUrl = image ?? absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description: summary,
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: url,
      ...(translations ? { languages } : {}),
      ...(rssUrl ? { types: { 'application/rss+xml': rssUrl } } : {}),
    },
    openGraph: {
      type,
      url,
      title,
      description: summary,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      ...(translations
        ? {
            alternateLocale: LOCALES.filter((item) => item !== locale).map(
              (item) => OG_LOCALE[item],
            ),
          }
        : {}),
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: summary,
      images: [imageUrl],
    },
  };
}
