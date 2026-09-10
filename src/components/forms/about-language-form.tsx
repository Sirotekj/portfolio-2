'use client';

import { useActionState } from 'react';

import type { LanguageView } from '@/types/types';

import { saveLanguageAction } from '@/lib/actions/about-actions';

import ButtonAdmin from '@/components/admin/button-admin';
import {
  fieldClass,
  FormFeedback,
  LevelSelect,
} from '@/components/forms/admin-fields';
import FormSubmit from '@/components/forms/form-submit';

type LanguageFormProps = {
  onClose: () => void;
  initialData?: LanguageView;
};

export default function LanguageForm({
  onClose,
  initialData,
}: LanguageFormProps) {
  const [state, formAction] = useActionState(saveLanguageAction, {
    messages: [],
    errors: [],
  });

  return (
    <>
      <header className="mb-4 flex justify-between text-xl font-semibold text-foreground">
        {initialData ? 'Upravit jazyk' : 'Přidat jazyk'}
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
            Jazyk
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
            Jazyk (EN)
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

        <div>
          <label htmlFor="level" className="mb-1 block text-sm font-medium">
            Úroveň
          </label>
          <LevelSelect defaultValue={initialData?.level ?? 3} />
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
