'use client';

import type { ReactNode } from 'react';

import ButtonAdmin from '@/components/admin/button-admin';

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  isOpen,
  title = 'Potvrzení smazání',
  children,
  confirmLabel = 'OK',
  cancelLabel = 'Zrušit',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-1300 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl"
      >
        <h2
          id="confirm-delete-title"
          className="text-lg font-semibold text-foreground"
        >
          {title}
        </h2>
        <div className="mt-3 text-sm text-light">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <ButtonAdmin type="button" onClick={onCancel} color="light" disabled={isPending}>
            {cancelLabel}
          </ButtonAdmin>
          <ButtonAdmin type="button" onClick={onConfirm} color="danger" disabled={isPending}>
            {isPending ? 'Mažu…' : confirmLabel}
          </ButtonAdmin>
        </div>
      </div>
    </div>
  );
}
