import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/auth';
import { CategoryCreateForm } from '@/features/admin/components/category-create-form';
import { Flag } from '@/features/admin/components/flag';
import { ConfirmButton } from '@/features/admin/components/form-controls';
import { TrashIcon } from '@/features/admin/components/icons';
import { PageHeader } from '@/features/admin/components/page-header';
import { BUTTON_SECONDARY, CARD, CARD_TITLE, INPUT } from '@/features/admin/components/ui';
import { deleteCategory, updateCategoryNames } from '@/features/admin/other-actions';
import { listCategories } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Kategori' };

const DELETE =
  'inline-flex h-10 w-10 items-center justify-center rounded-full text-red-700 ring-1 ring-red-200 hover:bg-red-50 pointer-coarse:h-11 pointer-coarse:w-11';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const rows = await listCategories();

  return (
    <>
      <PageHeader
        title="Kategori"
        description="Satu kategori dipakai untuk semua bahasa. Nama Inggris opsional; bila kosong, situs memakai nama Indonesia."
      />

      <section className={`${CARD} mb-6`} aria-labelledby="category-new-title">
        <h2 id="category-new-title" className={`${CARD_TITLE} mb-4`}>
          Tambah kategori
        </h2>
        <CategoryCreateForm />
      </section>

      {rows.length === 0 ? (
        <p className={`${CARD} text-sm text-slate-700`}>Belum ada kategori.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const label = row.nameId ?? row.slug;
            return (
              <li key={row.id} className={CARD}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                  <form
                    action={updateCategoryNames.bind(null, row.id)}
                    className="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                  >
                    <div>
                      <label
                        htmlFor={`name_id-${row.id}`}
                        className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700"
                      >
                        <Flag locale="id" /> Indonesia
                      </label>
                      <input
                        id={`name_id-${row.id}`}
                        name="name_id"
                        defaultValue={row.nameId ?? ''}
                        maxLength={60}
                        required
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`name_en-${row.id}`}
                        className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700"
                      >
                        <Flag locale="en" /> English
                      </label>
                      <input
                        id={`name_en-${row.id}`}
                        name="name_en"
                        defaultValue={row.nameEn ?? ''}
                        maxLength={60}
                        placeholder="(memakai nama Indonesia)"
                        className={INPUT}
                      />
                    </div>
                    <button type="submit" className={BUTTON_SECONDARY}>
                      Simpan
                    </button>
                  </form>
                  <div className="flex items-center justify-between gap-3 lg:justify-end">
                    <span className="text-xs text-slate-600">
                      /{row.slug} · {row.postCount} artikel
                    </span>
                    <form action={deleteCategory.bind(null, row.id)}>
                      <ConfirmButton
                        message={`Hapus kategori "${label}"? Artikelnya tetap ada, hanya menjadi tanpa kategori.`}
                        className={DELETE}
                        aria-label={`Hapus kategori ${label}`}
                        title="Hapus"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
