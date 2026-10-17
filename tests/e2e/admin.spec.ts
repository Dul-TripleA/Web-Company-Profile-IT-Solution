import AxeBuilder from '@axe-core/playwright';
import { expect as baseExpect, test, type Page } from '@playwright/test';
import { E2E_ADMIN } from './admin-credentials';
import { connect } from './blog-fixtures';

// Butuh database (login mencatat percobaan gagal; artikel disimpan di DB).
test.skip(!process.env.DATABASE_URL, 'DATABASE_URL tidak tersedia: tes admin dilewati');

// Setiap aksi admin menunggu database jarak jauh (Neon); saat tes paralel bisa lebih dari 5 dtk.
const expect = baseExpect.configure({ timeout: 15_000 });

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function signIn(
  page: Page,
  password: string = E2E_ADMIN.password,
  identifier: string = E2E_ADMIN.email,
) {
  await page.goto('/admin/login');
  await page.getByLabel('Email atau username').fill(identifier);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Masuk' }).click();
}

// Editor WYSIWYG: area contenteditable. Pintasan Markdown (mis. "## ") dan **tebal** diubah editor
// menjadi format, lalu disimpan sebagai Markdown.
async function typeInEditor(page: Page, text: string, locale: 'id' | 'en') {
  const editor = page.locator(`#post-panel-${locale} .doit-editor-content[contenteditable=true]`);
  await expect(editor).toBeVisible();
  await editor.click();
  const lines = text.split('\n');
  for (const [index, line] of lines.entries()) {
    if (index > 0) await page.keyboard.press('Enter');
    await page.keyboard.type(line, { delay: 5 });
  }
}

