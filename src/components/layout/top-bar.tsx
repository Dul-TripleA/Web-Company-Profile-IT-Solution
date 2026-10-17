// DISEMBUNYIKAN (email masih placeholder, 2026-10): impor untuk blok email di bawah.
// import { SITE } from '@/content/site';
// DISEMBUNYIKAN (belum punya akun sosial, 2026-10): impor untuk blok sosial di bawah.
// import { TOP_BAR_SOCIALS } from '@/content/site';
import type { Dictionary } from '@/i18n/get-dictionary';
import { CircleCheckIcon } from '@/components/ui/icons';
// import { MailIcon } from '@/components/ui/icons';
// import { SocialIcon } from '@/components/ui/social-icon';

export function TopBar({ dict }: { dict: Dictionary['topBar'] }) {
  return (
    <div
      id="top-bar"
      className="relative z-50 bg-brand px-4 py-2 text-xs font-semibold text-on-brand transition-all duration-300 sm:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 md:flex-row">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-6">
          <span className="flex items-center gap-1.5">
            <CircleCheckIcon className="h-4 w-4 shrink-0" />
            {/* DISEMBUNYIKAN (klaim "terbaik" tanpa bukti, 2026-10): "We are one of the best software houses in Indonesia." */}
            {dict.tagline}
          </span>
          {/* DISEMBUNYIKAN (email masih placeholder, 2026-10): email di top bar. Data `SITE.email` dipertahankan.
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:underline">
            <MailIcon className="h-4 w-4 shrink-0" />
            {SITE.email}
          </a>
          */}
        </div>
        {/* DISEMBUNYIKAN (belum punya akun sosial, 2026-10): label "Follow Us" dan ikon sosial. Kunci kamus `followUs` dan data `TOP_BAR_SOCIALS` dipertahankan.
        <div className="flex items-center gap-4 text-xs font-bold">
          <span>{dict.followUs}</span>
          {TOP_BAR_SOCIALS.map((social) => (
            <a
              key={social.id}
              href={social.url}
              aria-label={social.label}
              className="inline-flex min-h-6 min-w-6 items-center justify-center transition hover:opacity-75"
            >
              <SocialIcon id={social.id} className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
        */}
      </div>
    </div>
  );
}
