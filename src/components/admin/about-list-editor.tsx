'use client';

import { useState } from 'react';

import ButtonAdmin from '@/components/admin/button-admin';
import SortableList from '@/components/admin/sortable-list';

type AboutListEditorProps<T extends { id: number }> = {
  title: string;
  description?: string;
  items: T[];
  emptyLabel: string;
  addLabel: string;
  onReorder: (orderedIds: number[]) => Promise<{ error?: string }>;
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
  onReorder,
  renderItem,
  Form,
}: AboutListEditorProps<T>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();

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

  return (
    <section className="space-y-4 rounded-xl border border-border p-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-light">{description}</p> : null}
      </div>

      <SortableList
        items={items}
        onReorder={onReorder}
        emptyLabel={emptyLabel}
        renderItem={(item) => (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">{renderItem(item)}</div>
            <div onMouseDown={(event) => event.stopPropagation()}>
              <ButtonAdmin
                type="button"
                onClick={() => openEditForm(item)}
                className="cursor-pointer shrink-0 text-sm font-medium text-primary hover:underline"
              >
                Upravit
              </ButtonAdmin>
            </div>
          </div>
        )}
      />

      <ButtonAdmin type="button" onClick={openCreateForm} color="dark">
        {addLabel}
      </ButtonAdmin>

      {isFormOpen ? (
        <div className="fixed inset-0 z-1200 flex items-start justify-center overflow-y-auto p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeForm}></div>
          <div className="relative my-8 w-full max-w-2xl rounded-xl border border-border bg-background p-6 shadow-xl">
            <Form onClose={closeForm} initialData={selectedItem} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
