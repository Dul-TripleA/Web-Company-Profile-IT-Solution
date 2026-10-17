import { expect, test } from '@playwright/test';

// Dengan animasi aktif, bagian di bawah lipatan muncul (opacity 1) setelah discroll.
test.use({ reducedMotion: 'no-preference' });

test('bagian beranda muncul dengan animasi saat discroll', async ({ page }) => {
  await page.goto('/id');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const workflowCard = page.locator('#workflow ol > li').first();
  await workflowCard.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => workflowCard.evaluate((el) => Number(getComputedStyle(el).opacity)), {
      timeout: 5000,
    })
    .toBe(1);
});

test('dengan "kurangi gerakan", konten tampil tanpa animasi', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://localhost:3100/id');
  const card = page.locator('#workflow ol > li').first();
  expect(await card.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await context.close();
});

test('tanpa JavaScript, konten tetap tampil', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:3100/id');
  const card = page.locator('#workflow ol > li').first();
  expect(await card.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await context.close();
});
