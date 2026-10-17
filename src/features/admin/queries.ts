import 'server-only';
import { asc, count, desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { categories, contactMessages, posts } from '@/lib/db/schema';

export const MESSAGES_PAGE_SIZE = 20;

export async function getDashboardCounts() {
  const db = getDb();
  const [published, drafts, unhandled] = await Promise.all([
    db.select({ total: count() }).from(posts).where(eq(posts.status, 'PUBLISHED')),
    db.select({ total: count() }).from(posts).where(eq(posts.status, 'DRAFT')),
    db.select({ total: count() }).from(contactMessages).where(eq(contactMessages.handled, false)),
  ]);
  return {
    published: published[0]?.total ?? 0,
    drafts: drafts[0]?.total ?? 0,
    unhandledMessages: unhandled[0]?.total ?? 0,
  };
}

export function listPosts() {
  return getDb()
    .select({
      id: posts.id,
      locale: posts.locale,
      slug: posts.slug,
      title: posts.title,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt))
    .limit(200);
}

export async function getPost(id: string) {
  const [row] = await getDb().select().from(posts).where(eq(posts.id, id)).limit(1);
  return row ?? null;
}

export function listCategories() {
  return getDb()
    .select({
      id: categories.id,
      locale: categories.locale,
      slug: categories.slug,
      name: categories.name,
    })
    .from(categories)
    .orderBy(asc(categories.locale), asc(categories.name));
}

/** Yang belum ditangani di atas, lalu terbaru dulu. */
export async function listMessages(page: number) {
  const db = getDb();
  const [rows, [total]] = await Promise.all([
    db
      .select()
      .from(contactMessages)
      .orderBy(asc(contactMessages.handled), desc(contactMessages.createdAt))
      .limit(MESSAGES_PAGE_SIZE)
      .offset((page - 1) * MESSAGES_PAGE_SIZE),
    db.select({ total: count() }).from(contactMessages),
  ]);
  return { rows, total: total?.total ?? 0 };
}
