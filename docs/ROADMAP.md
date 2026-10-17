# Roadmap

> Status: TEMPLATE. Tanpa tanggal; urutan = prioritas.

## Cara Membaca

- Roadmap ini adalah **indeks dan urutan**. Detail perilaku, scope, dan kriteria selesai sebuah fitur ada di dokumennya di `features/`. Jangan menyalin checklist fitur ke sini.
- Kolom **Status** mengikuti baris `Status:` di dokumen fitur. Ubah keduanya bersamaan.
- **Tugas non-fitur** (setup, CI, deploy, konten) tidak punya dokumen fitur; dicentang langsung di sini.
- Status: `Draft` (belum disetujui) · `Disetujui` · `Berjalan` · `Selesai`.
- Log pekerjaan harian ada di `PROGRESS.md`.

## Fase 0: Fondasi

Semua tugas non-fitur.

- [x] Scaffold Next.js 16 + TypeScript strict + Tailwind v4 + ESLint + Prettier (Bun)
- [x] Token `@theme` dari `DESIGN_SYSTEM.md` §8; font Plus Jakarta Sans via `next/font`
- [x] Struktur folder sesuai `ARCHITECTURE.md`; alias `@/*`
- [x] ESLint `no-restricted-imports` untuk larangan impor antar-fitur (`ARCHITECTURE.md` §2)
- [x] `lib/env.ts`, `.env.example`, `lib/utils.ts` (`cn`)
- [x] Drizzle: `drizzle.config.ts`, `src/lib/db`, skrip `db:*` (`DATABASE.md`)
- [ ] Buat project Neon dan isi `.env` (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`); dikerjakan pemilik repo
- [x] CI: lint, typecheck, test, build (`.github/workflows/ci.yml`; belum dijalankan di GitHub)
- [x] Setup i18n `id` + `en` (ADR-006): `app/[locale]`, kamus JSON, helper locale, `src/proxy.ts`

## Fase 1: Landing page (MVP)

| #   | Fitur            | Dokumen                                          | Status |
| --- | ---------------- | ------------------------------------------------ | ------ |
| 1   | Landing Page     | [1_LANDING_PAGE](features/1_LANDING_PAGE.md)     | Berjalan |
| 2   | Contact          | [2_CONTACT](features/2_CONTACT.md)               | Berjalan |
| 3   | About & Services | [3_ABOUT_SERVICES](features/3_ABOUT_SERVICES.md) | Berjalan |
| 4   | SEO Foundation   | [4_SEO](features/4_SEO.md)                       | Berjalan |

Tugas non-fitur:

- [ ] Primitif UI global (`Container`, `Button`, `Badge`, `Card`) dan layout (`TopBar`, `SiteHeader`, `SiteFooter`, skip link), dipakai semua fitur di atas
- [ ] 404/error page bermerek
- [ ] Audit Lighthouse, a11y, responsif lintas halaman
- [ ] Deploy produksi + domain + Search Console

## Fase 2: Blog

| #   | Fitur | Dokumen                      | Status |
| --- | ----- | ---------------------------- | ------ |
| 5   | Blog  | [5_BLOG](features/5_BLOG.md) | Draft  |

Tugas non-fitur:

- [ ] 3-5 artikel awal untuk peluncuran (konten)

## Fase 3: Admin

| #   | Fitur | Dokumen                        | Status |
| --- | ----- | ------------------------------ | ------ |
| 6   | Admin | [6_ADMIN](features/6_ADMIN.md) | Draft  |

Tugas non-fitur:

- [ ] Putuskan library autentikasi (ADR-005 di `DECISION.md`) sebelum mulai fitur Admin

## Fase 4: Pertumbuhan

| #   | Fitur                                                  | Dokumen                          | Status |
| --- | ------------------------------------------------------ | -------------------------------- | ------ |
| 7   | Growth (analytics, newsletter, portofolio, monitoring) | [7_GROWTH](features/7_GROWTH.md) | Draft  |

## Backlog / Ide

Belum punya dokumen fitur. Naikkan menjadi dokumen bila akan dikerjakan.

- Pencarian artikel
- Mode terang/gelap pilihan user (saat ini situs bergaya gelap-hijau + section terang)
- Halaman harga / paket layanan
