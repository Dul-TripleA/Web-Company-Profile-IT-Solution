'use cache';

import { and, count, desc, eq, lte, ne, sql } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import type { Locale } from '@/i18n/config';
import { getDb } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { POSTS_CACHE_TAG } from './constants';
import type { CategoryWithCount, Post, PostListPage, PostSummary } from './types';

// Semua fungsi di berkas ini ter-cache (use cache) dan memakai tag `posts`. Artikel baru yang
// ditambahkan langsung ke database (mis. lewat Drizzle Studio) muncul paling lambat setelah
// `revalidate` (5 menit); halaman yang memanggilnya tidak diprerender saat build (connection()).

/** Artikel terbit: status PUBLISHED dan tanggal terbit sudah lewat (tanggal depan = terjadwal). */
function publishedFilter(locale: Locale) {
  return and(
    eq(posts.locale, locale),
    eq(posts.status, 'PUBLISHED'),
    lte(posts.publishedAt, sql`now()`),
  );
}

const summaryColumns = {
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  coverImage: posts.coverImage,
  coverAlt: posts.coverAlt,
  publishedAt: posts.publishedAt,
  authorName: posts.authorName,
  categorySlug: categories.slug,
  categoryName: categories.name,
};

type SummaryRow = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string | null;
  publishedAt: Date | null;
  authorName: string;
  categorySlug: string | null;
  categoryName: string | null;
};

function toSummary(row: SummaryRow): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.coverImage,
    coverAlt: row.coverAlt,
    // published_at selalu terisi untuk artikel terbit (CHECK di database).
    publishedAt: (row.publishedAt ?? new Date(0)).toISOString(),
    authorName: row.authorName,
    category:
      row.categorySlug && row.categoryName
        ? { slug: row.categorySlug, name: row.categoryName }
        : null,
  };
}

export async function getPublishedPosts(
  locale: Locale,
  page: number,
  pageSize: number,
  categorySlug: string | null,
): Promise<PostListPage> {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const db = getDb();
  const filter = and(
    publishedFilter(locale),
    categorySlug ? eq(categories.slug, categorySlug) : undefined,
  );

  const [rows, totals] = await Promise.all([
    db
      .select(summaryColumns)
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(filter)
      .orderBy(desc(posts.publishedAt), desc(posts.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ total: count() })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(filter),
  ]);

  const total = totals[0]?.total ?? 0;
  return {
    posts: rows.map(toSummary),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getPublishedPostBySlug(locale: Locale, slug: string): Promise<Post | null> {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const [row] = await getDb()
    .select({
      ...summaryColumns,
      id: posts.id,
      content: posts.content,
      updatedAt: posts.updatedAt,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      categoryId: posts.categoryId,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(publishedFilter(locale), eq(posts.slug, slug)))
    .limit(1);
  if (!row) return null;

  return {
    ...toSummary(row),
    id: row.id,
    content: row.content,
    updatedAt: row.updatedAt.toISOString(),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    categoryId: row.categoryId,
  };
}

/** Artikel sekategori lebih dulu; bila kurang, dilengkapi artikel terbaru lainnya. */
export async function getRelatedPosts(
  locale: Locale,
  postId: string,
  categoryId: string | null,
  limit: number,
): Promise<PostSummary[]> {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const db = getDb();
  const base = () =>
    db.select(summaryColumns).from(posts).leftJoin(categories, eq(posts.categoryId, categories.id));

  const sameCategory = categoryId
    ? await base()
        .where(and(publishedFilter(locale), ne(posts.id, postId), eq(posts.categoryId, categoryId)))
        .orderBy(desc(posts.publishedAt), desc(posts.id))
        .limit(limit)
    : [];
  if (sameCategory.length >= limit) return sameCategory.map(toSummary);

  const taken = new Set(sameCategory.map((row) => row.slug));
  const latest = await base()
    .where(and(publishedFilter(locale), ne(posts.id, postId)))
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(limit);
  const filler = latest.filter((row) => !taken.has(row.slug)).slice(0, limit - sameCategory.length);
  return [...sameCategory, ...filler].map(toSummary);
}

/** Kategori yang punya minimal satu artikel terbit, untuk filter di daftar artikel. */
export async function getCategories(locale: Locale): Promise<CategoryWithCount[]> {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const rows = await getDb()
    .select({ slug: categories.slug, name: categories.name, total: count(posts.id) })
    .from(categories)
    .innerJoin(posts, eq(posts.categoryId, categories.id))
    .where(publishedFilter(locale))
    .groupBy(categories.id)
    .orderBy(categories.name);
  return rows.map((row) => ({ slug: row.slug, name: row.name, count: row.total }));
}

export async function getCategoryBySlug(locale: Locale, slug: string) {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const [row] = await getDb()
    .select({ slug: categories.slug, name: categories.name })
    .from(categories)
    .where(and(eq(categories.locale, locale), eq(categories.slug, slug)))
    .limit(1);
  return row ?? null;
}

/** Artikel terbaru untuk RSS. */
export async function getRecentPosts(locale: Locale, limit: number): Promise<PostSummary[]> {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const rows = await getDb()
    .select(summaryColumns)
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(publishedFilter(locale))
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(limit);
  return rows.map(toSummary);
}

/** Semua artikel dan kategori terbit di semua bahasa, untuk sitemap. */
export async function getSitemapEntries(): Promise<{
  posts: { locale: Locale; slug: string; updatedAt: string }[];
  categories: { locale: Locale; slug: string }[];
}> {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const db = getDb();
  const published = and(eq(posts.status, 'PUBLISHED'), lte(posts.publishedAt, sql`now()`));
  const [postRows, categoryRows] = await Promise.all([
    db
      .select({ locale: posts.locale, slug: posts.slug, updatedAt: posts.updatedAt })
      .from(posts)
      .where(published)
      .orderBy(desc(posts.publishedAt)),
    db
      .selectDistinct({ locale: categories.locale, slug: categories.slug })
      .from(categories)
      .innerJoin(posts, eq(posts.categoryId, categories.id))
      .where(published),
  ]);

  return {
    posts: postRows.map((row) => ({
      locale: row.locale as Locale,
      slug: row.slug,
      updatedAt: row.updatedAt.toISOString(),
    })),
    categories: categoryRows.map((row) => ({ locale: row.locale as Locale, slug: row.slug })),
  };
}
