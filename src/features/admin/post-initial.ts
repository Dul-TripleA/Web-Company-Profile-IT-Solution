import { ADMIN_LOCALES, POST_TRANSLATED_FIELDS, toJakartaInputValue } from './post-schema';

type PostRow = {
  slug: string;
  coverImage: string | null;
  status: string;
  publishedAt: Date | null;
  authorName: string;
  categoryId: string | null;
};
type TranslationRow = { locale: string } & Record<
  (typeof POST_TRANSLATED_FIELDS)[number],
  string | null
>;

/** Nilai awal form artikel (nama field `<field>_<locale>`) dari baris database. */
export function postFormValues(
  post: PostRow | null,
  translations: TranslationRow[],
  authorName: string,
): Record<string, string> {
  const values: Record<string, string> = {
    slug: post?.slug ?? '',
    coverImage: post?.coverImage ?? '',
    published: post?.status === 'PUBLISHED' ? 'on' : '',
    publishedAt: toJakartaInputValue(post?.publishedAt ?? null),
    authorName: post?.authorName ?? authorName,
    categoryId: post?.categoryId ?? '',
  };
  for (const locale of ADMIN_LOCALES) {
    const translation = translations.find((item) => item.locale === locale);
    for (const field of POST_TRANSLATED_FIELDS) {
      values[`${field}_${locale}`] = translation?.[field] ?? '';
    }
  }
  return values;
}

/** Label kategori untuk pilihan: "Teknologi · Technology". */
export function categoryLabel(category: {
  slug: string;
  nameId: string | null;
  nameEn: string | null;
}) {
  const id = category.nameId ?? category.slug;
  return category.nameEn && category.nameEn !== id ? `${id} · ${category.nameEn}` : id;
}
