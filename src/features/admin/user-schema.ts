import { z } from 'zod';

// Dipakai skrip pembuat akun (scripts/create-user.ts); nanti juga halaman kelola pengguna.
export const userSchema = z.object({
  email: z
    .email('Email tidak valid')
    .max(254)
    .transform((value) => value.toLowerCase()),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,30}$/, 'Username 3-30 karakter: huruf kecil, angka, garis bawah'),
  firstName: z.string().trim().min(1, 'Nama depan wajib diisi').max(60),
  lastName: z.string().trim().max(60).optional(),
  password: z.string().min(12, 'Password minimal 12 karakter').max(200),
});

export type NewUser = z.infer<typeof userSchema>;
