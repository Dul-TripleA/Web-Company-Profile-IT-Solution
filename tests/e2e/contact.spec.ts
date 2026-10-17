import { expect, test } from '@playwright/test';

const VALID = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  message: 'Kami butuh sistem ERP untuk gudang kami.',
};

// Pengiriman sampai database butuh Neon, jadi yang diuji di sini: validasi server, isian yang
// dipertahankan, dan honeypot (yang berhenti sebelum menyentuh database).
test.describe('form kontak', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Perilaku form sama di semua ukuran; cukup diuji di desktop');
  });

  test('menampilkan galat per kolom dan mempertahankan isian', async ({ page }) => {
    await page.goto('/id/contact');
    await page.getByLabel('Nama lengkap').fill('A');
    await page.getByLabel('Email', { exact: true }).fill('bukan-email');
    await page.getByLabel('Ceritakan proyek Anda').fill('pendek');
    await page.getByRole('button', { name: 'Kirim pesan' }).click();

    await expect(page.locator('form [role="alert"]')).toHaveText('Periksa kolom yang ditandai.');
    await expect(page.getByText('Terlalu pendek.')).toHaveCount(2);
    await expect(page.getByText('Masukkan alamat email yang valid.')).toBeVisible();
    await expect(page.getByLabel('Nama lengkap')).toHaveValue('A');
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue('bukan-email');
  });

  test('kolom jebakan (honeypot) terisi: tampil sukses tanpa menyimpan', async ({ page }) => {
    await page.goto('/id/contact');
    await page.getByLabel('Nama lengkap').fill(VALID.name);
    await page.getByLabel('Email', { exact: true }).fill(VALID.email);
    await page.getByLabel('Ceritakan proyek Anda').fill(VALID.message);
    await page.locator('input[name="website"]').fill('http://spam.example', { force: true });
    await page.getByRole('button', { name: 'Kirim pesan' }).click();

    await expect(page.getByText('Pesan terkirim')).toBeVisible();
  });

  test('honeypot tidak terjangkau keyboard maupun pembaca layar', async ({ page }) => {
    await page.goto('/id/contact');
    const trap = page.locator('input[name="website"]');
    await expect(trap).toHaveAttribute('tabindex', '-1');
    await expect(trap.locator('xpath=ancestor::div[@aria-hidden="true"]')).toHaveCount(1);
  });
});

test.describe('form kontak tanpa JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile);
  });

  test('validasi di server tetap bekerja dan isian dipertahankan', async ({ page }) => {
    await page.goto('/id/contact');
    await page.getByLabel('Nama lengkap').fill('A');
    await page.getByLabel('Email', { exact: true }).fill('budi@example.com');
    await page.getByLabel('Ceritakan proyek Anda').fill('pendek');
    await page.getByRole('button', { name: 'Kirim pesan' }).click();

    await expect(page.getByText('Terlalu pendek.')).toHaveCount(2);
    await expect(page.getByLabel('Nama lengkap')).toHaveValue('A');
  });
});
