'use client';

import { useActionState } from 'react';

import type { ProjectView } from '@/types/types';

import { createProjectAction } from '@/lib/actions/portfolio-actions';

import ButtonAdmin from '@/components/admin/button-admin';
import FormSubmit from './form-submit';
import GalleryPicker from './gallery-picker';
import ImagePicker from './image-picker';

type PortfolioFormProps = {
  onClose: () => void;
  initialData?: ProjectView;
};

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary';

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

  const isEditing = Boolean(initialData?.id);

  return (
    <>
      <header className="mb-4 flex justify-between text-xl font-semibold text-foreground">
        {isEditing ? 'Upravit projekt' : 'Přidat projekt'}
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
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
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
          <label htmlFor="titleEn" className="mb-1 block text-sm font-medium">
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
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
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
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Popis
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData?.description ?? ''}
            className={fieldClass}
          />
        </div>

        <ImagePicker
          label="Hlavní obrázek"
          name="image"
          defaultImage={initialData?.image}
        />

        <GalleryPicker defaultGallery={initialData?.gallery} />

        {state.errors.length > 0 ? (
          <ul className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}

        {state.messages.length > 0 ? (
          <ul className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
            {state.messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-2 flex justify-between gap-4">
          <FormSubmit />
          <ButtonAdmin type="button" onClick={onClose} color="light">
            Zrušit
          </ButtonAdmin>
        </div>
      </form>
    </>
  );
}
