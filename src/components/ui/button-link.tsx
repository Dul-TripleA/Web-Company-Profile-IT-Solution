import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, DoubleChevronIcon } from './icons';

export type ButtonVariant = 'primary' | 'solid' | 'outline' | 'outline-light';

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & { variant?: ButtonVariant };

// pointer-coarse: perangkat sentuh mendapat target tap 44px; desktop tetap persis template.
const BASE =
  'group inline-flex items-center text-xs font-bold transition-all duration-300 pointer-coarse:min-h-11';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'gap-2 transform rounded-full bg-brand px-5 py-2.5 text-forest hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_8px_20px_rgba(153,227,68,0.35)] active:translate-y-0',
  solid:
    'gap-2.5 rounded-full bg-brand px-6 py-3 text-forest shadow-md hover:bg-brand-strong hover:shadow-lg',
  outline:
    'gap-2 rounded-full border border-forest/30 bg-transparent px-6 py-3 text-forest hover:border-forest hover:bg-forest/5',
  // Untuk latar gelap (halaman status 404/error).
  'outline-light':
    'gap-2 rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-white hover:border-brand hover:text-brand',
};

/** Kelas tombol yang sama dengan ButtonLink, untuk elemen `<button>` (mis. tombol coba lagi). */
export function buttonClasses(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(BASE, VARIANTS[variant], className);
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      <span>{children}</span>
      {variant === 'primary' ? (
        <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-forest text-brand transition-colors duration-300">
          <DoubleChevronIcon className="h-2.5 w-2.5 transition-transform duration-300 ease-in-out group-hover:translate-x-4" />
          <DoubleChevronIcon className="absolute h-2.5 w-2.5 -translate-x-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0" />
        </span>
      ) : (
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </Link>
  );
}
