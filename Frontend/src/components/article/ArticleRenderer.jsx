import React from "react";
import ArticleBlockRenderer from "./ArticleBlockRenderer";

export default function ArticleRenderer({
  article
}) {
  if (!article) {
    return (
      <article className="uk-article impilo-article">
        <p>Article content unavailable.</p>
      </article>
    );
  }

  const blocks = Array.isArray(article.blocks)
    ? [...article.blocks].sort(
        (a, b) =>
          (a.position ?? 0) -
          (b.position ?? 0)
      )
    : [];

  return (
    <article
      className="uk-article impilo-article"
      data-article-id={article.id}
    >
      <header className="impilo-article-header">

        <h1 className="uk-article-title">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="uk-text-lead">
            {article.subtitle}
          </p>
        )}

        {article.author && (
          <div className="impilo-article-author">
            {article.author.displayName ||
              article.author.username}
          </div>
        )}

      </header>

      <div className="impilo-article-body">

        {blocks.map((block) => (
          <ArticleBlockRenderer
            key={block.id}
            block={block}
          />
        ))}

      </div>
    </article>
  );
}