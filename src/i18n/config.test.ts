import { describe, expect, it } from 'vitest';
import en from './dictionaries/en.json';
import id from './dictionaries/id.json';
import { DEFAULT_LOCALE, LOCALES, hasLocale, localizedPath } from './config';

function keysOf(value: object, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? keysOf(child, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe('hasLocale', () => {
  it('menerima locale yang didukung', () => {
    expect(hasLocale('id')).toBe(true);
    expect(hasLocale('en')).toBe(true);
  });

  it('menolak locale lain', () => {
    expect(hasLocale('fr')).toBe(false);
    expect(hasLocale('')).toBe(false);
  });
});

describe('localizedPath', () => {
  it('menambah prefiks locale', () => {
    expect(localizedPath('en', '/blog')).toBe('/en/blog');
  });

  it('beranda tanpa trailing slash', () => {
    expect(localizedPath('id')).toBe('/id');
    expect(localizedPath('id', '/')).toBe('/id');
  });

  it('menormalkan path tanpa slash awal', () => {
    expect(localizedPath('id', 'contact')).toBe('/id/contact');
  });
});

describe('konfigurasi', () => {
  it('locale default termasuk dalam daftar locale', () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });

  it('kamus id dan en punya kunci yang sama', () => {
    expect(keysOf(en).sort()).toEqual(keysOf(id).sort());
  });
});
