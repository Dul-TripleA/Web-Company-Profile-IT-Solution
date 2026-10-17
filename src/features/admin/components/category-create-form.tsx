'use client';

import { useActionState } from 'react';
import { createCategory } from '../other-actions';
import { initialAdminFormState } from '../state';
import { BUTTON, INPUT, LABEL } from './ui';

export function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialAdminFormState);
  const nameError = state.fieldErrors.name;

  return (
    <form action={formAction} noValidate className="flex flex-wrap items-start gap-4">
      <div>
        <label htmlFor="category-locale" className={LABEL}>
          Bahasa
        </label>
        <select id="category-locale" name="locale" className={INPUT} defaultValue="id">
          <option value="id">id</option>
          <option value="en">en</option>
        </select>
      </div>
      <div className="min-w-56 flex-1">
        <label htmlFor="category-name" className={LABEL}>
          Nama kategori baru
        </label>
        <input
          id="category-name"
          name="name"
          type="text"
          maxLength={60}
          required
          className={INPUT}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? 'category-name-error' : undefined}
        />
        {nameError ? (
          <p id="category-name-error" className="mt-1 text-xs text-red-700">
            {nameError}
          </p>
        ) : null}
        {state.saved ? (
          <p role="status" className="mt-1 text-xs text-green-800">
            {state.message}
          </p>
        ) : null}
        {state.message && !state.saved ? (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {state.message}
          </p>
        ) : null}
      </div>
      <button type="submit" disabled={pending} className={`${BUTTON} mt-5`}>
        Tambah
      </button>
    </form>
  );
}
