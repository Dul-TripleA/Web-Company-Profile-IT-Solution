import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ErrorPage from '@/app/[locale]/error';
import { BOUNDARY_COPY } from '@/i18n/boundary-copy';
import { LOCALES } from '@/i18n/config';
import { StatusScreen } from './status-screen';

let currentLocale: string | undefined = 'en';
vi.mock('next/navigation', () => ({ useParams: () => ({ locale: currentLocale }) }));

afterEach(() => {
  cleanup();
  currentLocale = 'en';
});

describe('StatusScreen', () => {
  it('menampilkan judul sebagai satu-satunya h1 dan menyembunyikan kode dekoratif dari pembaca layar', () => {
    render(<StatusScreen code="404" title="Tidak ada" description="Deskripsi" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Tidak ada');
    expect(screen.getByText('404').getAttribute('aria-hidden')).toBe('true');
  });

  it('menampilkan aksi bila diberikan', () => {
    render(
      <StatusScreen
        code="404"
        title="T"
        description="D"
        actions={<button type="button">Beranda</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Beranda' })).toBeTruthy();
  });
});

describe('ErrorPage', () => {
  it('memanggil retry saat tombol coba lagi ditekan', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const retry = vi.fn();
    render(<ErrorPage error={new Error('x')} retry={retry} />);
    fireEvent.click(screen.getByRole('button', { name: BOUNDARY_COPY.en.retry }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('memakai bahasa dari URL dan tautan beranda berprefiks locale', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    currentLocale = 'id';
    render(<ErrorPage error={new Error('x')} retry={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(BOUNDARY_COPY.id.errorTitle);
    expect(screen.getByRole('link', { name: BOUNDARY_COPY.id.goHome }).getAttribute('href')).toBe(
      '/id',
    );
  });

  it('jatuh ke bahasa default bila locale tidak dikenal', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    currentLocale = 'zz';
    render(<ErrorPage error="bukan-Error" retry={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(BOUNDARY_COPY.id.errorTitle);
  });
});

describe('BOUNDARY_COPY', () => {
  it('semua teks terisi di semua locale', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(BOUNDARY_COPY[locale])) {
        expect(value.trim().length, `${locale}.${key}`).toBeGreaterThan(0);
      }
    }
  });
});
