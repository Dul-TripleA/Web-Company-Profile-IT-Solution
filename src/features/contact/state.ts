import type { CONTACT_FIELDS } from './constants';

export type ContactField = (typeof CONTACT_FIELDS)[number];

/** Kode galat per kolom; diterjemahkan ke teks di UI lewat kamus. */
export type ContactErrorCode =
  'required' | 'tooShort' | 'tooLong' | 'invalidEmail' | 'invalidPhone' | 'invalidService';

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error';
      code: 'form' | 'rateLimited' | 'failed';
      fieldErrors: Partial<Record<ContactField, ContactErrorCode>>;
      values: Record<ContactField, string>;
    };

export const initialContactFormState: ContactFormState = { status: 'idle' };
