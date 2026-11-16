import React, { useMemo, useState } from "react";


const LAYOUTS = [
  { id: "one", name: "Classic editorial", columns: 1, description: "Single-column long-form reading." },
  { id: "two", name: "Two-column magazine", columns: 2, description: "Traditional magazine text flow." },
  { id: "three", name: "Three-column grid", columns: 3, description: "Compact, information-rich sections." },
  { id: "feature", name: "Feature spread", columns: 2, description: "Large visual beside a text column." },
];

export default function LayoutBuilder({ open, title, excerpt, blocks = [], initialLayout = "two", onClose, onApply }) {
  const [selected, setSelected] = useState(initialLayout);
  const [device, setDevice] = useState("desktop");
  const [showGuides, setShowGuides] = useState(true);
  const layout = useMemo(() => LAYOUTS.find((item) => item.id === selected) || LAYOUTS[1], [selected]);
  if (!open) return null;

  const sampleBlocks = blocks.filter((block) => ["TEXT", "HEADING", "QUOTE", "IMAGE"].includes(String(block.type).toUpperCase())).slice(0, 6);
  const previewColumns = selected === "feature" ? 2 : layout.columns;

  return (
    <div className="impilo-layout-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="impilo-layout-dialog" role="dialog" aria-modal="true" aria-labelledby="impilo-layout-title">
        <header className="impilo-layout-header">
          <div><span className="impilo-layout-kicker">EDITORIAL DESIGN STUDIO</span><h2 id="impilo-layout-title">Magazine Layout Builder</h2><p>Choose a composition, preview different screen sizes, then apply it to this article.</p></div>
          <button type="button" className="impilo-layout-close" onClick={onClose} aria-label="Close layout builder">×</button>
        </header>

        <div className="impilo-layout-options">
          {LAYOUTS.map((item) => (
            <button type="button" key={item.id} className={`impilo-layout-option ${selected === item.id ? "is-selected" : ""}`} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}>
              <span className={`impilo-layout-glyph glyph-${item.id}`} aria-hidden="true"><i/><i/><i/></span>
              <strong>{item.name}</strong><small>{item.description}</small>
            </button>
          ))}
        </div>

        <div className="impilo-layout-preview-tools">
          <span>LIVE LAYOUT PREVIEW</span>
          <div className="impilo-layout-device-switch" role="group" aria-label="Preview device">
            {[ ["desktop", "Desktop"], ["tablet", "Tablet"], ["mobile", "Mobile"] ].map(([value, label]) => <button type="button" key={value} className={device === value ? "is-active" : ""} onClick={() => setDevice(value)}>{label}</button>)}
          </div>
        </div>

        <div className={`impilo-layout-stage stage-${device}`}>
          <article className={`impilo-layout-paper layout-${selected}`}>
            <div className="impilo-layout-masthead"><b>IMPILO</b><span> CULTURE · HERITAGE · PEOPLE</span></div>
            <h1>{title || "Your article headline goes here"}</h1>
            <p className="impilo-layout-deck">{excerpt || "A short editorial introduction will appear here."}</p>
            {selected === "feature" ? (
              <div className="impilo-layout-feature-grid"><div className="impilo-layout-image-placeholder"><span>FEATURE IMAGE</span></div><div className="impilo-layout-preview-copy"><h3>{sampleBlocks.find((b) => String(b.type).toUpperCase() === "HEADING")?.content?.text || "A story worth telling"}</h3><p>{sampleBlocks.find((b) => String(b.type).toUpperCase() === "TEXT")?.content?.text || "Your article content will be arranged into an editorial feature alongside its visual elements."}</p><blockquote>“A pull quote brings the heart of the story into focus.”</blockquote></div></div>
            ) : (
              <>
                <div className="impilo-layout-image-placeholder"><span>LEAD IMAGE / PHOTO</span></div>
                <div className="impilo-layout-columns" style={{ "--layout-columns": device === "mobile" ? 1 : previewColumns }}>
                  {(sampleBlocks.length ? sampleBlocks : [{type:"HEADING",content:{text:"Section heading"}},{type:"TEXT",content:{text:"Article text preview. Your editorial copy will flow into the selected column layout."}},{type:"TEXT",content:{text:"Additional paragraphs continue through the page with clear spacing and readable typography."}}]).map((block, index) => <div className="impilo-layout-preview-block" key={block.id || block.clientId || index}>
                    {String(block.type).toUpperCase() === "HEADING" ? <h3>{block.content?.text || "Section heading"}</h3> : String(block.type).toUpperCase() === "QUOTE" ? <blockquote>{block.content?.text || "Pull quote"}</blockquote> : <p>{block.content?.text || "Article paragraph preview."}</p>}
                  </div>)}
                </div>
              </>
            )}
            {showGuides && <div className="impilo-layout-guides">{device === "mobile" ? "MOBILE · SINGLE COLUMN" : `${previewColumns} COLUMN${previewColumns > 1 ? "S" : ""} · EDITORIAL GRID`}</div>}
          </article>
        </div>

        <footer className="impilo-layout-footer">
          <label><input type="checkbox" checked={showGuides} onChange={(event) => setShowGuides(event.target.checked)} /> Show layout guides</label>
          <div><button type="button" className="impilo-layout-cancel" onClick={onClose}>Cancel</button><button type="button" className="impilo-layout-apply" onClick={() => onApply({ id: selected, columns: layout.columns, devicePreview: device })}>Apply Layout</button></div>
        </footer>
      </section>
    </div>
  );
}
