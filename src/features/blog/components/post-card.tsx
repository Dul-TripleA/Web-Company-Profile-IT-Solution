import { RevealItem } from '@/components/shared/reveal';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/icons';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { formatDate } from '../format';
import type { PostSummary } from '../types';
import { CoverImage } from './cover-image';

type PostCardProps = { post: PostSummary; locale: Locale; dict: Dictionary['blog'] };

export function PostCard({ post, locale, dict }: PostCardProps) {
  return (
    <RevealItem className="group relative flex flex-col overflow-hidden rounded-3xl border border-emerald-900/60 bg-forest-deep shadow-2xl transition-all duration-300 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)]">
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-forest to-forest-deep">
        {post.coverImage ? (
          <CoverImage
            src={post.coverImage}
            alt={post.coverAlt ?? ''}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
          {post.category ? (
            <span className="rounded-lg border border-brand/30 bg-brand/10 px-2.5 py-1 text-brand">
              {post.category.name}
            </span>
          ) : null}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
        </div>

        <h3 className="mt-4 text-xl leading-snug font-bold text-white">
          <Link
            href={localizedPath(locale, `/blog/${post.slug}`)}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
          {post.excerpt}
        </p>

        <span
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold text-brand"
        >
          {dict.readArticle}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </span>
      </div>
    </RevealItem>
  );
}
