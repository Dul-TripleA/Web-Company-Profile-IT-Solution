import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

// Hanya lebar maksimum dan pemusatan. Padding horizontal (px-6) dipasang oleh section.
export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('mx-auto max-w-7xl', className)} {...props} />;
}
