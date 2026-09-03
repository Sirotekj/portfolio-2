import type { Metadata } from 'next';

import PortfolioEditor from '@/components/admin/portfolio-editor';
import EditShell from '@/components/admin/edit-shell';
import type { ProjectView } from '@/types/types';

import { GetAllProjects } from '@/lib/actions/portfolio-prisma';

export const metadata: Metadata = {
  title: 'Editace | Portfolio',
};

export default async function EditPortfolioPage() {
  let projects: ProjectView[] = [];

  try {
    projects = await GetAllProjects();
  } catch {
    projects = [];
  }

  return (
    <EditShell
      title="Portfolio"
      description="Správa projektů zobrazených na homepage."
    >
      <PortfolioEditor projects={projects} />
    </EditShell>
  );
}
