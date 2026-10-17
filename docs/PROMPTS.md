# Contoh Prompt

Kumpulan prompt siap tempel untuk Claude Code atau agent lain. Semuanya bergantung pada isi repo, bukan riwayat chat, sehingga bisa dipakai di sesi baru. Ganti bagian dalam `<...>` sesuai kebutuhan.

Pemilik repo memakai file ini sebagai catatan pribadi. Agent tidak wajib membacanya.

## 1. Memulai sesi baru atau melanjutkan

```
Baca AGENTS.md lalu docs/PROGRESS.md. Ringkas status terakhir, blocker,
dan langkah berikutnya. Jangan ubah apa pun dulu.
```

## 2. Review dokumen sebelum mengerjakan

Jalankan setelah selesai merapikan dokumen, sebelum kode dimulai.

```
Periksa semua dokumen di docs/ dan docs/features/. Daftar semua [TODO], pertentangan antar-dokumen,
dan hal yang akan menghalangi Fase 0 atau Fase 1. Jangan mengubah file.
```

## 3. Mengerjakan Fase 0

```
Kerjakan Fase 0 di docs/ROADMAP.md. Ikuti aturan di AGENTS.md.
Untuk pilihan teknis yang belum diputuskan, tawarkan opsi dulu sebelum mengerjakan.
Setelah selesai, perbarui PROGRESS.md dan centang ROADMAP.md.
```

## 4. Mengerjakan satu fitur

```
Kerjakan fitur <N> (docs/features/<N_NAMA>.md).
Baca juga DESIGN_SYSTEM.md dan ARCHITECTURE.md. Jangan melebihi scope di dokumen fitur.
Jika ada [TODO] yang menghalangi, tanyakan, jangan mengarang.
Setelah selesai, jalankan bun run lint, typecheck, test, dan build, lalu laporkan hasilnya.
```

Contoh: `Kerjakan fitur 1 (docs/features/1_LANDING_PAGE.md).`

## 5. Menyiapkan dokumen fitur baru

```
Buat dokumen fitur baru "<nama fitur>" dari docs/features/_TEMPLATE.md
sebagai <N_NAMA>.md, tambahkan ke tabel docs/ROADMAP.md, lalu minta saya konfirmasi scope-nya.
```

## 6. Meminta pilihan teknologi

```
Untuk <kebutuhan, mis. pengiriman email>, tawarkan 2-4 opsi dengan trade-off singkat
dan tandai rekomendasimu. Jangan pasang apa pun sebelum saya memilih.
```

## 7. Mengubah keputusan yang sudah ada

```
Saya ingin mengganti <keputusan, mis. Neon> dengan <alternatif>. Baca ADR terkait di docs/DECISION.md,
jelaskan dampaknya ke dokumen dan kode, lalu tambahkan ADR baru yang menggantikan yang lama setelah saya setuju.
```

## 8. Memeriksa pekerjaan terhadap dokumen

```
Bandingkan kode fitur <N_NAMA> dengan docs/features/<N_NAMA>.md. Daftar kriteria selesai
yang sudah terpenuhi, belum, dan perilaku di kode yang tidak ada di dokumen. Jangan mengubah file.
```

## 9. Menutup sesi

```
Sesi selesai. Perbarui docs/PROGRESS.md (entri log, Status Saat Ini, Langkah Berikutnya),
ROADMAP.md, dan kriteria selesai di dokumen fitur sesuai pekerjaan tadi.
Tulis juga hal yang setengah jalan.
```

## Tips

- Sebut nama file dokumen secara eksplisit; agent lebih akurat daripada diminta "baca semua".
- Satu prompt, satu tujuan. Pecah pekerjaan besar per fitur.
- Bila agent mengarang isi `[TODO]`, hentikan dan minta: "Jangan mengarang. Tandai sebagai pertanyaan terbuka."
