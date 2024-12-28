import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TiptapEditor({ content }: { content: any }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p>Type some tiptap text...</p>',
  });

  return <EditorContent editor={editor} />;
}