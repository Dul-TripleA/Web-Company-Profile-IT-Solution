# Decision Log (ADR)

Catat keputusan arsitektur yang sulit dibalik. Format ringkas. Entri lama **tidak diedit**; bila keputusan berubah, tambah entri baru dengan status `Superseded by ADR-xxx` pada yang lama.

Status: `Proposed` (usulan, perlu konfirmasi) · `Accepted` · `Rejected` · `Superseded`.

## Templat

```md
## ADR-NNN: Judul

- Tanggal: YYYY-MM-DD
- Status: Proposed | Accepted | Superseded by ADR-xxx
- Konteks: masalah dan batasan.
- Opsi: A, B, C beserta trade-off singkat.
- Keputusan: pilihan dan alasan.
- Konsekuensi: yang jadi lebih mudah / lebih sulit.
```

---

## ADR-001: Next.js 16 fullstack (App Router) dengan TypeScript

- Tanggal: 2026-10-17
- Status: Accepted
- Konteks: Landing page + blog yang butuh SEO kuat, serta backend ringan (form, admin). Template awal berupa Laravel Blade + Tailwind.
- Opsi: (A) Next.js fullstack; (B) Next.js frontend + backend terpisah (Laravel); (C) Astro + CMS.
- Keputusan: A. Satu codebase, SSG/ISR untuk SEO dan performa, Server Actions menggantikan API terpisah untuk kebutuhan sederhana.
- Konsekuensi: Tim cukup satu stack (TypeScript). Beban backend besar di masa depan mungkin perlu dipisah; batasi dengan lapisan `features/` agar mudah diekstrak.

## ADR-002: Database dan ORM

- Tanggal: 2026-10-17
- Status: Superseded by ADR-008
- Konteks: Blog (artikel, kategori, tag), pesan kontak, user admin.
- Opsi: PostgreSQL + Prisma; PostgreSQL + Drizzle; SQLite/Turso; tanpa DB (file MDX).
- Keputusan sementara: PostgreSQL + Prisma (DX baik, migrasi matang). [TODO: konfirmasi, dan hosting DB.]
- Konsekuensi: Perlu hosting DB. Lihat ADR-003 bila blog cukup berbasis file.

## ADR-003: Penyimpanan konten blog

- Tanggal: 2026-10-17
- Status: Superseded by ADR-009
- Konteks: Penulis blog bisa developer saja atau juga non-teknis.
- Opsi: (A) MDX di repo, tanpa DB untuk blog; (B) Markdown/MDX di database + admin sendiri; (C) Headless CMS eksternal.
- Keputusan sementara: [TODO]. Jika penulis hanya developer: A (paling sederhana, gratis, versi lewat Git). Jika non-teknis perlu menulis lewat UI: B.
- Konsekuensi: Menentukan perlu tidaknya Fase 3 (admin) dan tabel `Post`.

## ADR-004: Tailwind CSS v4 dengan token di `@theme`

- Tanggal: 2026-10-17
- Status: Accepted
- Konteks: Template Blade sudah memakai Tailwind. Warna brand tersebar sebagai hex mentah (±165 kali `#99e344`).
- Keputusan: Tailwind v4, semua warna/font lewat token `@theme`; komponen memakai nama token. Lihat `DESIGN_SYSTEM.md` §8.
- Konsekuensi: Perubahan brand cukup di satu tempat.

## ADR-005: Autentikasi admin

- Tanggal: 2026-10-17
- Status: Proposed
- Opsi: Auth.js; Better Auth; sesi buatan sendiri. [TODO]
- Catatan: tunda sampai Fase 3. Jangan membuat sistem auth sendiri.

## ADR-006: Bahasa dan i18n

- Tanggal: 2026-10-17
- Status: Accepted (diputuskan pemilik repo)
- Konteks: Copy template berbahasa Inggris; target pasar Indonesia.
- Keputusan: Situs **dua bahasa, Indonesia (`id`) dan Inggris (`en`)**, dengan i18n sejak awal. Semua halaman publik hidup di segmen `app/[locale]/`; teks UI tidak di-hardcode di komponen, melainkan diambil dari kamus terjemahan per locale. SEO memakai `hreflang`, canonical per locale, dan sitemap yang memuat kedua versi.
- Konsekuensi: Setiap fitur dan halaman publik harus menyediakan teks `id` dan `en`. Konten blog dan layanan butuh strategi terjemahan. Routing, metadata, dan sitemap lebih kompleks dibanding satu bahasa.
- Rincian implementasi (dipilih pemilik repo, 2026-10-17):
  - Mekanisme: kamus JSON + helper sendiri (native, tanpa library i18n).
  - URL: kedua locale berprefiks, `/id/...` dan `/en/...`. Locale default `id`; `/` dialihkan ke `/id`.
  - Tanpa deteksi bahasa otomatis dari `Accept-Language`.
