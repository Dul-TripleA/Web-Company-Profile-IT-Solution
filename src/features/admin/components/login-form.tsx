'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '../auth-actions';
import { BUTTON, INPUT, LABEL } from './ui';

const MESSAGES: Record<NonNullable<LoginState['error']>, string> = {
  invalid: 'Email atau password salah.',
  rateLimited: 'Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.',
  failed: 'Terjadi gangguan. Coba lagi.',
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {} as LoginState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {MESSAGES[state.error]}
        </p>
      ) : null}
      <div>
        <label htmlFor="login-identifier" className={LABEL}>
          Email atau username
        </label>
        <input
          id="login-identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          className={INPUT}
        />
      </div>
      <div>
        <label htmlFor="login-password" className={LABEL}>
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={INPUT}
        />
      </div>
      <button type="submit" disabled={pending} className={`${BUTTON} w-full`}>
        {pending ? 'Memeriksa...' : 'Masuk'}
      </button>
    </form>
  );
}
