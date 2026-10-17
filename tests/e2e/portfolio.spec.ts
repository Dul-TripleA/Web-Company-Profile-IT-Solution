import { expect, test } from '@playwright/test';
import { PROJECT_TITLES, SLUGS } from './blog-fixtures';

// Portofolio dibaca dari database; butuh data uji dari global-setup.
test.skip(!process.env.DATABASE_URL, 'DATABASE_URL tidak tersedia: tes portofolio dilewati');

test('daftar: proyek terbit tampil, contoh berlabel, draft tidak tampil', async ({ page }) => {
  await page.goto('/id/portfolio');
  await expect(page.getByRole('heading', { level: 1, name: 'Karya Kami' })).toBeVisible();
  await expect(page.getByText(PROJECT_TITLES.real)).toBeVisible();
  const sample = page.locator('li', { hasText: PROJECT_TITLES.sample });
  await expect(sample.getByText('Contoh', { exact: true })).toBeVisible();
  await expect(page.getByText(PROJECT_TITLES.draft)).toHaveCount(0);
});

test('daftar bahasa Inggris hanya memuat proyek yang punya versi Inggris', async ({ page }) => {
  await page.goto('/en/portfolio');
  await expect(page.getByText(PROJECT_TITLES.realEn)).toBeVisible();
  await expect(page.getByText(PROJECT_TITLES.sample)).toHaveCount(0);
});

test('detail proyek nyata: isi, CTA, hreflang, dan masuk sitemap', async ({ page, request }) => {
  await page.goto(`/en/portfolio/${SLUGS.project}`);
  await expect(page.getByRole('heading', { level: 1, name: PROJECT_TITLES.realEn })).toBeVisible();
  for (const heading of ['The problem', 'Our solution', 'The result']) {
    await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: /Free Consultation/i }).first()).toBeVisible();
  await expect(page.locator('link[rel="alternate"][hreflang="id"]')).toHaveAttribute(
    'href',
    new RegExp(`/id/portfolio/${SLUGS.project}$`),
  );

  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain(`/id/portfolio/${SLUGS.project}`);
  expect(xml).toContain('/id/portfolio<');
});

test('proyek contoh tidak diindeks dan tidak masuk sitemap', async ({ page, request }) => {
  await page.goto(`/id/portfolio/${SLUGS.projectSample}`);
  await expect(page.getByRole('heading', { level: 1, name: PROJECT_TITLES.sample })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);

  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).not.toContain(SLUGS.projectSample);
  expect(xml).not.toContain(SLUGS.projectDraft);
});

test('proyek draft dan slug tak dikenal menampilkan 404', async ({ page }) => {
  for (const slug of [SLUGS.projectDraft, 'tidak-ada']) {
    await page.goto(`/id/portfolio/${slug}`);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
    await expect(page.getByText(PROJECT_TITLES.draft)).toHaveCount(0);
  }
});

test('menu utama memuat Portofolio', async ({ page, isMobile }) => {
  await page.goto('/id');
  if (isMobile) await page.getByRole('button', { name: 'Buka menu' }).click();
  await expect(page.getByRole('link', { name: 'Portofolio' }).first()).toHaveAttribute(
    'href',
    '/id/portfolio',
  );
});
