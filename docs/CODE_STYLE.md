# Code Style

Tujuan: kode **mudah dibaca**, **mudah dirawat**, dan **SEO-friendly** secara default.

## 1. Umum

- TypeScript `strict: true`, plus `noUncheckedIndexedAccess`. Tanpa `any`; `@ts-expect-error` hanya dengan alasan tertulis.
- Formatter: Prettier. Linter: ESLint (`eslint-config-next` + `typescript-eslint`). Format otomatis saat simpan; jangan debat gaya di review.
- Fungsi kecil, satu tanggung jawab. Early return dibanding `if` bersarang. Hindari file > ~200 baris; pecah.
- Nama menjelaskan maksud (`getPublishedPosts`, bukan `getData`). Boolean berawalan `is/has/can/should`.
- Teks yang tampil ke pengguna tidak ditulis langsung di JSX; ambil dari kamus `id`/`en` (ADR-006). Tautan internal lewat helper locale.
- Tidak ada magic number/string berulang. Pindahkan ke konstanta bernama atau `content/`.
- Komentar menjelaskan **mengapa** (keputusan non-obvious, workaround, batasan). Jangan menceritakan apa yang kode lakukan, dan jangan tinggalkan kode yang dikomentari. **Pengecualian**: kode yang disembunyikan sementara atas permintaan pemilik repo (bukan dihapus) boleh dikomentari dengan alasan dan tanda `DISEMBUNYIKAN (alasan, tanggal)`; cari dengan `grep -rn DISEMBUNYIKAN src`.
- Gunakan `import type` untuk tipe. Urutan import: node/react → library → `@/` → relatif.

## 2. Penamaan

| Hal             | Aturan                                          | Contoh                                |
| --------------- | ----------------------------------------------- | ------------------------------------- |
| File/folder     | `kebab-case`                                    | `site-header.tsx`, `contact-form.tsx` |
| Komponen        | `PascalCase`, named export                      | `export function SiteHeader()`        |
| Hook            | `useCamelCase`, file `use-*.ts`                 | `use-scroll-position.ts`              |
| Fungsi/variabel | `camelCase`                                     | `formatPostDate`                      |
| Konstanta       | `SCREAMING_SNAKE_CASE` bila benar-benar konstan | `MAX_EXCERPT_LENGTH`                  |
| Tipe/Interface  | `PascalCase`, tanpa prefiks `I`                 | `BlogPost`                            |
| Zod schema      | `camelCase` + `Schema`                          | `contactFormSchema`                   |
| Server Action   | kata kerja, file `actions.ts`                   | `submitContact`                       |

Named export untuk semua kecuali file yang diwajibkan Next (`page`, `layout`, `route`, dsb. memakai default export).

## 3. React dan Next.js

- **Server Component by default.** `"use client"` hanya bila butuh state/efek/event/browser API. Pisahkan bagian interaktif menjadi komponen kecil, jangan menandai seluruh halaman.
- Props: tipe eksplisit di atas komponen. Hindari prop drilling > 2 level; gunakan komposisi (`children`).
- Data fetching di Server Component, bukan di `useEffect`.
- Mutasi lewat Server Action + `useActionState`. Selalu validasi ulang di server.
- Gambar: `next/image` dengan `width/height` atau `fill` + `sizes`; `priority` hanya untuk gambar LCP. `alt` bermakna (kosong `""` bila dekoratif).
- Font: `next/font`. Link: `next/link`. Script pihak ketiga: `next/script` dengan strategi `afterInteractive`/`lazyOnload`.
- Hindari layout shift: dimensi gambar jelas, font `display: swap`, skeleton setinggi konten asli.
- Error: `error.tsx` per segmen penting, `not-found.tsx` global, `notFound()` untuk slug tak ada.
- Loading: `loading.tsx` / `<Suspense>` di sekitar bagian lambat, jangan memblokir seluruh halaman.

## 4. Styling (Tailwind)

- Hanya token dari `DESIGN_SYSTEM.md`. Tidak ada hex mentah atau `style={{}}` untuk warna/spacing.
- Gabungkan kelas bersyarat dengan helper `cn()` buatan sendiri di `lib/utils.ts` (`classes.filter(Boolean).join(' ')`). Tambah `tailwind-merge` hanya bila benar-benar ada konflik kelas yang harus ditimpa.
- Urutan kelas: biarkan `prettier-plugin-tailwindcss` yang mengatur.
- Pola berulang (≥ 3 kali) menjadi komponen dengan peta varian (objek `Record<Variant, string>`), bukan menyalin string kelas panjang. Template Blade menyalin kelas tombol belasan kali; jangan ulangi itu.
- Mobile-first: kelas dasar untuk mobile, `sm:`/`lg:` untuk penambahan.
- Animasi dekoratif dibungkus `motion-safe:` atau dimatikan oleh `prefers-reduced-motion`.

## 5. SEO (wajib)

Setiap halaman publik:

