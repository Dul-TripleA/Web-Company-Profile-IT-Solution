import postgres from 'postgres';
import { SEED_ARTICLES, SEED_CATEGORIES, SEED_PROJECTS } from './seed-data';

// bun run db:seed   : mengisi data contoh (aman dijalankan ulang; memperbarui berdasarkan slug)
// bun run db:unseed : menghapus data contoh (hanya slug yang ada di scripts/seed-data.ts)
// Tambahkan --yes untuk melewati konfirmasi. Migrasi TIDAK berisi data contoh, jadi database
// produksi tetap bersih selama perintah ini tidak dijalankan ke sana.

const mode = process.argv[2];
if (mode !== 'seed' && mode !== 'unseed') {
  console.error('Pemakaian: bun scripts/seed.ts <seed|unseed> [--yes]');
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL belum diisi di .env');
  process.exit(1);
}

// Tampilkan hanya nama host (tanpa kredensial) supaya jelas database mana yang akan disentuh.
const host = new URL(url).host;
if (!process.argv.includes('--yes')) {
  const answer = prompt(
    `${mode === 'seed' ? 'Isi' : 'Hapus'} data contoh di database "${host}"? Ketik "ya" untuk lanjut:`,
  );
  if (answer?.trim().toLowerCase() !== 'ya') {
    console.log('Dibatalkan.');
    process.exit(0);
  }
}

const sql = postgres(url, { prepare: false, max: 1 });

async function seed() {
  const categoryIds = new Map<string, string>();
  for (const category of SEED_CATEGORIES) {
    const [row] = await sql`
      insert into categories (slug) values (${category.slug})
      on conflict (slug) do update set slug = excluded.slug
      returning id`;
    if (!row) throw new Error(`Kategori ${category.slug} gagal`);
    categoryIds.set(category.slug, row.id);
    for (const [locale, name] of [
      ['id', category.id],
      ['en', category.en],
    ] as const) {
      await sql`
        insert into category_translations (category_id, locale, name)
        values (${row.id}, ${locale}, ${name})
        on conflict (category_id, locale) do update set name = excluded.name`;
    }
  }

  for (const article of SEED_ARTICLES) {
    const publishedAt = new Date(Date.now() - article.daysAgo * 24 * 3_600_000).toISOString();
    const [row] = await sql`
      insert into posts (slug, cover_image, status, published_at, author_name, category_id)
      values (${article.slug}, ${article.cover?.image ?? null}, 'PUBLISHED', ${publishedAt}::timestamptz,
              'Tim Do It', ${categoryIds.get(article.category) ?? null})
      on conflict (slug) do update set
        cover_image = excluded.cover_image, category_id = excluded.category_id,
        status = 'PUBLISHED', updated_at = now()
      returning id`;
    if (!row) throw new Error(`Artikel ${article.slug} gagal`);
    const translations = [
      { locale: 'id', ...article.id, alt: article.cover?.altId ?? null },
      ...(article.en ? [{ locale: 'en', ...article.en, alt: article.cover?.altEn ?? null }] : []),
    ];
    for (const t of translations) {
      await sql`
        insert into post_translations (post_id, locale, title, excerpt, content, cover_alt)
        values (${row.id}, ${t.locale}, ${t.title}, ${t.excerpt}, ${t.content}, ${t.alt})
        on conflict (post_id, locale) do update set
          title = excluded.title, excerpt = excluded.excerpt,
          content = excluded.content, cover_alt = excluded.cover_alt`;
    }
  }

  for (const [index, project] of SEED_PROJECTS.entries()) {
    const [row] = await sql`
      insert into portfolio_projects (slug, service_slug, tech_stack, is_sample, status, sort_order)
      values (${project.slug}, ${project.serviceSlug}, ${sql.array(project.techStack)}, true,
              'PUBLISHED', ${index + 1})
      on conflict (slug) do update set
        service_slug = excluded.service_slug, tech_stack = excluded.tech_stack,
        is_sample = true, sort_order = excluded.sort_order, updated_at = now()
      returning id`;
    if (!row) throw new Error(`Proyek ${project.slug} gagal`);
    for (const locale of ['id', 'en'] as const) {
      const t = project[locale];
      await sql`
        insert into portfolio_translations
          (project_id, locale, title, summary, client, problem, solution, result)
        values (${row.id}, ${locale}, ${t.title}, ${t.summary}, ${t.client}, ${t.problem},
                ${t.solution}, ${t.result})
        on conflict (project_id, locale) do update set
          title = excluded.title, summary = excluded.summary, client = excluded.client,
          problem = excluded.problem, solution = excluded.solution, result = excluded.result`;
    }
  }

  console.log(
    `Selesai: ${SEED_CATEGORIES.length} kategori, ${SEED_ARTICLES.length} artikel, ${SEED_PROJECTS.length} proyek portofolio.`,
  );
}

async function unseed() {
  // Terjemahan ikut terhapus lewat FK cascade; artikel yang kategorinya dihapus menjadi tanpa kategori.
  const posts =
    await sql`delete from posts where slug in ${sql(SEED_ARTICLES.map((a) => a.slug))} returning id`;
  const projects =
    await sql`delete from portfolio_projects where slug in ${sql(SEED_PROJECTS.map((p) => p.slug))} returning id`;
  const categories = await sql`
    delete from categories
    where slug in ${sql(SEED_CATEGORIES.map((c) => c.slug))}
      and not exists (select 1 from posts where posts.category_id = categories.id)
    returning id`;
  console.log(
    `Dihapus: ${posts.length} artikel, ${projects.length} proyek, ${categories.length} kategori (kategori yang masih dipakai artikel lain dibiarkan).`,
  );
}

try {
  await (mode === 'seed' ? seed() : unseed());
} finally {
  await sql.end();
}
