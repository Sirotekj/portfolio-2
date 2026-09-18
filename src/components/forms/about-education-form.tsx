'use client';

import { useActionState } from 'react';

import type { EducationView } from '@/types/types';

import { saveEducationAction } from '@/lib/actions/about-actions';

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
      <header className="admin-form__header">
        {initialData ? 'Upravit vzdělání' : 'Přidat vzdělání'}
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
            placeholder="např. 2008 – 2011"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="school" className="admin-label">
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
          <label htmlFor="schoolEn" className="admin-label">
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
    </>
  );
}
