'use client';

import { useActionState } from 'react';

import type { JobExperienceView } from '@/types/types';

import { saveJobAction } from '@/lib/actions/about-actions';

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
      <header className="admin-form__header">
        {initialData ? 'Upravit zkušenost' : 'Přidat zkušenost'}
        <button type="button" className="admin-form__close" onClick={onClose}>
          ×
        </button>
      </header>

      <form action={formAction} className="admin-form">
        {initialData?.id ? (
          <input type="hidden" name="id" value={initialData.id} />
        ) : null}

        <div>
          <label htmlFor="years" className="admin-label">
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
            className="admin-label"
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
            className="admin-label"
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
    </>
  );
}
