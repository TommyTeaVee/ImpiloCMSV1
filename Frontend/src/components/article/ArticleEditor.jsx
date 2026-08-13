import React, {
  useEffect,
  useState
} from "react";

import api from "../../services/api";

export default function ArticleEditor({
  articleId
}) {
  const [article, setArticle] =
    useState(null);

  const [blocks, setBlocks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [message, setMessage] =
    useState("");

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
        setError(null);

        const response =
          await api.get(
            `/articles/${articleId}`
          );

        if (!mounted) {
          return;
        }

        const loadedArticle =
          response.data.article;

        setArticle(
          loadedArticle
        );

        const loadedBlocks =
          Array.isArray(
            loadedArticle.blocks
          )
            ? [
                ...loadedArticle.blocks
              ].sort(
                (a, b) =>
                  (a.position ?? 0) -
                  (b.position ?? 0)
              )
            : [];

        setBlocks(
          loadedBlocks
        );

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
  // MOVE BLOCK
  // ==================================================

  function moveBlock(index, direction) {
    setBlocks((current) => {
      const next = [
        ...current
      ];

      const newIndex =
        index + direction;

      if (
        newIndex < 0 ||
        newIndex >= next.length
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
    });

    setMessage("");
  }

  // ==================================================
  // DELETE BLOCK
  // ==================================================

  function removeBlock(index) {
    const block =
      blocks[index];

    if (!block) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this block?"
      );

    if (!confirmed) {
      return;
    }

    setBlocks((current) =>
      current.filter(
        (_, i) =>
          i !== index
      )
    );

    setMessage("");
  }

  // ==================================================
  // SAVE ORDER
  // ==================================================

  async function saveOrder() {
    if (!articleId) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setMessage("");

      /*
       * For now we use the reorder
       * endpoint we created.
       *
       * The server will assign:
       *
       * array index → position
       */

      const response =
        await api.patch(
          `/blocks/${articleId}/blocks/reorder`,
          {
            blocks:
              blocks.map(
                (block) => ({
                  id: block.id
                })
              )
          }
        );

      const savedBlocks =
        Array.isArray(
          response.data.blocks
        )
          ? [
              ...response.data.blocks
            ].sort(
              (a, b) =>
                (a.position ?? 0) -
                (b.position ?? 0)
            )
          : blocks;

      setBlocks(
        savedBlocks
      );

      setMessage(
        "Block order saved."
      );

    } catch (err) {
      console.error(
        "Failed to save block order:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save block order"
      );
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // BLOCK LABEL
  // ==================================================

  function getBlockLabel(block) {
    const type =
      String(
        block?.type || "TEXT"
      ).toUpperCase();

    if (type === "IMAGE") {
      return "IMAGE";
    }

    if (type === "VIDEO") {
      return "VIDEO";
    }

    if (type === "AUDIO") {
      return "AUDIO";
    }

    if (type === "HEADING") {
      return "HEADING";
    }

    if (type === "SUBHEADING") {
      return "SUBHEADING";
    }

    return "PARAGRAPH";
  }

  // ==================================================
  // BLOCK PREVIEW
  // ==================================================

  function getBlockPreview(block) {
    const content =
      block?.content;

    if (
      typeof content ===
      "string"
    ) {
      return content;
    }

    if (
      content &&
      typeof content ===
        "object" &&
      typeof content.text ===
        "string"
    ) {
      return content.text;
    }

    if (
      block?.media?.caption
    ) {
      return block.media.caption;
    }

    if (
      block?.media?.filename
    ) {
      return block.media.filename;
    }

    return "";
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="article-editor-loading">
        Loading article...
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error && !article) {
    return (
      <div className="article-editor-error">
        <h2>
          Unable to load article
        </h2>

        <p>{error}</p>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section className="article-editor">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="article-editor-header">

        <div>
          <h1>
            {article?.title ||
              "Article Editor"}
          </h1>

          <p>
            Arrange the article blocks
            in the order they should
            appear in the magazine.
          </p>
        </div>

        <button
          type="button"
          onClick={saveOrder}
          disabled={saving}
          className="article-editor-save"
        >
          {saving
            ? "Saving..."
            : "Save Order"}
        </button>

      </header>

      {/* ==========================================
          STATUS
      ========================================== */}

      {message && (
        <div className="article-editor-success">
          {message}
        </div>
      )}

      {error && (
        <div className="article-editor-error">
          {error}
        </div>
      )}

      {/* ==========================================
          BLOCK COUNT
      ========================================== */}

      <div className="article-editor-summary">
        <strong>
          {blocks.length}
        </strong>{" "}
        blocks
      </div>

      {/* ==========================================
          BLOCK LIST
      ========================================== */}

      <div className="article-editor-blocks">

        {blocks.length === 0 ? (
          <div className="article-editor-empty">
            This article has no blocks yet.
          </div>
        ) : (
          blocks.map(
            (block, index) => {

              const type =
                getBlockLabel(
                  block
                );

              const preview =
                getBlockPreview(
                  block
                );

              return (
                <article
                  key={block.id}
                  className="article-editor-block"
                >

                  {/* NUMBER */}

                  <div className="article-editor-number">
                    {index + 1}
                  </div>

                  {/* CONTENT */}

                  <div className="article-editor-block-content">

                    <div className="article-editor-block-type">
                      {type}
                    </div>

                    {preview && (
                      <div className="article-editor-block-preview">
                        {preview}
                      </div>
                    )}

                    {block.media?.url && (
                      <div className="article-editor-media-preview">

                        {block.type ===
                        "IMAGE" ? (
                          <img
                            src={
                              block.media.url
                            }
                            alt={
                              block.media
                                .altText ||
                              "Article media"
                            }
                          />
                        ) : (
                          <span>
                            Media attached
                          </span>
                        )}

                      </div>
                    )}

                  </div>

                  {/* CONTROLS */}

                  <div className="article-editor-block-controls">

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
                      title="Move up"
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
                        blocks.length - 1
                      }
                      title="Move down"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeBlock(
                          index
                        )
                      }
                      title="Remove block"
                    >
                      ×
                    </button>

                  </div>

                </article>
              );
            }
          )
        )}

      </div>

    </section>
  );
}