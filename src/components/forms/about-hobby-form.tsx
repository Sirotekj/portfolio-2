'use client';

import { useActionState } from 'react';

import type { HobbyView } from '@/types/types';

import { saveHobbyAction } from '@/lib/actions/about-actions';

import ButtonAdmin from '@/components/admin/button-admin';
import { fieldClass, FormFeedback } from '@/components/forms/admin-fields';
import FormSubmit from '@/components/forms/form-submit';

type HobbyFormProps = {
  onClose: () => void;
  initialData?: HobbyView;
};

export default function HobbyForm({ onClose, initialData }: HobbyFormProps) {
  const [state, formAction] = useActionState(saveHobbyAction, {
    messages: [],
    errors: [],
  });

  return (
    <>
      <header className="admin-form__header">
        {initialData ? 'Upravit koníček' : 'Přidat koníček'}
        <button type="button" className="admin-form__close" onClick={onClose}>
          ×
        </button>
      </header>

      <form action={formAction} className="admin-form">
        {initialData?.id ? (
          <input type="hidden" name="id" value={initialData.id} />
        ) : null}

        <div>
          <label htmlFor="name" className="admin-label">
            Koníček
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name ?? ''}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="nameEn" className="admin-label">
            Koníček (EN)
          </label>
          <input
            type="text"
            id="nameEn"
            name="nameEn"
            defaultValue={initialData?.nameEn ?? ''}
            placeholder="Volitelné — prázdné použije českou verzi"
            className={fieldClass}
          />
        </div>

        <FormFeedback errors={state.errors} messages={state.messages} />

        <div className="flex justify-between gap-4">
          <FormSubmit />
          <ButtonAdmin type="button" onClick={onClose} color="light">
            Zrušit
          </ButtonAdmin>
        </div>
      </form>
    </>
  );
}
