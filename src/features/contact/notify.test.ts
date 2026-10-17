import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const getEnv = vi.fn();
vi.mock('@/lib/env', () => ({ getEnv: () => getEnv() }));

import { buildNotificationText, sendContactNotification } from './notify';

const input = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  phone: null,
  service: 'web-development',
  message: 'Kami butuh ERP.',
};

const fullEnv = {
  RESEND_API_KEY: 're_test',
  CONTACT_TO_EMAIL: 'tim@doit.example',
  CONTACT_FROM_EMAIL: 'Do It <noreply@doit.example>',
};

describe('buildNotificationText', () => {
  it('memuat semua kolom dan tanda - untuk yang kosong', () => {
    const text = buildNotificationText(input);
    expect(text).toContain('Nama: Budi Santoso');
    expect(text).toContain('Telepon: -');
    expect(text).toContain('Layanan: web-development');
    expect(text.endsWith('Kami butuh ERP.')).toBe(true);
  });

  it('menjadikan nilai di header satu baris', () => {
    const text = buildNotificationText({ ...input, name: 'Budi\nBcc: x@evil.test' });
    expect(text.split('\n')[0]).toBe('Nama: Budi Bcc: x@evil.test');
  });
});

describe('sendContactNotification', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    getEnv.mockReset();
    vi.unstubAllGlobals();
  });

  it('dilewati bila konfigurasi email tidak lengkap', async () => {
    getEnv.mockReturnValue({ RESEND_API_KEY: 're_test' });
    expect(await sendContactNotification(input)).toBe('skipped');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mengirim permintaan yang benar ke Resend', async () => {
    getEnv.mockReturnValue(fullEnv);
    fetchMock.mockResolvedValue({ ok: true });

    expect(await sendContactNotification(input)).toBe('sent');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_test');
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      from: fullEnv.CONTACT_FROM_EMAIL,
      to: [fullEnv.CONTACT_TO_EMAIL],
      reply_to: 'budi@example.com',
    });
    expect(body.subject).toBe('Pesan kontak baru: Budi Santoso');
    expect(body).not.toHaveProperty('html');
  });

  it('gagal bila Resend membalas galat, dan hanya mencatat status serta jenis galat', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    getEnv.mockReturnValue(fullEnv);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ name: 'validation_error', message: 'hanya ke budi@example.com' }),
    });
    expect(await sendContactNotification(input)).toBe('failed');
    const output = JSON.stringify(logged.mock.calls);
    expect(output).toContain('403');
    expect(output).toContain('validation_error');
    expect(output).not.toContain('budi@example.com');
    logged.mockRestore();
  });

  it('gagal bila jaringan error, tanpa melempar', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    getEnv.mockReturnValue(fullEnv);
    fetchMock.mockRejectedValue(new Error('network'));
    expect(await sendContactNotification(input)).toBe('failed');
    logged.mockRestore();
  });
});
