import postgres from 'postgres';
import { hashPassword } from '../../src/features/admin/password';
import { E2E_ADMIN } from './admin-credentials';

// Data uji E2E (blog, portofolio, akun admin). Semua slug berawalan `zz-e2e-` agar mudah dikenali
// dan dihapus; tidak menyentuh data asli. Dipasang sekali oleh global-setup, dihapus oleh
// global-teardown. Terjemahan ikut terhapus lewat FK cascade.
export const FIXTURE_PREFIX = 'zz-e2e-';

export const TITLES = {
  idFirst: 'ZZ E2E Artikel 01',
  idMarkdown: 'ZZ E2E Markdown',
  idDraft: 'ZZ E2E Draft',
  idFuture: 'ZZ E2E Terjadwal',
  en: 'ZZ E2E Article EN 01',
  bilingualId: 'ZZ E2E Dua Bahasa',
  bilingualEn: 'ZZ E2E Two Languages',
} as const;

export const SLUGS = {
  idFirst: 'zz-e2e-id-01',
  idMarkdown: 'zz-e2e-id-md',
  idDraft: 'zz-e2e-id-draft',
  idFuture: 'zz-e2e-id-future',
  en: 'zz-e2e-en-01',
  bilingual: 'zz-e2e-bilingual',
  category: 'zz-e2e-cat',
  project: 'zz-e2e-project',
  projectSample: 'zz-e2e-project-sample',
  projectDraft: 'zz-e2e-project-draft',
} as const;

export const CATEGORY_NAMES = { id: 'ZZ E2E Kategori', en: 'ZZ E2E Category' } as const;

export const PROJECT_TITLES = {
  real: 'ZZ E2E Proyek Nyata',
  realEn: 'ZZ E2E Real Project',
  sample: 'ZZ E2E Proyek Contoh',
  draft: 'ZZ E2E Proyek Draft',
} as const;

type Sql = ReturnType<typeof postgres>;

export function connect(): Sql | null {
  const url = process.env.DATABASE_URL;
  return url ? postgres(url, { prepare: false, max: 1 }) : null;
}

export async function removeFixtures(sql: Sql) {
  await sql`delete from posts where slug like ${FIXTURE_PREFIX + '%'}`;
  await sql`delete from categories where slug like ${FIXTURE_PREFIX + '%'}`;
  await sql`delete from portfolio_projects where slug like ${FIXTURE_PREFIX + '%'}`;
  // Sesi ikut terhapus (FK cascade).
  await sql`delete from users where username = ${E2E_ADMIN.username}`;
  await sql`delete from admin_login_attempts`;
}

const words = (count: number) => Array.from({ length: count }, () => 'kata').join(' ');

const MARKDOWN_CONTENT = `# Judul besar

Teks dengan [tautan aman](https://example.com) dan [tautan bahaya](javascript:alert(1)).

<script>window.__pwned = true</script>

<img src="x" onerror="window.__pwned = true">

\`\`\`ts
const a = 1;
\`\`\`

${words(450)}`;

type PostFixture = {
  slug: string;
  status?: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  categoryId?: string | null;
  coverImage?: string | null;
  authorName?: string;
  translations: {
    locale: 'id' | 'en';
    title: string;
    excerpt: string;
    content: string;
    coverAlt?: string;
  }[];
};

async function insertPost(sql: Sql, post: PostFixture) {
  const [row] = await sql`
    insert into posts (slug, cover_image, status, published_at, author_name, category_id)
    values (${post.slug}, ${post.coverImage ?? null}, ${post.status ?? 'PUBLISHED'},
            ${post.publishedAt}::timestamptz, ${post.authorName ?? 'Do It'}, ${post.categoryId ?? null})
    returning id`;
  if (!row) throw new Error(`Gagal membuat artikel uji ${post.slug}`);
  for (const t of post.translations) {
    await sql`
      insert into post_translations (post_id, locale, title, excerpt, content, cover_alt)
      values (${row.id}, ${t.locale}, ${t.title}, ${t.excerpt}, ${t.content}, ${t.coverAlt ?? null})`;
  }
}

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

