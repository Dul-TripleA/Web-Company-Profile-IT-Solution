# Progress

Catatan status pekerjaan terkini. Beda dengan `ROADMAP.md` (rencana), file ini mencatat **apa yang sudah dan sedang dikerjakan**. Agent wajib memperbarui file ini di akhir setiap sesi/tugas yang mengubah repo.

## Status Saat Ini

- **Fase aktif**: Fase 3 (Admin tahap 1) selesai di kode; Fase 1 tinggal deploy
- **Terakhir diperbarui**: 2026-10-17
- **Sedang dikerjakan**: tidak ada
- **Blocker**: keputusan hosting dan akses akun (deploy, domain, Search Console). Notifikasi email (Resend) **ditunda tetapi penting**, lihat bagian di bawah

## Ditunda tetapi Penting (wajib dibereskan sebelum rilis)

Item di sini sengaja ditunda pemilik repo, bukan dilupakan. **Agent wajib mengingatkan pemilik repo tentang daftar ini sebelum deploy produksi.**

| Item | Mengapa penting | Keadaan | Cara melanjutkan |
| --- | --- | --- | --- |
| **Notifikasi email via Resend** (dinyatakan penting oleh pemilik repo, 2026-10-17) | Tanpa ini pesan dari form kontak tersimpan di database tetapi **pemilik tidak diberi tahu**; calon klien bisa tak terjawab karena tidak ada yang mengecek database. | Kode sudah siap dan diuji dengan `fetch` palsu. Belum diuji ke Resend nyata; akun dan kunci API belum dibuat. Form tetap berfungsi (menyimpan ke Neon) tanpa ini. | 1) Daftar di resend.com dengan `andiazizp123@gmail.com`. 2) Buat API key. 3) Isi `RESEND_API_KEY`, `CONTACT_TO_EMAIL=andiazizp123@gmail.com`, `CONTACT_FROM_EMAIL=Do It <onboarding@resend.dev>` di `.env` (jangan kosongkan salah satu). 4) Minta agent menjalankan uji kirim nyata (satu pesan lewat form, cek inbox dan spam, hapus baris uji). Di produksi: isi env yang sama di hosting; untuk mengirim ke alamat lain verifikasi domain di Resend dan ganti `CONTACT_FROM_EMAIL`. Detail: `docs/features/2_CONTACT.md`, ADR-012. |

Ditunda lainnya yang juga perlu diputuskan sebelum rilis (belum dinyatakan "penting" oleh pemilik repo; keterangan di sini saran agent): halaman legal (Privacy Policy, karena form mengumpulkan data pribadi), nomor telepon asli (saat ini dummy), akun sosial, bagian Tim di About, dan hosting/domain/Search Console.

## Langkah Berikutnya (untuk agent yang melanjutkan)

1. ~~Neon~~ selesai 2026-10-17 (migrasi diterapkan, form dan rate limit teruji). Pemilik repo: perbaiki `DATABASE_URL_UNPOOLED` di `.env` agar memakai host tanpa `-pooler` (koneksi langsung).
2. Pemilik repo: putuskan hal terbuka di dokumen fitur 1-3: isi halaman About, isi menu dropdown "Pages", nasib tautan Blog (404 sampai Fase 2), tautan sosial/telepon/email asli, keaslian testimoni.
3. Pemilik repo: putuskan hosting dan siapkan akun, lalu deploy (**sebelum deploy, ingatkan soal notifikasi email Resend di bagian "Ditunda tetapi Penting"**) (tugas non-fitur terakhir Fase 1): lihat daftar langkah di bawah. Setelah deploy, agent mengukur ulang Lighthouse di produksi, mengisi `NEXT_PUBLIC_SITE_URL`, dan menguji kirim form + email nyata.
4. ~~Fase 2 (Blog)~~ selesai di kode 2026-10-17. Pemilik repo: tulis 3-5 artikel peluncuran lewat `bun run db:studio`. Agent berikutnya: Fase 3 (Admin) atau teaser artikel di Home.
5. Tinjau ADR-010 (Cache Components) dan ADR-011 (jsdom v26).
6. Tambahkan nama fitur baru ke `FEATURES` di `eslint.config.mjs` saat membuat folder di `src/features/`.
7. Pemilik repo: push ke GitHub agar CI pertama kali jalan; buat commit pertama bila siap.

