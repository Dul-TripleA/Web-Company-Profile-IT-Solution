import type { Locale } from './config';

// Teks halaman 404 dan error. Terpisah dari kamus utama karena error boundary adalah
// Client Component dan tidak boleh mengimpor kamus yang server-only.
export type BoundaryCopy = {
  notFoundTitle: string;
  notFoundBody: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  goHome: string;
  browseServices: string;
  contactUs: string;
};

export const BOUNDARY_COPY: Record<Locale, BoundaryCopy> = {
  id: {
    notFoundTitle: 'Halaman tidak ditemukan',
    notFoundBody:
      'Alamat yang Anda tuju tidak ada atau sudah dipindahkan. Periksa kembali alamatnya, atau kembali ke beranda.',
    errorTitle: 'Terjadi kesalahan',
    errorBody:
      'Maaf, halaman ini gagal dimuat. Coba lagi dalam beberapa saat. Jika terus berulang, hubungi kami.',
    retry: 'Coba lagi',
    goHome: 'Kembali ke beranda',
    browseServices: 'Lihat layanan',
    contactUs: 'Hubungi kami',
  },
  en: {
    notFoundTitle: 'Page not found',
    notFoundBody:
      'The address you followed does not exist or has moved. Check the address, or head back home.',
    errorTitle: 'Something went wrong',
    errorBody:
      'Sorry, this page failed to load. Please try again shortly. If it keeps happening, contact us.',
    retry: 'Try again',
    goHome: 'Back to home',
    browseServices: 'Browse services',
    contactUs: 'Contact us',
  },
};
