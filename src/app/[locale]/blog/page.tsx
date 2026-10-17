import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/sections/page-hero';
import { BlogIndex } from '@/features/blog/components/blog-index';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { blog } = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/blog',
    title: blog.metaTitle,
    description: blog.metaDescription,
    rssUrl: absoluteUrl(`/${locale}/blog/rss.xml`),
  });
}

export default async function BlogPage({ params }: PageProps<'/[locale]/blog'>) {
  // Data artikel diambil saat request (ter-cache), bukan saat build: build tidak butuh database.
  await connection();
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: dict.nav.blog, path: '/blog' },
        ])}
      />
      <PageHero
        eyebrow={dict.blog.eyebrow}
        title={dict.blog.title}
        description={dict.blog.description}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: dict.nav.blog },
        ]}
      >
        <a
          href={`/${locale}/blog/rss.xml`}
          className="inline-flex text-xs font-bold text-brand hover:underline"
        >
          {dict.blog.rss}
        </a>
      </PageHero>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <BlogIndex locale={locale} page={1} />
      </section>
    </>
  );
}