Kondisi repo saat ini: Fase 1 berjalan (lint, typecheck, test, build lolos), repositori git sudah di-init tanpa commit.

### Daftar langkah deploy (pemilik repo)

1. Pilih hosting (usulan agent: Vercel; Next.js 16 + Cache Components butuh runtime Node.js, dan Neon tersedia sebagai integrasi) dan hubungkan repositori.
2. Isi env produksi: `NEXT_PUBLIC_SITE_URL` (domain asli), `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `IP_HASH_SALT`, dan opsional tiga env Resend. Jalankan `bun run db:migrate` ke database produksi.
3. Arahkan domain; paksa HTTPS dan pilih satu hostname kanonik (`www` atau tanpa `www`).
4. Daftarkan situs di Google Search Console, kirim `https://<domain>/sitemap.xml`.
5. Ganti placeholder (testimoni, kontak, sosial) dan pastikan halaman legal ada.

## Topik yang Ditampung (dibahas bertahap bersama pemilik repo)

Dibahas satu per satu, dimulai dari Fase 1. Belum ada keputusan; **jangan mengubah kode atau konten berdasarkan daftar ini sebelum pemilik repo menyetujui**.

**1. Sisa Fase 1** (hasil audit 2026-10-17):
- Menunggu pemilik repo: deploy + domain + Search Console; project Neon; akun Resend dan alamat tujuan; konten asli (testimoni, kontak, sosial, About); daftar final layanan; halaman legal dan kebijakan retensi data IP; logo, gambar OG, domain final.
- Sudah dikerjakan (2026-10-17): favicon, manifest, dan gambar OG; uji form tanpa JavaScript, validasi, dan honeypot di E2E; kebersihan dokumen fitur 1-4.
- Masih bisa dikerjakan agent tetapi **menunggu keputusan**: konten halaman layanan (±300 kata; bergantung keputusan konten); link sosial `href="#"` (butuh URL asli); uji kirim form sampai database dan rate limit (butuh Neon); tabel `redirects` (tunda sampai blog).
- Manual setelah ada URL publik: Rich Results Test, Lighthouse produksi, kirim sitemap.
- Kebersihan dokumen: pertanyaan terbuka dan `[TODO]` yang sudah terjawab oleh implementasi; checkbox "PROGRESS.md diperbarui".

**2. Konten landing page untuk usaha baru** (dibahas bertahap; kelompok 1-4 selesai 2026-10):
- Kelompok 1 (Top bar + Hero) **selesai**; keputusan ada di `docs/features/1_LANDING_PAGE.md` bagian 12. Kelompok 2 (Our Approach, Why Choose Us, Services) **selesai**, keputusan di bagian 12 yang sama. Kelompok 3 (Tech Stack, Workflow) **selesai**. Kelompok 4 (Reviews, Footer, sosial) **selesai**: Reviews dan semua ikon sosial disembunyikan, footer dipertahankan. Halaman legal belum ada.
- Cara menyembunyikan: dikomentari dengan tanda `DISEMBUNYIKAN (alasan, tanggal)`, bukan dihapus (`AGENTS.md`, Konvensi Singkat).
- Daftar saran awal di bawah ini tetap berlaku untuk kelompok 2-4:
- Klaim tanpa data yang sebaiknya tidak tampil: badge "4.9 ★ 5K+ Reviews", "one of the best software houses in Indonesia", statistik di Why Choose Us (10K+ works, 100+ clients, 12+ regions, 200+ projects, 98%), "trusted by government agencies", 3 testimoni bernama + rating 4.9/120+ ulasan, janji "24/7 monitoring"/"pentest", teknologi yang belum benar-benar dipakai.
- Saran per section: pertahankan Hero (tanpa rating), Core Services, Tech Stack (dipangkas), Workflow, Footer, dan top bar (ganti kalimat). Hapus "Our Approach" (duplikat Services) dan Reviews (sampai ada testimoni asli). Ubah "Why Choose Us" menjadi komitmen tanpa angka.
- Tambahan yang disarankan: artikel terbaru (setelah Fase 2), "Tentang kami" singkat dengan foto asli, studi kasus bila ada proyek nyata.
- Urutan usulan: Hero, Alasan memilih kami, Layanan, Tech stack, Workflow + CTA, Artikel terbaru, Footer.
- Pertanyaan yang menentukan: ada proyek/klien nyata yang boleh disebut? ada foto asli? teknologi apa yang benar-benar dikuasai? layanan mana yang siap dikerjakan sekarang?
- Aturan yang disarankan: setiap angka/klaim harus punya sumber yang bisa ditunjukkan; bila belum, tulis komitmen, bukan pencapaian.

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

