'use client';

import { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Jodit } from 'jodit-react';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

type RichTextEditorProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  name,
  value,
  onChange,
  placeholder = 'Začni psát…',
}: RichTextEditorProps) {
  const editorRef = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder,
      height: 420,
      toolbarAdaptive: false,
      uploader: { insertImageAsBase64URI: true },
      language: 'cs',
      buttons: [
        {
          name: 'basic',
          buttons: [
            'bold',
            'italic',
            'underline',
            '|',
            'ul',
            'ol',
            '|',
            'paragraph',
          ],
        },
      ],
      controls: {
        paragraph: {
          list: Jodit.atom({
            p: 'Odstavec',
            h4: 'Nadpis 4',
            blockquote: 'Citace',
          }),
        },
      },
    }),
    [placeholder],
  );

  return (
    <div className="rich-text-editor">
      <input type="hidden" name={name} value={value} readOnly />
      <JoditEditor
        ref={editorRef}
        value={value}
        config={config}
        onBlur={onChange}
      />
    </div>
  );
}
