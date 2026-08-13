import React, {
  useEffect,
  useState,
} from "react";

import CloudFrontMediaLibrary
  from "../CloudFrontMediaLibrary.jsx";

import YouTubeMediaForm
  from "../editorial/YouTubeForm.jsx";


// ==================================================
// MEDIA PICKER
// ==================================================

export default function MediaPicker({
  type = "IMAGE",
  media = [],
  selectedMediaId = null,
  onSelect,
  onClose,
}) {

  const [
    selectedId,
    setSelectedId
  ] = useState(
    selectedMediaId
  );

  const [
    source,
    setSource
  ] = useState(null);


  // ==================================================
  // KEEP SELECTED MEDIA IN SYNC
  // ==================================================

  useEffect(() => {

    setSelectedId(
      selectedMediaId || null
    );

  }, [selectedMediaId]);


  // ==================================================
  // SELECT MEDIA
  // ==================================================

  function handleSelect(item) {

    if (!item) {
      return;
    }


    setSelectedId(
      item.id || null
    );


    if (
      typeof onSelect ===
      "function"
    ) {

      onSelect(item);

    }


    setSource(null);
  }


  // ==================================================
  // SOURCE SELECTION
  // ==================================================

  if (!source) {

    return (
      <section
        className="impilo-media-picker"
      >

        <header
          className="impilo-media-picker-header"
        >

          <div>

            <span>
              MEDIA PICKER
            </span>

            <h3>
              Select{" "}
              {type.toLowerCase()}
            </h3>

          </div>


          {onClose && (

            <button
              type="button"
              onClick={onClose}
            >
              Close
            </button>

          )}

        </header>


        <div
          className="impilo-media-picker-sources"
        >

          {/* ========================================
              LIBRARY
          ======================================== */}

          <button
            type="button"
            onClick={() =>
              setSource("library")
            }
            className="impilo-media-picker-source"
          >

            <span
              className="impilo-media-picker-source-icon"
            >
              📚
            </span>

            <strong>
              Library
            </strong>

            <small>
              Existing IMPILO media
            </small>

          </button>


          {/* ========================================
              CLOUDFRONT
          ======================================== */}

          <button
            type="button"
            onClick={() =>
              setSource("cloudfront")
            }
            className="impilo-media-picker-source"
          >

            <span
              className="impilo-media-picker-source-icon"
            >
              ☁
            </span>

            <strong>
              CloudFront
            </strong>

            <small>
              Browse CloudFront folders
            </small>

          </button>


          {/* ========================================
              YOUTUBE
              Only available for VIDEO
          ======================================== */}

          {type === "VIDEO" && (

            <button
              type="button"
              onClick={() =>
                setSource("youtube")
              }
              className="impilo-media-picker-source"
            >

              <span
                className="impilo-media-picker-source-icon"
              >
                ▶
              </span>

              <strong>
                YouTube
              </strong>

              <small>
                Add a YouTube video
              </small>

            </button>

          )}


          {/* ========================================
              COMPUTER
          ======================================== */}

          <button
            type="button"
            onClick={() =>
              setSource("computer")
            }
            className="impilo-media-picker-source"
          >

            <span
              className="impilo-media-picker-source-icon"
            >
              💻
            </span>

            <strong>
              Computer
            </strong>

            <small>
              Upload from your computer
            </small>

          </button>

        </div>

      </section>
    );
  }


  // ==================================================
  // CLOUDFRONT
  // ==================================================

  if (
    source === "cloudfront"
  ) {

    return (
      <section>

        <button
          type="button"
          onClick={() =>
            setSource(null)
          }
        >
          ← Back
        </button>


        <CloudFrontMediaLibrary
          type={type}
          onSelect={handleSelect}
          onClose={() =>
            setSource(null)
          }
        />

      </section>
    );
  }


  // ==================================================
  // EXISTING MEDIA LIBRARY
  // ==================================================

  if (
    source === "library"
  ) {

    const filteredMedia =
      Array.isArray(media)
        ? media.filter(
            (item) =>
              String(
                item?.type || ""
              ).toUpperCase() ===
              String(
                type
              ).toUpperCase()
          )
        : [];


    return (
      <section
        className="impilo-media-picker"
      >

        <button
          type="button"
          onClick={() =>
            setSource(null)
          }
        >
          ← Back
        </button>


        <header>

          <span>
            MEDIA LIBRARY
          </span>

          <h3>
            Existing IMPILO Media
          </h3>

        </header>


        {filteredMedia.length === 0 ? (

          <p>
            No existing{" "}
            {type.toLowerCase()} media
            available.
          </p>

        ) : (

          <div
            className="impilo-media-picker-grid"
          >

            {filteredMedia.map(
              (item) => {

                const isSelected =
                  selectedId ===
                  item.id;


                const isVideo =
                  String(
                    item.type || ""
                  ).toUpperCase() ===
                  "VIDEO";


                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      isSelected
                        ? "impilo-media-picker-item is-selected"
                        : "impilo-media-picker-item"
                    }
                    onClick={() =>
                      handleSelect(
                        item
                      )
                    }
                  >

                    <div>

                      {isVideo ? (

                        <video
                          src={
                            item.url
                          }
                          muted
                          playsInline
                          preload="metadata"
                        />

                      ) : (

                        <img
                          src={
                            item.url
                          }
                          alt={
                            item.altText ||
                            item.caption ||
                            "IMPILO media"
                          }
                        />

                      )}

                    </div>


                    <strong>
                      {item.caption ||
                        item.filename ||
                        "Untitled media"}
                    </strong>

                  </button>
                );

              }
            )}

          </div>

        )}

      </section>
    );
  }


  // ==================================================
  // YOUTUBE
  // ==================================================

  if (
    source === "youtube"
  ) {

    return (
      <section
        className="impilo-media-picker"
      >

        <button
          type="button"
          onClick={() =>
            setSource(null)
          }
        >
          ← Back
        </button>


        <header>

          <span>
            YOUTUBE
          </span>

          <h3>
            Add YouTube Video
          </h3>

        </header>


        <YouTubeMediaForm
          onSelect={handleSelect}
          onClose={() =>
            setSource(null)
          }
        />

      </section>
    );
  }


  // ==================================================
  // COMPUTER
  // ==================================================

  if (
    source === "computer"
  ) {

    return (
      <section
        className="impilo-media-picker"
      >

        <button
          type="button"
          onClick={() =>
            setSource(null)
          }
        >
          ← Back
        </button>


        <header>

          <span>
            COMPUTER
          </span>

          <h3>
            Upload from Computer
          </h3>

        </header>


        <p>
          Computer upload will be
          connected to the IMPILO
          CloudFront upload system
          next.
        </p>

      </section>
    );
  }


  return null;
}