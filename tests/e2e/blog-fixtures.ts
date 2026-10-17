import postgres from 'postgres';
import { hashPassword } from '../../src/features/admin/password';
import { E2E_ADMIN } from './admin-credentials';

// Data uji blog untuk E2E. Semua slug berawalan `zz-e2e-` agar mudah dikenali dan dihapus;
// tidak menyentuh artikel asli. Dimasukkan sekali oleh global-setup, dihapus oleh global-teardown.
export const FIXTURE_PREFIX = 'zz-e2e-';

export const TITLES = {
  idFirst: 'ZZ E2E Artikel 01',
  idMarkdown: 'ZZ E2E Markdown',
  idDraft: 'ZZ E2E Draft',
  idFuture: 'ZZ E2E Terjadwal',
  en: 'ZZ E2E Article EN 01',
} as const;

export const SLUGS = {
  idFirst: 'zz-e2e-id-01',
  idMarkdown: 'zz-e2e-id-md',
  idDraft: 'zz-e2e-id-draft',
  idFuture: 'zz-e2e-id-future',
  en: 'zz-e2e-en-01',
  category: 'zz-e2e-cat',
} as const;

export const CATEGORY_NAMES = { id: 'ZZ E2E Kategori', en: 'ZZ E2E Category' } as const;

type Sql = ReturnType<typeof postgres>;

export function connect(): Sql | null {
  const url = process.env.DATABASE_URL;
  return url ? postgres(url, { prepare: false, max: 1 }) : null;
}

export async function removeFixtures(sql: Sql) {
  await sql`delete from posts where slug like ${FIXTURE_PREFIX + '%'}`;
  await sql`delete from categories where slug like ${FIXTURE_PREFIX + '%'}`;
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

export async function insertFixtures(sql: Sql) {
  await removeFixtures(sql);

  await sql`
    insert into users (email, username, first_name, password_hash)
    values (${E2E_ADMIN.email}, ${E2E_ADMIN.username}, ${E2E_ADMIN.firstName},
            ${await hashPassword(E2E_ADMIN.password)})`;

  const [categoryId] = await sql`
    insert into categories (locale, slug, name) values ('id', ${SLUGS.category}, ${CATEGORY_NAMES.id})
    returning id`;
  const [categoryEn] = await sql`
    insert into categories (locale, slug, name) values ('en', ${SLUGS.category}, ${CATEGORY_NAMES.en})
    returning id`;
  if (!categoryId || !categoryEn) throw new Error('Gagal membuat kategori uji');

  // 11 artikel biasa; 01-03 berkategori; 01 punya cover lokal. Terbit 1-11 jam lalu.
  for (let n = 1; n <= 11; n += 1) {
    const num = String(n).padStart(2, '0');
    await sql`
      insert into posts (locale, slug, title, excerpt, content, cover_image, cover_alt, status,
                         published_at, author_name, category_id)
      values ('id', ${`zz-e2e-id-${num}`}, ${`ZZ E2E Artikel ${num}`},
              ${`Ringkasan artikel uji ${num}.`},
              ${`Paragraf pembuka artikel uji ${num}.\n\n## Bagian satu\n\nIsi bagian satu.`},
              ${n === 1 ? '/images/team-meeting.jpg' : null}, ${n === 1 ? 'Rapat tim' : null},
              'PUBLISHED', now() - ${n + ' hours'}::interval, 'Penulis Uji',
              ${n <= 3 ? categoryId.id : null})`;
  }

  await sql`
    insert into posts (locale, slug, title, excerpt, content, status, published_at, author_name)
    values ('id', ${SLUGS.idMarkdown}, ${TITLES.idMarkdown}, 'Uji render Markdown dan keamanan.',
            ${MARKDOWN_CONTENT}, 'PUBLISHED', now() - interval '30 minutes', 'Do It')`;
  await sql`
    insert into posts (locale, slug, title, excerpt, content, status, published_at)
    values ('id', ${SLUGS.idDraft}, ${TITLES.idDraft}, 'Tidak boleh tampil.', 'Draft.', 'DRAFT', null)`;
  await sql`
    insert into posts (locale, slug, title, excerpt, content, status, published_at)
    values ('id', ${SLUGS.idFuture}, ${TITLES.idFuture}, 'Tidak boleh tampil.', 'Terjadwal.',
            'PUBLISHED', now() + interval '30 days')`;
  await sql`
    insert into posts (locale, slug, title, excerpt, content, status, published_at, author_name, category_id)
    values ('en', ${SLUGS.en}, ${TITLES.en}, 'English test article.', 'English body.', 'PUBLISHED',
            now() - interval '2 hours', 'Test Author', ${categoryEn.id})`;
}
