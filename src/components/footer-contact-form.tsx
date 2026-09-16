'use client';

import { useActionState } from 'react';

import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import {
  submitContactFormAction,
  type ContactFormState,
} from '@/lib/actions/contact-actions';

const formFieldClass =
  'mb-2 w-full rounded-[5px] border-none bg-white py-[0.35rem] pl-[0.6rem] pr-0 font-light outline-none max-[650px]:text-[0.95rem] placeholder:text-footer-placeholder';

const formTextareaClass = `${formFieldClass} placeholder:pt-[0.2rem]`;

const submitButtonClass =
  'w-full cursor-pointer rounded-[5px] border-none bg-footer-btn py-[0.35rem] text-base font-medium text-black transition-all duration-500 hover:bg-footer-btn-hover disabled:cursor-not-allowed disabled:opacity-60';

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

      <div className="grid grid-cols-1 gap-x-2 gap-y-[0.35rem] sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <input
            type="text"
            name="name"
            placeholder={labels.formNameLabel}
            className={formFieldClass}
            id="contact_name"
            autoComplete="name"
          />
          <input
            type="email"
            name="email"
            placeholder={labels.formEmailLabel}
            className={formFieldClass}
            id="contact_email"
            autoComplete="email"
          />
          <textarea
            name="messageMobile"
            placeholder={labels.formMessageLabel}
            className={`${formTextareaClass} flex h-auto sm:hidden`}
            id="contact_message2"
            rows={4}
          />
          <button
            className={submitButtonClass}
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
            className={`${formTextareaClass} hidden h-full sm:flex`}
            id="contact_message"
          />
        </div>
      </div>

      {state.error ? (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-green-800" role="status">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
