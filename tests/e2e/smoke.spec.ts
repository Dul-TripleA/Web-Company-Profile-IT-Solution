import { expect, test } from '@playwright/test';
import { ALL_PAGES, openMobileMenuIfNeeded } from './helpers';

test('/ dialihkan ke locale default', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/id$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
});

test('path tanpa locale dialihkan dengan path dipertahankan', async ({ page }) => {
  await page.goto('/services');
  await expect(page).toHaveURL(/\/id\/services$/);
});

for (const path of ALL_PAGES) {
  test(`${path}: tepat satu h1 dan <html lang> sesuai locale`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', path.split('/')[1] ?? '');
  });
}

test('pengalih bahasa menjaga halaman yang sedang dibuka', async ({ page, isMobile }) => {
  await page.goto('/id/services');
  await openMobileMenuIfNeeded(page, isMobile);
  await page.getByRole('link', { name: 'en', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator('h1:visible')).toContainText('What We Can Build for You');
});

test('CTA hero menuju halaman kontak', async ({ page }) => {
  await page.goto('/id');
  await page
    .getByRole('main')
    .getByRole('link', { name: /Konsultasi Gratis/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/id\/contact$/);
});

// Dengan Cache Components, `dynamicParams` tidak didukung: slug tak dikenal dirender saat request
// dan notFound() terkirim lewat streaming (status 200). Yang dijamin: konten 404 dan noindex.
test('slug layanan tidak dikenal menampilkan 404 bermerek sesuai bahasa, di dalam layout situs', async ({
  page,
}) => {
  await page.goto('/en/services/tidak-ada');
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', 'noindex');
  await expect(page.locator('h1:visible')).toHaveText('Page not found');
  await expect(page.locator('#main-header')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/en');
});

test('URL yang tidak cocok rute mana pun mengembalikan status 404 bermerek', async ({ page }) => {
  const response = await page.goto('/id/halaman-yang-tidak-ada');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Halaman tidak ditemukan');
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('link', { name: 'Kembali ke beranda' })).toHaveAttribute(
    'href',
    '/id',
  );
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/en');
});

test('sitemap memuat semua halaman dengan hreflang', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toContain('/id/services/web-development');
  expect(xml).toContain('/en/services/web-development');
  expect(xml).toContain('hreflang="x-default"');
  expect(xml).not.toContain('/admin');
});

test('robots.txt memblokir /admin dan /api serta menunjuk sitemap', async ({ request }) => {
  const text = await (await request.get('/robots.txt')).text();
  expect(text).toContain('Disallow: /admin');
  expect(text).toContain('Disallow: /api');
  expect(text).toContain('Sitemap:');
});

test('metadata: canonical, hreflang, dan JSON-LD valid', async ({ page }) => {
  await page.goto('/en/about');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/about$/);
  const alternates = await page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('hreflang')));
  expect(alternates).toEqual(expect.arrayContaining(['id', 'en', 'x-default']));

  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((block) => (JSON.parse(block) as { '@type': string })['@type']);
  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'BreadcrumbList']));
});

test('ikon, manifest, dan gambar OG tersedia dan terhubung di metadata', async ({
  page,
  request,
}) => {
  await page.goto('/id');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /\/og-default\.png$/,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
  await expect(page.locator('link[rel="icon"]').first()).toBeAttached();
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/manifest.webmanifest',
  );

  for (const url of [
    '/og-default.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/favicon.ico',
    '/manifest.webmanifest',
  ]) {
    expect((await request.get(url)).status(), url).toBe(200);
  }
  const manifest = (await (await request.get('/manifest.webmanifest')).json()) as { name: string };
  expect(manifest.name).toBe('Do It');
});

