import 'server-only';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_UNPOOLED: z.string().min(1).optional(),
  // Garam untuk hash IP pada rate limit form kontak. Jangan dipakai ulang untuk hal lain.
  IP_HASH_SALT: z.string().min(16),
  // Notifikasi email form kontak (Resend). Bila salah satu kosong, notifikasi dilewati.
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  CONTACT_FROM_EMAIL: z.string().min(3).optional(),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

// Divalidasi saat pertama dipakai, bukan saat modul dimuat, agar build halaman statis
// tidak mensyaratkan variabel yang hanya dibutuhkan saat runtime (mis. DATABASE_URL).
export function getEnv(): Env {
  if (cached) return cached;

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Env tidak valid. ${problems}. Lihat .env.example.`);
  }

  cached = parsed.data;
  return cached;
}
