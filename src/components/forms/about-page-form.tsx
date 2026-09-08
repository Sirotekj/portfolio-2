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
    <section className="space-y-4 rounded-xl border border-border p-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Úvodní část</h2>
        <p className="mt-1 text-sm text-light">
          Foto a hlavní text z horní části stránky O mně.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <ImagePicker
          label="Foto"
          name="photo"
          defaultImage={aboutPage.photo}
        />

        <div>
          <label htmlFor="intro" className="mb-1 block text-sm font-medium">
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
          <label htmlFor="introEn" className="mb-1 block text-sm font-medium">
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
