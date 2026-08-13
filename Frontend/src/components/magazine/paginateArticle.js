// src/components/magazine/paginateArticle.js

export default function paginateArticle(blocks = []) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [];
  }

  // ==========================================================
  // HELPERS
  // ==========================================================

  const typeOf = (block) =>
    String(block?.type || "TEXT").toUpperCase();

  const isText = (block) => {
    const type = typeOf(block);

    return (
      type === "TEXT" ||
      type === "PARAGRAPH"
    );
  };

  const isHeading = (block) => {
    const type = typeOf(block);

    return (
      type === "HEADING" ||
      type === "SUBHEADING" ||
      type === "TITLE"
    );
  };

  const isVisual = (block) => {
    const type = typeOf(block);

    return (
      type === "IMAGE" ||
      type === "VIDEO" ||
      type === "GALLERY"
    );
  };

  const getText = (block) => {
    const content = block?.content;

    if (!content) {
      return "";
    }

    if (typeof content === "string") {
      return content;
    }

    if (
      typeof content === "object" &&
      typeof content.text === "string"
    ) {
      return content.text;
    }

    return "";
  };

  const words = (block) => {
    const text = getText(block);

    if (!text.trim()) {
      return 0;
    }

    return text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  };

  // ==========================================================
  // PAGE BUILDER
  // ==========================================================

  const pages = [];

  let i = 0;

  while (i < blocks.length) {
    const page = [];

    // --------------------------------------------------------
    // RULE 1
    //
    // A heading starts a new editorial section.
    // --------------------------------------------------------

    if (isHeading(blocks[i])) {
      page.push(blocks[i]);
      i++;
    }

    // --------------------------------------------------------
    // RULE 2
    //
    // Put ONLY ONE paragraph before looking for a visual.
    //
    // This is the major change.
    // We don't want 3 pages of text before an image/video.
    // --------------------------------------------------------

    if (
      i < blocks.length &&
      isText(blocks[i])
    ) {
      page.push(blocks[i]);
      i++;
    }

    // --------------------------------------------------------
    // RULE 3
    //
    // If a visual is next, PUT IT ON THIS PAGE.
    // --------------------------------------------------------

    if (
      i < blocks.length &&
      isVisual(blocks[i])
    ) {
      page.push(blocks[i]);
      i++;

      // ------------------------------------------------------
      // RULE 4
      //
      // Give the visual 1–2 paragraphs afterwards.
      // ------------------------------------------------------

      let afterVisual = 0;

      while (
        i < blocks.length &&
        isText(blocks[i]) &&
        afterVisual < 2
      ) {
        page.push(blocks[i]);

        i++;
        afterVisual++;
      }

      pages.push(page);

      continue;
    }

    // --------------------------------------------------------
    // RULE 5
    //
    // If there wasn't a visual immediately after the first
    // paragraph, allow ONE additional paragraph.
    // --------------------------------------------------------

    if (
      i < blocks.length &&
      isText(blocks[i])
    ) {
      page.push(blocks[i]);
      i++;
    }

    // --------------------------------------------------------
    // RULE 6
    //
    // If a visual appears now, use it immediately.
    // --------------------------------------------------------

    if (
      i < blocks.length &&
      isVisual(blocks[i])
    ) {
      page.push(blocks[i]);
      i++;

      let afterVisual = 0;

      while (
        i < blocks.length &&
        isText(blocks[i]) &&
        afterVisual < 2
      ) {
        page.push(blocks[i]);

        i++;
        afterVisual++;
      }

      pages.push(page);

      continue;
    }

    // --------------------------------------------------------
    // RULE 7
    //
    // No visual nearby.
    //
    // We can safely add more text, but DON'T create huge
    // text walls.
    // --------------------------------------------------------

    let pageWords = page.reduce(
      (total, block) =>
        total + words(block),
      0
    );

    while (
      i < blocks.length &&
      isText(blocks[i]) &&
      pageWords < 300
    ) {
      const blockWords = words(blocks[i]);

      if (
        pageWords > 0 &&
        pageWords + blockWords > 350
      ) {
        break;
      }

      page.push(blocks[i]);

      pageWords += blockWords;

      i++;
    }

    // --------------------------------------------------------
    // RULE 8
    //
    // If a visual is now directly ahead, include it.
    // --------------------------------------------------------

    if (
      i < blocks.length &&
      isVisual(blocks[i])
    ) {
      page.push(blocks[i]);
      i++;

      let afterVisual = 0;

      while (
        i < blocks.length &&
        isText(blocks[i]) &&
        afterVisual < 2
      ) {
        page.push(blocks[i]);

        i++;
        afterVisual++;
      }
    }

    // --------------------------------------------------------
    // SAFETY
    //
    // Never allow the loop to get stuck.
    // --------------------------------------------------------

    if (page.length === 0 && i < blocks.length) {
      page.push(blocks[i]);
      i++;
    }

    pages.push(page);
  }

  return pages;
}