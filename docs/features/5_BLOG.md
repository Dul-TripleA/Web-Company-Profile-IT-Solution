# 5. Blog

> Status: Draft
> Fase: 2
> Folder kode: `src/features/blog/`, route `src/app/(blog)/blog/`

## 1. Tujuan

Menarik trafik organik lewat artikel teknologi/bisnis, lalu mengarahkan pembaca ke layanan dan kontak. Berhasil bila artikel terindeks, cepat, dan menghasilkan klik ke CTA.

## 2. Scope

**Termasuk**

- Daftar artikel dengan paginasi, halaman artikel, halaman kategori dan tag.
- Konten Markdown dari database (ADR-009), dirender di server dan disanitasi.
- RSS, sitemap artikel, artikel terkait, estimasi waktu baca, tanggal terbit dan diperbarui.
- Gambar cover dengan `alt`.

**Di luar scope**

- Menulis/mengedit artikel (ada di `6_ADMIN.md`).
- Komentar, like, akun pembaca.
- Pencarian (backlog; bila perlu pakai full-text PostgreSQL).

## 3. Route dan Halaman

| Route                   | Rendering                                         | Keterangan                               |
| ----------------------- | ------------------------------------------------- | ---------------------------------------- |
| `/blog`                 | Statis + revalidate via tag `posts`               | Halaman 1                                |
| `/blog/page/[n]`        | Statis + revalidate                               | Paginasi berurl [TODO: konfirmasi pola]  |
| `/blog/[slug]`          | Statis (`generateStaticParams`) + `revalidateTag` | `notFound()` bila tidak ada/bukan terbit |
| `/blog/category/[slug]` | Statis + revalidate                               |                                          |
| `/blog/tag/[slug]`      | Statis + revalidate                               |                                          |

## 4. Perilaku

- Hanya artikel `PUBLISHED` dengan `published_at <= now()` yang tampil (`publishedPostsFilter()`).
- Urutan: terbaru dulu. Ukuran halaman `PAGE_SIZE` = 9 [TODO].
- Artikel: judul (`h1`), meta (tanggal, waktu baca, penulis, kategori), cover, isi, tag, artikel terkait (kategori/tag sama, maks 3), CTA konsultasi di akhir.
- Daftar kosong → pesan "Belum ada artikel", bukan halaman kosong.
- Artikel diperbarui → `revalidateTag('posts')` dan path terkait dari Server Action admin.
- Tautan dalam isi artikel dari domain lain: `rel="noopener noreferrer"`.

## 5. Data

- Tabel `posts`, `categories`, `tags`, `post_tags` (`DATABASE.md` §3).
- Query di `features/blog/queries.ts`: `getPublishedPosts` (keyset), `getPublishedPostBySlug`, `getRelatedPosts`, `getCategories`, `getTags`. Pilih kolom seperlunya; daftar tidak memuat `content`.
- Render Markdown di `lib/markdown.ts` (global, karena dipakai juga oleh pratinjau admin).

## 6. UI

- Komponen khusus fitur: `PostCard`, `PostList`, `PostMeta`, `TagList`, `RelatedPosts`.
- Komponen global dipakai: `Container`, `Pagination` (`components/shared`), `Prose` (gaya tipografi artikel), `Breadcrumb`.
- Teks artikel `text-base`, lebar baca ±65-75 karakter, kontras sesuai `DESIGN_SYSTEM.md`.
- Gambar cover: `next/image`, `priority` hanya pada halaman artikel.

## 7. SEO

- Artikel: `generateMetadata` (title, description dari `seo_*` atau fallback), canonical, `og:type=article`, `article:published_time`.
- JSON-LD: `BlogPosting` (headline, image, datePublished, dateModified, author) + `BreadcrumbList`.
- Daftar kategori/tag halaman 2+ memakai canonical ke dirinya sendiri; hindari konten tipis [TODO: putuskan `noindex` untuk tag sepi].
- Masuk sitemap dan RSS: ya (hanya terbit).
- Slug stabil; perubahan memicu redirect 301.

## 8. Dependensi

- Global: `components/ui`, `components/shared`, `lib/db`, `lib/seo`, `lib/markdown`.
- Fitur lain: **tidak ada** (tidak boleh mengimpor `admin`).
- Library baru: **parser Markdown** dan **sanitizer HTML** (ADR-009), belum dipilih. Tawarkan opsi dulu.

## 9. Kriteria Selesai

- [ ] Draft/terjadwal tidak pernah muncul di halaman publik, sitemap, atau RSS (ada test)
- [ ] Halaman artikel lolos Rich Results Test
- [ ] Output Markdown disanitasi (test dengan input `<script>` dan `javascript:`)
- [ ] Paginasi dan query memakai indeks (`EXPLAIN` dicek)
- [ ] Lighthouse mobile ≥ 90 pada halaman artikel
- [ ] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [ ] Pola URL paginasi dan kategori?
- [ ] Terjemahan artikel: setiap artikel punya versi `id` dan `en` (grup terjemahan), atau boleh satu bahasa saja? (lihat ADR-006)
- [ ] Siapa penulis dan perlu halaman profil penulis?
- [ ] Perlu pencarian di Fase 2?
