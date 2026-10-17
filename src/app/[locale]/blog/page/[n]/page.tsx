import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { PageHero } from '@/components/sections/page-hero';
import { BlogIndex } from '@/features/blog/components/blog-index';
import { fillTemplate } from '@/features/blog/format';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { parsePageParam } from '@/lib/pagination';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/blog/page/[n]'>): Promise<Metadata> {
  const { locale, n } = await params;
  const page = parsePageParam(n);
  if (!hasLocale(locale) || page === null) return {};
  const { blog } = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: `/blog/page/${page}`,
    title: `Blog - ${fillTemplate(blog.pageTitleSuffix, { page })} | Do It`,
    description: blog.metaDescription,
    translations: false,
  });
}

export default async function BlogPageN({ params }: PageProps<'/[locale]/blog/page/[n]'>) {
  const { locale, n } = await params;
  if (!hasLocale(locale)) notFound();
  const page = parsePageParam(n);
  if (page === null) notFound();
  // Halaman 1 hanya ada di /blog (satu URL kanonik).
  if (page === 1) permanentRedirect(localizedPath(locale, '/blog'));
  const { blog, nav } = await getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={blog.eyebrow}
        title={blog.title}
        description={blog.description}
        breadcrumb={[
          { label: nav.home, href: localizedPath(locale) },
          { label: nav.blog, href: localizedPath(locale, '/blog') },
          { label: fillTemplate(blog.pagination.page, { page }) },
        ]}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <BlogIndex locale={locale} page={page} />
      </section>
    </>
  );
}
