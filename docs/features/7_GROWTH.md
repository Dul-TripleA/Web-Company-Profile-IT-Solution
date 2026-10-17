# 7. Growth (Analytics, Newsletter, Portofolio)

> Status: Draft (belum dijadwalkan)
> Fase: 4
> Folder kode: [TODO: per sub-fitur; `src/features/newsletter/`, `src/features/portfolio/`]

Dokumen ini menampung fitur Fase 4. Pecah menjadi dokumen tersendiri (`8_NEWSLETTER.md`, dst.) saat salah satu mulai dikerjakan.

## 1. Tujuan

Mengukur dan menumbuhkan hasil situs setelah fondasi, landing page, dan blog berjalan.

## 2. Scope

**Termasuk (kandidat)**

- **Analytics & konversi**: pageview, klik CTA "Free Consultation", submit form kontak.
- **Newsletter / lead magnet**: form langganan di blog dan footer.
- **Portofolio / studi kasus**: daftar dan halaman detail proyek.
- **Monitoring**: error tracking dan uptime.

**Di luar scope**

- E-commerce, pembayaran, akun pengguna publik.

## 3. Route dan Halaman

| Route                             | Rendering     | Keterangan                              |
| --------------------------------- | ------------- | --------------------------------------- |
| `/portfolio`, `/portfolio/[slug]` | Statis        | [TODO: sumber data: `content/` atau DB] |
| (form newsletter)                 | Server Action | Disematkan, bukan halaman sendiri       |

## 4. Perilaku

- Analytics hanya aktif sesuai kebijakan privasi/consent; tidak memperlambat LCP (`next/script`, `lazyOnload`).
- Newsletter: double opt-in, tautan berhenti langganan di setiap email, validasi email, honeypot + rate limit seperti form kontak.
- Portofolio: setiap proyek punya masalah, solusi, hasil, tech stack, gambar `alt` bermakna; JSON-LD `CreativeWork` [TODO].

## 5. Data

- Newsletter: tabel `subscribers` (email unik, status, `confirmed_at`) [TODO].
- Portofolio: [TODO].

## 6. UI

Mengikuti `DESIGN_SYSTEM.md`. Kartu proyek memakai pola bento.

## 7. SEO

- Portofolio masuk sitemap; metadata unik per proyek.
- Skrip analytics tidak boleh menghalangi render.

## 8. Dependensi

- Library baru: analytics (GA4 / Plausible / Umami), layanan email newsletter, error tracking. Semua belum dipilih; tawarkan opsi dulu.

## 9. Kriteria Selesai

- [ ] Sub-fitur yang dikerjakan punya dokumen sendiri dan disetujui
- [ ] Dampak ke Core Web Vitals diukur sebelum dan sesudah
- [ ] Kebijakan privasi diperbarui
- [ ] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [ ] Tools analytics yang dipilih?
- [ ] Apakah newsletter benar-benar dibutuhkan?
- [ ] Ada proyek nyata untuk portofolio?