### 2026-10-17: Fase 3 Admin (tahap 1)

- Selesai: login multiuser di database: tabel `users` (id, email, username, nama, password scrypt) dan `sessions` (token acak di cookie, hash-nya di DB), batas 5 gagal/15 menit lewat `admin_login_attempts` (migrasi `0002`, `0003` diterapkan ke Neon); `src/features/admin` (aksi dan query artikel, kategori, pesan; form; skema Zod); route `/admin/*` dengan layout akar sendiri; skrip `bun run admin:create` untuk membuat akun (password tersembunyi saat diketik); helper IP dipindah ke `src/lib/ip.ts`; `not-found.tsx` menyesuaikan `locale` yang kini opsional (dua layout akar). Keputusan di ADR-017 dan `features/6_ADMIN.md`. Draf pertama (satu admin dari `.env` + cookie HMAC) diganti atas permintaan pemilik repo karena membingungkan dan tidak multiuser; tidak ada lagi variabel env admin.
- Temuan: `getCurrentUser()` wajib memanggil `connection()` lebih dulu; tanpa itu hasil "belum login" ikut terpanggang ke halaman statis saat build sehingga login selalu gagal.
- Verifikasi: lint, typecheck, 108 tes unit, `bun run build`, Playwright penuh (184 lolos) termasuk `admin.spec.ts` (akses tanpa sesi, token palsu, password salah, penguncian, login dengan username, sesi lama ditolak setelah keluar, cookie, buat/ubah/draft/hapus artikel dan efeknya di situs publik, kategori, axe semua halaman admin). E2E membuat akun uji `zz_e2e_admin` di database lalu menghapusnya.
- Belum selesai / catatan: belum ada akun admin sungguhan (pemilik repo menjalankan `bun run admin:create`); belum ada upload gambar, halaman kelola pengguna, peran, reset password, redirect saat slug berubah, atau deteksi konflik edit. Resend masih ditunda (wajib sebelum rilis).
- Berikutnya: pemilik repo membuat akun admin dan artikel awal; lalu deploy (ingatkan Resend), atau halaman kelola pengguna / Fase 4.

### 2026-10-17: Fase 2 Blog

- Selesai: tabel `categories`/`posts` + migrasi `0001_clean_clea` (diterapkan ke Neon); `features/blog` (query ter-cache, RSS, waktu baca, komponen); route `/blog`, `/blog/page/[n]`, `/blog/category/[slug]`, `/blog/[slug]`, `/blog/rss.xml`; `components/shared/markdown.tsx` (react-markdown) dan `pagination.tsx`; `buildMetadata` (tanpa hreflang, waktu artikel, RSS) + `blogPostingJsonLd`; sitemap memuat artikel/kategori; `SiteHeader` dibungkus Suspense (+ fallback); tautan Markdown memakai `text-forest` (kontras). Keputusan di ADR-016 dan `features/5_BLOG.md`.
- Verifikasi: lint, typecheck, 96 tes unit, `bun run build` (juga tanpa env DB), Playwright penuh (desktop + mobile) termasuk `blog.spec.ts` dengan data uji berawalan `zz-e2e-` yang dipasang/dihapus `global-setup/teardown` (dilewati bila tanpa `DATABASE_URL`).
- Belum selesai / catatan: tidak ada artikel nyata; Rich Results Test, `EXPLAIN` pada data nyata, dan Lighthouse artikel belum dijalankan. Slug tak dikenal berstatus 200 + `noindex`. E2E blog menyentuh database di `.env` (hanya baris `zz-e2e-`). Resend masih ditunda (wajib sebelum rilis).
- Berikutnya: tulis artikel awal; lalu Fase 3 (Admin) atau deploy.

