import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { legacyTextToRichText, textFromRichText } from "./RichTextRenderer";


export default function RichTextBlockEditor({
  blockType = "TEXT",
  richText,
  legacyText = "",
  onChange,
  placeholder = "Write your content...",
  disabled = false,
}) {
  const toEditorDocument = (json, text) => {
    if (json?.type === "doc") return json;
    const legacy = legacyTextToRichText(text);
    if (blockType !== "HEADING") return legacy;
    return {
      type: "doc",
      content: (legacy.content || []).map((node) => ({
        type: "heading",
        attrs: { level: 2 },
        content: node.content || []
      }))
    };
  };
  const initialDocument = toEditorDocument(richText, legacyText);
  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialDocument,
    editorProps: {
      attributes: {
        class: `impilo-richtext-surface ${blockType === "HEADING" ? "is-heading-block" : ""}`,
        spellcheck: "true",
        "aria-label": placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const json = currentEditor.getJSON();
      onChange?.({ richText: json, text: textFromRichText(json) });
    },
  });

  // Update the editor only when external content changes (e.g. load/reset),
  // not on each keystroke, so the caret does not jump.
  useEffect(() => {
    if (!editor) return;
    const nextDocument = toEditorDocument(richText, legacyText);
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(nextDocument);
    if (current !== next) editor.commands.setContent(nextDocument, false);
  }, [editor, richText, legacyText]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return <div className="impilo-richtext-loading">Loading editor…</div>;

  const setLink = () => {
    const previous = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter link URL (https://…)", previous);
    if (url === null) return;
    if (!url.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const tools = [
    { label: "B", title: "Bold", active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "I", title: "Italic", active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "U", title: "Underline", active: editor.isActive("underline"), run: () => editor.chain().focus().toggleUnderline().run() },
    { label: "S̶", title: "Strike-through", active: editor.isActive("strike"), run: () => editor.chain().focus().toggleStrike().run() },
    { label: "H2", title: "Heading 2", active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "H3", title: "Heading 3", active: editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "• List", title: "Bullet list", active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "1. List", title: "Numbered list", active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Quote", title: "Block quote", active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Link", title: "Insert/edit link", active: editor.isActive("link"), run: setLink },
  ];

  return (
    <div className="impilo-richtext-editor">
      <div className="impilo-richtext-toolbar" role="toolbar" aria-label="Text formatting">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            title={tool.title}
            aria-label={tool.title}
            aria-pressed={tool.active}
            className={tool.active ? "is-active" : ""}
            onMouseDown={(event) => event.preventDefault()}
            onClick={tool.run}
            disabled={disabled}
          >{tool.label}</button>
        ))}
        <span className="impilo-richtext-toolbar-divider" />
        {[
          ["left", "Left"], ["center", "Center"], ["right", "Right"], ["justify", "Justify"]
        ].map(([align, label]) => (
          <button key={align} type="button" title={`Align ${label.toLowerCase()}`} disabled={disabled}
            className={editor.isActive({ textAlign: align }) ? "is-active" : ""}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}>{label}</button>
        ))}
        <span className="impilo-richtext-toolbar-spacer" />
        <button type="button" title="Undo" onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().undo().run()} disabled={disabled || !editor.can().undo()}>↶</button>
        <button type="button" title="Redo" onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().redo().run()} disabled={disabled || !editor.can().redo()}>↷</button>
      </div>
      <EditorContent editor={editor} />
      <div className="impilo-richtext-footer">
        <span>Formatting is saved in the article's JSON content.</span>
        <span>{editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0} words</span>
      </div>
    </div>
  );
}
