# 3. About dan Services (Halaman Statis)

> Status: Berjalan (halaman ada; isi About masih rakitan dari landing page)
> Fase: 1
> Folder kode: `src/app/(marketing)/about`, `src/app/(marketing)/services`, `src/components/sections`, `src/content/`

## 1. Tujuan

Memberi kedalaman di luar landing page: siapa Do It, apa saja layanannya. Halaman layanan per topik menjadi target SEO long-tail ("pembuatan ERP custom", "jasa pembuatan aplikasi mobile", dst.).

## 2. Scope

**Termasuk**

- `/about`: profil perusahaan, nilai, tim [TODO: konten].
- `/services`: daftar layanan.
- `/services/[slug]`: satu halaman per layanan.
- Konten layanan terpusat di `src/content/services.ts`; landing page juga membaca dari sana.

**Di luar scope**

- Portofolio / studi kasus (Fase 4).
- Harga / paket.
- CMS untuk layanan (konten ada di kode).

## 3. Route dan Halaman

| Route              | Rendering                       | Keterangan                     |
| ------------------ | ------------------------------- | ------------------------------ |
| `/about`           | Statis                          |                                |
| `/services`        | Statis                          | Grid layanan                   |
| `/services/[slug]` | Statis (`generateStaticParams`) | `notFound()` bila slug tak ada |

Daftar layanan (diputuskan pemilik repo, 2026-10):

- Web Development (`web-development`)
- Custom Software Development (`custom-software-development`)
- UI/UX Design (`ui-ux-design`)

ERP dan Mobile App tidak ditawarkan saat ini; datanya disimpan di `src/content/services-hidden.ts`.

## 4. Perilaku

- Setiap halaman layanan memuat: H1, ringkasan manfaat, fitur utama, proses singkat, tech stack terkait, CTA "Free Consultation", dan FAQ [TODO: opsional].
- Tautan antar halaman layanan dan ke `/contact` memakai teks anchor deskriptif.
- Breadcrumb di halaman dalam (`Home › Services › Nama`).

Kasus tepi: slug tidak ada → `not-found.tsx`.

## 5. Data

- `src/content/services.ts`: array bertipe (`slug`, `title`, `summary`, `features`, `techStack`, `seo`).
- Tidak ada database.

## 6. UI

- Pola bento dan kartu: `DESIGN_SYSTEM.md` §6-7.
- Komponen yang dipakai ulang dari landing: `ServiceCard`, `Container`, `Button`. Karena dipakai lintas halaman marketing, tempatnya `components/sections` / `components/shared`, bukan `features/`.

## 7. SEO

- Title dan description unik per halaman layanan.
- JSON-LD: `Service` (+ `provider` → Organization) dan `BreadcrumbList`.
- Masuk sitemap: ya. Prioritas halaman layanan tinggi.
- Konten per halaman minimal ±300 kata agar layak diindeks [TODO: sesuaikan strategi konten].

## 8. Dependensi

- Global: `components/ui`, `components/sections`, `lib/seo.ts`.
- Library baru: tidak ada.

## 9. Kriteria Selesai

- [x] Semua layanan di `content/` punya halaman dengan metadata unik (4 layanan x 2 bahasa; panjang title diuji)
- [ ] Breadcrumb dan JSON-LD valid (Rich Results Test)
- [x] Tidak ada tautan `href="#"` tersisa (ikon sosial disembunyikan; dijaga tes E2E)
- [x] Lighthouse SEO 100, A11y ≥ 95 (lokal: SEO 100, A11y 100)
- [x] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [x] Daftar final layanan dan slug-nya: 3 layanan (lihat atas)
- [ ] Konten About (sejarah, visi, tim) tersedia?
- [ ] Perlu FAQ per layanan?

## 11. Catatan Implementasi (2026-10-17)

- Daftar layanan awal diambil dari template: `custom-web-applications`, `erp-systems`, `mobile-app-development`, `ui-ux-design` (`src/content/services.ts`, dua bahasa). Landing page dan halaman layanan membaca sumber yang sama.
- `/about` belum punya konten resmi; sementara dirakit dari blok "Why Choose Us" dan "Workflow" milik landing page. Ganti saat ada konten asli.
- Halaman detail layanan berisi ringkasan, cakupan, CTA, dan layanan lain. Belum mencapai ±300 kata per halaman untuk SEO long-tail.
- Hero halaman dalam (`PageHero`) tidak ada di template; dibuat dengan pola hero yang ada.
