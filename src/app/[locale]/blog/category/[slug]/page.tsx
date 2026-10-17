import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/sections/page-hero';
import { BlogIndex } from '@/features/blog/components/blog-index';
import { CATEGORY_LIMIT } from '@/features/blog/constants';
import { fillTemplate } from '@/features/blog/format';
import { getCategoryBySlug } from '@/features/blog/queries';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/blog/category/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const category = await getCategoryBySlug(locale, slug);
  if (!category) return {};
  const { blog } = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: `/blog/category/${slug}`,
    title: `${category.name} | Blog | Do It`,
    description: fillTemplate(blog.categoryMetaDescription, { name: category.name }),
    translations: false,
  });
}

export default async function BlogCategoryPage({
  params,
}: PageProps<'/[locale]/blog/category/[slug]'>) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const category = await getCategoryBySlug(locale, slug);
  if (!category) notFound();
  const { blog, nav } = await getDictionary(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: nav.home, path: '/' },
          { name: nav.blog, path: '/blog' },
          { name: category.name, path: `/blog/category/${slug}` },
        ])}
      />
      <PageHero
        eyebrow={blog.categoryEyebrow}
        title={category.name}
        description={fillTemplate(blog.categoryMetaDescription, { name: category.name })}
        breadcrumb={[
          { label: nav.home, href: localizedPath(locale) },
          { label: nav.blog, href: localizedPath(locale, '/blog') },
          { label: category.name },
        ]}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <BlogIndex locale={locale} page={1} categorySlug={slug} pageSize={CATEGORY_LIMIT} />
      </section>
    </>
  );
}
