import { TOP_BAR_SOCIALS, SITE } from '@/content/site';
import type { Dictionary } from '@/i18n/get-dictionary';
import { CircleCheckIcon, MailIcon } from '@/components/ui/icons';

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
            {dict.tagline}
          </span>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:underline">
            <MailIcon className="h-4 w-4 shrink-0" />
            {SITE.email}
          </a>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span>{dict.followUs}</span>
          {TOP_BAR_SOCIALS.map((social) => (
            <a
              key={social.id}
              href={social.url}
              aria-label={social.label}
              className="transition hover:opacity-75"
            >
              {social.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
