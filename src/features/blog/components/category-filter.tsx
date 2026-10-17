import Link from 'next/link';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { cn } from '@/lib/utils';
import type { CategoryWithCount } from '../types';

type CategoryFilterProps = {
  locale: Locale;
  dict: Dictionary['blog'];
  categories: CategoryWithCount[];
  activeSlug: string | null;
};

const PILL =
  'inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold transition-colors pointer-coarse:min-h-11';

export function CategoryFilter({ locale, dict, categories, activeSlug }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <nav aria-label={dict.categoriesLabel} className="mb-10">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={localizedPath(locale, '/blog')}
            aria-current={activeSlug === null ? 'page' : undefined}
            className={cn(
              PILL,
              activeSlug === null
                ? 'border-forest bg-forest text-white'
                : 'border-slate-200 bg-white text-forest hover:border-brand',
            )}
          >
            {dict.allCategories}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={localizedPath(locale, `/blog/category/${category.slug}`)}
              aria-current={activeSlug === category.slug ? 'page' : undefined}
              className={cn(
                PILL,
                activeSlug === category.slug
                  ? 'border-forest bg-forest text-white'
                  : 'border-slate-200 bg-white text-forest hover:border-brand',
              )}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
