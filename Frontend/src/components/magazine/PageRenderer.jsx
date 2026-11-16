import React from "react";
import GamePageRenderer from "../editorial/GamePageRenderer";



const DEV_COVER =
  "https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/assets/mag_cover/flow.png?auto=compress&cs=tinysrgb&dpr=1&w=1500";

const EDITORIAL_THEMES = {
  NEUTRAL: {
    name: "Neutral",
    accent: "#a58216",
    accentStrong: "#d4af37",
    soft: "#f1eee8",
    paper: "#fffdf9",
    ink: "#161616",
    muted: "#666666",
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
    accentStrong: "#111111",
    soft: "#e9e9e9",
    paper: "#ffffff",
    ink: "#111111",
    muted: "#646464",
    header: "#151515",
    headerInk: "#ffffff",
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
    headerInk: "#ffffff",
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
    headerInk: "#ffffff",
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
    headerInk: "#ffffff",
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
    headerInk: "#ffffff",
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
    headerInk: "#ffffff",
  },
  SILVER: {
    name: "Silver",
    accent: "#667078",
    accentStrong: "#34383d",
    soft: "#e4e7e9",
    paper: "#ffffff",
    ink: "#1a1d20",
    muted: "#646b71",
    header: "#34383d",
    headerInk: "#ffffff",
  },
};

const EDITORIAL_TEMPLATES = {
  EDITORIAL_FEATURE: { name: "Editorial Feature", eyebrow: "IMPILO EDITORIAL", ribbon: "FEATURE" },
  PROFILE: { name: "Profile / Model", eyebrow: "PROFILE / EDITORIAL", ribbon: "THE PROFILE" },
  BRAND_POWER: { name: "Brand Power", eyebrow: "EDITORIAL · BRAND POWER", ribbon: "BRAND POWER" },
  EDUCATIONAL: { name: "Educational / Essay", eyebrow: "IMPILO INSIGHT", ribbon: "INSIGHT" },
  MEDIA_FEATURE: { name: "Media Feature", eyebrow: "IMPILO MEDIA", ribbon: "WATCH · LISTEN · READ" },
  PORTFOLIO: { name: "Visual Portfolio", eyebrow: "VISUAL PORTFOLIO", ribbon: "PORTFOLIO" },
};

function getText(block) {
  const content = block?.content;
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object" && typeof content.text === "string") {
    return content.text;
  }
  return "";
}

function getRole(block) {
  const layout = block?.content?.editorialLayout || {};
  if (
    block?.type === "TEXT" &&
    (layout.variant === "FOOTNOTE" ||
      layout.role === "footnote" ||
      block?.content?.footnote === true)
  ) {
    return "footnote";
  }
  return String(layout.role || "").trim().toLowerCase();
}

function isFootnoteBlock(block) {
  return (
    block?.type === "TEXT" &&
    getRole(block) === "footnote"
  );
}

function safeClassPart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getEditorialSettings(blocks = []) {
  const metadataBlock = blocks.find((block) => {
    const metadata = block?.content?.editorialLayout;
    return metadata && (metadata.template || metadata.theme);
  });
  const metadata = metadataBlock?.content?.editorialLayout || null;
  const templateId = EDITORIAL_TEMPLATES[metadata?.template]
    ? metadata.template
    : "EDITORIAL_FEATURE";
  const themeId = EDITORIAL_THEMES[metadata?.theme]
    ? metadata.theme
    : "NEUTRAL";
  return {
    hasMetadata: Boolean(metadata),
    templateId,
    themeId,
    template: EDITORIAL_TEMPLATES[templateId],
    theme: EDITORIAL_THEMES[themeId],
  };
}

function makeThemeStyle(theme) {
  return {
    "--impilo-theme-accent": theme.accent,
    "--impilo-theme-accent-strong": theme.accentStrong,
    "--impilo-theme-soft": theme.soft,
    "--impilo-theme-paper": theme.paper,
    "--impilo-theme-ink": theme.ink,
    "--impilo-theme-muted": theme.muted,
    "--impilo-theme-header": theme.header,
    "--impilo-theme-header-ink": theme.headerInk,
  };
}

