'use client';

import { useActionState, useState } from 'react';
import { login, type LoginState } from '../auth-actions';
import { BUTTON, INPUT, LABEL } from './ui';

const MESSAGES: Record<NonNullable<LoginState['error']>, string> = {
  invalid: 'Email atau password salah.',
  rateLimited: 'Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.',
  failed: 'Terjadi gangguan. Coba lagi.',
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {} as LoginState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200"
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
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className={`${INPUT} pr-24`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-pressed={showPassword}
            className="absolute inset-y-1 right-1 rounded-lg px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
            <span className="sr-only"> password</span>
          </button>
        </div>
      </div>
      <button type="submit" disabled={pending} className={`${BUTTON} w-full`}>
        {pending ? 'Memeriksa...' : 'Masuk'}
      </button>
    </form>
  );
}
