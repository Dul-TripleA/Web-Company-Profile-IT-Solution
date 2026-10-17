import type { Page } from '@playwright/test';
import { SERVICES } from '../../src/content/services';
import { LOCALES } from '../../src/i18n/config';

const STATIC_PATHS = ['', '/about', '/services', '/portfolio', '/contact'];

/** Semua halaman publik untuk semua locale, mis. `/id`, `/en/services/web-development`. */
export const ALL_PAGES = LOCALES.flatMap((locale) => [
  ...STATIC_PATHS.map((path) => `/${locale}${path}`),
  ...SERVICES.map((service) => `/${locale}/services/${service.slug}`),
]);

/** Di layar kecil, navigasi dan pengalih bahasa ada di balik tombol hamburger. */
export async function openMobileMenuIfNeeded(page: Page, isMobile: boolean) {
  if (!isMobile) return;
  const toggle = page.getByRole('button', { name: /^(Buka menu|Open menu)$/ });
  await toggle.click();
}
