import Image from 'next/image';
import Link from 'next/link';

// Dipakai selagi SiteHeader (client, membaca pathname) menunggu pada rute dinamis seperti
// /blog/[slug]. Posisi dan logo sama dengan header asli supaya tidak melompat saat tergantikan.
export function SiteHeaderFallback({ brand, homeHref }: { brand: string; homeHref: string }) {
  return (
    <header className="fixed top-8 left-0 z-40 w-full text-white">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-5">
        <Link href={homeHref} className="flex items-center">
          <Image
            src="/images/logo/logo-full.png"
            alt={brand}
            width={886}
            height={293}
            loading="eager"
            className="h-11 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
