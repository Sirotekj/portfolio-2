import type { Metadata } from 'next';

import PortfolioEditor from '@/components/admin/portfolio-editor';
import PortfolioStorageDiagnostics from '@/components/admin/portfolio-storage-diagnostics';
import EditShell from '@/components/admin/edit-shell';
import { getOrCreatePortfolioPage } from '@/lib/actions/portfolio-page-prisma';
import { GetAllProjects } from '@/lib/actions/portfolio-prisma';
import { getPortfolioStorageDiagnostics } from '@/lib/storage/blob-diagnostics';
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

  const recentProjectPaths = projects.slice(0, 5).flatMap((project) => {
    const paths = [project.image, ...project.gallery, project.video].filter(
      Boolean,
    );

    return paths;
  });
  const diagnostics = await getPortfolioStorageDiagnostics(
    recentProjectPaths[0],
  );

  return (
    <EditShell
      title="Portfolio"
      description="Úvodní text homepage a správa projektů."
    >
      <PortfolioStorageDiagnostics
        diagnostics={diagnostics}
        recentProjectPaths={[...new Set(recentProjectPaths)]}
      />
      <PortfolioEditor portfolioPage={portfolioPage} projects={projects} />
    </EditShell>
  );
}
