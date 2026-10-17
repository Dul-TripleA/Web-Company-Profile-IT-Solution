import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EyebrowProps = {
  children: ReactNode;
  tone?: 'muted' | 'light';
  className?: string;
};

export function Eyebrow({ children, tone = 'muted', className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase',
        tone === 'muted' ? 'text-slate-500' : 'text-white',
        className,
      )}
    >
      <span className="text-emerald-700" aria-hidden="true">
        ✱
      </span>{' '}
      {children}
    </span>
  );
}
