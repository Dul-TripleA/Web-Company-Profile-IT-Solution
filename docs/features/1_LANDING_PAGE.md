# 1. Landing Page

> Status: Berjalan (UI selesai; E2E, axe, layout mobile, dan Lighthouse lokal lolos; tinggal ukur di produksi)
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
5. **Why Choose Us** (di template berjudul "Comprehensive Solution"): galeri foto, kartu "10K+", empat statistik, enam poin nilai, dua tombol. Isinya sedang ditinjau (lihat "Topik yang Ditampung" di `PROGRESS.md`).
6. **Services** (`#services`): bento 8:4, 4:8, 4:4:4.
7. **Technology Stack**: baris badge teknologi.
8. **Workflow** (`#workflow`): Discovery & Consultation, Design & Architecture, Development & QA, Deployment & Scaling, plus CTA.
9. **Reviews** (`#reviews`): skor 4.9/5.0 dan 3 kartu review.
10. **Footer**: brand, tautan cepat, sosial.

Aturan:

- Tautan jangkar (`#services`, `#workflow`, `#reviews`) menggulir halus ke section dan fokus berpindah ke heading section.
- Dropdown nav bisa dibuka keyboard (`button` + `aria-expanded`), tutup dengan `Esc`.
- Di mobile, nav menjadi menu hamburger yang bisa dibuka/tutup (lihat bagian 11).

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

- Title: dari `meta.title` di kamus (≤ 60 karakter, diuji)
- Description: dari `meta.description` di kamus (70-160 karakter, diuji)
- JSON-LD: `Organization`, `WebSite`
- Satu `<h1>` (hero). Tiap section punya `<h2>`.
- Masuk sitemap: ya

## 8. Dependensi

- Global: `components/ui` (Button, Badge, Card, Container), `lib/seo.ts`.
- Library baru: tidak ada.

## 9. Kriteria Selesai

- [x] Semua section template hadir dan urutannya sama (dibandingkan lewat screenshot desktop dengan salinan Blade)
- [x] Teks dan nilai warna lolos kontras AA (`DESIGN_SYSTEM.md` §1): diperiksa axe di semua halaman
- [x] Tampil benar di layar mobile (Pixel 7) dan desktop tanpa scroll horizontal (Playwright); lebar 360px dan 768px khusus belum diuji
- [x] Header berubah saat scroll; dropdown dan menu mobile bisa dipakai keyboard (Playwright)
- [x] Lighthouse mobile: Performance ≥ 90, SEO 100, A11y ≥ 95 (lokal: Perf 93-99, A11y 100, SEO 100; tabel di `TESTING.md`; ukur ulang di produksi)
- [x] Copy template yang salah dibereskan atau dikonfirmasi (lihat `DESIGN_SYSTEM.md` §9): typo footer "Digitak" dan nama "Biztop" diperbaiki; review/telepon/email tetap placeholder
- [x] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [ ] Review dan nomor telepon di template asli atau placeholder?
- [x] Isi menu dropdown "Pages", "Services", "Blog": sudah diisi (lihat bagian 11)
- [x] Bentuk menu mobile: hamburger dengan panel (lihat bagian 11)

## 11. Catatan Implementasi (2026-10-17)

Tampilan mengikuti `docs/reference/welcome.blade.php` (kelas, ukuran teks, warna, radius dipertahankan). Penyimpangan yang disengaja:

