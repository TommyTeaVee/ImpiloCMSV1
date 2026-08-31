import React, { useMemo, useState } from "react";

export default function ArticleFeeder({
  onGenerate,
  onCancel
}) {
  const [text, setText] = useState("");

  const paragraphCount = useMemo(() => {
    return text
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .length;
  }, [text]);

  function handleGenerate() {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    /*
     * Split the article wherever the writer
     * has an empty line.
     *
     * Example:
     *
     * Paragraph one.
     *
     * Paragraph two.
     *
     * Paragraph three.
     */

    const paragraphs = cleanText
      .split(/\n\s*\n/)
      .map((paragraph) =>
        paragraph
          .replace(/\s*\n\s*/g, " ")
          .trim()
      )
      .filter(Boolean);

    const generatedBlocks =
      paragraphs.map((paragraph) => ({
        clientId: crypto.randomUUID(),

        type: "TEXT",

        content: {
          text: paragraph,
          layout: "default"
        },

        mediaId: null,

        media: null
      }));

    if (!generatedBlocks.length) {
      return;
    }

    onGenerate(generatedBlocks);
  }

  return (
    <section className="impilo-article-feeder">

      <div className="impilo-feeder-header">

        <div>

          <span className="impilo-feeder-kicker">
            ARTICLE FEEDER
          </span>

          <h2>
            Paste Your Story
          </h2>

          <p>
            Paste your raw article below.
            IMPILO will automatically turn
            each paragraph into an editorial
            content block.
          </p>

        </div>

        <div className="impilo-feeder-count">
          {paragraphCount}{" "}
          {paragraphCount === 1
            ? "paragraph"
            : "paragraphs"}
        </div>

      </div>


      <div className="impilo-feeder-editor">

        <textarea
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          placeholder={`Paste your complete article here...

Each paragraph should be separated by a blank line.

Example:

The future of digital publishing is changing rapidly.

Readers no longer consume stories in a single format.

IMPILO is building an editorial platform where articles, photography, video and audio can exist together.`}
          rows={20}
        />

      </div>


      <div className="impilo-feeder-footer">

        <div className="impilo-feeder-help">

          <strong>
            How it works
          </strong>

          <span>
            Paste → Generate → Edit visually
          </span>

        </div>


        <div className="impilo-feeder-actions">

          {onCancel && (
            <button
              type="button"
              className="impilo-feeder-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            className="impilo-feeder-generate"
            onClick={handleGenerate}
            disabled={!text.trim()}
          >
            Generate Article
          </button>

        </div>

      </div>

    </section>
  );
}