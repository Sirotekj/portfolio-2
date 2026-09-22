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
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    setDeleteError(null);
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
      const result = await deleteProjectAction(formData);

      if (result.error) {
        setDeleteError(result.error);
        return;
      }

      setProjectToDelete(null);
      setOptimisticIds(null);
      setDeleteError(null);
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
    <div className="admin-editor">
      <PortfolioPageForm portfolioPage={portfolioPage} />

      <section className="admin-block">
        <div>
          <h2 className="admin-section__title">Projekty</h2>
          <p className="admin-section__desc">
            Správa projektů zobrazených na homepage.
          </p>
        </div>

      <ButtonAdmin type="button" onClick={openCreateForm} color="dark">
        Přidat projekt
      </ButtonAdmin>

      {items.length > 0 ? (
        <p className="admin-reorder-hint">
          Pořadí na webu měníš přetažením projektů v seznamu.
          {isReordering ? ' Ukládám…' : ''}
        </p>
      ) : null}

      {reorderError ? (
        <p className="admin-feedback admin-feedback--error">{reorderError}</p>
      ) : null}

      {deleteError ? (
        <p className="admin-feedback admin-feedback--error">{deleteError}</p>
      ) : null}

      {items.length === 0 ? (
        <p className="admin-empty">Zatím žádné projekty v databázi.</p>
      ) : (
        <ul className="admin-list">
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
                className={`admin-list__row ${
                  isDragging ? 'admin-list__row--dragging' : ''
                } ${isDropTarget ? 'admin-list__row--drop-target' : ''}`}
              >
                <button
                  type="button"
                  aria-label={`Přesunout projekt ${project.title}`}
                  className="admin-drag-handle"
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    ⠿
                  </span>
                </button>

                <span className="admin-list__index">{index + 1}.</span>

                <div className="admin-list__body">
                  <p className="admin-list__title">{project.title}</p>
                  <p className="admin-list__meta">
                    {project.category ?? 'bez kategorie'}
                    {project.titleEn ? ` · EN: ${project.titleEn}` : ''}
                    {project.gallery.length > 0
                      ? ` · galerie: ${project.gallery.length}`
                      : ''}
                    {project.video.trim()
                      ? ` · video${project.videoWidth && project.videoHeight ? `: ${project.videoWidth}×${project.videoHeight}` : ''}`
                      : ''}
                  </p>
                </div>

                <div
                  className="admin-list__actions"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <ButtonAdmin
                    type="button"
                    onClick={() => openEditForm(project)}
                    color="light"
                    className="admin-btn--compact"
                  >
                    Upravit
                  </ButtonAdmin>
                  <ButtonAdmin
                    type="button"
                    onClick={() => openDeleteConfirm(project)}
                    color="danger"
                    className="admin-btn--compact"
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
        <div className="admin-modal">
          <div className="admin-modal__backdrop" onClick={closeForm} />
          <div className="admin-modal__panel">
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
