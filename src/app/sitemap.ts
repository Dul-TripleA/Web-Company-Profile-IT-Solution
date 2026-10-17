import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { SERVICES } from '@/content/services';
import { getSitemapEntries } from '@/features/blog/queries';
import { getPortfolioSitemapEntries } from '@/features/portfolio/queries';
import { DEFAULT_LOCALE, LOCALES, localizedPath } from '@/i18n/config';
import { absoluteUrl } from '@/lib/site';

const STATIC_PATHS = ['/', '/about', '/services', '/blog', '/contact'];

async function getDatabaseEntries() {
  try {
    const [blog, portfolio] = await Promise.all([
      getSitemapEntries(),
      getPortfolioSitemapEntries(),
    ]);
    return { blog, portfolio };
  } catch (error) {
    // Database sedang bermasalah: sitemap tetap melayani halaman statis, jangan 500.
    console.error(
      'sitemap: gagal membaca database:',
      error instanceof Error ? error.name : 'unknown',
    );
    return { blog: { posts: [], categories: [] }, portfolio: [] };
  }
}

function languagesFor(path: string) {
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]),
  );
  languages['x-default'] = absoluteUrl(localizedPath(DEFAULT_LOCALE, path));
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Berisi data database, jadi dihitung saat request (build tidak butuh database).
  await connection();

  const paths = [...STATIC_PATHS, ...SERVICES.map((service) => `/services/${service.slug}`)];
  const { blog, portfolio } = await getDatabaseEntries();
  // Portofolio hanya masuk sitemap bila ada proyek nyata; proyek contoh tidak diindeks.
  if (portfolio.length > 0) paths.push('/portfolio');

  const staticEntries = paths.flatMap((path) => {
    const languages = languagesFor(path);
    return LOCALES.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      alternates: { languages },
      priority: path === '/' ? 1 : 0.7,
    }));
  });

  // Artikel: satu entri per bahasa yang tersedia; hreflang hanya bila ada di semua bahasa.
  const postEntries = blog.posts.flatMap((post) => {
    const path = `/blog/${post.slug}`;
    const complete = LOCALES.every((locale) => post.locales.includes(locale));
    return post.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      lastModified: post.updatedAt,
      priority: 0.6,
      ...(complete ? { alternates: { languages: languagesFor(path) } } : {}),
    }));
  });
  const categoryEntries = blog.categories.flatMap((category) =>
    category.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, `/blog/category/${category.slug}`)),
      priority: 0.4,
    })),
  );

  const projectEntries = portfolio.flatMap((project) => {
    const path = `/portfolio/${project.slug}`;
    const complete = LOCALES.every((locale) => project.locales.includes(locale));
    return project.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      priority: 0.6,
      ...(complete ? { alternates: { languages: languagesFor(path) } } : {}),
    }));
  });

  return [...staticEntries, ...postEntries, ...categoryEntries, ...projectEntries];
}
