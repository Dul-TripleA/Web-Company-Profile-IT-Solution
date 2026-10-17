import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { PostSummary } from '../types';
import { PostCard } from './post-card';

type RelatedPostsProps = { posts: PostSummary[]; locale: Locale; dict: Dictionary['blog'] };

export function RelatedPosts({ posts, locale, dict }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-title" className="mt-20">
      <h2 id="related-posts-title" className="text-2xl font-extrabold tracking-tight text-forest">
        {dict.relatedTitle}
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} dict={dict} />
        ))}
      </ul>
    </section>
  );
}
