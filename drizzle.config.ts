import { defineConfig } from 'drizzle-kit';

// Migrasi memakai koneksi langsung (unpooled), bukan endpoint pooled.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? '' },
});
