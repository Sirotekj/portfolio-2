'use client';

import { useActionState } from 'react';

import type { PortfolioPageView } from '@/types/types';

import { savePortfolioPageAction } from '@/lib/actions/portfolio-page-actions';

import {
  fieldClass,
  FormFeedback,
} from '@/components/forms/admin-fields';
import FormSubmit from '@/components/forms/form-submit';

type PortfolioPageFormProps = {
  portfolioPage: PortfolioPageView;
};

export default function PortfolioPageForm({
  portfolioPage,
}: PortfolioPageFormProps) {
  const [state, formAction] = useActionState(savePortfolioPageAction, {
    messages: [],
    errors: [],
  });

  return (
    <section className="space-y-4 rounded-xl border border-border p-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Úvodní text</h2>
        <p className="mt-1 text-sm text-light">
          Text zobrazený nad projekty na homepage portfolia.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label htmlFor="intro" className="mb-1 block text-sm font-medium">
            Úvod (CS)
          </label>
          <textarea
            id="intro"
            name="intro"
            required
            rows={6}
            defaultValue={portfolioPage.intro}
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
            rows={6}
            defaultValue={portfolioPage.introEn ?? ''}
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
