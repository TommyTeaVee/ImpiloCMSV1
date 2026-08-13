import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ArticleBlockCanvas({
  articleId
}) {
  const [article, setArticle] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // ==================================================
  // LOAD ARTICLE
  // ==================================================

  useEffect(() => {
    if (!articleId) {
      return;
    }

    let mounted = true;

    async function loadArticle() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/articles/${articleId}`
        );

        if (!mounted) {
          return;
        }

        const loadedArticle =
          response.data.article;

        const loadedBlocks =
          Array.isArray(
            loadedArticle?.blocks
          )
            ? [...loadedArticle.blocks].sort(
                (a, b) =>
                  (a.position ?? 0) -
                  (b.position ?? 0)
              )
            : [];

        setArticle(loadedArticle);
        setBlocks(loadedBlocks);
      } catch (err) {
        console.error(
          "Failed to load article:",
          err
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load article"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      mounted = false;
    };
  }, [articleId]);

  // ==================================================
  // DRAG START
  // ==================================================

  function handleDragStart(index, event) {
    setDraggedIndex(index);
    setDragOverIndex(null);

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

  function handleDragOver(index, event) {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setDragOverIndex(index);
  }

  // ==================================================
  // DROP
  // ==================================================

  function handleDrop(index, event) {
    event.preventDefault();

    const fromIndex = draggedIndex;

    if (
      fromIndex === null ||
      fromIndex === index
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setBlocks((current) => {
      const next = [...current];

      const [movedBlock] =
        next.splice(
          fromIndex,
          1
        );

      next.splice(
        index,
        0,
        movedBlock
      );

      return next;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
    setMessage("");
  }

  // ==================================================
  // DRAG END
  // ==================================================

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  // ==================================================
  // SAVE ORDER
  // ==================================================

  async function saveOrder() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await api.patch(
          `/blocks/${articleId}/blocks/reorder`,
          {
            blocks: blocks.map(
              (block) => ({
                id: block.id
              })
            )
          }
        );

      if (
        Array.isArray(
          response.data.blocks
        )
      ) {
        setBlocks(
          [...response.data.blocks].sort(
            (a, b) =>
              (a.position ?? 0) -
              (b.position ?? 0)
          )
        );
      }

      setMessage(
        "Magazine layout saved."
      );
    } catch (err) {
      console.error(
        "Failed to save block order:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save magazine layout"
      );
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // BLOCK TEXT
  // ==================================================

  function getText(block) {
    const content =
      block?.content;

    if (
      typeof content === "string"
    ) {
      return content;
    }

    if (
      content &&
      typeof content === "object" &&
      typeof content.text === "string"
    ) {
      return content.text;
    }

    return "";
  }

  // ==================================================
  // BLOCK LABEL
  // ==================================================

  function getLabel(block) {
    const type =
      String(
        block?.type || "TEXT"
      ).toUpperCase();

    switch (type) {
      case "IMAGE":
        return "IMAGE";

      case "VIDEO":
        return "VIDEO";

      case "AUDIO":
        return "AUDIO";

      case "HEADING":
        return "HEADING";

      case "SUBHEADING":
        return "SUBHEADING";

      case "QUOTE":
        return "QUOTE";

      default:
        return "PARAGRAPH";
    }
  }

  // ==================================================
  // MEDIA PREVIEW
  // ==================================================

  function renderMedia(block) {
    const media =
      block?.media;

    if (!media) {
      return null;
    }

    const type =
      String(
        block.type || ""
      ).toUpperCase();

    if (
      type === "IMAGE" &&
      media.url
    ) {
      return (
        <div className="article-canvas-image">
          <img
            src={media.url}
            alt={
              media.altText ||
              media.caption ||
              "Article image"
            }
          />

          {media.caption && (
            <small>
              {media.caption}
            </small>
          )}
        </div>
      );
    }

    if (type === "VIDEO") {
      return (
        <div className="article-canvas-video">
          <span>🎥 VIDEO</span>

          {media.caption && (
            <small>
              {media.caption}
            </small>
          )}
        </div>
      );
    }

    if (type === "AUDIO") {
      return (
        <div className="article-canvas-audio">
          <span>🎧 AUDIO</span>
        </div>
      );
    }

    return null;
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="article-canvas">
        <p>
          Loading article...
        </p>
      </section>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error && !article) {
    return (
      <section className="article-canvas">
        <h2>
          Unable to load article
        </h2>

        <p>{error}</p>
      </section>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section className="article-canvas">

      {/* ============================================
          HEADER
      ============================================ */}

      <header className="article-canvas-header">

        <div>
          <span className="article-canvas-kicker">
            MAGAZINE LAYOUT
          </span>

          <h1>
            {article?.title ||
              "Untitled Article"}
          </h1>

          <p>
            Drag blocks to decide how
            the story flows through
            the magazine.
          </p>
        </div>

        <button
          type="button"
          onClick={saveOrder}
          disabled={saving}
          className="article-canvas-save"
        >
          {saving
            ? "Saving..."
            : "Save Layout"}
        </button>

      </header>

      {/* ============================================
          STATUS
      ============================================ */}

      {message && (
        <div className="article-canvas-message">
          {message}
        </div>
      )}

      {error && (
        <div className="article-canvas-error">
          {error}
        </div>
      )}

      {/* ============================================
          CANVAS
      ============================================ */}

      <div className="article-canvas-list">

        {blocks.map(
          (block, index) => {

            const type =
              getLabel(block);

            const text =
              getText(block);

            const isDragging =
              draggedIndex === index;

            const isDropTarget =
              dragOverIndex === index;

            return (
              <div
                key={block.id}
                draggable
                onDragStart={(event) =>
                  handleDragStart(
                    index,
                    event
                  )
                }
                onDragOver={(event) =>
                  handleDragOver(
                    index,
                    event
                  )
                }
                onDrop={(event) =>
                  handleDrop(
                    index,
                    event
                  )
                }
                onDragEnd={
                  handleDragEnd
                }
                className={[
                  "article-canvas-block",
                  isDragging
                    ? "is-dragging"
                    : "",
                  isDropTarget
                    ? "is-drop-target"
                    : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
              >

                {/* DRAG HANDLE */}

                <div className="article-canvas-handle">
                  ⋮⋮
                </div>

                {/* NUMBER */}

                <div className="article-canvas-number">
                  {index + 1}
                </div>

                {/* BLOCK */}

                <div className="article-canvas-content">

                  <div className="article-canvas-type">
                    {type}
                  </div>

                  {renderMedia(
                    block
                  )}

                  {text && (
                    <div className="article-canvas-text">
                      {text}
                    </div>
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
}