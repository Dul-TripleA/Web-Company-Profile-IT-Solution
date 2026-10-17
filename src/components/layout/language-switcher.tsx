'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, localizedPath, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = { locale: Locale; label: string; className?: string };

export function LanguageSwitcher({ locale, label, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/[^/]+/, '') || '/';

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'flex items-center gap-0.5 rounded-full border border-white/15 bg-white/5 p-0.5 text-[11px] font-bold',
        className,
      )}
    >
      {LOCALES.map((item) => (
        <Link
          key={item}
          href={localizedPath(item, pathWithoutLocale)}
          lang={item}
          hrefLang={item}
          aria-current={item === locale ? 'true' : undefined}
          className={cn(
            'rounded-full px-2.5 py-1 uppercase transition-colors',
            item === locale ? 'bg-brand text-forest' : 'text-slate-300 hover:text-brand',
          )}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
