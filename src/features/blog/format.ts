import type { Locale } from '@/i18n/config';
import { absoluteUrl } from '@/lib/site';

/** Tanggal panjang menurut locale, selalu di zona Asia/Jakarta agar sama di server dan klien. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(
    new Date(iso),
  );
}

/** Mengisi `{name}` di templat teks dari kamus, mis. "{minutes} menit baca". */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** URL absolut untuk gambar (OG, JSON-LD): URL https dipakai apa adanya, path lokal ditambah domain situs. */
export function resolveImageUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return absoluteUrl(src.startsWith('/') ? src : `/${src}`);
}
