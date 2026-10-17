# AGENTS.md

Panduan untuk AI agent dan kontributor di repo **Do It**: landing page company profile + blog, fullstack di Next.js 16.
`CLAUDE.md` hanya mengimpor file ini. Edit aturan di sini saja.

> Status: TEMPLATE. Bagian bertanda `[TODO]` harus diisi/dikonfirmasi pemilik repo.

## Mulai Di Sini (untuk AI/agent baru)

Dokumen ini ditulis agar agent mana pun bisa melanjutkan pekerjaan tanpa riwayat percakapan sebelumnya. Anggap tidak ada konteks lain selain isi repo.

**Kondisi repo saat ini**: Fase 0 selesai (kecuali project Neon, tugas pemilik repo) dan Fase 1 berjalan: landing page, halaman About/Services/Contact, dan fondasi SEO sudah ada dengan tampilan mengikuti template Blade, dua bahasa `id`/`en`. Belum ada: database yang tersambung, email notifikasi, blog, admin, dan commit git. Status terbaru dan sisa pekerjaan ada di `docs/PROGRESS.md` serta catatan implementasi di tiap dokumen fitur.

**Urutan baca**

1. `AGENTS.md` (file ini).
2. `docs/PROGRESS.md`: sedang di mana, apa yang menghalangi, langkah berikutnya.
3. `docs/DECISION.md`: apa yang sudah diputuskan (status `Accepted`) dan yang masih terbuka (`Proposed`).
4. Dokumen fitur di `docs/features/` untuk pekerjaan yang akan dikerjakan, lalu dokumen teknis yang relevan (lihat peta di bawah).

**Dokumentasi Next.js**: versi terpasang (16.4) membawa dokumentasinya di `node_modules/next/dist/docs/` (mis. `01-app/02-guides/internationalization.md`). API Next.js 16 berbeda dari yang umum diingat; baca dokumen itu sebelum memakai API yang kurang pasti, jangan mengandalkan ingatan.

**Arti penanda**

- `[TODO]`: belum diputuskan/diisi pemilik repo. **Jangan mengarang isinya.** Tawarkan opsi atau tanya.
- `Status: Draft` pada dokumen fitur: belum disetujui; konfirmasi scope sebelum membangun.
- ADR `Proposed`: usulan, belum final. ADR `Accepted`: final, patuhi. ADR `Superseded`: abaikan, ikuti penggantinya.
- `usulan` / `contoh`: pola yang disarankan, bukan kode yang sudah ada.

**Bila dokumen saling bertentangan**, urutan prioritas: instruksi langsung dari pemilik repo → ADR `Accepted` → dokumen fitur (untuk perilaku fitur itu) → `AGENTS.md` → dokumen teknis lain. Jangan diam-diam memilih; laporkan pertentangannya, lalu perbaiki dokumen yang salah.

**Sudah diputuskan (jangan diperdebatkan ulang)**: situs dua bahasa `id` + `en`; Next.js 16 App Router + TypeScript; Tailwind v4 dengan token `@theme`; Bun sebagai package manager; Cache Components aktif (ADR-010); PostgreSQL (Neon) + Drizzle + `postgres.js`; konten blog Markdown di database; fitur terisolasi tanpa impor antar-fitur; library baru hanya bila fitur native tidak cukup.

**Masih terbuka**: mekanisme i18n dan strategi URL locale (rincian di ADR-006 dalam `DECISION.md`), library auth (ADR-005, baru dibutuhkan di Fase 3), parser Markdown + sanitizer, penyedia email, rate limiting, hosting final, daftar layanan dan konten About, keaslian testimoni.

**Referensi desain**: salinan template sumber ada di `docs/reference/welcome.blade.php` (Laravel Blade + Tailwind; hanya bacaan, jangan diedit atau dijalankan, bukan bagian build). Rangkumannya sudah di `docs/DESIGN_SYSTEM.md`; buka file aslinya hanya untuk detail yang belum tercakup (mis. section "Comprehensive Solution", baris 380-558). Aslinya ada di `C:\WANGDEF\Web-Company-Profile-IT-Solution\resources\views\welcome.blade.php`; file `DESIGN.md` di proyek lama itu **bukan** acuan (palet cyan, tidak cocok dengan template).

**Bahasa**: dokumen ditulis dalam Bahasa Indonesia; kode, nama file, identifier, dan commit dalam Bahasa Inggris. Balas pemilik repo dalam Bahasa Indonesia.

