# 6. Admin

> Status: Selesai (kode), tahap 1
> Fase: 3
> Folder kode: `src/features/admin/`, route `src/app/admin/`

## 1. Tujuan

Memungkinkan tim menulis dan menerbitkan artikel serta membaca pesan kontak tanpa menyentuh kode atau database langsung.

## 2. Keputusan (2026-10-17, dipilih pemilik repo)

- **Auth buatan sendiri, tanpa library** (ADR-017): akun di tabel `users` (multiuser), sesi di tabel `sessions`. Tidak ada akun atau secret admin di `.env`. Pemilik repo menegaskan harus sederhana tetapi aman.
- **Cover: tempel URL** `https` atau path lokal `/images/blog/...`. Upload file ditunda sampai hosting dipilih.
- **Scope tahap 1**: artikel + kategori + inbox pesan. Tag tidak ada (sama seperti blog). Artikel terjadwal = `published_at` di masa depan (tanpa job). Hapus permanen dengan konfirmasi.
- Teks admin berbahasa Indonesia saja (tidak dua bahasa).

## 3. Route

| Route | Keterangan |
| --- | --- |
| `/admin/login` | Form masuk (pengguna yang sudah masuk dialihkan ke `/admin`) |
| `/admin` | Ringkasan: jumlah artikel terbit, draft, pesan belum ditangani |
| `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]` | Daftar, buat, ubah + hapus |
| `/admin/posts/[id]/preview` | Pratinjau Markdown (komponen yang sama dengan situs publik), termasuk draft |
| `/admin/categories` | Tambah, ganti nama, hapus kategori (slug tetap) |
| `/admin/messages` | Inbox kontak (belum ditangani di atas), tandai ditangani, 20 per halaman |

Semua `noindex`; `robots.txt` memblokir `/admin`; tidak ada di sitemap. Layout akar `src/app/admin/layout.tsx` terpisah dari situs publik.

## 4. Perilaku

- Tanpa sesi valid: dialihkan ke `/admin/login`. `requireAdmin()` dipanggil di layout, **setiap halaman**, dan **setiap Server Action**.
- Login: email **atau** username + password, dibandingkan dengan `users.password_hash` (scrypt). Hash selalu diperiksa (hash tiruan bila akun tidak ada) agar waktu respons tidak membocorkan akun. Pesan galat umum.
- Batas percobaan: 5 gagal per 15 menit per IP (hash IP + garam) di tabel `admin_login_attempts`; setelah itu password benar pun ditolak sampai jendela lewat.
- Sesi: cookie `doit_admin` berisi token acak (32 byte); tabel `sessions` hanya menyimpan SHA-256 token, `user_id`, dan kedaluwarsa (7 hari). `HttpOnly`, `SameSite=Lax`, `Secure` di produksi, `Path=/admin`. Keluar menghapus barisnya, jadi cookie lama langsung tidak berlaku.
- Simpan artikel: validasi Zod di server, slug otomatis dari judul bila kosong, slug ganda ditolak, kategori harus berbahasa sama, cover butuh teks alternatif. Tanggal terbit dibaca sebagai WIB. Status terbit tanpa tanggal = sekarang.
- Setelah buat/ubah/hapus: `updateTag('posts')` agar situs publik langsung berubah.
- Mengubah slug artikel terbit memutus tautan lamanya (belum ada redirect); formulir memberi peringatan.

## 5. Data

Tabel `users` (id, email, username, first_name, last_name, password_hash, created_at), `sessions`, `admin_login_attempts` (migrasi `0002`-`0003`), plus `posts`, `categories`, `contact_messages`. Semua pengguna punya akses admin penuh; peran ditambah saat dibutuhkan. Fitur ini menulis query sendiri; tidak mengimpor dari `features/blog` atau `features/contact` (helper IP dinaikkan ke `lib/ip.ts`).

## 6. Membuat akun admin (pemilik repo)

1. Pastikan `DATABASE_URL` terisi di `.env` dan migrasi sudah diterapkan (`bun run db:migrate`).
2. `bun run admin:create`: isi email, username, nama depan, nama belakang (opsional), dan password (min. 12 karakter; tidak tampil saat diketik).
3. `bun run dev`, masuk di `/admin/login` dengan email atau username.

Akun tambahan dibuat dengan perintah yang sama. Halaman kelola pengguna di `/admin` belum ada.

## 7. Kriteria Selesai

- [x] Tanpa login tidak bisa membuka halaman admin; token palsu ditolak (E2E)
- [x] Artikel bisa dibuat, diubah, dijadikan draft, dipratinjau, dihapus; situs publik ikut berubah (E2E)
- [x] Cache publik ter-revalidate saat berubah (E2E: artikel muncul/berubah/hilang di `/id/blog/...`)
- [x] Brute force login dibatasi (E2E), sesi lama tidak berlaku setelah keluar (E2E), dan cookie `HttpOnly`/`SameSite=Lax` (E2E)
- [x] axe tanpa pelanggaran di semua halaman admin
- [ ] Upload gambar (ditunda; butuh keputusan hosting/penyimpanan)
- [ ] Peran/hak akses berbeda dan halaman kelola pengguna (semua pengguna kini admin penuh)
- [x] `PROGRESS.md` diperbarui

## 9. UI (desain ulang 2026-10-17)

Acuan visual: `docs/reference/dashboard-ui.jpg`, aturan lengkap di `docs/DESIGN_SYSTEM.md` §11. Ringkas:

- Sidebar gelap dengan menu aktif dan badge jumlah pesan belum ditangani; kartu akun + tombol keluar di bawah. Di layar `< lg` sidebar menjadi laci (tombol menu, `Escape`, klik latar untuk menutup, otomatis tertutup saat pindah halaman).
- Ringkasan: 4 kartu statistik (terbit, terjadwal, draft, pesan belum ditangani; masing-masing tautan ke daftar terfilter), artikel terakhir diubah, pesan menunggu.
- Artikel: filter pil (Semua/Terbit/Terjadwal/Draft) dan pencarian judul/slug lewat URL (`?status=&q=`); tabel di desktop, kartu di ponsel. Kolom **Bahasa** berupa bendera (pudar = belum ada versi itu) dan kolom **Aksi** (Ubah, Pratinjau, Lihat, Hapus dengan konfirmasi).
- Form (artikel dan portofolio) mengikuti `docs/reference/form-ui.webp`: navigasi bagian di kiri (desktop), kartu per bagian, baris "label + keterangan | isian" dengan garis putus-putus, tab bahasa berbendera (Indonesia wajib, English opsional; titik merah bila ada galat), sakelar Terbit, slug dengan awalan `/blog/`, bilah simpan lengket dengan penanda "Belum disimpan / Perubahan tersimpan", peringatan saat meninggalkan form. Editor isi: MDXEditor (ADR-018).
- Kategori: satu kategori dua nama (bendera), simpan per baris, hapus dengan konfirmasi.
- Portofolio: menu sendiri; tabel dengan bendera, status (Tampil/Draft/Contoh), aksi.
- Pesan: filter "Belum ditangani", tombol Balas (mailto) dan tandai ditangani.
- Login: kartu dua panel (panel merek hanya di desktop), tombol tampilkan/sembunyikan password.

## 10. Di luar scope tahap 1

Upload gambar, tag, peran, halaman kelola/ubah password pengguna, reset password, soft delete, job terjadwal, deteksi konflik edit bersamaan (last write wins), redirect saat slug berubah, audit log.