export async function insertFixtures(sql: Sql) {
  await removeFixtures(sql);

  await sql`
    insert into users (email, username, first_name, password_hash)
    values (${E2E_ADMIN.email}, ${E2E_ADMIN.username}, ${E2E_ADMIN.firstName},
            ${await hashPassword(E2E_ADMIN.password)})`;

  const [category] =
    await sql`insert into categories (slug) values (${SLUGS.category}) returning id`;
  if (!category) throw new Error('Gagal membuat kategori uji');
  await sql`
    insert into category_translations (category_id, locale, name)
    values (${category.id}, 'id', ${CATEGORY_NAMES.id}), (${category.id}, 'en', ${CATEGORY_NAMES.en})`;

  // 11 artikel Indonesia; 01-03 berkategori; 01 punya cover lokal. Terbit 1-11 jam lalu.
  for (let n = 1; n <= 11; n += 1) {
    const num = String(n).padStart(2, '0');
    await insertPost(sql, {
      slug: `zz-e2e-id-${num}`,
      publishedAt: hoursAgo(n),
      authorName: 'Penulis Uji',
      categoryId: n <= 3 ? category.id : null,
      coverImage: n === 1 ? '/images/team-meeting.jpg' : null,
      translations: [
        {
          locale: 'id',
          title: `ZZ E2E Artikel ${num}`,
          excerpt: `Ringkasan artikel uji ${num}.`,
          content: `Paragraf pembuka artikel uji ${num}.\n\n## Bagian satu\n\nIsi bagian satu.`,
          coverAlt: n === 1 ? 'Rapat tim' : undefined,
        },
      ],
    });
  }

  await insertPost(sql, {
    slug: SLUGS.idMarkdown,
    publishedAt: hoursAgo(0.5),
    translations: [
      {
        locale: 'id',
        title: TITLES.idMarkdown,
        excerpt: 'Uji render Markdown dan keamanan.',
        content: MARKDOWN_CONTENT,
      },
    ],
  });
  await insertPost(sql, {
    slug: SLUGS.idDraft,
    status: 'DRAFT',
    publishedAt: null,
    translations: [
      { locale: 'id', title: TITLES.idDraft, excerpt: 'Tidak boleh tampil.', content: 'Draft.' },
    ],
  });
  await insertPost(sql, {
    slug: SLUGS.idFuture,
    publishedAt: new Date(Date.now() + 30 * 24 * 3_600_000).toISOString(),
    translations: [
      {
        locale: 'id',
        title: TITLES.idFuture,
        excerpt: 'Tidak boleh tampil.',
        content: 'Terjadwal.',
      },
    ],
  });
  // Hanya bahasa Inggris (seperti data lama sebelum dua bahasa digabung).
  await insertPost(sql, {
    slug: SLUGS.en,
    publishedAt: hoursAgo(2),
    authorName: 'Test Author',
    categoryId: category.id,
    translations: [
      {
        locale: 'en',
        title: TITLES.en,
        excerpt: 'English test article.',
        content: 'English body.',
      },
    ],
  });
  // Satu artikel, dua bahasa.
  await insertPost(sql, {
    slug: SLUGS.bilingual,
    publishedAt: hoursAgo(3),
    translations: [
      {
        locale: 'id',
        title: TITLES.bilingualId,
        excerpt: 'Artikel uji dua bahasa.',
        content: 'Isi Indonesia.',
      },
      {
        locale: 'en',
        title: TITLES.bilingualEn,
        excerpt: 'Bilingual test article.',
        content: 'English body.',
      },
    ],
  });

  const projects = [
    {
      slug: SLUGS.project,
      title: PROJECT_TITLES.real,
      sample: false,
      status: 'PUBLISHED',
      en: true,
    },
    {
      slug: SLUGS.projectSample,
      title: PROJECT_TITLES.sample,
      sample: true,
      status: 'PUBLISHED',
      en: false,
    },
    {
      slug: SLUGS.projectDraft,
      title: PROJECT_TITLES.draft,
      sample: false,
      status: 'DRAFT',
      en: false,
    },
  ] as const;
  for (const [index, project] of projects.entries()) {
    const [row] = await sql`
      insert into portfolio_projects (slug, service_slug, tech_stack, is_sample, status, sort_order)
      values (${project.slug}, 'web-development', ${sql.array(['Next.js', 'PostgreSQL'])},
              ${project.sample}, ${project.status}, ${900 + index})
      returning id`;
    if (!row) throw new Error('Gagal membuat proyek uji');
    await sql`
      insert into portfolio_translations (project_id, locale, title, summary, client, problem, solution, result)
      values (${row.id}, 'id', ${project.title}, 'Ringkasan proyek uji.', 'Klien uji',
              'Masalah proyek uji.', 'Solusi proyek uji.', 'Hasil proyek uji.')`;
    if (project.en) {
      await sql`
        insert into portfolio_translations (project_id, locale, title, summary, client, problem, solution, result)
        values (${row.id}, 'en', ${PROJECT_TITLES.realEn}, 'Test project summary.', 'Test client',
                'Test problem.', 'Test solution.', 'Test result.')`;
    }
  }
}
