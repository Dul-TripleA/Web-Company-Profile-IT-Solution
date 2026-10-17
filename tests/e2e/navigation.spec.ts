import { expect, test } from '@playwright/test';

test.describe('dropdown navigasi (desktop)', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Dropdown desktop disembunyikan di layar kecil');
  });

  test('dibuka dengan klik dan ditutup dengan Escape', async ({ page }) => {
    await page.goto('/en');
    const trigger = page.getByRole('button', { name: 'Services' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Web Development' }).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('bisa dioperasikan dengan keyboard', async ({ page }) => {
    await page.goto('/en');
    const trigger = page.getByRole('button', { name: 'Services' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.getByRole('link', { name: 'All services' }).click();
    await expect(page).toHaveURL(/\/en\/services$/);
  });

  test('header menjadi solid setelah halaman digulir', async ({ page }) => {
    await page.goto('/en');
    const header = page.locator('#main-header');
    await expect(header).toHaveClass(/bg-transparent/);
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toHaveClass(/bg-forest\/95/);
  });
});

test.describe('menu mobile', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, 'Menu hamburger hanya ada di layar kecil');
  });

  test('dibuka, dipakai navigasi, lalu menutup sendiri', async ({ page }) => {
    await page.goto('/en');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();

    await menu.getByRole('link', { name: 'About Us' }).click();
    await expect(page).toHaveURL(/\/en\/about$/);
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
  });

  test('menu terbuka muat di dalam layar', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(600);
    const { viewportHeight, headerBottom } = await page.evaluate(() => ({
      viewportHeight: window.innerHeight,
      headerBottom: document.getElementById('main-header')!.getBoundingClientRect().bottom,
    }));
    expect(headerBottom).toBeLessThanOrEqual(viewportHeight + 1);
  });

  test('ditutup dengan Escape', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
  });

  test('target sentuh tombol utama setidaknya 44px', async ({ page }) => {
    await page.goto('/en');
    const box = await page
      .getByRole('main')
      .getByRole('link', { name: /Free Consultation/ })
      .first()
      .boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});

// Item menu aktif mengikuti halaman dan section beranda yang sedang dibaca.
const ACTIVE = '#main-header [data-active="true"]';

test.describe('menu aktif (desktop)', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Menu desktop disembunyikan di layar kecil');
  });

  test('mengikuti halaman yang dibuka', async ({ page }) => {
    const cases: [string, string][] = [
      ['/en', 'Home'],
      ['/en/about', 'About Us'],
      ['/en/services', 'Services'],
      ['/en/services/web-development', 'Services'],
      ['/en/contact', 'Contact'],
    ];
    for (const [path, label] of cases) {
      await page.goto(path);
      await expect(page.locator(ACTIVE), path).toHaveText([label]);
    }
  });

  test('mengikuti section di beranda saat digulir', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator(ACTIVE)).toHaveText(['Home']);

    await page.evaluate(() => document.getElementById('services')?.scrollIntoView());
    await expect(page.locator(ACTIVE)).toHaveText(['Services']);

    await page.evaluate(() => document.getElementById('workflow')?.scrollIntoView());
    await expect(page.locator(ACTIVE)).toHaveText(['Pages']);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator(ACTIVE)).toHaveText(['Home']);
  });

  test('anak dropdown yang sesuai ikut ditandai', async ({ page }) => {
    await page.goto('/en/services/web-development');
    await page.getByRole('button', { name: 'Services' }).click();
    const header = page.locator('#main-header');
    await expect(header.getByRole('link', { name: 'Web Development' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(header.getByRole('link', { name: 'UI/UX Design' })).not.toHaveAttribute(
      'aria-current',
      /.+/,
    );
  });
});

test.describe('menu aktif (mobile)', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, 'Menu hamburger hanya ada di layar kecil');
  });

  test('item halaman yang dibuka ditandai di panel menu', async ({ page }) => {
    await page.goto('/en/about');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.locator('#mobile-menu');
    await expect(menu.locator('[data-active="true"]')).toHaveText(['About Us']);
    await expect(menu.getByRole('link', { name: 'About Us' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
