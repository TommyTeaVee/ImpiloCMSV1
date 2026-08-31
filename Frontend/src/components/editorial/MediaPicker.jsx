import React, {
  useEffect,
  useState,
} from "react";

import api from "../../services/api";

import R2MediaLibrary
  from "../R2MediaLibrary.jsx";

import YouTubeMediaForm
  from "../editorial/YouTubeForm.jsx";


// ==================================================
// COMPUTER MEDIA UPLOAD
// ==================================================

function ComputerMediaUpload({
  type,
  onSelect,
  onClose,
}) {
  const [file, setFile] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [progress, setProgress] =
    useState(0);


  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);


  function handleFileChange(event) {
    const selectedFile =
      event.target.files?.[0];

    setError("");
    setProgress(0);

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }


    let isCorrectType = false;


    if (type === "IMAGE") {
      isCorrectType =
        selectedFile.type.startsWith(
          "image/"
        );
    } else if (type === "VIDEO") {
      isCorrectType =
        selectedFile.type.startsWith(
          "video/"
        );
    } else if (type === "AUDIO") {
      isCorrectType =
        selectedFile.type.startsWith(
          "audio/"
        );
    }


    if (!isCorrectType) {
      setFile(null);
      setPreview(null);

      setError(
        `Please choose a valid ${type.toLowerCase()} file.`
      );

      return;
    }


    setFile(selectedFile);


    if (type === "IMAGE") {
      const objectUrl =
        URL.createObjectURL(
          selectedFile
        );

      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  }


  async function handleUpload() {
    if (!file) {
      setError(
        "Please choose a file first."
      );

      return;
    }


    try {
      setUploading(true);
      setError("");
      setProgress(0);


      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );


      const response =
        await api.post(
          "/media/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            onUploadProgress:
              (event) => {
                if (event.total) {
                  const percent =
                    Math.round(
                      (
                        event.loaded /
                        event.total
                      ) * 100
                    );

                  setProgress(
                    percent
                  );
                }
              },
          }
        );


      const uploadedMedia =
        response.data?.media;


      if (!uploadedMedia?.id) {
        throw new Error(
          "Upload completed but no media asset was returned."
        );
      }


      onSelect(
        uploadedMedia
      );

    } catch (error) {
      console.error(
        "Computer media upload error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Unable to upload media."
      );

    } finally {
      setUploading(false);
    }
  }


  return (
    <section
      className="impilo-media-picker"
    >

      <button
        type="button"
        onClick={onClose}
        disabled={uploading}
      >
        ← Back
      </button>


      <header>
        <span>
          COMPUTER
        </span>

        <h3>
          Upload {type.toLowerCase()}
        </h3>
      </header>


      <div>
        <label
          htmlFor="editorial-media-file"
        >
          Choose file
        </label>

        <input
          id="editorial-media-file"
          type="file"
          accept={
            type === "IMAGE"
              ? "image/*"
              : type === "VIDEO"
              ? "video/*"
              : "audio/*"
          }
          onChange={
            handleFileChange
          }
          disabled={uploading}
        />
      </div>


      {file && (
        <div>
          <strong>
            {file.name}
          </strong>

          <p>
            {(
              file.size /
              (1024 * 1024)
            ).toFixed(2)}{" "}
            MB
          </p>
        </div>
      )}


      {preview && (
        <div>
          <img
            src={preview}
            alt={
              file?.name ||
              "Selected media"
            }
            style={{
              maxWidth: "400px",
              maxHeight: "300px",
              objectFit: "contain",
            }}
          />
        </div>
      )}


      {error && (
        <p role="alert">
          {error}
        </p>
      )}


      {uploading && (
        <div>
          <progress
            value={progress}
            max="100"
          />

          <p>
            Uploading... {progress}%
          </p>
        </div>
      )}


      <button
        type="button"
        onClick={handleUpload}
        disabled={
          !file ||
          uploading
        }
      >
        {uploading
          ? "Uploading..."
          : "Upload Media"}
      </button>

    </section>
  );
}


// ==================================================
// MEDIA METADATA EDITOR
// ==================================================

