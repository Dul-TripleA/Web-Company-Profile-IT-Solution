# Design System

Diturunkan dari `docs/reference/welcome.blade.php` (salinan template Blade lama). Arah visual: **dark green + lime**, gaya **bento** (kartu modular rasio 8:4), tipografi tebal dan rapat.

Nilai di bawah adalah sumber kebenaran. Komponen memakai **token**, bukan hex mentah.

## 1. Warna

### Brand

| Token          | Hex       | Pemakaian di template                                         |
| -------------- | --------- | ------------------------------------------------------------- |
| `brand`        | `#99e344` | CTA, aksen, heading di atas gelap, bintang rating, selection  |
| `brand-hover`  | `#a8f553` | Hover tombol utama                                            |
| `brand-soft`   | `#b4f268` | Highlight ringan                                              |
| `brand-strong` | `#84cb32` | Pressed/active                                                |
| `brand-deep`   | `#88d234` | [TODO: cek pemakaian, mungkin digabung dengan `brand-strong`] |
| `on-brand`     | `#0d2e28` | Teks di atas `brand` (top bar). Tombol memakai `forest`       |

### Surface

| Token         | Hex       | Pemakaian                                                                      |
| ------------- | --------- | ------------------------------------------------------------------------------ |
| `forest`      | `#0b2923` | Hero, kartu gelap, teks heading di background terang, teks di atas tombol lime |
| `forest-deep` | `#071d18` | Section gelap (services, workflow), footer, kartu utama                        |
| `cream`       | `#fcfbf7` | Background halaman                                                             |
| `white`       | `#ffffff` | Section terang (tech stack, reviews)                                           |

### Neutral dan border

| Pemakaian                     | Nilai Tailwind                                                         |
| ----------------------------- | ---------------------------------------------------------------------- |
| Teks isi di background terang | `slate-800` (body), `slate-600` (kartu), `slate-500` (sekunder)        |
| Teks isi di background gelap  | `slate-300` (utama), `slate-400` (footer/sekunder)                     |
| Border di gelap               | `emerald-900/60`, `emerald-900/50`, `emerald-950/60` (pemisah section) |
| Border di terang              | `slate-200`, `slate-200/80`                                            |
| Surface kartu terang          | `slate-50/70`                                                          |
| Glass (badge di hero)         | `white/10` + `border-white/15` + `backdrop-blur-md`                    |

### Aturan kontras (penting)

- `brand` **hanya sebagai teks/ikon di atas `forest` atau `forest-deep`** (kontras tinggi).
- `brand` **bukan teks di atas putih/krem**: kontrasnya gagal WCAG AA. Template memakai bintang lime di section putih. Boleh untuk dekorasi, tapi rating juga harus ada sebagai teks (mis. "4.9/5.0").
- Teks di atas tombol `brand`: selalu `forest`.
- Teks `slate-500` di atas `cream`/putih lolos AA untuk teks normal. Jangan lebih terang dari itu.
- Verifikasi setiap pasangan warna baru sebelum dipakai.

## 2. Tipografi

- **Font**: Plus Jakarta Sans (400, 500, 600, 700, 800). Muat dengan `next/font/google`, variable `--font-sans`. Mono untuk label teknis: `ui-monospace` stack.
- Heading: `font-extrabold tracking-tight`. Hero H1 `uppercase`.

| Peran               | Kelas dari template                                                        | Catatan                      |
| ------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| Hero H1             | `text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] uppercase` | Satu per halaman             |
| H2 section (besar)  | `text-3xl sm:text-4xl lg:text-5xl font-extrabold`                          | Section gelap utama          |
| H2 section (sedang) | `text-2xl sm:text-3xl font-extrabold`                                      | Section terang/kartu         |
| H3 kartu            | `text-2xl sm:text-3xl font-extrabold`                                      | Warna `brand` di kartu gelap |
| H4 / judul mini     | `text-sm font-semibold`                                                    |                              |
| Eyebrow             | `text-xs font-bold tracking-wider uppercase` + ikon `✱`                    | Di atas H2                   |
| Body                | `text-sm sm:text-base leading-relaxed`                                     |                              |
| Label mono          | `text-xs font-mono text-slate-400`                                         | Mis. `01 / WEB CUSTOM`       |

**Penyimpangan yang disarankan dari template**: template banyak memakai `text-xs` (12px) untuk paragraf. Di Next.js, paragraf isi minimal `text-sm` (14px), `text-base` untuk artikel blog. `text-xs` hanya untuk eyebrow, badge, dan metadata.

## 3. Layout dan Spacing

