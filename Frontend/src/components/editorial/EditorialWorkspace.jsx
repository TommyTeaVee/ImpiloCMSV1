import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import api from "../../services/api";
import MediaPicker from "./MediaPicker.jsx";
export default function EditorialWorkspace() {
  const navigate = useNavigate();

  const [
    searchParams
  ] = useSearchParams();

  const articleId =
    searchParams.get("articleId");

  const isEditing =
    Boolean(articleId);

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [blocks, setBlocks] =
    useState([]);

  const [loadingArticle, setLoadingArticle] =
    useState(isEditing);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    draggedIndex,
    setDraggedIndex
  ] = useState(null);

  const [
    dragOverIndex,
    setDragOverIndex
  ] = useState(null);
  // ==================================================
// MEDIA PICKER
// ==================================================

const [
  mediaPickerIndex,
  setMediaPickerIndex
] = useState(null);

  // ==================================================
  // LOAD EXISTING ARTICLE
  // ==================================================

  useEffect(() => {
    if (!articleId) {
      setLoadingArticle(false);
      return;
    }

    async function loadArticle() {
      try {
        setLoadingArticle(true);
        setError("");

        const response =
          await api.get(
            `/articles/manage/${articleId}`
          );

        /*
         * Backend may return:
         *
         * {
         *   article: {...}
         * }
         *
         * or the article directly.
         */

        const article =
          response.data?.article ||
          response.data;

        if (!article) {
          throw new Error(
            "Article was not returned by the server."
          );
        }

        setTitle(
          article.title || ""
        );

        setSlug(
          article.slug || ""
        );

        setExcerpt(
          article.excerpt || ""
        );

        const databaseBlocks =
          Array.isArray(
            article.blocks
          )
            ? [...article.blocks]
                .sort(
                  (a, b) =>
                    (a.position ?? 0) -
                    (b.position ?? 0)
                )
            : [];

        /*
         * Keep the database ID separate
         * from the temporary frontend ID.
         */

        setBlocks(
          databaseBlocks.map(
            (block) => ({
              ...block,

              clientId:
                block.id ||
                crypto.randomUUID(),

              content:
                block.content || {},

              mediaId:
                block.mediaId ||
                null
            })
          )
        );

      } catch (err) {
        console.error(
          "Load article error:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load article."
        );
      } finally {
        setLoadingArticle(false);
      }
    }

    loadArticle();
  }, [articleId]);

  // ==================================================
  // CREATE SLUG
  // ==================================================

  function createSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );
  }

  // ==================================================
  // TITLE
  // ==================================================

  function handleTitleChange(event) {
    const value =
      event.target.value;

    setTitle(value);

    if (!isEditing && !slug) {
      setSlug(
        createSlug(value)
      );
    }
  }

  // ==================================================
  // ADD BLOCK
  // ==================================================

  function addBlock(type) {
    let block = null;

    switch (type) {
      case "TEXT":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "TEXT",
          content: {
            text: ""
          },
          mediaId: null
        };
        break;

      case "HEADING":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "HEADING",
          content: {
            text: ""
          },
          mediaId: null
        };
        break;

      case "QUOTE":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "QUOTE",
          content: {
            text: ""
          },
          mediaId: null
        };
        break;

      case "IMAGE":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "IMAGE",
          content: {
            layout: "full"
          },
          mediaId: null
        };
        break;

      case "VIDEO":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "VIDEO",
          content: {
            layout: "full"
          },
          mediaId: null
        };
        break;

      case "AUDIO":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "AUDIO",
          content: {
            layout: "full"
          },
          mediaId: null
        };
        break;

      default:
        return;
    }

    setBlocks(
      (current) => [
        ...current,
        block
      ]
    );

    setMessage("");
    setError("");
  }

  // ==================================================
  // UPDATE TEXT
  // ==================================================

  function updateText(
    index,
    value
  ) {
    setBlocks(
      (current) => {
        const next =
          [...current];

        next[index] = {
          ...next[index],

          content: {
            ...(next[index]
              .content || {}),
            text: value
          }
        };

        return next;
      }
    );
  }

  // ==================================================
  // UPDATE MEDIA ID
  // ==================================================

  function updateMediaId(
    index,
    value
  ) {
    setBlocks(
      (current) => {
        const next =
          [...current];

        next[index] = {
          ...next[index],

          mediaId:
            value.trim() ||
            null
        };

        return next;
      }
    );
  }
  // ==================================================
// SELECT MEDIA FROM MEDIA PICKER
// ==================================================

