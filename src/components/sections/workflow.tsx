import type { ReactNode } from 'react';
import { Reveal, RevealItem, RevealList } from '@/components/shared/reveal';
import { ButtonLink } from '@/components/ui/button-link';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BoltIcon, ChatIcon, CodeIcon, PuzzleIcon } from '@/components/ui/icons';
import { localizedPath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';

type WorkflowProps = {
  locale: Locale;
  dict: Dictionary['home']['workflow'];
  ctaLabel: string;
};

const STEP_ICONS: ReactNode[] = [
  <ChatIcon key="chat" className="h-5 w-5" />,
  <PuzzleIcon key="puzzle" className="h-5 w-5" />,
  <CodeIcon key="code" className="h-5 w-5" />,
  <BoltIcon key="bolt" className="h-5 w-5" />,
];

export function Workflow({ locale, dict, ctaLabel }: WorkflowProps) {
  return (
    <section
      id="workflow"
      className="relative scroll-mt-24 overflow-hidden border-t border-emerald-950/60 bg-forest-deep px-6 py-24 text-white"
    >
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-brand/5 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-20 max-w-3xl space-y-4 text-center">
          <Eyebrow tone="light" className="justify-center">
            {dict.eyebrow}
          </Eyebrow>
          <h2 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {dict.titleBefore} <span className="text-brand">{dict.titleHighlight}</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{dict.description}</p>
        </Reveal>

        <RevealList
          as="ol"
          className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {dict.steps.map((step, index) => (
            <RevealItem
              key={step.title}
              className="group relative flex flex-col justify-between rounded-3xl border border-emerald-900/60 bg-forest/70 p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(153,227,68,0.12)]"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-brand">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-forest">
                    {STEP_ICONS[index]}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                <p className="mb-6 text-xs leading-relaxed text-slate-300">{step.description}</p>

                <ul className="space-y-2 border-t border-emerald-900/50 pt-4 text-[11px] text-slate-300">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="font-bold text-brand" aria-hidden="true">
                        ✓
                      </span>{' '}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 font-mono text-[10px] tracking-wider text-brand/80 uppercase">
                {step.phase}
              </div>
            </RevealItem>
          ))}
        </RevealList>

        <Reveal className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-emerald-900/60 bg-linear-to-r from-forest via-forest-deep to-forest p-8 shadow-2xl md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">{dict.cta.title}</h3>
            <p className="text-xs text-slate-400">{dict.cta.description}</p>
          </div>
          <ButtonLink href={localizedPath(locale, '/contact')}>{ctaLabel}</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
