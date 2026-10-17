import { z } from 'zod';

export const ADMIN_LOCALES = ['id', 'en'] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];

/** Field yang berbeda per bahasa. Nama field di form: `<field>_<locale>`, mis. `title_en`. */
export const POST_TRANSLATED_FIELDS = [
  'title',
  'excerpt',
  'content',
  'coverAlt',
  'seoTitle',
  'seoDescription',
] as const;
export const POST_SHARED_FIELDS = [
  'slug',
  'coverImage',
  'published',
  'publishedAt',
  'authorName',
  'categoryId',
] as const;

export const POST_FIELDS = [
  ...POST_SHARED_FIELDS,
  ...ADMIN_LOCALES.flatMap((locale) => POST_TRANSLATED_FIELDS.map((field) => `${field}_${locale}`)),
];

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED_SLUGS = ['page', 'category'];

/** "Tips Cepat & Aman!" -> "tips-cepat-aman". */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/g, '');
}

/** Nilai `<input type="datetime-local">` dibaca sebagai waktu Jakarta (UTC+7, tanpa DST). */
export function parseJakartaDateTime(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+07:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Kebalikannya, untuk mengisi `<input type="datetime-local">`. */
export function toJakartaInputValue(date: Date | null): string {
  if (!date) return '';
  return new Date(date.getTime() + 7 * 3_600_000).toISOString().slice(0, 16);
}

/** Path lokal (`/images/...`) atau URL https. Dipakai juga oleh form portofolio. */
export function coverImageProblem(value: string): string | null {
  if (value === '') return null;
  const isLocal = value.startsWith('/') && !value.startsWith('//');
  if (isLocal) return null;
  if (!URL.canParse(value)) return 'Gunakan URL https atau path seperti /images/blog/a.jpg';
  if (new URL(value).protocol !== 'https:') return 'URL cover harus https';
  return null;
}

type Values = Record<string, string>;
type Issue = { field: string; message: string };

const LIMITS = {
  title: { min: 3, max: 160, label: 'Judul' },
  excerpt: { min: 10, max: 300, label: 'Ringkasan' },
  content: { min: 1, max: 100_000, label: 'Isi' },
  coverAlt: { min: 0, max: 200, label: 'Teks alternatif' },
  seoTitle: { min: 0, max: 70, label: 'Judul SEO' },
  seoDescription: { min: 0, max: 160, label: 'Deskripsi SEO' },
} as const;

/** Bahasa Inggris dianggap diisi bila salah satu kolom utamanya berisi. */
export function hasTranslation(values: Values, locale: AdminLocale): boolean {
  if (locale === 'id') return true;
  return ['title', 'excerpt', 'content'].some((field) =>
    (values[`${field}_${locale}`] ?? '').trim(),
  );
}

/**
 * Validasi form artikel. Bahasa Indonesia wajib; bahasa Inggris opsional, tetapi bila diisi
 * judul, ringkasan, dan isi harus lengkap.
 */
export function validatePost(raw: Values): { issues: Issue[]; values: Values } {
  const values: Values = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      key.startsWith('content_') ? value : value.trim(),
    ]),
  );
  const issues: Issue[] = [];
  const fail = (field: string, message: string) => issues.push({ field, message });

  for (const locale of ADMIN_LOCALES) {
    if (!hasTranslation(values, locale)) continue;
    for (const [field, limit] of Object.entries(LIMITS)) {
      const name = `${field}_${locale}`;
      const value = (values[name] ?? '').trim();
      if (limit.min > 0 && value.length < limit.min) {
        fail(
          name,
          limit.min === 1
            ? `${limit.label} wajib diisi`
            : `${limit.label} minimal ${limit.min} karakter`,
        );
      } else if (value.length > limit.max) {
        fail(name, `${limit.label} maksimal ${limit.max} karakter`);
      }
    }
  }

  const slug = values.slug ? values.slug.toLowerCase() : slugify(values.title_id ?? '');
  if (!SLUG_PATTERN.test(slug)) fail('slug', 'Slug hanya huruf kecil, angka, dan tanda hubung');
  else if (RESERVED_SLUGS.includes(slug)) fail('slug', 'Slug ini dicadangkan untuk rute blog');
  else if (slug.length > 120) fail('slug', 'Slug maksimal 120 karakter');

  const cover = coverImageProblem(values.coverImage ?? '');
  if (cover) fail('coverImage', cover);
  if (values.coverImage && !values.coverAlt_id) {
    fail('coverAlt_id', 'Teks alternatif wajib bila ada cover');
  }

  if (values.publishedAt && !parseJakartaDateTime(values.publishedAt)) {
    fail('publishedAt', 'Tanggal tidak valid');
  }
  const author = values.authorName ?? '';
  if (!author) fail('authorName', 'Penulis wajib diisi');
  else if (author.length > 80) fail('authorName', 'Penulis maksimal 80 karakter');
  if (values.categoryId && !z.uuid().safeParse(values.categoryId).success) {
    fail('categoryId', 'Kategori tidak valid');
  }

  return { issues, values: { ...values, slug } };
}

/** Data siap simpan: baris `posts` dan terjemahan yang diisi. */
export function toPostRecords(values: Values, now = new Date()) {
  const published = values.published === 'on';
  const publishedAt = parseJakartaDateTime(values.publishedAt ?? '');
  const post = {
    slug: values.slug ?? '',
    coverImage: values.coverImage || null,
    status: published ? ('PUBLISHED' as const) : ('DRAFT' as const),
    publishedAt: published ? (publishedAt ?? now) : publishedAt,
    authorName: values.authorName ?? '',
    categoryId: values.categoryId || null,
  };
  const translations = ADMIN_LOCALES.filter((locale) => hasTranslation(values, locale)).map(
    (locale) => ({
      locale,
      title: values[`title_${locale}`] ?? '',
      excerpt: values[`excerpt_${locale}`] ?? '',
      content: values[`content_${locale}`] ?? '',
      coverAlt: post.coverImage ? values[`coverAlt_${locale}`] || null : null,
      seoTitle: values[`seoTitle_${locale}`] || null,
      seoDescription: values[`seoDescription_${locale}`] || null,
    }),
  );
  return { post, translations };
}
