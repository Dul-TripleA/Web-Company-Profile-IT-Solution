import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/features/admin/auth';
import { ConfirmButton } from '@/features/admin/components/form-controls';
import { ExternalIcon, TrashIcon } from '@/features/admin/components/icons';
import { PageHeader } from '@/features/admin/components/page-header';
import { ProjectForm } from '@/features/admin/components/project-form';
import { BUTTON_DANGER, BUTTON_SECONDARY } from '@/features/admin/components/ui';
import { deleteProject, updateProject } from '@/features/admin/portfolio-actions';
import { projectFormValues, serviceOptions } from '@/features/admin/project-initial';
import { getProject } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Ubah proyek' };

export default async function EditProjectPage({
  params,
  searchParams,
}: PageProps<'/admin/portfolio/[id]'>) {
  await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [found, query] = await Promise.all([getProject(id), searchParams]);
  if (!found) notFound();
  const { project, translations } = found;
  const title = translations.find((item) => item.locale === 'id')?.title ?? project.slug;

  return (
    <>
      <PageHeader
        title="Ubah proyek"
        description={title}
        back={{ href: '/admin/portfolio', label: 'Semua proyek' }}
        actions={
          <>
            {project.status === 'PUBLISHED' ? (
              <a
                href={`/id/portfolio/${project.slug}`}
                target="_blank"
                rel="noopener"
                className={BUTTON_SECONDARY}
              >
                <ExternalIcon className="h-4 w-4" />
                Lihat di situs
              </a>
            ) : null}
            <form action={deleteProject.bind(null, project.id)}>
              <ConfirmButton
                message={`Hapus proyek "${title}" secara permanen?`}
                className={BUTTON_DANGER}
              >
                <TrashIcon className="h-4 w-4" />
                Hapus
              </ConfirmButton>
            </form>
          </>
        }
      />
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        initial={projectFormValues(project, translations)}
        services={serviceOptions()}
        submitLabel="Simpan perubahan"
        savedNotice={query.saved === '1'}
      />
    </>
  );
}
