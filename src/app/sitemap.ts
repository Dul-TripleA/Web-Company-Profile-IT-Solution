import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { SERVICES } from '@/content/services';
import { getSitemapEntries } from '@/features/blog/queries';
import { DEFAULT_LOCALE, LOCALES, localizedPath } from '@/i18n/config';
import { absoluteUrl } from '@/lib/site';

const STATIC_PATHS = ['/', '/about', '/services', '/blog', '/contact'];

async function getBlogEntries() {
  try {
    return await getSitemapEntries();
  } catch (error) {
    // Database sedang bermasalah: sitemap tetap melayani halaman statis, jangan 500.
    console.error(
      'sitemap: gagal membaca artikel:',
      error instanceof Error ? error.name : 'unknown',
    );
    return { posts: [], categories: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Berisi data database, jadi dihitung saat request (build tidak butuh database).
  await connection();

  const paths = [...STATIC_PATHS, ...SERVICES.map((service) => `/services/${service.slug}`)];
  const staticEntries = paths.flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(
      LOCALES.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]),
    );
    languages['x-default'] = absoluteUrl(localizedPath(DEFAULT_LOCALE, path));

    return LOCALES.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      alternates: { languages },
      priority: path === '/' ? 1 : 0.7,
    }));
  });

  // Artikel dan kategori hanya ada di satu bahasa, jadi tanpa alternates.
  const blog = await getBlogEntries();
  const postEntries = blog.posts.map((post) => ({
    url: absoluteUrl(localizedPath(post.locale, `/blog/${post.slug}`)),
    lastModified: post.updatedAt,
    priority: 0.6,
  }));
  const categoryEntries = blog.categories.map((category) => ({
    url: absoluteUrl(localizedPath(category.locale, `/blog/category/${category.slug}`)),
    priority: 0.4,
  }));

  return [...staticEntries, ...postEntries, ...categoryEntries];
}
