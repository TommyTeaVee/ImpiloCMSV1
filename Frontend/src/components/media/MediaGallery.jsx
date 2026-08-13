import { useMemo } from "react";
import { useMediaLightbox } from "./MediaLightboxProvider";

function getMediaUrl(item) {
  if (!item) return null;

  return (
    item.url ||
    item.src ||
    item.media?.url ||
    null
  );
}

function getMediaType(item) {
  if (!item) return "IMAGE";

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
  if (!item) return null;

  return (
    item.caption ||
    item.media?.caption ||
    null
  );
}

export default function MediaGallery({
  items = [],
  className = "",
  columns = 3
}) {
  const { openLightbox } =
    useMediaLightbox();

  /*
   * Normalise the incoming collection once.
   *
   * Invalid media is removed here instead
   * of allowing broken cards into the UI.
   */
  const mediaItems = useMemo(() => {
    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .map((item, index) => {
        const url = getMediaUrl(item);

        if (!url) {
          return null;
        }

        return {
          ...item,

          url,

          type: getMediaType(item),

          altText: getAltText(
            item,
            index
          ),

          caption: getCaption(item)
        };
      })
      .filter(Boolean);
  }, [items]);

  if (!mediaItems.length) {
    return null;
  }

  const safeColumns =
    Number.isInteger(columns) &&
    columns > 0
      ? columns
      : 3;

  return (
    <div
      className={`impilo-media-gallery ${className}`.trim()}
      style={{
        "--gallery-columns": safeColumns
      }}
    >
      {mediaItems.map(
        (item, index) => {
          const isVideo =
            item.type === "VIDEO" ||
            item.type === "VIDEO_ASSET";

          return (
            <button
              key={
                item.id ||
                `${item.url}-${index}`
              }
              type="button"
              className="impilo-media-gallery-item"
              onClick={() =>
                openLightbox(
                  mediaItems,
                  index
                )
              }
              aria-label={`Open ${
                item.altText
              }`}
            >
              {isVideo ? (
                <div className="impilo-media-gallery-video">
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
                    className="impilo-media-gallery-play"
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.altText}
                  loading="lazy"
                  draggable="false"
                />
              )}

              {item.caption && (
                <span className="impilo-media-gallery-caption">
                  {item.caption}
                </span>
              )}
            </button>
          );
        }
      )}
    </div>
  );
}