function MediaMetadataEditor({
  item,
  onSaved,
  onCancel,
}) {
  const [caption, setCaption] =
    useState(
      item?.caption || ""
    );

  const [altText, setAltText] =
    useState(
      item?.altText || ""
    );

  const [credit, setCredit] =
    useState(
      item?.credit || ""
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSave() {
    if (!item?.id) {
      setError(
        "This media item has no ID."
      );

      return;
    }


    try {
      setSaving(true);
      setError("");


      const response =
        await api.put(
          `/media/${item.id}`,
          {
            caption:
              caption.trim() ||
              null,

            altText:
              altText.trim() ||
              null,

            credit:
              credit.trim() ||
              null,
          }
        );


      const updatedMedia =
        response.data?.media;


      if (!updatedMedia) {
        throw new Error(
          "Media was updated but no media record was returned."
        );
      }


      onSaved(
        updatedMedia
      );

    } catch (error) {
      console.error(
        "Media metadata update error:",
        error
      );


      setError(
        error.response?.data?.message ||
        error.message ||
        "Unable to save media details."
      );

    } finally {
      setSaving(false);
    }
  }


  return (
    <section
      className="impilo-media-metadata-editor"
    >

      <header>
        <span>
          MEDIA DETAILS
        </span>

        <h3>
          Edit Media
        </h3>

        <p>
          Update the information attached
          to this media asset.
        </p>
      </header>


      {/* ==========================================
          MEDIA PREVIEW
      ========================================== */}

      <div
        className="impilo-media-metadata-preview"
      >

        {item?.type === "IMAGE" && (
          <img
            src={item.url}
            alt={
              item.altText ||
              item.filename ||
              "Media preview"
            }
            style={{
              maxWidth: "400px",
              maxHeight: "300px",
              objectFit: "contain",
            }}
          />
        )}


        {item?.type === "VIDEO" && (
          <video
            src={item.url}
            controls
            playsInline
            preload="metadata"
            style={{
              maxWidth: "500px",
              maxHeight: "300px",
            }}
          />
        )}


        {item?.type === "AUDIO" && (
          <audio
            src={item.url}
            controls
          />
        )}

      </div>


      {/* ==========================================
          FILENAME
      ========================================== */}

      <div>
        <label>
          Filename
        </label>

        <input
          type="text"
          value={
            item?.filename ||
            "Untitled media"
          }
          disabled
          readOnly
        />
      </div>


      {/* ==========================================
          PROVIDER
      ========================================== */}

      <div>
        <label>
          Provider
        </label>

        <input
          type="text"
          value={
            item?.provider ||
            ""
          }
          disabled
          readOnly
        />
      </div>


      {/* ==========================================
          CAPTION
      ========================================== */}

      <div>
        <label
          htmlFor="media-caption"
        >
          Caption
        </label>

        <input
          id="media-caption"
          type="text"
          value={caption}
          onChange={(event) =>
            setCaption(
              event.target.value
            )
          }
          placeholder="Enter a caption"
          disabled={saving}
        />
      </div>


      {/* ==========================================
          ALT TEXT
      ========================================== */}

      <div>
        <label
          htmlFor="media-alt-text"
        >
          Alt Text
        </label>

        <textarea
          id="media-alt-text"
          value={altText}
          onChange={(event) =>
            setAltText(
              event.target.value
            )
          }
          placeholder="Describe the image for accessibility"
          rows="4"
          disabled={saving}
        />
      </div>


      {/* ==========================================
          CREDIT
      ========================================== */}

      <div>
        <label
          htmlFor="media-credit"
        >
          Credit
        </label>

        <input
          id="media-credit"
          type="text"
          value={credit}
          onChange={(event) =>
            setCredit(
              event.target.value
            )
          }
          placeholder="Photographer, videographer, source, etc."
          disabled={saving}
        />
      </div>


      {error && (
        <p role="alert">
          {error}
        </p>
      )}


      {/* ==========================================
          ACTIONS
      ========================================== */}

      <div>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>


        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Details"}
        </button>

      </div>

    </section>
  );
}


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
  // LIBRARY STATE
  // ==================================================

  const [
    libraryMedia,
    setLibraryMedia
  ] = useState([]);


  const [
    libraryLoading,
    setLibraryLoading
  ] = useState(false);


  const [
    libraryError,
    setLibraryError
  ] = useState("");


  const [
    librarySearch,
    setLibrarySearch
  ] = useState("");


  const [
    librarySort,
    setLibrarySort
  ] = useState("NEWEST");


  // ==================================================
  // METADATA EDITOR STATE
  // ==================================================

  const [
    editingMedia,
    setEditingMedia
  ] = useState(null);


  // ==================================================
  // KEEP SELECTED MEDIA IN SYNC
  // ==================================================

  useEffect(() => {
    setSelectedId(
      selectedMediaId || null
    );
  }, [
    selectedMediaId
  ]);


  // ==================================================
  // LOAD MEDIA LIBRARY
  // ==================================================

  async function loadLibrary() {
    try {
      setLibraryLoading(true);
      setLibraryError("");


      const response =
        await api.get(
          "/media"
        );


      const assets =
        Array.isArray(
          response.data?.media
        )
          ? response.data.media
          : [];


      setLibraryMedia(
        assets
      );

    } catch (error) {
      console.error(
        "Media library error:",
        error
      );


      setLibraryMedia([]);


      setLibraryError(
        error.response?.data?.message ||
        "Unable to load media library"
      );

    } finally {
      setLibraryLoading(
        false
      );
    }
  }


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
      onSelect(
        item
      );
    }


    setSource(
      null
    );
  }


  // ==================================================
  // METADATA SAVED
  // ==================================================

  function handleMetadataSaved(
    updatedMedia
  ) {
    setLibraryMedia(
      (currentMedia) =>
        currentMedia.map(
          (item) =>
            item.id ===
            updatedMedia.id
              ? updatedMedia
              : item
        )
    );


    setEditingMedia(
      null
    );
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
            onClick={() => {
              setSource(
                "library"
              );

              setLibrarySearch(
                ""
              );

              setLibrarySort(
                "NEWEST"
              );

              loadLibrary();
            }}
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
              setSource(
                "r2"
              )
            }
            className="impilo-media-picker-source"
          >

            <span
              className="impilo-media-picker-source-icon"
            >
              ☁
            </span>

            <strong>
              R2 Storage
            </strong>

            <small>
              Browse Cloudflare R2 folders
            </small>

          </button>


          {/* ========================================
              YOUTUBE
          ======================================== */}

          {type === "VIDEO" && (
            <button
              type="button"
              onClick={() =>
                setSource(
                  "youtube"
                )
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
              setSource(
                "computer"
              )
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
    source ===
    "r2"
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


        <R2MediaLibrary
          type={type}
          onSelect={
            handleSelect
          }
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
    source ===
    "library"
  ) {

    // ----------------------------------------------
    // FILTER + SEARCH + SORT
    // ----------------------------------------------

    const filteredMedia =
      libraryMedia
        .filter((item) => {

          const mediaType =
            String(
              item?.type || ""
            ).toUpperCase();


          const currentType =
            String(
              type || ""
            ).toUpperCase();


          // The article block type
          // remains authoritative.
          if (
            mediaType !==
            currentType
          ) {
            return false;
          }


          const search =
            librarySearch
              .trim()
              .toLowerCase();


          if (!search) {
            return true;
          }


          const searchableText = [
            item?.filename,
            item?.caption,
            item?.altText,
            item?.credit,
            item?.provider,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          return searchableText.includes(
            search
          );
        })
        .sort((a, b) => {

          if (
            librarySort ===
            "NAME_ASC"
          ) {
            return String(
              a?.filename || ""
            ).localeCompare(
              String(
                b?.filename || ""
              )
            );
          }


          if (
            librarySort ===
            "NAME_DESC"
          ) {
            return String(
              b?.filename || ""
            ).localeCompare(
              String(
                a?.filename || ""
              )
            );
          }


          const dateA =
            new Date(
              a?.createdAt || 0
            ).getTime();


          const dateB =
            new Date(
              b?.createdAt || 0
            ).getTime();


          if (
            librarySort ===
            "OLDEST"
          ) {
            return (
              dateA -
              dateB
            );
          }


          return (
            dateB -
            dateA
          );
        });


    // ==================================================
    // METADATA EDITOR
    // ==================================================

    if (editingMedia) {
      return (
        <section
          className="impilo-media-picker"
        >

          <button
            type="button"
            onClick={() =>
              setEditingMedia(
                null
              )
            }
          >
            ← Back to Library
          </button>


          <MediaMetadataEditor
            item={
              editingMedia
            }
            onSaved={
              handleMetadataSaved
            }
            onCancel={() =>
              setEditingMedia(
                null
              )
            }
          />

        </section>
      );
    }


    // ==================================================
    // LIBRARY VIEW
    // ==================================================

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


        {/* ==========================================
            SEARCH + SORT CONTROLS
        ========================================== */}

        {!libraryLoading &&
          !libraryError && (
            <div
              className="impilo-media-library-controls"
            >

              <div>

                <label
                  htmlFor="media-library-search"
                >
                  Search media
                </label>

                <input
                  id="media-library-search"
                  type="search"
                  value={
                    librarySearch
                  }
                  onChange={(event) =>
                    setLibrarySearch(
                      event.target.value
                    )
                  }
                  placeholder="Search filename, caption, credit..."
                />

              </div>


              <div>

                <label
                  htmlFor="media-library-sort"
                >
                  Sort
                </label>

                <select
                  id="media-library-sort"
                  value={
                    librarySort
                  }
                  onChange={(event) =>
                    setLibrarySort(
                      event.target.value
                    )
                  }
                >

                  <option value="NEWEST">
                    Newest
                  </option>

                  <option value="OLDEST">
                    Oldest
                  </option>

                  <option value="NAME_ASC">
                    Name A–Z
                  </option>

                  <option value="NAME_DESC">
                    Name Z–A
                  </option>

                </select>

              </div>

            </div>
          )}


        {/* ==========================================
            LOADING
        ========================================== */}

        {libraryLoading && (
          <p>
            Loading IMPILO media...
          </p>
        )}


        {/* ==========================================
            ERROR
        ========================================== */}

        {libraryError && (
          <p role="alert">
            {libraryError}
          </p>
        )}


        {/* ==========================================
            NO RESULTS
        ========================================== */}

        {!libraryLoading &&
          !libraryError &&
          filteredMedia.length ===
            0 && (

            <p>
              {librarySearch.trim()
                ? `No ${type.toLowerCase()} media matches "${librarySearch}".`
                : `No existing ${type.toLowerCase()} media available.`}
            </p>

          )}


        {/* ==========================================
            MEDIA CONTENT
        ========================================== */}

        {!libraryLoading &&
          !libraryError &&
          filteredMedia.length >
            0 && (

            <div
              className="impilo-media-library-content"
            >

              {/* ====================================
                  RESULT COUNT
              ==================================== */}

              <div
                className="impilo-media-library-result-count"
              >
                {filteredMedia.length}{" "}
                {type.toLowerCase()}{" "}
                {filteredMedia.length === 1
                  ? "item"
                  : "items"}
              </div>


              {/* ====================================
                  MEDIA GRID
              ==================================== */}

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
                        item.type ||
                        ""
                      ).toUpperCase() ===
                      "VIDEO";


                    const isAudio =
                      String(
                        item.type ||
                        ""
                      ).toUpperCase() ===
                      "AUDIO";


                    return (
                      <article
                        key={
                          item.id
                        }
                        className={
                          isSelected
                            ? "impilo-media-picker-item is-selected"
                            : "impilo-media-picker-item"
                        }
                      >

                        {/* ============================
                            MEDIA PREVIEW
                        ============================ */}

                        <div
                          className="impilo-media-picker-preview"
                        >

                          {isVideo ? (

                            <video
                              src={
                                item.url
                              }
                              muted
                              playsInline
                              preload="metadata"
                            />

                          ) : isAudio ? (

                            <audio
                              src={
                                item.url
                              }
                              controls
                            />

                          ) : (

                            <img
                              src={
                                item.url
                              }
                              alt={
                                item.altText ||
                                item.caption ||
                                item.filename ||
                                "IMPILO media"
                              }
                              loading="lazy"
                            />

                          )}

                        </div>


                        {/* ============================
                            MEDIA INFORMATION
                        ============================ */}

                        <div
                          className="impilo-media-picker-info"
                        >

                          <strong>
                            {item.caption ||
                              item.filename ||
                              "Untitled media"}
                          </strong>


                          <small>
                            {item.filename ||
                              "No filename"}
                          </small>


                          <small>
                            {item.provider}
                          </small>


                          {item.credit && (
                            <small>
                              Credit:{" "}
                              {item.credit}
                            </small>
                          )}

                        </div>


                        {/* ============================
                            ACTIONS
                        ============================ */}

                        <div
                          className="impilo-media-picker-actions"
                        >

                          <button
                            type="button"
                            onClick={() =>
                              handleSelect(
                                item
                              )
                            }
                          >
                            {isSelected
                              ? "Selected"
                              : "Select"}
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              setEditingMedia(
                                item
                              )
                            }
                          >
                            Edit Details
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            </div>
          )}

      </section>
    );
  }


  // ==================================================
  // YOUTUBE
  // ==================================================

  if (
    source ===
    "youtube"
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
          onSelect={
            handleSelect
          }
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
    source ===
    "computer"
  ) {

    return (
      <ComputerMediaUpload
        type={type}
        onSelect={
          handleSelect
        }
        onClose={() =>
          setSource(null)
        }
      />
    );
  }


  return null;
}