import { Reveal, RevealItem, RevealList } from '@/components/shared/reveal';
import Image from 'next/image';
// DISEMBUNYIKAN (statistik, kartu "10K+", dan daftar 6 poin tidak dipakai, 2026-10): impor ikon dan STAT_ICONS di bawah.
// import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/button-link';
import { CheckBullet } from '@/components/ui/check';
import { Eyebrow } from '@/components/ui/eyebrow';
// import { CheckIcon, CubeIcon, GlobeIcon, ShieldCheckIcon, UsersIcon } from '@/components/ui/icons';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';

type WhyChooseUsProps = { locale: Locale; dict: Dictionary['home']['why'] };

// const STAT_ICONS: ReactNode[] = [
//   <UsersIcon key="users" className="h-5 w-5" />,
//   <GlobeIcon key="globe" className="h-5 w-5" />,
//   <CubeIcon key="cube" className="h-5 w-5" />,
//   <ShieldCheckIcon key="shield" className="h-5 w-5" />,
// ];

export function WhyChooseUs({ locale, dict }: WhyChooseUsProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <Reveal className="grid grid-cols-2 gap-4 lg:col-span-6">
          <div className="relative col-span-2 h-56 overflow-hidden rounded-3xl shadow-sm">
            <Image
              src="/images/team-meeting.jpg"
              alt={dict.imageAlts.meeting}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>

          {/* DISEMBUNYIKAN (klaim "10K+ pekerjaan" tanpa data, 2026-10): kartu lime statistik.
          <div className="flex flex-col justify-between rounded-3xl bg-brand p-6">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-brand">
              <CheckIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="mt-4 block text-2xl font-black text-forest">
                {dict.completed.value}
              </span>
              <p className="mt-1 text-[11px] leading-tight font-semibold text-forest/80">
                {dict.completed.label}
              </p>
            </div>
          </div>
          */}

          <div className="relative col-span-2 h-56 overflow-hidden rounded-3xl shadow-sm">
            <Image
              src="/images/collaboration.jpg"
              alt={dict.imageAlts.collaboration}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-[50%_28%]"
            />
          </div>
        </Reveal>

        <Reveal className="space-y-8 lg:col-span-6" delay={0.1}>
          <div className="space-y-4">
            <Eyebrow>{dict.eyebrow}</Eyebrow>

            <h2 className="text-3xl leading-[1.15] font-black tracking-tight text-forest sm:text-4xl lg:text-5xl">
              {dict.titleBefore}{' '}
              <span className="text-brand-ink underline decoration-brand/40 underline-offset-8">
                {dict.titleHighlight}
              </span>
            </h2>

            <p className="max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              {dict.description}
            </p>
          </div>

          {/* DISEMBUNYIKAN (statistik klien/wilayah/proyek/kepuasan tanpa data, 2026-10): kunci kamus `stats` dipertahankan.
          <ul className="grid grid-cols-2 gap-4 border-y border-emerald-950/10 py-2 sm:grid-cols-4">
            {dict.stats.map((stat, index) => (
              <li key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/25 text-forest">
                  {STAT_ICONS[index]}
                </div>
                <div>
                  <span className="block text-base leading-none font-black text-forest">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{stat.label}</span>
                </div>
              </li>
            ))}
          </ul>
          */}

          {/* DISEMBUNYIKAN (diganti 3 komitmen, 2026-10): daftar 6 poin nilai. Kunci kamus `values` dipertahankan.
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {dict.values.map((value) => (
              <li key={value} className="flex items-center gap-2.5">
                <CheckBullet />
                <span className="text-xs font-semibold text-slate-800">{value}</span>
              </li>
            ))}
          </ul>
          */}

          <RevealList className="space-y-5">
            {dict.commitments.map((item) => (
              <RevealItem key={item.title} className="flex items-start gap-3">
                <CheckBullet className="mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-forest">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealList>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ButtonLink variant="solid" href={localizedPath(locale, '/contact')}>
              {dict.primaryCta}
            </ButtonLink>
            {/* DISEMBUNYIKAN (belum ada portofolio, 2026-10): tombol "View Our Portfolio". Kunci kamus `secondaryCta` dipertahankan.
            <ButtonLink variant="outline" href={localizedPath(locale, '/services')}>
              {dict.secondaryCta}
            </ButtonLink>
            */}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
