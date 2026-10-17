# Deploy ke Vercel

> Status: siap dipakai (2026-10-18). Keputusan di ADR-021. Belum pernah dijalankan ke produksi.

Panduan ini untuk pemilik repo. Agent: ikuti juga, dan **ingatkan bagian "Sebelum rilis"** sebelum deploy produksi.

## 1. Gambaran

| Hal | Pengaturan |
| --- | --- |
| Hosting | Vercel, region fungsi `sin1` (Singapura), dekat dengan Neon `ap-southeast-1` dan pengunjung Indonesia |
| Konfigurasi | `vercel.json`: framework Next.js, install `bun install --frozen-lockfile`, build `bun run build` |
| Database | Neon: branch **prod** untuk Production, branch **dev** untuk Preview dan lokal |
| Migrasi | **Manual** dari komputer lokal sebelum deploy (build Vercel tidak pernah mengubah database) |
| Data contoh | Hanya lewat `bun run db:seed` ke branch dev. Migrasi tidak berisi data contoh, jadi branch prod tetap bersih |
| Header keamanan | Di `next.config.ts` (nosniff, Referrer-Policy, X-Frame-Options DENY, Permissions-Policy) |

## 2. Variabel environment di Vercel

Isi di Vercel > Project > Settings > Environment Variables. Jangan menempel nilai rahasia di chat, issue, atau commit.

| Variabel | Production | Preview | Keterangan |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://domain-anda` | URL preview atau domain staging | Tanpa `/` di akhir. Dipakai canonical, sitemap, OG |
| `DATABASE_URL` | Neon prod, endpoint **pooled** (`-pooler`) | Neon dev, pooled | Wajib |
| `IP_HASH_SALT` | Teks acak min. 16 karakter | Boleh berbeda | Wajib (batas kirim form dan login) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Isi ketiganya | Opsional | **Wajib sebelum rilis** (lihat "Sebelum rilis") |

`DATABASE_URL_UNPOOLED` **tidak** perlu di Vercel; hanya dipakai `db:migrate` di komputer lokal.

## 3. Langkah pertama kali

1. **Neon**: buat branch `prod` (atau pakai branch utama sebagai prod dan buat `dev` untuk pengembangan). Salin dua alamat koneksi prod: pooled (dengan `-pooler`) dan langsung (tanpa `-pooler`).
2. **Migrasi ke prod** dari terminal lokal (PowerShell), tanpa mengubah `.env`:

   ```powershell
   $env:DATABASE_URL_UNPOOLED = "<alamat LANGSUNG branch prod>"; bun run db:migrate
   ```

   Tutup terminal setelahnya agar variabel itu hilang.
3. **Akun admin pertama di prod**:

   ```powershell
   $env:DATABASE_URL = "<alamat POOLED branch prod>"; bun run admin:create
   ```

4. **Vercel**: Add New > Project > impor repo GitHub. Framework dan perintah terbaca dari `vercel.json`. Atur **Production Branch** (Settings > Git) ke branch yang akan dirilis (mis. `main`; saat ini pekerjaan ada di `feat/nextjs-layout`).
5. Isi variabel environment (bagian 2), lalu **Deploy**.
6. **Domain**: Settings > Domains > tambahkan domain; ikuti instruksi DNS. Setelah aktif, ubah `NEXT_PUBLIC_SITE_URL` ke domain itu lalu redeploy.
7. **Google Search Console**: verifikasi domain, kirim `https://domain-anda/sitemap.xml`.

## 4. Setiap deploy berikutnya

1. Ada migrasi baru di `drizzle/`? Jalankan dulu ke prod (langkah 3.2), **baru** merge/push. Migrasi harus kompatibel dengan kode lama selama beberapa menit deploy (tambah kolom/tabel dulu, hapus belakangan).
2. Push ke Production Branch: Vercel membangun dan merilis otomatis. Branch lain menjadi Preview (memakai database dev).
3. Cek cepat: halaman utama, `/id/blog`, form kontak, `/admin/login`.

## 5. Jangan

- Jangan menjalankan `bun run db:seed` ke branch prod. Skrip menampilkan nama host database dan meminta konfirmasi "ya"; baca host-nya sebelum mengetik.
- Jangan menaruh alamat prod di `.env` lokal secara permanen.
- Jangan menjalankan migrasi dari build Vercel (keputusan ADR-021).

## 6. Sebelum rilis (wajib dicek, lihat juga `PROGRESS.md` "Ditunda tetapi Penting")

- [ ] **Notifikasi email Resend** aktif dan diuji kirim sungguhan (tanpa ini pesan kontak tidak memberi tahu siapa pun).
- [ ] **Proyek portofolio contoh** diganti proyek nyata, atau dimatikan dari "Tampilkan di situs".
- [ ] Artikel nyata ada (data seeder tidak ikut ke prod).
- [ ] Nomor telepon asli (saat ini dummy) dan halaman Kebijakan Privasi (form mengumpulkan data pribadi).
- [ ] `NEXT_PUBLIC_SITE_URL` = domain final; Lighthouse diukur ulang di produksi.
