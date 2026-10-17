import Image from 'next/image';

type CoverImageProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Hanya untuk gambar utama di atas lipatan (halaman artikel). */
  eager?: boolean;
  className?: string;
};

// Cover boleh berupa path lokal (`/images/blog/x.jpg`, dioptimalkan Next) atau URL https
// (ditampilkan apa adanya, tanpa daftar domain di next.config).
export function CoverImage({ src, alt, sizes, eager = false, className }: CoverImageProps) {
  const remote = /^https?:\/\//i.test(src);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={remote}
      {...(eager ? { preload: true, fetchPriority: 'high' as const } : {})}
      className={className ?? 'object-cover'}
    />
  );
}
