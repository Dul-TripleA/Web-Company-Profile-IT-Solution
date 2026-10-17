import Link from 'next/link';
import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/eyebrow';

export type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: Crumb[];
  children?: ReactNode;
};

// Hero halaman dalam. Tidak ada di template Blade; memakai pola hero (latar forest, glow lime).
export function PageHero({ eyebrow, title, description, breadcrumb, children }: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-forest px-6 pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-5">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              {breadcrumb.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-brand">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Eyebrow tone="light">{eyebrow}</Eyebrow>
        <h1 className="max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
