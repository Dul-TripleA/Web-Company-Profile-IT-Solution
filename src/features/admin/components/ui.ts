// Kelas Tailwind bersama area admin. Acuan: docs/DESIGN_SYSTEM.md §11 (docs/reference/dashboard-ui.jpg).
// pointer-coarse: target sentuh 44px di perangkat sentuh.
export const INPUT =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 transition-colors focus:border-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 aria-[invalid=true]:border-red-600 pointer-coarse:min-h-11';

export const LABEL = 'mb-1.5 block text-xs font-semibold text-slate-700';

export const HINT = 'mt-1.5 text-xs text-slate-600';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 pointer-coarse:min-h-11';

/** Tombol utama: pil hitam-hijau seperti acuan. */
export const BUTTON = `${BUTTON_BASE} bg-forest-deep text-white hover:bg-forest focus-visible:outline-forest`;

export const BUTTON_SECONDARY = `${BUTTON_BASE} bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline-forest`;

export const BUTTON_DANGER = `${BUTTON_BASE} bg-red-700 text-white hover:bg-red-800 focus-visible:outline-red-700`;

export const CARD = 'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6';

export const CARD_TITLE = 'text-base font-bold text-slate-900';

/** Pil kecil untuk status dan filter. */
export const PILL = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
