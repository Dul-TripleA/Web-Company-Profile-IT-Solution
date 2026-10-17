'use client';

import { useActionState } from 'react';
import { createCategory } from '../other-actions';
import { initialAdminFormState } from '../state';
import { Flag } from './flag';
import { BUTTON, INPUT, LABEL } from './ui';

export function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialAdminFormState);
  const errors = state.fieldErrors;

  return (
    <form
      action={formAction}
      noValidate
      className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start"
    >
      <div>
        <label htmlFor="category-name_id" className={`${LABEL} flex items-center gap-2`}>
          <Flag locale="id" /> Nama (Indonesia) <span className="text-red-700">*</span>
        </label>
        <input
          id="category-name_id"
          name="name_id"
          type="text"
          maxLength={60}
          placeholder="mis. Teknologi"
          className={INPUT}
          aria-invalid={errors.name_id ? true : undefined}
          aria-describedby={errors.name_id ? 'category-name_id-error' : undefined}
        />
        {errors.name_id ? (
          <p id="category-name_id-error" className="mt-1 text-xs text-red-700">
            {errors.name_id}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="category-name_en" className={`${LABEL} flex items-center gap-2`}>
          <Flag locale="en" /> Nama (English, opsional)
        </label>
        <input
          id="category-name_en"
          name="name_en"
          type="text"
          maxLength={60}
          placeholder="e.g. Technology"
          className={INPUT}
        />
        {errors.name_en ? <p className="mt-1 text-xs text-red-700">{errors.name_en}</p> : null}
      </div>
      <button type="submit" disabled={pending} className={`${BUTTON} w-full md:mt-6 md:w-auto`}>
        Tambah
      </button>
      {state.message ? (
        <p
          role={state.saved ? 'status' : 'alert'}
          className={`text-sm font-medium md:col-span-3 ${state.saved ? 'text-forest' : 'text-red-700'}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
