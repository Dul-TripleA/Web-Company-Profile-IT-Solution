import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ALL_PAGES } from './helpers';

// Hanya desktop: aturan axe yang diperiksa tidak bergantung pada ukuran layar.
test.beforeEach(({ isMobile }) => {
  test.skip(isMobile);
});

for (const path of ALL_PAGES) {
  test(`${path}: tanpa pelanggaran aksesibilitas (axe, WCAG 2.x A/AA)`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1:visible').first()).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const summary = results.violations.map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      targets: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    }));
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });
}

for (const path of ['/id/services/tidak-ada', '/id/halaman-yang-tidak-ada']) {
  test(`${path}: halaman 404 tanpa pelanggaran aksesibilitas`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1:visible').first()).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map((violation) => ({
      rule: violation.id,
      targets: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    }));
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });
}
