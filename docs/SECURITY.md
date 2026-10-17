# Security

> Status: TEMPLATE. Berlaku untuk landing page publik, form kontak, blog, dan area admin.

## 1. Prinsip

- Semua input dari luar dianggap tidak tepercaya: form, query string, header, body webhook, isi artikel.
- Validasi di batas sistem dengan Zod, di server. Validasi client hanya UX.
- Hak akses minimum. Fail closed: bila ragu, tolak.

## 2. Secret dan Environment

- Secret hanya di env server. Variabel berawalan `NEXT_PUBLIC_` terlihat publik; jangan taruh secret di sana.
- Baca env server lewat `getEnv()` di `src/lib/env.ts` (tervalidasi). Jangan akses `process.env` langsung di komponen.
- `.env*` masuk `.gitignore`; hanya `.env.example` di repo. Bila secret pernah ter-commit, anggap bocor dan rotasi.
- Impor `server-only` di modul yang memegang secret/DB agar gagal build bila terbawa ke client.

## 3. Form dan Server Action

- Skema Zod untuk setiap action; batasi panjang field (mis. `message` ≤ 2000).
- **Anti-spam**: honeypot field + rate limit per IP [TODO: Upstash / in-memory untuk MVP] + opsional Turnstile/reCAPTCHA.
- Server Action Next.js memeriksa `Origin` terhadap `Host` (perlindungan CSRF bawaan); jangan menonaktifkannya. Route Handler yang mengubah data wajib punya proteksi CSRF/token sendiri.
- Cegah header injection di email: jangan tempel input user ke header; pakai field `replyTo` terstruktur.
- Jangan membocorkan detail internal di pesan error ke user.

## 4. Autentikasi dan Otorisasi (Admin)

- Gunakan library mapan (lihat ADR-005); jangan menulis kripto/sesi sendiri.
- Password: argon2id/bcrypt. Cookie sesi: `HttpOnly`, `Secure`, `SameSite=Lax`.
- Cek otorisasi di **setiap** Server Action/Route Handler admin, bukan hanya di `proxy.ts`/layout. Proteksi di UI bukan proteksi.
- Batasi percobaan login (rate limit) dan catat kegagalan.
- Role: `ADMIN` penuh; `EDITOR` hanya artikel. Cek peran di server.

## 5. Konten dan XSS

- React meng-escape output secara default. Jangan `dangerouslySetInnerHTML` kecuali: (a) JSON-LD dari objek sendiri (`JSON.stringify`, escape `<` menjadi `<`), atau (b) HTML artikel yang sudah disanitasi allowlist.
- Markdown/MDX dari DB: render dengan pipeline yang tidak mengeksekusi kode arbitrer. MDX dari pengguna tidak tepercaya = eksekusi kode; hanya render MDX milik tim dari repo.
- Upload gambar: validasi tipe MIME dan ukuran, ganti nama file, simpan di storage terpisah, jangan eksekusi.
- URL dari user (mis. sosial media): izinkan hanya skema `https:`.

## 6. Header dan Transport

Atur di `next.config.ts` (`headers()`):

| Header                                | Nilai awal                                                            |
| ------------------------------------- | --------------------------------------------------------------------- |
| `Strict-Transport-Security`           | `max-age=63072000; includeSubDomains; preload` (setelah HTTPS stabil) |
| `X-Content-Type-Options`              | `nosniff`                                                             |
| `Referrer-Policy`                     | `strict-origin-when-cross-origin`                                     |
| `Permissions-Policy`                  | matikan fitur yang tidak dipakai (camera, microphone, geolocation)    |
| `X-Frame-Options` / `frame-ancestors` | `DENY` kecuali memang perlu di-embed                                  |
| `Content-Security-Policy`             | mulai mode `Report-Only` dengan nonce, ketatkan bertahap [TODO]       |

- `images.remotePatterns` di `next.config.ts` dibatasi ke domain yang dipakai saja.
- Paksa HTTPS di produksi; redirect `www`/non-`www` ke satu kanonik.

## 7. Dependency

- Kunci versi lewat lockfile; commit `bun.lock`.
- Jalankan `bun audit` di CI; aktifkan Dependabot/Renovate.
- Review dependency baru: aktif dirawat, ukuran, lisensi, jumlah dependensi transitif.
- Script pihak ketiga (analytics, chat) hanya lewat `next/script` dan didaftarkan di CSP.

## 8. Privasi

- Form kontak mengumpulkan data pribadi: sebutkan tujuan dan retensi. Sediakan halaman Kebijakan Privasi (UU PDP Indonesia) [TODO].
- Analytics: pilih yang ramah privasi atau minta consent bila memakai cookie pelacak.
- Jangan log data pribadi (isi pesan, password, token) ke konsol/monitoring.

## 9. Respons Insiden

[TODO: kontak keamanan, langkah rotasi secret, cara menonaktifkan form/admin cepat.]
