import 'server-only';

import { Resend } from 'resend';

import {
  getContactFromEmail,
  getContactToEmail,
  getResendApiKey,
} from '@/lib/email/contact-config';

type SendContactEmailInput = {
  name: string;
  email: string;
  message: string;
  locale: 'cs' | 'en';
};

export async function sendContactEmail({
  name,
  email,
  message,
  locale,
}: SendContactEmailInput): Promise<void> {
  const resend = new Resend(getResendApiKey());
  const subject =
    locale === 'en'
      ? `Contact form – ${name}`
      : `Kontaktní formulář – ${name}`;

  const result = await resend.emails.send({
    from: getContactFromEmail(),
    to: getContactToEmail(),
    replyTo: email,
    subject,
    text: [
      locale === 'en' ? 'New message from the website contact form.' : 'Nová zpráva z kontaktního formuláře na webu.',
      '',
      `${locale === 'en' ? 'Name' : 'Jméno'}: ${name}`,
      `Email: ${email}`,
      '',
      locale === 'en' ? 'Message:' : 'Zpráva:',
      message,
    ].join('\n'),
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}
