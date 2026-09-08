'use client';

import { useMemo, useState, useTransition } from 'react';

import ButtonAdmin from '@/components/admin/button-admin';

type SortableListProps<T extends { id: number }> = {
  items: T[];
  onReorder: (orderedIds: number[]) => Promise<{ error?: string }>;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyLabel: string;
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

export default function SortableList<T extends { id: number }>({
  items: sourceItems,
  onReorder,
  renderItem,
  emptyLabel,
}: SortableListProps<T>) {
  const [optimisticIds, setOptimisticIds] = useState<number[] | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const [isReordering, startReorderTransition] = useTransition();

  const items = useMemo(() => {
    const order = optimisticIds ?? sourceItems.map((item) => item.id);
    const byId = new Map(sourceItems.map((item) => [item.id, item]));

    return order
      .map((id) => byId.get(id))
      .filter((item): item is T => item != null);
  }, [optimisticIds, sourceItems]);

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
      const result = await onReorder(nextIds);

      if (result.error) {
        setOptimisticIds(null);
        setReorderError(result.error);
        return;
      }

      setOptimisticIds(null);
    });
  }

  if (items.length === 0) {
    return <p className="text-sm text-light">{emptyLabel}</p>;
  }

  return (
    <>
      {isReordering ? (
        <p className="mb-2 text-sm text-light">Ukládám pořadí…</p>
      ) : null}
      {reorderError ? (
        <p className="mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {reorderError}
        </p>
      ) : null}
      <ul className="divide-y divide-border rounded-xl border border-border">
        {items.map((item, index) => {
          const isDragging = draggedId === item.id;
          const isDropTarget =
            dropTargetId === item.id && draggedId !== item.id;

          return (
            <li
              key={item.id}
              draggable
              onDragStart={() => setDraggedId(item.id)}
              onDragEnd={() => {
                setDraggedId(null);
                setDropTargetId(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDropTargetId(item.id);
              }}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(item.id);
              }}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                isDragging ? 'opacity-50' : ''
              } ${isDropTarget ? 'bg-primary/5' : ''}`}
            >
              <span
                aria-hidden="true"
                className="cursor-grab px-1 text-light active:cursor-grabbing"
              >
                ⠿
              </span>
              <span className="w-6 shrink-0 text-sm text-light">
                {index + 1}.
              </span>
              <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