- Container: `max-w-7xl mx-auto px-6` (1280px, gutter 24px). Komponen: `<Container>`.
- Padding vertikal section: `py-20` (terang), `py-24` (gelap), hero `min-h-[600px] lg:h-[750px]`.
- Header section: flex kolom di mobile, `md:flex-row md:items-end justify-between gap-6 mb-12` (mb-16 untuk section gelap). Kiri: eyebrow + H2. Kanan: paragraf `max-w-xs`/`max-w-md`.
- Grid bento: `grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch`. Pola kolom: **8 + 4**, **4 + 8**, atau **4 + 4 + 4**. Jangan semua kartu sama besar.
- Grid review: `grid-cols-1 md:grid-cols-3 gap-8`.
- Mobile: satu kolom, urutan konten sama dengan desktop.

## 4. Radius, Shadow, Efek

| Token          | Nilai                | Dipakai untuk                            |
| -------------- | -------------------- | ---------------------------------------- |
| `radius-pill`  | `rounded-full`       | Tombol, badge rating, ikon bulat, avatar |
| `radius-card`  | `rounded-3xl` (24px) | Kartu utama bento, kartu review          |
| `radius-inner` | `rounded-2xl` (16px) | Mini card, tech badge                    |
| `radius-chip`  | `rounded-xl` (12px)  | Pill label di kartu                      |

- Kartu gelap utama: `shadow-2xl`. Kartu terang: `shadow-sm`, hover `shadow-md`.
- Glow tombol hover: `0 8px 20px rgba(153,227,68,0.35)`.
- Ambient glow section gelap: blob `bg-brand/10 rounded-full blur-3xl pointer-events-none` (dekorasi, `aria-hidden`).
- Glass: `backdrop-blur-md` hanya untuk badge hero dan header saat scroll.

## 5. Motion

- Durasi: `200ms` (warna/link), `300ms` (hover kartu, tombol, transform), `500ms` (transisi header).
- Hover tombol: `-translate-y-0.5` + glow. Active: `translate-y-0`.
- Link nav: garis bawah `after:` yang `scale-x-0 → scale-x-100`, 300ms.
- Ikon panah tombol: panah lama keluar `translate-x-4`, panah baru masuk dari `-translate-x-4`.
- Wajib hormati `prefers-reduced-motion`: matikan translate/transform dekoratif.

## 6. Komponen

Komponen berada di `src/components/ui` (primitif) dan `src/components/sections` (bagian halaman). Lihat `docs/ARCHITECTURE.md`.

### Button

| Varian              | Spesifikasi                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `primary`           | `bg-brand hover:bg-brand-hover text-forest text-xs font-bold py-2.5 px-5 rounded-full` + ikon panah dalam lingkaran `forest` (`h-5 w-5`) |
| `ghost` / `outline` | [TODO: belum ada di template. Usulan: border `brand/30`, teks `brand`, hover `bg-brand/10`]                                              |

Ukuran tombol saat ini kecil (teks 12px, tinggi ~40px). Untuk target tap 44px di mobile, tambah `min-h-11`.

### Badge dan Pill

- Rating hero: `bg-white/10 border border-white/15 backdrop-blur-md rounded-full px-3 py-1 text-xs`.
- Label kartu: `rounded-xl border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand`.
- Tech badge (terang): `px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-bold tracking-wider text-slate-700 hover:border-brand hover:bg-white hover:shadow-md`.

### Card

| Varian             | Spesifikasi                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `feature-dark`     | `rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 sm:p-10 shadow-2xl` hover `border-brand/40` |
| `feature-dark-alt` | sama, `bg-forest/80` (di atas section `forest-deep`)                                                     |
| `mini-dark`        | `rounded-2xl border border-emerald-900/50 bg-forest/70 p-4` hover `border-brand/40 bg-forest`            |
| `review-light`     | `rounded-3xl border border-slate-200/80 bg-slate-50/70 p-8 shadow-sm` hover `border-brand shadow-md`     |

Anatomi kartu fitur: label pill → H3 (`brand`) → deskripsi (`slate-300`) → grid mini card (3 kolom di `sm`). Jangan nesting kartu di dalam kartu kecuali mini card ini.

### Header dan Top Bar

- Top bar: `bg-brand text-on-brand text-xs font-semibold py-2`. Isi: tagline, email, tautan sosial.
- Header: `fixed`, transparan di atas hero. Setelah melewati tinggi top bar: `top-0`, `bg-forest/95 backdrop-blur-md shadow-xl`. Transisi 500ms.
- Implementasi Next.js: client component kecil `SiteHeader` dengan scroll listener (pasif, `requestAnimationFrame`). Jangan ubah `style.top` secara imperatif seperti di template.
- Nav: Home, About Us, Pages, Services, Blog, Contact + CTA "Free Consultation". Item dropdown harus bisa dioperasikan keyboard (`button` + `aria-expanded`), bukan hover-only.

