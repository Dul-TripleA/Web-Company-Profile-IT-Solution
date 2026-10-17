import { RevealItem, RevealList } from '@/components/shared/reveal';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { PageHero } from '@/components/sections/page-hero';
import { JsonLd } from '@/components/shared/json-ld';
import { ArrowRightIcon } from '@/components/ui/icons';
import { getPublishedProjects } from '@/features/portfolio/queries';
import { hasLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/portfolio'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { pages } = await getDictionary(locale);
  await connection();
  const projects = await getPublishedProjects(locale);
  return buildMetadata({
    locale,
    path: '/portfolio',
    title: pages.portfolio.metaTitle,
    description: pages.portfolio.metaDescription,
    // Selama semua proyek masih contoh, halaman tidak diindeks.
    noindex: projects.every((project) => project.isSample),
  });
}

export default async function PortfolioPage({ params }: PageProps<'/[locale]/portfolio'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const copy = dict.pages.portfolio;
  // Data dari database (dikelola di /admin), dibaca saat request.
  await connection();
  const projects = await getPublishedProjects(locale);
  const hasSamples = projects.some((project) => project.isSample);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: dict.nav.home, path: '/' },
          { name: dict.nav.portfolio, path: '/portfolio' },
        ])}
      />
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        breadcrumb={[
          { label: dict.nav.home, href: localizedPath(locale) },
          { label: dict.nav.portfolio },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        {hasSamples ? (
          <p className="mb-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
            {copy.sampleNotice}
          </p>
        ) : null}

        {projects.length === 0 ? (
          <p className="text-slate-700">{copy.empty}</p>
        ) : (
          <RevealList className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              return (
                <RevealItem key={project.slug}>
                  <Link
                    href={localizedPath(locale, `/portfolio/${project.slug}`)}
                    className="group flex h-full flex-col justify-between rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl transition-all duration-300 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-slate-300">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {project.isSample ? (
                          <span className="rounded-full border border-brand/40 px-3 py-1 text-[0.65rem] font-bold text-brand">
                            {copy.sampleBadge}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-brand">
                        {project.title}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">
                        {project.summary}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-emerald-900/60 px-3 py-1 text-[0.7rem] text-slate-300"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-brand">
                      {copy.viewCase}
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealList>
        )}
      </section>
    </>
  );
}
