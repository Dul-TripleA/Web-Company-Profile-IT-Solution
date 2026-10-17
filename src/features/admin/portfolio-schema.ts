import { SERVICES } from '@/content/services';
import { ADMIN_LOCALES, type AdminLocale } from './post-schema';

/** Field per bahasa; nama di form `<field>_<locale>`. */
export const PROJECT_TRANSLATED_FIELDS = [
  'title',
  'summary',
  'client',
  'problem',
  'solution',
  'result',
] as const;
export const PROJECT_SHARED_FIELDS = [
  'slug',
  'serviceSlug',
  'techStack',
  'sortOrder',
  'published',
  'isSample',
] as const;

export const PROJECT_FIELDS = [
  ...PROJECT_SHARED_FIELDS,
  ...ADMIN_LOCALES.flatMap((locale) =>
    PROJECT_TRANSLATED_FIELDS.map((field) => `${field}_${locale}`),
  ),
];

const LIMITS: Record<
  (typeof PROJECT_TRANSLATED_FIELDS)[number],
  { min: number; max: number; label: string }
> = {
  title: { min: 3, max: 120, label: 'Judul' },
  summary: { min: 10, max: 160, label: 'Ringkasan' },
  client: { min: 2, max: 120, label: 'Klien' },
  problem: { min: 10, max: 1500, label: 'Masalah' },
  solution: { min: 10, max: 1500, label: 'Solusi' },
  result: { min: 10, max: 1500, label: 'Hasil' },
};

type Values = Record<string, string>;

export function hasProjectTranslation(values: Values, locale: AdminLocale): boolean {
  if (locale === 'id') return true;
  return PROJECT_TRANSLATED_FIELDS.some((field) => (values[`${field}_${locale}`] ?? '').trim());
}

/** "Next.js, Tailwind CSS ,  ,PostgreSQL" -> ["Next.js", "Tailwind CSS", "PostgreSQL"]. */
export function parseTechStack(value: string): string[] {
  return [
    ...new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

/** Bahasa Indonesia wajib; bahasa Inggris opsional, tetapi bila diisi harus lengkap. */
export function validateProject(raw: Values) {
  const values: Values = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, value.trim()]),
  );
  const issues: { field: string; message: string }[] = [];
  const fail = (field: string, message: string) => issues.push({ field, message });

  for (const locale of ADMIN_LOCALES) {
    if (!hasProjectTranslation(values, locale)) continue;
    for (const field of PROJECT_TRANSLATED_FIELDS) {
      const limit = LIMITS[field];
      const name = `${field}_${locale}`;
      const length = (values[name] ?? '').length;
      if (length < limit.min) fail(name, `${limit.label} minimal ${limit.min} karakter`);
      else if (length > limit.max) fail(name, `${limit.label} maksimal ${limit.max} karakter`);
    }
  }

  const slug = (values.slug ?? '').toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 100) {
    fail('slug', 'Slug hanya huruf kecil, angka, dan tanda hubung');
  }
  if (!SERVICES.some((service) => service.slug === values.serviceSlug)) {
    fail('serviceSlug', 'Pilih layanan');
  }
  const techStack = parseTechStack(values.techStack ?? '');
  if (techStack.length === 0) fail('techStack', 'Isi minimal satu teknologi');
  if (techStack.length > 12 || techStack.some((item) => item.length > 40)) {
    fail('techStack', 'Maksimal 12 teknologi, masing-masing 40 karakter');
  }
  const sortOrder = Number(values.sortOrder || '0');
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 999) {
    fail('sortOrder', 'Urutan berupa angka 0-999');
  }

  return {
    issues,
    project: {
      slug,
      serviceSlug: values.serviceSlug ?? '',
      techStack,
      sortOrder,
      status: values.published === 'on' ? ('PUBLISHED' as const) : ('DRAFT' as const),
      isSample: values.isSample === 'on',
    },
    translations: ADMIN_LOCALES.filter((locale) => hasProjectTranslation(values, locale)).map(
      (locale) => ({
        locale,
        title: values[`title_${locale}`] ?? '',
        summary: values[`summary_${locale}`] ?? '',
        client: values[`client_${locale}`] ?? '',
        problem: values[`problem_${locale}`] ?? '',
        solution: values[`solution_${locale}`] ?? '',
        result: values[`result_${locale}`] ?? '',
      }),
    ),
  };
}
