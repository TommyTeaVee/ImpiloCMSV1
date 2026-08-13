import React from "react";

export default function PageRenderer({ page }) {
  if (!page) {
    return null;
  }

  const article = page.article;

  // ==================================================
  // TEXT HELPER
  // ==================================================

  function getText(block) {
    const content = block?.content;

    if (!content) {
      return "";
    }

    if (typeof content === "string") {
      return content;
    }

    if (
      typeof content === "object" &&
      typeof content.text === "string"
    ) {
      return content.text;
    }

    return "";
  }

  // ==================================================
  // COVER
  // ==================================================

  if (page.type === "COVER") {
    return (
      <section className="impilo-page impilo-page-cover">
        <div className="impilo-page-cover-content">
          <h1>{page.title}</h1>
        </div>
      </section>
    );
  }

  // ==================================================
  // HIGHLIGHTS
  // ==================================================

  if (page.type === "HIGHLIGHTS") {
    return (
      <section className="impilo-page impilo-page-highlights">
        <h1 className="uk-article-title">
          {page.title || "Highlights"}
        </h1>
      </section>
    );
  }

  // ==================================================
  // ABOUT
  // ==================================================

  if (page.type === "ABOUT") {
    return (
      <section className="impilo-page impilo-page-about">
        <h1 className="uk-article-title">
          {page.title || "About IMPILO"}
        </h1>
      </section>
    );
  }

  // ==================================================
  // CONTENTS
  // ==================================================

  if (page.type === "CONTENTS") {
    return (
      <section className="impilo-page impilo-page-contents">
        <h1 className="uk-article-title">
          {page.title || "Contents"}
        </h1>

        <div className="impilo-contents-list">
          <p>
            Magazine contents will appear here.
          </p>
        </div>
      </section>
    );
  }

  // ==================================================
  // ARTICLE
  // ==================================================

  if (page.type === "ARTICLE") {
    if (!article) {
      return (
        <article className="editorial-article">
          <p>
            Article content unavailable.
          </p>
        </article>
      );
    }

    const blocks = Array.isArray(article.blocks)
      ? article.blocks
      : [];

    // ==================================================
    // CONTINUATION
    // ==================================================

    const isContinuation =
      Number(page.articlePart) > 1;

    // ==================================================
    // RENDER ARTICLE BLOCK
    // ==================================================

    function renderBlock(block, index) {
      if (!block) {
        return null;
      }

      const type = String(
        block.type || "TEXT"
      ).toUpperCase();

      const key =
        block.id || `block-${index}`;

      // ==================================================
      // TEXT
      // ==================================================

      if (
        type === "TEXT" ||
        type === "PARAGRAPH"
      ) {
        const text = getText(block);

        if (!text) {
          return null;
        }

        return (
          <p
            key={key}
            className="impilo-editorial-paragraph"
          >
            {text}
          </p>
        );
      }

      // ==================================================
      // HEADING
      // ==================================================

      if (
        type === "HEADING" ||
        type === "SUBHEADING"
      ) {
        const text = getText(block);

        if (!text) {
          return null;
        }

        return (
          <h2
            key={key}
            className="impilo-editorial-heading"
          >
            {text}
          </h2>
        );
      }

      // ==================================================
      // IMAGE
      // ==================================================

      if (type === "IMAGE") {
        const media = block.media;

        if (!media?.url) {
          return null;
        }

        return (
          <figure
            key={key}
            className="impilo-editorial-visual impilo-editorial-image"
          >
            <img
              src={media.url}
              alt={
                media.altText ||
                media.caption ||
                "IMPILO Magazine"
              }
              loading="lazy"
            />

            {media.caption && (
              <figcaption>
                {media.caption}
              </figcaption>
            )}

            {media.credit && (
              <small className="impilo-media-credit">
                © {media.credit}
              </small>
            )}
          </figure>
        );
      }

      // ==================================================
      // VIDEO
      // ==================================================

      if (type === "VIDEO") {
        const media = block.media;

        if (!media) {
          return null;
        }

        const videoId =
          media.externalId ||
          media.providerId;

        if (!videoId) {
          return null;
        }

        return (
          <figure
            key={key}
            className="impilo-editorial-visual impilo-editorial-video"
          >
            <div className="impilo-video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={
                  media.caption ||
                  "IMPILO Magazine video"
                }
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {media.caption && (
              <figcaption>
                {media.caption}
              </figcaption>
            )}

            {media.credit && (
              <small className="impilo-media-credit">
                © {media.credit}
              </small>
            )}
          </figure>
        );
      }

      // ==================================================
      // GALLERY
      // ==================================================

      if (type === "GALLERY") {
        return null;
      }

      // ==================================================
      // UNKNOWN BLOCK
      // ==================================================

      return null;
    }

    // ==================================================
    // ARTICLE
    // ==================================================

    return (
      <article
        className="editorial-article"
        style={{
          overflowY: "auto",
          maxHeight: "85vh",
          padding: "24px"
        }}
      >

        {/* ================================================
            ARTICLE HEADER
        ================================================= */}

        <header className="impilo-article-header">

          {!isContinuation ? (
            <>
              {/* MAIN ARTICLE TITLE */}

              <h1 className="impilo-article-title">
                {article.title || page.title}
              </h1>

              {/* SUBTITLE */}

              {article.subtitle && (
                <p className="impilo-article-subtitle">
                  {article.subtitle}
                </p>
              )}

              {/* AUTHOR */}

              {article.author && (
                <p className="impilo-article-author">
                  {article.author.displayName ||
                    article.author.username}
                </p>
              )}
            </>
          ) : (
            /* ==========================================
               CONTINUATION HEADER
            ========================================== */

            <div className="impilo-article-continued">
              CONTINUED
            </div>
          )}

        </header>

        {/* ================================================
            ARTICLE CONTENT
        ================================================= */}

        <div className="impilo-editorial-layout">

          {blocks.map(
            (block, index) =>
              renderBlock(
                block,
                index
              )
          )}

        </div>

      </article>
    );
  }

  // ==================================================
  // FALLBACK
  // ==================================================

  return (
    <section className="impilo-page">
      <h1 className="uk-article-title">
        {page.title || "IMPILO"}
      </h1>
    </section>
  );
}