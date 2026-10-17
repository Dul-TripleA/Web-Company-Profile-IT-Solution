// Dibaca langsung dari process.env (bukan lib/env.ts) agar halaman statis tidak
// ikut mensyaratkan DATABASE_URL saat build.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
