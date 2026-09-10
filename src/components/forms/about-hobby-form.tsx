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
      <header className="mb-4 flex justify-between text-xl font-semibold text-foreground">
        {initialData ? 'Upravit koníček' : 'Přidat koníček'}
        <button
          type="button"
          className="flex h-6 w-6 cursor-pointer items-center justify-center text-4xl hover:text-primary"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <form action={formAction} className="flex flex-col gap-4">
        {initialData?.id ? (
          <input type="hidden" name="id" value={initialData.id} />
        ) : null}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
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
          <label htmlFor="nameEn" className="mb-1 block text-sm font-medium">
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
