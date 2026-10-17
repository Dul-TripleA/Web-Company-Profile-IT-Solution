# PRD: Do It Company Profile + Blog

> Status: TEMPLATE. Isi `[TODO]` oleh pemilik produk.

## 1. Tujuan

- Menampilkan Do It sebagai software house terpercaya di Indonesia dan mengubah pengunjung menjadi **lead** (konsultasi gratis).
- Menarik trafik organik lewat blog dan halaman layanan yang SEO-nya kuat.
- [TODO: target kuantitatif, mis. N lead/bulan, posisi 1-10 untuk kata kunci X dalam 6 bulan]

## 2. Target Pengguna

| Persona                        | Kebutuhan                             | Aksi utama                                |
| ------------------------------ | ------------------------------------- | ----------------------------------------- |
| Pemilik/manajer UKM-enterprise | Sistem custom, ERP, web app           | Isi form konsultasi / WhatsApp            |
| Calon klien teknis (CTO, PM)   | Bukti kapabilitas, tech stack, proses | Baca layanan, workflow, kontak            |
| Pembaca blog                   | Tutorial/insight teknologi            | Baca artikel, lalu lihat layanan          |
| Admin (internal)               | Kelola artikel dan lead               | Login, tulis/publish artikel, lihat pesan |

[TODO: tambah/hapus persona]

## 3. Scope

### Fase 1: Landing page (MVP)

Seluruh halaman publik tersedia dalam dua bahasa: Indonesia dan Inggris (ADR-006).

Section sesuai `docs/DESIGN_SYSTEM.md` §7: Hero, Our Approach, Comprehensive Solution, Services, Technology Stack, Workflow, Reviews, Footer.

- Form kontak/konsultasi (CTA "Free Consultation").
- SEO dasar: metadata, sitemap, robots, Open Graph, JSON-LD `Organization`.
- Responsif mobile-first.

### Fase 2: Blog

- Daftar artikel (paginasi), halaman artikel, kategori/tag, pencarian [TODO: perlu atau tidak].
- Artikel berformat Markdown di PostgreSQL (`DECISION.md` ADR-009).
- RSS feed, JSON-LD `BlogPosting`, estimasi waktu baca, artikel terkait.

### Fase 3: Admin

- Login admin, CRUD artikel (draft/publish/jadwal), upload gambar, daftar lead dari form.

### Di luar scope (saat ini)

- E-commerce / pembayaran.
- Akun pengguna publik, komentar. [TODO: konfirmasi]

## 4. Halaman

| Route                                       | Fase | Catatan                                                          |
| ------------------------------------------- | ---- | ---------------------------------------------------------------- |
| `/`                                         | 1    | Landing page                                                     |
| `/about`                                    | 1    | About Us [TODO: konten]                                          |
| `/services` dan `/services/[slug]`          | 1    | Halaman per layanan (untuk SEO long-tail) [TODO: daftar layanan] |
| `/contact`                                  | 1    | Form + info kontak                                               |
| `/blog`, `/blog/[slug]`                     | 2    |                                                                  |
| `/blog/category/[slug]`, `/blog/tag/[slug]` | 2    |                                                                  |
| `/admin/*`                                  | 3    | Tidak diindeks (`noindex`)                                       |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml`   | 1-2  | Generated                                                        |

## 5. Requirement Non-Fungsional

| Area          | Target                                                                           |
| ------------- | -------------------------------------------------------------------------------- |
| Performa      | Lighthouse mobile ≥ 90; LCP < 2.5s, INP < 200ms, CLS < 0.1                       |
| SEO           | Lighthouse SEO 100; semua halaman publik punya title, description, canonical, OG |
| Aksesibilitas | WCAG 2.2 AA; Lighthouse a11y ≥ 95                                                |
| Keamanan      | Lihat `docs/SECURITY.md`                                                         |
| Browser       | Dua versi terakhir Chrome, Edge, Firefox, Safari; iOS Safari, Android Chrome     |
| Hosting       | [TODO: Vercel / VPS / Docker]                                                    |

## 6. Metrik Keberhasilan

- Konversi form konsultasi.
- Trafik organik, jumlah halaman terindeks, CTR dari Search Console.
- Core Web Vitals (data lapangan).
- [TODO: tools analytics, mis. GA4 / Plausible / Umami]

## 7. Pertanyaan Terbuka

- [x] Bahasa konten: Indonesia + Inggris dengan i18n (`DECISION.md` ADR-006)
- [ ] Domain produksi dan hosting?
- [ ] Siapa yang menulis blog, dan berapa sering? (menentukan kebutuhan admin/CMS)
- [ ] Testimoni di template asli atau placeholder?
- [ ] Data kontak resmi (email, telepon, alamat, sosial media)?
- [ ] Logo dan aset brand final (saat ini ikon layer di lingkaran lime)?
