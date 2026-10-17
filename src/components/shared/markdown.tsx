import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import { cn } from '@/lib/utils';

// Markdown dirender menjadi elemen React (bukan string HTML), jadi HTML mentah di dalam artikel
// tidak dieksekusi, dan react-markdown menyaring URL berbahaya (mis. javascript:) secara bawaan.

const LINK =
  'font-semibold text-forest underline decoration-brand-strong decoration-2 underline-offset-4 hover:text-brand-ink';

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

const components: Components = {
  // `#` di isi artikel menjadi h2 karena h1 halaman dipakai judul artikel; h5/h6 menjadi h4.
  h1: ({ children }) => (
    <h2 className="mt-10 text-2xl font-extrabold tracking-tight text-forest">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-extrabold tracking-tight text-forest">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mt-8 text-xl font-bold text-forest">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-6 text-lg font-bold text-forest">{children}</h4>,
  h5: ({ children }) => <h4 className="mt-6 text-lg font-bold text-forest">{children}</h4>,
  h6: ({ children }) => <h4 className="mt-6 text-lg font-bold text-forest">{children}</h4>,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-6 marker:text-brand-ink">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-brand-ink">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand pl-5 text-slate-600 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-slate-200" />,
  a: ({ href, children }) => {
    if (!href) return <span>{children}</span>;
    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
          {children}
        </a>
      );
    }
    if (href.startsWith('/')) {
      return (
        <Link href={href} className={LINK}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={LINK}>
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => (
    // Ukuran gambar dari Markdown tidak diketahui, jadi memakai <img> biasa (lazy) bukan next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'string' ? src : undefined}
      alt={alt ?? ''}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto w-full rounded-2xl"
    />
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-2xl bg-forest-deep p-5 text-sm leading-relaxed text-slate-200">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const block = Boolean(className?.startsWith('language-')) || String(children).includes('\n');
    return (
      <code
        className={cn(
          'font-mono',
          block ? 'text-[0.9em]' : 'rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-forest',
        )}
      >
        {children}
      </code>
    );
  },
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-slate-700">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
