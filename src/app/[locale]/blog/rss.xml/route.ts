import { connection } from 'next/server';
import { RSS_LIMIT } from '@/features/blog/constants';
import { getRecentPosts } from '@/features/blog/queries';
import { buildRss } from '@/features/blog/rss';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { SITE_URL } from '@/lib/site';

export async function GET(_request: Request, context: RouteContext<'/[locale]/blog/rss.xml'>) {
  // Dihitung saat request (data dari database), bukan saat build.
  await connection();
  const { locale } = await context.params;
  if (!hasLocale(locale)) return new Response('Not found', { status: 404 });

  const { blog } = await getDictionary(locale);
  const posts = await getRecentPosts(locale, RSS_LIMIT);
  const xml = buildRss({
    locale,
    siteUrl: SITE_URL,
    title: `Do It - ${blog.title}`,
    description: blog.rssDescription,
    posts,
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
