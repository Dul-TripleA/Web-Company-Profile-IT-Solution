import { Reveal } from '@/components/shared/reveal';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { Approach } from '@/components/sections/approach';
import { CoreServices } from '@/components/sections/core-services';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button-link';
import { Eyebrow } from '@/components/ui/eyebrow';
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

// Bagian Tim belum ada (belum ada nama/foto asli); lihat docs/features/3_ABOUT_SERVICES.md.
export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const about = dict.pages.about;
  const cta = dict.home.workflow.cta;

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

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <Eyebrow>{about.introEyebrow}</Eyebrow>
            <h2 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
              {about.introTitle}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:col-span-7">
            {about.introBody}
          </p>
        </Reveal>
      </section>

      <CoreServices locale={locale} dict={dict.home.services} learnMore={dict.common.learnMore} />
      <Approach dict={dict.home.approach} />

      <section className="bg-forest-deep px-6 py-20">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl border border-emerald-900/60 bg-linear-to-r from-forest via-forest-deep to-forest p-8 shadow-2xl md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-bold text-white">{cta.title}</h2>
            <p className="text-xs text-slate-400">{cta.description}</p>
          </div>
          <ButtonLink href={localizedPath(locale, '/contact')}>
            {dict.common.startFreeConsultation}
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
