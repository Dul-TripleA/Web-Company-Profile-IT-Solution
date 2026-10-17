import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/sections/page-hero';
import { Workflow } from '@/components/sections/workflow';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { pages } = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/about',
    title: pages.about.metaTitle,
    description: pages.about.metaDescription,
  });
}

// Konten About resmi belum ada (docs/features/3_ABOUT_SERVICES.md). Sementara dirakit dari
// section landing page yang sudah ada.
export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const about = dict.pages.about;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: about.eyebrow, path: '/about' },
        ])}
      />
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        description={about.description}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: about.eyebrow },
        ]}
      />
      <WhyChooseUs locale={locale} dict={dict.home.why} />
      <Workflow
        locale={locale}
        dict={dict.home.workflow}
        ctaLabel={dict.common.startFreeConsultation}
      />
    </>
  );
}
