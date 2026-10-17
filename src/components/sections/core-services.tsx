import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CheckBadge, CheckBullet } from '@/components/ui/check';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SERVICES, getServiceCopy, type Service } from '@/content/services';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { cn } from '@/lib/utils';

type CoreServicesProps = {
  locale: Locale;
  dict: Dictionary['home']['services'];
  /** Sembunyikan header section (mis. di halaman /services yang sudah punya hero). */
  showHeader?: boolean;
};

const DARK_CARD =
  'flex flex-col justify-between rounded-3xl border border-emerald-900/60 bg-forest/80 p-8 shadow-2xl transition-all duration-300 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)] sm:p-10';

function CardLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-xs font-bold text-brand transition-colors hover:text-brand-soft sm:text-sm"
    >
      <span>{children}</span>
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
    </Link>
  );
}

function ServiceCardHeader({ service, children }: { service: Service; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {children}
      <span className="font-mono text-xs text-slate-400">
        {service.index} / {service.indexLabel}
      </span>
    </div>
  );
}

function WideCard({ service, locale }: { service: Service; locale: Locale }) {
  const copy = getServiceCopy(service, locale);
  return (
    <div className={cn(DARK_CARD, 'lg:col-span-8')}>
      <div>
        <ServiceCardHeader service={service}>
          <Badge>{copy.badge}</Badge>
        </ServiceCardHeader>

        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold tracking-tight text-brand sm:text-3xl">
            {copy.title}
          </h3>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            {copy.description}
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {copy.highlights.map((highlight) => (
            <li
              key={highlight.title}
              className="rounded-2xl border border-emerald-900/50 bg-forest-deep/70 p-4 transition-all duration-300 hover:border-brand/40"
            >
              <div className="flex items-center gap-2">
                <CheckBadge />
                <h4 className="text-xs font-semibold text-white sm:text-sm">{highlight.title}</h4>
              </div>
              <p className="mt-2 pl-7 text-[11px] leading-relaxed text-slate-400">
                {highlight.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-emerald-900/60 pt-6">
        <CardLink href={localizedPath(locale, `/services/${service.slug}`)}>
          {copy.cardLink}
        </CardLink>
        <span className="text-[11px] text-slate-400">{service.techLine}</span>
      </div>
    </div>
  );
}

function LimeCard({ service, locale }: { service: Service; locale: Locale }) {
  const copy = getServiceCopy(service, locale);
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-brand p-8 text-forest shadow-sm transition hover:shadow-xl lg:col-span-4">
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="forest" className="font-bold">
            {copy.badge}
          </Badge>
          <span className="font-mono text-xs font-bold text-forest/70">
            {service.index} / {service.indexLabel}
          </span>
        </div>

        <div>
          <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-forest">{copy.title}</h3>
          <p className="text-xs leading-relaxed font-medium text-forest/80 sm:text-sm">
            {copy.description}
          </p>
        </div>

        <ul className="space-y-2 pt-2">
          {copy.highlights.map((highlight) => (
            <li
              key={highlight.title}
              className="flex items-center gap-2.5 text-xs font-semibold text-forest"
            >
              <CheckBullet />
              <span>{highlight.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 pt-6">
        <div className="mb-4 border-t border-forest/15" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-forest/70">{service.techLine}</span>
          <Link
            href={localizedPath(locale, `/services/${service.slug}`)}
            className="group inline-flex items-center gap-1.5 text-xs font-extrabold text-forest hover:underline"
          >
            <span>{copy.cardLink}</span>
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/25 blur-xl" />
    </div>
  );
}

function HalfCard({ service, locale }: { service: Service; locale: Locale }) {
  const copy = getServiceCopy(service, locale);
  return (
    <div className={DARK_CARD}>
      <div>
        <ServiceCardHeader service={service}>
          <Badge>{copy.badge}</Badge>
        </ServiceCardHeader>

        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {copy.title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{copy.description}</p>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3">
          {copy.highlights.map((highlight) => (
            <li
              key={highlight.title}
              className="rounded-2xl border border-emerald-900/50 bg-forest-deep/70 p-3.5"
            >
              <span className="block text-xs font-bold text-white">{highlight.title}</span>
              <span className="text-[11px] text-slate-400">{highlight.description}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-emerald-900/60 pt-6">
        <CardLink href={localizedPath(locale, `/services/${service.slug}`)}>
          {copy.cardLink}
        </CardLink>
        <span className="text-[11px] text-slate-400">{service.techLine}</span>
      </div>
    </div>
  );
}

function ServiceCard({ service, locale }: { service: Service; locale: Locale }) {
  if (service.layout === 'wide') return <WideCard service={service} locale={locale} />;
  if (service.layout === 'lime') return <LimeCard service={service} locale={locale} />;
  return <HalfCard service={service} locale={locale} />;
}

export function CoreServices({ locale, dict, showHeader = true }: CoreServicesProps) {
  const topRow = SERVICES.filter((service) => service.layout !== 'half');
  const bottomRow = SERVICES.filter((service) => service.layout === 'half');

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
                {dict.titleBefore ? `${dict.titleBefore} ` : null}
                <span className="text-brand">{dict.titleHighlight}</span> {dict.titleAfter}
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
              {dict.intro}
            </p>
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {topRow.map((service) => (
            <ServiceCard key={service.slug} service={service} locale={locale} />
          ))}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {bottomRow.map((service) => (
            <ServiceCard key={service.slug} service={service} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
