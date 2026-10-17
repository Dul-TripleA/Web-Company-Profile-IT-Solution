import 'server-only';
import { and, eq, gt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';
import { getDb } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema';
import { SESSION_COOKIE, hashSessionToken } from './session';

export type CurrentUser = { id: string; username: string; firstName: string };

/** Pengguna dari cookie sesi, atau null. Dicache per request agar layout dan halaman cukup satu query. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  // Harus ditentukan saat request, bukan saat build (kalau tidak, hasil "belum login" ikut terpanggang).
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await getDb()
    .select({ id: users.id, username: users.username, firstName: users.firstName })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashSessionToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
});

/** Wajib dipanggil di setiap halaman, Server Action, dan Route Handler admin. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  return user;
}
