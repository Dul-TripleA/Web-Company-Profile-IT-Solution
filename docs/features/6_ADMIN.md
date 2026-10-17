# 6. Admin

> Status: Draft
> Fase: 3
> Folder kode: `src/features/admin/`, route `src/app/admin/`

## 1. Tujuan

Memungkinkan tim menulis dan menerbitkan artikel serta membaca pesan kontak tanpa menyentuh kode atau database langsung.

## 2. Scope

**Termasuk**

- Login/logout admin.
- CRUD artikel: draft, terjadwal, terbit; pratinjau; kategori dan tag; upload gambar cover.
- Inbox pesan kontak: daftar, baca, tandai sudah ditangani.
- Revalidasi cache saat artikel berubah.

**Di luar scope**

- Registrasi mandiri dan akun publik.
- Editor WYSIWYG kompleks (awalnya textarea Markdown + pratinjau) [TODO: konfirmasi].
- Manajemen layanan/landing page (konten ada di kode).
- Audit log lengkap.

## 3. Route dan Halaman

| Route                                                   | Rendering | Keterangan       |
| ------------------------------------------------------- | --------- | ---------------- |
| `/admin/login`                                          | Dinamis   | Tidak butuh sesi |
| `/admin`                                                | Dinamis   | Ringkasan        |
| `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]` | Dinamis   | CRUD artikel     |
| `/admin/messages`                                       | Dinamis   | Inbox kontak     |

Semua `noindex`, dikecualikan di `robots.txt` dan sitemap.

## 4. Perilaku

- Tanpa sesi valid → redirect ke `/admin/login`. Pengecekan juga dilakukan di **setiap** Server Action/Route Handler, bukan hanya di layout.
- Peran: `ADMIN` penuh; `EDITOR` hanya artikel (`SECURITY.md` §4).
- Simpan artikel: validasi Zod → hitung `slug` (unik), `reading_mins` → simpan → `revalidateTag('posts')` + path artikel.
- Status:
  - `DRAFT`: tidak tampil publik.
  - `SCHEDULED`: terbit otomatis pada `published_at` oleh job terjadwal [TODO].
  - `PUBLISHED`: wajib punya `published_at`.
- Slug artikel terbit yang diubah → buat redirect, minta konfirmasi di UI.
- Hapus artikel: konfirmasi eksplisit; pertimbangkan soft delete [TODO].
- Upload gambar: batasi tipe (JPEG/PNG/WebP/AVIF) dan ukuran; `alt` wajib untuk cover.
- Rate limit dan penguncian sementara untuk percobaan login berulang.

Kasus tepi: dua editor mengedit artikel yang sama → deteksi konflik lewat `updated_at` [TODO: putuskan strategi].

## 5. Data

- Tabel: `users`, `posts`, `categories`, `tags`, `post_tags`, `contact_messages`.
- Fitur ini menulis query sendiri ke tabel yang juga dipakai `blog`; **tidak mengimpor dari `features/blog`**.
- Penyimpanan file upload: [TODO: Vercel Blob / S3-compatible / R2].

## 6. UI

- Layout admin terpisah dari situs publik; gaya konsisten dengan token `DESIGN_SYSTEM.md`, tetapi lebih padat.
- Pratinjau Markdown memakai `lib/markdown.ts` yang sama dengan blog (global).
- Form dengan error per field, status simpan, dan peringatan perubahan belum tersimpan.

## 7. SEO

- `robots: { index: false, follow: false }` di layout admin.
- Tidak masuk sitemap.

## 8. Dependensi

- Global: `components/ui`, `components/shared`, `lib/db`, `lib/markdown`, `lib/env`.
- Fitur lain: **tidak ada**.
- Library baru: **autentikasi** (ADR-005), **penyimpanan file**, dan mungkin **job terjadwal**. Semuanya belum dipilih; tawarkan opsi dulu.

## 9. Kriteria Selesai

- [ ] Pengguna tanpa login/peran tidak bisa memanggil action admin (test langsung ke action)
- [ ] Artikel bisa dibuat, diubah, dijadwalkan, diterbitkan, dihapus
- [ ] Cache publik ter-revalidate saat terbit/ubah
- [ ] Upload tervalidasi tipe dan ukuran
- [ ] Brute force login dibatasi
- [ ] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [ ] Library autentikasi (ADR-005)?
- [ ] Berapa pengguna admin, apakah perlu role EDITOR?
- [ ] Tempat penyimpanan gambar?
- [ ] Mekanisme artikel terjadwal?
- [ ] Soft delete atau hapus permanen?
