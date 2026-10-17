import { z } from 'zod';

export const POST_FIELDS = [
  'locale',
  'title',
  'slug',
  'excerpt',
  'content',
  'coverImage',
  'coverAlt',
  'status',
  'publishedAt',
  'authorName',
  'categoryId',
  'seoTitle',
  'seoDescription',
] as const;

export type PostField = (typeof POST_FIELDS)[number];

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

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} maksimal ${max} karakter`);

export const postFormSchema = z
  .object({
    locale: z.enum(['id', 'en'], 'Pilih bahasa'),
    title: z
      .string()
      .trim()
      .min(3, 'Judul minimal 3 karakter')
      .max(160, 'Judul maksimal 160 karakter'),
    slug: optionalText(120, 'Slug'),
    excerpt: z
      .string()
      .trim()
      .min(10, 'Ringkasan minimal 10 karakter')
      .max(300, 'Ringkasan maksimal 300 karakter'),
    content: z.string().trim().min(1, 'Isi wajib diisi').max(100_000, 'Isi terlalu panjang'),
    coverImage: optionalText(500, 'URL cover'),
    coverAlt: optionalText(200, 'Teks alternatif'),
    status: z.enum(['DRAFT', 'PUBLISHED'], 'Pilih status'),
    publishedAt: z.string().trim(),
    authorName: z
      .string()
      .trim()
      .min(1, 'Penulis wajib diisi')
      .max(80, 'Penulis maksimal 80 karakter'),
    categoryId: z.string().trim(),
    seoTitle: optionalText(70, 'Judul SEO'),
    seoDescription: optionalText(160, 'Deskripsi SEO'),
  })
  .superRefine((data, ctx) => {
    const fail = (path: PostField, message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message });

    const slug = data.slug === '' ? slugify(data.title) : data.slug;
    if (!SLUG_PATTERN.test(slug)) fail('slug', 'Slug hanya huruf kecil, angka, dan tanda hubung');
    else if (RESERVED_SLUGS.includes(slug)) fail('slug', 'Slug ini dicadangkan untuk rute blog');

    if (data.coverImage !== '') {
      const isLocal = data.coverImage.startsWith('/') && !data.coverImage.startsWith('//');
      if (!isLocal && !URL.canParse(data.coverImage)) {
        fail('coverImage', 'Gunakan URL https atau path seperti /images/blog/a.jpg');
      } else if (!isLocal && new URL(data.coverImage).protocol !== 'https:') {
        fail('coverImage', 'URL cover harus https');
      }
      if (data.coverAlt === '') fail('coverAlt', 'Teks alternatif wajib bila ada cover');
    }

    if (data.publishedAt !== '' && !parseJakartaDateTime(data.publishedAt)) {
      fail('publishedAt', 'Tanggal tidak valid');
    }
    if (data.categoryId !== '' && !z.uuid().safeParse(data.categoryId).success) {
      fail('categoryId', 'Kategori tidak valid');
    }
  });

/** Data siap simpan: slug terisi, tanggal terbit dihitung, string kosong menjadi null. */
export function toPostValues(data: z.infer<typeof postFormSchema>, now = new Date()) {
  const publishedAt = parseJakartaDateTime(data.publishedAt);
  return {
    locale: data.locale,
    title: data.title,
    slug: data.slug === '' ? slugify(data.title) : data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage || null,
    coverAlt: data.coverImage ? data.coverAlt : null,
    status: data.status,
    publishedAt: data.status === 'PUBLISHED' ? (publishedAt ?? now) : publishedAt,
    authorName: data.authorName,
    categoryId: data.categoryId || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  };
}
