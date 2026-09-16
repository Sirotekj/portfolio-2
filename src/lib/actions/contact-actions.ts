'use server';

import { isValidLocale, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { isContactFormConfigured } from '@/lib/email/contact-config';
import { sendContactEmail } from '@/lib/email/send-contact-email';

export type ContactFormState = {
  error?: string;
  success?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseLocale(value: FormDataEntryValue | null): Locale {
  return typeof value === 'string' && isValidLocale(value) ? value : 'cs';
}

function getMessageValue(formData: FormData): string {
  const desktop = formData.get('message');
  const mobile = formData.get('messageMobile');

  if (typeof desktop === 'string' && desktop.trim()) {
    return desktop.trim();
  }

  if (typeof mobile === 'string' && mobile.trim()) {
    return mobile.trim();
  }

  return '';
}

export async function submitContactFormAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const locale = parseLocale(formData.get('locale'));
  const messages = getMessages(locale).footer.form;

  if (!isContactFormConfigured()) {
    return { error: messages.errors.notConfigured };
  }

  const honeypot = formData.get('company');
  if (typeof honeypot === 'string' && honeypot.trim()) {
    return { success: messages.success };
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = getMessageValue(formData);

  if (!name || !email || !message) {
    return { error: messages.errors.required };
  }

  if (name.length < 2) {
    return { error: messages.errors.nameTooShort };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: messages.errors.invalidEmail };
  }

  if (message.length < 10) {
    return { error: messages.errors.messageTooShort };
  }

  try {
    await sendContactEmail({ name, email, message, locale });
    return { success: messages.success };
  } catch {
    return { error: messages.errors.sendFailed };
  }
}
