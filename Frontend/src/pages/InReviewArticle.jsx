import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function InReviewArticles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadArticles() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/articles/manage");

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.articles)
        ? res.data.articles
        : [];

      const inReview = data.filter(
        (article) =>
          String(article.status || "").toUpperCase() === "IN_REVIEW"
      );

      setArticles(inReview);
    } catch (err) {
      console.error("Failed to load in-review articles:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load articles awaiting review."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function openArticle(article) {
    if (!article?.id) return;

    navigate(`/editorial/new?articleId=${article.id}`);
  }

  async function approveArticle(article) {
    if (!article?.id) return;

    try {
      setActionLoading(`${article.id}-approve`);
      setError("");
      setMessage("");

      const response = await api.post(
        `/articles/${article.id}/approve`
      );

      setMessage(
        response.data?.message ||
          `"${article.title}" has been approved.`
      );

      await loadArticles();
    } catch (err) {
      console.error("Failed to approve article:", err);

      setError(
        err.response?.data?.message ||
          "Failed to approve article."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function returnToDraft(article) {
    if (!article?.id) return;

    /*
     * There is currently no dedicated backend "return to draft"
     * endpoint in the workflow you supplied.
     *
     * Keep this action disabled until that endpoint exists rather
     * than inventing an API route.
     */
    setError(
      "Returning an article to draft is not currently available in the editorial workflow."
    );
  }

  function getAuthorName(article) {
    if (article.author?.name) return article.author.name;
    if (article.author?.username) return article.author.username;
    if (article.author?.email) return article.author.email;
    return article.authorName || "Unknown author";
  }

  return (
    <main className="impilo-in-review">
      <header className="impilo-in-review-header">
        <div>
          <span className="impilo-section-label">
            EDITORIAL WORKFLOW
          </span>

          <h1>In Review</h1>

          <p>
            Articles submitted and awaiting editorial approval.
          </p>
        </div>

        <div className="impilo-in-review-header-actions">
          <button
            type="button"
            className="impilo-review-btn impilo-review-btn-secondary"
            onClick={() => navigate("/admin")}
          >
            ← Back
          </button>

          <button
            type="button"
            className="impilo-review-btn impilo-review-btn-secondary"
            onClick={loadArticles}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </header>

      {message && (
        <div className="impilo-review-message impilo-review-message-success">
          {message}
        </div>
      )}

      {error && (
        <div className="impilo-review-message impilo-review-message-error">
          {error}
        </div>
      )}

      {loading && (
        <div className="impilo-review-loading">
          <div className="impilo-review-spinner" />
          <span>Loading articles awaiting review...</span>
        </div>
      )}

      {!loading && articles.length === 0 && (
        <section className="impilo-review-empty">
          <div className="impilo-review-empty-icon">✓</div>

          <h2>No articles awaiting review</h2>

          <p>
            Submitted articles will appear here for editorial
            approval.
          </p>
        </section>
      )}

      {!loading && articles.length > 0 && (
        <section className="impilo-review-list">
          <div className="impilo-review-list-header">
            <div>
              <span>EDITORIAL QUEUE</span>
              <strong>{articles.length}</strong>
            </div>

            <span>
              {articles.length === 1
                ? "article awaiting approval"
                : "articles awaiting approval"}
            </span>
          </div>

          {articles.map((article) => {
            const approveKey = `${article.id}-approve`;

            return (
              <article
                key={article.id}
                className="impilo-review-card"
              >
                <div className="impilo-review-card-main">
                  <div className="impilo-review-card-meta">
                    <span className="impilo-review-status">
                      IN REVIEW
                    </span>

                    <span className="impilo-review-word-count">
                      {article.wordCount || 0} words
                    </span>
                  </div>

                  <h2>{article.title || "Untitled Article"}</h2>

                  {article.excerpt && (
                    <p className="impilo-review-excerpt">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="impilo-review-details">
                    <span>
                      <strong>Author:</strong>{" "}
                      {getAuthorName(article)}
                    </span>

                    {article.updatedAt && (
                      <span>
                        <strong>Updated:</strong>{" "}
                        {new Date(
                          article.updatedAt
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="impilo-review-actions">
                  <button
                    type="button"
                    className="impilo-review-btn impilo-review-btn-secondary"
                    onClick={() => openArticle(article)}
                  >
                    Review
                  </button>

                  <button
                    type="button"
                    className="impilo-review-btn impilo-review-btn-approve"
                    onClick={() => approveArticle(article)}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === approveKey
                      ? "Approving..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    className="impilo-review-btn impilo-review-btn-return"
                    onClick={() => returnToDraft(article)}
                    disabled={actionLoading !== null}
                  >
                    Return to Draft
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}