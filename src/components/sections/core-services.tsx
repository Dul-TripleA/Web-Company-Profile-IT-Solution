import Link from 'next/link';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SERVICES, getServiceCopy } from '@/content/services';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';

type CoreServicesProps = {
  locale: Locale;
  dict: Dictionary['home']['services'];
  learnMore: string;
  /** Sembunyikan header section (mis. di halaman /services yang sudah punya hero). */
  showHeader?: boolean;
};

// Versi bento lama (kartu lebar/lime/setengah, 4 layanan) ada di `core-services-bento.tsx` (disembunyikan).
export function CoreServices({ locale, dict, learnMore, showHeader = true }: CoreServicesProps) {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden bg-forest-deep px-6 py-24 text-white"
    >
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 -bottom-32 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {showHeader ? (
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-3">
              <Eyebrow tone="light">{dict.eyebrow}</Eyebrow>
              <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {dict.titleBefore} <span className="text-brand">{dict.titleHighlight}</span>{' '}
                {dict.titleAfter}
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
              {dict.intro}
            </p>
          </div>
        ) : (
          <h2 className="sr-only">
            {dict.titleBefore} {dict.titleHighlight} {dict.titleAfter}
          </h2>
        )}

        <ul className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const copy = getServiceCopy(service, locale);
            return (
              <li
                key={service.slug}
                className="flex flex-col justify-between rounded-3xl border border-emerald-900/60 bg-forest/80 p-8 shadow-2xl transition-all duration-300 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)]"
              >
                <div>
                  <span className="font-mono text-xs text-slate-400">
                    {service.index} / {service.indexLabel}
                  </span>
                  <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-brand">
                    {copy.title}
                  </h3>
                  <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {copy.description}
                  </p>
                  <div className="mt-6 rounded-2xl border border-emerald-900/50 bg-forest-deep/70 p-4">
                    <span className="block text-xs font-bold text-white">{dict.scopeLabel}</span>
                    <span className="text-[11px] leading-relaxed text-slate-400">{copy.scope}</span>
                  </div>
                </div>

                <div className="mt-8 border-t border-emerald-900/60 pt-6">
                  <Link
                    href={localizedPath(locale, `/services/${service.slug}`)}
                    className="group inline-flex items-center gap-2 text-xs font-bold text-brand transition-colors hover:text-brand-soft sm:text-sm"
                  >
                    <span>{learnMore}</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
