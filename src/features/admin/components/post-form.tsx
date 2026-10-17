'use client';

import { useActionState } from 'react';
import type { AdminFormState } from '../state';
import { BUTTON, INPUT, LABEL } from './ui';

export type PostFormValues = Record<string, string>;
export type CategoryOption = { id: string; locale: string; name: string };

type PostFormProps = {
  action: (previous: AdminFormState, formData: FormData) => Promise<AdminFormState | void>;
  initial: PostFormValues;
  categories: CategoryOption[];
  submitLabel: string;
  savedNotice?: boolean;
};

export function PostForm({ action, initial, categories, submitLabel, savedNotice }: PostFormProps) {
  const [state, formAction, pending] = useActionState(
    async (previous: AdminFormState, formData: FormData) =>
      (await action(previous, formData)) ?? previous,
    { fieldErrors: {} } as AdminFormState,
  );
  const values = state.values ?? initial;

  function field(name: string) {
    const error = state.fieldErrors[name];
    return {
      id: `post-${name}`,
      name,
      defaultValue: values[name] ?? '',
      className: INPUT,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `post-${name}-error` : undefined,
    } as const;
  }

  function error(name: string) {
    const message = state.fieldErrors[name];
    return message ? (
      <p id={`post-${name}-error`} className="mt-1 text-xs text-red-700">
        {message}
      </p>
    ) : null;
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.message ? (
        <p
          role={state.saved ? 'status' : 'alert'}
          className={
            state.saved
              ? 'rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-900'
              : 'rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800'
          }
        >
          {state.message}
        </p>
      ) : savedNotice ? (
        <p
          role="status"
          className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-900"
        >
          Artikel dibuat.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="post-locale" className={LABEL}>
            Bahasa
          </label>
          <select {...field('locale')}>
            <option value="id">Indonesia (id)</option>
            <option value="en">English (en)</option>
          </select>
          {error('locale')}
        </div>
        <div>
          <label htmlFor="post-status" className={LABEL}>
            Status
          </label>
          <select {...field('status')}>
            <option value="DRAFT">Draft (tidak tampil)</option>
            <option value="PUBLISHED">Terbit</option>
          </select>
          {error('status')}
        </div>
        <div>
          <label htmlFor="post-publishedAt" className={LABEL}>
            Tanggal terbit (WIB)
          </label>
          <input {...field('publishedAt')} type="datetime-local" />
          <p className="mt-1 text-xs text-slate-600">
            Kosong = sekarang. Tanggal di masa depan = terjadwal.
          </p>
          {error('publishedAt')}
        </div>
      </div>

      <div>
        <label htmlFor="post-title" className={LABEL}>
          Judul
        </label>
        <input {...field('title')} type="text" maxLength={160} required />
        {error('title')}
      </div>

      <div>
        <label htmlFor="post-slug" className={LABEL}>
          Slug
        </label>
        <input {...field('slug')} type="text" maxLength={120} />
        <p className="mt-1 text-xs text-slate-600">
          Kosong = dibuat dari judul. Mengubah slug artikel yang sudah terbit memutus tautan
          lamanya.
        </p>
        {error('slug')}
      </div>

      <div>
        <label htmlFor="post-excerpt" className={LABEL}>
          Ringkasan (tampil di daftar dan hasil pencarian)
        </label>
        <textarea {...field('excerpt')} rows={3} maxLength={300} required />
        {error('excerpt')}
      </div>

      <div>
        <label htmlFor="post-content" className={LABEL}>
          Isi (Markdown)
        </label>
        <textarea {...field('content')} rows={18} className={`${INPUT} font-mono`} required />
        {error('content')}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="post-coverImage" className={LABEL}>
            Gambar cover (URL https atau path)
          </label>
          <input {...field('coverImage')} type="text" placeholder="/images/blog/nama.jpg" />
          {error('coverImage')}
        </div>
        <div>
          <label htmlFor="post-coverAlt" className={LABEL}>
            Teks alternatif cover
          </label>
          <input {...field('coverAlt')} type="text" maxLength={200} />
          {error('coverAlt')}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="post-categoryId" className={LABEL}>
            Kategori (harus berbahasa sama)
          </label>
          <select {...field('categoryId')}>
            <option value="">Tanpa kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.locale})
              </option>
            ))}
          </select>
          {error('categoryId')}
        </div>
        <div>
          <label htmlFor="post-authorName" className={LABEL}>
            Penulis
          </label>
          <input {...field('authorName')} type="text" maxLength={80} required />
          {error('authorName')}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="post-seoTitle" className={LABEL}>
            Judul SEO (opsional, maks. 70)
          </label>
          <input {...field('seoTitle')} type="text" maxLength={70} />
          {error('seoTitle')}
        </div>
        <div>
          <label htmlFor="post-seoDescription" className={LABEL}>
            Deskripsi SEO (opsional, maks. 160)
          </label>
          <input {...field('seoDescription')} type="text" maxLength={160} />
          {error('seoDescription')}
        </div>
      </div>

      <button type="submit" disabled={pending} className={BUTTON}>
        {pending ? 'Menyimpan...' : submitLabel}
      </button>
    </form>
  );
}
