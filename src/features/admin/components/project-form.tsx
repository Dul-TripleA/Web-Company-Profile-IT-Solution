'use client';

import { useActionState, useState } from 'react';
import type { AdminLocale } from '../post-schema';
import type { AdminFormState } from '../state';
import { LanguageTabs, SaveIndicator, Switch, useUnsavedWarning } from './form-controls';
import { FormLayout, FormRow, FormSection } from './form-layout';
import { BriefcaseIcon, CalendarIcon, DocumentIcon } from './icons';
import { BUTTON, INPUT } from './ui';

type ProjectFormProps = {
  action: (previous: AdminFormState, formData: FormData) => Promise<AdminFormState | void>;
  initial: Record<string, string>;
  services: { slug: string; title: string }[];
  submitLabel: string;
  savedNotice?: boolean;
};

const SECTIONS = [
  { id: 'konten', title: 'Konten', description: 'Cerita proyek per bahasa', icon: DocumentIcon },
  { id: 'detail', title: 'Detail', description: 'URL, layanan, teknologi', icon: BriefcaseIcon },
  { id: 'publikasi', title: 'Publikasi', description: 'Status dan urutan', icon: CalendarIcon },
];

const TEXT_FIELDS = [
  { name: 'title', label: 'Judul proyek', rows: 0, max: 120, hint: '' },
  {
    name: 'summary',
    label: 'Ringkasan',
    rows: 2,
    max: 160,
    hint: 'Satu kalimat untuk kartu dan hasil pencarian.',
  },
  {
    name: 'client',
    label: 'Klien',
    rows: 0,
    max: 120,
    hint: 'Nama klien, atau gambaran anonim bila belum ada izin.',
  },
  {
    name: 'problem',
    label: 'Masalah',
    rows: 4,
    max: 1500,
    hint: 'Apa yang dihadapi klien sebelum proyek.',
  },
  { name: 'solution', label: 'Solusi', rows: 4, max: 1500, hint: 'Apa yang kami kerjakan.' },
  {
    name: 'result',
    label: 'Hasil',
    rows: 4,
    max: 1500,
    hint: 'Hanya hasil yang bisa dibuktikan; jangan mengarang angka.',
  },
];

export function ProjectForm({
  action,
  initial,
  services,
  submitLabel,
  savedNotice,
}: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(
    async (previous: AdminFormState, formData: FormData) =>
      (await action(previous, formData)) ?? previous,
    { fieldErrors: {} } as AdminFormState,
  );
  const values = state.values ?? initial;
  const errors = state.fieldErrors;
  const [dirty, setDirty] = useState(false);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.saved) setDirty(false);
  }
  useUnsavedWarning(dirty && !pending);

  function field(name: string) {
    return {
      id: `project-${name}`,
      name,
      defaultValue: values[name] ?? '',
      className: INPUT,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `project-${name}-error` : undefined,
    } as const;
  }

  function error(name: string) {
    return errors[name] ? (
      <p id={`project-${name}-error`} className="mt-1.5 text-xs font-medium text-red-700">
        {errors[name]}
      </p>
    ) : null;
  }

  const errorLocales = (['id', 'en'] as const).filter((locale) =>
    TEXT_FIELDS.some((item) => errors[`${item.name}_${locale}`]),
  );

  function contentRows(locale: AdminLocale) {
    return (
      <>
        {locale === 'en' ? (
          <p className="py-4 text-sm text-slate-600">
            Isi bila proyek juga ditampilkan dalam bahasa Inggris. Kosongkan semua kolom di tab ini
            bila hanya berbahasa Indonesia.
          </p>
        ) : null}
        {TEXT_FIELDS.map((item) => {
          const name = `${item.name}_${locale}`;
          return (
            <FormRow
              key={name}
              label={item.label}
              htmlFor={`project-${name}`}
              hint={item.hint || undefined}
              required={locale === 'id'}
            >
              {item.rows ? (
                <textarea {...field(name)} rows={item.rows} maxLength={item.max} />
              ) : (
                <input {...field(name)} type="text" maxLength={item.max} />
              )}
              {error(name)}
            </FormRow>
          );
        })}
      </>
    );
  }

  const notice = state.message
    ? { saved: Boolean(state.saved), text: state.message }
    : savedNotice
      ? { saved: true, text: 'Proyek dibuat.' }
      : null;

  return (
    <form
      action={formAction}
      noValidate
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
    >
      {notice ? (
        <p
          role={notice.saved ? 'status' : 'alert'}
          className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium ${
            notice.saved
              ? 'bg-admin-mint text-forest-deep'
              : 'bg-red-50 text-red-800 ring-1 ring-red-200'
          }`}
        >
          {notice.text}
        </p>
      ) : null}

      <FormLayout sections={SECTIONS}>
        <FormSection
          id="konten"
          title="Konten"
          description="Bahasa Indonesia wajib; bahasa Inggris opsional."
        >
          <LanguageTabs
            idPrefix="project"
            errorLocales={errorLocales}
            panels={{ id: contentRows('id'), en: contentRows('en') }}
          />
        </FormSection>

        <FormSection id="detail" title="Detail" description="Sama untuk semua bahasa.">
          <FormRow
            label="Slug"
            htmlFor="project-slug"
            hint="Huruf kecil, angka, dan tanda hubung."
            required
          >
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-600">
                /portfolio/
              </span>
              <input
                {...field('slug')}
                type="text"
                maxLength={100}
                placeholder="nama-proyek"
                className={`${INPUT} rounded-l-none`}
              />
            </div>
            {error('slug')}
          </FormRow>
          <FormRow label="Layanan" htmlFor="project-serviceSlug" required>
            <select {...field('serviceSlug')}>
              <option value="">Pilih layanan</option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
            {error('serviceSlug')}
          </FormRow>
          <FormRow
            label="Teknologi"
            htmlFor="project-techStack"
            hint="Pisahkan dengan koma, mis. Next.js, PostgreSQL."
            required
          >
            <input {...field('techStack')} type="text" />
            {error('techStack')}
          </FormRow>
        </FormSection>

        <FormSection id="publikasi" title="Publikasi">
          <FormRow label="Status" labelId="project-published-label">
            <Switch
              name="published"
              label="Tampilkan di situs"
              description="Matikan untuk menyimpan sebagai draft."
              defaultChecked={values.published === 'on'}
            />
          </FormRow>
          <FormRow label="Proyek contoh" labelId="project-sample-label">
            <Switch
              name="isSample"
              label="Ini proyek contoh (fiktif)"
              description='Diberi label "Contoh", tidak diindeks Google, tidak masuk sitemap.'
              defaultChecked={values.isSample === 'on'}
            />
          </FormRow>
          <FormRow label="Urutan" htmlFor="project-sortOrder" hint="Angka kecil tampil lebih dulu.">
            <input
              {...field('sortOrder')}
              type="number"
              min={0}
              max={999}
              className={`${INPUT} sm:max-w-32`}
            />
            {error('sortOrder')}
          </FormRow>
        </FormSection>
      </FormLayout>

      <div className="sticky bottom-4 z-20 -mx-4 mt-6 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:rounded-3xl lg:px-10">
        <SaveIndicator dirty={dirty} saved={Boolean(state.saved || savedNotice)} />
        <button type="submit" disabled={pending} className={`${BUTTON} w-full sm:w-auto`}>
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
