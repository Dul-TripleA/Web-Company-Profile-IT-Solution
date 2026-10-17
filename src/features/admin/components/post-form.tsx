'use client';

import { useActionState, useState } from 'react';
import type { AdminLocale } from '../post-schema';
import type { AdminFormState } from '../state';
import { Flag } from './flag';
import { FormLayout, FormRow, FormSection } from './form-layout';
import { LanguageTabs, SaveIndicator, Switch, useUnsavedWarning } from './form-controls';
import { CalendarIcon, DocumentIcon, GlobeIcon, ImageIcon, LinkIcon } from './icons';
import { MarkdownEditor } from './markdown-editor';
import { BUTTON, INPUT } from './ui';

export type CategoryOption = { id: string; label: string };

type PostFormProps = {
  action: (previous: AdminFormState, formData: FormData) => Promise<AdminFormState | void>;
  initial: Record<string, string>;
  categories: CategoryOption[];
  submitLabel: string;
  savedNotice?: boolean;
};

const SECTIONS = [
  { id: 'konten', title: 'Konten', description: 'Judul, ringkasan, isi', icon: DocumentIcon },
  { id: 'url', title: 'URL & kategori', description: 'Alamat artikel', icon: LinkIcon },
  { id: 'publikasi', title: 'Publikasi', description: 'Status dan jadwal', icon: CalendarIcon },
  { id: 'cover', title: 'Gambar cover', description: 'Opsional', icon: ImageIcon },
  { id: 'seo', title: 'SEO', description: 'Opsional, per bahasa', icon: GlobeIcon },
];

const CONTENT_FIELDS = ['title', 'excerpt', 'content'];

