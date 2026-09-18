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
    <div className="admin-modal admin-modal--center">
      <div className="admin-modal__backdrop" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        className="admin-modal__panel admin-modal__panel--md"
      >
        <h2 id="confirm-delete-title" className="admin-modal__title">
          {title}
        </h2>
        <div className="admin-modal__body">{children}</div>
        <div className="admin-modal__actions">
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
