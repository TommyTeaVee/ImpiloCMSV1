import { useMemo } from "react";
import { useMediaLightbox } from "./MediaLightboxProvider";


function getMediaUrl(item) {

  if (!item) {
    return null;
  }

  return (
    item.url ||
    item.src ||
    item.media?.url ||
    null
  );

}


function getMediaType(item) {

  if (!item) {
    return "IMAGE";
  }

  return (
    item.type ||
    item.media?.type ||
    "IMAGE"
  ).toUpperCase();

}


function getAltText(item, index) {

  if (!item) {
    return `IMPILO media ${index + 1}`;
  }

  return (
    item.altText ||
    item.alt ||
    item.media?.altText ||
    `IMPILO media ${index + 1}`
  );

}


function getCaption(item) {

  if (!item) {
    return null;
  }

  return (
    item.caption ||
    item.media?.caption ||
    null
  );

}


function getFilename(item) {

  if (!item) {
    return null;
  }

  return (
    item.filename ||
    item.name ||
    item.media?.filename ||
    null
  );

}


function getProvider(item) {

  if (!item) {
    return null;
  }

  return (
    item.provider ||
    item.media?.provider ||
    null
  );

}


export default function MediaGallery({

  items = [],

  className = "",

  columns = 3

}) {

  const {
    openLightbox
  } = useMediaLightbox();


  // ==================================================
  // NORMALISE MEDIA
  // ==================================================

  const mediaItems = useMemo(() => {

    if (!Array.isArray(items)) {
      return [];
    }

    return items

      .map((item, index) => {

        const url =
          getMediaUrl(item);

        if (!url) {
          return null;
        }

        return {

          ...item,

          url,

          type:
            getMediaType(item),

          altText:
            getAltText(
              item,
              index
            ),

          caption:
            getCaption(item),

          filename:
            getFilename(item),

          provider:
            getProvider(item)

        };

      })

      .filter(Boolean);

  }, [items]);


  // ==================================================
  // EMPTY
  // ==================================================

  if (!mediaItems.length) {
    return null;
  }


  // ==================================================
  // SAFE COLUMNS
  // ==================================================

  const safeColumns =
    Number.isInteger(columns) &&
    columns > 0
      ? columns
      : 3;


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div
      className={
        `impilo-media-gallery ${className}`
          .trim()
      }

      style={{
        "--gallery-columns":
          safeColumns
      }}
    >

      {mediaItems.map(
        (item, index) => {

          const isVideo =
            item.type === "VIDEO" ||
            item.type === "VIDEO_ASSET";


          const isAudio =
            item.type === "AUDIO";


          return (

            <article
              key={
                item.id ||
                `${item.url}-${index}`
              }

              className="impilo-media-card"
            >


              {/* ======================================
                  MEDIA PREVIEW
              ====================================== */}

              <button
                type="button"

                className="impilo-media-card-preview"

                onClick={() =>
                  openLightbox(
                    mediaItems,
                    index
                  )
                }

                aria-label={
                  `Open ${item.altText}`
                }
              >

                {isVideo ? (

                  <div
                    className="impilo-media-card-video"
                  >

                    <video
                      src={item.url}

                      muted

                      playsInline

                      preload="metadata"

                      aria-label={
                        item.altText
                      }
                    />

                    <span
                      className="impilo-media-card-play"
                      aria-hidden="true"
                    >
                      ▶
                    </span>

                  </div>

                ) : isAudio ? (

                  <div
                    className="impilo-media-card-audio"
                  >

                    <span>
                      ♪
                    </span>

                    <strong>
                      AUDIO
                    </strong>

                  </div>

                ) : (

                  <img
                    src={item.url}

                    alt={
                      item.altText
                    }

                    loading="lazy"

                    draggable="false"
                  />

                )}


                {/* TYPE */}

                <span
                  className="impilo-media-card-type"
                >
                  {item.type}
                </span>


                {/* PROVIDER */}

                {item.provider && (

                  <span
                    className="impilo-media-card-provider"
                  >
                    {item.provider}
                  </span>

                )}


                {/* OPEN */}

                <span
                  className="impilo-media-card-open"
                  aria-hidden="true"
                >
                  ↗
                </span>

              </button>


              {/* ======================================
                  INFORMATION
              ====================================== */}

              <div
                className="impilo-media-card-info"
              >

                <div
                  className="impilo-media-card-title"
                >

                  <strong>
                    {
                      item.filename ||
                      item.altText ||
                      "Untitled media"
                    }
                  </strong>

                </div>


                {item.caption && (

                  <p>
                    {item.caption}
                  </p>

                )}

              </div>

            </article>

          );

        }

      )}

    </div>

  );

}