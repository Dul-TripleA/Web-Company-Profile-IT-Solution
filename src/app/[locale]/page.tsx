import { Approach } from '@/components/sections/approach';
import { CoreServices } from '@/components/sections/core-services';
import { Hero } from '@/components/sections/hero';
// DISEMBUNYIKAN (belum ada testimoni asli, 2026-10): import dan pemakaian Reviews.
// import { Reviews } from '@/components/sections/reviews';
import { TechStack } from '@/components/sections/tech-stack';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { Workflow } from '@/components/sections/workflow';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/',
    title: dict.meta.title,
    description: dict.meta.description,
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Approach dict={dict.home.approach} />
      <WhyChooseUs locale={locale} dict={dict.home.why} />
      <CoreServices locale={locale} dict={dict.home.services} learnMore={dict.common.learnMore} />
      <TechStack dict={dict.home.tech} />
      <Workflow
        locale={locale}
        dict={dict.home.workflow}
        ctaLabel={dict.common.startFreeConsultation}
      />
      {/* DISEMBUNYIKAN (belum ada testimoni asli, 2026-10): <Reviews locale={locale} dict={dict} /> */}
    </>
  );
}