function ReferenceSection({ blocks }) {
  const notes = blocks.filter(isFootnoteBlock);
  if (!notes.length) return null;

  return (
    <section className="impilo-magazine-references" aria-label="References and footnotes">
      <div className="impilo-magazine-references-heading">
        <span>REFERENCES</span>
        <i aria-hidden="true" />
      </div>
      <ol>
        {notes.map((block, index) => {
          const text = getText(block).trim();
          const source = String(block?.content?.source || "").trim();
          const url = String(block?.content?.url || "").trim();
          if (!text && !source && !url) return null;
          return (
            <li key={block.id || block.clientId || `reference-${index}`}>
              {text && <span className="impilo-reference-text">{text}</span>}
              {(source || url) && (
                <small>
                  {source}
                  {source && url ? " · " : ""}
                  {url && (
                    <a href={url} target="_blank" rel="noreferrer">
                      Source ↗
                    </a>
                  )}
                </small>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function PageRenderer({ page }) {
  if (!page) return null;

  const article = page.article;

  // Interactive game pages are rendered as first-class magazine pages.
  if (page.type === "GAME") {
    return <GamePageRenderer page={page} />;
  }

  // ------------------------------------------------------------
  // COVER — preserve the existing full-bleed cover presentation.
  // ------------------------------------------------------------
  if (page.type === "COVER") {
    const coverImage =
      page.imageUrl ||
      page.image?.url ||
      page.media?.url ||
      "https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/assets/mag_cover/master_cover.png?auto=compress&cs=tinysrgb&dpr=1&w=1500";

    return (
      <section className="impilo-page impilo-page-cover">
        <img
          src={coverImage}
          alt={page.title || "IMPILO Magazine Cover"}
          className="impilo-cover-image"
          draggable="false"
        />
      </section>
    );
  }

  if (page.type === "HIGHLIGHTS") {
    return (
      <section className="impilo-page impilo-page-highlights impilo-magazine-editorial-page">
        <div className="impilo-magazine-section-inner">
          <span className="impilo-magazine-eyebrow">IMPILO</span>
          <h1 className="impilo-magazine-section-title">{page.title || "Highlights"}</h1>
          <div className="impilo-magazine-gold-rule" />
        </div>
      </section>
    );
  }

  if (page.type === "ABOUT") {
    return (
      <section className="impilo-page impilo-page-about impilo-magazine-editorial-page">
        <div className="impilo-magazine-section-inner">
          <span className="impilo-magazine-eyebrow">THE MAGAZINE</span>
          <h1 className="impilo-magazine-section-title">{page.title || "About IMPILO"}</h1>
          <div className="impilo-magazine-gold-rule" />
          <p className="impilo-magazine-placeholder">About IMPILO content will appear here.</p>
        </div>
      </section>
    );
  }

  if (page.type === "CONTENTS") {
    const customContent = page.content || {};
    const heading = customContent.heading || page.title || "Contents";
    const intro = customContent.intro || "Inside this issue...";
    const issuePages = Array.isArray(page.issuePages) ? page.issuePages : [];
    const indexablePages = issuePages.filter(
      (item) =>
        item.type !== "COVER" &&
        item.type !== "CONTENTS" &&
        (item.title || item.article?.title)
    );

    return (
      <section className="impilo-page impilo-page-contents impilo-magazine-editorial-page">
        <div className="impilo-magazine-section-inner">
          <span className="impilo-magazine-eyebrow">THIS ISSUE</span>
          <h1 className="impilo-magazine-section-title">{heading}</h1>
          <div className="impilo-magazine-gold-rule" />
          {intro && <p className="impilo-contents-intro">{intro}</p>}
          <div className="impilo-contents-list">
            {indexablePages.length === 0 ? (
              <p className="impilo-magazine-placeholder">Magazine contents will appear here.</p>
            ) : (
              <ul className="impilo-contents-ul">
                {indexablePages.map((item) => {
                  const itemTitle = item.article?.title || item.title || "Untitled Page";
                  const subtitle = item.article?.subtitle || "";
                  return (
                    <li key={item.id} className="impilo-contents-item">
                      <button
                        type="button"
                        className="impilo-contents-link"
                        onClick={() => {
                          if (page.onJumpToPage && typeof item.position === "number") {
                            page.onJumpToPage(item.position - 1);
                          }
                        }}
                      >
                        <span className="impilo-contents-item-title">{itemTitle}</span>
                        <span className="impilo-contents-dots" />
                        <span className="impilo-contents-page-num">{item.position}</span>
                      </button>
                      {subtitle && <small className="impilo-contents-subtitle">{subtitle}</small>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------
  // ARTICLE — read the selected CMS layout/theme from block JSON.
  // Older articles without this metadata retain their old classes.
  // ------------------------------------------------------------
  if (page.type === "ARTICLE") {
    if (!article) {
      return (
        <article className="editorial-article impilo-magazine-article-page">
          <p>Article content unavailable.</p>
        </article>
      );
    }

    const blocks = Array.isArray(article.blocks) ? article.blocks : [];
    const settings = getEditorialSettings(blocks);
    const { hasMetadata, templateId, themeId, template, theme } = settings;
    const isContinuation = Number(page.articlePart) > 1;
    const titleBlock = blocks.find((block) => getRole(block) === "title");
    const deckBlock = blocks.find((block) => getRole(block) === "deck");
    const displayTitle = getText(titleBlock).trim() || article.title || page.title || "Untitled Article";
    const displaySubtitle = getText(deckBlock).trim() || article.subtitle || "";
    const referenceBlocks = blocks.filter(isFootnoteBlock);

    function renderBlock(block, index) {
      if (!block) return null;
      const type = String(block.type || "TEXT").toUpperCase();
      const key = block.id || block.clientId || `block-${index}`;
      const role = getRole(block);
      const roleClass = role ? ` impilo-role-${safeClassPart(role)}` : "";
      const roleProps = role ? { "data-editorial-role": role } : {};

      // Title, deck and eyebrow roles are presented in the article header.
      // Footnotes are grouped once at the end as a references section.
      if (role === "title" || role === "deck" || role === "eyebrow" || role === "footnote") {
        return null;
      }

      if (type === "TEXT" || type === "PARAGRAPH") {
        const text = getText(block);
        if (!text.trim()) return null;
        if (role === "callout") {
          return (
            <aside
              key={key}
              className={`impilo-magazine-callout${roleClass}`}
              {...roleProps}
            >
              <span className="impilo-magazine-callout-kicker">IMPILO INSIGHT</span>
              <p>{text}</p>
            </aside>
          );
        }
        return (
          <p
            key={key}
            className={`impilo-editorial-paragraph impilo-magazine-text${roleClass}${role === "dropcap" ? " impilo-editorial-dropcap" : ""}`}
            {...roleProps}
          >
            {text}
          </p>
        );
      }

      if (type === "HEADING" || type === "SUBHEADING") {
        const text = getText(block);
        if (!text.trim()) return null;
        return (
          <h2
            key={key}
            className={`impilo-editorial-heading impilo-magazine-heading${roleClass}`}
            {...roleProps}
          >
            {text}
          </h2>
        );
      }

      if (type === "QUOTE") {
        const text = getText(block);
        if (!text.trim()) return null;
        return (
          <blockquote
            key={key}
            className={`impilo-magazine-quote${roleClass}`}
            {...roleProps}
          >
            <span className="impilo-magazine-quote-mark" aria-hidden="true">“</span>
            <span className="impilo-magazine-quote-kicker">IMPILO PERSPECTIVE</span>
            <p>{text}</p>
            <span className="impilo-magazine-quote-ornament" aria-hidden="true" />
          </blockquote>
        );
      }

      if (type === "IMAGE") {
        const media = block.media;
        if (!media?.url && !block.content?.url) return null;
        const url = media?.url || block.content.url;
        return (
          <figure
            key={key}
            className={`impilo-editorial-visual impilo-editorial-image impilo-magazine-media${roleClass}`}
            {...roleProps}
          >
            <img
              src={url}
              alt={media?.altText || media?.caption || "IMPILO Magazine"}
              loading="lazy"
            />
            {(media?.caption || block.content?.caption) && (
              <figcaption>{media?.caption || block.content.caption}</figcaption>
            )}
            {media?.credit && <small className="impilo-media-credit">© {media.credit}</small>}
          </figure>
        );
      }

      if (type === "VIDEO") {
        const media = block.media;
        if (!media) return null;
        const isYouTube = String(media.provider || "").toUpperCase() === "YOUTUBE";

        if (isYouTube && (media.externalId || media.providerId)) {
          const videoId = media.externalId || media.providerId;
          return (
            <figure
              key={key}
              className={`impilo-editorial-visual impilo-editorial-video impilo-magazine-media${roleClass}`}
              {...roleProps}
            >
              <div className="impilo-video-frame">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={media.caption || "IMPILO Magazine video"}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {media.caption && <figcaption>{media.caption}</figcaption>}
              {media.credit && <small className="impilo-media-credit">© {media.credit}</small>}
            </figure>
          );
        }

        if (media.url) {
          return (
            <figure
              key={key}
              className={`impilo-editorial-visual impilo-editorial-video impilo-magazine-media${roleClass}`}
              {...roleProps}
            >
              <div className="impilo-native-video-frame">
                <video
                  src={media.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="impilo-native-video"
                />
              </div>
              {media.caption && <figcaption>{media.caption}</figcaption>}
              {media.credit && <small className="impilo-media-credit">© {media.credit}</small>}
            </figure>
          );
        }
        return null;
      }

      if (type === "AUDIO") {
        const media = block.media;
        if (!media?.url) return null;
        return (
          <figure
            key={key}
            className={`impilo-magazine-audio${roleClass}`}
            {...roleProps}
          >
            <div className="impilo-magazine-audio-label">IMPILO AUDIO</div>
            <audio src={media.url} controls preload="metadata" />
            {media.caption && <figcaption>{media.caption}</figcaption>}
          </figure>
        );
      }

      if (type === "GALLERY") return null;
      return null;
    }

    const themedClass = hasMetadata
      ? ` impilo-themed-article impilo-template-${safeClassPart(templateId)} impilo-theme-${safeClassPart(themeId)}`
      : "";

    return (
      <article
        className={`editorial-article impilo-magazine-article-page${themedClass}`}
        data-editorial-template={hasMetadata ? templateId : undefined}
        data-editorial-theme={hasMetadata ? themeId : undefined}
        style={hasMetadata ? makeThemeStyle(theme) : undefined}
      >
        <header className={`impilo-article-header${hasMetadata ? " impilo-themed-article-header" : ""}`}>
          {!isContinuation ? (
            <>
              {hasMetadata && (
                <>
                  <div className="impilo-magazine-themed-header-geometry" aria-hidden="true" />
                  <span className="impilo-magazine-themed-ribbon">{template.ribbon}</span>
                </>
              )}
              <span className="impilo-magazine-eyebrow">
                {hasMetadata ? template.eyebrow : "IMPILO EDITORIAL"}
              </span>
              <h1 className="impilo-article-title">{displayTitle}</h1>
              {displaySubtitle && <p className="impilo-article-subtitle">{displaySubtitle}</p>}
              {article.author && (
                <p className="impilo-article-author">
                  {article.author.displayName || article.author.username}
                </p>
              )}
              {hasMetadata && (
                <div className="impilo-magazine-themed-header-footer">
                  <span>THE HEARTBEAT OF INNOVATION</span>
                  <i aria-hidden="true" />
                  <small>{theme.name}</small>
                </div>
              )}
            </>
          ) : (
            <div className="impilo-article-continued">CONTINUED</div>
          )}
        </header>

        <div className="impilo-editorial-layout impilo-magazine-editorial-layout">
          {blocks.map((block, index) => renderBlock(block, index))}
          <ReferenceSection blocks={referenceBlocks} />
        </div>
      </article>
    );
  }

  return (
    <section className="impilo-page impilo-magazine-editorial-page">
      <div className="impilo-magazine-section-inner">
        <span className="impilo-magazine-eyebrow">IMPILO</span>
        <h1 className="impilo-magazine-section-title">{page.title || "IMPILO"}</h1>
      </div>
    </section>
  );
}
