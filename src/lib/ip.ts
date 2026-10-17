import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || requestHeaders.get('x-real-ip') || 'unknown';
}
