# Do It: Company Profile + Blog

Situs company profile software house **Do It** (landing page, layanan, kontak, dan nanti blog). Dibangun dengan Next.js 16, TypeScript, Tailwind v4, PostgreSQL (Neon) + Drizzle, dua bahasa (Indonesia dan Inggris).

README ini untuk **menjalankan, menguji, dan membangun**. Aturan kode, arsitektur, dan keputusan ada di folder [`docs/`](docs/) (peta lengkap di [`AGENTS.md`](AGENTS.md)).

## Daftar isi

1. [Panduan pengguna: status dan yang perlu Anda tahu](#1-panduan-pengguna-status-dan-yang-perlu-anda-tahu)
2. [Persiapan pertama kali](#2-persiapan-pertama-kali)
3. [Alur kerja setiap ada perubahan](#3-alur-kerja-setiap-ada-perubahan)
4. [Daftar perintah](#4-daftar-perintah)
5. [Tugas yang sering dilakukan](#5-tugas-yang-sering-dilakukan)
6. [Database](#6-database)
7. [Variabel environment](#7-variabel-environment)
8. [Bila ada masalah](#8-bila-ada-masalah)
9. [Memakai AI agent](#9-memakai-ai-agent)

---

## 1. Panduan pengguna: status dan yang perlu Anda tahu

### Sudah jalan

- Landing page, halaman About, Services (3 layanan), dan Contact, dengan tampilan mengikuti template Blade lama, dalam bahasa `id` dan `en`.
- SEO dasar: metadata, `hreflang`, JSON-LD, `sitemap.xml`, `robots.txt`.
- Form kontak: validasi, anti-spam (honeypot), batas 3 pesan per 10 menit per IP, simpan ke database, notifikasi email.
- Pengujian otomatis: unit (Vitest) dan E2E + aksesibilitas (Playwright, axe) di desktop dan mobile.
- Halaman 404 dan error bermerek dalam dua bahasa.

### Belum jalan atau belum diuji (jujur)

| Hal | Keadaan | Yang perlu dilakukan |
| --- | --- | --- |
| Database | Neon sudah tersambung dan migrasi pertama diterapkan. Form kontak menyimpan ke tabel `contact_messages` dengan batas 3 pesan per 10 menit per IP (teruji) | Belum ada inbox untuk membaca pesan (Fase 3); sementara lihat lewat `bun run db:studio` |
| Email notifikasi | **Ditunda, tetapi penting sebelum rilis.** Kode siap (Resend), belum ada akun dan belum diuji ke Resend nyata. Tanpa ini pesan tetap tersimpan di database, hanya Anda tidak diberi tahu | Daftar Resend, isi 3 variabel email di `.env`, lalu minta uji kirim ([bagian 7](#7-variabel-environment); langkah lengkap di `docs/PROGRESS.md`) |
| Blog | Ada: daftar, paginasi, kategori, artikel, RSS, sitemap. Artikel ditulis lewat `bun run db:studio` sampai admin (Fase 3) ada; panduan di `docs/features/5_BLOG.md` bagian 10. Belum ada artikel nyata | Isi 3-5 artikel peluncuran |
| Admin | Ada di `/admin`: login (tabel `users`, multiuser), artikel (buat/ubah/pratinjau/hapus), kategori, inbox pesan. Buat akun dengan `bun run admin:create` (langkah di `docs/features/6_ADMIN.md` bagian 6). Belum ada upload gambar dan halaman kelola pengguna | Buat akun admin pertama; upload menunggu keputusan hosting |
| Lighthouse | Sudah dijalankan lokal: Performance 93-100, Accessibility 100, Best Practices 100, SEO 100 (tabel di `docs/TESTING.md`). Belum diukur di produksi | Ukur ulang setelah deploy; cara menjalankan ada di `docs/TESTING.md` |

### Masih placeholder (ganti sebelum rilis)

- **Testimoni, nama, dan foto klien**: dari template, bukan klien asli. Section Reviews sudah disembunyikan; jangan diaktifkan sebelum ada testimoni asli.
- **Telepon**: masih dummy (nomor dari template) di `src/content/site.ts`; email sudah asli. **Ikon sosial dan tautan legal** disembunyikan (dikomentari) sampai ada akunnya/halamannya; aktifkan dengan membuka komentar `DISEMBUNYIKAN` (`grep -rn DISEMBUNYIKAN src`).
- **Halaman About**: sudah berisi paragraf Do It, layanan, proses, dan ajakan konsultasi; bagian Tim, tahun berdiri, dan lokasi belum ada (menunggu data asli).
- **Halaman Privacy Policy, Terms, Security**: belum ada; tautannya disembunyikan dari footer.
- Tombol "View Our Portfolio" mengarah ke `/services` (portofolio baru Fase 4).

### Hal yang perlu diketahui

- **Alamat situs**: tanpa awalan bahasa otomatis dialihkan ke `/id`. Bahasa Inggris di `/en`.
- **Slug layanan yang salah** (mis. `/id/services/ngawur`) menampilkan halaman 404 dengan status HTTP 200 dan tag `noindex`. Ini batasan Cache Components, bukan bug ([ADR-010](docs/DECISION.md)).
- **Tombol** persis template di desktop; di perangkat sentuh dibuat setinggi 44px agar mudah ditekan.
- **Teks hijau di latar terang** memakai hijau lebih gelap (`brand-ink`) daripada template karena lime asli tidak terbaca (kontras 1.9:1).
- **Git**: ada dua commit awal di branch `feat/nextjs-layout`. Belum ada remote, belum di-push, dan perubahan terbaru (E2E, email, perbaikan aksesibilitas) belum di-commit.

### Dokumen yang menjelaskan lebih dalam

| Ingin tahu | Buka |
| --- | --- |
| Status terkini dan langkah berikutnya | [`docs/PROGRESS.md`](docs/PROGRESS.md) |
| Rencana per fase | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| Perilaku tiap fitur | [`docs/features/`](docs/features/) |
| Mengapa memilih teknologi X | [`docs/DECISION.md`](docs/DECISION.md) |
| Warna, font, komponen | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) |

---

## 2. Persiapan pertama kali

**Kebutuhan**: [Bun](https://bun.sh) ≥ 1.3, Node.js ≥ 20.9, Google Chrome (untuk tes E2E lokal), Git.

```sh
bun install                 # pasang dependency
cp .env.example .env        # lalu isi nilainya (lihat bagian 7)
bun run dev                 # buka http://localhost:3000
```

Tanpa database pun situs bisa dibuka dan dites. Hanya pengiriman form kontak yang butuh database.

---

## 3. Alur kerja setiap ada perubahan

Lakukan **berurutan**. Jangan lanjut ke langkah berikutnya bila satu langkah gagal.

| # | Langkah | Perintah | Kapan |
| --- | --- | --- | --- |
| 1 | Ubah kode, lihat hasilnya langsung | `bun run dev` | Selama mengerjakan |
| 2 | Rapikan format | `bun run format` | Sebelum cek |
| 3 | Cek gaya kode dan aturan impor | `bun run lint` | Selalu |
| 4 | Cek tipe TypeScript | `bun run typecheck` | Selalu |
| 5 | Jalankan tes unit | `bun run test` | Selalu |
| 6 | Pastikan bisa di-build | `bun run build` | Selalu |
| 7 | Jalankan tes E2E dan aksesibilitas | `bun run test:e2e` | Bila mengubah tampilan, navigasi, halaman, atau teks |
| 8 | Perbarui dokumen | edit `docs/` | Bila perilaku, keputusan, atau status berubah |
| 9 | Commit | `git commit` | Setelah semua di atas lolos |

**Definisi selesai**: langkah 3 sampai 6 lolos (dan 7 bila relevan). Hasil yang sama dijalankan otomatis oleh CI di GitHub.

Jalan pintas untuk langkah 3 sampai 6:

```sh
bun run lint && bun run typecheck && bun run test && bun run build
```

**Pesan commit** memakai awalan: `feat:` (fitur), `fix:` (perbaikan), `docs:`, `refactor:`, `test:`, `chore:`.

**Dokumen yang ikut diperbarui** (cukup yang relevan):

- Selesai mengerjakan sesuatu → catat di `docs/PROGRESS.md`.
- Perilaku fitur berubah → ubah `docs/features/N_NAMA.md`.
- Keputusan teknis penting → tambah entri baru di `docs/DECISION.md`.

---

## 4. Daftar perintah

| Perintah | Fungsi |
| --- | --- |
| `bun run dev` | Server pengembangan di `localhost:3000` |
| `bun run build` | Build produksi |
| `bun run start` | Menjalankan hasil build |
| `bun run lint` | ESLint (termasuk larangan impor antar-fitur) |
| `bun run typecheck` | Cek tipe TypeScript |
| `bun run test` | Tes unit Vitest sekali jalan |
| `bun run test:watch` | Tes unit mode pantau |
| `bun run test:e2e` | **Build lalu** tes Playwright (desktop + mobile, termasuk axe) |
| `bun run test:e2e:only` | Playwright tanpa build ulang (hanya bila `build` baru saja dijalankan) |
| `bun run format` | Prettier menulis ulang file kode |
| `bun run format:check` | Cek format tanpa mengubah file |
| `bun run db:generate` | Buat file migrasi SQL dari perubahan skema |
| `bun run db:migrate` | Terapkan migrasi ke database |
| `bun run db:studio` | GUI database (Drizzle Studio) |

> **Penting**: gunakan `bun run test`, **bukan** `bun test`. Yang kedua menjalankan test runner bawaan Bun, bukan Vitest.

---

## 5. Tugas yang sering dilakukan

### Mengubah teks di halaman

Teks tidak ditulis di komponen. Ubah di **kedua** file: `src/i18n/dictionaries/id.json` dan `en.json`. Kuncinya harus sama; tes unit akan gagal bila ada yang kurang. Judul halaman maksimal 60 karakter dan deskripsi 70-160 karakter (juga dites).

### Menambah atau mengubah layanan

Edit `src/content/services.ts`, isi `en` dan `id` (judul, deskripsi, cakupan). Halaman detail, menu, form kontak, dan sitemap otomatis ikut. Layanan lama yang disembunyikan ada di `src/content/services-hidden.ts`. Setelah itu jalankan langkah 3-7.

### Mengganti kontak atau tautan sosial

Edit `src/content/site.ts`.

### Mengganti logo, ikon, atau gambar OG

Taruh logo baru di `public/images/logo` dengan nama `doit_logo.png` (logo lengkap di latar gelap) dan `do_it_logo2.png` (lambang di latar putih), lalu jalankan `node docs/reference/make-brand-assets.cjs` (butuh Google Chrome). Skrip menulis ulang `public/images/logo/logo-full.png` (dipakai header dan footer), `src/app/favicon.ico`, `icon.png`, `apple-icon.png`, `public/icons/`, dan `public/og-default.png`.

### Mengganti warna atau font

Warna ada di `src/app/globals.css` (blok `@theme`). Pakai nama token (`bg-brand`, `text-forest`), bukan kode hex. Daftar token: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

### Menambah halaman atau fitur baru

1. Buat dokumen fitur dari `docs/features/_TEMPLATE.md` dan tambahkan ke tabel di `docs/ROADMAP.md`.
2. Bila fitur punya logika/data sendiri, buat `src/features/<nama>/` dan **daftarkan namanya** di daftar `FEATURES` di `eslint.config.mjs`. Fitur tidak boleh mengimpor fitur lain; kode bersama taruh di `src/components/shared` atau `src/lib`.
3. Halaman publik ditaruh di `src/app/[locale]/...` dan wajib punya `generateMetadata`, satu `<h1>`, serta teks `id` dan `en`.
4. Jalankan langkah 3-7 pada [alur kerja](#3-alur-kerja-setiap-ada-perubahan).

### Menjalankan satu tes saja

```sh
bunx vitest run src/lib/seo                         # unit, satu folder
bunx playwright test tests/e2e/navigation.spec.ts   # E2E, satu berkas
bunx playwright test --project=mobile               # E2E, hanya mobile
```

---

## 6. Database

Skema ada di `src/lib/db/schema.ts`; migrasi (file SQL) ada di `drizzle/` dan **di-commit**.

**Pertama kali** (setelah project Neon dibuat dan `.env` diisi):

```sh
bun run db:migrate
```

**Setiap mengubah skema**:

1. Edit `src/lib/db/schema.ts`.
2. `bun run db:generate` → membuat file baru di `drizzle/`.
3. **Baca file SQL-nya** sebelum lanjut, karena itu yang dijalankan di produksi.
4. `bun run db:migrate`.
5. Commit file skema **dan** file di `drizzle/`.

Jangan mengedit migrasi lama yang sudah di-commit; buat migrasi baru. Perubahan yang menghapus kolom/tabel dilakukan dua tahap (berhenti memakai dulu, hapus di rilis berikutnya). Detail: [`docs/DATABASE.md`](docs/DATABASE.md).

---

## 7. Variabel environment

Salin `.env.example` menjadi `.env`. **Jangan commit `.env`** (sudah diabaikan Git).

| Variabel | Wajib | Fungsi |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Tidak (default `http://localhost:3000`) | URL situs untuk canonical, sitemap, dan Open Graph. Isi domain asli di produksi, tanpa `/` di akhir |
| `DATABASE_URL` | Ya, untuk form kontak | Neon, endpoint **pooled** (host berakhiran `-pooler`) |
| `DATABASE_URL_UNPOOLED` | Ya, untuk `db:migrate` | Neon, koneksi **langsung**: host **tanpa** `-pooler`. Di dasbor Neon matikan opsi "Connection pooling" saat menyalin alamatnya |
| `IP_HASH_SALT` | Ya, untuk form kontak | Teks acak, minimal 16 karakter (untuk batas kirim per IP) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Tidak | Notifikasi email form kontak. Isi **ketiganya** atau biarkan ketiganya dikomentari. Nilai kosong dianggap salah |

---

## 8. Bila ada masalah

| Gejala | Penyebab dan cara mengatasi |
| --- | --- |
| `Env tidak valid. ... Lihat .env.example` | Ada variabel wajib yang kosong atau salah. Periksa `.env` ([bagian 7](#7-variabel-environment)) |
| Form kontak menampilkan "gagal kirim" | Database belum tersambung atau migrasi belum dijalankan ([bagian 6](#6-database)). Lihat log terminal |
| `bun run test` menjalankan hal aneh | Pastikan memakai `bun run test`, bukan `bun test` |
| Playwright: Chrome tidak ditemukan | Pasang Google Chrome, atau jalankan `bunx playwright install chromium` lalu ubah `channel` di `playwright.config.ts` |
| Playwright gagal karena port | Tes memakai port 3100. Hentikan proses lain di port itu |
| Tes E2E gagal padahal kode sudah benar | Hasil build usang. Gunakan `bun run test:e2e` (build ulang), bukan `test:e2e:only` |
| Build gagal soal `Suspense` atau akses data | Cache Components aktif: data yang diambil saat request harus dibungkus `<Suspense>` atau di-cache. Baca `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` |
| Lint menolak impor `@/features/...` | Fitur tidak boleh mengimpor fitur lain atau dari kode global. Pindahkan kode bersama ke `components/shared` atau `lib` |
| Tes aksesibilitas (axe) gagal | Baca pesan di terminal: nama aturan dan elemen yang bermasalah. Perbaiki di komponen, jangan menghapus tes |
| `db:migrate` gagal atau macet | Pastikan `DATABASE_URL_UNPOOLED` memakai host **tanpa** `-pooler` (koneksi langsung), bukan alamat pooled |
| Perubahan di `.env` tidak terbaca | Hentikan `bun run dev` lalu jalankan ulang |

---

## 9. Memakai AI agent

Repo ini disiapkan agar AI agent (mis. Claude Code) bisa melanjutkan pekerjaan tanpa riwayat percakapan. Aturannya ada di [`AGENTS.md`](AGENTS.md) (`CLAUDE.md` hanya mengimpornya). Contoh perintah siap tempel: [`docs/PROMPTS.md`](docs/PROMPTS.md). Awali sesi baru dengan:

```
Baca AGENTS.md lalu docs/PROGRESS.md. Ringkas status terakhir, blocker, dan langkah berikutnya.
```
 