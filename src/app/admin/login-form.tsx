'use client';

import { useActionState } from 'react';

import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="admin-login-form">
      <div>
        <label htmlFor="email" className="admin-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="admin-field"
        />
      </div>

      <div>
        <label htmlFor="password" className="admin-label">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-field"
        />
      </div>

      {state.error ? (
        <p className="admin-login-form__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className="admin-submit">
        {isPending ? 'Přihlašuji…' : 'Přihlásit se'}
      </button>
    </form>
  );
}
