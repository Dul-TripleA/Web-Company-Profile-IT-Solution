import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeftIcon } from './icons';

type PageHeaderProps = {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
};

/** Judul halaman admin di kiri, aksi di kanan (turun ke bawah judul di ponsel). */
export function PageHeader({ title, description, back, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {back ? (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-forest"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
