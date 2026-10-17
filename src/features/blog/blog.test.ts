import { describe, expect, it } from 'vitest';
import { fillTemplate, formatDate, resolveImageUrl } from './format';
import { readingMinutes } from './reading-time';
import { buildRss, escapeXml } from './rss';
import type { PostSummary } from './types';

describe('readingMinutes', () => {
  it('minimal 1 menit untuk teks pendek atau kosong', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('halo dunia')).toBe(1);
  });

  it('membulatkan ke atas per 200 kata', () => {
    const words = (n: number) => Array.from({ length: n }, () => 'kata').join(' ');
    expect(readingMinutes(words(200))).toBe(1);
    expect(readingMinutes(words(201))).toBe(2);
    expect(readingMinutes(words(1000))).toBe(5);
  });

  it('tidak menghitung blok kode, URL gambar, dan URL tautan sebagai kata', () => {
    const code = '```ts\n' + Array.from({ length: 500 }, () => 'x').join(' ') + '\n```';
    expect(readingMinutes(`${code}\n\n![alt](https://x.test/${'a'.repeat(900)}.png)`)).toBe(1);
    expect(readingMinutes(`[teks tautan](https://x.test/${'b'.repeat(900)})`)).toBe(1);
  });
});

describe('formatDate', () => {
  it('memakai zona Asia/Jakarta dan locale yang diminta', () => {
    // 17:30 UTC tanggal 31 Desember = 00:30 tanggal 1 Januari di Jakarta.
    const iso = '2026-12-31T17:30:00.000Z';
    expect(formatDate(iso, 'en')).toBe('January 1, 2027');
    expect(formatDate(iso, 'id')).toBe('1 Januari 2027');
  });
});

describe('fillTemplate', () => {
  it('mengisi placeholder dan membiarkan yang tidak dikenal', () => {
    expect(fillTemplate('{minutes} menit baca', { minutes: 5 })).toBe('5 menit baca');
    expect(fillTemplate('{a} dan {b}', { a: 'x' })).toBe('x dan {b}');
  });
});

describe('resolveImageUrl', () => {
  it('URL https dipakai apa adanya, path lokal diberi domain situs', () => {
    expect(resolveImageUrl('https://cdn.test/a.png')).toBe('https://cdn.test/a.png');
    expect(resolveImageUrl('/images/blog/a.jpg')).toBe('http://localhost:3000/images/blog/a.jpg');
    expect(resolveImageUrl('images/blog/a.jpg')).toBe('http://localhost:3000/images/blog/a.jpg');
  });
});

describe('buildRss', () => {
  const post: PostSummary = {
    slug: 'artikel-uji',
    title: 'Tips <b>"cepat"</b> & aman',
    excerpt: 'Ringkasan dengan <script>alert(1)</script>',
    coverImage: null,
    coverAlt: null,
    publishedAt: '2026-10-17T08:00:00.000Z',
    authorName: 'Do It',
    category: { slug: 'tips', name: 'Tips & Trik' },
  };
  const xml = buildRss({
    locale: 'id',
    siteUrl: 'https://doit.example',
    title: 'Do It - Artikel',
    description: 'Deskripsi',
    posts: [post],
  });

  it('memuat tautan absolut berprefiks locale dan guid', () => {
    expect(xml).toContain('<link>https://doit.example/id/blog/artikel-uji</link>');
    expect(xml).toContain(
      '<guid isPermaLink="true">https://doit.example/id/blog/artikel-uji</guid>',
    );
    expect(xml).toContain('<language>id</language>');
    expect(xml).toContain('rel="self"');
  });

  it('meng-escape semua teks dari pengguna', () => {
    expect(xml).not.toContain('<script>');
    expect(xml).not.toContain('<b>');
    expect(xml).toContain('Tips &lt;b&gt;&quot;cepat&quot;&lt;/b&gt; &amp; aman');
    expect(xml).toContain('<category>Tips &amp; Trik</category>');
  });

  it('tanggal terbit dalam format RFC 822', () => {
    expect(xml).toContain('<pubDate>Sat, 17 Oct 2026 08:00:00 GMT</pubDate>');
  });
});

describe('escapeXml', () => {
  it('meng-escape lima karakter khusus', () => {
    expect(escapeXml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&apos;&amp;&apos;&lt;/a&gt;',
    );
  });
});
