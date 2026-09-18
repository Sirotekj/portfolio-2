import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import LoginForm from './login-form';
import { getAdminAuthSetupError, isAdminLoginReady } from '@/lib/auth/config';
import { isAdminAuthenticated } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Admin',
};

export default async function AdminPage() {
  if (await isAdminAuthenticated()) {
    redirect('/edit');
  }

  const setupError = await getAdminAuthSetupError();
  const isConfigured = await isAdminLoginReady();

  return (
    <section className="admin-login-page">
      <h1 className="admin-login-page__title">Přihlášení</h1>
      <p className="admin-login-page__lead">
        Administrace obsahu portfolia. Přihlas se emailem a heslem uloženým v
        databázi.
      </p>

      {!isConfigured ? (
        <div className="admin-login-page__setup">
          <p className="font-medium text-foreground">Chybí konfigurace</p>
          {setupError ? <p className="mt-2 text-red-600">{setupError}</p> : null}
          <p className="mt-2">
            Do <code>.env.development.local</code> a{' '}
            <code>.env.production.local</code> nech jen session secret:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <code>ADMIN_SESSION_SECRET_B64</code>
            </li>
          </ul>
          <p className="mt-3">
            Secret vygeneruj: <code>npm run admin:generate-secret</code>
          </p>
          <p className="mt-2">
            Uživatele vytvoř v DB:{' '}
            <code>
              npm run admin:create-user:dev -- email@example.com heslo
            </code>
          </p>
          <p className="mt-2">
            Ověření: <code>npm run admin:verify-auth:dev</code>
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <LoginForm />
        </div>
      )}
    </section>
  );
}
