import React, { useEffect, useMemo } from "react";

const THEMES = {
  NEUTRAL: {
    name: "Neutral",
    accent: "#a58216",
    accentStrong: "#d4af37",
    soft: "#f1eee8",
    paper: "#fffdf9",
    ink: "#161616",
    muted: "#666",
    header: "#f7f3ee",
    headerInk: "#151515",
  },
  SIGNATURE_GOLD: {
    name: "Signature Gold",
    accent: "#9a7511",
    accentStrong: "#d4af37",
    soft: "#f3e8bf",
    paper: "#fffdf8",
    ink: "#17130b",
    muted: "#6f654e",
    header: "#f4ecd4",
    headerInk: "#16130c",
  },
  NOIR: {
    name: "Noir",
    accent: "#242424",
    accentStrong: "#111",
    soft: "#e9e9e9",
    paper: "#fff",
    ink: "#111",
    muted: "#646464",
    header: "#151515",
    headerInk: "#fff",
  },
  RED_WINE: {
    name: "Red Wine",
    accent: "#7a0c0c",
    accentStrong: "#4e0707",
    soft: "#efdddd",
    paper: "#fffafa",
    ink: "#1c1111",
    muted: "#765e5e",
    header: "#7a0c0c",
    headerInk: "#fff",
  },
  DARK_BLUE: {
    name: "Dark Blue",
    accent: "#0b2a55",
    accentStrong: "#021027",
    soft: "#e2ecf6",
    paper: "#fbfdff",
    ink: "#0e1721",
    muted: "#617080",
    header: "#0b2a55",
    headerInk: "#fff",
  },
  EMERALD: {
    name: "Emerald",
    accent: "#008c5b",
    accentStrong: "#062e2a",
    soft: "#dcefe7",
    paper: "#fbfffd",
    ink: "#102019",
    muted: "#60786e",
    header: "#062e2a",
    headerInk: "#fff",
  },
  PURPLE: {
    name: "Purple Silk",
    accent: "#6f3697",
    accentStrong: "#341147",
    soft: "#eadcf0",
    paper: "#fffaff",
    ink: "#1b1020",
    muted: "#6f5f75",
    header: "#341147",
    headerInk: "#fff",
  },
  LIME: {
    name: "Lime",
    accent: "#697d16",
    accentStrong: "#b8d232",
    soft: "#e9f1bd",
    paper: "#fefff7",
    ink: "#172006",
    muted: "#687348",
    header: "#283001",
    headerInk: "#fff",
  },
  SILVER: {
    name: "Silver",
    accent: "#667078",
    accentStrong: "#34383d",
    soft: "#e4e7e9",
    paper: "#fff",
    ink: "#1a1d20",
    muted: "#646b71",
    header: "#34383d",
    headerInk: "#fff",
  },
};

const TEMPLATE_NAMES = {
  EDITORIAL_FEATURE: "Editorial Feature",
  PROFILE: "Profile / Model",
  BRAND_POWER: "Brand Power",
  EDUCATIONAL: "Educational / Essay",
  MEDIA_FEATURE: "Media Feature",
  PORTFOLIO: "Visual Portfolio",
};

function plainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function blockText(block) {
  return plainText(block?.content?.text || "");
}

function blockRole(block) {
  return block?.content?.editorialLayout?.role || "";
}

function isFootnoteBlock(block) {
  const layout = block?.content?.editorialLayout || {};
  return (
    block?.type === "TEXT" &&
    (layout.variant === "FOOTNOTE" ||
      layout.role === "footnote" ||
      block?.content?.footnote === true)
  );
}

function mediaUrl(block) {
  return block?.media?.url || block?.content?.url || "";
}

export function getEditorialPreviewMetadata(blocks = []) {
  for (const block of blocks) {
    const metadata = block?.content?.editorialLayout;
    if (!metadata) continue;

    if (TEMPLATE_NAMES[metadata.template]) {
      return {
        templateId: metadata.template,
        themeId: THEMES[metadata.theme] ? metadata.theme : "NEUTRAL",
      };
    }
  }

  return {
    templateId: "EDITORIAL_FEATURE",
    themeId: "NEUTRAL",
  };
}

