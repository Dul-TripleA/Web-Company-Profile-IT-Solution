import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { Markdown } from '@/components/shared/markdown';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button-link';
import { ArrowRightIcon } from '@/components/ui/icons';
import { CoverImage } from '@/features/blog/components/cover-image';
import { RelatedPosts } from '@/features/blog/components/related-posts';
import { RELATED_LIMIT } from '@/features/blog/constants';
import { fillTemplate, formatDate, resolveImageUrl } from '@/features/blog/format';
import { getPublishedPostBySlug, getRelatedPosts } from '@/features/blog/queries';
import { readingMinutes } from '@/features/blog/reading-time';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { DEFAULT_OG_IMAGE, buildMetadata } from '@/lib/seo/metadata';
import { blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl } from '@/lib/site';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const post = await getPublishedPostBySlug(locale, slug);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${post.seoTitle ?? post.title} | Do It`,
    description: post.seoDescription ?? post.excerpt,
    type: 'article',
    image: post.coverImage ? resolveImageUrl(post.coverImage) : undefined,
    // Satu artikel = satu bahasa: tanpa hreflang ke bahasa lain.
    translations: false,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const post = await getPublishedPostBySlug(locale, slug);
  if (!post) notFound();

  const [dict, related] = await Promise.all([
    getDictionary(locale),
    getRelatedPosts(locale, post.id, post.categoryId, RELATED_LIMIT),
  ]);
  const minutes = readingMinutes(post.content);
  const wasUpdated = formatDate(post.updatedAt, locale) !== formatDate(post.publishedAt, locale);
  const cta = dict.home.workflow.cta;
  const description = post.seoDescription ?? post.excerpt;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: dict.nav.blog, path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />
      <JsonLd
        data={blogPostingJsonLd(locale, {
          slug,
          title: post.title,
          description,
          image: post.coverImage ? resolveImageUrl(post.coverImage) : absoluteUrl(DEFAULT_OG_IMAGE),
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.authorName,
        })}
      />

      <PageHero
        eyebrow={post.category?.name ?? dict.blog.eyebrow}
        title={post.title}
        description={post.excerpt}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: dict.nav.blog, href: localizedPath(locale, '/blog') },
          { label: post.title },
        ]}
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
          <span>
            {dict.blog.by} {post.authorName}
          </span>
          <span aria-hidden="true">•</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          {wasUpdated ? (
            <>
              <span aria-hidden="true">•</span>
              <span>
                {dict.blog.updatedOn}{' '}
                <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, locale)}</time>
              </span>
            </>
          ) : null}
          <span aria-hidden="true">•</span>
          <span>{fillTemplate(dict.blog.readingTime, { minutes })}</span>
        </p>
      </PageHero>

      <article className="mx-auto max-w-3xl px-6 py-16">
        {post.coverImage ? (
          <div className="relative mb-10 aspect-video overflow-hidden rounded-3xl">
            <CoverImage
              src={post.coverImage}
              alt={post.coverAlt ?? ''}
              sizes="(min-width: 768px) 768px, 100vw"
              eager
            />
          </div>
        ) : null}

        <Markdown>{post.content}</Markdown>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-emerald-900/60 bg-linear-to-r from-forest via-forest-deep to-forest p-8 shadow-2xl md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-bold text-white">{cta.title}</h2>
            <p className="text-xs text-slate-400">{cta.description}</p>
          </div>
          <ButtonLink href={localizedPath(locale, '/contact')}>
            {dict.common.startFreeConsultation}
          </ButtonLink>
        </div>

        <Link
          href={localizedPath(locale, '/blog')}
          className="group mt-10 inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-brand-ink"
        >
          <ArrowRightIcon className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />
          {dict.blog.backToBlog}
        </Link>
      </article>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <RelatedPosts posts={related} locale={locale} dict={dict.blog} />
      </section>
    </>
  );
}
