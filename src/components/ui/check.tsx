import { cn } from '@/lib/utils';
import { CheckIcon } from './icons';

/** Lingkaran gelap kecil dengan centang lime; dipakai di daftar poin pada latar terang/lime. */
export function CheckBullet({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest text-brand',
        className,
      )}
    >
      <CheckIcon strokeWidth={3} className="h-2.5 w-2.5" />
    </div>
  );
}

/** Lingkaran lime transparan dengan centang; dipakai di mini card pada latar gelap. */
export function CheckBadge() {
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
      <CheckIcon className="h-3.5 w-3.5" />
    </div>
  );
}
