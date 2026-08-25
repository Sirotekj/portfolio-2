'use server';

import { redirect } from 'next/navigation';

import {
  getAdminAuthSetupError,
  getAdminEmail,
  hasAdminAuthConfig,
} from '@/lib/auth/config';
import { verifyAdminCredentials } from '@/lib/auth/credentials';
import { createAdminSession, destroyAdminSession } from '@/lib/auth/session';

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const setupError = getAdminAuthSetupError();

  if (!hasAdminAuthConfig() || setupError) {
    return {
      error:
        setupError ??
        'Admin přihlášení není nakonfigurované. Doplňte ADMIN_* proměnné v .env.',
    };
  }

  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Vyplňte email a heslo.' };
  }

  if (!email.trim() || !password) {
    return { error: 'Vyplňte email a heslo.' };
  }

  const isValid = await verifyAdminCredentials(email, password);

  if (!isValid) {
    return { error: 'Neplatný email nebo heslo.' };
  }

  await createAdminSession(getAdminEmail());
  redirect('/edit');
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect('/admin');
}
