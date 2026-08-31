import { useState } from "react";

import api from "../services/api";


// ==================================================
// R2 MEDIA LIBRARY
// ==================================================

export default function R2MediaLibrary({
  type = "IMAGE",
  onSelect,
  onClose,
}) {

  const [folder, setFolder] = useState(
    "assets/models_land"
  );

  const [items, setItems] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [opened, setOpened] =
    useState(false);


  // ==================================================
  // LOAD R2 FOLDER
  // ==================================================

  async function loadFolder() {

    if (!folder.trim()) {

      setError(
        "Enter a folder name"
      );

      return;
    }


    try {

      setLoading(true);

      setError(null);


      /*
       * IMPORTANT:
       *
       * The backend route is still:
       *
       * /cloudfront-media/folder
       *
       * We are keeping that route for
       * compatibility.
       *
       * The storage behind it is now
       * Cloudflare R2.
       */

      const response =
        await api.get(
          "/cloudfront-media/folder",
          {
            params: {
              folder:
                folder.trim(),
            },
          }
        );


      const objects =
        response.data.objects ||
        [];


      setItems(
        objects.filter(
          (item) =>
            isSupportedMedia(
              item,
              type
            )
        )
      );


      setOpened(true);


    } catch (error) {

      console.error(
        "R2 media library error:",
        error
      );


      setItems([]);


      setError(
        error.response?.data
          ?.message ||
        "Unable to load R2 folder"
      );


    } finally {

      setLoading(false);

    }
  }


  // ==================================================
  // SELECT R2 MEDIA
  // ==================================================

  function handleSelect(item) {

    if (!item?.url) {
      return;
    }


    onSelect?.({

      type,

      provider:
        "R2",

      url:
        item.url,

      filename:
        item.filename,

      key:
        item.key,

      mimeType:
        item.mimeType ||
        getMimeType(
          item.filename
        ),

    });
  }


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <section
      className="r2-media-library"
    >

      {/* ==========================================
          HEADER
      ========================================== */}

      <header>

        <div>

          <span>
            R2 STORAGE
          </span>

          <h2>
            Media Library
          </h2>

          <p>
            Browse Cloudflare R2 folders
            and select media.
          </p>

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


      {/* ==========================================
          FOLDER CONTROLS
      ========================================== */}

      <div>

        <label
          htmlFor="r2-folder"
        >
          R2 Folder
        </label>


        <input
          id="r2-folder"
          type="text"
          value={folder}
          onChange={(event) =>
            setFolder(
              event.target.value
            )
          }
          placeholder="assets/models_land"
        />


        <button
          type="button"
          onClick={loadFolder}
          disabled={loading}
        >

          {loading
            ? "Loading..."
            : "Open Folder"}

        </button>

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (

        <p role="alert">

          {error}

        </p>

      )}


      {/* ==========================================
          RESULTS
      ========================================== */}

      {opened &&
        !loading && (

          <div>

            {/* --------------------------------------
                RESULT HEADER
            -------------------------------------- */}

            <div>

              <strong>
                {folder}
              </strong>

              <span>
                {" "}
                — {items.length} media
              </span>

            </div>


            {/* --------------------------------------
                EMPTY STATE
            -------------------------------------- */}

            {items.length === 0 ? (

              <p>

                No compatible{" "}

                {type.toLowerCase()}

                {" "}media found in this folder.

              </p>

            ) : (


              /* ------------------------------------
                 MEDIA GRID
              ------------------------------------ */

              <div
                className="r2-media-grid"
              >

                {items.map(
                  (item) => {

                    return (

                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          handleSelect(
                            item
                          )
                        }
                        className="r2-media-item"
                      >

                        {/* ==========================
                            IMAGE
                        ========================== */}

                        {type ===
                        "IMAGE" ? (

                          <img
                            src={
                              item.url
                            }
                            alt={
                              item.filename
                            }
                            loading="lazy"
                          />

                        ) : type ===
                          "VIDEO" ? (


                          /* ========================
                             VIDEO
                          ======================== */

                          <video
                            src={
                              item.url
                            }
                            muted
                            playsInline
                            preload="metadata"
                          />


                        ) : (


                          /* ========================
                             AUDIO
                          ======================== */

                          <div>
                            🎵
                          </div>

                        )}


                        {/* ==========================
                            FILENAME
                        ========================== */}

                        <span>

                          {
                            item.filename
                          }

                        </span>

                      </button>

                    );

                  }
                )}

              </div>

            )}

          </div>

        )}

    </section>

  );
}


// ==================================================
// MEDIA FILTER
// ==================================================

function isSupportedMedia(
  item,
  type
) {

  const filename =
    String(
      item?.filename || ""
    ).toLowerCase();


  const extension =
    filename.includes(".")
      ? filename
          .split(".")
          .pop()
      : "";


  // ----------------------------------------------
  // IMAGE
  // ----------------------------------------------

  if (type === "IMAGE") {

    return [

      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "avif",

    ].includes(extension);

  }


  // ----------------------------------------------
  // VIDEO
  // ----------------------------------------------

  if (type === "VIDEO") {

    return [

      "mp4",
      "webm",
      "mov",
      "m4v",

    ].includes(extension);

  }


  // ----------------------------------------------
  // AUDIO
  // ----------------------------------------------

  if (type === "AUDIO") {

    return [

      "mp3",
      "wav",
      "ogg",
      "m4a",
      "aac",
      "flac",

    ].includes(extension);

  }


  return false;
}


// ==================================================
// MIME TYPE
// ==================================================

function getMimeType(
  filename
) {

  const extension =
    String(
      filename || ""
    )
      .toLowerCase()
      .split(".")
      .pop();


  const mimeTypes = {

    jpg:
      "image/jpeg",

    jpeg:
      "image/jpeg",

    png:
      "image/png",

    webp:
      "image/webp",

    gif:
      "image/gif",

    avif:
      "image/avif",

    mp4:
      "video/mp4",

    webm:
      "video/webm",

    mov:
      "video/quicktime",

    m4v:
      "video/x-m4v",

    mp3:
      "audio/mpeg",

    wav:
      "audio/wav",

    ogg:
      "audio/ogg",

    m4a:
      "audio/mp4",

    aac:
      "audio/aac",

    flac:
      "audio/flac",

  };


  return (
    mimeTypes[extension] ||
    null
  );
}