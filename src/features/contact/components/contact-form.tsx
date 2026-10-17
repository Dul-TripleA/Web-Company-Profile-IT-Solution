'use client';

import { useActionState } from 'react';
import type { Dictionary } from '@/i18n/get-dictionary';
import { cn } from '@/lib/utils';
import { submitContact } from '../actions';
import { initialContactFormState, type ContactField } from '../state';

type ServiceOption = { value: string; label: string };

type ContactFormProps = {
  dict: Dictionary['pages']['contact']['form'];
  services: ServiceOption[];
};

const INPUT =
  'w-full rounded-xl border border-emerald-900/60 bg-forest/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-[invalid=true]:border-red-400';

export function ContactForm({ dict, services }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContact, initialContactFormState);

  if (state.status === 'success') {
    return (
      <div role="status" className="space-y-2 py-6">
        <h3 className="text-2xl font-extrabold tracking-tight text-brand">{dict.successTitle}</h3>
        <p className="text-sm text-slate-300">{dict.successBody}</p>
      </div>
    );
  }

  const values = state.status === 'error' ? state.values : undefined;
  const fieldErrors = state.status === 'error' ? state.fieldErrors : {};

  function fieldProps(field: ContactField) {
    const code = fieldErrors[field];
    return {
      id: `contact-${field}`,
      name: field,
      defaultValue: values?.[field] ?? '',
      'aria-invalid': code ? true : undefined,
      'aria-describedby': code ? `contact-${field}-error` : undefined,
      className: INPUT,
    } as const;
  }

  function fieldError(field: ContactField) {
    const code = fieldErrors[field];
    if (!code) return null;
    return (
      <p id={`contact-${field}-error`} className="mt-1.5 text-xs text-red-300">
        {dict.errors[code]}
      </p>
    );
  }

  const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-200';

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === 'error' ? (
        <p
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-xs text-red-200"
        >
          {dict.errors[state.code]}
        </p>
      ) : null}

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {dict.name}
        </label>
        <input {...fieldProps('name')} type="text" autoComplete="name" required maxLength={100} />
        {fieldError('name')}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {dict.email}
          </label>
          <input
            {...fieldProps('email')}
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
          {fieldError('email')}
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {dict.phone}
          </label>
          <input {...fieldProps('phone')} type="tel" autoComplete="tel" maxLength={20} />
          {fieldError('phone')}
        </div>
      </div>

      <div>
        <label htmlFor="contact-service" className={labelClass}>
          {dict.service}
        </label>
        <select
          id="contact-service"
          name="service"
          defaultValue={values?.service ?? ''}
          aria-invalid={fieldErrors.service ? true : undefined}
          aria-describedby={fieldErrors.service ? 'contact-service-error' : undefined}
          className={cn(INPUT, 'appearance-none')}
        >
          <option value="">{dict.servicePlaceholder}</option>
          {services.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
        {fieldError('service')}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {dict.message}
        </label>
        <textarea {...fieldProps('message')} rows={6} required maxLength={2000} />
        {fieldError('message')}
      </div>

      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-xs font-bold text-forest transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_8px_20px_rgba(153,227,68,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? dict.sending : dict.submit}
      </button>
    </form>
  );
}
