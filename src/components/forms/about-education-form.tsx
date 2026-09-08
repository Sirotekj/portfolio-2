'use client';

import { useActionState } from 'react';

import type { EducationView } from '@/types/types';

import {
  deleteEducationAction,
  saveEducationAction,
} from '@/lib/actions/about-actions';

import ButtonAdmin from '@/components/admin/button-admin';
import { fieldClass, FormFeedback } from '@/components/forms/admin-fields';
import FormSubmit from '@/components/forms/form-submit';

type EducationFormProps = {
  onClose: () => void;
  initialData?: EducationView;
};

export default function EducationForm({
  onClose,
  initialData,
}: EducationFormProps) {
  const [state, formAction] = useActionState(saveEducationAction, {
    messages: [],
    errors: [],
  });

  return (
    <>
      <header className="mb-4 flex justify-between text-xl font-semibold text-foreground">
        {initialData ? 'Upravit vzdělání' : 'Přidat vzdělání'}
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
          <label htmlFor="years" className="mb-1 block text-sm font-medium">
            Roky
          </label>
          <input
            type="text"
            id="years"
            name="years"
            required
            defaultValue={initialData?.years ?? ''}
            placeholder="např. 2008 – 2011"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="school" className="mb-1 block text-sm font-medium">
            Škola / kurz
          </label>
          <textarea
            id="school"
            name="school"
            required
            rows={4}
            defaultValue={initialData?.school ?? ''}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="schoolEn" className="mb-1 block text-sm font-medium">
            Škola / kurz (EN)
          </label>
          <textarea
            id="schoolEn"
            name="schoolEn"
            rows={4}
            defaultValue={initialData?.schoolEn ?? ''}
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

      {initialData?.id ? (
        <form
          action={deleteEducationAction}
          className="mt-4 border-t border-border pt-4"
        >
          <input type="hidden" name="id" value={initialData.id} />
          <ButtonAdmin type="submit" color="light">
            Smazat vzdělání
          </ButtonAdmin>
        </form>
      ) : null}
    </>
  );
}
