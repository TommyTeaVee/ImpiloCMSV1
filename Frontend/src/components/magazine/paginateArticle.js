/**
 * Paginates article blocks without flattening or mutating them. Tiptap JSON,
 * legacy content.text, editorialLayout metadata and media references all stay
 * on the original block object.
 */
export default function paginateArticle(blocks = [], options = {}) {
  if (!Array.isArray(blocks) || blocks.length === 0) return [];

  const targetWords = Math.max(100, Number(options.targetWords) || 350);
  const maxWords = Math.max(targetWords, Number(options.maxWords) || 450);
  const typeOf = (block) => String(block?.type || "TEXT").toUpperCase();
  const isText = (block) => ["TEXT", "PARAGRAPH"].includes(typeOf(block));
  const isHeading = (block) => ["HEADING", "SUBHEADING", "TITLE"].includes(typeOf(block));
  const isVisual = (block) => ["IMAGE", "VIDEO", "AUDIO", "GALLERY"].includes(typeOf(block));

  function richTextPlainText(node) {
    if (!node) return "";
    if (node.type === "text") return node.text || "";
    if (node.type === "hardBreak") return " ";
    return (node.content || []).map(richTextPlainText).join(" ");
  }

  function getText(block) {
    const content = block?.content;
    if (typeof content === "string") return content;
    if (content?.richText?.type === "doc") return richTextPlainText(content.richText);
    if (typeof content?.text === "string") return content.text;
    return "";
  }

  function wordCount(block) {
    const text = getText(block).trim();
    return text ? text.split(/\s+/).filter(Boolean).length : 0;
  }

  // Keep headings with the next meaningful block; keep media blocks atomic
  // and pair them with at most one following paragraph when possible.
  const units = [];
  let index = 0;
  while (index < blocks.length) {
    const unit = [blocks[index]];
    const first = blocks[index];
    index += 1;

    if (isHeading(first)) {
      while (index < blocks.length && !getText(blocks[index]).trim() && !isVisual(blocks[index])) {
        unit.push(blocks[index]);
        index += 1;
      }
      if (index < blocks.length && !isHeading(blocks[index])) {
        unit.push(blocks[index]);
        index += 1;
      }
    } else if (isVisual(first)) {
      if (index < blocks.length && isText(blocks[index]) && wordCount(blocks[index]) <= maxWords) {
        unit.push(blocks[index]);
        index += 1;
      }
    }

    units.push({ blocks: unit, words: unit.reduce((sum, block) => sum + wordCount(block), 0), visual: unit.some(isVisual) });
  }

  const pages = [];
  let current = [];
  let currentWords = 0;
  let currentHasVisual = false;

  const flush = () => {
    if (current.length) pages.push(current);
    current = [];
    currentWords = 0;
    currentHasVisual = false;
  };

  for (const unit of units) {
    const startsHeading = isHeading(unit.blocks[0]);
    const shouldBreakBefore = current.length > 0 && (
      (startsHeading && currentWords > 0) ||
      (currentWords + unit.words > maxWords) ||
      (unit.visual && currentHasVisual && currentWords >= targetWords) ||
      (unit.visual && currentWords >= targetWords)
    );

    if (shouldBreakBefore) flush();
    current.push(...unit.blocks);
    currentWords += unit.words;
    currentHasVisual = currentHasVisual || unit.visual;

    // Don't automatically end every page after an image/video. Short visual
    // blocks can otherwise create large blank regions in the fixed-size reader.
    // Let adjacent editorial blocks share the page unless the word target is met.
    if (currentWords >= targetWords) flush();
  }

  flush();
  return pages.length ? pages : [blocks.slice()];
}
