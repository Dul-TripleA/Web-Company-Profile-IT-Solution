import type { Locale } from '@/i18n/config';

export type ProjectSummary = {
  slug: string;
  serviceSlug: string;
  techStack: string[];
  /** Proyek contoh (fiktif): berlabel "Contoh", tidak diindeks. */
  isSample: boolean;
  title: string;
  summary: string;
};

export type Project = ProjectSummary & {
  client: string;
  problem: string;
  solution: string;
  result: string;
  /** Bahasa yang punya terjemahan proyek ini (untuk hreflang). */
  locales: Locale[];
};
