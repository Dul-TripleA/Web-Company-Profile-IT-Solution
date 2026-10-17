import { locale as getLocale } from 'next/root-params';
import { StatusScreen } from '@/components/shared/status-screen';
import { ButtonLink } from '@/components/ui/button-link';
import { DEFAULT_LOCALE, hasLocale, localizedPath } from '@/i18n/config';
import { BOUNDARY_COPY } from '@/i18n/boundary-copy';

// Dipakai saat notFound() dipanggil di dalam segmen [locale] (mis. slug layanan tak dikenal).
export default async function NotFound() {
  const current = await getLocale();
  const locale = current && hasLocale(current) ? current : DEFAULT_LOCALE;
  const copy = BOUNDARY_COPY[locale];

  return (
    <StatusScreen
      code="404"
      title={copy.notFoundTitle}
      description={copy.notFoundBody}
      actions={
        <>
          <ButtonLink href={localizedPath(locale)}>{copy.goHome}</ButtonLink>
          <ButtonLink variant="outline-light" href={localizedPath(locale, '/services')}>
            {copy.browseServices}
          </ButtonLink>
        </>
      }
    />
  );
}
