import 'server-only';

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getContactFromEmail(): string {
  return requireEnv('CONTACT_FROM_EMAIL');
}

export function getContactToEmail(): string {
  return requireEnv('CONTACT_TO_EMAIL');
}

export function getResendApiKey(): string {
  return requireEnv('RESEND_API_KEY');
}

export function isContactFormConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.CONTACT_FROM_EMAIL?.trim() &&
      process.env.CONTACT_TO_EMAIL?.trim(),
  );
}
