import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal, RevealItem, RevealList } from '@/components/shared/reveal';
import { ChatIcon, ClipboardIcon, CodeIcon, ShieldCheckIcon } from '@/components/ui/icons';
import type { Dictionary } from '@/i18n/get-dictionary';

// Satu ikon per langkah, urutannya sama dengan `steps` di kamus.
const STEP_ICONS = [ChatIcon, ClipboardIcon, CodeIcon, ShieldCheckIcon] as const;

// Versi bento lama ada di `approach-bento.tsx` (disembunyikan).
export function Approach({ dict }: { dict: Dictionary['home']['approach'] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Eyebrow>{dict.eyebrow}</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
            {dict.title}
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">{dict.intro}</p>
      </Reveal>

      {/* Cahaya lime di belakang kartu agar efek kaca (blur + transparan) terlihat di latar krem. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/4 h-56 w-56 rounded-full bg-brand/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 -bottom-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
        />

        <RevealList
          as="ol"
          className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {dict.steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <RevealItem
                key={step.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-forest-deep/95 via-forest/90 to-forest-deep/95 p-8 shadow-2xl ring-1 ring-brand/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)] hover:ring-brand/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* Kilau di pojok dan garis tipis di tepi atas: kesan permukaan kaca. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl transition-colors duration-300 group-hover:bg-brand/30"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-brand">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-brand/15 text-brand backdrop-blur-sm transition-colors duration-300 group-hover:bg-brand group-hover:text-forest">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </div>
                  </div>
                  <h3 className="mt-6 mb-2 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealList>
      </div>
    </section>
  );
}
