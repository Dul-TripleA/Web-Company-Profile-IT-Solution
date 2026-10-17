export type PostCategory = { slug: string; name: string };

/** Ringkasan untuk daftar artikel; tidak memuat isi. Tanggal berupa string ISO (aman untuk cache). */
export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string | null;
  publishedAt: string;
  authorName: string;
  category: PostCategory | null;
};

export type Post = PostSummary & {
  id: string;
  content: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string | null;
};

export type CategoryWithCount = PostCategory & { count: number };

export type PostListPage = { posts: PostSummary[]; total: number; page: number; pageCount: number };
