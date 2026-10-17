'use client';

import { BOUNDARY_COPY } from '@/i18n/boundary-copy';
import { DEFAULT_LOCALE, LOCALES, localizedPath } from '@/i18n/config';
import './globals.css';

type GlobalErrorProps = { error: unknown; retry: () => void };

// Menggantikan layout bila layout itu sendiri gagal, jadi harus membawa <html> dan <body>.
// Locale tidak diketahui di sini, sehingga teks ditampilkan dalam dua bahasa.
export default function GlobalError({ retry }: GlobalErrorProps) {
  const copy = BOUNDARY_COPY[DEFAULT_LOCALE];

  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <main className="flex min-h-screen items-center bg-forest px-6 py-20">
          <div className="mx-auto w-full max-w-3xl space-y-6">
            <p aria-hidden="true" className="font-mono text-7xl font-black text-brand">
              500
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {copy.errorTitle}
              <span className="block text-xl font-semibold text-slate-300 sm:text-2xl">
                <span lang="en">{BOUNDARY_COPY.en.errorTitle}</span>
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => retry()}
                className="inline-flex rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-forest pointer-coarse:min-h-11 pointer-coarse:items-center"
              >
                {copy.retry} / <span lang="en">{BOUNDARY_COPY.en.retry}</span>
              </button>
              {LOCALES.map((locale) => (
                <a
                  key={locale}
                  href={localizedPath(locale)}
                  lang={locale}
                  className="inline-flex rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold text-white pointer-coarse:min-h-11 pointer-coarse:items-center"
                >
                  {BOUNDARY_COPY[locale].goHome}
                </a>
              ))}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
