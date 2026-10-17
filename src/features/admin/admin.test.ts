import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';
import {
  parseJakartaDateTime,
  postFormSchema,
  slugify,
  toJakartaInputValue,
  toPostValues,
} from './post-schema';
import { generateSessionToken, hashSessionToken } from './session';
import { userSchema } from './user-schema';

describe('password', () => {
  it('hash berbeda tiap kali dan hanya cocok dengan password benar', async () => {
    const a = await hashPassword('rahasia-panjang-123');
    const b = await hashPassword('rahasia-panjang-123');
    expect(a).not.toBe(b);
    expect(await verifyPassword('rahasia-panjang-123', a)).toBe(true);
    expect(await verifyPassword('salah', a)).toBe(false);
  });

  it('menolak hash yang rusak tanpa melempar galat', async () => {
    expect(await verifyPassword('x', '')).toBe(false);
    expect(await verifyPassword('x', 'abc:def')).toBe(false);
  });
});

describe('session', () => {
  it('token acak dan unik; yang disimpan hanya hash-nya', () => {
    const a = generateSessionToken();
    const b = generateSessionToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(43);
    expect(hashSessionToken(a)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashSessionToken(a)).not.toContain(a);
    expect(hashSessionToken(a)).toBe(hashSessionToken(a));
  });
});

describe('userSchema', () => {
  const valid = {
    email: 'Budi@Example.com',
    username: 'Budi_01',
    firstName: 'Budi',
    password: 'password-yang-panjang',
  };

  it('menormalkan email dan username ke huruf kecil', () => {
    const parsed = userSchema.parse(valid);
    expect(parsed.email).toBe('budi@example.com');
    expect(parsed.username).toBe('budi_01');
  });

  it('menolak username tidak valid, email salah, dan password pendek', () => {
    const fails = (input: object) => !userSchema.safeParse({ ...valid, ...input }).success;
    expect(fails({ username: 'a b' })).toBe(true);
    expect(fails({ username: 'ab' })).toBe(true);
    expect(fails({ email: 'bukan-email' })).toBe(true);
    expect(fails({ password: 'pendek' })).toBe(true);
    expect(fails({ firstName: '' })).toBe(true);
  });
});

describe('slugify', () => {
  it('mengubah judul menjadi slug aman URL', () => {
    expect(slugify('Tips Cepat & Aman!')).toBe('tips-cepat-aman');
    expect(slugify('Café Résumé 2026')).toBe('cafe-resume-2026');
    expect(slugify('---')).toBe('');
  });
});

describe('waktu Jakarta', () => {
  it('dua arah konsisten', () => {
    const date = parseJakartaDateTime('2026-10-17T08:30');
    expect(date?.toISOString()).toBe('2026-10-17T01:30:00.000Z');
    expect(toJakartaInputValue(date)).toBe('2026-10-17T08:30');
    expect(parseJakartaDateTime('kemarin')).toBeNull();
  });
});

describe('postFormSchema', () => {
  const valid = {
    locale: 'id',
    title: 'Judul Artikel',
    slug: '',
    excerpt: 'Ringkasan yang cukup panjang.',
    content: '# Isi',
    coverImage: '',
    coverAlt: '',
    status: 'DRAFT',
    publishedAt: '',
    authorName: 'Do It',
    categoryId: '',
    seoTitle: '',
    seoDescription: '',
  };
  const issues = (input: Record<string, string>) => {
    const result = postFormSchema.safeParse({ ...valid, ...input });
    return result.success ? [] : result.error.issues.map((issue) => String(issue.path[0]));
  };

  it('menerima data valid dan membuat slug dari judul', () => {
    const parsed = postFormSchema.parse(valid);
    expect(toPostValues(parsed).slug).toBe('judul-artikel');
  });

  it('menolak slug tidak aman atau dicadangkan', () => {
    expect(issues({ slug: 'Slug Salah' })).toContain('slug');
    expect(issues({ slug: 'page' })).toContain('slug');
    expect(issues({ slug: 'category' })).toContain('slug');
  });

  it('cover: hanya https atau path lokal, dan alt wajib', () => {
    expect(issues({ coverImage: 'http://x.test/a.jpg', coverAlt: 'a' })).toContain('coverImage');
    expect(issues({ coverImage: 'javascript:alert(1)', coverAlt: 'a' })).toContain('coverImage');
    expect(issues({ coverImage: '//evil.test/a.jpg', coverAlt: 'a' })).toContain('coverImage');
    expect(issues({ coverImage: '/images/blog/a.jpg' })).toContain('coverAlt');
    expect(issues({ coverImage: '/images/blog/a.jpg', coverAlt: 'a' })).toEqual([]);
    expect(issues({ coverImage: 'https://x.test/a.jpg', coverAlt: 'a' })).toEqual([]);
  });

  it('terbit tanpa tanggal memakai waktu sekarang; draft boleh tanpa tanggal', () => {
    const now = new Date('2026-10-17T00:00:00Z');
    const published = toPostValues(postFormSchema.parse({ ...valid, status: 'PUBLISHED' }), now);
    expect(published.publishedAt).toEqual(now);
    expect(toPostValues(postFormSchema.parse(valid), now).publishedAt).toBeNull();
  });

  it('menolak kategori bukan uuid dan tanggal tidak valid', () => {
    expect(issues({ categoryId: 'abc' })).toContain('categoryId');
    expect(issues({ publishedAt: 'besok' })).toContain('publishedAt');
  });
});
