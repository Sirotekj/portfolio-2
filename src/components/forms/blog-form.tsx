'use client';

import { useState } from 'react';
import { useActionState } from 'react';

import type { BlogView } from '@/types/types';

import { createAction } from '@/lib/actions/blog-actions';

import FormSubmit from './form-submit';
import ImagePicker from './image-picker';
import RichTextEditor from './rich-text-editor';

type Props = {
  onClose: () => void;
  initialData?: BlogView;
};

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary';

export default function BlogForm({ onClose, initialData }: Props) {
  const [content, setContent] = useState(initialData?.content ?? '');
  const [contentEn, setContentEn] = useState(initialData?.contentEn ?? '');
  const [state, formAction] = useActionState(createAction, {
    messages: [],
    errors: [],
  });

  const isEditing = Boolean(initialData?.id);

  return (
    <>
      <header className="mb-4 text-xl font-semibold text-foreground">
        {isEditing ? 'Upravit článek' : 'Přidat článek'}
      </header>

      <form action={formAction} className="flex flex-col gap-4">
        {initialData?.id ? (
          <input type="hidden" name="id" value={initialData.id} />
        ) : null}

        {initialData?.image ? (
          <input type="hidden" name="existingImage" value={initialData.image} />
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
          <label htmlFor="slug" className="mb-1 block text-sm font-medium">
            Slug (CS)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={initialData?.slug ?? ''}
            placeholder="např. grafik-na-taliri"
            className={fieldClass}
          />
          <p className="mt-1 text-sm text-light">
            Pokud necháš prázdné, vygeneruje se automaticky z názvu.
          </p>
        </div>

        <div>
          <label htmlFor="slugEn" className="mb-1 block text-sm font-medium">
            Slug (EN)
          </label>
          <input
            type="text"
            id="slugEn"
            name="slugEn"
            defaultValue={initialData?.slugEn ?? ''}
            placeholder="např. graphic-on-a-plate"
            className={fieldClass}
          />
          <p className="mt-1 text-sm text-light">
            Volitelné — prázdné použije český slug v anglické verzi webu.
          </p>
        </div>

        <div>
          <ImagePicker
            label="Náhledový obrázek"
            name="image"
            defaultImage={initialData?.image}
          />
          {initialData?.image ? (
            <p className="mb-2 text-sm text-light">
              Aktuální: {initialData.image}
            </p>
          ) : null}
          {/*<input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="block w-full text-sm"
          />*/}
        </div>

        <div>
          <label htmlFor="intro" className="mb-1 block text-sm font-medium">
            Úvod (CS)
          </label>
          <textarea
            id="intro"
            name="intro"
            required
            rows={3}
            defaultValue={initialData?.intro ?? ''}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="introEn" className="mb-1 block text-sm font-medium">
            Úvod (EN)
          </label>
          <textarea
            id="introEn"
            name="introEn"
            rows={3}
            defaultValue={initialData?.introEn ?? ''}
            placeholder="Volitelné — prázdné použije českou verzi"
            className={fieldClass}
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium">
            Hlavní text (CS)
          </span>
          <RichTextEditor
            name="content"
            value={content}
            onChange={setContent}
            placeholder="Obsah článku…"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium">
            Hlavní text (EN)
          </span>
          <RichTextEditor
            name="contentEn"
            value={contentEn}
            onChange={setContentEn}
            placeholder="Volitelné — prázdné použije českou verzi"
          />
        </div>

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
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm transition-colors cursor-pointer hover:border-primary hover:text-primary"
          >
            Zrušit
          </button>
        </div>
      </form>
    </>
  );
}
