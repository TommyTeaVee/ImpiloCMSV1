import sanitizeHtml from "sanitize-html";

// Article text may contain HTML. This keeps ordinary formatting and removes anything that can
// run code (script, event handlers, javascript: links, iframes, styles). Works in the browser and
// in the SSR server, so server and client render the same markup.
const OPTIONS = {
  allowedTags: [
    "p", "br", "strong", "b", "em", "i", "u", "s", "blockquote", "ul", "ol", "li",
    "h2", "h3", "h4", "a", "span", "hr", "sup", "sub", "code", "pre", "figure", "figcaption",
  ],
  allowedAttributes: { a: ["href", "title", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  disallowedTagsMode: "discard",
  transformTags: {
    a: (tagName, attribs) => ({
      tagName: "a",
      attribs: { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" },
    }),
  },
};

export function cleanHtml(html) {
  return sanitizeHtml(String(html ?? ""), OPTIONS);
}
