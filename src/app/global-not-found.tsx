import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { BOUNDARY_COPY } from '@/i18n/boundary-copy';
import { DEFAULT_LOCALE, LOCALES, localizedPath } from '@/i18n/config';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '404 | Do It',
  robots: { index: false, follow: false },
};

// 404 untuk URL yang tidak cocok dengan rute mana pun. Melewati layout, jadi locale tidak
// diketahui: teks ditampilkan dalam dua bahasa dengan tautan ke masing-masing beranda.
export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={plusJakartaSans.variable}>
      <body>
        <main className="flex min-h-screen items-center bg-forest px-6 py-20">
          <div className="mx-auto w-full max-w-3xl space-y-6">
            <p aria-hidden="true" className="font-mono text-7xl font-black text-brand">
              404
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {BOUNDARY_COPY.id.notFoundTitle}
              <span className="block text-xl font-semibold text-slate-300 sm:text-2xl">
                <span lang="en">{BOUNDARY_COPY.en.notFoundTitle}</span>
              </span>
            </h1>
            <ul className="flex flex-wrap gap-4 pt-2">
              {LOCALES.map((locale) => (
                <li key={locale}>
                  <a
                    href={localizedPath(locale)}
                    lang={locale}
                    className="inline-flex rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-forest pointer-coarse:min-h-11 pointer-coarse:items-center"
                  >
                    {BOUNDARY_COPY[locale].goHome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </body>
    </html>
  );
}
