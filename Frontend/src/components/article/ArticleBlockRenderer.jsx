import React from "react";

function getTextContent(content) {
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
}

export default function ArticleBlockRenderer({
  block
}) {
  if (!block) {
    return null;
  }

  const content = block.content || {};
  const type = String(
    block.type || "TEXT"
  ).toUpperCase();

  switch (type) {

    case "TEXT": {
      const text =
        getTextContent(content);

      if (!text) {
        return null;
      }

      return (
        <div className="impilo-article-block impilo-block-text">
          <p>{text}</p>
        </div>
      );
    }

    case "HEADING": {
      const text =
        getTextContent(content);

      if (!text) {
        return null;
      }

      return (
        <div className="impilo-article-block impilo-block-heading">
          <h2>{text}</h2>
        </div>
      );
    }

    case "SUBHEADING": {
      const text =
        getTextContent(content);

      if (!text) {
        return null;
      }

      return (
        <div className="impilo-article-block impilo-block-subheading">
          <h3>{text}</h3>
        </div>
      );
    }

    default:
      return (
        <div
          className="impilo-article-block"
          data-block-type={type}
        >
          {getTextContent(content)}
        </div>
      );
  }
}