- **Ditambahkan**: pengalih bahasa `ID | EN` di header; menu mobile (hamburger) karena template tidak punya; dropdown nav bisa dibuka dengan keyboard/klik dan ditutup dengan `Esc`.
- **Isi dropdown** (placeholder yang masuk akal): "Pages" berisi tautan jangkar Technologies, Workflow, Reviews; "Services" berisi empat layanan + semua layanan. "Blog" berupa tautan biasa ke `/blog` dan **masih 404 sampai Fase 2**.
- **Tautan yang diarahkan ulang**: semua CTA ke `/contact`; kartu layanan ke `/services/[slug]`; tombol "View Our Portfolio" ke `/services` (portofolio baru Fase 4).
- **Footer**: tautan Privacy Policy / Terms / Security dirender sebagai teks (halamannya belum ada); ikon sosial masih `href="#"` (lihat `src/content/site.ts`).
- **Header**: efek scroll memakai state React + `requestAnimationFrame`, bukan `style.top` imperatif; transisi `top` dihilangkan agar tidak tertinggal saat scroll.
- **Aksesibilitas**: ukuran teks `text-xs` dan tinggi tombol desktop (±36px) dari template tidak diubah; perangkat sentuh mendapat 44px (ADR-014). Teks hijau di latar terang memakai `brand-ink` (#5f9224) karena lime asli gagal kontras; ikon sosial diganti SVG; pada layar kecil CTA header dan pengalih bahasa pindah ke menu hamburger.
- Hover tombol sekunder memakai `brand-strong` (#84cb32), bukan #88d234 dari template.
- Gambar diunduh ke `public/images/` dan dilayani lewat `next/image`.
- Section 3 template ("Comprehensive Solution") ternyata blok "Why Choose Us" (galeri + statistik + poin nilai); sudah diportasi.

## 12. Keputusan Konten (2026-10, dibahas bertahap dengan pemilik repo)

Prinsip: setiap angka atau klaim harus punya sumber yang bisa ditunjukkan. Konten yang tidak dipakai **disembunyikan, bukan dihapus** (tanda `DISEMBUNYIKAN`; cari dengan `grep -rn DISEMBUNYIKAN src`).

**Kelompok 1: Top bar dan Hero (selesai)**

| Elemen | Keputusan |
| --- | --- |
| Top bar, kalimat | Diganti: ID "Mitra Teknologi untuk Pertumbuhan Bisnis Anda", EN "Your Technology Partner for Business Growth". Klaim "salah satu software house terbaik" disembunyikan |
| Hero, badge "4.9 ★ 5K+ Reviews" | Disembunyikan (belum ada ulasan nyata). Kunci kamus `hero.rating` dipertahankan |
| Hero, judul | "Kami Membangun Solusi Digital Untuk Bisnis Anda" / "We Build Digital Solutions For Your Business" (sorotan lime pada "Bisnis Anda") |
| Hero, deskripsi | "Kami membantu bisnis mewujudkan ide melalui website, aplikasi web, dan software khusus yang disesuaikan dengan kebutuhan mereka." (EN: "We help businesses bring their ideas to life through websites, web applications, and custom software tailored to their needs."). Awalan nama merek disembunyikan; kunci `hero.brand` dipertahankan |
| Email dan telepon | Tetap memakai nomor/email template sementara (`src/content/site.ts`); akan diganti pemilik repo |

Teks lama masih ada di riwayat git (commit Fase 1) bila ingin dikembalikan. Tes E2E menjaga agar klaim yang disembunyikan tidak muncul lagi.

Catatan: gambar OG (`public/og-default.png`) dan `meta.title`/`site.tagline` masih memakai kalimat lama "Modern Digital Solutions For Your Growth Business"; selaraskan saat tahap logo/branding.

**Kelompok 2: Our Approach, Why Choose Us, Services (selesai)**

| Section | Keputusan |
| --- | --- |
| Our Approach | Dipertahankan, isi diganti proses 4 langkah: Understand Your Needs, Define the Scope, Design & Develop, Test & Deliver (kartu bernomor 01-04, masing-masing dengan ikon dan permukaan "kaca": gradasi halus, blur, kilau di pojok, garis tipis di tepi atas, serta cahaya lime di belakang kartu agar efeknya terlihat di latar krem). Bento lama disimpan utuh di `approach-bento.tsx` dan kamus `home.approachBento` |
| Why Choose Us | Judul "A Straightforward Approach to Better Software" + 3 komitmen: Clear Communication, Defined Project Scope, Testing Before Delivery. Disembunyikan (dikomentari): kartu "10K+", 4 statistik, daftar 6 poin, tombol "View Our Portfolio". Dua foto ditampilkan bertumpuk |
| Services | 3 layanan: Web Development, Custom Software Development, UI/UX Design, masing-masing dengan deskripsi dan baris "Cakupan". ERP dan Mobile App tidak ditawarkan: data lengkap 4 layanan lama ada di `src/content/services-hidden.ts`, tampilan bento lama di `core-services-bento.tsx` |

Hal yang saya putuskan sendiri (mohon ditinjau):
- Terjemahan Indonesia untuk semua teks baru (hanya teks Inggris yang diberikan).
- Header section Services (belum ada teks dari pemilik repo): "What We Can Build for You" / "Yang Bisa Kami Bangun untuk Anda", dengan pengantar "Websites, custom software, and interface design, tailored to how your business works."
- `meta.description` dan deskripsi halaman `/services` diubah agar tidak menyebut ERP/mobile.
- Halaman detail layanan menampilkan cakupan + ajakan konsultasi (blok "What you get" dan "Technologies" disembunyikan karena datanya sudah tidak ada).
- Slug berubah: `web-development` (baru), `custom-software-development` (baru), `ui-ux-design` (tetap). Slug lama (`custom-web-applications`, `erp-systems`, `mobile-app-development`) tidak lagi ada (404, tidak di sitemap); belum ada situs publik, jadi tanpa redirect.
- Foto kedua (potret stok) dipertahankan di Why Choose Us; foto stok bisa menyiratkan anggota tim, pertimbangkan diganti foto asli.
- Section Workflow (kelompok 3) kini mirip dengan Our Approach (sama-sama 4 langkah proses); putuskan salah satunya di kelompok 3.

**Kelompok 3: Tech Stack dan Workflow (selesai)**

| Section | Keputusan |
| --- | --- |
| Tech Stack | Dibiarkan. Daftar teknologi sudah dipangkas pemilik repo (AWS dan MongoDB dihapus dari `src/content/tech-stack.ts`) |
| Workflow | Dipertahankan, tetapi teksnya diselaraskan dengan Our Approach: Discovery & Consultation, Scope Definition, Design & Development, Testing & Handover (fase 1-4 memakai nama langkah Approach) |
| Janji yang tidak bisa dipenuhi | Diganti semua: uji penetrasi, pemantauan 24/7, backup harian, CI/CD otomatis, pelatihan pengguna dan buku panduan, "dampak bisnis terukur", "deploy cloud skala penuh", "konsultasi 30 menit dengan solutions architect utama". Kartu ajakan di bawah diganti "Ready to discuss your project?" |

Catatan: Workflow dan Our Approach kini hampir kembar (sama-sama 4 langkah dengan urutan yang sama). Itu keputusan pemilik repo; bila terasa berulang, salah satunya bisa disembunyikan kelak. Tes E2E menjaga agar frasa janji lama tidak muncul lagi di beranda. Teks baru (termasuk terjemahan Indonesia) ditulis agent dan perlu ditinjau.

**Kelompok 4: Reviews, Footer, sosial (selesai)**

| Elemen | Keputusan |
| --- | --- |
| Reviews | Disembunyikan sampai ada testimoni asli: import dan pemakaian di `page.tsx` dikomentari; item "Reviews" di dropdown "Pages" dan tautan "Reviews" di footer ikut dikomentari. Komponen, `content/reviews.ts`, dan teks kamus tetap utuh |
| Footer | Dipertahankan. Tautan Privacy/Terms/Security tetap berupa teks (halamannya belum ada) |
| Ikon sosial | Semua dikomentari (belum punya akun): label "Follow Us" + ikon di top bar dan ikon di footer. Data `TOP_BAR_SOCIALS`/`FOOTER_SOCIALS` dan komponen `SocialIcon` tetap ada. Aktifkan lagi dengan mengisi `url` asli di `src/content/site.ts` lalu membuka komentar |

Tes E2E menjaga: tidak ada `#reviews`, tidak ada tautan sosial, tidak ada `href="#"`, dan footer tetap tampil.

**Menu aktif**

Item navbar menyala sesuai posisi: halaman yang dibuka (Beranda, About Us, Services termasuk detailnya, Blog, Contact) dan, di beranda, section yang sedang dibaca (Services untuk `#services`; Pages untuk `#technology` dan `#workflow`). Beranda aktif hanya di area atas (sebelum section yang punya menu). Setelah section terakhir terlewati, item terakhir tetap menyala. Anak dropdown yang sesuai juga ditandai (`aria-current`). Logika murni di `components/layout/nav-active.ts` (dites unit); garis baca di 40% tinggi layar. Berlaku di menu desktop dan panel mobile.

**Penyembunyian lanjutan dan logo (2026-10)**

| Elemen | Keputusan |
| --- | --- |
| Tautan legal footer | Privacy Policy, Terms of Service, Security dikomentari (halamannya belum ada). Kunci kamus `legal` dipertahankan |
| Email | Dikomentari di top bar, di kartu kontak halaman `/contact`, dan di JSON-LD Organization (`email`). Data `SITE.email` dipertahankan |
| Telepon | Dikomentari di hero, di kartu kontak, dan di JSON-LD (`telephone`). Data `SITE.phone` dan kunci `callUs` dipertahankan |
| Halaman `/contact` | Kartu "Hubungi kami langsung" disembunyikan, sehingga halaman hanya berisi form (satu kolom, `max-w-3xl`) |
| Logo | Logo resmi (`public/images/logo`) dipakai di header dan footer menggantikan ikon placeholder + teks "Do It". File turunan `logo-full.png` (latar transparan) dibuat otomatis; favicon, ikon aplikasi, dan gambar OG dibuat ulang dari logo |

Mengaktifkan lagi email/telepon: isi data asli di `src/content/site.ts`, lalu buka komentar bertanda `DISEMBUNYIKAN` (cari dengan `grep -rn DISEMBUNYIKAN src`).

Semua kelompok konten (1-4) sudah dibahas.
