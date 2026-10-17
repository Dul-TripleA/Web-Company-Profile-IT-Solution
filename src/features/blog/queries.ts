'use cache';

import { and, count, desc, eq, lte, ne, sql } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import type { Locale } from '@/i18n/config';
import { getDb } from '@/lib/db';
import { categories, categoryTranslations, postTranslations, posts } from '@/lib/db/schema';
import { POSTS_CACHE_TAG } from './constants';
import type { CategoryWithCount, Post, PostListPage, PostSummary } from './types';

// Semua fungsi di berkas ini ter-cache (use cache) dan memakai tag `posts`. Perubahan dari admin
// memanggil updateTag('posts'); halaman yang memanggilnya tidak diprerender saat build (connection()).
//
// Satu artikel = baris `posts` + terjemahan per bahasa. Artikel tampil di /<locale> hanya bila
// punya terjemahan di bahasa itu. Nama kategori memakai terjemahan bahasa itu, atau bahasa
// Indonesia bila belum ada.

function cache() {
  cacheTag(POSTS_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
}

/** Artikel terbit: status PUBLISHED dan tanggal terbit sudah lewat (tanggal depan = terjadwal). */
const published = and(eq(posts.status, 'PUBLISHED'), lte(posts.publishedAt, sql`now()`));

/** Nama kategori dalam bahasa diminta, atau bahasa Indonesia sebagai cadangan. */
function categoryName(locale: Locale) {
  return sql<string | null>`coalesce(
    (select ${categoryTranslations.name} from ${categoryTranslations}
      where ${categoryTranslations.categoryId} = ${categories.id} and ${categoryTranslations.locale} = ${locale}),
    (select ${categoryTranslations.name} from ${categoryTranslations}
      where ${categoryTranslations.categoryId} = ${categories.id} and ${categoryTranslations.locale} = 'id')
  )`;
}

function summaryColumns(locale: Locale) {
  return {
    slug: posts.slug,
    title: postTranslations.title,
    excerpt: postTranslations.excerpt,
    coverImage: posts.coverImage,
    coverAlt: postTranslations.coverAlt,
    publishedAt: posts.publishedAt,
    authorName: posts.authorName,
    categorySlug: categories.slug,
    categoryName: categoryName(locale),
  };
}

/** posts + terjemahan bahasa diminta (inner join: tanpa terjemahan berarti tidak tampil) + kategori. */
function fromPosts(locale: Locale) {
  return getDb()
    .select(summaryColumns(locale))
    .from(posts)
    .innerJoin(
      postTranslations,
      and(eq(postTranslations.postId, posts.id), eq(postTranslations.locale, locale)),
    )
    .leftJoin(categories, eq(posts.categoryId, categories.id));
}

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
  cache();
  const filter = and(published, categorySlug ? eq(categories.slug, categorySlug) : undefined);

  const [rows, totals] = await Promise.all([
    fromPosts(locale)
      .where(filter)
      .orderBy(desc(posts.publishedAt), desc(posts.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    getDb()
      .select({ total: count() })
      .from(posts)
      .innerJoin(
        postTranslations,
        and(eq(postTranslations.postId, posts.id), eq(postTranslations.locale, locale)),
      )
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
  cache();
  const db = getDb();

  const [row] = await db
    .select({
      ...summaryColumns(locale),
      id: posts.id,
      content: postTranslations.content,
      updatedAt: posts.updatedAt,
      seoTitle: postTranslations.seoTitle,
      seoDescription: postTranslations.seoDescription,
      categoryId: posts.categoryId,
    })
    .from(posts)
    .innerJoin(
      postTranslations,
      and(eq(postTranslations.postId, posts.id), eq(postTranslations.locale, locale)),
    )
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(published, eq(posts.slug, slug)))
    .limit(1);
  if (!row) return null;

  const locales = await db
    .select({ locale: postTranslations.locale })
    .from(postTranslations)
    .where(eq(postTranslations.postId, row.id));

  return {
    ...toSummary(row),
    id: row.id,
    content: row.content,
    updatedAt: row.updatedAt.toISOString(),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    categoryId: row.categoryId,
    locales: locales.map((item) => item.locale as Locale),
  };
}

/** Artikel sekategori lebih dulu; bila kurang, dilengkapi artikel terbaru lainnya. */
export async function getRelatedPosts(
  locale: Locale,
  postId: string,
  categoryId: string | null,
  limit: number,
): Promise<PostSummary[]> {
  cache();

  const sameCategory = categoryId
    ? await fromPosts(locale)
        .where(and(published, ne(posts.id, postId), eq(posts.categoryId, categoryId)))
        .orderBy(desc(posts.publishedAt), desc(posts.id))
        .limit(limit)
    : [];
  if (sameCategory.length >= limit) return sameCategory.map(toSummary);

  const taken = new Set(sameCategory.map((row) => row.slug));
  const latest = await fromPosts(locale)
    .where(and(published, ne(posts.id, postId)))
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(limit);
  const filler = latest.filter((row) => !taken.has(row.slug)).slice(0, limit - sameCategory.length);
  return [...sameCategory, ...filler].map(toSummary);
}

/** Kategori yang punya minimal satu artikel terbit di bahasa ini, untuk filter di daftar artikel. */
export async function getCategories(locale: Locale): Promise<CategoryWithCount[]> {
  cache();

  const name = categoryName(locale);
  const rows = await getDb()
    .select({ slug: categories.slug, name, total: count(posts.id) })
    .from(categories)
    .innerJoin(posts, eq(posts.categoryId, categories.id))
    .innerJoin(
      postTranslations,
      and(eq(postTranslations.postId, posts.id), eq(postTranslations.locale, locale)),
    )
    .where(published)
    .groupBy(categories.id)
    .orderBy(name);
  return rows.flatMap((row) =>
    row.name ? [{ slug: row.slug, name: row.name, count: row.total }] : [],
  );
}

export async function getCategoryBySlug(locale: Locale, slug: string) {
  cache();

  const [row] = await getDb()
    .select({ slug: categories.slug, name: categoryName(locale) })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return row?.name ? { slug: row.slug, name: row.name } : null;
}

/** Artikel terbaru untuk RSS. */
export async function getRecentPosts(locale: Locale, limit: number): Promise<PostSummary[]> {
  cache();

  const rows = await fromPosts(locale)
    .where(published)
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(limit);
  return rows.map(toSummary);
}

/** Semua artikel terbit beserta bahasa yang tersedia, dan kategori yang dipakai, untuk sitemap. */
export async function getSitemapEntries(): Promise<{
  posts: { slug: string; locales: Locale[]; updatedAt: string }[];
  categories: { slug: string; locales: Locale[] }[];
}> {
  cache();

  const db = getDb();
  const [postRows, categoryRows] = await Promise.all([
    db
      .select({
        slug: posts.slug,
        updatedAt: posts.updatedAt,
        locales: sql<
          string[]
        >`array_agg(${postTranslations.locale} order by ${postTranslations.locale} desc)`,
      })
      .from(posts)
      .innerJoin(postTranslations, eq(postTranslations.postId, posts.id))
      .where(published)
      .groupBy(posts.id)
      .orderBy(desc(posts.publishedAt)),
    db
      .select({
        slug: categories.slug,
        locales: sql<string[]>`array_agg(distinct ${postTranslations.locale})`,
      })
      .from(categories)
      .innerJoin(posts, eq(posts.categoryId, categories.id))
      .innerJoin(postTranslations, eq(postTranslations.postId, posts.id))
      .where(published)
      .groupBy(categories.id),
  ]);

  return {
    posts: postRows.map((row) => ({
      slug: row.slug,
      locales: row.locales as Locale[],
      updatedAt: row.updatedAt.toISOString(),
    })),
    categories: categoryRows.map((row) => ({ slug: row.slug, locales: row.locales as Locale[] })),
  };
}
