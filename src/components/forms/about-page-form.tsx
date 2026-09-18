'use client';

import { useActionState } from 'react';

import type { AboutPageView } from '@/types/types';

import { saveAboutPageAction } from '@/lib/actions/about-actions';

import ButtonAdmin from '@/components/admin/button-admin';
import {
  fieldClass,
  FormFeedback,
} from '@/components/forms/admin-fields';
import FormSubmit from '@/components/forms/form-submit';
import ImagePicker from '@/components/forms/image-picker';

type AboutPageFormProps = {
  aboutPage: AboutPageView;
};

export default function AboutPageForm({ aboutPage }: AboutPageFormProps) {
  const [state, formAction] = useActionState(saveAboutPageAction, {
    messages: [],
    errors: [],
  });

  return (
    <section className="admin-section">
      <div>
        <h2 className="admin-section__title">Úvodní část</h2>
        <p className="admin-section__desc">
          Foto a hlavní text z horní části stránky O mně.
        </p>
      </div>

      <form action={formAction} className="admin-form">
        <ImagePicker
          label="Foto"
          name="photo"
          defaultImage={aboutPage.photo}
        />

        <div>
          <label htmlFor="intro" className="admin-label">
            Úvodní text (CS)
          </label>
          <textarea
            id="intro"
            name="intro"
            required
            rows={10}
            defaultValue={aboutPage.intro}
            placeholder="Odstavce odděl prázdným řádkem."
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="introEn" className="admin-label">
            Úvodní text (EN)
          </label>
          <textarea
            id="introEn"
            name="introEn"
            rows={10}
            defaultValue={aboutPage.introEn ?? ''}
            placeholder="Volitelné — prázdné použije českou verzi"
            className={fieldClass}
          />
        </div>

        <FormFeedback errors={state.errors} messages={state.messages} />

        <FormSubmit />
      </form>
    </section>
  );
}
