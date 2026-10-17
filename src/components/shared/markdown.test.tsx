import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Markdown } from './markdown';

// next/link tidak butuh router untuk dirender statis, tetapi dimock agar hasilnya sederhana.
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const html = (markdown: string) => renderToStaticMarkup(<Markdown>{markdown}</Markdown>);

describe('Markdown: keamanan', () => {
  it('HTML mentah tidak menjadi elemen (script, iframe, onerror)', () => {
    const output = html(
      'Halo\n\n<script>alert(1)</script>\n\n<iframe src="https://evil.test"></iframe>\n\n<img src=x onerror=alert(1)>',
    );
    expect(output).not.toContain('<script');
    expect(output).not.toContain('<iframe');
    expect(output).not.toMatch(/<img[^>]*onerror/i);
  });

  it('tautan javascript: dan data: dibuang', () => {
    const output = html('[klik](javascript:alert(1)) dan [data](data:text/html;base64,AAAA)');
    expect(output).not.toContain('javascript:');
    expect(output).not.toContain('data:text/html');
  });

  it('gambar dengan sumber javascript: tidak membawa sumber berbahaya', () => {
    expect(html('![x](javascript:alert(1))')).not.toContain('javascript:');
  });
});

describe('Markdown: tampilan', () => {
  it('tautan eksternal memakai target _blank dan rel noopener noreferrer', () => {
    const output = html('[situs](https://example.com/a)');
    expect(output).toContain('href="https://example.com/a"');
    expect(output).toContain('target="_blank"');
    expect(output).toContain('rel="noopener noreferrer"');
  });

  it('tautan internal tidak membuka tab baru', () => {
    const output = html('[kontak](/id/contact)');
    expect(output).toContain('href="/id/contact"');
    expect(output).not.toContain('target=');
  });

  it('`#` menjadi h2 (h1 halaman dipakai judul artikel) dan tidak ada h1', () => {
    const output = html('# Judul\n\n## Bagian\n\n### Sub\n\n##### Dalam');
    expect(output).not.toContain('<h1');
    expect(output.match(/<h2/g)).toHaveLength(2);
    expect(output).toContain('<h3');
    expect(output).toContain('<h4');
    expect(output).not.toContain('<h5');
  });

  it('gambar lazy dengan alt', () => {
    const output = html('![deskripsi](https://example.com/a.png)');
    expect(output).toContain('alt="deskripsi"');
    expect(output).toContain('loading="lazy"');
  });

  it('blok kode dan kode sebaris dirender berbeda', () => {
    const output = html('Teks `inline` ok\n\n```ts\nconst a = 1;\n```');
    expect(output).toContain('<pre');
    expect(output).toContain('bg-slate-100');
    expect(output).toContain('const a = 1;');
  });
});
