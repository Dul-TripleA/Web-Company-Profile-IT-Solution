import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { CoreServices } from '@/components/sections/core-services';
import { PageHero } from '@/components/sections/page-hero';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { pages } = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/services',
    title: pages.services.metaTitle,
    description: pages.services.metaDescription,
  });
}

export default async function ServicesPage({ params }: PageProps<'/[locale]/services'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const copy = dict.pages.services;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: dict.nav.services, path: '/services' },
        ])}
      />
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: dict.nav.services },
        ]}
      />
      <CoreServices
        locale={locale}
        dict={dict.home.services}
        learnMore={dict.common.learnMore}
        showHeader={false}
      />
    </>
  );
}
