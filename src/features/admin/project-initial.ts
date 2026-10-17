import { SERVICES, getServiceCopy } from '@/content/services';
import { PROJECT_TRANSLATED_FIELDS } from './portfolio-schema';
import { ADMIN_LOCALES } from './post-schema';

type ProjectRow = {
  slug: string;
  serviceSlug: string;
  techStack: string[];
  sortOrder: number;
  status: string;
  isSample: boolean;
};
type TranslationRow = { locale: string } & Record<
  (typeof PROJECT_TRANSLATED_FIELDS)[number],
  string
>;

/** Nilai awal form proyek (nama field `<field>_<locale>`) dari baris database. */
export function projectFormValues(
  project: ProjectRow | null,
  translations: TranslationRow[],
  nextSortOrder = 0,
): Record<string, string> {
  const values: Record<string, string> = {
    slug: project?.slug ?? '',
    serviceSlug: project?.serviceSlug ?? '',
    techStack: project?.techStack.join(', ') ?? '',
    sortOrder: String(project?.sortOrder ?? nextSortOrder),
    published: project?.status === 'PUBLISHED' ? 'on' : '',
    isSample: project?.isSample ? 'on' : '',
  };
  for (const locale of ADMIN_LOCALES) {
    const translation = translations.find((item) => item.locale === locale);
    for (const field of PROJECT_TRANSLATED_FIELDS) {
      values[`${field}_${locale}`] = translation?.[field] ?? '';
    }
  }
  return values;
}

export function serviceOptions() {
  return SERVICES.map((service) => ({
    slug: service.slug,
    title: getServiceCopy(service, 'id').title,
  }));
}

export function serviceTitle(slug: string) {
  const service = SERVICES.find((item) => item.slug === slug);
  return service ? getServiceCopy(service, 'id').title : slug;
}
