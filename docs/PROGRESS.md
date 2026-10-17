# Progress

Catatan status pekerjaan terkini. Beda dengan `ROADMAP.md` (rencana), file ini mencatat **apa yang sudah dan sedang dikerjakan**. Agent wajib memperbarui file ini di akhir setiap sesi/tugas yang mengubah repo.

## Status Saat Ini

- **Fase aktif**: Fase 1 (Landing page), UI selesai, belum diverifikasi penuh
- **Terakhir diperbarui**: 2026-10-17
- **Sedang dikerjakan**: tidak ada
- **Blocker**: project Neon belum dibuat (butuh pemilik repo); form kontak tidak bisa menyimpan sebelum itu

## Langkah Berikutnya (untuk agent yang melanjutkan)

1. Pemilik repo: buat project Neon, isi `.env` dari `.env.example` (termasuk `IP_HASH_SALT`), jalankan `bun run db:migrate`, lalu uji form `/id/contact` end-to-end. Jalur DB belum pernah dijalankan.
2. Pemilik repo: putuskan hal terbuka di dokumen fitur 1-3: tinggi tombol (tap target 44px), penyedia email notifikasi, isi halaman About, isi menu dropdown "Pages", nasib tautan Blog (404 sampai Fase 2), tautan sosial/telepon/email asli, keaslian testimoni.
3. Agent: verifikasi yang belum dilakukan di fitur 1-4: Lighthouse (mobile ≥ 90, SEO 100, A11y ≥ 95), uji keyboard (dropdown, menu mobile), tampilan 360px di perangkat/emulator nyata, "form tanpa JavaScript", Rich Results Test, axe. Playwright belum dipasang.
4. Agent: sisa fitur 4 (SEO): gambar OG, tabel `redirects`, favicon/manifest. Lalu Fase 2 (Blog) setelah dokumen fitur 5 dikonfirmasi.
5. Tinjau ADR-010 (Cache Components) dan ADR-011 (jsdom v26).
6. Tambahkan nama fitur baru ke `FEATURES` di `eslint.config.mjs` saat membuat folder di `src/features/`.
7. Pemilik repo: push ke GitHub agar CI pertama kali jalan; buat commit pertama bila siap.

Kondisi repo saat ini: Fase 1 berjalan (lint, typecheck, test, build lolos), repositori git sudah di-init tanpa commit.

## Ringkasan per Fase

| Fase            | Status      | Catatan                      |
| --------------- | ----------- | ---------------------------- |
| 0. Fondasi      | Selesai (kecuali Neon) | Project Neon: tugas pemilik repo |
| 1. Landing page | Belum mulai |                              |
| 2. Blog         | Belum mulai |                              |
| 3. Admin        | Belum mulai |                              |
| 4. Pertumbuhan  | Belum mulai |                              |

Status: `Belum mulai` · `Berjalan` · `Selesai` · `Tertunda`.

## Log

Entri terbaru di atas. Satu entri per sesi/tugas.

```md
### YYYY-MM-DD: judul singkat

- Selesai: apa yang diubah (file/area utama)
- Verifikasi: perintah yang dijalankan dan hasilnya (lint/typecheck/test/build)
- Belum selesai / catatan: sisa pekerjaan, asumsi, utang teknis
- Berikutnya: langkah yang disarankan
```

### 2026-10-17: Fase 1 (Landing page, Contact, About/Services, SEO)

