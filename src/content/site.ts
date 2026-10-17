// Data kontak masih dari template (placeholder). Ganti dengan data resmi sebelum rilis.
export const SITE = {
  name: 'Do It',
  legalName: 'Do It Solution',
  email: 'example@doit.com',
  phone: '+62851 1053 0560',
  phoneHref: 'tel:+6285110530560',
  copyrightYear: 2026,
} as const;

export type SocialLink = {
  id: 'facebook' | 'x' | 'instagram' | 'website' | 'linkedin' | 'github';
  label: string;
  url: string;
};

// url '#' = placeholder sampai akun sosial resmi tersedia.
export const TOP_BAR_SOCIALS: readonly SocialLink[] = [
  { id: 'facebook', label: 'Facebook', url: '#' },
  { id: 'x', label: 'X', url: '#' },
  { id: 'instagram', label: 'Instagram', url: '#' },
  { id: 'website', label: 'Website', url: '#' },
];

export const FOOTER_SOCIALS: readonly SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', url: '#' },
  { id: 'x', label: 'X', url: '#' },
  { id: 'instagram', label: 'Instagram', url: '#' },
  { id: 'github', label: 'GitHub', url: '#' },
];
