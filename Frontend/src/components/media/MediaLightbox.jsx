import { useEffect } from "react";
import { useMediaLightbox } from "./MediaLightboxProvider";

export default function MediaLightbox() {
  const {
    isOpen,
    items,
    current,
    activeItem,
    closeLightbox,
    next,
    previous
  } = useMediaLightbox();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        next();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isOpen,
    closeLightbox,
    next,
    previous
  ]);

  if (!isOpen || !activeItem) {
    return null;
  }

  const isVideo =
    activeItem.type === "VIDEO" ||
    activeItem.type === "VIDEO_ASSET";

  const handleBackdropClick = (
    event
  ) => {
    if (
      event.target === event.currentTarget
    ) {
      closeLightbox();
    }
  };

  return (
    <div
      className="impilo-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="IMPILO media viewer"
      onClick={handleBackdropClick}
    >
      <div className="impilo-lightbox-panel">

        {/* CLOSE */}
        <button
          type="button"
          className="impilo-lightbox-close"
          onClick={closeLightbox}
          aria-label="Close media viewer"
        >
          ×
        </button>

        {/* COUNTER */}
        <div className="impilo-lightbox-counter">
          {current + 1} / {items.length}
        </div>

        {/* PREVIOUS */}
        {items.length > 1 && (
          <button
            type="button"
            className="impilo-lightbox-nav impilo-lightbox-prev"
            onClick={previous}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        {/* MEDIA */}
        <div className="impilo-lightbox-media-wrap">

          {isVideo ? (
            <video
              key={activeItem.id || activeItem.url}
              className="impilo-lightbox-media"
              src={activeItem.url}
              controls
              playsInline
            />
          ) : (
            <img
              key={activeItem.id || activeItem.url}
              className="impilo-lightbox-media"
              src={activeItem.url}
              alt={
                activeItem.altText ||
                activeItem.alt ||
                ""
              }
            />
          )}

        </div>

        {/* NEXT */}
        {items.length > 1 && (
          <button
            type="button"
            className="impilo-lightbox-nav impilo-lightbox-next"
            onClick={next}
            aria-label="Next image"
          >
            ›
          </button>
        )}

        {/* CAPTION */}
        {(activeItem.caption ||
          activeItem.credit) && (
          <div className="impilo-lightbox-caption">

            {activeItem.caption && (
              <p>
                {activeItem.caption}
              </p>
            )}

            {activeItem.credit && (
              <small>
                {activeItem.credit}
              </small>
            )}

          </div>
        )}

      </div>
    </div>
  );
}