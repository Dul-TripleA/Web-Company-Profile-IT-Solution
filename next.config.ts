import type { NextConfig } from 'next';

// Header keamanan dasar (docs/SECURITY.md bagian 6). HSTS dan CSP menyusul setelah domain
// produksi dan HTTPS stabil.
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  partialPrefetching: true,
  // 404 untuk URL yang tidak cocok rute apa pun; wajib karena root layout ada di segmen dinamis [locale].
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