### 2026-10-17: Resend dicatat sebagai ditunda tetapi penting

- Selesai: commit dan push (`f41f2cc`, `f7a17ee`, `baa2c61`; branch `feat/nextjs-layout` sejajar dengan `origin`). Atas permintaan pemilik repo, notifikasi email Resend dicatat sebagai **ditunda tetapi penting, wajib sebelum rilis**: bagian baru "Ditunda tetapi Penting" di atas, tugas di `ROADMAP.md`, status di `docs/features/2_CONTACT.md`, baris di `README.md`, dan pengingat untuk agent di `AGENTS.md`.
- Verifikasi: hanya perubahan dokumen; `format:check` lolos.
- Berikutnya: akun Resend saat pemilik repo siap, lalu uji kirim nyata; deploy/domain.

### 2026-10-17: Konten halaman About

- Selesai: `/about` memakai usulan yang disetujui: hero (tagline + komitmen), paragraf "Siapa Kami", 3 layanan, proses kerja (Approach), dan ajakan konsultasi; Workflow dan Why Choose Us tidak lagi dipakai di About. Deskripsi SEO About diganti (klaim lama dihapus). Terjemahan id dan en lengkap. Tes E2E baru untuk isi About dan ketiadaan klaim lama.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, 67 tes unit, Playwright 125 lulus / 0 gagal. Tampilan dilihat langsung.
- Ditunda: bagian Tim, tahun berdiri, lokasi (belum ada data); halaman legal; hosting/domain.
- Menunggu pemilik repo: akun Resend dan 3 variabel di `.env` (lalu agent menjalankan uji kirim email nyata).
- Berikutnya: Resend (setelah kunci tersedia), lalu deploy/domain bila siap.

### 2026-10-17: Diagnosis email, email asli dan telepon dummy

- Selesai: log diagnosis notifikasi email (hanya status HTTP + jenis galat, tanpa alamat) dan tesnya; email asli `andiazizp123@gmail.com` dan telepon dummy ditampilkan kembali (top bar, hero, kartu kontak `/contact` dua kolom); `telephone` tetap tidak dikirim ke JSON-LD. Tes E2E disesuaikan.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, 67 tes unit, Playwright 123 lulus / 0 gagal.
- Menunggu pemilik repo: akun Resend, kunci API, dan 3 variabel di `.env` (lihat `docs/features/2_CONTACT.md`); lalu agent menjalankan uji kirim nyata. Konten About (lihat usulan di sesi ini). Hosting/domain (nanti). Halaman legal (ditunda).
- Berikutnya: konten About.

### 2026-10-17: Neon tersambung, migrasi, uji form ke database nyata

