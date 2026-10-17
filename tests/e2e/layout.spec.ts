import { expect, test } from '@playwright/test';
import { ALL_PAGES } from './helpers';

for (const path of ALL_PAGES) {
  test(`${path}: tidak ada scroll horizontal`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1:visible').first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
