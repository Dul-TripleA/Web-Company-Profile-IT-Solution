'use server';

import { and, count, eq, gt, lt, or } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { adminLoginAttempts, sessions, users } from '@/lib/db/schema';
import { getEnv } from '@/lib/env';
import { getClientIp, hashIp } from '@/lib/ip';
import { verifyPassword } from './password';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  generateSessionToken,
  hashSessionToken,
} from './session';

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

// Dipakai bila pengguna tidak ditemukan, agar waktu respons tidak membocorkan akun yang ada.
const DUMMY_HASH =
  '00000000000000000000000000000000:' +
  '0000000000000000000000000000000000000000000000000000000000000000' +
  '0000000000000000000000000000000000000000000000000000000000000000';

export type LoginState = { error?: 'invalid' | 'rateLimited' | 'failed' };

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get('identifier') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');

  let token: string;
  try {
    const db = getDb();
    const ipHash = hashIp(await getClientIp(), getEnv().IP_HASH_SALT);
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000);

    const [recent] = await db
      .select({ total: count() })
      .from(adminLoginAttempts)
      .where(
        and(eq(adminLoginAttempts.ipHash, ipHash), gt(adminLoginAttempts.createdAt, windowStart)),
      );
    if ((recent?.total ?? 0) >= MAX_FAILED_ATTEMPTS) return { error: 'rateLimited' };

    const [user] = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(or(eq(users.email, identifier), eq(users.username, identifier)))
      .limit(1);

    const passwordOk = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !passwordOk) {
      await db.insert(adminLoginAttempts).values({ ipHash });
      // Bersih-bersih data lama di sela jalan agar tabel tidak membesar.
      await db.delete(adminLoginAttempts).where(lt(adminLoginAttempts.createdAt, windowStart));
      return { error: 'invalid' };
    }

    token = generateSessionToken();
    await db.insert(sessions).values({
      id: hashSessionToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
    });
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  } catch (error) {
    console.error('login failed:', error instanceof Error ? error.name : 'unknown');
    return { error: 'failed' };
  }

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: getEnv().NODE_ENV === 'production',
    path: '/admin',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  redirect('/admin');
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token)
    await getDb()
      .delete(sessions)
      .where(eq(sessions.id, hashSessionToken(token)));
  jar.delete({ name: SESSION_COOKIE, path: '/admin' });
  redirect('/admin/login');
}
