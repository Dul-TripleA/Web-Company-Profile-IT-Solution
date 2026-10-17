import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CheckBadge, CheckBullet } from '@/components/ui/check';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ArrowRightIcon } from '@/components/ui/icons';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';

type ApproachProps = { locale: Locale; dict: Dictionary['home']['approach'] };

export function Approach({ locale, dict }: ApproachProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Eyebrow>{dict.eyebrow}</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
            {dict.title}
          </h2>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-slate-500">{dict.intro}</p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-3xl border border-emerald-900/60 bg-forest-deep p-8 shadow-2xl transition-all duration-300 hover:border-emerald-800/80 sm:p-10 lg:col-span-8">
          <div>
            <div className="mb-6">
              <Badge className="backdrop-blur-sm">{dict.main.badge}</Badge>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand sm:text-3xl">
                {dict.main.title}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {dict.main.description}
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {dict.main.features.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-emerald-900/50 bg-forest/70 p-4 transition-all duration-300 hover:border-brand/40 hover:bg-forest"
                >
                  <div className="flex items-center gap-2">
                    <CheckBadge />
                    <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="mt-2 pl-7 text-xs leading-relaxed text-slate-300/80">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mt-8 border-t border-emerald-900/60" />
            <div className="mt-6 flex items-center justify-between">
              <Link
                href={localizedPath(locale, '/services/custom-web-applications')}
                className="group inline-flex items-center gap-2 text-sm font-bold text-brand transition-all duration-200 hover:text-brand-soft"
              >
                <span>{dict.main.link}</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex gap-6 lg:col-span-4">
          <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl bg-brand p-8 text-forest shadow-sm transition hover:shadow-md">
            <div className="relative z-10 space-y-4">
              <div>
                <Badge variant="forest" className="backdrop-blur-sm">
                  {dict.side.badge}
                </Badge>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-extrabold tracking-tight text-forest sm:text-2xl">
                  {dict.side.title}
                </h3>
                <p className="text-xs leading-relaxed font-medium text-forest/80 sm:text-sm">
                  {dict.side.description}
                </p>
              </div>

              <ul className="space-y-2 pt-2">
                {dict.side.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2.5 text-xs font-semibold text-forest sm:text-sm"
                  >
                    <CheckBullet />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 pt-6">
              <div className="mb-4 border-t border-forest/15" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-forest/70">{dict.side.footnote}</span>
                <Link
                  href={localizedPath(locale, '/services/erp-systems')}
                  className="group inline-flex items-center gap-1.5 text-xs font-extrabold text-forest hover:underline"
                >
                  <span>{dict.side.link}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/25 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
