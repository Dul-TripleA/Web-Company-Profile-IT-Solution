import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// Tabel ditambahkan per fitur (docs/DATABASE.md bagian 3), bersama migrasinya.

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text(),
    service: text(),
    message: text().notNull(),
    handled: boolean().notNull().default(false),
    // SHA-256 dari IP + garam; hanya untuk rate limit, IP asli tidak disimpan.
    ipHash: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('contact_unhandled_idx')
      .on(t.createdAt.desc())
      .where(sql`${t.handled} = false`),
    index('contact_rate_limit_idx').on(t.ipHash, t.createdAt.desc()),
  ],
);

// Akun admin/penulis. Email dan username disimpan huruf kecil (dijaga CHECK).
export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().defaultRandom(),
    email: text().notNull(),
    username: text().notNull(),
    firstName: text().notNull(),
    lastName: text(),
    // scrypt: "<salt hex>:<hash hex>" (features/admin/password.ts).
    passwordHash: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('users_email_idx').on(t.email),
    uniqueIndex('users_username_idx').on(t.username),
    check('users_email_lower', sql`${t.email} = lower(${t.email})`),
    check('users_username_check', sql`${t.username} ~ '^[a-z0-9_]{3,30}$'`),
  ],
);

// Sesi login. `id` adalah SHA-256 dari token di cookie, jadi isi tabel ini tidak bisa dipakai masuk.
export const sessions = pgTable(
  'sessions',
  {
    id: text().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [index('sessions_user_idx').on(t.userId)],
);

// Percobaan login admin yang gagal; dipakai untuk membatasi brute force per IP.
export const adminLoginAttempts = pgTable(
  'admin_login_attempts',
  {
    id: uuid().primaryKey().defaultRandom(),
    ipHash: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('admin_login_attempts_idx').on(t.ipHash, t.createdAt.desc())],
);

// Blog (docs/features/5_BLOG.md). Satu artikel = satu bahasa (kolom `locale`).
export const postStatus = pgEnum('post_status', ['DRAFT', 'PUBLISHED']);

export const categories = pgTable(
  'categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    locale: text().notNull(),
    slug: text().notNull(),
    name: text().notNull(),
  },
  (t) => [
    uniqueIndex('categories_locale_slug_idx').on(t.locale, t.slug),
    check('categories_locale_check', sql`${t.locale} in ('id', 'en')`),
    check('categories_slug_check', sql`${t.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
  ],
);

export const posts = pgTable(
  'posts',
  {
    id: uuid().primaryKey().defaultRandom(),
    locale: text().notNull(),
    slug: text().notNull(),
    title: text().notNull(),
    excerpt: text().notNull(),
    // Markdown mentah; dirender dan disanitasi di server (components/shared/markdown.tsx).
    content: text().notNull(),
    coverImage: text(),
    coverAlt: text(),
    status: postStatus().notNull().default('DRAFT'),
    // Artikel tampil bila status PUBLISHED dan published_at <= now() (tanggal depan = terjadwal).
    publishedAt: timestamp({ withTimezone: true }),
    authorName: text().notNull().default('Do It'),
    categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),
    seoTitle: text(),
    seoDescription: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    // Tidak otomatis saat diedit lewat Drizzle Studio; perbarui manual bila isi berubah.
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('posts_locale_slug_idx').on(t.locale, t.slug),
    // Partial index untuk daftar artikel terbit, urutannya sama dengan ORDER BY di query.
    index('posts_published_idx')
      .on(t.locale, t.publishedAt.desc(), t.id.desc())
      .where(sql`${t.status} = 'PUBLISHED'`),
    index('posts_category_idx').on(t.categoryId, t.publishedAt.desc()),
    check('posts_locale_check', sql`${t.locale} in ('id', 'en')`),
    // Slug aman untuk URL, dan tidak bentrok dengan rute /blog/page/[n] dan /blog/category/[slug].
    check(
      'posts_slug_check',
      sql`${t.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and ${t.slug} not in ('page', 'category')`,
    ),
    check('posts_published_has_date', sql`${t.status} = 'DRAFT' or ${t.publishedAt} is not null`),
  ],
);
