import Link from 'next/link';
import { ConfirmButton } from './form-controls';
import { ExternalIcon, EyeIcon, PencilIcon, TrashIcon } from './icons';

type RowActionsProps = {
  /** Nama item untuk label aksesibel, mis. judul artikel. */
  name: string;
  editHref: string;
  previewHref?: string;
  viewHref?: string;
  deleteAction: () => Promise<void>;
  deleteMessage: string;
  /** `always`: ikon + teks (kartu ponsel). `wide`: teks hanya muncul di layar lebar (tabel). */
  labels?: 'always' | 'wide';
};

/** Tombol aksi per baris: ubah, pratinjau, lihat di situs, hapus (dengan konfirmasi). */
export function RowActions({
  name,
  editHref,
  previewHref,
  viewHref,
  deleteAction,
  deleteMessage,
  labels = 'wide',
}: RowActionsProps) {
  const text = labels === 'always' ? 'inline' : 'hidden xl:inline';
  const base = `inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors pointer-coarse:h-11 ${
    labels === 'always' ? 'px-3' : 'xl:px-3'
  }`;
  const action = `${base} text-slate-800 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900`;
  const danger = `${base} text-red-700 ring-1 ring-red-200 hover:bg-red-50`;

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${labels === 'always' ? '' : 'justify-end'}`}
    >
      <Link href={editHref} className={action} aria-label={`Ubah ${name}`} title="Ubah">
        <PencilIcon className="h-4 w-4" />
        <span className={text} aria-hidden="true">
          Ubah
        </span>
      </Link>
      {previewHref ? (
        <Link
          href={previewHref}
          className={action}
          aria-label={`Pratinjau ${name}`}
          title="Pratinjau"
        >
          <EyeIcon className="h-4 w-4" />
          <span className={text} aria-hidden="true">
            Pratinjau
          </span>
        </Link>
      ) : null}
      {viewHref ? (
        <a
          href={viewHref}
          target="_blank"
          rel="noopener"
          className={action}
          aria-label={`Lihat ${name} di situs`}
          title="Lihat di situs"
        >
          <ExternalIcon className="h-4 w-4" />
          <span className={text} aria-hidden="true">
            Lihat
          </span>
        </a>
      ) : null}
      <form action={deleteAction}>
        <ConfirmButton
          message={deleteMessage}
          className={danger}
          aria-label={`Hapus ${name}`}
          title="Hapus"
        >
          <TrashIcon className="h-4 w-4" />
          <span className={text} aria-hidden="true">
            Hapus
          </span>
        </ConfirmButton>
      </form>
    </div>
  );
}