export function PostForm({ action, initial, categories, submitLabel, savedNotice }: PostFormProps) {
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
      id: `post-${name}`,
      name,
      defaultValue: values[name] ?? '',
      className: INPUT,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `post-${name}-error` : undefined,
    } as const;
  }

  function error(name: string) {
    return errors[name] ? (
      <p id={`post-${name}-error`} className="mt-1.5 text-xs font-medium text-red-700">
        {errors[name]}
      </p>
    ) : null;
  }

  const errorLocales = (['id', 'en'] as const).filter((locale) =>
    CONTENT_FIELDS.some((name) => errors[`${name}_${locale}`]),
  );

  function contentRows(locale: AdminLocale) {
    const required = locale === 'id';
    return (
      <>
        {locale === 'en' ? (
          <p className="py-4 text-sm text-slate-600">
            Isi bila artikel juga tersedia dalam bahasa Inggris (tampil di /en). Kosongkan semua
            kolom di tab ini bila artikel hanya berbahasa Indonesia.
          </p>
        ) : null}
        <FormRow label="Judul" htmlFor={`post-title_${locale}`} required={required}>
          <input
            {...field(`title_${locale}`)}
            type="text"
            maxLength={160}
            className={`${INPUT} text-base font-semibold`}
          />
          {error(`title_${locale}`)}
        </FormRow>
        <FormRow
          label="Ringkasan"
          htmlFor={`post-excerpt_${locale}`}
          hint="Tampil di daftar artikel dan hasil pencarian Google."
          required={required}
        >
          <textarea {...field(`excerpt_${locale}`)} rows={3} maxLength={300} />
          {error(`excerpt_${locale}`)}
        </FormRow>
        <FormRow
          label="Isi artikel"
          labelId={`post-content_${locale}-label`}
          hint="Gunakan toolbar untuk judul bagian, daftar, tautan, dan gambar."
          required={required}
        >
          <MarkdownEditor
            name={`content_${locale}`}
            initial={values[`content_${locale}`] ?? ''}
            labelId={`post-content_${locale}-label`}
            errorId={errors[`content_${locale}`] ? `post-content_${locale}-error` : undefined}
          />
          {error(`content_${locale}`)}
        </FormRow>
      </>
    );
  }

  const notice = state.message
    ? { saved: Boolean(state.saved), text: state.message }
    : savedNotice
      ? { saved: true, text: 'Artikel dibuat.' }
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
            idPrefix="post"
            errorLocales={errorLocales}
            panels={{ id: contentRows('id'), en: contentRows('en') }}
          />
        </FormSection>

        <FormSection id="url" title="URL & kategori" description="Sama untuk semua bahasa.">
          <FormRow
            label="Slug"
            htmlFor="post-slug"
            hint="Kosongkan agar dibuat dari judul. Mengubah slug artikel terbit memutus tautan lamanya."
          >
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-600">
                /blog/
              </span>
              <input
                {...field('slug')}
                type="text"
                maxLength={120}
                placeholder="judul-artikel"
                className={`${INPUT} rounded-l-none`}
              />
            </div>
            {error('slug')}
          </FormRow>
          <FormRow label="Kategori" htmlFor="post-categoryId">
            <select {...field('categoryId')}>
              <option value="">Tanpa kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            {error('categoryId')}
          </FormRow>
        </FormSection>

        <FormSection id="publikasi" title="Publikasi">
          <FormRow label="Status" labelId="post-published-label">
            <Switch
              name="published"
              label="Terbitkan di situs"
              description="Matikan untuk menyimpan sebagai draft (tidak tampil)."
              defaultChecked={values.published === 'on'}
            />
          </FormRow>
          <FormRow
            label="Tanggal terbit"
            htmlFor="post-publishedAt"
            hint="Waktu WIB. Kosong = sekarang; tanggal di masa depan = terjadwal."
          >
            <input
              {...field('publishedAt')}
              type="datetime-local"
              className={`${INPUT} sm:max-w-xs`}
            />
            {error('publishedAt')}
          </FormRow>
          <FormRow label="Penulis" htmlFor="post-authorName" required>
            <input
              {...field('authorName')}
              type="text"
              maxLength={80}
              className={`${INPUT} sm:max-w-sm`}
            />
            {error('authorName')}
          </FormRow>
        </FormSection>

        <FormSection
          id="cover"
          title="Gambar cover"
          description="Opsional. Tampil di kartu dan atas artikel."
        >
          <FormRow
            label="URL gambar"
            htmlFor="post-coverImage"
            hint="URL https atau path seperti /images/blog/nama.jpg."
          >
            <input {...field('coverImage')} type="text" placeholder="/images/blog/nama.jpg" />
            {error('coverImage')}
          </FormRow>
          {(['id', 'en'] as const).map((locale) => (
            <FormRow
              key={locale}
              label={
                <span className="inline-flex items-center gap-2">
                  <Flag locale={locale} /> Teks alternatif
                </span>
              }
              htmlFor={`post-coverAlt_${locale}`}
              hint="Jelaskan isi gambar untuk pembaca layar."
              required={locale === 'id' && Boolean(values.coverImage)}
            >
              <input {...field(`coverAlt_${locale}`)} type="text" maxLength={200} />
              {error(`coverAlt_${locale}`)}
            </FormRow>
          ))}
        </FormSection>

        <FormSection
          id="seo"
          title="SEO"
          description="Opsional. Kosong = memakai judul dan ringkasan."
        >
          {(['id', 'en'] as const).map((locale) => (
            <div key={locale} className="divide-y divide-dashed divide-slate-200">
              <FormRow
                label={
                  <span className="inline-flex items-center gap-2">
                    <Flag locale={locale} /> Judul SEO
                  </span>
                }
                htmlFor={`post-seoTitle_${locale}`}
                hint="Maksimal 70 karakter."
              >
                <input {...field(`seoTitle_${locale}`)} type="text" maxLength={70} />
                {error(`seoTitle_${locale}`)}
              </FormRow>
              <FormRow
                label={
                  <span className="inline-flex items-center gap-2">
                    <Flag locale={locale} /> Deskripsi SEO
                  </span>
                }
                htmlFor={`post-seoDescription_${locale}`}
                hint="Maksimal 160 karakter."
              >
                <textarea {...field(`seoDescription_${locale}`)} rows={2} maxLength={160} />
                {error(`seoDescription_${locale}`)}
              </FormRow>
            </div>
          ))}
        </FormSection>
      </FormLayout>

      <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:rounded-b-3xl lg:px-10">
        <SaveIndicator dirty={dirty} saved={Boolean(state.saved || savedNotice)} />
        <button type="submit" disabled={pending} className={`${BUTTON} w-full sm:w-auto`}>
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