1. **Metadata**: `export const metadata` atau `generateMetadata` berisi `title` (≤ 60 karakter, unik), `description` (120-160 karakter, unik), `alternates.canonical`, `openGraph`, `twitter`.
2. **Satu `<h1>`** per halaman, hierarki `h1 → h2 → h3` tanpa lompat.
3. **HTML semantik**: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>` dengan heading, `<footer>`. Satu `<main>` per halaman.
4. **JSON-LD** sesuai jenis:
   - Semua: `Organization` + `WebSite` (di root layout).
   - Artikel: `BlogPosting` (headline, datePublished, dateModified, author, image).
   - Halaman dalam: `BreadcrumbList`.
5. **URL**: slug `kebab-case`, pendek, stabil. Perubahan slug wajib diberi redirect 301.
6. **Tautan**: teks anchor deskriptif (bukan "klik di sini"). Tautan eksternal tidak tepercaya: `rel="noopener noreferrer"`; UGC: `rel="ugc nofollow"`.
7. **Gambar**: format modern (AVIF/WebP lewat `next/image`), `alt`, ukuran tepat, lazy kecuali LCP.
8. **Performa = SEO**: pantau LCP/INP/CLS; minim JS client; hindari library besar untuk hal kecil.
9. **Halaman non-publik** (`/admin`, hasil pencarian internal): `robots: { index: false }`.
10. `sitemap.ts` dan `robots.ts` selalu mutakhir; artikel draft tidak boleh masuk sitemap.

Contoh pola:

```ts
// src/app/(blog)/blog/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
    image: post.coverImage,
  });
}
```

## 6. Aksesibilitas

- Semua kontrol bisa dioperasikan keyboard; fokus terlihat (`focus-visible:ring-2 ring-brand`).
- Tombol = `<button>`, navigasi = `<a>`/`<Link>`. Jangan `div` yang diklik.
- Ikon tanpa teks butuh `aria-label`; ikon dekoratif `aria-hidden="true"`.
- Form: `<label>` terhubung, pesan error dengan `aria-describedby`, status dibacakan (`aria-live="polite"`).
- Dropdown/menu mobile: `aria-expanded`, `aria-controls`, tutup dengan `Esc`.
- Target tap ≥ 44×44px. Kontras sesuai `DESIGN_SYSTEM.md` §1.
- Sediakan "skip to content" link.

## 7. Error Handling dan Data

- Batas sistem (form, query string, env, webhook): validasi Zod, jangan percaya tipe.
- Server Action mengembalikan hasil terstruktur (`{ ok: true } | { ok: false, errors }`), bukan melempar untuk error validasi.
- Jangan menelan error (`catch {}` kosong). Log di server dengan konteks; ke user tampilkan pesan aman.
- Tanggal disimpan UTC (ISO), diformat di tampilan. Tampilkan dengan `Intl.DateTimeFormat` dan `<time dateTime>`.

## 8. Git

- Conventional Commits: `feat(blog): add category page`.
- Branch: `feat/…`, `fix/…`, `docs/…`. PR kecil, satu tujuan.
- Sebelum PR: `bun run lint && bun run typecheck && bun run test && bun run build`.

## 9. Dependency

Aturan lengkap ada di `AGENTS.md` ("Aturan Dependency"). Ringkasnya: fitur Next.js/React → JavaScript/Web API/CSS native → dependency yang sudah ada → library baru (dengan persetujuan).

### Dependency yang sudah disetujui

| Paket                                                                          | Alasan tidak cukup dengan native                    |
| ------------------------------------------------------------------------------ | --------------------------------------------------- |
| `next`, `react`, `react-dom`, `typescript`                                     | Fondasi                                             |
| `tailwindcss`, `@tailwindcss/turbopack` | Sistem styling (ADR-004). Tailwind lewat rule Turbopack di `next.config.ts` (bawaan scaffold) |
| `drizzle-orm`, `drizzle-kit`, `postgres`                                       | Akses PostgreSQL bertipe aman dan migrasi (ADR-008) |
| `zod`                                                                          | Validasi input di batas sistem + inferensi tipe     |
| `server-only`                                                                  | Mencegah modul server terbawa ke client             |
| `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`      | Kualitas kode                                       |
| `vitest`, `@vitejs/plugin-react`, `jsdom` (dipin v26 agar jalan di Node 20), `@testing-library/react`, `@testing-library/dom`, `@playwright/test`, `@axe-core/playwright` | Pengujian (`TESTING.md`) |

### Disetujui secara prinsip, pilihan paketnya belum ditentukan

Tawarkan opsi saat tiba waktunya ("Tawarkan Pilihan Dulu"): parser Markdown + sanitizer HTML (ADR-009), autentikasi admin (ADR-005).

Sudah diputuskan tanpa library tambahan: pengiriman email lewat REST API Resend dengan `fetch` (ADR-012) dan rate limit form kontak berbasis tabel database.

### Contoh: gunakan native

| Kebutuhan                       | Pakai                                                  | Bukan                                   |
| ------------------------------- | ------------------------------------------------------ | --------------------------------------- |
| Format tanggal/angka            | `Intl.DateTimeFormat`, `Intl.NumberFormat`             | dayjs, moment, date-fns                 |
| HTTP                            | `fetch`                                                | axios                                   |
| Utilitas array/objek            | `toSorted`, `Object.groupBy`, `structuredClone`        | lodash                                  |
| ID unik                         | `crypto.randomUUID()`                                  | uuid, nanoid                            |
| Slug                            | fungsi kecil (`normalize('NFD')` + regex)              | slugify                                 |
| Animasi sederhana, scroll halus | CSS (`transition`, `animation`, `scroll-behavior`)     | framer-motion, AOS                      |
| Ikon                            | SVG inline / komponen sendiri                          | paket ikon besar                        |
| Meta, sitemap, robots, RSS      | Metadata API, `sitemap.ts`, `robots.ts`, Route Handler | next-seo, next-sitemap                  |
| Form state                      | `useActionState`, `useFormStatus`                      | react-hook-form (kecuali form kompleks) |
