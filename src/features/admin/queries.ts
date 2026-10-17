import 'server-only';
import { and, asc, count, desc, eq, gt, ilike, lte, or, sql, type SQL } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import {
  categories,
  categoryTranslations,
  contactMessages,
  portfolioProjects,
  portfolioTranslations,
  postTranslations,
  posts,
} from '@/lib/db/schema';

export const MESSAGES_PAGE_SIZE = 20;

export type PostFilter = 'all' | 'published' | 'scheduled' | 'draft';

// Terbit = PUBLISHED dan tanggalnya sudah lewat; terjadwal = PUBLISHED dengan tanggal di depan.
const FILTERS: Record<PostFilter, SQL | undefined> = {
  all: undefined,
  published: and(eq(posts.status, 'PUBLISHED'), lte(posts.publishedAt, sql`now()`)),
  scheduled: and(eq(posts.status, 'PUBLISHED'), gt(posts.publishedAt, sql`now()`)),
  draft: eq(posts.status, 'DRAFT'),
};

export async function getDashboardCounts() {
  const db = getDb();
  const total = (where: SQL | undefined) => db.select({ total: count() }).from(posts).where(where);
  const [published, scheduled, drafts, unhandled] = await Promise.all([
    total(FILTERS.published),
    total(FILTERS.scheduled),
    total(FILTERS.draft),
    db.select({ total: count() }).from(contactMessages).where(eq(contactMessages.handled, false)),
  ]);
  return {
    published: published[0]?.total ?? 0,
    scheduled: scheduled[0]?.total ?? 0,
    drafts: drafts[0]?.total ?? 0,
    unhandledMessages: unhandled[0]?.total ?? 0,
  };
}

export async function countUnhandledMessages() {
  const [row] = await getDb()
    .select({ total: count() })
    .from(contactMessages)
    .where(eq(contactMessages.handled, false));
  return row?.total ?? 0;
}

/** `%` dan `_` di kata kunci dicari apa adanya, bukan sebagai wildcard. */
function likePattern(query: string) {
  return `%${query.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

/** Judul dalam bahasa Indonesia (atau bahasa lain bila belum ada) dan daftar bahasa yang terisi. */
const postTitle = sql<string>`coalesce(
  (select ${postTranslations.title} from ${postTranslations}
    where ${postTranslations.postId} = ${posts.id} and ${postTranslations.locale} = 'id'),
  (select ${postTranslations.title} from ${postTranslations}
    where ${postTranslations.postId} = ${posts.id} limit 1),
  ${posts.slug}
)`;
const postLocales = sql<string[]>`coalesce(
  (select array_agg(${postTranslations.locale} order by ${postTranslations.locale} desc)
    from ${postTranslations} where ${postTranslations.postId} = ${posts.id}),
  '{}'::text[]
)`;

export function listPosts({
  filter = 'all',
  query = '',
  limit = 200,
}: { filter?: PostFilter; query?: string; limit?: number } = {}) {
  const pattern = likePattern(query.trim());
  // Cari di judul semua bahasa dan di slug.
  const search = query.trim()
    ? or(
        ilike(posts.slug, pattern),
        sql`exists (select 1 from ${postTranslations} where ${postTranslations.postId} = ${posts.id}
          and ${postTranslations.title} ilike ${pattern})`,
      )
    : undefined;

  return getDb()
    .select({
      id: posts.id,
      slug: posts.slug,
      title: postTitle,
      locales: postLocales,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(and(FILTERS[filter], search))
    .orderBy(desc(posts.updatedAt))
    .limit(limit);
}

export async function getPost(id: string) {
  const db = getDb();
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) return null;
  const translations = await db
    .select()
    .from(postTranslations)
    .where(eq(postTranslations.postId, id));
  return { post, translations };
}

/** Semua kategori dengan nama per bahasa dan jumlah artikel. */
export async function listCategories() {
  const name = (locale: string) => sql<string | null>`(select ${categoryTranslations.name}
    from ${categoryTranslations}
    where ${categoryTranslations.categoryId} = ${categories.id} and ${categoryTranslations.locale} = ${locale})`;
  return getDb()
    .select({
      id: categories.id,
      slug: categories.slug,
      nameId: name('id'),
      nameEn: name('en'),
      postCount: sql<number>`(select count(*)::int from ${posts} where ${posts.categoryId} = ${categories.id})`,
    })
    .from(categories)
    .orderBy(asc(categories.slug));
}

/** Proyek portofolio untuk admin: judul Indonesia dan bahasa yang terisi. */
export function listProjects() {
  return getDb()
    .select({
      id: portfolioProjects.id,
      slug: portfolioProjects.slug,
      title: sql<string>`coalesce(
        (select ${portfolioTranslations.title} from ${portfolioTranslations}
          where ${portfolioTranslations.projectId} = ${portfolioProjects.id} and ${portfolioTranslations.locale} = 'id'),
        ${portfolioProjects.slug})`,
      locales: sql<string[]>`coalesce(
        (select array_agg(${portfolioTranslations.locale} order by ${portfolioTranslations.locale} desc)
          from ${portfolioTranslations} where ${portfolioTranslations.projectId} = ${portfolioProjects.id}),
        '{}'::text[])`,
      status: portfolioProjects.status,
      isSample: portfolioProjects.isSample,
      serviceSlug: portfolioProjects.serviceSlug,
      sortOrder: portfolioProjects.sortOrder,
    })
    .from(portfolioProjects)
    .orderBy(asc(portfolioProjects.sortOrder), asc(portfolioProjects.createdAt));
}

export async function getProject(id: string) {
  const db = getDb();
  const [project] = await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.id, id))
    .limit(1);
  if (!project) return null;
  const translations = await db
    .select()
    .from(portfolioTranslations)
    .where(eq(portfolioTranslations.projectId, id));
  return { project, translations };
}

/** Yang belum ditangani di atas, lalu terbaru dulu. `onlyUnhandled` menyaring yang belum ditangani. */
export async function listMessages(
  page: number,
  onlyUnhandled = false,
  pageSize = MESSAGES_PAGE_SIZE,
) {
  const db = getDb();
  const where = onlyUnhandled ? eq(contactMessages.handled, false) : undefined;
  const [rows, [total]] = await Promise.all([
    db
      .select()
      .from(contactMessages)
      .where(where)
      .orderBy(asc(contactMessages.handled), desc(contactMessages.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: count() }).from(contactMessages).where(where),
  ]);
  return { rows, total: total?.total ?? 0 };
}
