import { TECH_STACK_ROWS } from '@/content/tech-stack';
import { Reveal, RevealItem, RevealList } from '@/components/shared/reveal';
import type { Dictionary } from '@/i18n/get-dictionary';

export function TechStack({ dict }: { dict: Dictionary['home']['tech'] }) {
  return (
    <section
      id="technology"
      className="relative scroll-mt-24 overflow-hidden border-t border-slate-200/70 bg-white py-20 text-slate-900"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[140px]" />

      <Reveal className="relative z-10 mx-auto mb-12 max-w-7xl px-6 text-center">
        <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-forest sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
          {dict.description}
        </p>
      </Reveal>

      <div className="relative z-10 mx-auto max-w-5xl space-y-4 px-6">
        {TECH_STACK_ROWS.map((row) => (
          <RevealList
            key={row.join('-')}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {row.map((tech) => (
              <RevealItem
                key={tech}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-3 text-xs font-bold tracking-wider text-slate-700 shadow-sm transition-all hover:border-brand hover:bg-white hover:shadow-md"
              >
                {tech}
              </RevealItem>
            ))}
          </RevealList>
        ))}
      </div>
    </section>
  );
}
