# Architecture

> Status: TEMPLATE (usulan awal). Keputusan yang masih terbuka ada di `DECISION.md`.

## 1. Stack

| Lapisan                   | Pilihan                                               | Catatan                                                                                                   |
| ------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Framework                 | Next.js 16, App Router                                | Turbopack default                                                                                         |
| UI                        | React 19, Tailwind CSS v4                             | Token di `globals.css` (`DESIGN_SYSTEM.md` §8)                                                            |
| Bahasa                    | TypeScript strict                                     |                                                                                                           |
| Validasi                  | Zod                                                   | Form, env, input API                                                                                      |
| Database                  | PostgreSQL (Neon) + Drizzle ORM, driver `postgres.js` | `DATABASE.md`, ADR-008                                                                                    |
| Auth admin                | [TODO: Auth.js / Better Auth]                         | `SECURITY.md`                                                                                             |
| Email                     | [TODO: Resend / SMTP]                                 | Notifikasi form kontak                                                                                    |
| Test                      | Vitest, Testing Library, Playwright                   | `TESTING.md`                                                                                              |
| Package manager / runtime | Bun                                                   | Hanya sebagai package manager dan script runner; runtime produksi mengikuti hosting (Node.js bila Vercel) |

## 2. Struktur Folder

```
DoIt/
├── AGENTS.md / CLAUDE.md
├── docs/
├── public/                  # aset statis (gambar hero, favicon, og default)
├── drizzle/                 # migrasi SQL hasil drizzle-kit (di-commit)
├── drizzle.config.ts
├── src/
│   ├── app/                 # routing saja: page, layout, route handler
│   │   ├── [locale]/        # semua halaman publik, locale `id` | `en` (ADR-006)
│   │   │   ├── (marketing)/ # /, /about, /services, /contact
│   │   │   └── (blog)/blog/ # daftar, artikel, kategori, tag
│   │   ├── admin/           # area admin (noindex, terproteksi)
│   │   ├── api/             # route handler (webhook, rss bila perlu)
│   │   ├── layout.tsx       # root layout: font, metadata default
│   │   ├── globals.css      # Tailwind + @theme token
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/              # primitif: Button, Badge, Card, Container
│   │   ├── shared/          # komponen global gabungan yang dipakai ≥ 2 fitur (Pagination, Prose)
│   │   ├── layout/          # SiteHeader, TopBar, SiteFooter
│   │   └── sections/        # Hero, Approach, Services, TechStack, Workflow, Reviews
│   ├── features/            # satu folder per fitur, terisolasi (lihat "Struktur per Fitur")
│   │   ├── contact/
│   │   ├── blog/
│   │   └── admin/
│   ├── lib/
│   │   ├── db/              # index.ts (klien Drizzle singleton), schema.ts
│   │   ├── env.ts           # getEnv(): env server tervalidasi Zod (lazy)
│   │   ├── seo.ts           # helper metadata + JSON-LD
│   │   └── utils.ts         # cn(), format tanggal, dsb.
│   ├── i18n/                # kamus terjemahan (id, en) dan helper locale [mekanisme TODO]
│   ├── content/             # konten statis terstruktur (daftar layanan, tech stack, review)
│   └── types/
└── tests/                   # e2e (Playwright); unit test di sebelah file-nya
```

### Struktur per Fitur

Setiap fitur adalah modul mandiri. Semua yang hanya dipakai fitur itu (komponen, query, action, skema, tipe, konstanta, test) tinggal di dalam foldernya.

```
src/features/blog/
├── README.md              # opsional, singkat: tautan ke docs/features/N_*.md + catatan implementasi (tabel DB, jebakan)
├── components/            # komponen KHUSUS fitur ini (PostCard, PostList, TagFilter)
│   ├── post-card.tsx
│   └── post-card.test.tsx
├── queries.ts             # baca data (Server only)
├── actions.ts             # Server Action: validasi Zod → tulis DB → revalidate
├── schema.ts              # skema Zod + tipe turunan untuk fitur ini
├── types.ts               # tipe domain fitur
└── constants.ts           # PAGE_SIZE, dsb.
```

