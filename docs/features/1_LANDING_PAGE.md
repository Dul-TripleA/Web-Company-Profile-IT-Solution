# 1. Landing Page

> Status: Berjalan (UI selesai; Lighthouse dan uji keyboard/mobile belum dijalankan)
> Fase: 1 (lihat `ROADMAP.md`)
> Folder kode: `src/components/sections`, `src/components/layout`, `src/content`, `src/app/[locale]/page.tsx`

## 1. Tujuan

Memperkenalkan Do It sebagai software house terpercaya dan mengarahkan pengunjung ke "Free Consultation". Berhasil bila pengunjung mencapai form kontak / tombol telepon, dengan Lighthouse mobile ≥ 90 dan SEO 100.

## 2. Scope

**Termasuk**

- Halaman `/` dengan section sesuai template Blade (lihat `DESIGN_SYSTEM.md` §7).
- Top bar, header (transparan lalu solid saat scroll), footer.
- CTA "Free Consultation" dan nomor telepon.
- Metadata, JSON-LD `Organization` + `WebSite`, Open Graph.
- Dua bahasa: `/id` dan `/en` (ADR-006). Semua teks dari kamus terjemahan, bukan hardcode.

**Di luar scope**

- Form kontak (fitur terpisah: `2_CONTACT.md`) selain tautan ke sana.
- Halaman About, Services detail, Blog.
- Animasi tambahan di luar yang ada di template.

## 3. Route dan Halaman

| Route | Rendering | Keterangan               |
| ----- | --------- | ------------------------ |
| `/`   | Statis    | Seluruh section di bawah |

## 4. Perilaku

Urutan section (pertahankan dari template):

1. **Top bar**: tagline, email, tautan sosial.
2. **Header**: logo, nav (Home, About Us, Pages, Services, Blog, Contact), CTA. Transparan di atas hero; setelah melewati top bar menjadi `forest/95` + blur.
3. **Hero**: badge rating, H1 "Modern Digital Solutions For Your Growth Business", paragraf, CTA, telepon. Foto latar kanan dengan gradient dari kiri.
4. **Our Approach**: header + bento 8:4 (Web Apps & Custom Systems + kartu samping).
5. **Comprehensive Solution**: [TODO: rinci dari Blade baris 380-558].
6. **Services** (`#services`): bento 8:4, 4:8, 4:4:4.
7. **Technology Stack**: baris badge teknologi.
8. **Workflow** (`#workflow`): Discovery & Consultation, Design & Architecture, Development & QA, Deployment & Scaling, plus CTA.
9. **Reviews** (`#reviews`): skor 4.9/5.0 dan 3 kartu review.
10. **Footer**: brand, tautan cepat, sosial.

Aturan:

- Tautan jangkar (`#services`, `#workflow`, `#reviews`) menggulir halus ke section dan fokus berpindah ke heading section.
- Dropdown nav bisa dibuka keyboard (`button` + `aria-expanded`), tutup dengan `Esc`.
- Di mobile, nav menjadi menu yang bisa dibuka/tutup. Template belum punya; [TODO: bentuk menu mobile].

Keadaan tepi:

- Gambar hero gagal dimuat: latar tetap `forest`, teks tetap terbaca.
- JavaScript mati: semua konten tetap tampil; hanya efek header yang hilang.

## 5. Data

- Konten statis di `src/content/` (layanan, tech stack, langkah workflow, review, kontak), bukan hardcode di JSX.
- Tidak ada akses database.

## 6. UI

- Token, komponen, dan pola: `DESIGN_SYSTEM.md`.
- Hanya `SiteHeader` (efek scroll + menu) yang client component; sisanya Server Component.
- Gambar hero: `next/image`, `priority`, `sizes` sesuai lebar.
- Paragraf isi minimal `text-sm` (lihat catatan penyimpangan di `DESIGN_SYSTEM.md` §2).

## 7. SEO

- Title: "Do It - Modern Digital Solutions" (≤ 60 karakter) [TODO: final]
- Description: [TODO: 120-160 karakter]
- JSON-LD: `Organization`, `WebSite`
- Satu `<h1>` (hero). Tiap section punya `<h2>`.
- Masuk sitemap: ya

## 8. Dependensi

- Global: `components/ui` (Button, Badge, Card, Container), `lib/seo.ts`.
- Library baru: tidak ada.

## 9. Kriteria Selesai

- [x] Semua section template hadir dan urutannya sama (dibandingkan lewat screenshot desktop dengan salinan Blade)
- [ ] Teks dan nilai warna lolos kontras AA (`DESIGN_SYSTEM.md` §1)
- [ ] Tampil benar di 360px, 768px, 1280px tanpa scroll horizontal
- [ ] Header berubah saat scroll; dropdown dan menu mobile bisa dipakai keyboard
- [ ] Lighthouse mobile: Performance ≥ 90, SEO 100, A11y ≥ 95
- [x] Copy template yang salah dibereskan atau dikonfirmasi (lihat `DESIGN_SYSTEM.md` §9): typo footer "Digitak" dan nama "Biztop" diperbaiki; review/telepon/email tetap placeholder
- [ ] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [ ] Review dan nomor telepon di template asli atau placeholder?
- [ ] Isi menu dropdown "Pages", "Services", "Blog"?
- [ ] Bentuk menu mobile?

## 11. Catatan Implementasi (2026-10-17)

Tampilan mengikuti `docs/reference/welcome.blade.php` (kelas, ukuran teks, warna, radius dipertahankan). Penyimpangan yang disengaja:

- **Ditambahkan**: pengalih bahasa `ID | EN` di header; menu mobile (hamburger) karena template tidak punya; dropdown nav bisa dibuka dengan keyboard/klik dan ditutup dengan `Esc`.
- **Isi dropdown** (placeholder yang masuk akal): "Pages" berisi tautan jangkar Technologies, Workflow, Reviews; "Services" berisi empat layanan + semua layanan. "Blog" berupa tautan biasa ke `/blog` dan **masih 404 sampai Fase 2**.
- **Tautan yang diarahkan ulang**: semua CTA ke `/contact`; kartu layanan ke `/services/[slug]`; tombol "View Our Portfolio" ke `/services` (portofolio baru Fase 4).
- **Footer**: tautan Privacy Policy / Terms / Security dirender sebagai teks (halamannya belum ada); ikon sosial masih `href="#"` (lihat `src/content/site.ts`).
- **Header**: efek scroll memakai state React + `requestAnimationFrame`, bukan `style.top` imperatif; transisi `top` dihilangkan agar tidak tertinggal saat scroll.
- **Aksesibilitas**: ukuran teks `text-xs` dan tinggi tombol (±36px) dari template **tidak diubah** agar sama persis. Ini tidak memenuhi target tap 44px di `AGENTS.md`; putuskan apakah tombol diberi `min-h-11`.
- Hover tombol sekunder memakai `brand-strong` (#84cb32), bukan #88d234 dari template.
- Gambar diunduh ke `public/images/` dan dilayani lewat `next/image`.
- Section 3 template ("Comprehensive Solution") ternyata blok "Why Choose Us" (galeri + statistik + poin nilai); sudah diportasi.
