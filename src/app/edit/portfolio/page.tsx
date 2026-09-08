import type { Metadata } from 'next';

import PortfolioEditor from '@/components/admin/portfolio-editor';
import EditShell from '@/components/admin/edit-shell';
import { getOrCreatePortfolioPage } from '@/lib/actions/portfolio-page-prisma';
import { GetAllProjects } from '@/lib/actions/portfolio-prisma';
import type { PortfolioPageView, ProjectView } from '@/types/types';

export const metadata: Metadata = {
  title: 'Editace | Portfolio',
};

const emptyPortfolioPage: PortfolioPageView = {
  id: 1,
  intro: '',
  introEn: null,
};

export default async function EditPortfolioPage() {
  let projects: ProjectView[] = [];
  let portfolioPage = emptyPortfolioPage;

  try {
    [projects, portfolioPage] = await Promise.all([
      GetAllProjects(),
      getOrCreatePortfolioPage(),
    ]);
  } catch {
    projects = [];
    portfolioPage = emptyPortfolioPage;
  }

  return (
    <EditShell
      title="Portfolio"
      description="Úvodní text homepage a správa projektů."
    >
      <PortfolioEditor portfolioPage={portfolioPage} projects={projects} />
    </EditShell>
  );
}
