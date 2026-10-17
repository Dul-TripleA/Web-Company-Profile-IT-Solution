import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Do It',
    short_name: 'Do It',
    description: 'Modern Digital Solutions',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b2923',
    theme_color: '#0b2923',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
