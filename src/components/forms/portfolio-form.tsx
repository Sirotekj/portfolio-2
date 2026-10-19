'use client';

import { useActionState, useState, useTransition } from 'react';

import type { ProjectView } from '@/types/types';

import { createProjectAction } from '@/lib/actions/portfolio-actions';
import { buildPortfolioSubmitFormData } from '@/lib/portfolio/submit-portfolio-form';

import ButtonAdmin from '@/components/admin/button-admin';
import {
  fieldClass,
  FormFeedback,
} from '@/components/forms/admin-fields';
import ImagePicker from './image-picker';
import PortfolioFormSubmit from './portfolio-form-submit';
import ProjectMediaPicker from './project-media-picker';

type PortfolioFormProps = {
  onClose: () => void;
  initialData?: ProjectView;
};

const CATEGORY_OPTIONS = [
  { value: '', label: '— bez kategorie —' },
  { value: 'print', label: 'print' },
  { value: 'digital', label: 'digital' },
  { value: 'personal', label: 'personal' },
  { value: 'logo', label: 'logo' },
] as const;

export default function PortfolioForm({
  onClose,
  initialData,
}: PortfolioFormProps) {
  const [state, formAction] = useActionState(createProjectAction, {
    messages: [],
    errors: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(initialData?.id);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const form = event.currentTarget;
    const source = new FormData(form);

    setIsUploading(true);

    let payload: FormData;

    try {
      const built = await buildPortfolioSubmitFormData(source);

      if (built.error) {
        setUploadError(built.error);
        return;
      }

      if (!built.formData) {
        setUploadError('Odeslání formuláře se nezdařilo.');
        return;
      }

      payload = built.formData;
    } finally {
      setIsUploading(false);
    }

    startTransition(() => {
      formAction(payload);
    });
  }

  return (
    <>
      <header className="admin-form__header">
        {isEditing ? 'Upravit projekt' : 'Přidat projekt'}
        <button type="button" className="admin-form__close" onClick={onClose}>
          ×
        </button>
      </header>

      <form onSubmit={handleSubmit} className="admin-form">
        {initialData?.id ? (
          <input type="hidden" name="id" value={initialData.id} />
        ) : null}

        <div>
          <label htmlFor="title" className="admin-label">
            Název (CS)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={initialData?.title ?? ''}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="titleEn" className="admin-label">
            Název (EN)
          </label>
          <input
            type="text"
            id="titleEn"
            name="titleEn"
            defaultValue={initialData?.titleEn ?? ''}
            placeholder="Volitelné — prázdné použije českou verzi"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="category" className="admin-label">
            Kategorie
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initialData?.category ?? ''}
            className={fieldClass}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value || 'none'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="admin-label">
            Popis (CS)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
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
            rows={4}
            defaultValue={initialData?.descriptionEn ?? ''}
            placeholder="Volitelné — prázdné použije českou verzi"
            className={fieldClass}
          />
        </div>

        <ImagePicker
          label="Hlavní obrázek"
          name="image"
          defaultImage={initialData?.image}
        />

        <ProjectMediaPicker
          defaultGallery={initialData?.gallery}
          defaultVideo={initialData?.video}
          defaultVideoWidth={initialData?.videoWidth}
          defaultVideoHeight={initialData?.videoHeight}
        />

        <FormFeedback
          errors={[...(uploadError ? [uploadError] : []), ...state.errors]}
          messages={state.messages}
        />

        <p className="admin-hint">
          Obrázky se nahrávají po jednom (limit Vercelu ~4,5 MB na požadavek).
          Každý soubor max. 2 MB.
        </p>

        <div className="admin-form__actions">
          <PortfolioFormSubmit uploading={isUploading} pending={isPending} />
          <ButtonAdmin type="button" onClick={onClose} color="light">
            Zrušit
          </ButtonAdmin>
        </div>
      </form>
    </>
  );
}
