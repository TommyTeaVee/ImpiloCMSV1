import React, { useMemo } from "react";
import {
  EDITORIAL_TEMPLATES,
  EDITORIAL_THEMES,
} from "./editorialTemplates.js";

function plainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getText(block) {
  return plainText(block?.content?.text || "");
}

function getMedia(block) {
  return block?.media?.url || block?.content?.url || "";
}

function MediaPreview({ block, className = "" }) {
  const url = getMedia(block);
  if (!url) {
    return (
      <div className={`impilo-preview-media-placeholder ${className}`}>
        <span>{block?.type || "MEDIA"}</span>
        <small>Select media in the block below</small>
      </div>
    );
  }

  if (block.type === "VIDEO") {
    return (
      <div className={`impilo-preview-video ${className}`}>
        <video src={url} controls muted />
      </div>
    );
  }

  if (block.type === "AUDIO") {
    return (
      <div className={`impilo-preview-audio ${className}`}>
        <audio src={url} controls />
      </div>
    );
  }

  return (
    <figure className={`impilo-preview-image ${className}`}>
      <img src={url} alt={block?.media?.altText || "IMPILO editorial visual"} />
      {block?.media?.caption && <figcaption>{block.media.caption}</figcaption>}
    </figure>
  );
}

function createBlockPool(blocks) {
  const grouped = {};

  blocks.forEach((block) => {
    const role =
      block?.content?.editorialLayout?.role ||
      block.type.toLowerCase();

    if (!grouped[role]) grouped[role] = [];
    grouped[role].push(block);
  });

  function take(role, fallbackType) {
    const exact = grouped[role]?.shift();
    if (exact) return exact;

    for (const list of Object.values(grouped)) {
      const candidate = list.find(
        (item) => item.type === fallbackType
      );

      if (candidate) {
        list.splice(list.indexOf(candidate), 1);
        return candidate;
      }
    }

    return null;
  }

  return { take };
}

