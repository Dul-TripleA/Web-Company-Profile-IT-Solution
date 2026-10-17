import { RevealList } from '@/components/shared/reveal';
import { notFound } from 'next/navigation';
import { Pagination } from '@/components/shared/pagination';
import { localizedPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { PAGE_SIZE } from '../constants';
import { fillTemplate } from '../format';
import { getCategories, getPublishedPosts } from '../queries';
import { CategoryFilter } from './category-filter';
import { PostCard } from './post-card';

type BlogIndexProps = {
  locale: Locale;
  page: number;
  /** Bila diisi, daftar difilter ke kategori itu dan tanpa paginasi. */
  categorySlug?: string | null;
  pageSize?: number;
};

// Daftar artikel + filter kategori + paginasi. Harus dipanggil dari halaman yang sudah
// `await connection()` atau menunggu params dinamis, agar tidak diprerender saat build.
export async function BlogIndex({
  locale,
  page,
  categorySlug = null,
  pageSize = PAGE_SIZE,
}: BlogIndexProps) {
  const { blog } = await getDictionary(locale);
  const [list, categories] = await Promise.all([
    getPublishedPosts(locale, page, pageSize, categorySlug),
    getCategories(locale),
  ]);
  if (page > list.pageCount) notFound();

  return (
    <>
      <CategoryFilter
        locale={locale}
        dict={blog}
        categories={categories}
        activeSlug={categorySlug}
      />

      {list.posts.length === 0 ? (
        <p className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
          {blog.empty}
        </p>
      ) : (
        <RevealList className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} dict={blog} />
          ))}
        </RevealList>
      )}

      {categorySlug ? null : (
        <Pagination
          current={list.page}
          total={list.pageCount}
          hrefFor={(n) => localizedPath(locale, n === 1 ? '/blog' : `/blog/page/${n}`)}
          labels={blog.pagination}
          pageLabel={(n) => fillTemplate(blog.pagination.page, { page: n })}
        />
      )}
    </>
  );
}
