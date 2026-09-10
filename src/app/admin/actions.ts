'use server';

import { redirect } from 'next/navigation';

import { getAdminAuthSetupError, isAdminLoginReady } from '@/lib/auth/config';
import { verifyAdminCredentials } from '@/lib/auth/credentials';
import { createAdminSession, destroyAdminSession } from '@/lib/auth/session';

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const setupError = await getAdminAuthSetupError();

  if (!(await isAdminLoginReady()) || setupError) {
    return {
      error:
        setupError ??
        'Admin přihlášení není nakonfigurované. Doplň ADMIN_SESSION_SECRET a vytvoř uživatele v DB.',
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

  const result = await verifyAdminCredentials(email, password);

  if (!result.ok) {
    return { error: 'Neplatný email nebo heslo.' };
  }

  await createAdminSession(result.email);
  redirect('/edit');
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect('/admin');
}
