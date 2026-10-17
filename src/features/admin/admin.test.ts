import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';
import { parseTechStack, validateProject } from './portfolio-schema';
import {
  parseJakartaDateTime,
  slugify,
  toJakartaInputValue,
  toPostRecords,
  validatePost,
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

describe('validatePost', () => {
  const valid: Record<string, string> = {
    slug: '',
    coverImage: '',
    published: '',
    publishedAt: '',
    authorName: 'Do It',
    categoryId: '',
    title_id: 'Judul Artikel',
    excerpt_id: 'Ringkasan yang cukup panjang.',
    content_id: '# Isi',
  };
  const issues = (input: Record<string, string>) =>
    validatePost({ ...valid, ...input }).issues.map((issue) => issue.field);

  it('menerima artikel berbahasa Indonesia saja dan membuat slug dari judul', () => {
    const result = validatePost(valid);
    expect(result.issues).toEqual([]);
    const { post, translations } = toPostRecords(result.values);
    expect(post.slug).toBe('judul-artikel');
    expect(translations.map((item) => item.locale)).toEqual(['id']);
  });

  it('bahasa Indonesia wajib', () => {
    expect(issues({ title_id: '' })).toContain('title_id');
    expect(issues({ content_id: '' })).toContain('content_id');
  });

  it('bahasa Inggris opsional, tetapi bila diisi harus lengkap', () => {
    expect(issues({ title_en: 'English title' })).toEqual(
      expect.arrayContaining(['excerpt_en', 'content_en']),
    );
    const full = validatePost({
      ...valid,
      title_en: 'English title',
      excerpt_en: 'A long enough summary.',
      content_en: 'Body',
    });
    expect(full.issues).toEqual([]);
    expect(toPostRecords(full.values).translations.map((item) => item.locale)).toEqual([
      'id',
      'en',
    ]);
  });

  it('menolak slug tidak aman atau dicadangkan', () => {
    expect(issues({ slug: 'Slug Salah!' })).toContain('slug');
    expect(issues({ slug: 'page' })).toContain('slug');
    expect(issues({ slug: 'category' })).toContain('slug');
  });

  it('cover: hanya https atau path lokal, dan alt Indonesia wajib', () => {
    expect(issues({ coverImage: 'http://x.test/a.jpg', coverAlt_id: 'a' })).toContain('coverImage');
    expect(issues({ coverImage: 'javascript:alert(1)', coverAlt_id: 'a' })).toContain('coverImage');
    expect(issues({ coverImage: '//evil.test/a.jpg', coverAlt_id: 'a' })).toContain('coverImage');
    expect(issues({ coverImage: '/images/blog/a.jpg' })).toContain('coverAlt_id');
    expect(issues({ coverImage: 'https://x.test/a.jpg', coverAlt_id: 'a' })).toEqual([]);
  });

  it('terbit tanpa tanggal memakai waktu sekarang; draft boleh tanpa tanggal', () => {
    const now = new Date('2026-10-17T00:00:00Z');
    const published = toPostRecords(validatePost({ ...valid, published: 'on' }).values, now);
    expect(published.post.status).toBe('PUBLISHED');
    expect(published.post.publishedAt).toEqual(now);
    const draft = toPostRecords(validatePost(valid).values, now);
    expect(draft.post.status).toBe('DRAFT');
    expect(draft.post.publishedAt).toBeNull();
  });

  it('menolak kategori bukan uuid, tanggal tidak valid, dan penulis kosong', () => {
    expect(issues({ categoryId: 'abc' })).toContain('categoryId');
    expect(issues({ publishedAt: 'besok' })).toContain('publishedAt');
    expect(issues({ authorName: '' })).toContain('authorName');
  });
});

describe('validateProject', () => {
  const valid: Record<string, string> = {
    slug: 'proyek-uji',
    serviceSlug: 'web-development',
    techStack: 'Next.js, PostgreSQL , ,Next.js',
    sortOrder: '1',
    published: 'on',
    isSample: '',
    title_id: 'Proyek Uji',
    summary_id: 'Ringkasan proyek uji.',
    client_id: 'Klien anonim',
    problem_id: 'Masalah yang cukup panjang.',
    solution_id: 'Solusi yang cukup panjang.',
    result_id: 'Hasil yang cukup panjang.',
  };

  it('menerima data valid dan merapikan daftar teknologi', () => {
    const result = validateProject(valid);
    expect(result.issues).toEqual([]);
    expect(result.project.techStack).toEqual(['Next.js', 'PostgreSQL']);
    expect(result.project.status).toBe('PUBLISHED');
    expect(result.translations.map((item) => item.locale)).toEqual(['id']);
  });

  it('menolak layanan tak dikenal, slug salah, dan EN setengah terisi', () => {
    const fields = validateProject({
      ...valid,
      serviceSlug: 'tidak-ada',
      slug: 'Salah Slug',
      title_en: 'Only title',
    }).issues.map((issue) => issue.field);
    expect(fields).toEqual(expect.arrayContaining(['serviceSlug', 'slug', 'summary_en']));
  });

  it('parseTechStack membuang kosong dan duplikat', () => {
    expect(parseTechStack(' a, b ,, a ')).toEqual(['a', 'b']);
  });
});
