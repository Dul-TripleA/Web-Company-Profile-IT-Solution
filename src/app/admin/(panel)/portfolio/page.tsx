import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/features/admin/auth';
import { LanguageFlags } from '@/features/admin/components/flag';
import { PlusIcon } from '@/features/admin/components/icons';
import { PageHeader } from '@/features/admin/components/page-header';
import { RowActions } from '@/features/admin/components/row-actions';
import { BUTTON, CARD, PILL } from '@/features/admin/components/ui';
import { deleteProject } from '@/features/admin/portfolio-actions';
import { serviceTitle } from '@/features/admin/project-initial';
import { listProjects } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Portofolio' };

function StatusPills({ status, isSample }: { status: string; isSample: boolean }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {status === 'PUBLISHED' ? (
        <span className={`${PILL} bg-green-100 text-green-900`}>Tampil</span>
      ) : (
        <span className={`${PILL} bg-slate-200 text-slate-800`}>Draft</span>
      )}
      {isSample ? <span className={`${PILL} bg-amber-100 text-amber-900`}>Contoh</span> : null}
    </span>
  );
}

export default async function AdminPortfolioPage() {
  await requireAdmin();
  const rows = await listProjects();

  const items = rows.map((row) => ({
    ...row,
    service: serviceTitle(row.serviceSlug),
    actions: (labels: 'always' | 'wide') => (
      <RowActions
        labels={labels}
        name={row.title}
        editHref={`/admin/portfolio/${row.id}`}
        viewHref={
          row.status === 'PUBLISHED' && row.locales.includes('id')
            ? `/id/portfolio/${row.slug}`
            : undefined
        }
        deleteAction={deleteProject.bind(null, row.id)}
        deleteMessage={`Hapus proyek "${row.title}" secara permanen?`}
      />
    ),
  }));

  return (
    <>
      <PageHeader
        title="Portofolio"
        description="Proyek yang tampil di halaman Portofolio situs. Proyek contoh harus diganti proyek nyata sebelum rilis."
        actions={
          <Link href="/admin/portfolio/new" className={BUTTON}>
            <PlusIcon className="h-4 w-4" />
            Proyek baru
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className={`${CARD} text-center text-sm text-slate-700`}>Belum ada proyek.</p>
      ) : (
        <>
          <div className={`${CARD} hidden p-0 sm:p-0 md:block`}>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Daftar proyek portofolio</caption>
              <thead className="text-xs text-slate-600">
                <tr>
                  <th scope="col" className="px-6 pt-5 pb-3 font-semibold">
                    Proyek
                  </th>
                  <th scope="col" className="px-3 pt-5 pb-3 font-semibold">
                    Bahasa
                  </th>
                  <th scope="col" className="px-3 pt-5 pb-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-3 pt-5 pb-3 font-semibold">
                    Urutan
                  </th>
                  <th scope="col" className="px-6 pt-5 pb-3 text-right font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="max-w-md px-6 py-4">
                      <Link
                        href={`/admin/portfolio/${row.id}`}
                        className="font-semibold text-slate-900 hover:text-forest hover:underline"
                      >
                        {row.title}
                      </Link>
                      <span className="block truncate text-xs text-slate-600">{row.service}</span>
                    </td>
                    <td className="px-3 py-4">
                      <LanguageFlags locales={row.locales} />
                    </td>
                    <td className="px-3 py-4">
                      <StatusPills status={row.status} isSample={row.isSample} />
                    </td>
                    <td className="px-3 py-4 text-slate-700">{row.sortOrder}</td>
                    <td className="px-6 py-4">{row.actions('wide')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {items.map((row) => (
              <li key={row.id} className={CARD}>
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/admin/portfolio/${row.id}`}
                    className="font-semibold text-slate-900"
                  >
                    {row.title}
                  </Link>
                  <LanguageFlags locales={row.locales} />
                </div>
                <p className="mt-1 text-xs text-slate-600">{row.service}</p>
                <div className="mt-2">
                  <StatusPills status={row.status} isSample={row.isSample} />
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">{row.actions('always')}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
