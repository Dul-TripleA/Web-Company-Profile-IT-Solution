import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { E2E_ADMIN } from './admin-credentials';
import { connect } from './blog-fixtures';

// Butuh database (login mencatat percobaan gagal; artikel disimpan di DB).
test.skip(!process.env.DATABASE_URL, 'DATABASE_URL tidak tersedia: tes admin dilewati');

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
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile);
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
    await expect(page.getByText(`Halo, ${E2E_ADMIN.firstName}`)).toBeVisible();

    const oldCookie = (await context.cookies()).find((item) => item.name === 'doit_admin');
    await page.getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);

    // Memutar ulang cookie lama harus ditolak: sesinya sudah dihapus di server.
    await context.addCookies([{ ...(oldCookie as NonNullable<typeof oldCookie>) }]);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('buat, ubah, pratinjau, dan hapus artikel; situs publik ikut berubah', async ({
    page,
  }, testInfo) => {
    const slug = `zz-e2e-admin-${testInfo.project.name}`;
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);

    // Validasi: judul kosong ditolak di server (noValidate), tidak ada yang tersimpan.
    await page.goto('/admin/posts/new');
    await page.getByRole('button', { name: 'Simpan artikel' }).click();
    await expect(page.getByText('Judul minimal 3 karakter')).toBeVisible();

    // Buat dan terbitkan.
    await page.getByLabel('Judul', { exact: true }).fill('ZZ E2E Artikel Admin');
    await page.getByLabel('Slug', { exact: true }).fill(slug);
    await page.getByLabel('Ringkasan').fill('Ringkasan artikel uji dari admin.');
    await page.getByLabel('Isi (Markdown)').fill('## Bagian uji\n\nIsi **tebal** artikel admin.');
    await page.getByLabel('Status').selectOption('PUBLISHED');
    await page.getByRole('button', { name: 'Simpan artikel' }).click();
    await expect(page).toHaveURL(/\/admin\/posts\/[0-9a-f-]{36}\?saved=1$/);
    await expect(page.getByText('Artikel dibuat.')).toBeVisible();
    const editUrl = page.url().split('?')[0] as string;

    // Slug ganda ditolak.
    await page.goto('/admin/posts/new');
    await page.getByLabel('Judul', { exact: true }).fill('ZZ E2E Duplikat');
    await page.getByLabel('Slug', { exact: true }).fill(slug);
    await page.getByLabel('Ringkasan').fill('Ringkasan duplikat uji.');
    await page.getByLabel('Isi (Markdown)').fill('Isi.');
    await page.getByRole('button', { name: 'Simpan artikel' }).click();
    await expect(page.getByText('Slug sudah dipakai')).toBeVisible();

    // Langsung tampil di situs publik (cache di-update oleh Server Action).
    await page.goto(`/id/blog/${slug}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ZZ E2E Artikel Admin' }),
    ).toBeVisible();
    await expect(page.locator('strong', { hasText: 'tebal' })).toBeVisible();

    // Ubah judul.
    await page.goto(editUrl);
    await page.getByLabel('Judul', { exact: true }).fill('ZZ E2E Artikel Admin Diubah');
    await page.getByRole('button', { name: 'Simpan perubahan' }).click();
    await expect(page.getByRole('status')).toHaveText('Tersimpan.');
    await page.goto(`/id/blog/${slug}`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ZZ E2E Artikel Admin Diubah' }),
    ).toBeVisible();

    // Pratinjau.
    await page.goto(`${editUrl}/preview`);
    await expect(
      page.getByRole('heading', { level: 1, name: 'ZZ E2E Artikel Admin Diubah' }),
    ).toBeVisible();

    // Jadikan draft: hilang dari situs publik.
    await page.goto(editUrl);
    await page.getByLabel('Status').selectOption('DRAFT');
    await page.getByRole('button', { name: 'Simpan perubahan' }).click();
    await expect(page.getByRole('status')).toHaveText('Tersimpan.');
    await page.goto(`/id/blog/${slug}`);
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);

    // Hapus.
    await page.goto(editUrl);
    await page.getByText('Hapus artikel').click();
    await page.getByRole('button', { name: 'Ya, hapus permanen' }).click();
    await expect(page).toHaveURL(/\/admin\/posts$/);
    await expect(page.getByText('ZZ E2E Artikel Admin Diubah')).toHaveCount(0);
  });

  test('kategori: tambah, ganti nama, hapus', async ({ page }, testInfo) => {
    const name = `ZZ E2E Kat ${testInfo.project.name}`;
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/categories');
    await page.getByLabel('Nama kategori baru').fill(name);
    await page.getByRole('button', { name: 'Tambah' }).click();
    await expect(page.getByText('Kategori ditambahkan.')).toBeVisible();

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const row = page.locator('li', { hasText: `/${slug}` });
    await expect(row).toBeVisible();
    await row.getByRole('textbox').fill(`${name} Baru`);
    await row.getByRole('button', { name: 'Simpan nama' }).click();
    await expect(page.locator('li', { hasText: `/${slug}` }).getByRole('textbox')).toHaveValue(
      `${name} Baru`,
    );

    await row.getByText('Hapus', { exact: true }).click();
    await row.getByRole('button', { name: 'Ya, hapus' }).click();
    await expect(page.locator('li', { hasText: `/${slug}` })).toHaveCount(0);
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
    '/admin/messages',
  ]) {
    test(`${path}: tanpa pelanggaran axe`, async ({ page }) => {
      await signIn(page);
      await expect(page).toHaveURL(/\/admin$/);
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      const summary = results.violations.map((violation) => ({
        rule: violation.id,
        targets: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });
  }
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
