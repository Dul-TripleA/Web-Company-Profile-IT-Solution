import { z } from 'zod';
import { SERVICE_SLUGS } from '@/content/services';

// Pesan galat berupa kode (lihat ContactErrorCode) supaya teks tampil mengikuti locale.
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'required').min(2, 'tooShort').max(100, 'tooLong'),
  email: z
    .string()
    .trim()
    .min(1, 'required')
    .max(254, 'tooLong')
    .pipe(z.email({ error: 'invalidEmail' })),
  phone: z
    .string()
    .trim()
    .max(20, 'tooLong')
    .refine(
      (value) =>
        value === '' || (/^[0-9+\-\s()]+$/.test(value) && value.replace(/\D/g, '').length >= 6),
      'invalidPhone',
    ),
  service: z
    .string()
    .trim()
    .refine((value) => value === '' || SERVICE_SLUGS.includes(value), 'invalidService'),
  message: z.string().trim().min(1, 'required').min(10, 'tooShort').max(2000, 'tooLong'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
