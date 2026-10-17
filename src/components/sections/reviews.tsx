import Image from 'next/image';
import { Eyebrow } from '@/components/ui/eyebrow';
import { REVIEWS } from '@/content/reviews';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { cn } from '@/lib/utils';

type ReviewsProps = { locale: Locale; dict: Dictionary };

function Stars({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="flex text-base text-brand">
      ★★★★★
    </div>
  );
}

export function Reviews({ locale, dict }: ReviewsProps) {
  const copy = dict.home.reviews;

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden border-t border-slate-200/80 bg-white px-6 py-24 text-slate-900"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 className="text-3xl leading-tight font-black tracking-tight text-forest sm:text-4xl lg:text-5xl">
              {copy.titleBefore} <br />
              <span className="text-brand-ink">{copy.titleHighlight}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 shadow-sm">
            <div className="text-3xl font-black text-forest">
              4.9<span className="text-sm font-normal text-slate-500">{copy.ratingScale}</span>
            </div>
            <div className="space-y-1 border-l border-slate-200 pl-4">
              <Stars label={dict.common.ratingLabel} />
              <p className="text-xs font-semibold text-slate-600">{copy.ratingBasis}</p>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REVIEWS.map((review) => {
            const { quote, role } = review.copy[locale];
            return (
              <li
                key={review.id}
                className={cn(
                  'relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 transition-all duration-300',
                  review.featured
                    ? 'bg-forest text-white shadow-xl'
                    : 'border border-slate-200/80 bg-slate-50/70 shadow-sm hover:border-brand hover:shadow-md',
                )}
              >
                <figure className="relative z-10 flex h-full flex-col justify-between">
                  <div className="space-y-4">
                    <Stars label={dict.common.ratingLabel} />
                    <blockquote
                      className={cn(
                        'text-xs leading-relaxed italic sm:text-sm',
                        review.featured ? 'text-slate-200' : 'text-slate-600',
                      )}
                    >
                      “{quote}”
                    </blockquote>
                  </div>
                  <figcaption
                    className={cn(
                      'mt-6 flex items-center gap-3 border-t pt-6',
                      review.featured ? 'border-emerald-900/60' : 'border-slate-200',
                    )}
                  >
                    <Image
                      src={review.avatar}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <span
                        className={cn(
                          'block text-xs font-bold',
                          review.featured ? 'text-white' : 'text-forest',
                        )}
                      >
                        {review.name}
                      </span>
                      <span
                        className={cn(
                          'text-[11px]',
                          review.featured ? 'text-brand' : 'text-slate-500',
                        )}
                      >
                        {role}
                      </span>
                    </div>
                  </figcaption>
                </figure>
                {review.featured ? (
                  <div className="pointer-events-none absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-brand/10 blur-xl" />
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
