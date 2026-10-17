import { loadEnvConfig } from '@next/env';
import { defineConfig, devices } from '@playwright/test';

// Memuat .env lokal agar global-setup bisa memasang data uji blog; di CI tanpa DB, tes blog dilewati.
loadEnvConfig(process.cwd());

const PORT = 3100;
const isCI = Boolean(process.env.CI);
const headed = Boolean(process.env.PW_HEADED) && !isCI;

// Lokal memakai Chrome yang sudah terpasang (tanpa mengunduh browser); CI memasang Chromium.
const browser = isCI ? {} : { channel: 'chrome' as const };

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',
  globalTeardown: './tests/e2e/global-teardown.ts',
  fullyParallel: true,
  // Dibatasi: puluhan browser sekaligus melawan satu server membuat tes lambat dan gagal acak.
  workers: isCI ? 2 : 4,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    headless: !headed,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...browser } },
    { name: 'mobile', use: { ...devices['Pixel 7'], ...browser } },
  ],
  // Menjalankan hasil build; jalankan `bun run build` lebih dulu (skrip test:e2e sudah melakukannya).
  webServer: {
    // keepAliveTimeout dinaikkan: default Node (5 dtk) kadang menutup koneksi tepat saat Chrome memakainya
    // lagi, sehingga page.goto gagal acak dengan net::ERR_ABORTED.
    command: `bun run start -- --port ${PORT} --keepAliveTimeout 65000`,
    url: `http://localhost:${PORT}/id`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
