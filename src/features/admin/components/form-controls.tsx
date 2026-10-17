'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { AdminLocale } from '../post-schema';
import { Flag } from './flag';
import { CheckIcon } from './icons';

/** Sakelar on/off (checkbox ber-role switch). Nilai terkirim "on" bila aktif. */
export function Switch({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        role="switch"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-forest peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        {description ? <span className="block text-xs text-slate-600">{description}</span> : null}
      </span>
    </label>
  );
}

const TAB_LABELS: Record<AdminLocale, string> = {
  id: 'Indonesia',
  en: 'English',
};

/**
 * Tab bahasa. Kedua panel selalu dirender (yang tidak aktif disembunyikan) supaya semua isian
 * ikut terkirim. Tab dengan galat diberi titik merah; bila hanya bahasa Inggris yang bergalat,
 * tab Inggris dibuka otomatis.
 */
export function LanguageTabs({
  idPrefix,
  panels,
  errorLocales = [],
  optionalLocales = ['en'],
}: {
  idPrefix: string;
  panels: Record<AdminLocale, ReactNode>;
  errorLocales?: AdminLocale[];
  optionalLocales?: AdminLocale[];
}) {
  const [active, setActive] = useState<AdminLocale>('id');
  const errorKey = errorLocales.join(',');
  const [lastErrorKey, setLastErrorKey] = useState(errorKey);
  if (errorKey !== lastErrorKey) {
    setLastErrorKey(errorKey);
    if (errorLocales.length > 0 && !errorLocales.includes(active)) setActive(errorLocales[0]!);
  }

  const locales: AdminLocale[] = ['id', 'en'];
  return (
    <div>
      <div role="tablist" aria-label="Bahasa" className="mb-1 flex gap-2 overflow-x-auto pt-5">
        {locales.map((locale) => {
          const selected = locale === active;
          return (
            <button
              key={locale}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${locale}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${locale}`}
              onClick={() => setActive(locale)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors pointer-coarse:min-h-11 ${
                selected
                  ? 'bg-forest-deep text-white'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Flag locale={locale} />
              {TAB_LABELS[locale]}
              <span
                className={`text-xs font-normal ${selected ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {optionalLocales.includes(locale) ? '(opsional)' : '(wajib)'}
              </span>
              {errorLocales.includes(locale) ? (
                <span className="h-2 w-2 rounded-full bg-red-600" aria-label="ada galat" />
              ) : null}
            </button>
          );
        })}
      </div>
      {locales.map((locale) => (
        <div
          key={locale}
          role="tabpanel"
          id={`${idPrefix}-panel-${locale}`}
          aria-labelledby={`${idPrefix}-tab-${locale}`}
          hidden={locale !== active}
          className="divide-y divide-dashed divide-slate-200"
        >
          {panels[locale]}
        </div>
      ))}
    </div>
  );
}

/** Penanda status simpan di pojok kanan atas form, seperti "Changes saved" di acuan. */
export function SaveIndicator({ dirty, saved }: { dirty: boolean; saved: boolean }) {
  if (dirty) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-800">
        <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
        Belum disimpan
      </span>
    );
  }
  if (!saved) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-forest">
      <CheckIcon className="h-4 w-4" />
      Perubahan tersimpan
    </span>
  );
}

const LEAVE_WARNING = 'Perubahan belum disimpan. Tinggalkan halaman ini?';

/** Peringatan saat meninggalkan form yang belum disimpan (tutup tab, muat ulang, atau klik tautan). */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a[href]');
      if (!link || link.getAttribute('target') === '_blank') return;
      if (link.getAttribute('href')?.startsWith('#')) return;
      if (!window.confirm(LEAVE_WARNING)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onClick, true);
    };
  }, [dirty]);
}

/** Tombol kirim yang meminta konfirmasi dulu (mis. hapus). */
export function ConfirmButton({
  message,
  className,
  children,
  ...rest
}: {
  message: string;
  className: string;
  children: ReactNode;
  'aria-label'?: string;
  title?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
