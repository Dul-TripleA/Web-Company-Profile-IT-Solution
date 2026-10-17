# 5. Blog

> Status: Selesai (kode); artikel diisi lewat Drizzle Studio sampai admin (Fase 3) ada
> Fase: 2
> Folder kode: `src/features/blog/`, route `src/app/[locale]/blog/`

## 1. Tujuan

Menarik trafik organik lewat artikel teknologi/bisnis, lalu mengarahkan pembaca ke layanan dan kontak. Berhasil bila artikel terindeks, cepat, dan menghasilkan klik ke CTA.

## 2. Keputusan (2026-10-17, dipilih pemilik repo)

- **Parser Markdown**: `react-markdown` v10 (ADR-016). Merender ke elemen React, HTML mentah tidak dieksekusi, URL `javascript:` dibuang; tanpa sanitizer terpisah.
- **Bahasa**: satu bahasa per artikel (kolom `locale`, tanpa grup terjemahan). Konsekuensi: artikel, kategori, dan halaman 2+ tidak punya `hreflang`.
- **MVP tanpa tag**. Hanya kategori. Tabel `tags` ditambah nanti bila perlu.
- **Penulisan**: lewat Drizzle Studio (`bun run db:studio`) sampai admin (Fase 3).

## 3. Scope

**Termasuk**: daftar artikel + paginasi, halaman artikel, halaman kategori, Markdown dari database, RSS per bahasa, sitemap artikel/kategori, artikel terkait, waktu baca, tanggal terbit dan diperbarui, cover dengan `alt`, JSON-LD `BlogPosting`.

**Di luar scope**: menulis/mengedit artikel (`6_ADMIN.md`), komentar, akun pembaca, pencarian, tag.

## 4. Route

| Route                   | Rendering                                       | Keterangan                                                      |
| ----------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| `/blog`                 | Partial prerender + data di-cache (tag `posts`) | Halaman 1                                                       |
| `/blog/page/[n]`        | Sama                                            | `n=1` dialihkan permanen ke `/blog`; `n` di luar jangkauan 404  |
| `/blog/[slug]`          | Sama                                            | Slug tak ada / draft / terjadwal = tampilan 404 + `noindex`     |
| `/blog/category/[slug]` | Sama                                            | Tanpa paginasi (batas `CATEGORY_LIMIT`)                         |
| `/blog/rss.xml`         | Dinamis (`ƒ`), header cache                     | 20 artikel terbaru per bahasa                                   |

Catatan: dengan Cache Components, `notFound()` setelah streaming mulai berstatus HTTP 200 + `noindex` (ADR-010/015); tampilan 404 dan `noindex` tetap benar. Slug `page` dan `category` dilarang oleh CHECK di database agar tidak bentrok dengan rute.

## 5. Perilaku

- Tampil hanya bila `status = 'PUBLISHED'` dan `published_at <= now()`.
- Urutan terbaru dulu, `PAGE_SIZE` = 9. Daftar kosong menampilkan pesan, bukan halaman kosong.
- Artikel: `h1`, meta (tanggal, waktu baca, penulis, kategori), cover, isi, CTA konsultasi, artikel terkait (kategori sama; maks 3).
- Di isi artikel, `#` dipetakan ke `h2` (satu `h1` per halaman); tautan eksternal `rel="noopener noreferrer"` dan buka tab baru.
- Cache: `cacheLife` stale 60 dtk / revalidate 300 dtk / expire 1 jam, tag `posts`. Admin (Fase 3) memanggil `revalidateTag('posts')`. Lewat Drizzle Studio, perubahan tampil dalam sekitar 5 menit.
- Kolom `updated_at` tidak otomatis berubah dari Drizzle Studio; isi manual bila ingin `dateModified` berubah.

## 6. Data

Tabel `categories` dan `posts` (`src/lib/db/schema.ts`, migrasi `drizzle/0001_clean_clea.sql`). Query di `features/blog/queries.ts` (`'use cache'` tingkat modul), memilih kolom seperlunya (daftar tanpa `content`).

## 7. UI

`features/blog/components`: `PostCard`, `CategoryFilter`, `RelatedPosts`, `BlogIndex`, `CoverImage`. Global: `components/shared/markdown.tsx`, `pagination.tsx`. Cover `https` memakai `unoptimized` (tanpa daftar domain); cover lokal di `public/images/blog/`.

## 8. SEO

Canonical per halaman, `og:type=article` + `article:published_time/modified_time`, JSON-LD `BlogPosting` + `BreadcrumbList`, RSS di `<link rel="alternate">`, sitemap memuat artikel (dengan `lastModified`) dan kategori.

## 9. Kriteria Selesai

- [x] Draft/terjadwal tidak muncul di halaman publik, sitemap, atau RSS (E2E `tests/e2e/blog.spec.ts` dengan data uji)
- [x] Output Markdown aman (unit test `markdown.test.tsx` + E2E dengan `<script>`, `onerror`, `javascript:`)
- [x] axe tanpa pelanggaran dan tanpa scroll horizontal di halaman blog (desktop + mobile)
- [x] `bun run build` tanpa database tetap lolos (CI tidak butuh DB)
- [ ] Lolos Rich Results Test (perlu URL publik, setelah deploy)
- [ ] `EXPLAIN` paginasi dicek pada data nyata (belum ada artikel nyata)
- [ ] Lighthouse mobile >= 90 pada halaman artikel (belum diukur)
- [x] `PROGRESS.md` diperbarui

## 10. Cara Menambah Artikel (sementara, sebelum admin)

1. `bun run db:studio`. Buat baris di `categories` (opsional) lalu di `posts`.
2. Isi `locale`, `slug` (huruf kecil, angka, tanda hubung), `title`, `excerpt`, `content` (Markdown), `status = PUBLISHED`, `published_at`.
3. Cover opsional: taruh gambar di `public/images/blog/` dan isi `cover_image` dengan `/images/blog/nama.jpg` + `cover_alt`.
4. `seo_title` / `seo_description` opsional (fallback ke judul/ringkasan).

## 11. Pertanyaan Terbuka

- [ ] Siapa penulis dan perlu halaman profil penulis?
- [ ] Perlu pencarian atau tag setelah artikel banyak?
- [ ] Teaser "artikel terbaru" di Home (setelah ada artikel nyata)?
