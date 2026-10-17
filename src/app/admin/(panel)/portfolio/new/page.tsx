import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/auth';
import { PageHeader } from '@/features/admin/components/page-header';
import { ProjectForm } from '@/features/admin/components/project-form';
import { createProject } from '@/features/admin/portfolio-actions';
import { projectFormValues, serviceOptions } from '@/features/admin/project-initial';
import { listProjects } from '@/features/admin/queries';

export const metadata: Metadata = { title: 'Proyek baru' };

export default async function NewProjectPage() {
  await requireAdmin();
  const projects = await listProjects();
  const nextSortOrder = Math.max(0, ...projects.map((project) => project.sortOrder)) + 1;

  return (
    <>
      <PageHeader
        title="Proyek baru"
        description="Ceritakan masalah, solusi, dan hasil yang bisa dibuktikan."
        back={{ href: '/admin/portfolio', label: 'Semua proyek' }}
      />
      <ProjectForm
        action={createProject}
        initial={projectFormValues(null, [], nextSortOrder)}
        services={serviceOptions()}
        submitLabel="Simpan proyek"
      />
    </>
  );
}