**Sebelum mengakhiri sesi** (wajib, karena agent berikutnya hanya punya file): perbarui `docs/PROGRESS.md` (entri log, "Status Saat Ini", "Langkah berikutnya"), centang `docs/ROADMAP.md` dan "Kriteria selesai" di dokumen fitur bila relevan, dan catat keputusan baru di `docs/DECISION.md`. Pekerjaan yang setengah jalan harus ditulis eksplisit: apa yang selesai, apa yang belum, dan di file mana.

## Ringkasan Proyek

- **Produk**: situs company profile software house "Do It" (landing page) + blog.
- **Stack**: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4, Bun (package manager).
- **Data**: PostgreSQL (Neon) + Drizzle ORM dengan driver `postgres.js`. Konten blog berupa Markdown di database. Lihat `docs/DATABASE.md`.
- **Backend**: fullstack di Next.js (Server Components, Server Actions, Route Handlers). Tidak ada service terpisah.
- **Sumber desain**: template HTML lama, salinannya di `docs/reference/welcome.blade.php`, sudah dirangkum di `docs/DESIGN_SYSTEM.md`.
- **Bahasa konten**: dua bahasa, Indonesia (`id`) dan Inggris (`en`), lewat i18n (ADR-006). Teks UI tidak di-hardcode; ambil dari kamus terjemahan. Bahasa kode, nama file, dan commit: Inggris.

## Peta Dokumentasi

Baca dokumen yang relevan **sebelum** mengubah kode di areanya.

| Dokumen                   | Isi                                                           | Baca saat                                                            |
| ------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| `docs/PRD.md`             | Tujuan, target user, fitur, scope                             | Menambah/mengubah fitur                                              |
| `docs/ARCHITECTURE.md`    | Struktur folder, rendering, data flow                         | Menambah modul, route, atau layer baru                               |
| `docs/DESIGN_SYSTEM.md`   | Token warna, tipografi, komponen, pola section                | Menyentuh UI apa pun                                                 |
| `docs/CODE_STYLE.md`      | Konvensi kode, naming, SEO, a11y                              | Menulis kode apa pun                                                 |
| `docs/DATABASE.md`        | Skema, migrasi, query                                         | Menyentuh data/blog                                                  |
| `docs/SECURITY.md`        | Validasi input, auth, secret, header                          | Form, API, admin, env                                                |
| `docs/TESTING.md`         | Strategi dan perintah test                                    | Sebelum menandai tugas selesai                                       |
| `docs/DECISION.md`        | Log keputusan arsitektur (ADR)                                | Sebelum mengubah keputusan lama                                      |
| `docs/ROADMAP.md`         | Fase dan prioritas                                            | Memilih apa yang dikerjakan berikutnya                               |
| `docs/features/N_NAMA.md` | Mini PRD per fitur: tujuan, scope, perilaku, kriteria selesai | **Sebelum** mengerjakan fitur itu, dan saat mengubah perilakunya     |
| `docs/PROMPTS.md`         | Contoh prompt untuk pemilik repo (opsional bagi agent)        | Tidak perlu dibaca untuk mengerjakan tugas                           |
| `docs/PROGRESS.md`        | Status terkini, log pekerjaan, blocker                        | **Awal** sesi (lanjutkan dari mana) dan **akhir** sesi (catat hasil) |

Kalau kode dan dokumen bertentangan, jangan diam-diam pilih salah satu. Tanyakan, lalu perbarui dokumennya di perubahan yang sama.

## Dokumen Fitur (Mini PRD)

Setiap fitur punya satu spesifikasi di `docs/features/`, bernama `N_NAMA.md` (`N` = urutan pengerjaan, contoh `1_LANDING_PAGE.md`, `5_BLOG.md`). Template: `docs/features/_TEMPLATE.md`.

