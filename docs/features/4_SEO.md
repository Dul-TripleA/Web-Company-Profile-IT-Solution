# 4. SEO Foundation

> Status: Berjalan (metadata, JSON-LD, sitemap, robots, hreflang, ikon, manifest, dan gambar OG selesai; redirect slug menunggu blog)
> Fase: 1 (dasar), berlanjut di Fase 2
> Folder kode: `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`

## 1. Tujuan

Semua halaman publik punya metadata, data terstruktur, dan sinyal teknis yang benar secara default, sehingga fitur baru tidak perlu mengingat-ingat SEO satu per satu. Berhasil bila Lighthouse SEO 100 dan Search Console tanpa error pengindeksan.

## 2. Scope

**Termasuk**

- `buildMetadata()` (title, description, canonical, Open Graph, Twitter).
- Generator JSON-LD: `Organization`, `WebSite`, `BreadcrumbList`, `Service`, `BlogPosting`.
- `sitemap.ts`, `robots.ts`, `rss.xml` (Fase 2).
- OG image default dan dinamis untuk artikel.
- Redirect 301 untuk slug yang berubah.
- Favicon (ICO + PNG), apple-icon, manifest, dan gambar OG bawaan (`public/og-default.png`), dibuat dari logo resmi di `public/images/logo` lewat `docs/reference/make-brand-assets.cjs`.
- Dukungan dua bahasa (ADR-006): `alternates.languages` (`hreflang`, termasuk `x-default`), canonical per locale, sitemap memuat kedua versi tiap halaman, JSON-LD `inLanguage`.

**Di luar scope**

- Riset kata kunci dan penulisan konten.
- Analytics (lihat `7_GROWTH.md`).

## 3. Route dan Halaman

| Route              | Rendering         | Keterangan                              |
| ------------------ | ----------------- | --------------------------------------- |
| `/sitemap.xml`     | Dinamis ter-cache | Route statis + artikel terbit           |
| `/robots.txt`      | Statis            | Blokir `/admin`, `/api`; tunjuk sitemap |
| `/rss.xml`         | Dinamis ter-cache | Artikel terbit (Fase 2)                 |
| `/opengraph-image` | Dinamis           | Default dan per artikel                 |

## 4. Perilaku

- `buildMetadata({ title, description, path, type, image })` menghasilkan objek `Metadata` lengkap; `metadataBase` dari `NEXT_PUBLIC_SITE_URL`.
- Title ≤ 60 karakter dengan sufiks nama brand; description 120-160 karakter. Validasi panjang lewat test.
- Canonical selalu absolut, tanpa query string dan trailing slash.
- Halaman `noindex`: `/admin/*`, halaman hasil pencarian internal, draft.
- Sitemap tidak memuat draft atau halaman `noindex`; `lastModified` dari `updated_at`.
- JSON-LD ditulis lewat satu komponen `<JsonLd data={...} />` yang meng-escape `<`.
- Slug berubah → entri `redirects` → respons 301 [TODO: tabel `redirects` + cara membaca, mis. `proxy.ts` atau `next.config` redirects].

## 5. Data

- Env `NEXT_PUBLIC_SITE_URL`.
- Data organisasi (nama, logo, telepon, sosial) di `src/content/site.ts`, satu sumber untuk footer, JSON-LD, dan metadata.

## 6. UI

Tidak ada UI. Pengecualian: breadcrumb tampil (`components/shared/breadcrumb.tsx`) dan memakai data yang sama dengan JSON-LD.

## 7. SEO

(Fitur ini adalah SEO itu sendiri.) Aturan per halaman ada di `CODE_STYLE.md` §5.

## 8. Dependensi

- Global: `lib/env`, `lib/db` (sitemap artikel).
- Library baru: tidak ada. Gunakan Metadata API, `sitemap.ts`, `robots.ts`, dan `ImageResponse` bawaan Next.

## 9. Kriteria Selesai

- [x] Setiap halaman publik punya title, description, canonical, OG, Twitter (gambar OG belum ada)
- [x] Test unit `buildMetadata` dan generator JSON-LD
- [x] Sitemap valid, tidak memuat `/admin` dan draft (E2E memeriksa isi sitemap)
- [ ] Rich Results Test lulus untuk `Organization`, `BlogPosting`, `BreadcrumbList`
- [ ] Situs didaftarkan di Search Console dan sitemap dikirim
- [x] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [ ] Domain produksi final?
- [x] Logo dan gambar OG default: logo resmi sudah ada; ikon dan OG dibuat dari logo itu
- [ ] Trailing slash: tanpa (usulan)?

## 11. Catatan Implementasi (2026-10-17)

- Kode: `src/lib/seo/metadata.ts` (`buildMetadata`, `truncate`), `src/lib/seo/json-ld.ts` (Organization, WebSite, BreadcrumbList, Service), `src/components/shared/json-ld.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/site.ts`.
- Test memastikan title ≤ 60 dan description 70-160 karakter untuk semua halaman statis di kedua bahasa.
- Sitemap memuat semua halaman x 2 bahasa dengan `alternates.languages`; belum memakai `lastModified` karena `new Date()` bermasalah di prerender Cache Components.
- Belum: gambar OG default/dinamis, tabel `redirects`, favicon/manifest, `rss.xml` (Fase 2), Rich Results Test, pendaftaran Search Console.
- Ikon, manifest, dan OG: `src/app/icon.png`, `favicon.ico`, `apple-icon.png`, `manifest.ts`, `public/icons/`, `public/og-default.png`. Semua halaman memakai gambar OG bawaan dan kartu Twitter `summary_large_image` kecuali memberi `image` sendiri ke `buildMetadata`. Satu gambar untuk dua bahasa (nama + tagline Inggris dan Indonesia). Diuji E2E (tag meta, tautan ikon, status 200).