- Selesai: `.env` diperiksa tanpa menampilkan nilai (DATABASE_URL, DATABASE_URL_UNPOOLED, IP_HASH_SALT terisi; Resend belum diisi). Migrasi `0000_*` diterapkan ke Neon (`bun run db:migrate`). Skema diverifikasi langsung: 9 kolom dan 3 index sesuai `schema.ts`. Uji lewat browser: 3 pesan tersimpan dengan benar (`ip_hash` berupa hash), pesan ke-4 ditolak batas kirim; data uji dihapus (0 baris tersisa), berkas uji sementara dihapus.
- Temuan: `DATABASE_URL_UNPOOLED` di `.env` ternyata alamat **pooled** (ada `-pooler`). Untuk migrasi saya turunkan alamat langsung di memori saja; `.env` tidak diubah. Perlu diperbaiki pemilik repo (README dan `.env.example` sudah menjelaskan).
- Verifikasi (dijalankan, lolos): migrasi, pemeriksaan skema, uji kirim 4 pesan di Neon nyata, `build`.
- Tidak diverifikasi: email notifikasi ke Resend (belum ada kunci), perilaku di produksi (hosting nyata, header `x-forwarded-for`).
- Catatan: rate limit memakai IP dari `x-forwarded-for`/`x-real-ip`; di lokal semua permintaan memakai nilai `unknown`, di hosting nyata perlu dipastikan header itu diisi platform.
- Berikutnya: akun Resend (opsional), deploy/domain, konten About, halaman legal.

### 2026-10-17: Logo resmi, email/telepon/legal disembunyikan

- Selesai: logo resmi (`public/images/logo`) dipakai di header dan footer; `logo-full.png` transparan dibuat otomatis dari `doit_logo.png`, favicon/ikon/manifest/OG dibuat ulang dari logo (skrip `docs/reference/make-brand-assets.cjs` ditulis ulang; `icon.svg` lama dihapus, diganti `icon.png`). Email (top bar, kartu kontak, JSON-LD), telepon (hero, kartu kontak, JSON-LD), dan tautan legal footer dikomentari dengan tanda `DISEMBUNYIKAN`; halaman `/contact` kini hanya form. Tes E2E baru: email/telepon/legal tidak tampil, JSON-LD tanpa telepon, logo termuat, kontak satu kolom.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, 67 tes unit, Playwright 123 lulus / 0 gagal (3 run berturut-turut). Tampilan header, footer, gambar OG, dan ikon dilihat langsung.
- Perubahan dari pemilik repo di luar sesi ini: `hero.jpg` dan `collaboration.jpg` diganti (hero lama menjadi `hero-2.jpg`, tidak dipakai); tidak disentuh.
- Belum: konten About, domain/hosting, Neon, Resend, email dan telepon asli, halaman legal.
- Berikutnya: daftar "menunggu pemilik repo".

### 2026-10-17: Konten kelompok 4 dan menu aktif

- Selesai: Reviews disembunyikan (import/pemakaian di `page.tsx`, item dropdown "Pages", tautan footer, semuanya dikomentari dengan tanda `DISEMBUNYIKAN`); footer dipertahankan; semua ikon sosial (top bar + footer) dikomentari. Menu navbar kini aktif mengikuti halaman dan section beranda yang sedang dibaca (`nav-active.ts`, desktop dan mobile, anak dropdown ikut ditandai). Tes: 14 tes unit baru untuk logika menu aktif; E2E untuk menu aktif (halaman, gulir section, dropdown, mobile) dan untuk Reviews/sosial yang tersembunyi.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, 67 tes unit, Playwright 117 lulus / 0 gagal (3 run berturut-turut). Tampilan menu aktif dan footer dilihat langsung.
- Belum: halaman legal (Privacy/Terms/Security), email dan telepon asli, logo resmi, gambar OG/`meta.title` yang masih memakai kalimat lama.
- Berikutnya: lanjut ke daftar "menunggu pemilik repo" (Neon, Resend, deploy/domain, konten About, halaman legal, logo).

### 2026-10-17: Konten kelompok 3 (Tech Stack dan Workflow)

- Selesai: Tech Stack dibiarkan. Workflow dipertahankan dengan teks baru yang selaras dengan Our Approach (4 langkah, fase memakai nama langkah Approach); semua janji yang tidak bisa dipenuhi diganti (pentest, 24/7, backup harian, CI/CD, pelatihan, "dampak terukur", "konsultasi 30 menit dengan solutions architect"), termasuk kartu ajakan. Terjemahan Indonesia ditulis agent. Tes E2E ditambah agar frasa janji lama tidak muncul lagi. Penyempurnaan Our Approach (ikon + kartu kaca) ikut selesai; regresi scroll horizontal di mobile akibat cahaya dekoratif ditangkap tes dan diperbaiki.
- Stabilitas tes: Playwright dibatasi 4 worker lokal (2 di CI). Dengan 16 worker, tes gagal acak di tempat yang berpindah-pindah; setelah dibatasi, 4 run berturut-turut hijau.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, 53 tes unit, Playwright 111 lulus / 0 gagal (4 run).
- Berikutnya: kelompok 4 (Reviews, Footer, halaman legal).

