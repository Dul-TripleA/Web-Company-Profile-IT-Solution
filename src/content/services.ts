import type { Locale } from '@/i18n/config';
import type { Localized } from '@/types/localized';

// Layanan yang ditawarkan. Data 4 layanan lama (termasuk ERP dan Mobile) ada di `services-hidden.ts`.
type ServiceCopy = {
  title: string;
  description: string;
  /** Cakupan pekerjaan, satu kalimat tanpa awalan "Cakupan:". */
  scope: string;
};

export type Service = {
  slug: string;
  /** Nomor tampil di kartu, mis. "01". */
  index: string;
  indexLabel: string;
  copy: Localized<ServiceCopy>;
};

export const SERVICES: readonly Service[] = [
  {
    slug: 'web-development',
    index: '01',
    indexLabel: 'WEB',
    copy: {
      en: {
        title: 'Web Development',
        description:
          'We build responsive websites tailored to your business needs, from company profiles and landing pages to web-based business platforms.',
        scope: 'Company profiles, landing pages, and business websites.',
      },
      id: {
        title: 'Web Development',
        description:
          'Kami membangun website responsif yang disesuaikan dengan kebutuhan bisnis Anda, mulai dari company profile dan landing page hingga platform bisnis berbasis web.',
        scope: 'Company profile, landing page, dan website bisnis.',
      },
    },
  },
  {
    slug: 'custom-software-development',
    index: '02',
    indexLabel: 'SOFTWARE',
    copy: {
      en: {
        title: 'Custom Software Development',
        description:
          'We develop software solutions designed around your workflows, helping you manage business processes through applications built for your specific requirements.',
        scope: 'Internal web applications, dashboards, and business operations systems.',
      },
      id: {
        title: 'Custom Software Development',
        description:
          'Kami mengembangkan solusi software yang dirancang mengikuti alur kerja Anda, membantu mengelola proses bisnis lewat aplikasi yang dibuat untuk kebutuhan spesifik Anda.',
        scope: 'Aplikasi web internal, dashboard, dan sistem operasional bisnis.',
      },
    },
  },
  {
    slug: 'ui-ux-design',
    index: '03',
    indexLabel: 'UI UX',
    copy: {
      en: {
        title: 'UI/UX Design',
        description:
          'We design intuitive user interfaces and user experiences that make digital products easier to understand and use.',
        scope: 'Wireframes, user flows, and interface design for applications or websites.',
      },
      id: {
        title: 'UI/UX Design',
        description:
          'Kami merancang antarmuka dan pengalaman pengguna yang intuitif agar produk digital lebih mudah dipahami dan digunakan.',
        scope: 'Wireframe, user flow, dan desain antarmuka aplikasi atau website.',
      },
    },
  },
];

export const SERVICE_SLUGS = SERVICES.map((service) => service.slug);

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getServiceCopy(service: Service, locale: Locale): ServiceCopy {
  return service.copy[locale];
}
