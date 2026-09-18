'use client';

import { useMemo, useState, useTransition } from 'react';

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
    return <p className="admin-empty--sm">{emptyLabel}</p>;
  }

  return (
    <>
      {isReordering ? (
        <p className="admin-reorder-hint mb-2">Ukládám pořadí…</p>
      ) : null}
      {reorderError ? (
        <p className="admin-feedback admin-feedback--error mb-2">{reorderError}</p>
      ) : null}
      <ul className="admin-list">
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
              className={`admin-list__row ${
                isDragging ? 'admin-list__row--dragging' : ''
              } ${isDropTarget ? 'admin-list__row--drop-target' : ''}`}
            >
              <span aria-hidden="true" className="admin-drag-handle">
                ⠿
              </span>
              <span className="admin-list__index">{index + 1}.</span>
              <div className="admin-list__body">{renderItem(item, index)}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
