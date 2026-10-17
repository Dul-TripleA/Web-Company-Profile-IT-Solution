import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { SLUGS, TITLES } from './blog-fixtures';

// Butuh data uji dari global-setup, yang hanya dipasang bila DATABASE_URL tersedia.
test.skip(!process.env.DATABASE_URL, 'DATABASE_URL tidak tersedia: tes blog dilewati');

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('daftar artikel', () => {
  test('menampilkan artikel terbit, menyembunyikan draft dan terjadwal', async ({ page }) => {
    await page.goto('/id/blog');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(TITLES.idMarkdown)).toBeVisible();
    await expect(page.getByText(TITLES.idDraft)).toHaveCount(0);
    await expect(page.getByText(TITLES.idFuture)).toHaveCount(0);
    // Satu artikel per bahasa: artikel English tidak muncul di /id.
    await expect(page.getByText(TITLES.en)).toHaveCount(0);
  });

  test('artikel English hanya tampil di /en/blog', async ({ page }) => {
    await page.goto('/en/blog');
    await expect(page.getByText(TITLES.en)).toBeVisible();
    await expect(page.getByText(TITLES.idMarkdown)).toHaveCount(0);
  });

  test('paginasi: halaman 2 ada, /page/1 dialihkan, halaman di luar jangkauan 404', async ({
    page,
  }) => {
    await page.goto('/id/blog');
    await page
      .getByRole('link', { name: /Berikutnya|Next/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/id\/blog\/page\/2$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/id/blog/page/1');
    await expect(page).toHaveURL(/\/id\/blog$/);

    // Dengan Cache Components, notFound() setelah streaming mulai berstatus 200 + noindex (ADR-010).
    await page.goto('/id/blog/page/999');
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByText(/ZZ E2E Artikel/)).toHaveCount(0);
  });

  test('filter kategori', async ({ page }) => {
    await page.goto(`/id/blog/category/${SLUGS.category}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(TITLES.idFirst)).toBeVisible();
    await expect(page.getByText(TITLES.idMarkdown)).toHaveCount(0);

    await page.goto('/id/blog/category/tidak-ada');
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByText(/ZZ E2E Artikel/)).toHaveCount(0);
  });
});

test.describe('halaman artikel', () => {
  test('render Markdown dengan aman', async ({ page }) => {
    await page.goto(`/id/blog/${SLUGS.idMarkdown}`);
    await expect(page.getByRole('heading', { level: 1, name: TITLES.idMarkdown })).toBeVisible();
    // `#` di isi dipetakan ke h2, jadi hanya ada satu h1.
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 2, name: 'Judul besar' })).toBeVisible();

    const safe = page.getByRole('link', { name: 'tautan aman' });
    await expect(safe).toHaveAttribute('target', '_blank');
    await expect(safe).toHaveAttribute('rel', /noopener/);
    await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
    // Payload RSC Next memuat teks Markdown mentah sebagai data (tidak dieksekusi), jadi dikecualikan.
    const scripts = await page
      .locator('script:not([type="application/ld+json"])')
      .allTextContents();
    const executable = scripts.filter((text) => !text.includes('self.__next_f'));
    expect(executable.some((text) => text.includes('window.__pwned'))).toBe(false);
    await expect(page.locator('img[onerror]')).toHaveCount(0);
    expect(
      await page.evaluate(() => (window as unknown as { __pwned?: boolean }).__pwned),
    ).toBeFalsy();
  });

  test('metadata, kanonik, JSON-LD BlogPosting, tanpa hreflang', async ({ page }) => {
    await page.goto(`/id/blog/${SLUGS.idFirst}`);
    await expect(page.getByRole('heading', { level: 1, name: TITLES.idFirst })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`/id/blog/${SLUGS.idFirst}$`),
    );
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');

    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? '{}')['@type']));
    expect(types).toContain('BlogPosting');
    expect(types).toContain('BreadcrumbList');
  });

  test('draft, terjadwal, dan slug tak dikenal tidak diindeks', async ({ page }) => {
    for (const slug of [SLUGS.idDraft, SLUGS.idFuture, 'zz-e2e-tidak-ada']) {
      await page.goto(`/id/blog/${slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.getByText(TITLES.idDraft)).toHaveCount(0);
    }
  });

  test('artikel English tidak bisa dibuka lewat /id', async ({ page }) => {
    await page.goto(`/id/blog/${SLUGS.en}`);
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByRole('heading', { level: 1, name: TITLES.en })).toHaveCount(0);
  });
});

test.describe('RSS dan sitemap', () => {
  test('RSS per bahasa memuat artikel terbit saja', async ({ request }) => {
    const id = await request.get('/id/blog/rss.xml');
    expect(id.status()).toBe(200);
    expect(id.headers()['content-type']).toContain('xml');
    const xml = await id.text();
    expect(xml).toContain(SLUGS.idMarkdown);
    expect(xml).not.toContain(SLUGS.idDraft);
    expect(xml).not.toContain(SLUGS.idFuture);
    expect(xml).not.toContain(SLUGS.en);
  });

  test('sitemap memuat artikel dan kategori terbit', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain(`/id/blog/${SLUGS.idMarkdown}`);
    expect(xml).toContain(`/en/blog/${SLUGS.en}`);
    expect(xml).toContain(`/id/blog/category/${SLUGS.category}`);
    expect(xml).not.toContain(SLUGS.idDraft);
    expect(xml).not.toContain(SLUGS.idFuture);
  });
});

test.describe('aksesibilitas dan tata letak', () => {
  const paths = [
    '/id/blog',
    '/id/blog/page/2',
    `/id/blog/category/${SLUGS.category}`,
    `/id/blog/${SLUGS.idFirst}`,
    `/id/blog/${SLUGS.idMarkdown}`,
    '/en/blog',
  ];

  for (const path of paths) {
    test(`${path}: tanpa pelanggaran axe`, async ({ page, isMobile }) => {
      test.skip(isMobile);
      await page.goto(path);
      await expect(page.locator('h1:visible').first()).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      const summary = results.violations.map((violation) => ({
        rule: violation.id,
        targets: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });

    test(`${path}: tanpa scroll horizontal`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1:visible').first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
