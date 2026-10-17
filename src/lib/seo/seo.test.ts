import { describe, expect, it } from 'vitest';
import { SERVICES } from '@/content/services';
import en from '@/i18n/dictionaries/en.json';
import id from '@/i18n/dictionaries/id.json';
import { LOCALES } from '@/i18n/config';
import { blogPostingJsonLd, breadcrumbJsonLd, serviceJsonLd, websiteJsonLd } from './json-ld';
import { buildMetadata, truncate } from './metadata';

describe('truncate', () => {
  it('tidak mengubah teks pendek', () => {
    expect(truncate('halo', 10)).toBe('halo');
  });

  it('memotong teks panjang dengan elipsis dan tidak melebihi batas', () => {
    const result = truncate('a'.repeat(200), 160);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('buildMetadata', () => {
  const meta = buildMetadata({
    locale: 'en',
    path: '/services',
    title: 'Judul',
    description: 'Deskripsi',
  });

  it('canonical memuat prefiks locale dan path', () => {
    expect(meta.alternates?.canonical).toBe('http://localhost:3000/en/services');
  });

  it('hreflang untuk semua locale dan x-default ke locale default', () => {
    const languages = meta.alternates?.languages as Record<string, string>;
    expect(Object.keys(languages).sort()).toEqual(['en', 'id', 'x-default']);
    expect(languages['x-default']).toBe('http://localhost:3000/id/services');
  });

  it('beranda tanpa trailing slash', () => {
    const home = buildMetadata({ locale: 'id', title: 'T', description: 'D' });
    expect(home.alternates?.canonical).toBe('http://localhost:3000/id');
  });

  it('memakai gambar OG bawaan dan kartu Twitter besar', () => {
    expect(meta.openGraph?.images).toEqual([{ url: 'http://localhost:3000/og-default.png' }]);
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('gambar khusus halaman menggantikan gambar bawaan', () => {
    const custom = buildMetadata({
      locale: 'id',
      title: 'T',
      description: 'D',
      image: 'http://localhost:3000/lain.png',
    });
    expect(custom.openGraph?.images).toEqual([{ url: 'http://localhost:3000/lain.png' }]);
  });

  it('Open Graph memakai locale yang sesuai', () => {
    expect(meta.openGraph).toMatchObject({ locale: 'en_US', alternateLocale: ['id_ID'] });
  });
});

describe('JSON-LD', () => {
  it('BreadcrumbList berposisi mulai dari 1 dengan URL absolut', () => {
    const data = breadcrumbJsonLd('id', [
      { name: 'Beranda', path: '/' },
      { name: 'Layanan', path: '/services' },
    ]);
    expect(data.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(data.itemListElement[1]?.item).toBe('http://localhost:3000/id/services');
  });

  it('WebSite memuat bahasa', () => {
    expect(websiteJsonLd('en').inLanguage).toBe('en');
  });

  it('Service memuat provider', () => {
    const data = serviceJsonLd('en', { name: 'N', description: 'D', path: '/services/x' });
    expect(data['@type']).toBe('Service');
    expect(data.provider.name).toBeTruthy();
  });
});

describe('panjang metadata di kamus', () => {
  const dictionaries = { id, en };

  for (const locale of LOCALES) {
    const dict = dictionaries[locale];
    const entries: [string, string, string][] = [
      ['home', dict.meta.title, dict.meta.description],
      ['about', dict.pages.about.metaTitle, dict.pages.about.metaDescription],
      ['services', dict.pages.services.metaTitle, dict.pages.services.metaDescription],
      ['contact', dict.pages.contact.metaTitle, dict.pages.contact.metaDescription],
    ];

    for (const [page, title, description] of entries) {
      it(`${locale}/${page}: title ≤ 60 dan description 70-160 karakter`, () => {
        expect(title.length).toBeLessThanOrEqual(60);
        expect(description.length).toBeGreaterThanOrEqual(70);
        expect(description.length).toBeLessThanOrEqual(160);
      });
    }
  }

  it('judul halaman layanan (title + sufiks) ≤ 60 karakter di semua locale', () => {
    for (const service of SERVICES) {
      for (const locale of LOCALES) {
        expect(`${service.copy[locale].title} | Do It`.length).toBeLessThanOrEqual(60);
      }
    }
  });
});

describe('buildMetadata: halaman satu bahasa (artikel)', () => {
  const article = buildMetadata({
    locale: 'id',
    path: '/blog/artikel-uji',
    title: 'Artikel',
    description: 'Deskripsi',
    type: 'article',
    translations: false,
    publishedTime: '2026-10-17T08:00:00.000Z',
    modifiedTime: '2026-10-18T08:00:00.000Z',
    rssUrl: 'http://localhost:3000/id/blog/rss.xml',
  });

  it('tanpa hreflang dan tanpa alternateLocale, tetapi tetap ber-canonical', () => {
    expect(article.alternates?.canonical).toBe('http://localhost:3000/id/blog/artikel-uji');
    expect(article.alternates).not.toHaveProperty('languages');
    expect(article.openGraph).not.toHaveProperty('alternateLocale');
  });

  it('memuat waktu terbit/ubah untuk artikel dan umpan RSS', () => {
    expect(article.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-10-17T08:00:00.000Z',
      modifiedTime: '2026-10-18T08:00:00.000Z',
    });
    expect(article.alternates?.types).toEqual({
      'application/rss+xml': 'http://localhost:3000/id/blog/rss.xml',
    });
  });

  it('waktu terbit diabaikan untuk halaman non-artikel', () => {
    const page = buildMetadata({
      locale: 'id',
      title: 'T',
      description: 'D',
      publishedTime: '2026-10-17T08:00:00.000Z',
    });
    expect(page.openGraph).not.toHaveProperty('publishedTime');
  });
});

describe('blogPostingJsonLd', () => {
  const data = blogPostingJsonLd('en', {
    slug: 'artikel-uji',
    title: 'Judul',
    description: 'Deskripsi',
    image: 'http://localhost:3000/og-default.png',
    publishedAt: '2026-10-17T08:00:00.000Z',
    updatedAt: '2026-10-18T08:00:00.000Z',
    authorName: 'Budi',
  });

  it('memuat bidang wajib BlogPosting dengan URL absolut', () => {
    expect(data['@type']).toBe('BlogPosting');
    expect(data.headline).toBe('Judul');
    expect(data.url).toBe('http://localhost:3000/en/blog/artikel-uji');
    expect(data.datePublished).toBe('2026-10-17T08:00:00.000Z');
    expect(data.dateModified).toBe('2026-10-18T08:00:00.000Z');
    expect(data.inLanguage).toBe('en');
    expect(data.publisher.logo.url).toContain('/images/logo/logo-full.png');
  });

  it('penulis perorangan = Person, penulis "Do It" = Organization', () => {
    expect(data.author['@type']).toBe('Person');
    const org = blogPostingJsonLd('id', {
      slug: 'a',
      title: 'T',
      description: 'D',
      image: 'x',
      publishedAt: '2026-10-17T08:00:00.000Z',
      updatedAt: '2026-10-17T08:00:00.000Z',
      authorName: 'Do It',
    });
    expect(org.author['@type']).toBe('Organization');
  });
});