- **Sebelum mengerjakan fitur**: baca dokumennya. Bila belum ada, buat dari template dan minta pemilik repo mengonfirmasi scope-nya dulu.
- **Dokumen fitur adalah sumber kebenaran perilaku fitur** (apa yang harus terjadi, kriteria selesai). `docs/PRD.md` hanya gambaran besar; arsitektur tetap di `docs/ARCHITECTURE.md`.
- **Jangan melebihi scope** yang tertulis. Hal di bagian "Di luar scope" tidak dikerjakan tanpa persetujuan.
- **Ubah perilaku = ubah dokumennya** di perubahan yang sama. Kode dan dokumen tidak boleh berbeda.
- **Selesai** berarti semua "Kriteria selesai" terpenuhi dan terverifikasi. Centang di dokumen fitur, lalu catat di `docs/PROGRESS.md`.
- Satu dokumen fitur tidak selalu sama dengan satu folder `src/features/`. Landing page adalah rakitan `components/sections`; blog dan contact punya folder fitur sendiri.
- **Roadmap = indeks, dokumen fitur = detail.** `docs/ROADMAP.md` hanya memuat daftar fitur per fase dengan tautan dan status, plus tugas non-fitur. Jangan menyalin checklist fitur ke roadmap atau sebaliknya. Fitur baru: buat dokumennya, lalu tambahkan satu baris di tabel roadmap. Ubah `Status:` di dokumen fitur dan di roadmap bersamaan.
- **Bagian wajib terisi sebelum fitur dikerjakan**: Tujuan, Scope, Perilaku, Kriteria selesai. Bagian lain boleh "Tidak ada" bila tidak relevan.
- Dokumen fitur tidak menyalin isi dokumen lain. Tautkan ke `DESIGN_SYSTEM.md`, `DATABASE.md`, dan sebagainya.

## Progres

- Di **awal** sesi, baca `docs/PROGRESS.md` untuk tahu status terakhir dan blocker.
- Di **akhir** setiap tugas yang mengubah repo, tambahkan entri log di `docs/PROGRESS.md` (selesai, verifikasi, sisa pekerjaan, langkah berikutnya) dan perbarui "Status Saat Ini". Centang item terkait di `docs/ROADMAP.md`.
- Jangan menulis "selesai" untuk hal yang belum diverifikasi. Tulis apa yang dijalankan dan hasilnya.

## Perintah

Package manager: Bun. Skrip lengkap ada di `package.json`.

```sh
bun install        # install dependency
bun run dev            # dev server (Turbopack)
bun run build          # production build
bun run start          # jalankan hasil build
bun run lint           # ESLint
bun run typecheck      # next typegen + tsc --noEmit
bun run test           # unit/integration test
bun run test:watch     # Vitest mode watch
bun run format         # Prettier (kode saja; Markdown dikecualikan)
bun run format:check   # cek format tanpa mengubah file
bun run db:generate    # buat migrasi SQL dari skema Drizzle
bun run db:migrate     # terapkan migrasi
bun run db:studio      # Drizzle Studio
```

Belum ada: `test:e2e` (Playwright dipasang saat E2E pertama dibutuhkan) dan `db:seed` (dibuat saat ada data awal).

Gunakan `bun run test`, **bukan** `bun test`. Yang kedua menjalankan test runner bawaan Bun, bukan Vitest.

Definition of done: `bun run lint && bun run typecheck && bun run test && bun run build` lolos.

## Aturan Inti

1. **Server Component dulu.** Tambahkan `"use client"` hanya untuk interaktivitas (state, event handler, browser API), dan letakkan sedekat mungkin ke daun komponen.
2. **TypeScript strict, tanpa `any`.** Gunakan `unknown` + validasi Zod di batas sistem (form, API, env, query string).
3. **Pakai token desain, bukan nilai mentah.** Jangan tulis `#99e344` di komponen. Pakai token Tailwind (`bg-brand`). Lihat `docs/DESIGN_SYSTEM.md`.
4. **SEO bukan tambahan.** Setiap halaman wajib punya `metadata`/`generateMetadata`, satu `<h1>`, canonical, dan JSON-LD sesuai jenis halaman. Lihat `docs/CODE_STYLE.md`.
5. **Data hanya lewat data layer.** Komponen UI tidak memanggil ORM langsung. Alur: `components` → `features/*/queries|actions` → `lib/db`.
   5a. **Satu fitur, satu folder, terisolasi.** Kode milik satu domain ada di `src/features/<nama>/` (components, queries, actions, schema, types, test, README). **Fitur A tidak boleh mengimpor dari fitur B.** Bila dipakai ≥ 2 fitur, naikkan ke `components/shared`, `components/ui`, atau `lib/`. Detail dan anatomi: `docs/ARCHITECTURE.md` §2.
