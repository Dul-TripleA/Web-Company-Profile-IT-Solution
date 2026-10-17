import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  /** `brand`: di atas kartu gelap. `forest`: di atas kartu lime. */
  variant?: 'brand' | 'forest';
  className?: string;
};

const VARIANTS = {
  brand: 'border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-brand',
  forest: 'bg-forest/10 px-3 py-1 text-forest',
} as const;

export function Badge({ children, variant = 'brand', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xl text-xs font-semibold',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
