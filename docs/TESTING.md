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

Status Fase 0: hanya Vitest + Testing Library yang terpasang (lingkungan `jsdom`, berkas `src/**/*.test.{ts,tsx}`). Playwright dan axe dipasang saat fitur pertama butuh E2E.

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
