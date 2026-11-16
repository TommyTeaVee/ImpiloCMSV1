import React from "react";

/**
 * Safe renderer for Tiptap JSON. It renders a whitelist of document nodes and
 * marks as React elements; it never injects HTML into the page.
 */
const TEXT_ALIGNMENTS = new Set(["left", "center", "right", "justify"]);

function nodeStyle(node) {
  const align = node?.attrs?.textAlign;
  return TEXT_ALIGNMENTS.has(align) ? { textAlign: align } : undefined;
}

function renderMark(child, mark, key) {
  switch (mark?.type) {
    case "bold": return <strong key={key}>{child}</strong>;
    case "italic": return <em key={key}>{child}</em>;
    case "underline": return <u key={key}>{child}</u>;
    case "strike": return <s key={key}>{child}</s>;
    case "code": return <code key={key}>{child}</code>;
    case "link": {
      const href = String(mark?.attrs?.href || "");
      // Only permit ordinary web links. Reject javascript:, data:, etc.
      if (!/^https?:\/\//i.test(href) && !href.startsWith("mailto:")) {
        return <React.Fragment key={key}>{child}</React.Fragment>;
      }
      return <a key={key} href={href} target="_blank" rel="noopener noreferrer">{child}</a>;
    }
    case "highlight": return <mark key={key}>{child}</mark>;
    default: return <React.Fragment key={key}>{child}</React.Fragment>;
  }
}

function renderNode(node, key) {
  if (!node) return null;
  if (node.type === "text") {
    let child = node.text || "";
    (node.marks || []).forEach((mark, index) => {
      child = renderMark(child, mark, `${key}-mark-${index}`);
    });
    return <React.Fragment key={key}>{child}</React.Fragment>;
  }

  const children = (node.content || []).map((child, index) => renderNode(child, `${key}-${index}`));
  const style = nodeStyle(node);
  switch (node.type) {
    case "doc": return <>{children}</>;
    case "paragraph": return <p key={key} style={style}>{children.length ? children : <br />}</p>;
    case "heading": {
      const level = Math.max(2, Math.min(4, Number(node.attrs?.level) || 2));
      const Tag = `h${level}`;
      return <Tag key={key} style={style}>{children}</Tag>;
    }
    case "bulletList": return <ul key={key}>{children}</ul>;
    case "orderedList": return <ol key={key} start={Number(node.attrs?.start) || 1}>{children}</ol>;
    case "listItem": return <li key={key}>{children}</li>;
    case "blockquote": return <blockquote key={key}>{children}</blockquote>;
    case "hardBreak": return <br key={key} />;
    case "horizontalRule": return <hr key={key} />;
    case "codeBlock": return <pre key={key}><code>{children}</code></pre>;
    default: return <React.Fragment key={key}>{children}</React.Fragment>;
  }
}

export function textFromRichText(document) {
  const parts = [];
  const walk = (node) => {
    if (!node) return;
    if (node.type === "text") parts.push(node.text || "");
    else if (node.type === "hardBreak") parts.push("\n");
    else {
      (node.content || []).forEach(walk);
      if (["paragraph", "heading", "listItem"].includes(node.type)) parts.push("\n");
    }
  };
  walk(document);
  return parts.join("").replace(/\n{3,}/g, "\n\n").trim();
}

export function legacyTextToRichText(value = "") {
  const paragraphs = String(value || "").split(/\n{2,}/).map((text) => ({
    type: "paragraph",
    content: text ? [{ type: "text", text }] : []
  }));
  return { type: "doc", content: paragraphs.length ? paragraphs : [{ type: "paragraph" }] };
}

export default function RichTextRenderer({ richText, legacyText = "", className = "", style }) {
  const doc = richText && richText.type === "doc" ? richText : legacyTextToRichText(legacyText);
  return <div className={className} style={style}>{renderNode(doc, "rich-root")}</div>;
}