### 2026-10-17: Konten kelompok 2 (Our Approach, Why Choose Us, Services)

- Selesai: Our Approach diganti proses 4 langkah; Why Choose Us memakai 3 komitmen (statistik, kartu "10K+", daftar 6 poin, dan tombol portofolio dikomentari dengan tanda `DISEMBUNYIKAN`); Services menjadi 3 layanan (Web Development, Custom Software Development, UI/UX Design) dengan baris cakupan. Versi lama disimpan utuh: `approach-bento.tsx`, `core-services-bento.tsx`, `services-hidden.ts`, kamus `home.approachBento`. Teks `id` dan `en` lengkap; deskripsi meta dan halaman `/services` disesuaikan; halaman detail layanan menampilkan cakupan. Tes E2E diperbarui dan ditambah (3 layanan di beranda, layanan tersembunyi 404 dan tidak di sitemap, klaim statistik/portofolio tidak tampil).
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, 53 tes unit, Playwright 111 lulus / 0 gagal. Tampilan desktop dan mobile dilihat langsung (satu crop foto diperbaiki).
- Keputusan sendiri yang perlu ditinjau: terjemahan Indonesia, header section Services, slug layanan baru, foto potret stok. Detail di `docs/features/1_LANDING_PAGE.md` bagian 12.
- Perubahan dari pemilik repo di luar sesi ini: `src/content/tech-stack.ts` (AWS dan MongoDB dihapus dari daftar).
- Penyempurnaan Our Approach: ikon per langkah (`ClipboardIcon` baru + ikon yang sudah ada) dan kartu bergaya kaca bergradasi halus (lihat `DESIGN_SYSTEM.md`). Pemilik repo ikut menyetel kelas gradasi kartu; versi itu dipertahankan.
- Berikutnya: kelompok 3 (Tech Stack, Workflow). Perhatikan tumpang tindih Workflow dengan Our Approach.

### 2026-10-17: Konten kelompok 1 (Top bar dan Hero)

- Selesai: kalimat top bar diganti; badge rating hero dan awalan merek pada deskripsi disembunyikan (dikomentari, tanda `DISEMBUNYIKAN`); judul dan deskripsi hero diganti sesuai keputusan pemilik repo (ID dan EN). Aturan "menyembunyikan, bukan menghapus" ditambahkan ke `AGENTS.md` dan `CODE_STYLE.md`. Tes E2E baru: klaim tanpa bukti tidak tampil, dan hero memakai teks baru.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, 53 tes unit, Playwright 117 lulus / 0 gagal. Tampilan hero dilihat langsung.
- Belum: kelompok 2-4; gambar OG dan `meta.title` masih memakai kalimat lama (menunggu tahap branding).
- Berikutnya: bahas kelompok 2 (Our Approach, Why Choose Us, Services).

### 2026-10-17: Sisa Fase 1 yang bisa dikerjakan agent

- Selesai: favicon (SVG + ICO + apple-icon), manifest, ikon 192/512, dan gambar OG default 1200x630 dari logo template; `buildMetadata` memakai gambar OG bawaan dan kartu Twitter besar. Skrip pembuat ulang aset: `docs/reference/make-brand-assets.cjs` (Playwright + Chrome, tanpa dependency baru). Tes form kontak di E2E: galat per kolom + isian dipertahankan, honeypot, dan **form tanpa JavaScript** (validasi server berjalan). Tes ikon/manifest/OG. Dokumen fitur 1-4 dirapikan (checklist, pertanyaan terjawab, `[TODO]` basi).
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, `test` (6 berkas, 53 tes), Playwright 113 lulus / 0 gagal (3 run berturut-turut). Gambar OG dan ikon dilihat langsung.
- Tidak dikerjakan (menunggu keputusan/akun): konten layanan ±300 kata, link sosial asli, kirim form sampai database dan rate limit, tabel `redirects`, deploy.
- Berikutnya: lihat "Langkah Berikutnya".

