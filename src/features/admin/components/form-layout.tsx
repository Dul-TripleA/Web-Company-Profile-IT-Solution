import type { ComponentType, ReactNode, SVGProps } from 'react';

// Tata letak form admin mengikuti docs/reference/form-ui.webp (DESIGN_SYSTEM.md §11):
// navigasi bagian di kiri (desktop), bagian berupa kartu, baris "label + keterangan | isian"
// dipisah garis putus-putus.

export type FormSectionLink = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function FormLayout({
  sections,
  children,
}: {
  sections: FormSectionLink[];
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Bagian form" className="hidden xl:block">
        <ul className="sticky top-6 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex gap-3 rounded-xl px-3 py-2.5 text-slate-700 transition-colors hover:bg-white hover:text-slate-900 hover:shadow-sm"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="block text-sm font-semibold">{section.title}</span>
                    <span className="block text-xs text-slate-600">{section.description}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}

export function FormSection({
  id,
  title,
  description,
  aside,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  /** Elemen kecil di kanan judul (mis. tab bahasa). */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-6 rounded-2xl bg-white px-5 shadow-sm ring-1 ring-black/5 sm:px-8"
    >
      <div className="flex flex-col gap-3 border-b border-dashed border-slate-200 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id={`${id}-title`} className="text-base font-bold text-slate-900">
            {title}
          </h2>
          {description ? <p className="mt-0.5 text-sm text-slate-600">{description}</p> : null}
        </div>
        {aside}
      </div>
      <div className="divide-y divide-dashed divide-slate-200">{children}</div>
    </section>
  );
}

export function FormRow({
  label,
  htmlFor,
  labelId,
  hint,
  required,
  children,
}: {
  label: ReactNode;
  /** id input yang dilabeli; untuk grup (mis. editor) pakai `labelId`. */
  htmlFor?: string;
  labelId?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const text = (
    <>
      {label}
      {required ? (
        <span className="text-red-700" aria-hidden="true">
          {' '}
          *
        </span>
      ) : null}
    </>
  );
  return (
    <div className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-8">
      <div>
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">
            {text}
          </label>
        ) : (
          <span id={labelId} className="text-sm font-semibold text-slate-900">
            {text}
          </span>
        )}
        {hint ? <p className="mt-0.5 text-xs text-slate-600">{hint}</p> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
