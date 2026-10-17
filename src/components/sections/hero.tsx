import { ButtonLink } from '@/components/ui/button-link';
import { PhoneIcon } from '@/components/ui/icons';
import { SITE } from '@/content/site';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import Image from 'next/image';

type HeroProps = { locale: Locale; dict: Dictionary };

export function Hero({ locale, dict }: HeroProps) {
  const hero = dict.home.hero;

  return (
    <section className="relative flex min-h-[600px] w-full items-center overflow-hidden bg-forest lg:h-[750px]">
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src="/images/hero-3.jpg"
          alt={hero.imageAlt}
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-contain object-right"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-forest via-forest via-45% to-transparent" />

      <div className="relative z-20 flex w-full items-center px-6 py-16 pt-36 sm:px-12 sm:py-24 sm:pt-44 lg:pl-16 xl:pl-24">
        <div className="w-full space-y-6 text-left">
          {/* DISEMBUNYIKAN (belum ada ulasan nyata, 2026-10): badge rating. Kunci kamus `hero.rating` dipertahankan.
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">
            <span className="font-bold">4.9</span>
            <div role="img" aria-label={dict.common.ratingLabel} className="flex text-brand">
              ★★★★★
            </div>
            <span className="text-slate-300">{hero.rating}</span>
          </div>
          */}

          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-white uppercase sm:text-5xl lg:text-6xl">
            {hero.titleLine1} <br /> {hero.titleLine2}{' '}
            <span className="text-brand">{hero.titleHighlight}</span>
          </h1>

          <p className="max-w-3xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            {/* DISEMBUNYIKAN (deskripsi baru tidak diawali nama merek): <span className="font-bold text-brand">{hero.brand} </span> */}
            {hero.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ButtonLink href={localizedPath(locale, '/contact')}>
              {dict.common.freeConsultation}
            </ButtonLink>

            <a href={SITE.phoneHref} className="flex items-center gap-3 pl-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700/50 bg-emerald-900/60 text-brand">
                <PhoneIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold tracking-wider text-slate-300/80 uppercase">
                  {dict.common.callUs}
                </span>
                <span className="text-xs font-bold text-white">{SITE.phone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
