import { Reveal } from '@/components/shared/reveal';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button-link';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SERVICES, getService, getServiceCopy } from '@/content/services';
import { LOCALES, hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SERVICES.map((service) => ({ locale, slug: service.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!hasLocale(locale) || !service) return {};
  const copy = getServiceCopy(service, locale);
  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: `${copy.title} | Do It`,
    description: copy.description,
  });
}

export default async function ServiceDetailPage({
  params,
}: PageProps<'/[locale]/services/[slug]'>) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!hasLocale(locale) || !service) notFound();

  const dict = await getDictionary(locale);
  const detail = dict.pages.serviceDetail;
  const copy = getServiceCopy(service, locale);
  const others = SERVICES.filter((item) => item.slug !== slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: detail.breadcrumbServices, path: '/services' },
          { name: copy.title, path: `/services/${slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd(locale, {
          name: copy.title,
          description: copy.description,
          path: `/services/${slug}`,
        })}
      />
      <PageHero
        eyebrow={detail.eyebrow}
        title={copy.title}
        description={copy.description}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: detail.breadcrumbServices, href: localizedPath(locale, '/services') },
          { label: copy.title },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl sm:p-10 lg:col-span-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-brand sm:text-3xl">
              {detail.scope}
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {copy.scope}
            </p>
          </div>

          <aside className="flex flex-col justify-between gap-8 rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl lg:col-span-4">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{detail.ctaTitle}</h2>
              <p className="text-xs leading-relaxed text-slate-400">{detail.ctaDescription}</p>
              <ButtonLink href={localizedPath(locale, '/contact')}>
                {dict.common.freeConsultation}
              </ButtonLink>
            </div>
          </aside>
        </Reveal>

        <div className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight text-forest">
            {detail.otherServices}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={localizedPath(locale, `/services/${item.slug}`)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-brand hover:shadow-md"
                >
                  <span>{getServiceCopy(item, locale).title}</span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