- Selesai: seluruh halaman Blade diportasi ke komponen Next.js (`components/ui`, `layout`, `sections`) dengan tampilan sama, dua bahasa. Halaman: `/[locale]` (landing), `/about`, `/services`, `/services/[slug]` (4 layanan), `/contact`. Fitur contact: skema Zod, Server Action (honeypot, rate limit 3 pesan/10 menit per IP-hash, simpan ke `contact_messages`), tabel + migrasi `drizzle/0000_*.sql`. SEO: `buildMetadata` (canonical, hreflang, OG, Twitter), JSON-LD (Organization, WebSite, BreadcrumbList, Service), `sitemap.ts`, `robots.ts`. Kamus `id`/`en` lengkap; konten di `src/content/` (layanan, tech stack, review, data situs). Gambar diunduh ke `public/images/`. `env` dan `db` dijadikan lazy (`getEnv()`, `getDb()`) agar build statis tidak butuh `DATABASE_URL`.
- Verifikasi (dijalankan, lolos): `bun run lint`, `typecheck`, `test` (4 berkas, 39 tes), `build` (28 halaman statis). Screenshot Chrome headless dibandingkan dengan salinan Blade (Tailwind CDN) pada 1440px: tata letak dan warna sama; satu selisih (tinggi foto "Why Choose Us") ditemukan dan diperbaiki. Diperiksa juga `/id/contact`, detail layanan, dan lebar 500px.
- Tidak diverifikasi: Lighthouse, uji keyboard/aksesibilitas, tampilan 390px asli (Chrome headless menolak jendela < ±500px), jalur database form kontak, pengiriman form di browser, form tanpa JavaScript, Rich Results Test.
- Catatan: penyimpangan dari template didokumentasikan di `docs/features/1_LANDING_PAGE.md` bagian 11 (pengalih bahasa, menu mobile, dropdown, tautan yang diarahkan ulang, `text-xs` dan tinggi tombol dipertahankan sehingga belum 44px). Testimoni, telepon, email, dan sosial masih placeholder. `/blog` masih 404 (ada di nav). Tombol CTA header disembunyikan di bawah 640px (ada di menu mobile) karena tidak muat.
- Berikutnya: lihat "Langkah Berikutnya".

### 2026-10-17: Fase 0 (Fondasi)

- Selesai: scaffold Next.js 16.4.2 + React 19.3 + Tailwind v4 (Turbopack) dengan Bun. `tsconfig` strict + `noUncheckedIndexedAccess`. Token `@theme` dan font Plus Jakarta Sans. i18n `id`/`en` native: `app/[locale]`, `src/i18n` (kamus JSON bertipe, helper locale), `src/proxy.ts` (alihkan `/` ke `/id`). ESLint dengan larangan impor antar-fitur dan global→fitur. Prettier (+ plugin Tailwind). Vitest + Testing Library (10 tes). Drizzle: `drizzle.config.ts`, `src/lib/db` (klien `postgres.js`, belum ada tabel), skrip `db:*`. `lib/env.ts` (Zod), `.env.example`, `cn()`. CI GitHub Actions. `git init` (branch `main`, belum ada commit). Kerangka folder `components/{ui,layout,shared,sections}`, `features`, `content`, `types`.
- Verifikasi (dijalankan, lolos): `bun run lint`, `bun run typecheck`, `bun run test` (2 berkas, 10 tes), `bun run build`, `bun run format:check`. Server produksi dijalankan lokal: `/` → 307 `/id`; `/id` dan `/en` → 200 dengan `<html lang>` dan `<title>` sesuai locale; `/robots.txt` tidak dialihkan. Rule ESLint diuji dengan berkas sementara (impor `blog`→`contact` dan `components`→`features` ditolak). `drizzle-kit generate` diuji dengan skema sementara (SQL `snake_case` benar). Berkas uji sudah dihapus.
- Tidak diverifikasi: koneksi ke Neon/PostgreSQL (belum ada project), `drizzle-kit migrate`, CI di GitHub, `next dev`.
- Catatan: scaffold mengaktifkan Cache Components (ADR-010). `jsdom` dipin v26 karena Node 20 (ADR-011). Saya sempat menjalankan `prettier --write .` yang ikut memformat ulang Markdown di `docs/` dan `AGENTS.md` (tabel dirapikan, `*x*` menjadi `_x_`, tanpa perubahan isi); Markdown sekarang dikecualikan di `.prettierignore`. `docs/reference/` tidak tersentuh. `create-next-app` membuat `AGENTS.md` sendiri; isinya (blok aturan Next) digabung ke akhir `AGENTS.md` ini agar `next dev` tidak menambahkannya lagi.
- Berikutnya: lihat "Langkah Berikutnya".

