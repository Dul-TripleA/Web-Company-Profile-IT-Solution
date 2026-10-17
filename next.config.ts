import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
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
