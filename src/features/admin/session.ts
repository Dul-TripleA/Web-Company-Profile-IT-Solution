import { createHash, randomBytes } from 'node:crypto';

// Sesi disimpan di database: cookie berisi token acak, tabel `sessions` hanya menyimpan hash-nya.
export const SESSION_COOKIE = 'doit_admin';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
