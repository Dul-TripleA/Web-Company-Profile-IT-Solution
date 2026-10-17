# Testing

> Status: TEMPLATE. Tool bersifat usulan; sesuaikan setelah scaffold.

## 1. Filosofi

- Uji **perilaku yang dilihat user dan kontrak yang bisa rusak**, bukan detail implementasi.
- Piramida: banyak unit/integrasi kecil, sedikit E2E untuk alur kritis.
- Bug yang diperbaiki mendapat test regresi.
- Tugas belum selesai sebelum `bun run lint && bun run typecheck && bun run test && bun run build` lolos.

## 2. Jenis dan Tool

| Jenis         | Tool                     | Lokasi                      | Yang diuji                                                      |
| ------------- | ------------------------ | --------------------------- | --------------------------------------------------------------- |
| Unit          | Vitest                   | `*.test.ts` di sebelah file | Fungsi murni: `cn`, slug, format tanggal, helper SEO, skema Zod |
| Komponen      | Vitest + Testing Library | `*.test.tsx`                | Komponen interaktif: form kontak, menu header, dropdown         |
| Integrasi     | Vitest + DB test         | `features/*/*.test.ts`      | Query dan Server Action dengan DB uji                           |
| E2E           | Playwright               | `tests/e2e`                 | Alur kritis di browser nyata                                    |
| Aksesibilitas | `@axe-core/playwright`   | di E2E                      | Pelanggaran a11y per halaman                                    |
| Performa/SEO  | Lighthouse CI            | CI                          | Skor dan Core Web Vitals                                        |

Server Component async dijalankan lewat E2E atau diuji sebagai fungsi data; Testing Library belum andal untuk itu.

Status: Vitest + Testing Library (`src/**/*.test.{ts,tsx}`, lingkungan `jsdom`) dan Playwright + axe (`tests/e2e`, proyek `desktop` dan `mobile` = Pixel 7). Lokal Playwright memakai Chrome yang terpasang (`channel: 'chrome'`); CI memasang Chromium. `bun run test:e2e` membangun lalu menjalankan; `bun run test:e2e:only` memakai hasil build yang ada. Playwright dibatasi 4 worker lokal (2 di CI) karena terlalu banyak browser paralel membuat tes gagal acak. Cakupan E2E: redirect locale, satu `h1` per halaman, pengalih bahasa, sitemap/robots/metadata/JSON-LD, dropdown dan menu mobile (keyboard, Escape, muat di layar), target sentuh 44px, tanpa scroll horizontal di semua halaman, dan axe (WCAG 2.x A/AA + 2.2 AA) di semua halaman desktop.

## 3. Yang Wajib Diuji

**Fase 1**

- Skema form kontak: valid, field kosong, terlalu panjang, email salah.
- Server Action kontak: sukses, validasi gagal, honeypot terisi, rate limit.
- `buildMetadata()` dan generator JSON-LD: title/description/canonical benar.
- `sitemap.ts`: berisi route publik, tidak berisi `/admin`.
- E2E: landing page render, CTA "Free Consultation" mengarah ke form, form terkirim, menu mobile terbuka/tutup dengan keyboard.

**Fase 2**

- Query blog hanya mengembalikan `PUBLISHED` dan `publishedAt <= now`.
- Halaman artikel: slug tak ada → 404; metadata dan `BlogPosting` JSON-LD benar.
- Sitemap dan RSS memuat artikel terbit, tidak memuat draft.
- Sudah ada di `tests/e2e/blog.spec.ts`: data uji berawalan `zz-e2e-` dipasang/dihapus oleh `global-setup.ts`/`global-teardown.ts` ke database di `.env`; tanpa `DATABASE_URL` (mis. CI) tes blog dilewati.

**Fase 3**

- Otorisasi: user tanpa login/peran tidak bisa memanggil action admin (uji **langsung ke action**, bukan hanya UI).
- Sanitasi konten artikel.

## 4. Checklist Manual Sebelum Rilis

- [ ] Lighthouse mobile: Performance ≥ 90, SEO 100, A11y ≥ 95, Best Practices ≥ 95.
- [ ] Setiap halaman: tepat satu `<h1>`, title/description unik, canonical benar.
- [ ] Tab keyboard melewati semua kontrol; fokus terlihat.
- [ ] Kontras pasangan warna baru sudah diperiksa.
- [ ] Cek di 360px, 768px, 1280px, dan layar lebar; tidak ada scroll horizontal.
- [ ] `prefers-reduced-motion` dihormati.
- [ ] Rich Results Test lulus untuk artikel; Open Graph tampil benar saat dibagikan.
- [ ] Tidak ada secret di bundle klien.

## 5. CI

Urutan: install → lint → typecheck → unit/integrasi → build → E2E (terhadap hasil build) → Lighthouse CI.
Test harus deterministik: tanpa jaringan nyata (mock layanan email), tanpa ketergantungan waktu (inject jam), DB uji terisolasi.

## Lighthouse (manual, sebelum rilis)

Tidak dipasang sebagai dependency; dijalankan lewat `bunx` terhadap hasil build produksi.

```sh
bun run build && bun run start -- --port 3104        # terminal 1
bunx lighthouse http://localhost:3104/id --view      # terminal 2: mobile (default)
bunx lighthouse http://localhost:3104/id --preset=desktop --view
```

Hasil terakhir (2026-10-17, build produksi lokal, throttling simulasi):

| Halaman | Perf | A11y | Best Practices | SEO | LCP |
| --- | --- | --- | --- | --- | --- |
| `/id` mobile | 94 | 100 | 100 | 100 | 3.1 s |
| `/en` mobile | 93 | 100 | 100 | 100 | 3.2 s |
| `/id/about` mobile | 96 | 100 | 100 | 100 | 2.9 s |
| `/id/services` mobile | 97 | 100* | 100 | 100 | 2.6 s |
| `/id/services/erp-systems` mobile | 99 | 100 | 100 | 100 | 2.3 s |
| `/id/contact` mobile | 98 | 100 | 100 | 100 | 2.4 s |
| `/id` desktop | 100 | 100 | 100 | 100 | 0.7 s |

\* Awalnya 98 (urutan heading); diperbaiki dengan `h2` tersembunyi dan diukur ulang. Elemen LCP beranda adalah gambar hero; LCP mobile 3.1 s masih di atas ambang "baik" (2.5 s) walau skor Performance ≥ 90. Ukur ulang di lingkungan produksi nyata (hosting + CDN) karena hasil lokal tidak mewakili.