function slotPool(blocks) {
  const groups = {};

  blocks.forEach((block) => {
    const role = blockRole(block);
    const type = block?.type || "";
    const key = role || `type:${type}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(block);
  });

  const consumed = new Set();

  function take(role, type = null) {
    const direct = groups[role] || [];
    const directBlock = direct.find((item) => !consumed.has(item));
    if (directBlock) {
      consumed.add(directBlock);
      return directBlock;
    }

    const fallback = blocks.find(
      (item) =>
        !consumed.has(item) &&
        (!type || item.type === type) &&
        !(type === "TEXT" && isFootnoteBlock(item))
    );

    if (fallback) {
      consumed.add(fallback);
      return fallback;
    }

    return null;
  }

  function rest() {
    return blocks.filter((block) => !consumed.has(block));
  }

  return { take, rest };
}

function Media({ block, className = "", aspect = "landscape" }) {
  const url = mediaUrl(block);
  const type = block?.type;

  if (!url) {
    return (
      <div className={`impilo-article-preview-media-placeholder ${className}`}>
        <span>{type || "MEDIA"}</span>
        <small>Media selected in the editor will appear here.</small>
      </div>
    );
  }

  if (type === "VIDEO") {
    return (
      <figure className={`impilo-article-preview-media ${className} aspect-${aspect}`}>
        <video src={url} controls playsInline preload="metadata" />
        {block?.media?.caption && <figcaption>{block.media.caption}</figcaption>}
      </figure>
    );
  }

  if (type === "AUDIO") {
    return (
      <figure className={`impilo-article-preview-audio ${className}`}>
        <div className="impilo-article-preview-audio-label">IMPILO AUDIO</div>
        <audio src={url} controls preload="metadata" />
        {block?.media?.caption && <figcaption>{block.media.caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className={`impilo-article-preview-media ${className} aspect-${aspect}`}>
      <img
        src={url}
        alt={block?.media?.altText || block?.media?.caption || "IMPILO editorial visual"}
        loading="lazy"
      />
      {block?.media?.caption && <figcaption>{block.media.caption}</figcaption>}
    </figure>
  );
}

function Paragraph({ block, className = "" }) {
  const text = blockText(block);
  if (!text) return null;
  return <p className={className}>{text}</p>;
}

function Heading({ block, fallback, className = "" }) {
  const text = blockText(block) || fallback;
  if (!text) return null;
  return <h2 className={className}>{text}</h2>;
}

function Quote({ block }) {
  const text = blockText(block);
  if (!text) return null;
  return (
    <blockquote className="impilo-article-preview-quote">
      <span className="quote-mark">“</span>
      <span className="quote-kicker">IMPILO PERSPECTIVE</span>
      <p>{text}</p>
      <span className="quote-ornament" aria-hidden="true" />
    </blockquote>
  );
}

function FootnoteSection({ blocks }) {
  const notes = blocks.filter(isFootnoteBlock);
  if (!notes.length) return null;

  return (
    <section className="impilo-article-preview-footnotes" aria-label="References and footnotes">
      <div className="footnotes-heading">
        <span>REFERENCES</span>
        <i aria-hidden="true" />
      </div>
      <ol>
        {notes.map((block, index) => {
          const text = blockText(block);
          const source = plainText(block?.content?.source || "");
          const url = block?.content?.url || "";

          if (!text && !source) return null;

          return (
            <li key={block.id || block.clientId || `footnote-${index}`}>
              <div>
                {text && <span>{text}</span>}
                {source && (
                  <small>
                    {source}
                    {url ? (
                      <> · <a href={url} target="_blank" rel="noreferrer">Source</a></>
                    ) : null}
                  </small>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function BaseHeader({ title, excerpt, eyebrow, theme }) {
  return (
    <header
      className="impilo-article-preview-header"
      style={{ background: theme.header, color: theme.headerInk }}
    >
      <div className="impilo-article-preview-header-ribbon">
        <span>IMPILO</span>
      </div>

      <div className="impilo-article-preview-header-seal" aria-hidden="true">
        <span>IM</span>
      </div>

      <div className="impilo-article-preview-header-inner">
        <div className="impilo-article-preview-header-topline">
          <span className="impilo-article-preview-eyebrow">{eyebrow}</span>
          <span className="impilo-article-preview-issue-mark">01 <i /></span>
        </div>

        <h1>{title || "Untitled Article"}</h1>
        {excerpt && <p>{excerpt}</p>}

        <div className="impilo-article-preview-header-footerline">
          <span className="impilo-article-preview-rule" style={{ background: theme.accentStrong }} />
          <span>THE HEARTBEAT OF INNOVATION</span>
        </div>
      </div>
    </header>
  );
}

function FeatureTemplate({ slots, theme }) {
  const hero = slots.take("hero", "IMAGE") || slots.take("hero-video", "VIDEO");
  const left = slots.take("body-left", "TEXT");
  const right = slots.take("body-right", "TEXT");
  const quote = slots.take("pull-quote", "QUOTE");
  const section = slots.take("section-heading", "HEADING");
  const body2 = slots.take("body-left", "TEXT");
  const body3 = slots.take("body-right", "TEXT");
  const inline = slots.take("inline-image", "IMAGE");

  return (
    <>
      <div className="impilo-article-preview-feature-lead">
        <div className="impilo-feature-hero-frame">
          <span className="impilo-feature-ribbon">FEATURE</span>
          <Media block={hero || { type: "IMAGE" }} className="feature-hero" aspect="wide" />
        </div>
        <div className="feature-intro">
          <span>THE STORY</span>
          <Paragraph block={left} />
          <Paragraph block={right} />
        </div>
      </div>
      {quote && <Quote block={quote} />}
      <div className="impilo-article-preview-section-title">
        <span className="impilo-section-number">02</span>
        <div className="impilo-section-title-copy">
          <span className="impilo-section-kicker">IMPILO / THE STORY</span>
          <Heading block={section} fallback="The Story Continues" />
        </div>
        <span className="impilo-section-shape" aria-hidden="true" />
      </div>
      <div className="impilo-article-preview-two-col">
        <Paragraph block={body2} />
        <Paragraph block={body3} />
      </div>
      {inline && <Media block={inline} className="feature-inline" aspect="landscape" />}
      <div className="impilo-article-preview-accent-strip" style={{ background: theme.soft, borderColor: theme.accent }}>
        <span style={{ color: theme.accent }}>IMPILO EDITORIAL NOTE</span>
        <p>Use Feature for fashion, culture, design, business and long-form storytelling.</p>
      </div>
    </>
  );
}

function ProfileTemplate({ slots }) {
  const hero = slots.take("portrait-hero", "IMAGE") || slots.take("hero", "IMAGE");
  const bioHeading = slots.take("section-heading", "HEADING");
  const bio1 = slots.take("body-left", "TEXT");
  const bio2 = slots.take("body-right", "TEXT");
  const quote = slots.take("signature-quote", "QUOTE") || slots.take("pull-quote", "QUOTE");
  const careerHeading = slots.take("section-heading", "HEADING");
  const career1 = slots.take("body-left", "TEXT");
  const career2 = slots.take("body-right", "TEXT");
  const small = slots.take("portrait-small", "IMAGE");

  return (
    <>
      <div className="impilo-article-preview-profile-lead">
        <Media block={hero || { type: "IMAGE" }} aspect="portrait" />
        <div className="profile-lead-copy">
          <span>PROFILE / EDITORIAL</span>
          <Heading block={bioHeading} fallback="Editorial Biography" />
          <Paragraph block={bio1} />
          <Paragraph block={bio2} />
        </div>
      </div>
      {quote && <Quote block={quote} />}
      <div className="impilo-article-preview-section-title">
        <span className="impilo-section-number">03</span>
        <div className="impilo-section-title-copy">
          <span className="impilo-section-kicker">PROFILE / DIRECTION</span>
          <Heading block={careerHeading} fallback="Career & Direction" />
        </div>
        <span className="impilo-section-shape" aria-hidden="true" />
      </div>
      <div className="impilo-article-preview-profile-story">
        <div>
          <Paragraph block={career1} />
          <Paragraph block={career2} />
        </div>
        {small ? <Media block={small} aspect="portrait" /> : null}
      </div>
    </>
  );
}

function BrandPowerTemplate({ slots, theme }) {
  const leadText = slots.take("body-full", "TEXT") || slots.take("dropcap", "TEXT");
  const hero = slots.take("hero", "IMAGE") || slots.take("hero-video", "VIDEO") || slots.take("split-image", "IMAGE");
  const section = slots.take("section-heading", "HEADING");
  const left = slots.take("body-left", "TEXT");
  const right = slots.take("body-right", "TEXT");
  const quote = slots.take("pull-quote", "QUOTE");
  const secondText = slots.take("body-full", "TEXT");
  const insight = slots.take("insight-heading", "HEADING");
  const callout = slots.take("callout", "TEXT");

  return (
    <>
      {hero && <Media block={hero} className="brand-hero" aspect="wide" />}
      <Paragraph block={leadText} className="impilo-article-preview-dropcap" />
      {quote && <Quote block={quote} />}
      <div className="impilo-article-preview-brand-grid">
        <div>
          <Heading block={section} fallback="Best Impressions Last" />
          <Paragraph block={left} />
        </div>
        <div>
          <Paragraph block={right} />
        </div>
      </div>
      <div className="impilo-article-preview-brand-band" style={{ borderColor: theme.accent }}>
        <span style={{ color: theme.accent }}>PERSPECTIVE</span>
        <Heading block={insight} fallback="Perspective as Competitive Edge" />
        <Paragraph block={callout} />
      </div>
      <Paragraph block={secondText} />
    </>
  );
}

function EducationalTemplate({ slots, theme }) {
  const hero = slots.take("hero", "IMAGE");
  const dropcap = slots.take("dropcap", "TEXT") || slots.take("body-full", "TEXT");
  const heading = slots.take("section-heading", "HEADING");
  const left = slots.take("body-left", "TEXT");
  const right = slots.take("body-right", "TEXT");
  const quote = slots.take("pull-quote", "QUOTE");
  const keyHeading = slots.take("section-heading", "HEADING");
  const callout = slots.take("callout", "TEXT");
  const body = slots.take("body-full", "TEXT");

  return (
    <>
      {hero && <Media block={hero} className="educational-hero" aspect="wide" />}
      <Paragraph block={dropcap} className="impilo-article-preview-dropcap" />
      <div className="impilo-article-preview-section-title">
        <span className="impilo-section-number">01</span>
        <div className="impilo-section-title-copy">
          <span className="impilo-section-kicker">IMPILO / INSIGHT</span>
          <Heading block={heading} fallback="Understanding the Issue" />
        </div>
        <span className="impilo-section-shape" aria-hidden="true" />
      </div>
      <div className="impilo-article-preview-two-col">
        <Paragraph block={left} />
        <Paragraph block={right} />
      </div>
      {quote && <Quote block={quote} />}
      <div className="impilo-article-preview-insight" style={{ background: theme.soft, borderLeftColor: theme.accentStrong }}>
        <span style={{ color: theme.accent }}>KEY CONSIDERATIONS</span>
        <Heading block={keyHeading} fallback="Key Considerations" />
        <Paragraph block={callout} />
      </div>
      <Paragraph block={body} />
    </>
  );
}

function MediaFeatureTemplate({ slots, theme }) {
  const hero = slots.take("hero-video", "VIDEO") || slots.take("hero", "IMAGE") || slots.take("split-image", "IMAGE");
  const body = slots.take("body-full", "TEXT");
  const image = slots.take("split-image", "IMAGE") || slots.take("inline-image", "IMAGE");
  const side = slots.take("body-right", "TEXT");
  const quote = slots.take("pull-quote", "QUOTE");
  const second = slots.take("body-full", "TEXT");
  const audio = slots.take("audio", "AUDIO");

  return (
    <>
      <Media block={hero || { type: "VIDEO" }} className="media-hero" aspect="wide" />
      <div className="impilo-article-preview-media-band" style={{ background: theme.soft, borderColor: theme.accent }}>
        <strong>MEDIA MOMENT</strong>
        <span>Video, image and sound are treated as part of the editorial story.</span>
      </div>
      <Paragraph block={body} />
      <div className="impilo-article-preview-media-split">
        {image && <Media block={image} aspect="landscape" />}
        <Paragraph block={side} />
      </div>
      {quote && <Quote block={quote} />}
      {audio && <Media block={audio} className="audio-band" />}
      <Paragraph block={second} />
    </>
  );
}

function PortfolioTemplate({ slots }) {
  const images = [];
  let block;
  while ((block = slots.take("gallery-1", "IMAGE"))) images.push(block);
  const remaining = slots.rest().filter((item) => item.type === "IMAGE");
  const gallery = [...images, ...remaining].slice(0, 9);
  const quote = slots.take("gallery-quote", "QUOTE") || slots.take("pull-quote", "QUOTE");

  return (
    <>
      <div className="impilo-article-preview-portfolio-intro">
        <div>
          <span>VISUAL PORTFOLIO</span>
          <h2>Frames of the story</h2>
        </div>
        <i aria-hidden="true" />
        <p>Images, captions and personality-driven storytelling arranged as an editorial spread.</p>
      </div>
      <div className="impilo-article-preview-portfolio-grid">
        {gallery.length ? (
          gallery.map((item, index) => (
            <Media
              key={item.id || item.clientId || `portfolio-${index}`}
              block={item}
              aspect={index === 0 ? "portrait" : index === 3 ? "wide" : "landscape"}
            />
          ))
        ) : (
          [1, 2, 3, 4].map((number) => (
            <div key={number} className="impilo-article-preview-gallery-placeholder">
              IMAGE {String(number).padStart(2, "0")}
            </div>
          ))
        )}
      </div>
      {quote && <Quote block={quote} />}
    </>
  );
}

function GenericTemplate({ slots }) {
  return (
    <div className="impilo-article-preview-generic">
      {slots.rest().map((block, index) => {
        if (isFootnoteBlock(block)) return null;
        if (block.type === "HEADING") return <Heading key={block.id || block.clientId || index} block={block} />;
        if (block.type === "QUOTE") return <Quote key={block.id || block.clientId || index} block={block} />;
        if (["IMAGE", "VIDEO", "AUDIO"].includes(block.type)) return <Media key={block.id || block.clientId || index} block={block} />;
        return <Paragraph key={block.id || block.clientId || index} block={block} />;
      })}
    </div>
  );
}

export function ArticlePreviewDocument({
  title = "",
  excerpt = "",
  blocks = [],
  templateId = "EDITORIAL_FEATURE",
  themeId = "NEUTRAL",
}) {
  const theme = THEMES[themeId] || THEMES.NEUTRAL;
  const resolvedTemplate = TEMPLATE_NAMES[templateId] ? templateId : "EDITORIAL_FEATURE";
  const titleBlock = blocks.find((block) => blockRole(block) === "title");
  const deckBlock = blocks.find((block) => blockRole(block) === "deck");
  const displayTitle = blockText(titleBlock) || title || "Untitled Article";
  const displayExcerpt = blockText(deckBlock) || excerpt || "";
  const eyebrowMap = {
    EDITORIAL_FEATURE: "IMPILO EDITORIAL",
    PROFILE: "PROFILE / EDITORIAL",
    BRAND_POWER: "EDITORIAL · BRAND POWER",
    EDUCATIONAL: "IMPILO INSIGHT",
    MEDIA_FEATURE: "IMPILO MEDIA",
    PORTFOLIO: "VISUAL PORTFOLIO",
  };

  const slots = useMemo(() => slotPool(blocks), [blocks]);

  return (
    <div
      className={`impilo-article-preview-document template-${resolvedTemplate.toLowerCase()}`}
      style={{
        "--iap-accent": theme.accent,
        "--iap-accent-strong": theme.accentStrong,
        "--iap-soft": theme.soft,
        "--iap-paper": theme.paper,
        "--iap-ink": theme.ink,
        "--iap-muted": theme.muted,
      }}
    >
      <BaseHeader
        title={displayTitle}
        excerpt={displayExcerpt}
        eyebrow={eyebrowMap[resolvedTemplate]}
        theme={theme}
      />

      <main className="impilo-article-preview-body">
        {resolvedTemplate === "EDITORIAL_FEATURE" && <FeatureTemplate slots={slots} theme={theme} />}
        {resolvedTemplate === "PROFILE" && <ProfileTemplate slots={slots} />}
        {resolvedTemplate === "BRAND_POWER" && <BrandPowerTemplate slots={slots} theme={theme} />}
        {resolvedTemplate === "EDUCATIONAL" && <EducationalTemplate slots={slots} theme={theme} />}
        {resolvedTemplate === "MEDIA_FEATURE" && <MediaFeatureTemplate slots={slots} theme={theme} />}
        {resolvedTemplate === "PORTFOLIO" && <PortfolioTemplate slots={slots} />}
        {!TEMPLATE_NAMES[resolvedTemplate] && <GenericTemplate slots={slots} />}

        <FootnoteSection blocks={blocks} />

        <footer className="impilo-article-preview-footer">
          <span>IMPILO MAGAZINE</span>
          <span>{TEMPLATE_NAMES[resolvedTemplate]}</span>
          <span>{theme.name}</span>
        </footer>
      </main>
    </div>
  );
}

export default function EditorialArticlePreview({
  open = false,
  onClose,
  title = "",
  excerpt = "",
  blocks = [],
  templateId = "EDITORIAL_FEATURE",
  themeId = "NEUTRAL",
  standalone = false,
}) {
  useEffect(() => {
    if (standalone || !open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose, standalone]);

  const documentView = (
    <div className="impilo-article-preview-shell">
      <div className="impilo-article-preview-meta-bar">
        <div>
          <span>ARTICLE PREVIEW</span>
          <strong>{TEMPLATE_NAMES[templateId] || "IMPILO Editorial"}</strong>
        </div>
        <div className="impilo-article-preview-meta-right">
          <small>{THEMES[themeId]?.name || "Neutral"}</small>
          {!standalone && (
            <button type="button" onClick={onClose} aria-label="Close article preview">
              Close Preview
            </button>
          )}
        </div>
      </div>
      <div className="impilo-article-preview-scroll">
        <ArticlePreviewDocument
          title={title}
          excerpt={excerpt}
          blocks={blocks}
          templateId={templateId}
          themeId={themeId}
        />
      </div>
    </div>
  );

  if (standalone) {
    return (
      <>
        <style>{PREVIEW_CSS}</style>
        <div className="impilo-article-preview-page">{documentView}</div>
      </>
    );
  }

  if (!open) return null;

  return (
    <>
      <style>{PREVIEW_CSS}</style>
      <div className="impilo-article-preview-overlay" role="dialog" aria-modal="true" aria-label="Article preview">
        {documentView}
      </div>
    </>
  );
}

const PREVIEW_CSS = `
/* ============================================================
   IMPILO LUXE EDITORIAL PREVIEW
   Visual language: editorial fashion + graphic design + calm
   negative space.  White paper remains the default surface.
   ============================================================ */
.impilo-article-preview-page-status {
  min-height:100vh;
  display:grid;
  place-items:center;
  padding:40px;
  background:#e9e3db;
  font-family:Montserrat,Arial,sans-serif;
  color:#171717;
  box-sizing:border-box;
}
.impilo-article-preview-page-status>div {
  width:min(620px,100%);
  padding:44px;
  background:#fffdf9;
  box-shadow:0 26px 70px rgba(0,0,0,.16);
  border-top:4px solid #d4af37;
  box-sizing:border-box;
}
.impilo-article-preview-page-status span {font-size:.62rem;letter-spacing:.18em;font-weight:700;color:#9a7511;}
.impilo-article-preview-page-status h1 {font-family:Playfair Display,Didot,Georgia,serif;font-size:2rem;margin:12px 0;}
.impilo-article-preview-page-status p {font-size:.88rem;line-height:1.7;color:#666;}
.impilo-article-preview-page-status button {margin-top:16px;border:1px solid #222;background:#111;color:#fff;border-radius:999px;padding:11px 16px;cursor:pointer;}

.impilo-article-preview-overlay,
.impilo-article-preview-page {
  --iap-shadow:0 30px 100px rgba(0,0,0,.28);
  --iap-gold:#d4af37;
  --iap-purple:#5b2b82;
  --iap-orange:#ff7a18;
  --iap-pink:#ff5fa2;
  --iap-lime:#d6e84e;
  --iap-blue:#0b2a55;
  --iap-emerald:#008c5b;
  --iap-wine:#7a0c0c;
  --iap-silver:#c7cbd1;
  font-family:Montserrat,Arial,sans-serif;
  color:var(--iap-ink,#161616);
}
.impilo-article-preview-overlay {
  position:fixed;
  inset:0;
  z-index:99999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
  background:rgba(6,6,6,.78);
  backdrop-filter:blur(14px);
}
.impilo-article-preview-page {
  min-height:100vh;
  background:#e9e3db;
  padding:28px;
  box-sizing:border-box;
}
.impilo-article-preview-shell {
  width:min(1080px,97vw);
  height:min(94vh,1080px);
  display:flex;
  flex-direction:column;
  background:#0b0b0b;
  border:1px solid rgba(212,175,55,.42);
  border-radius:22px;
  overflow:hidden;
  box-shadow:var(--iap-shadow);
}
.impilo-article-preview-page .impilo-article-preview-shell {
  width:min(1080px,100%);
  height:auto;
  min-height:calc(100vh - 56px);
  margin:0 auto;
}
.impilo-article-preview-meta-bar {
  flex:0 0 auto;
  min-height:58px;
  padding:11px 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
  color:#fff;
  background:linear-gradient(90deg,#050505,#111,#050505);
  border-bottom:1px solid rgba(255,255,255,.09);
  box-sizing:border-box;
}
.impilo-article-preview-meta-bar span,
.impilo-article-preview-meta-right small {
  display:block;
  font-size:.59rem;
  letter-spacing:.18em;
  text-transform:uppercase;
  opacity:.58;
}
.impilo-article-preview-meta-bar strong {
  display:block;
  margin-top:3px;
  font-family:Playfair Display,Didot,Georgia,serif;
  font-size:1rem;
  font-weight:600;
}
.impilo-article-preview-meta-right {display:flex;align-items:center;gap:12px;}
.impilo-article-preview-meta-right button {
  border:1px solid rgba(212,175,55,.65);
  background:rgba(255,255,255,.015);
  color:#fff;
  border-radius:999px;
  padding:8px 14px;
  cursor:pointer;
  font-size:.69rem;
}
.impilo-article-preview-meta-right button:hover {background:rgba(212,175,55,.12);}
.impilo-article-preview-scroll {
  min-height:0;
  overflow:auto;
  background:
    radial-gradient(circle at 14% 12%,rgba(212,175,55,.08),transparent 28%),
    linear-gradient(135deg,#ece7df,#ddd6cb);
  padding:30px;
  box-sizing:border-box;
}
.impilo-article-preview-document {
  position:relative;
  width:min(860px,100%);
  margin:0 auto;
  background:var(--iap-paper,#fffdf9);
  color:var(--iap-ink,#161616);
  box-shadow:0 28px 70px rgba(0,0,0,.19);
  overflow:hidden;
  isolation:isolate;
}
.impilo-article-preview-document::before {
  content:"";
  position:absolute;
  inset:0 0 auto 0;
  height:4px;
  background:linear-gradient(90deg,var(--iap-accent-strong),#d4af37,var(--iap-accent));
  z-index:7;
}
.impilo-article-preview-document::after {
  content:"";
  position:absolute;
  right:-90px;
  bottom:-110px;
  width:260px;
  height:260px;
  border:1px solid color-mix(in srgb,var(--iap-accent) 30%,transparent);
  border-radius:50%;
  transform:rotate(18deg);
  pointer-events:none;
}

/* ---------- HEADER ---------- */
.impilo-article-preview-header {
  position:relative;
  min-height:340px;
  display:flex;
  align-items:flex-end;
  overflow:hidden;
  box-sizing:border-box;
}
.impilo-article-preview-header::before {
  content:"";
  position:absolute;
  left:-130px;
  top:-170px;
  width:420px;
  height:420px;
  border-radius:50%;
  border:1px solid rgba(255,255,255,.16);
  box-shadow:0 0 0 30px rgba(255,255,255,.025),0 0 0 60px rgba(255,255,255,.018);
}
.impilo-article-preview-header::after {
  content:"";
  position:absolute;
  right:-8%;
  bottom:-42%;
  width:52%;
  height:88%;
  background:linear-gradient(135deg,transparent 0 38%,rgba(212,175,55,.16) 38.2% 39%,transparent 39.2% 100%);
  transform:rotate(-8deg);
  pointer-events:none;
}
.impilo-article-preview-header-ribbon {
  position:absolute;
  top:34px;
  right:-38px;
  width:170px;
  height:31px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(90deg,var(--iap-accent-strong),var(--iap-accent),#d4af37);
  color:#fff;
  transform:rotate(40deg);
  box-shadow:0 8px 22px rgba(0,0,0,.18);
  z-index:5;
}
.impilo-article-preview-header-ribbon::after {
  content:"";
  position:absolute;
  right:-10px;
  top:0;
  width:0;
  height:0;
  border-top:15.5px solid transparent;
  border-bottom:15.5px solid transparent;
  border-left:10px solid #d4af37;
}
.impilo-article-preview-header-ribbon span {font-size:.55rem;font-weight:800;letter-spacing:.3em;transform:translateX(5px);}
.impilo-article-preview-header-seal {
  position:absolute;
  top:24px;
  left:26px;
  width:54px;
  height:54px;
  display:grid;
  place-items:center;
  border:1px solid rgba(255,255,255,.32);
  border-radius:50%;
  background:rgba(0,0,0,.10);
  backdrop-filter:blur(5px);
  z-index:4;
}
.impilo-article-preview-header-seal::before {
  content:"";
  position:absolute;
  inset:5px;
  border:1px solid rgba(212,175,55,.8);
  border-radius:50%;
}
.impilo-article-preview-header-seal span {font-family:Playfair Display,Didot,Georgia,serif;font-size:.9rem;letter-spacing:.08em;}
.impilo-article-preview-header-inner {
  position:relative;
  z-index:3;
  width:100%;
  padding:74px 62px 48px;
  box-sizing:border-box;
}
.impilo-article-preview-header-topline {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  margin-bottom:19px;
}
.impilo-article-preview-eyebrow {
  display:inline-flex;
  align-items:center;
  gap:10px;
  margin-bottom:0;
  font-size:.58rem;
  font-weight:800;
  letter-spacing:.2em;
  text-transform:uppercase;
  opacity:.8;
}
.impilo-article-preview-eyebrow::before {content:"";width:28px;height:1px;background:currentColor;opacity:.55;}
.impilo-article-preview-issue-mark {font-size:.57rem;letter-spacing:.12em;opacity:.72;display:inline-flex;align-items:center;gap:8px;}
.impilo-article-preview-issue-mark i {display:block;width:27px;height:1px;background:currentColor;opacity:.45;}
.impilo-article-preview-header h1 {
  max-width:760px;
  margin:0;
  font-family:Playfair Display,Didot,Georgia,serif;
  font-size:clamp(2.45rem,6vw,5.4rem);
  line-height:.9;
  letter-spacing:-.045em;
  text-wrap:balance;
}
.impilo-article-preview-header p {
  max-width:650px;
  margin:20px 0 0;
  font-size:.85rem;
  line-height:1.7;
  opacity:.76;
}
.impilo-article-preview-header-footerline {display:flex;align-items:center;gap:16px;margin-top:26px;}
.impilo-article-preview-header-footerline > span:last-child {font-size:.52rem;letter-spacing:.2em;opacity:.48;}
.impilo-article-preview-rule {display:block;width:78px;height:3px;flex:0 0 auto;}

/* ---------- BODY ---------- */
.impilo-article-preview-body {position:relative;padding:38px 62px 62px;box-sizing:border-box;}
.impilo-article-preview-body::before {
  content:"";
  position:absolute;
  left:22px;
  top:38px;
  width:1px;
  height:190px;
  background:linear-gradient(var(--iap-accent-strong),transparent);
  opacity:.42;
}
.impilo-article-preview-body p {margin:0 0 18px;font-size:.88rem;line-height:1.86;max-width:70ch;}
.impilo-article-preview-body h2 {margin:0;font-family:Playfair Display,Didot,Georgia,serif;font-size:1.72rem;line-height:1.02;letter-spacing:-.02em;}

/* ---------- FEATURE ---------- */
.impilo-article-preview-feature-lead {display:grid;grid-template-columns:1.55fr .78fr;gap:34px;align-items:end;}
.impilo-feature-hero-frame {position:relative;margin:0;}
.impilo-feature-hero-frame::before {content:"";position:absolute;inset:12px -11px -11px 12px;border:1px solid var(--iap-accent);opacity:.38;z-index:0;}
.impilo-feature-hero-frame > .impilo-article-preview-media {position:relative;z-index:1;margin:0;}
.impilo-feature-ribbon {
  position:absolute;
  left:-13px;
  top:20px;
  z-index:4;
  padding:8px 16px 8px 12px;
  background:linear-gradient(90deg,var(--iap-accent-strong),var(--iap-accent));
  color:#fff;
  font-size:.54rem;
  font-weight:800;
  letter-spacing:.19em;
  box-shadow:0 8px 18px rgba(0,0,0,.14);
}
.impilo-feature-ribbon::after {content:"";position:absolute;right:-9px;top:0;border-top:16px solid transparent;border-bottom:16px solid transparent;border-left:9px solid var(--iap-accent);}
.feature-intro {position:relative;padding:0 0 6px 8px;}
.feature-intro::before {content:"";position:absolute;left:0;top:2px;width:3px;height:70px;background:linear-gradient(var(--iap-accent-strong),transparent);}
.feature-intro > span {display:block;margin:0 0 12px 14px;color:var(--iap-accent);font-size:.56rem;font-weight:800;letter-spacing:.18em;}
.feature-intro p {margin-left:14px;}
.template-editorial_feature .impilo-article-preview-body > .impilo-article-preview-quote {margin-left:34px;}

/* ---------- PROFILE ---------- */
.template-profile .impilo-article-preview-header {min-height:365px;}
.impilo-article-preview-profile-lead {display:grid;grid-template-columns:.88fr 1.12fr;gap:40px;align-items:center;}
.template-profile .impilo-article-preview-profile-lead > .impilo-article-preview-media {margin:8px 0 0;box-shadow:18px 20px 0 var(--iap-soft);}
.profile-lead-copy {position:relative;padding:18px 0 18px 8px;}
.profile-lead-copy::after {content:"";position:absolute;right:-14px;top:-8px;width:78px;height:78px;border-radius:50%;border:1px solid var(--iap-accent);opacity:.34;}
.profile-lead-copy > span {display:block;margin-bottom:10px;color:var(--iap-accent);font-size:.56rem;font-weight:800;letter-spacing:.19em;}
.profile-lead-copy h2 {max-width:520px;font-size:2.1rem;}

/* ---------- BRAND POWER ---------- */
.template-brand_power .impilo-article-preview-header {min-height:380px;}
.template-brand_power .impilo-article-preview-header::after {background:linear-gradient(132deg,transparent 0 42%,rgba(214,232,78,.18) 42.3% 43.2%,transparent 43.5% 100%);}
.template-brand_power .impilo-article-preview-header-ribbon {background:linear-gradient(90deg,#111,#333,#d4af37);}
.template-brand_power .impilo-article-preview-header-ribbon::after {border-left-color:#d4af37;}
.template-brand_power .impilo-article-preview-body {padding-top:44px;}
.template-brand_power .brand-hero {margin-bottom:34px;box-shadow:12px 12px 0 var(--iap-soft);}
.template-brand_power .impilo-article-preview-dropcap {font-size:.94rem;max-width:72ch;}
.template-brand_power .impilo-article-preview-dropcap:first-letter {float:left;margin:5px 13px 0 0;font-family:Playfair Display,Didot,Georgia,serif;font-size:5.3rem;line-height:.72;font-weight:600;color:var(--iap-accent-strong);text-shadow:8px 8px 0 rgba(214,232,78,.32);}
.impilo-article-preview-brand-grid {display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-top:26px;padding:28px 0;border-top:1px solid rgba(0,0,0,.11);border-bottom:1px solid rgba(0,0,0,.11);}
.impilo-article-preview-brand-grid > div:first-child {padding-right:24px;border-right:1px solid rgba(0,0,0,.1);}
.impilo-article-preview-brand-band {position:relative;margin:34px 0;padding:28px 30px 30px;border:1px solid var(--iap-accent);background:linear-gradient(135deg,var(--iap-soft),rgba(255,255,255,.2));overflow:hidden;}
.impilo-article-preview-brand-band::before {content:"";position:absolute;right:-28px;top:-28px;width:88px;height:88px;background:var(--iap-accent);opacity:.12;transform:rotate(45deg);}
.impilo-article-preview-brand-band span {display:block;margin-bottom:8px;color:var(--iap-accent);font-size:.55rem;font-weight:800;letter-spacing:.18em;}
.impilo-article-preview-brand-band h2 {margin-bottom:12px;}

/* ---------- EDUCATIONAL ---------- */
.template-educational .impilo-article-preview-header {min-height:305px;}
.template-educational .impilo-article-preview-body {padding-top:44px;}
.template-educational .impilo-article-preview-body::before {height:280px;}
.impilo-article-preview-dropcap {position:relative;}
.template-educational .impilo-article-preview-dropcap::after {content:"";float:right;width:82px;height:82px;margin:0 0 12px 18px;border:1px solid var(--iap-accent);border-radius:50%;opacity:.18;}
.impilo-article-preview-section-title {position:relative;display:grid;grid-template-columns:58px 1fr 24px;gap:18px;align-items:center;margin:42px 0 22px;padding:17px 0 14px;border-top:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.06);}
.impilo-section-number {display:grid;place-items:center;width:42px;height:42px;background:var(--iap-accent-strong);color:#fff;font-family:Playfair Display,Didot,Georgia,serif;font-size:.9rem;border-radius:50%;box-shadow:6px 6px 0 var(--iap-soft);}
.impilo-section-title-copy {min-width:0;}
.impilo-section-kicker {display:block;margin-bottom:7px;color:var(--iap-accent);font-size:.52rem;font-weight:800;letter-spacing:.17em;}
.impilo-section-shape {width:13px;height:13px;background:var(--iap-accent);transform:rotate(45deg);justify-self:end;opacity:.82;}
.impilo-article-preview-two-col {display:grid;grid-template-columns:1fr 1fr;gap:32px;}
.impilo-article-preview-insight {position:relative;margin:34px 0;padding:25px 28px 26px;border:1px solid var(--iap-accent);border-left:5px solid var(--iap-accent-strong);background:linear-gradient(135deg,var(--iap-soft),transparent);overflow:hidden;}
.impilo-article-preview-insight::after {content:"";position:absolute;right:-24px;bottom:-24px;width:76px;height:76px;border:1px solid var(--iap-accent);transform:rotate(45deg);opacity:.28;}
.impilo-article-preview-insight span {display:block;margin-bottom:8px;color:var(--iap-accent);font-size:.55rem;font-weight:800;letter-spacing:.18em;}
.impilo-article-preview-insight h2 {margin-bottom:10px;}

/* ---------- MEDIA FEATURE ---------- */
.template-media_feature .impilo-article-preview-header {min-height:310px;}
.template-media_feature .media-hero {position:relative;margin:0 0 30px;border:10px solid var(--iap-soft);box-shadow:0 0 0 1px rgba(0,0,0,.08);}
.impilo-article-preview-media-band {position:relative;display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;margin:22px 0 30px;padding:16px 18px 16px 20px;background:linear-gradient(90deg,var(--iap-soft),transparent);border-left:4px solid var(--iap-accent);border-top:1px solid rgba(0,0,0,.08);border-bottom:1px solid rgba(0,0,0,.08);}
.impilo-article-preview-media-band::before {content:"WATCH";position:absolute;left:-1px;top:-13px;padding:4px 8px;background:var(--iap-accent);color:#fff;font-size:.46rem;font-weight:800;letter-spacing:.18em;}
.impilo-article-preview-media-band strong {font-size:.55rem;letter-spacing:.16em;}
.impilo-article-preview-media-band span {color:var(--iap-muted);line-height:1.48;font-size:.66rem;}
.impilo-article-preview-media-split {display:grid;grid-template-columns:1.08fr .92fr;gap:30px;align-items:center;}

/* ---------- MEDIA / IMAGE / AUDIO ---------- */
.impilo-article-preview-media {position:relative;margin:0 0 24px;overflow:hidden;background:#ece8e1;}
.impilo-article-preview-media::after {content:"";position:absolute;inset:10px;border:1px solid rgba(255,255,255,.28);pointer-events:none;mix-blend-mode:screen;}
.impilo-article-preview-media img,.impilo-article-preview-media video {display:block;width:100%;height:100%;object-fit:cover;}
.impilo-article-preview-media.aspect-wide {aspect-ratio:16 / 9;}
.impilo-article-preview-media.aspect-landscape {aspect-ratio:4 / 3;}
.impilo-article-preview-media.aspect-portrait {aspect-ratio:3 / 4;}
.impilo-article-preview-media figcaption,.impilo-article-preview-audio figcaption {padding:10px 12px 11px;font-size:.56rem;line-height:1.5;color:var(--iap-muted);background:var(--iap-soft);}
.impilo-article-preview-media-placeholder,.impilo-article-preview-gallery-placeholder {min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,#f0ede7 0,#f0ede7 10px,#e6e1d8 10px,#e6e1d8 20px);color:#777;text-align:center;box-sizing:border-box;}
.impilo-article-preview-media-placeholder span {font-size:.66rem;font-weight:800;letter-spacing:.16em;}
.impilo-article-preview-media-placeholder small {max-width:220px;margin-top:8px;font-size:.6rem;line-height:1.45;}
.impilo-article-preview-audio {margin:28px 0;padding:20px;border:1px solid var(--iap-accent);background:linear-gradient(135deg,var(--iap-soft),transparent);box-shadow:10px 10px 0 rgba(0,0,0,.025);}
.impilo-article-preview-audio-label {margin-bottom:10px;font-size:.56rem;letter-spacing:.18em;font-weight:800;color:var(--iap-accent);}
.impilo-article-preview-audio audio {width:100%;}

/* ---------- QUOTES ---------- */
.impilo-article-preview-quote {position:relative;margin:38px 0;padding:31px 34px 31px 78px;border:0;border-top:1px solid var(--iap-accent);border-bottom:1px solid var(--iap-accent);background:linear-gradient(90deg,var(--iap-soft),rgba(255,255,255,0));overflow:hidden;}
.impilo-article-preview-quote::before {content:"";position:absolute;left:0;top:0;width:6px;height:100%;background:linear-gradient(var(--iap-accent-strong),#d4af37,var(--iap-accent));}
.impilo-article-preview-quote::after {content:"";position:absolute;right:-45px;top:-45px;width:120px;height:120px;border:1px solid var(--iap-accent);border-radius:50%;opacity:.25;}
.impilo-article-preview-quote .quote-mark {position:absolute;left:21px;top:13px;font-family:Playfair Display,Didot,Georgia,serif;font-size:4.4rem;line-height:1;color:var(--iap-accent-strong);}
.impilo-article-preview-quote .quote-kicker {display:block;margin-bottom:8px;color:var(--iap-accent);font-size:.49rem;font-weight:800;letter-spacing:.2em;}
.impilo-article-preview-quote p {margin:0;max-width:60ch;font-family:Playfair Display,Didot,Georgia,serif;font-size:1.34rem;line-height:1.35;letter-spacing:-.01em;}
.impilo-article-preview-quote .quote-ornament {position:absolute;right:27px;bottom:19px;width:12px;height:12px;background:var(--iap-accent);transform:rotate(45deg);}

/* ---------- ACCENT STRIPS ---------- */
.impilo-article-preview-accent-strip,.impilo-article-preview-brand-band {margin:32px 0;padding:23px 26px;border:1px solid var(--iap-accent);background:linear-gradient(135deg,var(--iap-soft),rgba(255,255,255,.12));}
.impilo-article-preview-accent-strip span,.impilo-article-preview-brand-band span {display:block;margin-bottom:8px;color:var(--iap-accent);font-size:.55rem;letter-spacing:.18em;font-weight:800;text-transform:uppercase;}
.impilo-article-preview-accent-strip p,.impilo-article-preview-brand-band p {margin-bottom:0;}

/* ---------- PORTFOLIO ---------- */
.impilo-article-preview-portfolio-intro {display:grid;grid-template-columns:1fr auto;gap:20px;align-items:end;margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid rgba(0,0,0,.12);}
.impilo-article-preview-portfolio-intro > div > span {display:block;color:var(--iap-accent);font-size:.56rem;font-weight:800;letter-spacing:.17em;}
.impilo-article-preview-portfolio-intro h2 {margin-top:7px;font-size:2rem;}
.impilo-article-preview-portfolio-intro > i {display:block;width:22px;height:22px;background:var(--iap-accent);transform:rotate(45deg);margin-bottom:8px;opacity:.9;}
.impilo-article-preview-portfolio-intro p {grid-column:1 / -1;margin:0;max-width:68ch;color:var(--iap-muted);}
.impilo-article-preview-portfolio-grid {display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:74px;gap:12px;}
.impilo-article-preview-portfolio-grid .impilo-article-preview-media,.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder {margin:0;height:100%;min-height:0;}
.impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(1),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(1){grid-column:span 7;grid-row:span 7;}
.impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(2),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(2){grid-column:span 5;grid-row:span 4;}
.impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(3),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(3){grid-column:span 5;grid-row:span 3;}
.impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(n+4),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(n+4){grid-column:span 3;grid-row:span 3;}

/* ---------- REFERENCES / FOOTNOTES ---------- */
.impilo-article-preview-footnotes {
  position:relative;
  margin:46px 0 8px;
  padding:24px 0 4px;
  border-top:1px solid rgba(0,0,0,.14);
}
.impilo-article-preview-footnotes::before {
  content:"";
  position:absolute;
  left:0;
  top:-2px;
  width:52px;
  height:3px;
  background:linear-gradient(90deg,var(--iap-accent-strong),var(--iap-accent));
}
.impilo-article-preview-footnotes .footnotes-heading {
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
  color:var(--iap-accent);
  font-size:.54rem;
  font-weight:800;
  letter-spacing:.2em;
}
.impilo-article-preview-footnotes .footnotes-heading i {
  display:block;
  width:10px;
  height:10px;
  background:var(--iap-accent);
  transform:rotate(45deg);
}
.impilo-article-preview-footnotes ol {
  margin:0;
  padding-left:25px;
}
.impilo-article-preview-footnotes li {
  margin:0 0 11px;
  padding-left:6px;
  color:var(--iap-muted);
  font-family:Montserrat,Arial,sans-serif;
  font-size:.58rem;
  line-height:1.6;
}
.impilo-article-preview-footnotes li::marker {
  color:var(--iap-accent);
  font-weight:800;
}
.impilo-article-preview-footnotes li span {
  display:block;
  color:var(--iap-ink);
}
.impilo-article-preview-footnotes li small {
  display:block;
  margin-top:2px;
  color:var(--iap-muted);
  font-size:.52rem;
}
.impilo-article-preview-footnotes a {
  color:var(--iap-accent);
  text-decoration:underline;
  text-underline-offset:2px;
}

/* ---------- FOOTER ---------- */
.impilo-article-preview-footer {position:relative;display:flex;justify-content:space-between;gap:12px;margin-top:48px;padding-top:18px;border-top:1px solid rgba(0,0,0,.14);color:var(--iap-muted);font-size:.51rem;letter-spacing:.16em;text-transform:uppercase;}
.impilo-article-preview-footer::before {content:"";position:absolute;left:0;top:-2px;width:38px;height:3px;background:var(--iap-accent-strong);}

/* ---------- THEME-SPECIFIC GRAPHIC DETAILS ---------- */
.template-noir .impilo-article-preview-header,
.template-dark_blue .impilo-article-preview-header,
.template-red_wine .impilo-article-preview-header,
.template-emerald .impilo-article-preview-header,
.template-purple .impilo-article-preview-header,
.template-lime .impilo-article-preview-header,
.template-silver .impilo-article-preview-header {box-shadow:inset 0 -1px 0 rgba(255,255,255,.14);}
.template-signature_gold .impilo-article-preview-header-seal,
.template-editorial_feature .impilo-article-preview-header-seal {border-color:rgba(0,0,0,.18);background:rgba(255,255,255,.08);}
.template-lime .impilo-article-preview-header-ribbon {background:linear-gradient(90deg,#283001,#697d16,#d6e84e);color:#111;}
.template-lime .impilo-article-preview-header-ribbon::after {border-left-color:#d6e84e;}
.template-purple .impilo-article-preview-header-ribbon {background:linear-gradient(90deg,#341147,#6f3697,#d4af37);}
.template-red_wine .impilo-article-preview-header-ribbon {background:linear-gradient(90deg,#4e0707,#7a0c0c,#d4af37);}
.template-emerald .impilo-article-preview-header-ribbon {background:linear-gradient(90deg,#062e2a,#008c5b,#d4af37);}
.template-dark_blue .impilo-article-preview-header-ribbon {background:linear-gradient(90deg,#020b1a,#0b2a55,#d4af37);}
.template-noir .impilo-article-preview-header-ribbon {background:linear-gradient(90deg,#111,#333,#d4af37);}

@media (max-width:860px) {
  .impilo-article-preview-overlay {padding:12px;}
  .impilo-article-preview-scroll {padding:18px;}
  .impilo-article-preview-header-inner {padding:66px 34px 38px;}
  .impilo-article-preview-body {padding:28px 34px 44px;}
  .impilo-article-preview-feature-lead,
  .impilo-article-preview-profile-lead,
  .impilo-article-preview-brand-grid,
  .impilo-article-preview-media-split,
  .impilo-article-preview-two-col {grid-template-columns:1fr;}
  .impilo-article-preview-brand-grid > div:first-child {padding-right:0;border-right:0;padding-bottom:18px;border-bottom:1px solid rgba(0,0,0,.1);}
  .impilo-article-preview-portfolio-grid {grid-template-columns:repeat(6,1fr);grid-auto-rows:88px;}
  .impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(1),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(1){grid-column:span 6;grid-row:span 5;}
  .impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(n+2),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(n+2){grid-column:span 3;grid-row:span 3;}
}
@media (max-width:700px) {
  .impilo-article-preview-shell,
  .impilo-article-preview-page .impilo-article-preview-shell {width:100%;height:100%;min-height:100%;border-radius:0;border-left:0;border-right:0;}
  .impilo-article-preview-page {padding:0;}
  .impilo-article-preview-scroll {padding:0;}
  .impilo-article-preview-header {min-height:310px;}
  .impilo-article-preview-header-inner {padding:64px 25px 32px;}
  .impilo-article-preview-header h1 {font-size:clamp(2.2rem,11vw,4rem);}
  .impilo-article-preview-body {padding:24px 25px 38px;}
  .impilo-article-preview-meta-bar {padding:11px 12px;}
  .impilo-article-preview-meta-right small {display:none;}
  .impilo-article-preview-header-seal {left:17px;top:17px;width:47px;height:47px;}
  .impilo-article-preview-header-ribbon {top:24px;right:-53px;}
  .impilo-article-preview-quote {padding:28px 24px 28px 61px;}
  .impilo-article-preview-quote p {font-size:1.1rem;}
  .impilo-article-preview-section-title {grid-template-columns:46px 1fr 16px;gap:12px;}
  .impilo-section-number {width:36px;height:36px;font-size:.8rem;}
  .impilo-article-preview-portfolio-grid {grid-template-columns:repeat(2,1fr);grid-auto-rows:145px;gap:9px;}
  .impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(n),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(n){grid-column:span 1;grid-row:span 2;}
  .impilo-article-preview-portfolio-grid .impilo-article-preview-media:nth-child(1),.impilo-article-preview-portfolio-grid .impilo-article-preview-gallery-placeholder:nth-child(1){grid-column:span 2;grid-row:span 3;}
  .impilo-article-preview-footer {flex-direction:column;gap:7px;}
}
`;
