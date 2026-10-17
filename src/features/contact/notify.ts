import 'server-only';
import { getEnv } from '@/lib/env';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const REQUEST_TIMEOUT_MS = 8000;

export type ContactNotification = {
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
};

export type NotifyResult = 'sent' | 'skipped' | 'failed';

/** Hapus karakter kontrol agar nilai dari pengguna aman dipakai di subjek. */
function singleLine(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);
}

// Email dikirim sebagai teks polos (tanpa HTML) supaya isi dari pengguna tidak bisa menyisipkan markup.
export function buildNotificationText(input: ContactNotification): string {
  return [
    `Nama: ${singleLine(input.name, 100)}`,
    `Email: ${singleLine(input.email, 254)}`,
    `Telepon: ${input.phone ? singleLine(input.phone, 20) : '-'}`,
    `Layanan: ${input.service ? singleLine(input.service, 60) : '-'}`,
    '',
    input.message,
  ].join('\n');
}

export async function sendContactNotification(input: ContactNotification): Promise<NotifyResult> {
  const env = getEnv();
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) return 'skipped';

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: `Pesan kontak baru: ${singleLine(input.name, 80)}`,
        text: buildNotificationText(input),
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (response.ok) return 'sent';

    // Hanya kode status dan jenis galat yang dicatat; isi pesan Resend bisa memuat alamat email.
    const detail = (await response.json().catch(() => null)) as { name?: string } | null;
    console.error('notifikasi email ditolak Resend:', response.status, detail?.name ?? '-');
    return 'failed';
  } catch (error) {
    console.error(
      'notifikasi email gagal dikirim:',
      error instanceof Error ? error.name : 'unknown',
    );
    return 'failed';
  }
}
