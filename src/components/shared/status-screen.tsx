import type { ReactNode } from 'react';

type StatusScreenProps = {
  /** Kode tampil besar, mis. "404". Dekoratif; judul yang dibacakan. */
  code: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

// Layar status (404/error) dengan pola hero. Header tetap transparan di atasnya (pt-36).
export function StatusScreen({ code, title, description, actions }: StatusScreenProps) {
  return (
    <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-forest px-6 pt-36 pb-20 sm:pt-44">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        <p aria-hidden="true" className="font-mono text-6xl font-black text-brand sm:text-8xl">
          {code}
        </p>
        <h1 className="max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {description}
        </p>
        {actions ? <div className="flex flex-wrap items-center gap-4 pt-2">{actions}</div> : null}
      </div>
    </section>
  );
}
