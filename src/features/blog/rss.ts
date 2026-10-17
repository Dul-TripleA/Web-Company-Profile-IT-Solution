import type { Locale } from '@/i18n/config';
import type { PostSummary } from './types';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type BuildRssInput = {
  locale: Locale;
  siteUrl: string;
  title: string;
  description: string;
  posts: PostSummary[];
};

/** Umpan RSS 2.0 untuk satu bahasa; semua teks di-escape. */
export function buildRss({ locale, siteUrl, title, description, posts }: BuildRssInput): string {
  const blogUrl = `${siteUrl}/${locale}/blog`;
  const items = posts
    .map((post) => {
      const link = `${blogUrl}/${post.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        ...(post.category ? [`      <category>${escapeXml(post.category.name)}</category>`] : []),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(blogUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${locale}</language>`,
    `    <atom:link href="${escapeXml(`${blogUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
