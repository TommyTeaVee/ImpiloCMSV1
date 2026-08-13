import { useState } from "react";
import api from "../services/api";

export default function CloudFrontMediaLibrary({
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
        "CloudFront library error:",
        error
      );

      setItems([]);

      setError(
        error.response?.data
          ?.message ||
        "Unable to load CloudFront folder"
      );

    } finally {
      setLoading(false);
    }
  }


  function handleSelect(item) {
    if (!item?.url) {
      return;
    }

    onSelect?.({
      type,

      provider:
        "CLOUDFRONT",

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


  return (
    <section className="cloudfront-media-library">

      <header>
        <div>

          <span>
            CLOUDFRONT
          </span>

          <h2>
            Media Library
          </h2>

          <p>
            Browse CloudFront folders
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


      <div>

        <label
          htmlFor="cloudfront-folder"
        >
          CloudFront Folder
        </label>

        <input
          id="cloudfront-folder"
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


      {error && (
        <p role="alert">
          {error}
        </p>
      )}


      {opened &&
        !loading && (
          <div>

            <div>
              <strong>
                {folder}
              </strong>

              <span>
                {" "}
                — {items.length} media
              </span>
            </div>


            {items.length === 0 ? (

              <p>
                No compatible{" "}
                {type.toLowerCase()} media
                found in this folder.
              </p>

            ) : (

              <div
                className="cloudfront-media-grid"
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
                        className="cloudfront-media-item"
                      >

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

                          <video
                            src={
                              item.url
                            }
                            muted
                            playsInline
                            preload="metadata"
                          />

                        ) : (

                          <div>
                            🎵
                          </div>

                        )}


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

  if (type === "VIDEO") {
    return [
      "mp4",
      "webm",
      "mov",
      "m4v",
    ].includes(extension);
  }

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
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",

    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",

    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    flac: "audio/flac",
  };

  return (
    mimeTypes[extension] ||
    null
  );
}