import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

// Layout akar terpisah dari situs publik. Seluruh area admin tidak boleh diindeks.
export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin Do It' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body suppressHydrationWarning={true} className="min-h-screen bg-forest-deep text-slate-900">
        {children}
      </body>
    </html>
  );
}