- Masih terbuka: konten blog, apakah satu artikel punya versi per bahasa (`locale` + grup terjemahan) atau boleh hanya satu bahasa.

## ADR-007: Bun sebagai package manager

- Tanggal: 2026-10-17
- Status: Accepted
- Konteks: Preferensi pemilik repo. Next.js 16 mendukung instalasi dan script lewat Bun.
- Keputusan: Bun untuk `install` dan menjalankan script (`bun run …`). Lockfile `bun.lock` di-commit. Runtime produksi mengikuti platform hosting (Node.js bila di Vercel), jadi jangan memakai API khusus Bun (`Bun.*`) di kode aplikasi.
- Konsekuensi: Instalasi cepat. Test memakai Vitest lewat `bun run test`, bukan test runner bawaan Bun. Verifikasi kompatibilitas library native (mis. `postgres.js`, `sharp`) saat scaffold.

## ADR-008: PostgreSQL (Neon) + Drizzle ORM + postgres.js

- Tanggal: 2026-10-17
- Status: Accepted (menggantikan ADR-002)
- Konteks: Blog, pesan kontak, dan user admin butuh database relasional. Pemilik repo ingin SQL yang efisien dan ORM yang dekat dengan SQL.
- Opsi: Driver `postgres.js` / `node-postgres` / Neon serverless; hosting Docker+VPS / Neon / Supabase.
- Keputusan: PostgreSQL di Neon, Drizzle ORM, driver `postgres.js` (ringan, tanpa dependensi native, jalan di Node dan Bun). Aplikasi memakai endpoint pooled dengan `prepare: false`; migrasi memakai koneksi unpooled.
- Konsekuensi: Query dekat dengan SQL dan bertipe aman; migrasi berupa file SQL yang bisa direview. Terikat Neon untuk hosting, tetapi tetap PostgreSQL standar sehingga bisa dipindah. Aturan SQL ada di `DATABASE.md` §5.

## ADR-009: Konten blog sebagai Markdown di PostgreSQL

- Tanggal: 2026-10-17
- Status: Accepted (menggantikan ADR-003). Pilihan paket parser/sanitizer masih terbuka.
- Konteks: Fullstack di Next.js; Drizzle sudah dipakai; penulis sebaiknya tidak perlu akses repo.
- Opsi: MDX di repo; Markdown di database; headless CMS.
- Keputusan: Markdown di kolom `posts.content`, dirender di server lalu disanitasi. Admin UI (Fase 3) dipakai untuk menulis.
- Konsekuensi: Perlu admin dan auth (Fase 3), tetapi mendukung draft, jadwal, kategori/tag lewat query. Tidak ada komponen React di dalam artikel. Parser Markdown dan sanitizer dipilih lewat "Tawarkan Pilihan Dulu".

## ADR-010: Cache Components aktif
- Tanggal: 2026-10-17
- Status: Accepted (bawaan scaffold `create-next-app` 16.4; dapat dibatalkan pemilik repo)
- Konteks: Scaffold mengaktifkan `cacheComponents: true` dan `partialPrefetching: true`. Dokumentasi Next menyatakan keduanya akan aktif di mana-mana pada major berikutnya.
- Opsi: (A) tetap aktif; (B) matikan dan memakai model caching lama (`export const revalidate`, `dynamic`).
- Keputusan: A, agar selaras dengan arah framework. Caching dipilih eksplisit dengan `"use cache"`, `cacheLife`, `cacheTag`; tag dibatalkan dengan `revalidateTag`.
- Konsekuensi: Butuh runtime Node.js (sesuai ADR-007). Akses data runtime harus dibungkus `<Suspense>` atau di-cache; config segmen lama (`dynamic`, `revalidate`, `runtime`) tidak dipakai. Halaman berdata (blog, admin) perlu dirancang dengan model ini sejak awal.

## ADR-011: Pin jsdom v26 untuk Vitest
- Tanggal: 2026-10-17
- Status: Accepted
- Konteks: `jsdom` 30 gagal dimuat di Node 20.20 (dependensi `undici` memakai API yang belum ada). Next.js 16 mendukung Node 20.9+.
- Keputusan: `jsdom@26`. Naikkan setelah lingkungan dev dan CI memakai Node 22+.
- Konsekuensi: Tes komponen jalan di Node 20. Sesuaikan versi Node di CI bila ingin memakai jsdom terbaru.

