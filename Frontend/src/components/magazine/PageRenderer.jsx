import React from "react";

export default function PageRenderer({ page }) {
 const DEV_COVER =
  "https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/assets/mag_cover/flow.png?auto=compress&cs=tinysrgb&dpr=1&w=1500";
  if (!page) {
    return null;
  }

  const article =
    page.article;


  // ==================================================
  // TEXT HELPER
  // ==================================================

  function getText(block) {

    const content =
      block?.content;

    if (!content) {
      return "";
    }

    if (
      typeof content ===
      "string"
    ) {
      return content;
    }

    if (
      typeof content ===
        "object" &&
      typeof content.text ===
        "string"
    ) {
      return content.text;
    }

    return "";
  }


  // ==================================================
// COVER
// STRICTLY FULL-BLEED IMAGE
// ==================================================

// ==================================================
// COVER
// ==================================================

// ==================================================
// COVER
// ==================================================

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
        alt={
          page.title ||
          "IMPILO Magazine Cover"
        }
        className="impilo-cover-image"
        draggable="false"
      />

    </section>
  );
}

  // ==================================================
  // HIGHLIGHTS
  // ==================================================

  if (
    page.type ===
    "HIGHLIGHTS"
  ) {

    return (

      <section
        className="
          impilo-page
          impilo-page-highlights
          impilo-magazine-editorial-page
        "
      >

        <div
          className="
            impilo-magazine-section-inner
          "
        >

          <span
            className="
              impilo-magazine-eyebrow
            "
          >
            IMPILO
          </span>

          <h1
            className="
              impilo-magazine-section-title
            "
          >
            {page.title ||
              "Highlights"}
          </h1>

          <div
            className="
              impilo-magazine-gold-rule
            "
          />

        </div>

      </section>

    );

  }


  // ==================================================
  // ABOUT
  // ==================================================

  if (
    page.type ===
    "ABOUT"
  ) {

    return (

      <section
        className="
          impilo-page
          impilo-page-about
          impilo-magazine-editorial-page
        "
      >

        <div
          className="
            impilo-magazine-section-inner
          "
        >

          <span
            className="
              impilo-magazine-eyebrow
            "
          >
            THE MAGAZINE
          </span>

          <h1
            className="
              impilo-magazine-section-title
            "
          >
            {page.title ||
              "About IMPILO"}
          </h1>

          <div
            className="
              impilo-magazine-gold-rule
            "
          />

          <p
            className="
              impilo-magazine-placeholder
            "
          >
            About IMPILO content
            will appear here.
          </p>

        </div>

      </section>

    );

  }


  // ==================================================
  // CONTENTS
  // ==================================================

  if (
    page.type ===
    "CONTENTS"
  ) {

    return (

      <section
        className="
          impilo-page
          impilo-page-contents
          impilo-magazine-editorial-page
        "
      >

        <div
          className="
            impilo-magazine-section-inner
          "
        >

          <span
            className="
              impilo-magazine-eyebrow
            "
          >
            THIS ISSUE
          </span>

          <h1
            className="
              impilo-magazine-section-title
            "
          >
            {page.title ||
              "Contents"}
          </h1>

          <div
            className="
              impilo-magazine-gold-rule
            "
          />

          <div
            className="
              impilo-contents-list
            "
          >

            <p
              className="
                impilo-magazine-placeholder
              "
            >
              Magazine contents
              will appear here.
            </p>

          </div>

        </div>

      </section>

    );

  }


  // ==================================================
  // ARTICLE
  // ==================================================

  if (
    page.type ===
    "ARTICLE"
  ) {

    if (!article) {

      return (

        <article
          className="
            editorial-article
            impilo-magazine-article-page
          "
        >

          <p>
            Article content
            unavailable.
          </p>

        </article>

      );

    }


    const blocks =
      Array.isArray(
        article.blocks
      )
        ? article.blocks
        : [];


    // ==================================================
    // ARTICLE CONTINUATION
    // ==================================================

    const isContinuation =
      Number(
        page.articlePart
      ) > 1;


    // ==================================================
    // RENDER BLOCK
    // ==================================================

    function renderBlock(
      block,
      index
    ) {

      if (!block) {
        return null;
      }


      const type =
        String(
          block.type ||
          "TEXT"
        ).toUpperCase();


      const key =
        block.id ||
        block.clientId ||
        `block-${index}`;


      // ================================================
      // TEXT
      // ================================================

      if (
        type === "TEXT" ||
        type === "PARAGRAPH"
      ) {

        const text =
          getText(block);

        if (!text) {
          return null;
        }

        return (

          <p
            key={key}
            className="
              impilo-editorial-paragraph
              impilo-magazine-text
            "
          >
            {text}
          </p>

        );

      }


      // ================================================
      // HEADING
      // ================================================

      if (
        type === "HEADING" ||
        type === "SUBHEADING"
      ) {

        const text =
          getText(block);

        if (!text) {
          return null;
        }

        return (

          <h2
            key={key}
            className="
              impilo-editorial-heading
              impilo-magazine-heading
            "
          >
            {text}
          </h2>

        );

      }


      // ================================================
      // QUOTE
      // ================================================

      if (
        type === "QUOTE"
      ) {

        const text =
          getText(block);

        if (!text) {
          return null;
        }

        return (

          <blockquote
            key={key}
            className="
              impilo-magazine-quote
            "
          >

            <span>
              “
            </span>

            <p>
              {text}
            </p>

          </blockquote>

        );

      }


      // ================================================
      // IMAGE
      // ================================================

      if (
        type === "IMAGE"
      ) {

        const media =
          block.media;

        if (
          !media?.url
        ) {
          return null;
        }

        return (

          <figure
            key={key}
            className="
              impilo-editorial-visual
              impilo-editorial-image
              impilo-magazine-media
            "
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

              <small
                className="
                  impilo-media-credit
                "
              >
                © {media.credit}
              </small>

            )}

          </figure>

        );

      }


      // ================================================
      // VIDEO
      // ================================================

      if (
        type === "VIDEO"
      ) {

        const media =
          block.media;

        if (!media) {
          return null;
        }


        const isYouTube =
          String(
            media.provider ||
            ""
          ).toUpperCase() ===
          "YOUTUBE";


        /*
         * YouTube
         */

        if (
          isYouTube &&
          (
            media.externalId ||
            media.providerId
          )
        ) {

          const videoId =
            media.externalId ||
            media.providerId;


          return (

            <figure
              key={key}
              className="
                impilo-editorial-visual
                impilo-editorial-video
                impilo-magazine-media
              "
            >

              <div
                className="
                  impilo-video-frame
                "
              >

                <iframe
                  src={
                    `https://www.youtube.com/embed/${videoId}`
                  }
                  title={
                    media.caption ||
                    "IMPILO Magazine video"
                  }
                  loading="lazy"
                  allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture
                  "
                  allowFullScreen
                />

              </div>


              {media.caption && (

                <figcaption>
                  {media.caption}
                </figcaption>

              )}


              {media.credit && (

                <small
                  className="
                    impilo-media-credit
                  "
                >
                  © {media.credit}
                </small>

              )}

            </figure>

          );

        }


        /*
         * CloudFront / direct video
         */

        if (
          media.url
        ) {

          return (

            <figure
              key={key}
              className="
                impilo-editorial-visual
                impilo-editorial-video
                impilo-magazine-media
              "
            >

              <div
                className="
                  impilo-native-video-frame
                "
              >

                <video
                  src={media.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="
                    impilo-native-video
                  "
                />

              </div>


              {media.caption && (

                <figcaption>
                  {media.caption}
                </figcaption>

              )}


              {media.credit && (

                <small
                  className="
                    impilo-media-credit
                  "
                >
                  © {media.credit}
                </small>

              )}

            </figure>

          );

        }


        return null;

      }


      // ================================================
      // AUDIO
      // ================================================

      if (
        type === "AUDIO"
      ) {

        const media =
          block.media;

        if (
          !media?.url
        ) {
          return null;
        }


        return (

          <figure
            key={key}
            className="
              impilo-magazine-audio
            "
          >

            <div
              className="
                impilo-magazine-audio-label
              "
            >
              IMPILO AUDIO
            </div>

            <audio
              src={media.url}
              controls
              preload="metadata"
            />

            {media.caption && (

              <figcaption>
                {media.caption}
              </figcaption>

            )}

          </figure>

        );

      }


      // ================================================
      // GALLERY
      // ================================================

      if (
        type === "GALLERY"
      ) {

        return null;

      }


      // ================================================
      // UNKNOWN
      // ================================================

      return null;

    }


    // ==================================================
    // ARTICLE PAGE
    // ==================================================

    return (

      <article
        className="
          editorial-article
          impilo-magazine-article-page
        "
      >

        {/* ==========================================
            ARTICLE HEADER
        ========================================== */}

        <header
          className="
            impilo-article-header
          "
        >

          {!isContinuation ? (

            <>

              <span
                className="
                  impilo-magazine-eyebrow
                "
              >
                IMPILO EDITORIAL
              </span>


              <h1
                className="
                  impilo-article-title
                "
              >
                {article.title ||
                  page.title}
              </h1>


              {article.subtitle && (

                <p
                  className="
                    impilo-article-subtitle
                  "
                >
                  {article.subtitle}
                </p>

              )}


              {article.author && (

                <p
                  className="
                    impilo-article-author
                  "
                >
                  {article.author.displayName ||
                    article.author.username}
                </p>

              )}

            </>

          ) : (

            <div
              className="
                impilo-article-continued
              "
            >
              CONTINUED
            </div>

          )}

        </header>


        {/* ==========================================
            ARTICLE CONTENT
        ========================================== */}

        <div
          className="
            impilo-editorial-layout
            impilo-magazine-editorial-layout
          "
        >

          {blocks.map(
            (
              block,
              index
            ) =>
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

    <section
      className="
        impilo-page
        impilo-magazine-editorial-page
      "
    >

      <div
        className="
          impilo-magazine-section-inner
        "
      >

        <span
          className="
            impilo-magazine-eyebrow
          "
        >
          IMPILO
        </span>

        <h1
          className="
            impilo-magazine-section-title
          "
        >
          {page.title ||
            "IMPILO"}
        </h1>

      </div>

    </section>

  );

}