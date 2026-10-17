import type { Localized } from '@/types/localized';

// Testimoni dan foto masih placeholder dari template. Jangan dipublikasikan sebagai asli
// sebelum dikonfirmasi pemilik repo.
export type Review = {
  id: string;
  name: string;
  avatar: string;
  featured: boolean;
  copy: Localized<{ quote: string; role: string }>;
};

export const REVIEWS: readonly Review[] = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    avatar: '/images/avatar-sarah.jpg',
    featured: false,
    copy: {
      en: {
        quote:
          'Do It revolutionized our operational efficiency. The custom ERP system they engineered replaced three disconnected software tools and eliminated manual data duplication entirely.',
        role: 'COO — Nexus Logistics',
      },
      id: {
        quote:
          'Do It merevolusi efisiensi operasional kami. Sistem ERP custom buatan mereka menggantikan tiga perangkat lunak yang tidak terhubung dan menghapus duplikasi data manual sepenuhnya.',
        role: 'COO — Nexus Logistics',
      },
    },
  },
  {
    id: 'david-pratama',
    name: 'David Pratama',
    avatar: '/images/avatar-david.jpg',
    featured: true,
    copy: {
      en: {
        quote:
          'Their technical competence in building high-throughput web applications is unmatched. Our customer portal now seamlessly handles thousands of concurrent transactions with zero downtime.',
        role: 'VP of Engineering — FinFlow',
      },
      id: {
        quote:
          'Kompetensi teknis mereka dalam membangun aplikasi web berthroughput tinggi tak tertandingi. Portal pelanggan kami kini menangani ribuan transaksi bersamaan dengan lancar tanpa downtime.',
        role: 'VP Engineering — FinFlow',
      },
    },
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    avatar: '/images/avatar-elena.jpg',
    featured: false,
    copy: {
      en: {
        quote:
          'The agile sprint process was transparent and disciplined. They delivered our cross-platform mobile application two weeks ahead of schedule with flawless UI/UX execution.',
        role: 'Product Director — SmartHealth',
      },
      id: {
        quote:
          'Proses sprint agile mereka transparan dan disiplin. Mereka menyerahkan aplikasi mobile lintas platform kami dua minggu lebih cepat dari jadwal dengan eksekusi UI/UX yang sempurna.',
        role: 'Direktur Produk — SmartHealth',
      },
    },
  },
];
