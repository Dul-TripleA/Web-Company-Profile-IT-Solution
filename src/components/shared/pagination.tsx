import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/icons';
import { getPageWindow } from '@/lib/pagination';
import { cn } from '@/lib/utils';

type PaginationProps = {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
  labels: { navigation: string; previous: string; next: string };
  pageLabel: (page: number) => string;
};

const ITEM =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-bold transition-colors pointer-coarse:min-h-11 pointer-coarse:min-w-11';

export function Pagination({ current, total, hrefFor, labels, pageLabel }: PaginationProps) {
  const items = getPageWindow(current, total);
  if (items.length === 0) return null;

  return (
    <nav aria-label={labels.navigation} className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {current > 1 ? (
          <li>
            <Link
              href={hrefFor(current - 1)}
              rel="prev"
              className={cn(ITEM, 'gap-2 border-slate-200 bg-white text-forest hover:border-brand')}
            >
              <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
              {labels.previous}
            </Link>
          </li>
        ) : null}

        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} aria-hidden="true" className="px-1 text-slate-400">
              …
            </li>
          ) : (
            <li key={item}>
              {item === current ? (
                <span
                  aria-current="page"
                  aria-label={pageLabel(item)}
                  className={cn(ITEM, 'border-brand bg-brand text-forest')}
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={hrefFor(item)}
                  aria-label={pageLabel(item)}
                  className={cn(ITEM, 'border-slate-200 bg-white text-forest hover:border-brand')}
                >
                  {item}
                </Link>
              )}
            </li>
          ),
        )}

        {current < total ? (
          <li>
            <Link
              href={hrefFor(current + 1)}
              rel="next"
              className={cn(ITEM, 'gap-2 border-slate-200 bg-white text-forest hover:border-brand')}
            >
              {labels.next}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
