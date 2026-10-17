import 'server-only';
import type { Locale } from './config';

export type Dictionary = typeof import('./dictionaries/id.json');

// Tipe pengembalian eksplisit memaksa en.json punya kunci yang sama dengan id.json.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  id: () => import('./dictionaries/id.json').then((module): Dictionary => module.default),
  en: () => import('./dictionaries/en.json').then((module): Dictionary => module.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