### Footer

`bg-forest-deep text-slate-400 py-12 border-t border-emerald-950/70`. Baris atas: brand, tautan cepat, sosial. Pemisah `border-emerald-950/60`. Hover tautan: `text-brand`.

## 7. Pola Section Halaman Utama

Urutan dari template, pertahankan:

| #   | Section                | Latar                                            | Pola                                                                                                                                               |
| --- | ---------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Top bar                | `brand`                                          | Info singkat                                                                                                                                       |
| 1   | Hero                   | `forest` + foto kanan + gradient kiri→transparan | Rating badge, H1, paragraf, CTA + telepon                                                                                                          |
| 2   | Our Approach           | `cream`                                          | Header + bento 8:4 (kartu gelap besar + kartu samping)                                                                                             |
| 3   | Comprehensive Solution | `cream`                                          | Kartu bento lanjutan [TODO: cek isi baris 380-558 saat implementasi]                                                                               |
| 4   | Services (`#services`) | `forest-deep` + glow                             | Header + baris bento 8:4, lalu 4:8, lalu 4:4:4                                                                                                     |
| 5   | Technology Stack       | putih + glow lime                                | Judul tengah + baris tech badge                                                                                                                    |
| 6   | Workflow (`#workflow`) | `forest-deep`                                    | 4 langkah: Discovery & Consultation, Design & Architecture, Development & QA, Deployment & Scaling + CTA "Ready to plan your next digital system?" |
| 7   | Reviews (`#reviews`)   | putih                                            | Skor 4.9/5.0 + 3 kartu review                                                                                                                      |
| 8   | Footer                 | `forest-deep`                                    | Lihat di atas                                                                                                                                      |

Pola selang-seling latar: gelap → terang → gelap → terang → gelap, dengan `border-t` hairline sebagai pemisah.

## 8. Implementasi Token di Tailwind v4

Definisikan di `src/app/globals.css` dengan `@theme`, supaya `bg-brand`, `text-forest`, dst. tersedia:

```css
@import 'tailwindcss';

@theme {
  --color-brand: #99e344;
  --color-brand-hover: #a8f553;
  --color-brand-soft: #b4f268;
  --color-brand-strong: #84cb32;
  --color-on-brand: #0d2e28;

  --color-forest: #0b2923;
  --color-forest-deep: #071d18;
  --color-cream: #fcfbf7;
}

/* inline: nilai --font-plus-jakarta baru ada saat runtime, di elemen <html>. */
@theme inline {
  --font-sans: var(--font-plus-jakarta), ui-sans-serif, system-ui, sans-serif;
}
```

Sudah diterapkan di `src/app/globals.css`. Font dimuat di `src/app/[locale]/layout.tsx` dengan `next/font/google` (variabel `--font-plus-jakarta`). `brand-deep` (`#88d234`) belum dibuat sebagai token karena pemakaiannya belum jelas.

## 9. Perbaikan yang Disarankan Saat Migrasi dari Template

Temuan saat membaca Blade; pilih mana yang diterapkan:

- Typo copy: "A Modern **Digitak** Solutions" di footer.
- Kutipan review menyebut "**Biztop**", padahal brand-nya Do It.
- Email placeholder `example@doit.com`; telepon `+62851 1053 0560` dan 3 review (Sarah Jenkins, David Pratama, Elena Rostova) perlu dikonfirmasi asli atau placeholder. Jangan publikasikan testimoni fiktif sebagai asli.
- Gambar hero dari Unsplash (hotlink). Unduh, simpan di `public/` atau `src/assets`, pakai `next/image` dengan `priority`.
- Ikon sosial berupa teks (`f`, `𝕏`, `ig`, `🌐`). Ganti dengan SVG + `aria-label`.
- Dropdown nav hanya hover, tanpa tautan. Perlu rute nyata.
- Tautan `href="#"` di nav. Ganti dengan route sesungguhnya.
- Judul Blade "Do It - Modern Digital Solutions" menjadi basis `title` metadata.

## 10. Status Implementasi (2026-10-17)

Komponen sudah dibuat dengan tampilan mengikuti template: `src/components/ui` (Container, Eyebrow, Badge, ButtonLink dengan varian `primary` / `solid` / `outline`, CheckBullet, CheckBadge, ikon), `src/components/layout` (TopBar, SiteHeader, SiteFooter, LanguageSwitcher), `src/components/sections` (Hero, Approach, WhyChooseUs, CoreServices, TechStack, Workflow, Reviews, PageHero). Ukuran teks `text-xs` dari template dipertahankan (saran §2 belum diterapkan). Catatan penyimpangan per fitur ada di `docs/features/1_LANDING_PAGE.md` bagian 11.
