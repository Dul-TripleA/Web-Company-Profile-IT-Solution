# Database

> Status: TEMPLATE. Stack ditetapkan di ADR-008: **PostgreSQL (Neon) + Drizzle ORM + driver `postgres.js`**. Konten blog berupa Markdown di database (ADR-009). Kolom dan tabel di bawah masih usulan.

## 1. Prinsip

- Satu sumber kebenaran skema: `src/lib/db/schema.ts`. Perubahan hanya lewat **migrasi SQL** hasil `drizzle-kit generate` yang di-commit di `drizzle/`.
- Akses data hanya dari `features/*/queries.ts` dan `actions.ts`. UI tidak memanggil Drizzle.
- Waktu `timestamptz` (UTC). Primary key `uuid` (`gen_random_uuid()`). Tabel utama punya `created_at` dan `updated_at`.
- Nama tabel/kolom di PostgreSQL `snake_case`; di TypeScript `camelCase` (`casing: 'snake_case'` di config Drizzle).
- Query publik hanya mengambil `status = 'PUBLISHED'` dan `published_at <= now()`. Satu helper (`publishedPostsFilter()`) menjamin itu; jangan menyebar filter manual.
- Batasan data ditegakkan di database (NOT NULL, UNIQUE, FK, CHECK), bukan hanya di Zod.

## 2. Koneksi

Neon memakai PgBouncer (mode transaksi) di endpoint **pooled**.

```ts
// src/lib/db/index.ts (ringkas; kode lengkap di repo)
export function getDb() { /* membuat klien drizzle(postgres(DATABASE_URL, { prepare: false, max: 10 })) saat pertama dipakai */ }
```

- Aplikasi: `DATABASE_URL` (pooled). Migrasi: `DATABASE_URL_UNPOOLED` (koneksi langsung), dibaca `drizzle.config.ts`.
- `getDb()` dan `getEnv()` dibuat/divalidasi saat pertama dipakai (bukan saat modul dimuat) agar build halaman statis tidak mensyaratkan `DATABASE_URL`. Di dev instance disimpan di `globalThis` agar hot reload tidak membuka koneksi baru terus-menerus.
- Pakai `getDb()` hanya di `queries.ts`/`actions.ts`.
- Di serverless, jaga `max` kecil; pooling dilakukan Neon.

## 3. Skema

`contact_messages` sudah ada di `src/lib/db/schema.ts` dan migrasinya di `drizzle/`. Tabel lain masih usulan.

```ts
// src/lib/db/schema.ts
import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const postStatus = pgEnum('post_status', ['DRAFT', 'SCHEDULED', 'PUBLISHED']);
export const userRole = pgEnum('user_role', ['ADMIN', 'EDITOR']);

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  name: text().notNull(),
  role: userRole().notNull().default('EDITOR'),
  passwordHash: text(),
  ...timestamps,
});

export const categories = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: text().notNull(),
});

export const tags = pgTable('tags', {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: text().notNull(),
});

export const posts = pgTable(
  'posts',
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    excerpt: text().notNull(),
    content: text().notNull(), // Markdown, lihat §6
    coverImage: text(),
    coverAlt: text(),
    status: postStatus().notNull().default('DRAFT'),
    publishedAt: timestamp({ withTimezone: true }),
    readingMins: integer(),
    seoTitle: text(),
    seoDescription: text(),
    authorId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),
    ...timestamps,
  },
  (t) => [
    // Partial index: hanya artikel terbit; urutan sama dengan ORDER BY daftar blog.
    index('posts_published_idx')
      .on(t.publishedAt.desc(), t.id.desc())
      .where(sql`${t.status} = 'PUBLISHED'`),
    index('posts_category_idx').on(t.categoryId, t.publishedAt.desc()),
    check('posts_published_has_date', sql`${t.status} = 'DRAFT' OR ${t.publishedAt} IS NOT NULL`),
  ],
);

export const postTags = pgTable(
  'post_tags',
  {
    postId: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: uuid()
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.postId, t.tagId] }),
    index('post_tags_tag_idx').on(t.tagId), // arah sebaliknya: artikel per tag
  ],
);

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
    // SHA-256(IP + garam); hanya untuk rate limit, IP asli tidak disimpan.
    ipHash: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Inbox admin hanya menampilkan yang belum ditangani.
    index('contact_unhandled_idx').on(t.createdAt.desc()).where(sql`${t.handled} = false`),
    // Rate limit: hitung pesan per IP dalam jendela waktu.
    index('contact_rate_limit_idx').on(t.ipHash, t.createdAt.desc()),
  ],
);
```

**Multi-bahasa (ADR-006)**: `posts` dan konten sejenis butuh kolom `locale` (`'id' | 'en'`) dan, bila artikel punya terjemahan, `translation_group_id` yang sama antar versi. Slug unik per `(locale, slug)`, bukan global. Skema di atas belum memuat ini. [TODO: putuskan setelah strategi terjemahan blog dipilih]

[TODO: tabel tambahan bila perlu: `redirects` (slug berubah), `media`, `subscribers`.]

## 4. Migrasi dan Seeding

```sh
bun run db:generate   # drizzle-kit generate: buat file SQL dari perubahan skema
bun run db:migrate    # drizzle-kit migrate: terapkan migrasi (pakai koneksi unpooled)
bun run db:studio     # Drizzle Studio (GUI lokal)
bun run db:seed       # data awal (admin, kategori, contoh artikel). Skrip belum ada; dibuat saat dibutuhkan
```

