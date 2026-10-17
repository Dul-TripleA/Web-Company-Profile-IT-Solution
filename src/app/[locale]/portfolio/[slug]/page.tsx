import { Reveal } from '@/components/shared/reveal';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { PageHero } from '@/components/sections/page-hero';
import { JsonLd } from '@/components/shared/json-ld';
import { ButtonLink } from '@/components/ui/button-link';
import { ArrowRightIcon } from '@/components/ui/icons';
import { getService, getServiceCopy } from '@/content/services';
import { getPublishedProject, getPublishedProjects } from '@/features/portfolio/queries';
import { LOCALES, hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/portfolio/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  await connection();
  const project = await getPublishedProject(locale, slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: `${project.title} | Do It`,
    description: project.summary,
    noindex: project.isSample,
    translations: LOCALES.every((item) => project.locales.includes(item)),
  });
}

export default async function PortfolioDetailPage({
  params,
}: PageProps<'/[locale]/portfolio/[slug]'>) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  await connection();
  const project = await getPublishedProject(locale, slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const detail = dict.pages.portfolioDetail;
  const copy = project;
  const service = getService(project.serviceSlug);
  const serviceTitle = service ? getServiceCopy(service, locale).title : null;
  const others = (await getPublishedProjects(locale)).filter((item) => item.slug !== slug);

  const sections = [
    { title: detail.problem, body: copy.problem },
    { title: detail.solution, body: copy.solution },
    { title: detail.result, body: copy.result },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: detail.breadcrumbPortfolio, path: '/portfolio' },
          { name: copy.title, path: `/portfolio/${slug}` },
        ])}
      />
      <PageHero
        eyebrow={detail.eyebrow}
        title={copy.title}
        description={copy.summary}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: detail.breadcrumbPortfolio, href: localizedPath(locale, '/portfolio') },
          { label: copy.title },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        {project.isSample ? (
          <p className="mb-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
            {detail.sampleNotice}
          </p>
        ) : null}

        <Reveal className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="space-y-8 rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl sm:p-10 lg:col-span-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-extrabold tracking-tight text-brand">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <aside className="flex flex-col gap-8 rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl lg:col-span-4">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold text-slate-300">{detail.client}</dt>
                <dd className="text-white">{copy.client}</dd>
              </div>
              {serviceTitle ? (
                <div>
                  <dt className="text-xs font-semibold text-slate-300">{detail.service}</dt>
                  <dd>
                    <Link
                      href={localizedPath(locale, `/services/${project.serviceSlug}`)}
                      className="text-white underline underline-offset-4 hover:text-brand"
                    >
                      {serviceTitle}
                    </Link>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold text-slate-300">{detail.techStack}</dt>
                <dd>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-emerald-900/60 px-3 py-1 text-[0.7rem] text-slate-300"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <div className="space-y-4 border-t border-emerald-900/60 pt-6">
              <h2 className="text-lg font-bold text-white">{detail.ctaTitle}</h2>
              <p className="text-xs leading-relaxed text-slate-300">{detail.ctaDescription}</p>
              <ButtonLink href={localizedPath(locale, '/contact')}>
                {dict.common.freeConsultation}
              </ButtonLink>
            </div>
          </aside>
        </Reveal>

        {others.length > 0 ? (
          <div className="mt-14">
            <h2 className="text-xl font-extrabold tracking-tight text-forest">
              {detail.otherProjects}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={localizedPath(locale, `/portfolio/${item.slug}`)}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-brand hover:shadow-md"
                  >
                    <span>{item.title}</span>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </>
  );
}
