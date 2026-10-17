# 8. Portofolio

> Status: Selesai (kode); data di database, dikelola di `/admin/portfolio`. Berisi 3 proyek CONTOH sampai ada proyek nyata.
> Fase: 4
> Folder kode: `src/features/portfolio/` (query publik), `src/features/admin/` (form), route `src/app/[locale]/portfolio/`, `src/app/admin/(panel)/portfolio/`

## 1. Tujuan

Menunjukkan bukti kerja: masalah, solusi, dan hasil tiap proyek, lalu mengarahkan pengunjung ke konsultasi.

## 2. Keputusan

- 2026-10-17: awalnya data di file `src/content/portfolio.ts`.
- 2026-10-18 (pemilik repo): pindah ke database dan dikelola dari menu **Portofolio** di admin. Pola dua bahasa sama dengan artikel (ADR-019): `portfolio_projects` + `portfolio_translations`, Indonesia wajib, Inggris opsional.
- Belum ada proyek nyata: 3 proyek contoh (fiktif, klien anonim, tanpa angka hasil) dipindah ke database oleh migrasi `0004` dengan `is_sample = true`.
- Proyek contoh: label "Contoh", `noindex`, tidak masuk sitemap. `/portfolio` ikut `noindex` selama semua proyek contoh. Proyek draft tidak tampil.

## 3. Route

| Route | Keterangan |
| --- | --- |
| `/portfolio` | Kartu proyek terbit yang punya terjemahan bahasa itu, urut `sort_order` |
| `/portfolio/[slug]` | Masalah, solusi, hasil, klien, layanan, teknologi, CTA, proyek lain. Slug tak dikenal/draft = 404 bermerek |
| `/admin/portfolio` (+ `/new`, `/[id]`) | Daftar dengan tombol aksi, form dua bahasa |

## 4. Menambah atau mengganti proyek

Di `/admin/portfolio` > Proyek baru: isi tab Indonesia (wajib) dan English (opsional), slug, layanan, teknologi (dipisah koma), urutan, lalu nyalakan "Tampilkan di situs". Matikan "Ini proyek contoh" untuk proyek nyata. Hanya tulis hasil yang bisa dibuktikan. Hapus proyek contoh sebelum rilis.

## 5. Kriteria Selesai

- [x] Daftar dan detail dua bahasa dari database; contoh berlabel; draft tersembunyi (E2E dengan data uji)
- [x] Proyek contoh tidak diindeks dan tidak masuk sitemap; proyek nyata masuk sitemap dengan hreflang (E2E)
- [x] CRUD di admin (E2E: buat, tampil di situs, hapus)
- [x] axe tanpa pelanggaran dan tanpa scroll horizontal
- [ ] **Ganti proyek contoh dengan proyek nyata sebelum rilis**
- [ ] Gambar cover proyek (kolom sudah ada, UI belum)
- [ ] JSON-LD `CreativeWork` per proyek
- [x] `PROGRESS.md` diperbarui
