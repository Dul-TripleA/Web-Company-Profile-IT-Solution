import type { Locale } from '@/i18n/config';

export type Localized<T> = Record<Locale, T>;
