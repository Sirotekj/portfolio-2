'use client';

import { useMemo, useState, useTransition } from 'react';

import ButtonAdmin from '@/components/admin/button-admin';
import ConfirmDeleteModal from '@/components/admin/confirm-delete-modal';
import PortfolioForm from '@/components/forms/portfolio-form';
import PortfolioPageForm from '@/components/forms/portfolio-page-form';
import {
  deleteProjectAction,
  reorderProjectsAction,
} from '@/lib/actions/portfolio-actions';
import type { PortfolioPageView, ProjectView } from '@/types/types';

type PortfolioEditorProps = {
  portfolioPage: PortfolioPageView;
  projects: ProjectView[];
};

function reorderIds(
  ids: number[],
  draggedId: number,
  targetId: number,
): number[] {
  const fromIndex = ids.indexOf(draggedId);
  const toIndex = ids.indexOf(targetId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return ids;
  }

  const next = [...ids];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  return next;
}

export default function PortfolioEditor({
  portfolioPage,
  projects,
}: PortfolioEditorProps) {
  const [optimisticIds, setOptimisticIds] = useState<number[] | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<
    ProjectView | undefined
  >();
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const [isReordering, startReorderTransition] = useTransition();
  const [projectToDelete, setProjectToDelete] = useState<ProjectView | null>(
    null,
  );
  const [isDeleting, startDeleteTransition] = useTransition();

  const items = useMemo(() => {
    const order = optimisticIds ?? projects.map((project) => project.id);
    const byId = new Map(projects.map((project) => [project.id, project]));

    return order
      .map((id) => byId.get(id))
      .filter((project): project is ProjectView => project != null);
  }, [optimisticIds, projects]);

  function openCreateForm() {
    setSelectedProject(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(project: ProjectView) {
    setSelectedProject(project);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedProject(undefined);
  }

  function openDeleteConfirm(project: ProjectView) {
    setProjectToDelete(project);
  }

  function closeDeleteConfirm() {
    if (!isDeleting) {
      setProjectToDelete(null);
    }
  }

  function confirmDelete() {
    if (!projectToDelete) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(projectToDelete.id));

    startDeleteTransition(async () => {
      await deleteProjectAction(formData);
      setProjectToDelete(null);
      setOptimisticIds(null);
    });
  }

  function handleDrop(targetId: number) {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    const currentIds = items.map((item) => item.id);
    const nextIds = reorderIds(currentIds, draggedId, targetId);

    setOptimisticIds(nextIds);
    setDraggedId(null);
    setDropTargetId(null);
    setReorderError(null);

    startReorderTransition(async () => {
      const result = await reorderProjectsAction(nextIds);

      if (result.error) {
        setOptimisticIds(null);
        setReorderError(result.error);
        return;
      }

      setOptimisticIds(null);
    });
  }

  return (
    <div className="space-y-8">
      <PortfolioPageForm portfolioPage={portfolioPage} />

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Projekty</h2>
          <p className="mt-1 text-sm text-light">
            Správa projektů zobrazených na homepage.
          </p>
        </div>

      <ButtonAdmin type="button" onClick={openCreateForm} color="dark">
        Přidat projekt
      </ButtonAdmin>

      {items.length > 0 ? (
        <p className="text-sm text-light">
          Pořadí na webu měníš přetažením projektů v seznamu.
          {isReordering ? ' Ukládám…' : ''}
        </p>
      ) : null}

      {reorderError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {reorderError}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="text-light">Zatím žádné projekty v databázi.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {items.map((project, index) => {
            const isDragging = draggedId === project.id;
            const isDropTarget =
              dropTargetId === project.id && draggedId !== project.id;

            return (
              <li
                key={project.id}
                draggable
                onDragStart={() => setDraggedId(project.id)}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDropTargetId(null);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropTargetId(project.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(project.id);
                }}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isDragging ? 'opacity-50' : ''
                } ${isDropTarget ? 'bg-primary/5' : ''}`}
              >
                <button
                  type="button"
                  aria-label={`Přesunout projekt ${project.title}`}
                  className="cursor-grab px-1 text-light active:cursor-grabbing"
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    ⠿
                  </span>
                </button>

                <span className="w-6 shrink-0 text-sm text-light">
                  {index + 1}.
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{project.title}</p>
                  <p className="text-sm text-light">
                    {project.category ?? 'bez kategorie'}
                    {project.titleEn ? ` · EN: ${project.titleEn}` : ''}
                    {project.gallery.length > 0
                      ? ` · galerie: ${project.gallery.length}`
                      : ''}
                  </p>
                </div>

                <div
                  className="flex shrink-0 flex-col items-end gap-1"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <ButtonAdmin
                    type="button"
                    onClick={() => openEditForm(project)}
                    color="light"
                    className="px-3 py-1"
                  >
                    Upravit
                  </ButtonAdmin>
                  <ButtonAdmin
                    type="button"
                    onClick={() => openDeleteConfirm(project)}
                    color="danger"
                    className="px-3 py-1"
                  >
                    Smazat
                  </ButtonAdmin>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-1200 flex items-start justify-center overflow-y-auto p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeForm} />
          <div className="relative my-8 w-full max-w-3xl rounded-xl border border-border bg-background p-6 shadow-xl">
            <PortfolioForm onClose={closeForm} initialData={selectedProject} />
          </div>
        </div>
      ) : null}

      <ConfirmDeleteModal
        isOpen={projectToDelete !== null}
        isPending={isDeleting}
        onCancel={closeDeleteConfirm}
        onConfirm={confirmDelete}
      >
        <p>
          Opravdu chcete smazat projekt{' '}
          <strong className="text-foreground">
            „{projectToDelete?.title ?? ''}“
          </strong>
          ?
        </p>
        <p className="mt-2">
          Smaže se hlavní obrázek i všechny soubory z galerie projektu.
        </p>
      </ConfirmDeleteModal>
      </section>
    </div>
  );
}
