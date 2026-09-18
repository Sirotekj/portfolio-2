'use client';

import { useState, useTransition } from 'react';

import ButtonAdmin from '@/components/admin/button-admin';
import ConfirmDeleteModal from '@/components/admin/confirm-delete-modal';
import SortableList from '@/components/admin/sortable-list';

type AboutListEditorProps<T extends { id: number }> = {
  title: string;
  description?: string;
  items: T[];
  emptyLabel: string;
  addLabel: string;
  entityLabel: string;
  onReorder: (orderedIds: number[]) => Promise<{ error?: string }>;
  onDelete: (formData: FormData) => Promise<void>;
  getItemDeleteLabel: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  Form: React.ComponentType<{
    onClose: () => void;
    initialData?: T;
  }>;
};

export default function AboutListEditor<T extends { id: number }>({
  title,
  description,
  items,
  emptyLabel,
  addLabel,
  entityLabel,
  onReorder,
  onDelete,
  getItemDeleteLabel,
  renderItem,
  Form,
}: AboutListEditorProps<T>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function openCreateForm() {
    setSelectedItem(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(item: T) {
    setSelectedItem(item);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedItem(undefined);
  }

  function openDeleteConfirm(item: T) {
    setItemToDelete(item);
  }

  function closeDeleteConfirm() {
    if (!isDeleting) {
      setItemToDelete(null);
    }
  }

  function confirmDelete() {
    if (!itemToDelete) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(itemToDelete.id));

    startDeleteTransition(async () => {
      await onDelete(formData);
      setItemToDelete(null);
    });
  }

  return (
    <section className="admin-section">
      <div>
        <h2 className="admin-section__title">{title}</h2>
        {description ? (
          <p className="admin-section__desc">{description}</p>
        ) : null}
      </div>

      <SortableList
        items={items}
        onReorder={onReorder}
        emptyLabel={emptyLabel}
        renderItem={(item) => (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">{renderItem(item)}</div>
            <div
              className="admin-list__actions"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <ButtonAdmin
                type="button"
                onClick={() => openEditForm(item)}
                color="light"
                className="admin-btn--compact"
              >
                Upravit
              </ButtonAdmin>
              <ButtonAdmin
                type="button"
                onClick={() => openDeleteConfirm(item)}
                color="danger"
                className="admin-btn--compact"
              >
                Smazat
              </ButtonAdmin>
            </div>
          </div>
        )}
      />

      <ButtonAdmin type="button" onClick={openCreateForm} color="dark">
        {addLabel}
      </ButtonAdmin>

      {isFormOpen ? (
        <div className="admin-modal">
          <div className="admin-modal__backdrop" onClick={closeForm} />
          <div className="admin-modal__panel admin-modal__panel--sm">
            <Form onClose={closeForm} initialData={selectedItem} />
          </div>
        </div>
      ) : null}

      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        isPending={isDeleting}
        onCancel={closeDeleteConfirm}
        onConfirm={confirmDelete}
      >
        <p>
          Opravdu chcete smazat {entityLabel}{' '}
          <strong className="text-foreground">
            „{itemToDelete ? getItemDeleteLabel(itemToDelete) : ''}“
          </strong>
          ?
        </p>
      </ConfirmDeleteModal>
    </section>
  );
}