test.describe('akses', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile);
  });

  for (const path of [
    '/admin',
    '/admin/posts',
    '/admin/posts/new',
    '/admin/categories',
    '/admin/messages',
  ]) {
    test(`${path} tanpa sesi dialihkan ke halaman masuk`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login$/);
      await expect(page.getByRole('heading', { level: 1, name: 'Masuk admin' })).toBeVisible();
    });
  }

  test('halaman admin tidak diindeks', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Disallow: /admin');
  });

  test('token sesi palsu ditolak', async ({ page, context }) => {
    await context.addCookies([
      { name: 'doit_admin', value: '99999999999999.palsu', url: 'http://localhost:3100/admin' },
    ]);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('password salah ditolak dengan pesan umum', async ({ page }) => {
    await page.context().setExtraHTTPHeaders({ 'x-forwarded-for': '203.0.113.11' });
    await signIn(page, 'salah-salah-salah');
    await expect(page.locator('form [role=alert]')).toHaveText('Email atau password salah.');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('percobaan gagal berulang dikunci lalu dibersihkan', async ({ page }) => {
    await page.context().setExtraHTTPHeaders({ 'x-forwarded-for': '203.0.113.12' });
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await signIn(page, 'salah-salah-salah');
      await expect(page.locator('form [role=alert]')).toBeVisible();
    }
    // Setelah batas tercapai, password benar pun ditolak.
    await signIn(page);
    await expect(page.locator('form [role=alert]')).toContainText('Terlalu banyak percobaan');
    await expect(page).toHaveURL(/\/admin\/login$/);

    const sql = connect();
    if (sql) {
      await sql`delete from admin_login_attempts`;
      await sql.end();
    }
  });
});

test.describe('setelah masuk', () => {
  test.beforeEach(({ page, isMobile }) => {
    test.skip(isMobile);
    // Tombol hapus meminta konfirmasi lewat window.confirm; tes menyetujuinya.
    page.on('dialog', (dialog) => void dialog.accept());
  });

  test('masuk, cookie aman, keluar', async ({ page, context }) => {
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Ringkasan' })).toBeVisible();

    const cookie = (await context.cookies()).find((item) => item.name === 'doit_admin');
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.sameSite).toBe('Lax');
    expect(cookie?.path).toBe('/admin');

    // Halaman masuk melempar pengguna yang sudah login kembali ke dashboard.
    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto('/admin/posts');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('bisa masuk dengan username; sesi lama tidak berlaku setelah keluar', async ({
    page,
    context,
  }) => {
    await signIn(page, E2E_ADMIN.password, E2E_ADMIN.username.toUpperCase());
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText(`Halo, ${E2E_ADMIN.firstName}`).first()).toBeVisible();

    const oldCookie = (await context.cookies()).find((item) => item.name === 'doit_admin');
    await page.getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);

    // Memutar ulang cookie lama harus ditolak: sesinya sudah dihapus di server.
    await context.addCookies([{ ...(oldCookie as NonNullable<typeof oldCookie>) }]);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('buat artikel dua bahasa, ubah, pratinjau, draft, hapus; situs publik ikut berubah', async ({
    page,
  }, testInfo) => {
    test.slow(); // alur panjang + editor WYSIWYG dimuat dinamis
    const slug = `zz-e2e-admin-${testInfo.project.name}`;
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);

    // Validasi: judul kosong ditolak di server (noValidate), tidak ada yang tersimpan.
    await page.goto('/admin/posts/new');
    await page.getByRole('button', { name: 'Simpan artikel' }).click();
    await expect(page.getByText('Judul minimal 3 karakter')).toBeVisible();

    // Bahasa Indonesia.
    await page.locator('#post-title_id').fill('ZZ E2E Artikel Admin');
    await page.locator('#post-excerpt_id').fill('Ringkasan artikel uji dari admin.');
    await typeInEditor(page, '## Bagian uji\nIsi **tebal** artikel admin.', 'id');
    // Bahasa Inggris lewat tab.
    await page.getByRole('tab', { name: /English/ }).click();
    await page.locator('#post-title_en').fill('ZZ E2E Admin Article');
    await page.locator('#post-excerpt_en').fill('Summary of the admin test article.');
    await typeInEditor(page, 'English **bold** body.', 'en');
    await page.locator('#post-slug').fill(slug);
    await page.getByText('Terbitkan di situs').click();
    await expect(page.getByText('Belum disimpan')).toBeVisible();
    await page.getByRole('button', { name: 'Simpan artikel' }).click();
    await expect(page).toHaveURL(/\/admin\/posts\/[0-9a-f-]{36}\?saved=1$/);
    await expect(page.getByText('Artikel dibuat.')).toBeVisible();
    const editUrl = page.url().split('?')[0] as string;

    // Slug ganda ditolak.
    await page.goto('/admin/posts/new');
    await page.locator('#post-title_id').fill('ZZ E2E Duplikat');
    await page.locator('#post-excerpt_id').fill('Ringkasan duplikat uji.');
    await typeInEditor(page, 'Isi.', 'id');
    await page.locator('#post-slug').fill(slug);
    await page.getByRole('button', { name: 'Simpan artikel' }).click();
    await expect(page.getByText('Slug sudah dipakai')).toBeVisible();

    // Langsung tampil di situs publik dalam dua bahasa, dengan hreflang.
    await page.goto(`/id/blog/${slug}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ZZ E2E Artikel Admin' }),
    ).toBeVisible();
    await expect(page.locator('strong', { hasText: 'tebal' })).toBeVisible();
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      new RegExp(`/en/blog/${slug}$`),
    );
    await page.goto(`/en/blog/${slug}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ZZ E2E Admin Article' }),
    ).toBeVisible();

    // Daftar artikel: bendera dua bahasa dan tombol aksi per baris.
    await page.goto(`/admin/posts?q=${slug}`);
    const row = page.locator('tr', { hasText: 'ZZ E2E Artikel Admin' });
    await expect(row.getByRole('img', { name: 'Bahasa Indonesia' })).toBeVisible();
    await expect(row.getByRole('img', { name: 'English' })).toBeVisible();
    await expect(row.getByRole('link', { name: 'Ubah ZZ E2E Artikel Admin' })).toBeVisible();
    await expect(row.getByRole('link', { name: 'Pratinjau ZZ E2E Artikel Admin' })).toBeVisible();
    await expect(row.getByRole('button', { name: 'Hapus ZZ E2E Artikel Admin' })).toBeVisible();

    // Ubah judul.
    await page.goto(editUrl);
    await page.locator('#post-title_id').fill('ZZ E2E Artikel Admin Diubah');
    await page.getByRole('button', { name: 'Simpan perubahan' }).click();
    await expect(page.getByText('Perubahan tersimpan.')).toBeVisible();
    await page.goto(`/id/blog/${slug}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ZZ E2E Artikel Admin Diubah' }),
    ).toBeVisible();

    // Pratinjau per bahasa.
    await page.goto(`${editUrl}/preview`);
    await expect(
      page.getByRole('heading', { level: 2, name: 'ZZ E2E Artikel Admin Diubah' }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'English' }).click();
    await expect(
      page.getByRole('heading', { level: 2, name: 'ZZ E2E Admin Article' }),
    ).toBeVisible();

    // Jadikan draft: hilang dari situs publik.
    await page.goto(editUrl);
    await page.getByText('Terbitkan di situs').click();
    await page.getByRole('button', { name: 'Simpan perubahan' }).click();
    await expect(page.getByText('Perubahan tersimpan.')).toBeVisible();
    await page.goto(`/id/blog/${slug}`);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);

    // Hapus dari tombol aksi tabel (dengan konfirmasi).
    await page.goto(`/admin/posts?q=${slug}`);
    await page.getByRole('button', { name: 'Hapus ZZ E2E Artikel Admin Diubah' }).first().click();
    await expect(page).toHaveURL(/\/admin\/posts$/);
    await expect(page.getByText('ZZ E2E Artikel Admin Diubah')).toHaveCount(0);
  });

  test('kategori: satu kategori dua nama, ganti nama, hapus', async ({ page }, testInfo) => {
    const name = `ZZ E2E Kat ${testInfo.project.name} ${Date.now()}`;
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/categories');
    await page.locator('#category-name_id').fill(name);
    await page.locator('#category-name_en').fill(`${name} EN`);
    await page.getByRole('button', { name: 'Tambah' }).click();
    await expect(page.getByText('Kategori ditambahkan.')).toBeVisible();

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const row = page.locator('li', { hasText: `/${slug}` });
    await expect(row).toBeVisible();
    await expect(row.locator('input[name="name_en"]')).toHaveValue(`${name} EN`);
    await row.locator('input[name="name_id"]').fill(`${name} Baru`);
    await row.getByRole('button', { name: 'Simpan' }).click();
    await expect(
      page.locator('li', { hasText: `/${slug}` }).locator('input[name="name_id"]'),
    ).toHaveValue(`${name} Baru`);

    await row.getByRole('button', { name: /^Hapus kategori/ }).click();
    await expect(page.locator('li', { hasText: `/${slug}` })).toHaveCount(0);
  });

  test('portofolio: buat proyek, tampil di situs, hapus', async ({ page }, testInfo) => {
    test.slow();
    const slug = `zz-e2e-proj-${testInfo.project.name}`;
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);

    await page
      .getByRole('navigation', { name: 'Navigasi admin' })
      .getByRole('link', { name: 'Portofolio' })
      .click();
    await expect(page.getByRole('heading', { level: 1, name: 'Portofolio' })).toBeVisible();
    await page.getByRole('link', { name: 'Proyek baru' }).click();

    await page.locator('#project-title_id').fill('ZZ E2E Proyek Admin');
    await page.locator('#project-summary_id').fill('Ringkasan proyek dari admin.');
    await page.locator('#project-client_id').fill('Klien uji');
    await page.locator('#project-problem_id').fill('Masalah proyek dari admin.');
    await page.locator('#project-solution_id').fill('Solusi proyek dari admin.');
    await page.locator('#project-result_id').fill('Hasil proyek dari admin.');
    await page.locator('#project-slug').fill(slug);
    await page.locator('#project-serviceSlug').selectOption('web-development');
    await page.locator('#project-techStack').fill('Next.js, PostgreSQL');
    await page.getByText('Tampilkan di situs').click();
    await page.getByRole('button', { name: 'Simpan proyek' }).click();
    await expect(page).toHaveURL(/\/admin\/portfolio\/[0-9a-f-]{36}\?saved=1$/);

    await page.goto(`/id/portfolio/${slug}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ZZ E2E Proyek Admin' }),
    ).toBeVisible();

    await page.goto('/admin/portfolio');
    await page.getByRole('button', { name: 'Hapus ZZ E2E Proyek Admin' }).click();
    await expect(page).toHaveURL(/\/admin\/portfolio$/);
    await expect(page.getByText('ZZ E2E Proyek Admin')).toHaveCount(0);
  });

  test('inbox pesan tampil', async ({ page }) => {
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/messages');
    await expect(page.getByRole('heading', { level: 1, name: 'Pesan kontak' })).toBeVisible();
  });

  for (const path of [
    '/admin',
    '/admin/posts',
    '/admin/posts/new',
    '/admin/categories',
    '/admin/portfolio',
    '/admin/portfolio/new',
    '/admin/messages',
  ]) {
    test(`${path}: tanpa pelanggaran axe`, async ({ page }) => {
      await signIn(page);
      await expect(page).toHaveURL(/\/admin$/);
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      if (path === '/admin/posts/new')
        await expect(
          page.locator('#post-panel-id .doit-editor-content[contenteditable=true]'),
        ).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      const summary = results.violations.map((violation) => ({
        rule: violation.id,
        targets: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });
  }
});

test.describe('responsif dan pencarian', () => {
  test('ponsel: menu laci membuka navigasi; halaman admin tanpa scroll horizontal', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile);
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);

    for (const path of [
      '/admin',
      '/admin/posts',
      '/admin/posts/new',
      '/admin/categories',
      '/admin/portfolio',
      '/admin/portfolio/new',
      '/admin/messages',
    ]) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }

    await page.goto('/admin');
    await page.getByRole('button', { name: 'Buka menu' }).click();
    const drawer = page.getByRole('dialog', { name: 'Menu admin' });
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();

    await page.getByRole('button', { name: 'Buka menu' }).click();
    await drawer.getByRole('link', { name: 'Kategori' }).click();
    await expect(page).toHaveURL(/\/admin\/categories$/);
    await expect(drawer).toBeHidden();
  });

  test('desktop: menu aktif, filter status, dan pencarian artikel', async ({ page, isMobile }) => {
    test.skip(isMobile);
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto('/admin/posts?status=published');
    await expect(
      page
        .getByRole('navigation', { name: 'Navigasi admin' })
        .getByRole('link', { name: 'Artikel' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      page
        .getByRole('navigation', { name: 'Filter status artikel' })
        .getByRole('link', { name: 'Terbit' }),
    ).toHaveAttribute('aria-current', 'page');

    await page.getByLabel('Cari judul atau slug').fill('ZZ E2E Artikel 0');
    await page.getByRole('button', { name: 'Cari' }).click();
    await expect(page).toHaveURL(/status=published&q=ZZ/);
    await expect(page.getByRole('link', { name: 'ZZ E2E Artikel 01' }).first()).toBeVisible();

    await page.getByLabel('Cari judul atau slug').fill('tidak-ada-yang-cocok-xyz');
    await page.getByRole('button', { name: 'Cari' }).click();
    await expect(page.getByText('Tidak ada artikel yang cocok')).toBeVisible();
  });
});

test('halaman masuk: axe dan tanpa scroll horizontal', async ({ page, isMobile }) => {
  await page.goto('/admin/login');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  if (!isMobile) {
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
