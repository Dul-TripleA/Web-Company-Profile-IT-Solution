'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { INPUT } from './ui';

// Editor WYSIWYG (MDXEditor) dimuat hanya di halaman ini dan hanya di browser.
const Editor = dynamic(() => import('./markdown-editor-inner'), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-slate-700">Memuat editor...</p>,
});

type Props = { name: string; initial: string; labelId: string; errorId?: string };

/**
 * Nilai Markdown dikirim lewat <input type="hidden">, jadi form tetap memakai FormData biasa.
 * Bila editor gagal membaca Markdown (mis. sintaks tak dikenal), beralih ke textarea biasa
 * supaya isi tidak pernah terkunci.
 */
export function MarkdownEditor({ name, initial, labelId, errorId }: Props) {
  const [value, setValue] = useState(initial);
  const [fallback, setFallback] = useState(false);

  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={errorId}>
      {fallback ? (
        <>
          <p className="mb-2 text-xs text-slate-700">
            Editor visual tidak bisa membaca isi ini, jadi memakai mode teks Markdown.
          </p>
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={18}
            className={`${INPUT} font-mono`}
            aria-labelledby={labelId}
          />
        </>
      ) : (
        <>
          <input type="hidden" name={name} value={value} />
          <Editor initial={initial} onChange={setValue} onError={() => setFallback(true)} />
        </>
      )}
    </div>
  );
}
