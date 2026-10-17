import { describe, expect, it } from 'vitest';
import { hashIp } from '@/lib/ip';
import { contactFormSchema } from './schema';

const valid = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  phone: '',
  service: '',
  message: 'Kami butuh sistem ERP untuk gudang kami.',
};

function firstError(input: Partial<Record<keyof typeof valid, string>>, field: keyof typeof valid) {
  const result = contactFormSchema.safeParse({ ...valid, ...input });
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe('contactFormSchema', () => {
  it('menerima input valid', () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it('menerima telepon dan layanan yang valid', () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      phone: '+62 851-1053-0560',
      service: 'web-development',
    });
    expect(result.success).toBe(true);
  });

  it('nama kosong, terlalu pendek, terlalu panjang', () => {
    expect(firstError({ name: '' }, 'name')).toBe('required');
    expect(firstError({ name: 'A' }, 'name')).toBe('tooShort');
    expect(firstError({ name: 'A'.repeat(101) }, 'name')).toBe('tooLong');
  });

  it('email kosong dan tidak valid', () => {
    expect(firstError({ email: '' }, 'email')).toBe('required');
    expect(firstError({ email: 'bukan-email' }, 'email')).toBe('invalidEmail');
  });

  it('telepon tidak valid', () => {
    expect(firstError({ phone: 'abc123' }, 'phone')).toBe('invalidPhone');
    expect(firstError({ phone: '123' }, 'phone')).toBe('invalidPhone');
  });

  it('layanan di luar daftar ditolak', () => {
    expect(firstError({ service: 'tidak-ada' }, 'service')).toBe('invalidService');
  });

  it('pesan kosong, terlalu pendek, terlalu panjang', () => {
    expect(firstError({ message: '' }, 'message')).toBe('required');
    expect(firstError({ message: 'pendek' }, 'message')).toBe('tooShort');
    expect(firstError({ message: 'x'.repeat(2001) }, 'message')).toBe('tooLong');
  });

  it('memangkas spasi di tepi', () => {
    const result = contactFormSchema.parse({ ...valid, name: '  Budi Santoso  ' });
    expect(result.name).toBe('Budi Santoso');
  });
});

describe('hashIp', () => {
  it('deterministik untuk IP dan garam yang sama', () => {
    expect(hashIp('1.2.3.4', 'garam-garam-garam-1')).toBe(hashIp('1.2.3.4', 'garam-garam-garam-1'));
  });

  it('berbeda untuk IP atau garam yang berbeda', () => {
    const base = hashIp('1.2.3.4', 'garam-garam-garam-1');
    expect(hashIp('1.2.3.5', 'garam-garam-garam-1')).not.toBe(base);
    expect(hashIp('1.2.3.4', 'garam-garam-garam-2')).not.toBe(base);
  });

  it('tidak memuat IP asli', () => {
    expect(hashIp('1.2.3.4', 'garam-garam-garam-1')).not.toContain('1.2.3.4');
  });
});
