'use client';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  codeBlockPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './markdown-editor.css';

type Props = {
  initial: string;
  onChange: (markdown: string) => void;
  onError: () => void;
};

// Hanya fitur yang ada di Markdown (tanpa garis bawah, JSX, atau HTML), jadi hasilnya selalu
// bisa dirender oleh komponen Markdown situs.
export default function MarkdownEditorInner({ initial, onChange, onError }: Props) {
  return (
    <MDXEditor
      markdown={initial}
      onChange={(markdown) => onChange(markdown)}
      onError={onError}
      className="doit-editor"
      contentEditableClassName="doit-editor-content"
      suppressHtmlProcessing
      plugins={[
        headingsPlugin({ allowedHeadingLevels: [2, 3, 4] }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles options={['Bold', 'Italic']} />
              <CodeToggle />
              <ListsToggle options={['bullet', 'number']} />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  );
}