- Tidak wajib semua file ada; buat sesuai kebutuhan. Tidak ada `index.ts` barrel: impor langsung dari file yang dipakai, supaya kode server (`queries`, `actions`) tidak ikut terbawa ke bundle client.
- Nama fitur = kata benda domain (`blog`, `contact`, `admin`), bukan halaman.
- Fitur baru dibuat bila ada logika/data/komponen yang hanya milik satu domain. Halaman statis murni (home, about) cukup memakai `components/sections` dan `content/`.
- Skema tabel Drizzle tetap terpusat di `lib/db/schema.ts` (relasi antar tabel butuh satu tempat). Fitur memakainya lewat `queries.ts` dan `actions.ts`.

### Aturan dependensi

Arah impor yang diizinkan:

```
app        → features/*, components/*, lib/*, content/*
features/X → components/* (global), lib/*, content/*, types/*   (dan file di dalam fitur X sendiri)
components → lib/*, content/*, types/*
lib        → lib/*, types/*
```

Larangan:

- **`features/A` tidak boleh mengimpor apa pun dari `features/B`** (komponen, query, tipe, konstanta). Tidak ada pengecualian.
- Bila fitur A dan B sama-sama butuh sesuatu, **naikkan jadi global**:
  - komponen UI → `components/ui` (primitif) atau `components/shared` (gabungan, mis. `Pagination`, `Prose`)
  - logika/helper → `lib/` (mis. `lib/markdown.ts` untuk render Markdown yang dipakai `blog` dan pratinjau di `admin`)
  - tipe → `types/`
  - Naikkan hanya setelah dipakai ≥ 2 fitur. Jangan membuat global lebih awal.
- Komponen global (`components/*`) tidak mengimpor dari `features/*`. `lib/*` tidak mengimpor dari `features/*` maupun `components/*`.
- Fitur yang menyentuh tabel yang sama dengan fitur lain (mis. `admin` menulis `posts`, `blog` membacanya) menulis query-nya sendiri di `queries.ts`/`actions.ts` masing-masing. Duplikasi query kecil lebih baik daripada ketergantungan antar-fitur.
- Hanya `features/*/queries.ts` dan `features/*/actions.ts` (serta `lib/`) yang menyentuh `lib/db`. Komponen tidak.
- `app/` tipis: ambil data dari fitur, rakit komponen, ekspor `metadata`. Tidak ada logika bisnis di `page.tsx`.

### Penegakan

Aturan ini dicek otomatis dengan rule ESLint bawaan `no-restricted-imports` (tanpa library tambahan), contoh konsep:

```js
// eslint.config.mjs (per fitur; buat satu blok untuk tiap fitur)
{
  files: ['src/features/blog/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{ group: ['@/features/contact/*', '@/features/admin/*'], message: 'Fitur tidak boleh mengimpor fitur lain. Naikkan ke components/ atau lib/.' }],
    }],
  },
},
{
  files: ['src/components/**/*.{ts,tsx}', 'src/lib/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{ group: ['@/features/*'], message: 'Kode global tidak boleh bergantung pada fitur.' }],
    }],
  },
},
```

Karena blok per fitur harus mendaftar fitur lain, perbarui konfigurasi ini setiap ada fitur baru.

## 3. Strategi Rendering

| Halaman                      | Strategi                                                    | Alasan                              |
| ---------------------------- | ----------------------------------------------------------- | ----------------------------------- |
| `/`, `/about`, `/services/*` | Statis (build time)                                         | Konten jarang berubah, TTFB terbaik |
| `/blog`                      | Statis + revalidate via tag                                 | Berubah saat artikel dipublikasi    |
| `/blog/[slug]`               | Statis (`generateStaticParams`) + `revalidateTag` saat edit | SEO + cepat                         |
| `/contact`                   | Statis; submit lewat Server Action                          |                                     |
| `/admin/*`                   | Dinamis, terautentikasi                                     | Tidak di-cache                      |

