# 7. Growth (Portofolio, Monitoring, Analytics)

> Sub-fitur Portofolio sudah punya dokumen sendiri: [8_PORTFOLIO](8_PORTFOLIO.md). Monitoring dan Analytics masih menunggu keputusan (checklist di bawah).

> Status: Draft (menunggu checklist pemilik repo; belum ada kode)
> Fase: 4
> Folder kode: portofolio di `src/features/portfolio/` (lihat `8_PORTFOLIO.md`); monitoring dan analytics belum ada

Dokumen ini menampung fitur Fase 4. Pecah menjadi dokumen tersendiri (`8_PORTFOLIO.md`, dst.) saat salah satu mulai dikerjakan.

## 1. Tujuan

Menambah bukti kerja (portofolio) dan kemampuan mengukur serta menjaga situs setelah fondasi, landing page, blog, dan admin berjalan.

## 2. Urutan yang dipilih pemilik repo (2026-10-17)

1. Portofolio / studi kasus
2. Monitoring (error + uptime)
3. Analytics & konversi
4. ~~Newsletter~~ tidak dikerjakan sekarang (butuh Resend yang masih ditunda dan kebijakan privasi). Tetap dicatat di Backlog.

## 3. Checklist untuk pemilik repo

Centang yang sudah jelas; yang kosong perlu Anda putuskan sebelum agent membangun.

### A. Portofolio

- [ ] Sudah ada proyek nyata yang boleh ditampilkan? (jumlah: ___ ). Agent tidak mengarang proyek, klien, atau hasil.
- [ ] Per proyek tersedia: nama, jenis layanan, masalah, solusi, hasil **yang bisa dibuktikan**, tech stack, minimal 1 gambar (dengan teks alternatif), izin klien menyebut nama (boleh anonim: "Klien di bidang logistik").
- [x] Sumber data: file di kode seperti layanan (dipilih)
- [ ] Bahasa: setiap proyek wajib `id` + `en`, atau boleh satu bahasa?
- [ ] Halaman: daftar `/portfolio` + detail `/portfolio/[slug]`? Masuk menu atau hanya dari beranda?
- [x] Belum ada proyek: dibuat 3 proyek contoh berlabel "Contoh", tidak diindeks (lihat `8_PORTFOLIO.md`)

### B. Monitoring

- [ ] Hosting sudah dipilih? (error tracking dan uptime bergantung pada deploy; lihat "Ditunda tetapi Penting" di `PROGRESS.md`)
- [ ] Error tracking: ( ) Sentry (gratis terbatas, SDK) ( ) cukup log hosting ( ) lainnya: ___
- [ ] Uptime: ( ) UptimeRobot / Better Stack (gratis, tanpa kode, cukup pantau `/id`) ( ) lainnya
- [ ] Siapa menerima peringatan (email)? ___

### C. Analytics & konversi

- [ ] Alat: belum dipilih (opsi: Plausible/Umami ramah privasi; GA4 butuh banner consent)
- [ ] Peristiwa yang diukur: pageview, klik "Free Consultation", form kontak terkirim, klik artikel? (centang yang perlu)
- [ ] Halaman Kebijakan Privasi sudah siap (wajib bila ada analytics atau form)? Saat ini disembunyikan.
- [ ] Domain produksi sudah ada? (dibutuhkan untuk mengonfigurasi alat analytics)

### D. Umum

- [ ] Dampak ke Core Web Vitals diukur sebelum dan sesudah tiap sub-fitur (Lighthouse, tabel di `TESTING.md`)
- [ ] Tiap sub-fitur punya dokumen sendiri (`8_...`) dan disetujui sebelum dikerjakan

## 4. Scope

**Termasuk**

- Portofolio / studi kasus: daftar dan halaman detail proyek.
- Monitoring: error tracking dan uptime.
- Analytics & konversi: pageview, klik CTA, submit form kontak.

**Di luar scope**

- E-commerce, pembayaran, akun pengguna publik.
- Newsletter (ditunda; lihat Backlog di `ROADMAP.md`).

## 5. Rencana singkat per sub-fitur (usulan agent, belum disetujui)

| Sub-fitur | Pendekatan paling sederhana | Dependency baru |
| --- | --- | --- |
| Portofolio | `src/content/portfolio.ts` + halaman daftar/detail mengikuti pola layanan; JSON-LD `CreativeWork`; sitemap; disembunyikan dari menu bila kosong | Tidak ada |
| Monitoring | Uptime lewat layanan eksternal (tanpa kode); error tracking hanya bila hosting sudah ada | Mungkin Sentry (tanyakan dulu) |
| Analytics | Satu skrip lewat `next/script` (`lazyOnload`) + pemanggilan peristiwa pada CTA dan form; hanya aktif di produksi | Tidak ada (skrip eksternal), alat dipilih pemilik |

## 6. Perilaku (berlaku bila dikerjakan)

- Analytics hanya aktif sesuai kebijakan privasi/consent; tidak memperlambat LCP.
- Portofolio: setiap proyek punya masalah, solusi, hasil, tech stack, gambar `alt` bermakna. Tidak ada klaim tanpa bukti.
- Monitoring tidak mencatat data pribadi (isi pesan, password, token).

## 7. SEO

- Portofolio masuk sitemap; metadata unik per proyek.
- Skrip analytics tidak boleh menghalangi render.

## 8. Kriteria Selesai (per sub-fitur)

- [ ] Dokumen sub-fitur disetujui
- [ ] Lint, typecheck, tes, build lolos; E2E dan axe untuk halaman baru
- [ ] Dampak ke Core Web Vitals diukur
- [ ] Kebijakan privasi diperbarui bila perlu
- [ ] `PROGRESS.md` diperbarui

## 9. Pertanyaan Terbuka

Lihat checklist di bagian 3.