async function handleMediaSelected(
  index,
  media
) {
  try {
    setError("");
    setMessage("");

    if (!media) {
      return;
    }

    // ------------------------------------------------
    // Existing database media
    // ------------------------------------------------

    if (media.id) {
      setBlocks((current) => {
        const next = [...current];

        next[index] = {
          ...next[index],

          mediaId: media.id,

          media: media
        };

        return next;
      });

      setMediaPickerIndex(null);

      return;
    }

    // ------------------------------------------------
    // CloudFront media
    //
    // CloudFront library gives us a URL/key,
    // but not yet a mediaAsset ID.
    //
    // Register it in mediaAsset first.
    // ------------------------------------------------

    const response =
  await api.post(
    "/media",
    {
      type:
        media.type ||
        "IMAGE",

      provider:
        media.provider ||
        "CLOUDFRONT",

      url:
        media.url,

      externalId:
        media.externalId ||
        null,

      filename:
        media.filename ||
        null,

      mimeType:
        media.mimeType ||
        null,

      altText:
        media.altText ||
        null,

      caption:
        media.caption ||
        null,

      credit:
        media.credit ||
        null,

      width:
        media.width ??
        null,

      height:
        media.height ??
        null,

      duration:
        media.duration ??
        null
    }
  );

    const createdMedia =
      response.data?.media;

    if (!createdMedia?.id) {
      throw new Error(
        "Media asset was not created."
      );
    }

    // ------------------------------------------------
    // Attach mediaAsset to block
    // ------------------------------------------------

    setBlocks((current) => {
      const next = [...current];

      next[index] = {
        ...next[index],

        mediaId:
          createdMedia.id,

        media:
          createdMedia
      };

      return next;
    });

    setMediaPickerIndex(null);

    setMessage(
      "Media added to article."
    );

  } catch (err) {
    console.error(
      "Select media error:",
      err
    );

    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to add media."
    );
  }
}

  // ==================================================
  // DELETE BLOCK
  // ==================================================

  function deleteBlock(index) {
    setBlocks(
      (current) =>
        current.filter(
          (_, blockIndex) =>
            blockIndex !== index
        )
    );
  }

  // ==================================================
  // MOVE BLOCK
  // ==================================================

  function moveBlock(
    index,
    direction
  ) {
    setBlocks(
      (current) => {
        const next =
          [...current];

        const newIndex =
          index + direction;

        if (
          newIndex < 0 ||
          newIndex >=
            next.length
        ) {
          return current;
        }

        [
          next[index],
          next[newIndex]
        ] = [
          next[newIndex],
          next[index]
        ];

        return next;
      }
    );
  }

  // ==================================================
  // DRAG START
  // ==================================================

  function handleDragStart(
    index,
    event
  ) {
    setDraggedIndex(index);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(index)
    );
  }

  // ==================================================
  // DRAG OVER
  // ==================================================

  function handleDragOver(
    index,
    event
  ) {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setDragOverIndex(index);
  }

  // ==================================================
  // DROP
  // ==================================================

  function handleDrop(
    index,
    event
  ) {
    event.preventDefault();

    if (
      draggedIndex === null ||
      draggedIndex === index
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setBlocks(
      (current) => {
        const next =
          [...current];

        const [
          movedBlock
        ] =
          next.splice(
            draggedIndex,
            1
          );

        next.splice(
          index,
          0,
          movedBlock
        );

        return next;
      }
    );

    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  // ==================================================
  // DRAG END
  // ==================================================

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  // ==================================================
  // WORD COUNT
  // ==================================================

  const wordCount =
    useMemo(() => {
      return blocks.reduce(
        (
          total,
          block
        ) => {
          if (
            block.type !==
              "TEXT" &&
            block.type !==
              "HEADING" &&
            block.type !==
              "QUOTE"
          ) {
            return total;
          }

          const text =
            block.content
              ?.text || "";

          const words =
            String(text)
              .replace(
                /<[^>]*>/g,
                " "
              )
              .trim()
              .split(/\s+/)
              .filter(Boolean);

          return (
            total +
            words.length
          );
        },
        0
      );
    }, [blocks]);

  // ==================================================
  // SAVE NEW ARTICLE
  // ==================================================

  async function createDraft() {
    const payload = {
      title:
        title.trim(),

      slug:
        slug.trim(),

      excerpt:
        excerpt.trim(),

      blocks:
        blocks.map(
          (
            block,
            index
          ) => ({
            type:
              block.type,

            position:
              index,

            content:
              block.content ||
              {},

            mediaId:
              block.mediaId ||
              null
          })
        )
    };

    return api.post(
      "/articles",
      payload
    );
  }

  // ==================================================
  // SAVE
  // ==================================================

 // ==================================================
// SAVE ARTICLE
// ==================================================
// ==================================================
// INSERT LAYOUT TEMPLATE
// ==================================================

function insertTemplate(template) {
  const templates = {
    textImageText: [
      {
        clientId: crypto.randomUUID(),
        type: "TEXT",
        content: {
          text: ""
        },
        mediaId: null
      },
      {
        clientId: crypto.randomUUID(),
        type: "IMAGE",
        content: {
          layout: "full"
        },
        mediaId: null
      },
      {
        clientId: crypto.randomUUID(),
        type: "TEXT",
        content: {
          text: ""
        },
        mediaId: null
      }
    ],

    imageTextText: [
      {
        clientId: crypto.randomUUID(),
        type: "IMAGE",
        content: {
          layout: "full"
        },
        mediaId: null
      },
      {
        clientId: crypto.randomUUID(),
        type: "TEXT",
        content: {
          text: ""
        },
        mediaId: null
      },
      {
        clientId: crypto.randomUUID(),
        type: "TEXT",
        content: {
          text: ""
        },
        mediaId: null
      }
    ],

    textVideoText: [
      {
        clientId: crypto.randomUUID(),
        type: "TEXT",
        content: {
          text: ""
        },
        mediaId: null
      },
      {
        clientId: crypto.randomUUID(),
        type: "VIDEO",
        content: {
          layout: "full"
        },
        mediaId: null
      },
      {
        clientId: crypto.randomUUID(),
        type: "TEXT",
        content: {
          text: ""
        },
        mediaId: null
      }
    ]
  };

  const selectedTemplate =
    templates[template];

  if (!selectedTemplate) {
    return;
  }

  setBlocks(
    (current) => [
      ...current,
      ...selectedTemplate
    ]
  );

  setMessage("");
  setError("");
}
async function saveDraft() {
  setMessage("");
  setError("");

  if (!title.trim()) {
    setError(
      "Article title is required."
    );
    return;
  }

  if (!slug.trim()) {
    setError(
      "Article slug is required."
    );
    return;
  }

  if (blocks.length === 0) {
    setError(
      "Add at least one content block."
    );
    return;
  }

  try {
    setSaving(true);

    // ==================================================
    // PREPARE BLOCKS
    // ==================================================

    const preparedBlocks =
      blocks.map(
        (block, index) => ({
          type: block.type,

          position: index,

          content:
            block.content || {},

          mediaId:
            block.mediaId || null
        })
      );

    // ==================================================
    // UPDATE EXISTING ARTICLE
    // ==================================================

    if (isEditing) {
      const response =
        await api.put(
          `/articles/manage/${articleId}`,
          {
            title:
              title.trim(),

            slug:
              slug.trim(),

            excerpt:
              excerpt.trim(),

            blocks:
              preparedBlocks
          }
        );

      const updatedArticle =
        response.data?.article;

      // Update the local block IDs returned
      // by the database.

      if (
        updatedArticle &&
        Array.isArray(
          updatedArticle.blocks
        )
      ) {
        setBlocks(
          updatedArticle.blocks.map(
            (block) => ({
              ...block,

              clientId:
                block.id
            })
          )
        );
      }

      setMessage(
        response.data?.message ||
        "Article updated successfully."
      );

      return;
    }

    // ==================================================
    // CREATE NEW ARTICLE
    // ==================================================

    const response =
      await api.post(
        "/articles",
        {
          title:
            title.trim(),

          slug:
            slug.trim(),

          excerpt:
            excerpt.trim(),

          blocks:
            preparedBlocks
        }
      );

    const createdArticle =
      response.data?.article;

    setMessage(
      response.data?.message ||
      "Draft saved successfully."
    );

    // Move the newly created article
    // into edit mode.

    if (
      createdArticle?.id
    ) {
      navigate(
        `/editorial/new?articleId=${createdArticle.id}`,
        {
          replace: true
        }
      );
    }

  } catch (err) {
    console.error(
      "Save article error:",
      err
    );

    setError(
      err.response?.data?.message ||
      "Unable to save article."
    );
  } finally {
    setSaving(false);
  }
}

  // ==================================================
  // BLOCK LABEL
  // ==================================================

  function getBlockLabel(
    type
  ) {
    switch (type) {
      case "TEXT":
        return "PARAGRAPH";

      case "HEADING":
        return "HEADING";

      case "QUOTE":
        return "QUOTE";

      case "IMAGE":
        return "IMAGE";

      case "VIDEO":
        return "VIDEO";

      case "AUDIO":
        return "AUDIO";

      default:
        return type;
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loadingArticle) {
    return (
      <main className="impilo-editorial-workspace">

        <section className="impilo-empty-editorial">

          <h2>
            Loading article...
          </h2>

          <p>
            Retrieving the draft
            from the editorial system.
          </p>

        </section>

      </main>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="impilo-editorial-workspace">

      {/* HEADER */}

      <header className="impilo-editorial-header">

        <div>

          <span className="impilo-editorial-kicker">
            IMPILO EDITORIAL CMS
          </span>

          <h1>
            {isEditing
              ? "Edit Article"
              : "New Article"}
          </h1>

          <p>
            Build and arrange the
            visual story before
            sending it for editorial
            review.
          </p>

        </div>

        <div className="impilo-editorial-actions">

          <div className="impilo-word-count">
            {wordCount} / 700 words
          </div>

          <button
            type="button"
            onClick={
              saveDraft
            }
            disabled={saving}
            className="impilo-save-draft"
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Save Draft"}
          </button>

        </div>

      </header>

      {/* STATUS */}

      {message && (
        <div className="impilo-editorial-success">
          {message}
        </div>
      )}

      {error && (
        <div className="impilo-editorial-error">
          {error}
        </div>
      )}

      {/* ARTICLE DETAILS */}

      <section className="impilo-article-details">

        <div className="impilo-form-field">

          <label>
            Article Title
          </label>

          <input
            type="text"
            value={title}
            onChange={
              handleTitleChange
            }
            placeholder="Enter article title"
          />

        </div>

        <div className="impilo-form-field">

          <label>
            Slug
          </label>

          <input
            type="text"
            value={slug}
            onChange={(event) =>
              setSlug(
                event.target.value
              )
            }
            placeholder="article-slug"
          />

        </div>

        <div className="impilo-form-field impilo-form-full">

          <label>
            Excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(event) =>
              setExcerpt(
                event.target.value
              )
            }
            placeholder="Short description of the article"
            rows={3}
          />

        </div>

      </section>

      {/* BUILDER */}

      <section className="impilo-builder">

        {/* TOOLS */}

        <aside className="impilo-builder-tools">

          <h2>
            Add Content
          </h2>

          <button
            type="button"
            onClick={() =>
              addBlock("TEXT")
            }
            disabled={isEditing}
          >
            ＋ Paragraph
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("HEADING")
            }
            disabled={isEditing}
          >
            ＋ Heading
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("QUOTE")
            }
            disabled={isEditing}
          >
            ＋ Quote
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("IMAGE")
            }
            disabled={isEditing}
          >
            ＋ Image
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("VIDEO")
            }
            disabled={isEditing}
          >
            ＋ Video
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("AUDIO")
            }
            disabled={isEditing}
          >
            ＋ Audio
          </button>

          <div className="impilo-tool-divider" />

          <h2>
            Layout Templates
          </h2>

        <div className="impilo-template-list">

  <button
    type="button"
    onClick={() =>
      insertTemplate(
        "textImageText"
      )
    }
  >
    <strong>
      Text → Image → Text
    </strong>

    <span>
      A visual story with an image
      between two paragraphs.
    </span>
  </button>


  <button
    type="button"
    onClick={() =>
      insertTemplate(
        "imageTextText"
      )
    }
  >
    <strong>
      Image → Text × 2
    </strong>

    <span>
      Lead with the visual, then
      continue the story.
    </span>
  </button>


  <button
    type="button"
    onClick={() =>
      insertTemplate(
        "textVideoText"
      )
    }
  >
    <strong>
      Text → Video → Text
    </strong>

    <span>
      Introduce the story, show the
      video, then continue.
    </span>
  </button>

