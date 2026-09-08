'use client';

import { useActionState } from 'react';

import type { JobExperienceView } from '@/types/types';

import {
  deleteJobAction,
  saveJobAction,
} from '@/lib/actions/about-actions';

import ButtonAdmin from '@/components/admin/button-admin';
import { fieldClass, FormFeedback } from '@/components/forms/admin-fields';
import FormSubmit from '@/components/forms/form-submit';

type JobFormProps = {
  onClose: () => void;
  initialData?: JobExperienceView;
};

export default function JobForm({ onClose, initialData }: JobFormProps) {
  const [state, formAction] = useActionState(saveJobAction, {
    messages: [],
    errors: [],
  });

  return (
    <>
      <header className="mb-4 flex justify-between text-xl font-semibold text-foreground">
        {initialData ? 'Upravit zkušenost' : 'Přidat zkušenost'}
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
            placeholder="např. 2013 – 2018"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Popis
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={8}
            defaultValue={initialData?.description ?? ''}
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="descriptionEn"
            className="mb-1 block text-sm font-medium"
          >
            Popis (EN)
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            rows={8}
            defaultValue={initialData?.descriptionEn ?? ''}
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
        <form action={deleteJobAction} className="mt-4 border-t border-border pt-4">
          <input type="hidden" name="id" value={initialData.id} />
          <ButtonAdmin type="submit" color="light">
            Smazat zkušenost
          </ButtonAdmin>
        </form>
      ) : null}
    </>
  );
}
