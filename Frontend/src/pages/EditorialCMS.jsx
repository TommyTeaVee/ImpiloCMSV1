import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";

export default function EditorialCMS() {
  const navigate = useNavigate();

  const [articles, setArticles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD ARTICLES
  // ==================================================

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/articles/manage"
          );

        /*
         * Be tolerant of the response
         * structure while we connect the CMS.
         */

        const data =
          response.data;

        if (Array.isArray(data)) {
          setArticles(data);
        } else if (
          Array.isArray(data?.articles)
        ) {
          setArticles(
            data.articles
          );
        } else {
          setArticles([]);
        }

      } catch (err) {
        console.error(
          "Load articles error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load articles."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  // ==================================================
  // NEW ARTICLE
  // ==================================================

  function createNewArticle() {
    navigate(
      "/editorial/new"
    );
  }

  // ==================================================
  // OPEN ARTICLE
  // ==================================================

  function openArticle(article) {
    navigate(
      `/editorial/new?articleId=${article.id}`
    );
  }

  // ==================================================
  // STATUS
  // ==================================================

  function getStatusClass(status) {
    switch (
      String(status || "")
        .toUpperCase()
    ) {
      case "PUBLISHED":
        return "published";

      case "APPROVED":
        return "approved";

      case "IN_REVIEW":
        return "review";

      case "DRAFT":
      default:
        return "draft";
    }
  }

  // ==================================================
  // STATUS LABEL
  // ==================================================

  function getStatusLabel(status) {
    if (!status) {
      return "DRAFT";
    }

    return String(status)
      .replace(/_/g, " ")
      .toUpperCase();
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="impilo-editorial-cms">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="impilo-editorial-cms-header">

        <div>

          <span>
            IMPILO EDITORIAL CMS
          </span>

          <h1>
            Articles
          </h1>

          <p>
            Create, edit and manage
            editorial content.
          </p>

        </div>

        <button
          type="button"
          onClick={
            createNewArticle
          }
        >
          + New Article
        </button>

      </header>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="impilo-editorial-error">
          {error}
        </div>
      )}

      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (
        <div className="impilo-editorial-loading">
          Loading articles...
        </div>
      )}

      {/* ==========================================
          EMPTY
      ========================================== */}

      {!loading &&
        !error &&
        articles.length === 0 && (

          <section className="impilo-editorial-empty">

            <div>
              ✦
            </div>

            <h2>
              No articles yet
            </h2>

            <p>
              Start your first IMPILO
              editorial story.
            </p>

            <button
              type="button"
              onClick={
                createNewArticle
              }
            >
              Create First Article
            </button>

          </section>
        )}

      {/* ==========================================
          ARTICLE LIST
      ========================================== */}

      {!loading &&
        articles.length > 0 && (

          <section className="impilo-article-list">

            <div className="impilo-article-list-header">

              <span>
                Article
              </span>

              <span>
                Status
              </span>

              <span>
                Words
              </span>

              <span>
                Action
              </span>

            </div>

            {articles.map(
              (article) => (

                <article
                  key={article.id}
                  className="impilo-article-row"
                >

                  {/* ARTICLE */}

                  <div className="impilo-article-info">

                    <h2>
                      {article.title ||
                        "Untitled Article"}
                    </h2>

                    {article.slug && (
                      <p>
                        /{article.slug}
                      </p>
                    )}

                    {article.author && (
                      <small>
                        By{" "}
                        {article.author
                          .displayName ||
                          article.author
                            .username}
                      </small>
                    )}

                  </div>

                  {/* STATUS */}

                  <div>

                    <span
                      className={`impilo-article-status ${getStatusClass(
                        article.status
                      )}`}
                    >
                      {getStatusLabel(
                        article.status
                      )}
                    </span>

                  </div>

                  {/* WORD COUNT */}

                  <div>

                    <strong>
                      {article.wordCount ??
                        0}
                    </strong>

                    <span>
                      {" "}words
                    </span>

                  </div>

                  {/* ACTION */}

                  <div>

                    <button
                      type="button"
                      onClick={() =>
                        openArticle(
                          article
                        )
                      }
                    >
                      Open
                    </button>

                  </div>

                </article>
              )
            )}

          </section>
        )}

    </main>
  );
}