### 2026-10-17: Fase 1 tugas non-fitur (404/error, Lighthouse, perbaikan)

- Selesai: halaman 404 dan error bermerek dua bahasa (`[locale]/not-found`, `[locale]/error`, `global-not-found`, `global-error`, `components/shared/status-screen`, `i18n/boundary-copy`; ADR-015). Audit Lighthouse lokal 7 halaman (tabel di `TESTING.md`). Perbaikan dari temuan: hero memakai `preload` + `fetchPriority="high"` (`priority` deprecated di Next 16), tautan Blog `prefetch={false}` (sebelumnya memicu galat 404 di konsol setiap halaman), `h2` tersembunyi di `/services` (urutan heading), tes E2E tidak lagi memakai `networkidle`, dan server uji memakai `--keepAliveTimeout 65000` karena `page.goto` kadang gagal acak `net::ERR_ABORTED`.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, `test` (6 berkas, 51 tes), `build`, Playwright 107 lulus / 0 gagal (5 run berturut-turut hijau setelah perbaikan keep-alive; sebelumnya sekitar 2 dari 5 run gagal acak), Lighthouse (Perf 93-100, A11y 100, BP 100, SEO 100).
- Tidak diverifikasi: skor di produksi nyata (hosting/CDN), pemicu `error.tsx` dan `global-error` di browser sungguhan (hanya diuji unit), jalur database dan email nyata.
- Belum dikerjakan: deploy produksi + domain + Search Console (butuh keputusan hosting dan akun pemilik repo).
- Berikutnya: lihat "Langkah Berikutnya".

### 2026-10-17: Keputusan tombol/email/Playwright, commit, perbaikan aksesibilitas

- Selesai: dua commit di branch `feat/nextjs-layout` (Fase 0, Fase 1; `.env` tidak ikut, tidak ada push). Keputusan: tap target 44px hanya untuk pointer kasar (ADR-014); email lewat Resend REST + `fetch` (ADR-012, `features/contact/notify.ts`, env opsional); Playwright + axe dipasang (ADR-013, `tests/e2e`, `playwright.config.ts`, skrip `test:e2e`, langkah CI). Perbaikan yang ditemukan tes: token `brand-ink` untuk teks hijau di latar terang (kontras), ikon sosial SVG (label-content-name-mismatch), target ≥ 24px, CTA header tidak lagi meluber di layar kecil, tinggi menu mobile memperhitungkan top bar.
- Verifikasi (dijalankan, lolos): `lint`, `typecheck`, `test` (5 berkas, 45 tes), `build`, dan Playwright 103 lulus / 0 gagal / 23 dilewati sesuai desain (desktop dan mobile Pixel 7: redirect, h1, bahasa, sitemap/robots/metadata/JSON-LD, dropdown + menu mobile, tap target, tanpa scroll horizontal, axe semua halaman). Screenshot mobile (contact, menu) diperiksa.
- Tidak diverifikasi: Lighthouse, jalur database form kontak, pengiriman email ke Resend nyata, form tanpa JavaScript, Rich Results Test, lebar 360px khusus.
- Catatan: slug layanan tak dikenal menghasilkan status 200 + `noindex` (batasan Cache Components, dicatat di ADR-010). Perubahan setelah dua commit di atas belum di-commit.
- `README.md` ditulis: panduan pengguna (status, placeholder), persiapan, alur kerja 9 langkah tiap perubahan, daftar perintah, tugas umum, database, env, pemecahan masalah.
- Berikutnya: lihat "Langkah Berikutnya".

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
