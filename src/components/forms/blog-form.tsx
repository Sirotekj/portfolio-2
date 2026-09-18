'use client';

import { useState } from 'react';
import { useActionState } from 'react';

import type { BlogView } from '@/types/types';

import { createAction } from '@/lib/actions/blog-actions';

import ButtonAdmin from '@/components/admin/button-admin';
import {
  fieldClass,
  FormFeedback,
} from '@/components/forms/admin-fields';
import FormSubmit from './form-submit';
import ImagePicker from './image-picker';
import RichTextEditor from './rich-text-editor';

type Props = {
  onClose: () => void;
  initialData?: BlogView;
};

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
      <header className="admin-form__header">
        {isEditing ? 'Upravit článek' : 'Přidat článek'}
        <button type="button" className="admin-form__close" onClick={onClose}>
          ×
        </button>
      </header>

      <form action={formAction} className="admin-form">
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
          <label htmlFor="slug" className="admin-label">
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
          <p className="admin-hint">
            Pokud necháš prázdné, vygeneruje se automaticky z názvu.
          </p>
        </div>

        <div>
          <label htmlFor="slugEn" className="admin-label">
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
          <p className="admin-hint">
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
            <p className="admin-hint my-2">
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
          <label htmlFor="intro" className="admin-label">
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
          <label htmlFor="introEn" className="admin-label">
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
          <span className="admin-label">
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
          <span className="admin-label">
            Hlavní text (EN)
          </span>
          <RichTextEditor
            name="contentEn"
            value={contentEn}
            onChange={setContentEn}
            placeholder="Volitelné — prázdné použije českou verzi"
          />
        </div>

        <FormFeedback errors={state.errors} messages={state.messages} />

        <div className="admin-form__actions">
          <FormSubmit />
          <ButtonAdmin type="button" onClick={onClose} color="light">
            Zrušit
          </ButtonAdmin>
        </div>
      </form>
    </>
  );
}
