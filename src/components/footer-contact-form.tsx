'use client';

import { useActionState } from 'react';

import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import {
  submitContactFormAction,
  type ContactFormState,
} from '@/lib/actions/contact-actions';

type FooterContactFormProps = {
  locale: Locale;
  labels: {
    formNameLabel: string;
    formEmailLabel: string;
    formMessageLabel: string;
    formSubmitLabel: string;
  };
  formMessages: Messages['footer']['form'];
};

const initialState: ContactFormState = {};

export default function FooterContactForm({
  locale,
  labels,
  formMessages,
}: FooterContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactFormAction,
    initialState,
  );

  return (
    <form action={formAction} id="contact_form" className="relative space-y-2">
      <input type="hidden" name="locale" value={locale} />
      <div
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="footer-form__grid">
        <div className="footer-form__column">
          <input
            type="text"
            name="name"
            placeholder={labels.formNameLabel}
            className="footer-field"
            id="contact_name"
            autoComplete="name"
          />
          <input
            type="email"
            name="email"
            placeholder={labels.formEmailLabel}
            className="footer-field"
            id="contact_email"
            autoComplete="email"
          />
          <textarea
            name="messageMobile"
            placeholder={labels.formMessageLabel}
            className="footer-field footer-field--textarea flex h-auto sm:hidden"
            id="contact_message2"
            rows={4}
          />
          <button
            className="footer-submit"
            id="contact_submit"
            type="submit"
            disabled={isPending}
          >
            {isPending ? formMessages.sending : labels.formSubmitLabel}
          </button>
        </div>
        <div>
          <textarea
            name="message"
            placeholder={labels.formMessageLabel}
            className="footer-field footer-field--textarea hidden h-full sm:flex"
            id="contact_message"
          />
        </div>
      </div>

      {state.error ? (
        <p className="footer-form__feedback footer-form__feedback--error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          className="footer-form__feedback footer-form__feedback--success"
          role="status"
        >
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
