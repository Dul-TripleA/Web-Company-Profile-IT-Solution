import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/auth';
import { CategoryCreateForm } from '@/features/admin/components/category-create-form';
import { BUTTON, BUTTON_DANGER, CARD, INPUT } from '@/features/admin/components/ui';
import { deleteCategory, renameCategory } from '@/features/admin/other-actions';
import { listCategories } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Kategori' };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const rows = await listCategories();

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-forest">Kategori</h1>

      <div className={`${CARD} mb-6`}>
        <CategoryCreateForm />
      </div>

      {rows.length === 0 ? (
        <p className={CARD}>Belum ada kategori.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className={`${CARD} flex flex-wrap items-center gap-3`}>
              <form
                action={renameCategory.bind(null, row.id)}
                className="flex flex-1 flex-wrap items-center gap-3"
              >
                <label htmlFor={`name-${row.id}`} className="sr-only">
                  Nama kategori {row.slug} ({row.locale})
                </label>
                <input
                  id={`name-${row.id}`}
                  name="name"
                  defaultValue={row.name}
                  maxLength={60}
                  required
                  className={`${INPUT} max-w-xs`}
                />
                <span className="text-xs text-slate-700">
                  {row.locale} · /{row.slug}
                </span>
                <button type="submit" className={BUTTON}>
                  Simpan nama
                </button>
              </form>
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-red-800">
                  Hapus
                </summary>
                <form action={deleteCategory.bind(null, row.id)} className="mt-2 space-y-2">
                  <p className="text-xs text-slate-800">
                    Artikel di kategori ini tetap ada, hanya menjadi tanpa kategori.
                  </p>
                  <button type="submit" className={BUTTON_DANGER}>
                    Ya, hapus
                  </button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