export default function EditorialMagazinePreview({
  title,
  excerpt,
  blocks = [],
  templateId = "EDITORIAL_FEATURE",
  themeId = "NEUTRAL",
}) {
  const template = EDITORIAL_TEMPLATES[templateId] || EDITORIAL_TEMPLATES.EDITORIAL_FEATURE;
  const theme = EDITORIAL_THEMES[themeId] || EDITORIAL_THEMES.NEUTRAL;
  const pool = createBlockPool([...blocks]);

  const titleFallback = title || "Untitled IMPILO Feature";
  const deckFallback = excerpt || "Editorial introduction goes here.";

  const titleBlock = pool.take("title", "HEADING");
  const deckBlock = pool.take("deck", "TEXT");
  const heroBlock = pool.take(
    templateId === "PROFILE" ? "portrait-hero" : "hero",
    "IMAGE"
  ) || pool.take("hero-video", "VIDEO");
  const quoteBlock = pool.take("pull-quote", "QUOTE") || pool.take("signature-quote", "QUOTE");
  const left1 = pool.take("body-left", "TEXT");
  const right1 = pool.take("body-right", "TEXT");
  const sectionHeading = pool.take("section-heading", "HEADING");
  const left2 = pool.take("body-left", "TEXT");
  const right2 = pool.take("body-right", "TEXT");
  const callout = pool.take("callout", "TEXT");
  const inlineImage = pool.take("inline-image", "IMAGE") || pool.take("split-image", "IMAGE");

  const remainingImages = blocks.filter((block) => block.type === "IMAGE" && block.media?.url);

  const renderText = (block, fallback = "Editorial copy will appear here.") => (
    <p>{getText(block) || fallback}</p>
  );

  const paletteStyle = {
    "--preview-accent": theme.accent,
    "--preview-accent-strong": theme.accentStrong,
    "--preview-surface": theme.surface,
    "--preview-soft": theme.soft,
    "--preview-ink": theme.ink,
    "--preview-muted": theme.muted,
  };

  return (
    <section className={`impilo-magazine-preview theme-${theme.id.toLowerCase()} template-${template.id.toLowerCase()}`} style={paletteStyle}>
      <div className="impilo-magazine-preview-toolbar">
        <div>
          <span>LIVE MAGAZINE PREVIEW</span>
          <strong>{template.name}</strong>
        </div>
        <small>{theme.name} · White Editorial Page</small>
      </div>

      <article className="impilo-preview-paper">
        <header className="impilo-preview-header">
          <div className="impilo-preview-kicker">{template.eyebrow}</div>
          <h1>{getText(titleBlock) || titleFallback}</h1>
          <p className="impilo-preview-deck">{getText(deckBlock) || deckFallback}</p>
          <div className="impilo-preview-rule" />
        </header>

        {templateId === "PROFILE" ? (
          <>
            <div className="impilo-preview-profile-lead">
              <MediaPreview block={heroBlock || { type: "IMAGE" }} />
              <div className="impilo-preview-profile-copy">
                <span>EDITORIAL PROFILE</span>
                <h2>{getText(sectionHeading) || "Editorial Biography"}</h2>
                {renderText(left1, "Biography and career story will appear here.")}
                {renderText(right1, "Additional profile context will appear here.")}
              </div>
            </div>
            {quoteBlock && (
              <blockquote className="impilo-preview-pullquote">
                <span>“</span>
                {getText(quoteBlock) || "Presence turns movement into story."}
              </blockquote>
            )}
            <div className="impilo-preview-columns">
              <section>
                <span className="impilo-preview-section-label">CAREER & DIRECTION</span>
                {renderText(callout, "Career direction, runway experience and professional positioning will appear here.")}
              </section>
              <section className="impilo-preview-accent-panel">
                <strong>IMPILO EDITORIAL NOTE</strong>
                <p>Use the profile template for models, artists, creators and personality-led features.</p>
              </section>
            </div>
          </>
        ) : templateId === "PORTFOLIO" ? (
          <>
            <div className="impilo-preview-portfolio-intro">
              {renderText(deckBlock, deckFallback)}
            </div>
            <div className="impilo-preview-portfolio-grid">
              {remainingImages.slice(0, 6).map((block, index) => (
                <MediaPreview key={block.id || block.clientId || index} block={block} />
              ))}
              {remainingImages.length === 0 && (
                <>
                  <div className="impilo-preview-gallery-placeholder">IMAGE 01</div>
                  <div className="impilo-preview-gallery-placeholder">IMAGE 02</div>
                  <div className="impilo-preview-gallery-placeholder">IMAGE 03</div>
                  <div className="impilo-preview-gallery-placeholder">IMAGE 04</div>
                </>
              )}
            </div>
            {quoteBlock && (
              <blockquote className="impilo-preview-pullquote">
                <span>“</span>
                {getText(quoteBlock) || "Visual language becomes identity."}
              </blockquote>
            )}
          </>
        ) : (
          <>
            <div className="impilo-preview-lead-grid">
              <div className="impilo-preview-hero-wrap">
                <MediaPreview block={heroBlock || { type: "IMAGE" }} className="hero" />
                <span className="impilo-preview-vertical-label">{template.shortName}</span>
              </div>
              <div className="impilo-preview-lead-copy">
                <span className="impilo-preview-section-label">{template.eyebrow}</span>
                {renderText(left1, "The opening editorial paragraph introduces the story and establishes its point of view.")}
                {renderText(right1, "Supporting editorial context continues the narrative in a second column.")}
              </div>
            </div>

            {templateId === "MEDIA_FEATURE" && heroBlock?.type === "VIDEO" && (
              <div className="impilo-preview-media-band">
                <strong>MEDIA MOMENT</strong>
                <span>Interactive video sits inside the story rather than outside it.</span>
              </div>
            )}

            {quoteBlock && (
              <blockquote className="impilo-preview-pullquote">
                <span>“</span>
                {getText(quoteBlock) || "The story becomes an experience."}
              </blockquote>
            )}

            <div className="impilo-preview-section-heading">
              <span>02</span>
              <h2>{getText(sectionHeading) || "The Story Continues"}</h2>
            </div>

            <div className="impilo-preview-columns">
              <section>
                {renderText(left2 || left1, "Editorial body copy continues here with a measured magazine rhythm.")}
                {renderText(right2 || right1, "The second column adds context, analysis or supporting narrative.")}
              </section>
              <section className="impilo-preview-accent-panel">
                <strong>{templateId === "BRAND_POWER" ? "PERSPECTIVE" : "KEY IDEA"}</strong>
                {renderText(callout, "A concise editorial takeaway can be highlighted in a shaded panel.")}
              </section>
            </div>

            {inlineImage && <MediaPreview block={inlineImage} className="inline" />}

            <footer className="impilo-preview-footer">
              <span>IMPILO MAGAZINE</span>
              <span>{theme.name.toUpperCase()}</span>
            </footer>
          </>
        )}
      </article>
    </section>
  );
}