</div>

        </aside>

        {/* CANVAS */}

        <section className="impilo-editorial-canvas">

          <div className="impilo-canvas-top">

            <div>

              <span>
                ARTICLE CANVAS
              </span>

              <h2>
                {title ||
                  "Untitled Article"}
              </h2>

            </div>

            <span>
              {blocks.length} blocks
            </span>

          </div>

          {blocks.length === 0 ? (

            <div className="impilo-empty-editorial">

              <div className="impilo-empty-icon">
                ✦
              </div>

              <h2>
                Start your story
              </h2>

              <p>
                Add content from
                the panel on the left.
              </p>

            </div>

          ) : (

            <div className="impilo-block-stack">

              {blocks.map(
                (
                  block,
                  index
                ) => {

                  const dragging =
                    draggedIndex ===
                    index;

                  const dropTarget =
                    dragOverIndex ===
                    index;

                  return (
                    <article
                      key={
                        block.clientId ||
                        block.id
                      }
                      draggable={
                        !isEditing
                      }
                      onDragStart={
                        !isEditing
                          ? (event) =>
                              handleDragStart(
                                index,
                                event
                              )
                          : undefined
                      }
                      onDragOver={
                        !isEditing
                          ? (event) =>
                              handleDragOver(
                                index,
                                event
                              )
                          : undefined
                      }
                      onDrop={
                        !isEditing
                          ? (event) =>
                              handleDrop(
                                index,
                                event
                              )
                          : undefined
                      }
                      onDragEnd={
                        !isEditing
                          ? handleDragEnd
                          : undefined
                      }
                      className={[
                        "impilo-content-block",
                        dragging
                          ? "is-dragging"
                          : "",
                        dropTarget
                          ? "is-drop-target"
                          : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >

                      <div className="impilo-block-number">
                        {index + 1}
                      </div>

                      <div className="impilo-drag-handle">
                        ⋮⋮
                      </div>

                      <div className="impilo-block-content">

                        <div className="impilo-block-header">

                          <strong>
                            {getBlockLabel(
                              block.type
                            )}
                          </strong>

                          {!isEditing && (
                            <div>

                              <button
                                type="button"
                                onClick={() =>
                                  moveBlock(
                                    index,
                                    -1
                                  )
                                }
                                disabled={
                                  index === 0
                                }
                              >
                                ↑
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  moveBlock(
                                    index,
                                    1
                                  )
                                }
                                disabled={
                                  index ===
                                  blocks.length -
                                    1
                                }
                              >
                                ↓
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteBlock(
                                    index
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>
                          )}

                        </div>

                        {(block.type ===
                          "TEXT" ||
                          block.type ===
                            "HEADING" ||
                          block.type ===
                            "QUOTE") && (

                          <textarea
                            value={
                              block.content
                                ?.text ||
                              ""
                            }
                            onChange={(event) =>
                              updateText(
                                index,
                                event.target
                                  .value
                              )
                            }
                            readOnly={
                              isEditing
                            }
                            placeholder={
                              block.type ===
                              "HEADING"
                                ? "Enter heading..."
                                : "Write your content..."
                            }
                            rows={
                              block.type ===
                              "HEADING"
                                ? 2
                                : 7
                            }
                            className="impilo-block-textarea"
                          />

                        )}
{(block.type ===
  "IMAGE" ||
  block.type ===
    "VIDEO" ||
  block.type ===
    "AUDIO") && (

  <div className="impilo-media-block">

    {/* ==============================================
        SELECTED MEDIA
    ============================================== */}

    {block.media ? (

      <div className="impilo-selected-media">

        {block.type === "IMAGE" && (
          <img
            src={block.media.url}
            alt={
              block.media.altText ||
              block.media.caption ||
              "Selected IMPILO media"
            }
            className="impilo-selected-media-image"
          />
        )}

        {block.type === "VIDEO" && (
          <video
            src={block.media.url}
            controls
            className="impilo-selected-media-video"
          />
        )}

        {block.type === "AUDIO" && (
          <audio
            src={block.media.url}
            controls
            className="impilo-selected-media-audio"
          />
        )}

        <div className="impilo-selected-media-info">

          <strong>
            {block.media.caption ||
              block.media.filename ||
              "Selected media"}
          </strong>

          <small>
            {block.media.provider}
          </small>

        </div>

      </div>

    ) : (

      /* ==============================================
         EMPTY MEDIA BLOCK
      ============================================== */

      <div className="impilo-media-placeholder">

        <strong>
          {getBlockLabel(
            block.type
          )}
        </strong>

        <p>
          No media selected.
        </p>

      </div>

    )}


    {/* ==============================================
        MEDIA PICKER BUTTON
    ============================================== */}

    <button
      type="button"
      className="impilo-select-media-button"
      onClick={() =>
        setMediaPickerIndex(index)
      }
    >
      {block.media
        ? "Change Media"
        : `Select ${getBlockLabel(
            block.type
          )}`}
    </button>


    {/* ==============================================
        MEDIA ID — TEMPORARILY VISIBLE FOR DEBUGGING
    ============================================== */}

    {block.mediaId && (
      <small className="impilo-media-id">
        Media ID: {block.mediaId}
      </small>
    )}


    {/* ==============================================
        MEDIA PICKER
    ============================================== */}

    {mediaPickerIndex === index && (

      <div className="impilo-media-picker-container">

        <MediaPicker
          type={block.type}
          selectedMediaId={
            block.mediaId || null
          }

          onSelect={(media) =>
            handleMediaSelected(
              index,
              media
            )
          }

          onClose={() =>
            setMediaPickerIndex(null)
          }
        />

      </div>

    )}

  </div>
)}

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </section>

    </main>
  );
}