6. **Validasi di server.** Validasi client hanya untuk UX. Semua Server Action dan Route Handler memvalidasi ulang.
7. **Aksesibilitas.** HTML semantik, `alt` bermakna, fokus terlihat, kontras sesuai WCAG AA, target tap minimal 44px.
8. **Satu perubahan, satu tujuan.** Jangan refactor di luar scope tugas. Catat sebagai saran.
9. **Library seperlunya.** Pakai fitur Next.js/React dan JavaScript/Web API dulu. Library baru hanya bila itu tidak cukup. Lihat bagian "Aturan Dependency".
10. **SQL efisien.** Pilih kolom yang dibutuhkan, hindari N+1, pakai index dan paginasi keyset. Lihat `docs/DATABASE.md` §5.

## Aturan Dependency

Urutan pilihan sebelum menambah library:

1. **Fitur Next.js / React** (`next/image`, `next/font`, `next/link`, Metadata API, Server Actions, `useActionState`, `fetch` + cache, `sitemap.ts`).
2. **JavaScript / Web API / CSS bawaan** (`fetch`, `Intl.*`, `URL`, `URLSearchParams`, `structuredClone`, `crypto.randomUUID()`, `Array.prototype.toSorted`, CSS `:has()`, container query, `scroll-behavior`).
3. **Dependency yang sudah ada** di `package.json`.
4. **Library baru**, hanya bila 1-3 tidak bisa, atau menulis sendiri berisiko (kripto, auth, sanitasi HTML, parsing Markdown) atau jauh lebih mahal.

Contoh: tanggal pakai `Intl.DateTimeFormat`, bukan dayjs/moment. HTTP pakai `fetch`, bukan axios. Utilitas array/objek pakai JS native, bukan lodash. Animasi sederhana pakai CSS, bukan library animasi.

Sebelum menambah library baru: sebutkan alasan, alternatif native yang sudah dicek, dan ukuran/dampak bundle; minta persetujuan pemilik repo (lihat "Tawarkan Pilihan Dulu"). Library besar dicatat di `docs/DECISION.md`. Daftar dependency yang sudah disetujui ada di `docs/CODE_STYLE.md` §9.

## Tawarkan Pilihan Dulu

Sebelum mengerjakan tugas yang mengandung **pilihan teknis** (library, tool, layanan eksternal, pola arsitektur, skema data), **berhenti dan tanyakan dulu**:

- Beri 2-4 opsi, tiap opsi dengan trade-off singkat.
- Tandai satu sebagai rekomendasi beserta alasannya.
- Tunggu pemilik repo memilih, baru kerjakan. Catat pilihannya di `docs/DECISION.md` bila dampaknya besar.

Tidak perlu bertanya bila: hanya ada satu cara yang wajar, sudah diputuskan di `docs/DECISION.md` atau dokumen lain, atau perubahannya sepele dan mudah dibalik.

## Konvensi Singkat

- File/folder: `kebab-case`. Komponen: `PascalCase` (nama export), file `kebab-case.tsx`.
- Path alias: `@/*` → `src/*`. Hindari import relatif lebih dari satu level naik (`../../`).
- Komentar hanya untuk **mengapa**, bukan **apa**. Jangan komentari kode yang sudah jelas.
- Commit: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Detail lengkap: `docs/CODE_STYLE.md`.

## Jangan

- Jangan commit `.env*` (kecuali `.env.example`), kunci API, atau data pribadi.
- Jangan pakai `dangerouslySetInnerHTML` tanpa sanitasi. Satu-satunya pengecualian: JSON-LD yang di-serialize dari objek kita sendiri.
- Jangan tambah library baru sebelum mengikuti "Aturan Dependency" di atas.
- Jangan menulis SQL mentah dengan string concatenation. Pakai query builder Drizzle atau `sql` template yang ter-parameter.
- Jangan pakai `<img>` mentah. Pakai `next/image`. Jangan load font lewat `<link>`. Pakai `next/font`.
- Jangan hapus atau menimpa konten/section yang ada tanpa persetujuan.
- Jangan ubah `docs/DECISION.md` entri lama. Tambah entri baru yang menggantikan.

## Saat Ragu

Tanya pemilik repo. Untuk hal sepele yang mudah dibalik (bukan pilihan teknologi), pilih default yang paling sederhana, jalankan, lalu sebutkan asumsinya di ringkasan pekerjaan. Pilihan teknologi selalu lewat "Tawarkan Pilihan Dulu".

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