### 2026-10-17: Stack data, aturan dependency, aturan tawarkan pilihan

- Selesai: package manager diganti ke Bun (ADR-007). PostgreSQL (Neon) + Drizzle + `postgres.js` ditetapkan (ADR-008); konten blog Markdown di DB (ADR-009). `DATABASE.md` ditulis ulang dengan skema Drizzle dan aturan SQL optimal. `AGENTS.md` mendapat "Aturan Dependency" dan "Tawarkan Pilihan Dulu"; `CODE_STYLE.md` mendapat §9 (daftar dependency disetujui, contoh native). `cn()` dan varian komponen diubah agar tanpa `clsx`/`tailwind-merge`/`cva`.
- Struktur per fitur: `ARCHITECTURE.md` §2 kini mendefinisikan anatomi `features/<nama>/` dan larangan impor antar-fitur (naikkan ke `components/shared` atau `lib/`), plus contoh rule ESLint `no-restricted-imports`. Ringkasannya ada di `AGENTS.md` (aturan 5a).
- Dokumen fitur dibuat di `docs/features/`: 1 Landing Page, 2 Contact, 3 About & Services, 4 SEO, 5 Blog, 6 Admin, 7 Growth, plus `_TEMPLATE.md`. Semua status Draft dan berisi `[TODO]` untuk dilengkapi pemilik repo.
- `ROADMAP.md` dirapikan menjadi indeks: tabel fitur per fase dengan tautan ke `docs/features/` dan status, plus tugas non-fitur. Aturannya ditambahkan di `AGENTS.md` (bagian Dokumen Fitur).
- Template Blade disalin ke `docs/reference/welcome.blade.php` (identik dengan aslinya) dan referensinya di `AGENTS.md` dan `DESIGN_SYSTEM.md` diperbarui.
- ADR-006 diputuskan: situs dua bahasa `id` + `en` dengan i18n. Dokumen terkait diperbarui (AGENTS, PRD, ARCHITECTURE bagian 8, DATABASE, CODE_STYLE, ROADMAP, fitur 1/4/5/7, template fitur). Auth (ADR-005) dipindah ke Fase 3 di roadmap.
- Verifikasi: tidak ada kode; hanya dokumen. Skema Drizzle di `DATABASE.md` belum dikompilasi atau dijalankan.
- Belum selesai / catatan: nama paket parser Markdown + sanitizer, auth, email, rate limit belum dipilih. Versi API Drizzle perlu dicek dengan dokumentasi saat scaffold.
- Berikutnya: pemilik repo merapikan dokumen; lalu Fase 0 (scaffold).

### 2026-10-17: Dokumentasi awal

- Selesai: `AGENTS.md`, `CLAUDE.md`, dan 9 dokumen di `docs/` (PRD, ARCHITECTURE, DESIGN_SYSTEM, CODE_STYLE, DATABASE, SECURITY, TESTING, DECISION, ROADMAP) dibuat sebagai template. Design system diturunkan dari `welcome.blade.php`.
- Verifikasi: tidak ada kode; hanya dokumen.
- Belum selesai / catatan: banyak `[TODO]` menunggu isian pemilik repo. Section "Comprehensive Solution" di Blade belum dirinci di `DESIGN_SYSTEM.md`.
- Berikutnya: pemilik repo merapikan isi dokumen dan memutuskan ADR yang berstatus Proposed, lalu Fase 0 (scaffold).

## Keputusan Tertunda

Lihat ADR berstatus `Proposed` di `DECISION.md`. Daftar ringkas: ADR-005 (auth, Fase 3). ADR-006 sudah Accepted, tinggal rincian implementasi.

## Utang Teknis

- [ ] (kosong)
