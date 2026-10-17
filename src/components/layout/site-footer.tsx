import Link from 'next/link';
import { FOOTER_SOCIALS, SITE } from '@/content/site';
import { LayersIcon } from '@/components/ui/icons';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary['footer'] }) {
  const links = [
    { label: dict.links.home, href: localizedPath(locale) },
    { label: dict.links.services, href: `${localizedPath(locale)}#services` },
    { label: dict.links.workflow, href: `${localizedPath(locale)}#workflow` },
    { label: dict.links.reviews, href: `${localizedPath(locale)}#reviews` },
    { label: dict.links.contact, href: localizedPath(locale, '/contact') },
  ];
  const legal = [dict.legal.privacy, dict.legal.terms, dict.legal.security];

  return (
    <footer className="border-t border-emerald-950/70 bg-forest-deep px-6 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-emerald-950/60 pb-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-forest shadow-sm">
                <LayersIcon className="h-4 w-4" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">{SITE.name}</span>
            </div>
            <span className="hidden text-emerald-900 sm:inline" aria-hidden="true">
              •
            </span>
            <p className="text-xs text-slate-400">{dict.tagline}</p>
          </div>

          <nav aria-label={dict.navigation}>
            <ul className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            {FOOTER_SOCIALS.map((social) => (
              <a
                key={social.id}
                href={social.url}
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-900/60 bg-forest text-xs text-slate-300 transition-all hover:border-brand/50 hover:text-brand"
              >
                {social.text}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>
            © {SITE.copyrightYear} {SITE.legalName}. {dict.rights}
          </p>
          <ul className="flex items-center gap-5 text-xs">
            {legal.map((label, index) => (
              <li key={label} className="flex items-center gap-5">
                {index > 0 ? <span aria-hidden="true">•</span> : null}
                <span className="cursor-default transition-colors hover:text-slate-300">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