- Cache Components aktif (`cacheComponents: true`, ADR-010): data bersifat dinamis secara default dan caching dipilih eksplisit dengan `"use cache"`, `cacheLife`, dan `cacheTag`. Akses data runtime (mis. `params` tanpa `generateStaticParams`, query DB) di luar `<Suspense>` memicu error saat build. Baca `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` sebelum membuat halaman berdata.
- `params` dan `searchParams` di Next 16 bersifat async, jadi gunakan `await`.
- Interseptor request (auth gate admin) memakai `proxy.ts` (pengganti `middleware.ts` di Next 16). Verifikasi di dokumentasi versi terpasang sebelum implementasi.

## 4. Data Flow

**Baca (blog):**
`page.tsx` (Server Component) → `features/blog/queries.getPostBySlug()` → `lib/db` → render → HTML statis.

**Tulis (form kontak):**
Client form → Server Action `features/contact/actions.submitContact()` → validasi Zod → rate limit → simpan DB → kirim email → kembalikan `{ ok, errors }` → UI memperbarui status (`useActionState`).

**Publish artikel:**
Admin form → Server Action → validasi + sanitasi → simpan → `revalidateTag('posts')` + `revalidatePath` halaman terkait.

## 5. SEO sebagai Bagian Arsitektur

- `lib/seo.ts` menyediakan `buildMetadata()` dan generator JSON-LD (`Organization`, `WebSite`, `BlogPosting`, `BreadcrumbList`).
- `app/sitemap.ts` menggabungkan route statis + artikel dari DB. `app/robots.ts` memblokir `/admin` dan `/api`.
- Canonical memakai `metadataBase` dari env `NEXT_PUBLIC_SITE_URL`.
- OG image: default statis; artikel memakai `opengraph-image.tsx` dinamis.
- Detail aturan: `CODE_STYLE.md` §SEO.

## 6. Environment

Variabel server dibaca lewat `getEnv()` di `src/lib/env.ts` (Zod), divalidasi saat pertama dipakai dan gagal dengan pesan jelas bila ada yang kosong. `NEXT_PUBLIC_SITE_URL` untuk SEO dibaca lewat `src/lib/site.ts` agar build statis tidak mensyaratkan variabel server.

| Variabel                            | Scope  | Keterangan                                              |
| ----------------------------------- | ------ | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | publik | URL kanonik, tanpa trailing slash                       |
| `DATABASE_URL`                      | server | Neon, endpoint **pooled** (`-pooler`); dipakai aplikasi |
| `DATABASE_URL_UNPOOLED`             | server | Neon, koneksi langsung; dipakai `drizzle-kit migrate`   |
| `AUTH_SECRET`                       | server | [TODO: tergantung library auth]                         |
| `EMAIL_API_KEY`, `CONTACT_TO_EMAIL` | server |                                                         |

Sediakan `.env.example`. Jangan commit `.env*` lain.

## 7. Deployment

[TODO: target hosting, CI/CD, strategi preview, backup DB.]
Minimal CI: install → lint → typecheck → test → build.

## 8. Internasionalisasi (i18n)

Situs dua bahasa: `id` dan `en` (ADR-006).

- Halaman publik di bawah `app/[locale]/`. Area `admin` dan `api` di luar segmen locale. [TODO: bahasa UI admin]
- `params.locale` divalidasi terhadap daftar locale yang didukung; selain itu `notFound()`.
- Teks UI dari kamus per locale di `src/i18n/`; komponen menerima teks lewat props atau helper `t()`. Tidak ada string UI yang di-hardcode di JSX.
- Konten statis terstruktur (`src/content/`) menyimpan teks per locale (`{ id: ..., en: ... }`) atau berkas per locale. [TODO: putuskan satu pola]
- Konten blog dan layanan di database: lihat `DATABASE.md` (kolom `locale`). [TODO]
- `<html lang>` mengikuti locale. Metadata, `hreflang`, canonical, dan sitemap per locale: `features/4_SEO.md`.
- Tautan internal memakai helper yang menambahkan prefiks locale; jangan menulis path mentah.
- Format tanggal/angka lewat `Intl.*` dengan locale aktif.
- Mekanisme (kamus JSON native vs library) dan strategi URL (prefiks di kedua locale vs locale default tanpa prefiks) belum dipilih; lihat ADR-006.
