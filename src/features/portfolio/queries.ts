'use cache';

import { and, asc, eq, sql } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import type { Locale } from '@/i18n/config';
import { getDb } from '@/lib/db';
import { portfolioProjects, portfolioTranslations } from '@/lib/db/schema';
import { PORTFOLIO_CACHE_TAG } from './constants';
import type { Project, ProjectSummary } from './types';

function cache() {
  cacheTag(PORTFOLIO_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
}

const published = eq(portfolioProjects.status, 'PUBLISHED');

function withTranslation(locale: Locale) {
  return and(
    eq(portfolioTranslations.projectId, portfolioProjects.id),
    eq(portfolioTranslations.locale, locale),
  );
}

const summaryColumns = {
  slug: portfolioProjects.slug,
  serviceSlug: portfolioProjects.serviceSlug,
  techStack: portfolioProjects.techStack,
  isSample: portfolioProjects.isSample,
  title: portfolioTranslations.title,
  summary: portfolioTranslations.summary,
};

/** Proyek terbit yang punya terjemahan di bahasa ini, urut sesuai `sort_order`. */
export async function getPublishedProjects(locale: Locale): Promise<ProjectSummary[]> {
  cache();
  return getDb()
    .select(summaryColumns)
    .from(portfolioProjects)
    .innerJoin(portfolioTranslations, withTranslation(locale))
    .where(published)
    .orderBy(asc(portfolioProjects.sortOrder), asc(portfolioProjects.createdAt));
}

export async function getPublishedProject(locale: Locale, slug: string): Promise<Project | null> {
  cache();
  const db = getDb();
  const [row] = await db
    .select({
      ...summaryColumns,
      id: portfolioProjects.id,
      client: portfolioTranslations.client,
      problem: portfolioTranslations.problem,
      solution: portfolioTranslations.solution,
      result: portfolioTranslations.result,
    })
    .from(portfolioProjects)
    .innerJoin(portfolioTranslations, withTranslation(locale))
    .where(and(published, eq(portfolioProjects.slug, slug)))
    .limit(1);
  if (!row) return null;

  const locales = await db
    .select({ locale: portfolioTranslations.locale })
    .from(portfolioTranslations)
    .where(eq(portfolioTranslations.projectId, row.id));
  return {
    slug: row.slug,
    serviceSlug: row.serviceSlug,
    techStack: row.techStack,
    isSample: row.isSample,
    title: row.title,
    summary: row.summary,
    client: row.client,
    problem: row.problem,
    solution: row.solution,
    result: row.result,
    locales: locales.map((item) => item.locale as Locale),
  };
}

/** Proyek nyata (bukan contoh) yang terbit, untuk sitemap. */
export async function getPortfolioSitemapEntries(): Promise<{ slug: string; locales: Locale[] }[]> {
  cache();
  const rows = await getDb()
    .select({
      slug: portfolioProjects.slug,
      locales: sql<
        string[]
      >`array_agg(${portfolioTranslations.locale} order by ${portfolioTranslations.locale} desc)`,
    })
    .from(portfolioProjects)
    .innerJoin(portfolioTranslations, eq(portfolioTranslations.projectId, portfolioProjects.id))
    .where(and(published, eq(portfolioProjects.isSample, false)))
    .groupBy(portfolioProjects.id);
  return rows.map((row) => ({ slug: row.slug, locales: row.locales as Locale[] }));
}
