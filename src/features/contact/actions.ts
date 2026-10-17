'use server';

import { and, count, eq, gt } from 'drizzle-orm';
import { headers } from 'next/headers';
import { after } from 'next/server';
import { getDb } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { getEnv } from '@/lib/env';
import { CONTACT_FIELDS, RATE_LIMIT_MAX_MESSAGES, RATE_LIMIT_WINDOW_MINUTES } from './constants';
import { hashIp } from './ip-hash';
import { sendContactNotification } from './notify';
import { contactFormSchema } from './schema';
import type { ContactErrorCode, ContactField, ContactFormState } from './state';

async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || requestHeaders.get('x-real-ip') || 'unknown';
}

export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: bot mengisi kolom tersembunyi. Balas sukses agar tidak tahu ditolak.
  if (String(formData.get('website') ?? '') !== '') return { status: 'success' };

  const values = Object.fromEntries(
    CONTACT_FIELDS.map((field) => [field, String(formData.get(field) ?? '')]),
  ) as Record<ContactField, string>;

  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, ContactErrorCode>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message as ContactErrorCode;
    }
    return { status: 'error', code: 'form', fieldErrors, values };
  }

  try {
    const db = getDb();
    const ipHash = hashIp(await getClientIp(), getEnv().IP_HASH_SALT);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000);

    const [recent] = await db
      .select({ total: count() })
      .from(contactMessages)
      .where(and(eq(contactMessages.ipHash, ipHash), gt(contactMessages.createdAt, windowStart)));
    if ((recent?.total ?? 0) >= RATE_LIMIT_MAX_MESSAGES) {
      return { status: 'error', code: 'rateLimited', fieldErrors: {}, values };
    }

    await db.insert(contactMessages).values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service: parsed.data.service || null,
      message: parsed.data.message,
      ipHash,
    });

    // Email dikirim setelah respons; kegagalan tidak membatalkan pesan yang sudah tersimpan.
    after(async () => {
      const result = await sendContactNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        service: parsed.data.service || null,
        message: parsed.data.message,
      });
      if (result === 'failed') console.error('submitContact: notifikasi email gagal');
    });
    return { status: 'success' };
  } catch (error) {
    // Hanya jenis galat yang dicatat; isi form berisi data pribadi.
    console.error('submitContact failed:', error instanceof Error ? error.name : 'unknown');
    return { status: 'error', code: 'failed', fieldErrors: {}, values };
  }
}
