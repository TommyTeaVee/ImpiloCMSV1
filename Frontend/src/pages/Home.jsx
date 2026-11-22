import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MagazineReader from "../components/magazine/MagazineReader";
import api from "../services/api";
import { useInitialData } from "../initialData";

const listFrom = (data) =>
  Array.isArray(data) ? data : data?.articles ?? [];

const shorten = (text = "", max = 160) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

/**
 * ==================================================
 * HOME PAGE VIEW
 * ==================================================
 *
 * The interactive magazine reader (issue "impilo-101") stays
 * the main experience. Below it, a server-rendered list of
 * published articles gives readers and search engines real
 * links to every article page.
 */
export default function Home() {
  // Filled by the page server; falls back to a fetch in dev mode
  const initial = useInitialData("articles");
  const [articles, setArticles] = useState(initial ?? []);

  useEffect(() => {
    if (initial) return;

    api
      .get("/articles")
      .then((response) => setArticles(listFrom(response.data)))
      .catch(() => {});
  }, [initial]);

  return (
    <main className="impilo-home-container">
      {/* ==========================================
          MAGAZINE READER EMBED
      ========================================== */}

      <div className="impilo-magazine-book-wrapper">
        <MagazineReader slug="impilo-101" />
      </div>

      {/* ==========================================
          LATEST ARTICLES (server-rendered, crawlable)
      ========================================== */}

      {articles.length > 0 && (
        <section
          className="uk-container uk-margin-large-top uk-margin-large-bottom"
          aria-labelledby="impilo-latest-heading"
        >
          <h2 id="impilo-latest-heading">Latest stories</h2>

          {articles.map((article) => (
            <article key={article.id ?? article.slug} className="uk-margin-medium-top">
              <h3>
                <Link to={`/articles/${article.slug}`}>{article.title}</Link>
              </h3>

              {article.publishedAt && (
                <p className="uk-text-meta">
                  {new Date(article.publishedAt).toISOString().slice(0, 10)}
                </p>
              )}

              {article.excerpt && <p>{shorten(article.excerpt)}</p>}

              <p>
                <Link to={`/articles/${article.slug}`}>Read the story →</Link>
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}