- **Review file SQL hasil generate** sebelum commit. Itu yang dijalankan di produksi.
- `drizzle-kit push` hanya untuk eksperimen di DB lokal/branch dev. Jangan di staging/produksi.
- Migrasi tidak diedit setelah masuk `main`; buat migrasi baru.
- Seed hanya untuk dev/staging, tanpa kredensial nyata.
- Perubahan destruktif (drop kolom/tabel) dua langkah: berhenti memakai lebih dulu, drop di rilis berikutnya.
- Pakai branch Neon untuk preview/uji migrasi sebelum ke produksi.

## 5. Aturan SQL Optimal

**Pilih kolom, bukan `select *`.** Daftar blog tidak perlu `content`.

```ts
db.select({
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  publishedAt: posts.publishedAt,
}).from(posts);
```

**Satu query, bukan N+1.** Ambil relasi dengan `join` atau relational query (`db.query.posts.findMany({ with: ... })`), jangan loop `await` per baris. Untuk banyak ID gunakan `inArray`.

**Paginasi keyset, bukan `OFFSET`.** `OFFSET` membaca lalu membuang baris sehingga makin lambat di halaman dalam. Urutkan dengan kolom unik sebagai tie-breaker:

```ts
const rows = await db
  .select(cols)
  .from(posts)
  .where(
    and(
      publishedPostsFilter(),
      cursor
        ? or(
            lt(posts.publishedAt, cursor.publishedAt),
            and(eq(posts.publishedAt, cursor.publishedAt), lt(posts.id, cursor.id)),
          )
        : undefined,
    ),
  )
  .orderBy(desc(posts.publishedAt), desc(posts.id))
  .limit(PAGE_SIZE + 1); // +1 untuk tahu apakah masih ada halaman berikutnya
```

Bila UI butuh nomor halaman (SEO: `/blog/page/2`), `OFFSET` boleh asal jumlah artikel kecil dan `LIMIT` dibatasi; tetap gunakan indeks yang sama.

**Index sesuai query.**

- Setiap `WHERE` + `ORDER BY` yang sering dipakai punya index yang urutannya cocok (lihat `posts_published_idx`).
- Gunakan **partial index** untuk subset yang sering diquery (artikel terbit, pesan belum ditangani).
- FK tidak otomatis ter-index di PostgreSQL; tambahkan index untuk FK yang di-join/difilter.
- Jangan menambah index "jaga-jaga": setiap index memperlambat tulis dan memakan ruang.

**Verifikasi dengan `EXPLAIN (ANALYZE, BUFFERS)`** untuk query baru yang menyentuh daftar besar. Cari `Seq Scan` pada tabel besar dan estimasi baris yang jauh dari aktual.

**Hitung dengan hemat.** `count(*)` penuh itu mahal di tabel besar. Hindari "total halaman" bila tidak perlu; atau hitung sekali lalu cache (`revalidateTag`).

**Tulis secara batch dan atomik.**

- Banyak baris: satu `insert().values([...])`, bukan loop.
- Beberapa tulisan yang harus bersama (artikel + tag) di `db.transaction(...)`.
- Upsert dengan `onConflictDoUpdate` / `onConflictDoNothing`, bukan select-lalu-insert.
- Ambil hasil tulis dengan `.returning({...})` agar tidak perlu query tambahan.

**Prepared statement.** `.prepare()` Drizzle tidak dipakai di belakang PgBouncer mode transaksi (kita memakai `prepare: false`). Jangan mengandalkannya di Neon pooled.

**Query di Server Component.**

- Bungkus dengan cache Next (tag + `revalidateTag`) supaya halaman publik tidak menembak DB tiap request.
- Query paralel yang saling independen dengan `Promise.all`.
- Satu request halaman idealnya ≤ 3 query.

**SQL mentah.** Hanya lewat template `sql\`...\`` Drizzle (ter-parameter). Dilarang menyambung string dari input pengguna.

**Pencarian teks (bila diperlukan, ADR terpisah).** Gunakan fitur bawaan PostgreSQL: kolom `tsvector` generated + index GIN (`to_tsvector('indonesian' | 'english', title || ' ' || content)`). Sebelum menambah layanan pencarian eksternal.

## 6. Aturan Konten Artikel (Markdown di DB)

- `content` menyimpan Markdown mentah. Render ke HTML di server saat build/ISR (bukan di browser), lalu **sanitasi** dengan allowlist sebelum ditampilkan.
- Pilihan paket parser Markdown dan sanitizer: ADR-009, dipilih lewat "Tawarkan Pilihan Dulu".
- `slug` dibuat dari judul, unik, tidak berubah setelah publish. Bila diubah, buat entri `redirects`.
- `published_at` null selama draft. `SCHEDULED` dipublikasi oleh job terjadwal [TODO: Vercel Cron / cron host].
- `reading_mins` dihitung saat simpan (≈ 200 kata/menit).
- `seo_title` / `seo_description` opsional; kosong → pakai `title` / `excerpt`.

## 7. Backup

Neon menyediakan point-in-time restore sesuai plan; periksa jendela retensi plan yang dipakai. [TODO: jadwal dump berkala di luar Neon, uji restore.]
