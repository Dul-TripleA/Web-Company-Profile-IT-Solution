// DISEMBUNYIKAN (hanya 3 layanan yang ditawarkan, 2026-10): data lengkap 4 layanan lama (termasuk ERP dan Mobile).
// Dipakai oleh `core-services-bento.tsx`; tidak dipakai di halaman. Teks 2 layanan yang tidak dipakai ada di sini.
import type { Locale } from '@/i18n/config';
import type { Localized } from '@/types/localized';

export type LegacyServiceLayout = 'wide' | 'lime' | 'half';

type Highlight = { title: string; description: string };

type LegacyServiceCopy = {
  badge: string;
  title: string;
  description: string;
  highlights: Highlight[];
  cardLink: string;
};

export type LegacyService = {
  slug: string;
  /** Nomor tampil di kartu, mis. "01". */
  index: string;
  indexLabel: string;
  layout: LegacyServiceLayout;
  techLine: string;
  copy: Localized<LegacyServiceCopy>;
};

export const LEGACY_SERVICES: readonly LegacyService[] = [
  {
    slug: 'custom-web-applications',
    index: '01',
    indexLabel: 'WEB CUSTOM',
    layout: 'wide',
    techLine: 'Laravel / Vue / React / Node.js',
    copy: {
      en: {
        badge: 'High Performance & Scalable',
        title: 'Custom Web Applications & Portals',
        description:
          'Engineering bespoke operational dashboards, customer portals, and distributed web platforms optimized for fast loading speeds, bulletproof data protection, and seamless API integrations.',
        highlights: [
          {
            title: 'API-First Design',
            description: 'Seamless cross-system & third-party connectivity.',
          },
          {
            title: 'Lightning Fast',
            description: 'Sub-second query times with scalable caching.',
          },
          {
            title: 'Multi-Device',
            description: 'Pixel-perfect layouts on desktop, tablet, and mobile.',
          },
        ],
        cardLink: 'Explore Custom Web',
      },
      id: {
        badge: 'Berkinerja Tinggi & Skalabel',
        title: 'Aplikasi Web Custom & Portal',
        description:
          'Merekayasa dasbor operasional, portal pelanggan, dan platform web terdistribusi yang dibuat khusus, dioptimalkan untuk kecepatan muat, perlindungan data yang kokoh, dan integrasi API yang mulus.',
        highlights: [
          {
            title: 'Desain API-First',
            description: 'Konektivitas lintas sistem & pihak ketiga yang mulus.',
          },
          {
            title: 'Sangat Cepat',
            description: 'Waktu kueri di bawah satu detik dengan caching skalabel.',
          },
          {
            title: 'Multi-Perangkat',
            description: 'Tata letak presisi di desktop, tablet, dan mobile.',
          },
        ],
        cardLink: 'Jelajahi Web Custom',
      },
    },
  },
  {
    slug: 'erp-systems',
    index: '02',
    indexLabel: 'SYSTEM ERP',
    layout: 'lime',
    techLine: 'Custom ERP & POS',
    copy: {
      en: {
        badge: 'Operational Efficiency',
        title: 'Management System & ERP',
        description:
          'Centralize stock inventory, sales workflows, invoicing, and cross-department collaboration within a unified monitoring dashboard.',
        highlights: [
          { title: 'Eliminate manual data entries & errors', description: '' },
          { title: 'Automated financial & audit reporting', description: '' },
          { title: 'Granular role-based divisional permissions', description: '' },
        ],
        cardLink: 'Explore ERP',
      },
      id: {
        badge: 'Efisiensi Operasional',
        title: 'Sistem Manajemen & ERP',
        description:
          'Pusatkan stok inventaris, alur penjualan, penagihan, dan kolaborasi antar departemen dalam satu dasbor pemantauan terpadu.',
        highlights: [
          { title: 'Hilangkan input data manual & kesalahan', description: '' },
          { title: 'Laporan keuangan & audit otomatis', description: '' },
          { title: 'Izin divisi berbasis peran yang terperinci', description: '' },
        ],
        cardLink: 'Jelajahi ERP',
      },
    },
  },
  {
    slug: 'mobile-app-development',
    index: '03',
    indexLabel: 'MOBILE APP',
    layout: 'half',
    techLine: 'Flutter / React Native / Kotlin',
    copy: {
      en: {
        badge: 'iOS & Android Native Performance',
        title: 'Mobile App Development',
        description:
          'Crafting high-engagement mobile applications using Flutter and React Native. Built with offline-first synchronization, real-time push messaging, biometric security, and native device hardware utilization.',
        highlights: [
          { title: 'Cross-Platform', description: 'Single codebase for iOS & Android' },
          { title: 'Offline Mode', description: 'Instant local caching & auto-sync' },
        ],
        cardLink: 'Discover Mobile Solutions',
      },
      id: {
        badge: 'Performa Native iOS & Android',
        title: 'Pengembangan Aplikasi Mobile',
        description:
          'Membuat aplikasi mobile ber-engagement tinggi dengan Flutter dan React Native. Dibangun dengan sinkronisasi offline-first, push messaging real-time, keamanan biometrik, dan pemanfaatan perangkat keras native.',
        highlights: [
          { title: 'Cross-Platform', description: 'Satu basis kode untuk iOS & Android' },
          { title: 'Mode Offline', description: 'Cache lokal instan & sinkronisasi otomatis' },
        ],
        cardLink: 'Temukan Solusi Mobile',
      },
    },
  },
  {
    slug: 'ui-ux-design',
    index: '04',
    indexLabel: 'UI UX DESIGN',
    layout: 'half',
    techLine: 'Figma / Research / Testing',
    copy: {
      en: {
        badge: 'User-Centric & Interactive',
        title: 'UI/UX Design & Prototyping',
        description:
          'Transforming complex business logic into intuitive user experiences. We deliver end-to-end design systems, wireframing, high-fidelity Figma prototypes, and validated usability testing.',
        highlights: [
          { title: 'Design Systems', description: 'Reusable components & brand kits' },
          { title: 'Interactive Prototypes', description: 'Figma click-through flows' },
        ],
        cardLink: 'Explore Design Services',
      },
      id: {
        badge: 'Berpusat pada Pengguna & Interaktif',
        title: 'Desain UI/UX & Prototyping',
        description:
          'Mengubah logika bisnis yang kompleks menjadi pengalaman pengguna yang intuitif. Kami menghadirkan design system end-to-end, wireframing, prototipe Figma beresolusi tinggi, dan pengujian usability tervalidasi.',
        highlights: [
          { title: 'Design System', description: 'Komponen yang dapat dipakai ulang & brand kit' },
          { title: 'Prototipe Interaktif', description: 'Alur click-through Figma' },
        ],
        cardLink: 'Jelajahi Layanan Desain',
      },
    },
  },
];

export function getLegacyService(slug: string): LegacyService | undefined {
  return LEGACY_SERVICES.find((service) => service.slug === slug);
}

export function getLegacyServiceCopy(service: LegacyService, locale: Locale): LegacyServiceCopy {
  return service.copy[locale];
}