// Klaim tanpa bukti yang sudah diputuskan disembunyikan (lihat "Topik yang Ditampung" di PROGRESS.md).
test('klaim tanpa bukti tidak tampil di beranda', async ({ page }) => {
  for (const path of ['/id', '/en']) {
    await page.goto(path);
    const text = (await page.locator('body').innerText()).toLowerCase();
    for (const claim of [
      '5k+',
      'one of the best',
      'salah satu software house terbaik',
      '10k+',
      '100+',
      '98%',
      'view our portfolio',
      '24/7',
      'penetration',
      'uji penetrasi',
      'daily backup',
      'backup harian',
      '30-minute',
      '30 menit',
      'solutions architect',
    ]) {
      expect(text, `${path} memuat "${claim}"`).not.toContain(claim);
    }
  }
});

test('hero memakai judul dan deskripsi baru', async ({ page }) => {
  await page.goto('/id');
  await expect(page.locator('h1')).toContainText('Kami Membangun Solusi Digital');
  await expect(page.getByRole('main')).toContainText('Kami membantu bisnis mewujudkan ide');
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText('We Build Digital Solutions');
});

test('layanan yang disembunyikan tidak punya halaman dan tidak ada di sitemap', async ({
  page,
  request,
}) => {
  for (const slug of ['erp-systems', 'mobile-app-development', 'custom-web-applications']) {
    await page.goto(`/id/services/${slug}`);
    await expect(page.locator('h1:visible')).toHaveText('Halaman tidak ditemukan');
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).not.toContain(`/services/${slug}`);
  }
});

test('beranda memuat 3 layanan dan konten pendekatan baru', async ({ page }) => {
  await page.goto('/en');
  const main = page.getByRole('main');
  for (const text of [
    'A Clear Process, From Idea to Delivery',
    'Understand Your Needs',
    'A Straightforward Approach to Better Software',
    'Clear Communication',
    'Web Development',
    'Custom Software Development',
    'UI/UX Design',
  ]) {
    await expect(main.getByText(text).first(), text).toBeVisible();
  }
  await expect(main.locator('#services h3')).toHaveCount(3);
});

test('Reviews dan tautan sosial disembunyikan; footer tetap ada', async ({ page }) => {
  await page.goto('/id');
  await expect(page.locator('#reviews')).toHaveCount(0);
  await expect(page.getByText('Testimoni Klien')).toHaveCount(0);
  await expect(page.getByText('Ikuti Kami')).toHaveCount(0);
  for (const name of ['Facebook', 'Instagram', 'LinkedIn', 'GitHub']) {
    await expect(page.getByRole('link', { name })).toHaveCount(0);
  }
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.getByRole('contentinfo')).toContainText('Hak cipta dilindungi');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Ulasan' })).toHaveCount(0);
});

test('email, telepon, dan tautan legal disembunyikan di semua halaman', async ({ page }) => {
  for (const path of ['/id', '/en', '/id/contact', '/id/about', '/id/services']) {
    await page.goto(path);
    await expect(page.locator('a[href^="mailto:"]'), path).toHaveCount(0);
    await expect(page.locator('a[href^="tel:"]'), path).toHaveCount(0);
    const text = (await page.locator('body').innerText()).toLowerCase();
    for (const hidden of ['example@doit.com', '+62851', 'kebijakan privasi', 'privacy policy']) {
      expect(text, `${path} memuat "${hidden}"`).not.toContain(hidden);
    }
  }
  await page.goto('/id');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.join('')).not.toContain('telephone');
});

test('halaman kontak hanya berisi form (satu kolom)', async ({ page }) => {
  await page.goto('/id/contact');
  await expect(page.getByRole('button', { name: 'Kirim pesan' })).toBeVisible();
  await expect(page.getByText('Hubungi kami langsung')).toHaveCount(0);
});

test('logo di header dan footer termuat dan tidak rusak', async ({ page }) => {
  await page.goto('/id');
  for (const scope of ['#main-header', 'footer']) {
    const logo = page.locator(`${scope} img[src*="logo-full"]`).first();
    await logo.scrollIntoViewIfNeeded();
    await expect(logo, scope).toBeVisible();
    // Logo footer dimuat malas, jadi tunggu sampai benar-benar termuat.
    await expect
      .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), {
        message: scope,
      })
      .toBe(true);
  }
  await expect(page.locator('#main-header img[alt="Do It"]')).toBeVisible();
});
