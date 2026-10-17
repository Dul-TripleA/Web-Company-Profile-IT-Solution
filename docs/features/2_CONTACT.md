# 2. Contact (Form Konsultasi)

> Status: Berjalan (form, validasi, rate limit, dan penyimpanan sudah ada; belum teruji ke database; email notifikasi belum ada)
> Fase: 1
> Folder kode: `src/features/contact/`, route `src/app/(marketing)/contact/`

## 1. Tujuan

Menerima permintaan konsultasi dari pengunjung dan memastikan tim Do It tahu. Berhasil bila pesan valid tersimpan di database dan notifikasi terkirim, tanpa spam.

## 2. Scope

**Termasuk**

- Halaman `/contact` berisi form dan info kontak (email, telepon, alamat, sosial).
- Server Action `submitContact`: validasi, anti-spam, simpan, kirim notifikasi.
- Tujuan CTA "Free Consultation" dari seluruh situs (`#appointment` di template).
- Tautan WhatsApp / telepon [TODO: konfirmasi].

**Di luar scope**

- Balasan otomatis ke pengirim.
- Inbox untuk membaca pesan (ada di `6_ADMIN.md`).
- Upload lampiran.

## 3. Route dan Halaman

| Route      | Rendering                          | Keterangan                  |
| ---------- | ---------------------------------- | --------------------------- |
| `/contact` | Statis; submit lewat Server Action | `title`, `description` unik |

## 4. Perilaku

Field:

| Field                | Wajib | Aturan                                                            |
| -------------------- | ----- | ----------------------------------------------------------------- |
| `name`               | ya    | 2-100 karakter                                                    |
| `email`              | ya    | format email valid, ≤ 254 karakter                                |
| `phone`              | tidak | angka, spasi, `+`, `-`; 6-20 karakter                             |
| `service`            | tidak | salah satu dari daftar layanan di `src/content/`                  |
| `message`            | ya    | 10-2000 karakter                                                  |
| `website` (honeypot) | tidak | harus kosong; tersembunyi dari user, `aria-hidden`, `tabindex=-1` |

Alur:

1. User mengisi dan mengirim. Tombol menjadi _pending_, ganda-klik tidak mengirim dua kali.
2. Server memvalidasi ulang dengan Zod. Gagal → kembalikan `{ ok: false, errors }`, isi form dipertahankan, fokus ke field error pertama.
3. Honeypot terisi → tampilkan sukses palsu, tidak simpan.
4. Rate limit per IP terlampaui → pesan "terlalu banyak percobaan, coba lagi nanti".
5. Simpan ke `contact_messages`, kirim email notifikasi ke `CONTACT_TO_EMAIL`.
6. Sukses → pesan konfirmasi, form dikosongkan.

Kasus tepi:

- Email gagal terkirim tapi pesan tersimpan → user tetap melihat sukses; kegagalan dicatat di log server.
- DB gagal → pesan error umum, data form tidak hilang.
- JavaScript mati → form tetap bisa dikirim (progressive enhancement lewat `<form action>`).

## 5. Data

- Tabel `contact_messages` (`DATABASE.md` §3).
- Validasi: `features/contact/schema.ts` (Zod), dipakai client untuk UX dan server untuk keputusan.
- Jangan menyimpan IP mentah lebih lama dari yang perlu untuk rate limit [TODO: kebijakan retensi].

## 6. UI

- Komponen form: `features/contact/components/contact-form.tsx` (client, `useActionState`).
- Gaya input dan tombol: `DESIGN_SYSTEM.md`. [TODO: gaya input belum ada di template Blade; usulan tema gelap `forest-deep`, border `emerald-900/60`, fokus `ring-brand`.]
- Aksesibilitas: `<label>` terhubung, error lewat `aria-describedby`, status sukses/gagal di `aria-live="polite"`, target tap ≥ 44px.

## 7. SEO

- Title: "Contact Us | Do It" [TODO: final]; description unik.
- JSON-LD: `ContactPage` atau `Organization.contactPoint`.
- Masuk sitemap: ya.

## 8. Dependensi

- Global: `components/ui` (Button, Container), `lib/db`, `lib/env`.
- Library baru: **pengiriman email** dan **rate limiting** belum dipilih. Tawarkan opsi dulu (lihat "Tawarkan Pilihan Dulu" di `AGENTS.md`). Opsi awal: Resend, SMTP via Nodemailer; rate limit dengan tabel DB atau layanan KV.

## 9. Kriteria Selesai

- [ ] Form valid tersimpan dan notifikasi terkirim
- [x] Semua aturan validasi punya test (valid, kosong, terlalu panjang, email salah)
- [ ] Honeypot dan rate limit teruji
- [ ] Bekerja tanpa JavaScript
- [ ] Lolos cek a11y (axe) dan keyboard
- [x] Tidak ada data pribadi di log (yang dicatat hanya nama jenis galat)
- [ ] `PROGRESS.md` diperbarui

## 10. Pertanyaan Terbuka

- [ ] Penyedia email dan alamat tujuan?
- [ ] Perlu WhatsApp click-to-chat?
- [ ] Daftar layanan untuk dropdown `service`?
- [ ] Kebijakan privasi dan retensi data?

## 11. Catatan Implementasi (2026-10-17)

- Kode: `src/features/contact/` (`schema.ts`, `actions.ts`, `state.ts`, `ip-hash.ts`, `components/contact-form.tsx`), tabel `contact_messages` + migrasi `drizzle/0000_*.sql`.
- Rate limit: maksimal 3 pesan per IP per 10 menit, dihitung dari tabel `contact_messages` memakai `ip_hash` (SHA-256 IP + `IP_HASH_SALT`); tanpa library tambahan.
- **Belum**: email notifikasi (penyedia email belum dipilih; sementara pesan hanya tersimpan di DB dan nanti dibaca lewat inbox admin, `6_ADMIN.md`). Jalur DB (insert, rate limit) belum pernah dijalankan karena project Neon belum ada; sebelum itu, form menampilkan galat "failed".
- Butuh env `DATABASE_URL` dan `IP_HASH_SALT` (lihat `.env.example`); migrasi dijalankan dengan `bun run db:migrate`.
- "Bekerja tanpa JavaScript" belum diuji.
