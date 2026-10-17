import type { AdminLocale } from '../post-schema';

// Bendera kecil penanda bahasa. Warna bendera adalah konten (bukan token desain), jadi ditulis langsung.
const LABELS: Record<AdminLocale, string> = { id: 'Bahasa Indonesia', en: 'English' };

export function Flag({
  locale,
  className = 'h-3.5 w-5',
}: {
  locale: AdminLocale;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 40"
      role="img"
      aria-label={LABELS[locale]}
      className={`${className} shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10`}
    >
      {locale === 'id' ? (
        <>
          <rect width="60" height="20" fill="#ce1126" />
          <rect y="20" width="60" height="20" fill="#ffffff" />
        </>
      ) : (
        <>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0 60 40M60 0 0 40" stroke="#ffffff" strokeWidth="8" />
          <path d="M30 0v40M0 20h60" stroke="#ffffff" strokeWidth="12" />
          <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="7" />
        </>
      )}
    </svg>
  );
}

/** Deretan bendera untuk bahasa yang sudah terisi; bahasa yang belum ada ditampilkan pudar. */
export function LanguageFlags({ locales }: { locales: readonly string[] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {(['id', 'en'] as const).map((locale) =>
        locales.includes(locale) ? (
          <Flag key={locale} locale={locale} />
        ) : (
          <span key={locale} className="opacity-25" title={`Belum ada versi ${LABELS[locale]}`}>
            <Flag locale={locale} />
          </span>
        ),
      )}
    </span>
  );
}
