'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { StatusScreen } from '@/components/shared/status-screen';
import { ButtonLink, buttonClasses } from '@/components/ui/button-link';
import { BOUNDARY_COPY } from '@/i18n/boundary-copy';
import { DEFAULT_LOCALE, hasLocale, localizedPath } from '@/i18n/config';

type ErrorPageProps = { error: unknown; retry: () => void };

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale && hasLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const copy = BOUNDARY_COPY[locale];

  useEffect(() => {
    // Di produksi pesan dari server disamarkan; digest dipakai mencocokkan log server.
    const digest =
      error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;
    console.error('Halaman gagal dirender', digest ?? '');
  }, [error]);

  return (
    <StatusScreen
      code="500"
      title={copy.errorTitle}
      description={copy.errorBody}
      actions={
        <>
          <button type="button" onClick={() => retry()} className={buttonClasses('primary')}>
            {copy.retry}
          </button>
          <ButtonLink variant="outline-light" href={localizedPath(locale)}>
            {copy.goHome}
          </ButtonLink>
          <ButtonLink variant="outline-light" href={localizedPath(locale, '/contact')}>
            {copy.contactUs}
          </ButtonLink>
        </>
      }
    />
  );
}
