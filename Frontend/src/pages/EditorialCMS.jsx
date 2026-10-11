
import React, {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";
import InReviewArticles from "./InReviewArticle";
import api from "../services/api";

export default function EditorialCMS({
  onOpenInReview
}) {

  const navigate = useNavigate();
  const location = useLocation();

  const [articles, setArticles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

  // ==================================================
  // LOAD ARTICLES
  // ==================================================

  async function loadArticles() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/articles/manage");

      const data =
        response.data;

      if (Array.isArray(data)) {
        setArticles(data);
      } else if (
        Array.isArray(data?.articles)
      ) {
        setArticles(data.articles);
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

  useEffect(() => {
    loadArticles();
  }, []);

  // ==================================================
  // BACK
  // ==================================================

  function goBack() {
    navigate(
      "/admin",
      {
        replace: true
      }
    );
  }

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
      .replace(
        /_/g,
        " "
      )
      .toUpperCase();
  }

  // ==================================================
  // ARTICLE WORKFLOW
  // ==================================================

  async function runArticleAction(
    article,
    action
  ) {

    if (!article?.id) {
      return;
    }

    const actionKey =
      `${article.id}-${action}`;

    try {

      setActionLoading(actionKey);
      setError("");
      setMessage("");

      let endpoint = "";

      switch (action) {

        case "submit":
          endpoint =
            `/articles/${article.id}/submit`;
          break;

        case "approve":
          endpoint =
            `/articles/${article.id}/approve`;
          break;

        case "publish":
          endpoint =
            `/articles/${article.id}/publish`;
          break;

        default:
          return;
      }

      const response =
        await api.post(endpoint);

      setMessage(
        response.data?.message ||
        "Article workflow updated."
      );

      await loadArticles();

    } catch (err) {

      console.error(
        `Article ${action} error:`,
        err
      );

      setError(
        err.response?.data?.message ||
        `Unable to ${action} article.`
      );

    } finally {

      setActionLoading(null);
    }
  }

  // ==================================================
  // WORKFLOW ACTIONS
  // ==================================================

  function renderWorkflowActions(article) {

    const status =
      String(
        article.status || "DRAFT"
      ).toUpperCase();

    const submitKey =
      `${article.id}-submit`;

    const approveKey =
      `${article.id}-approve`;

    const publishKey =
      `${article.id}-publish`;

    if (status === "DRAFT") {

      return (
        <button
          type="button"
          className="impilo-glass-btn"
          onClick={() =>
            runArticleAction(
              article,
              "submit"
            )
          }
          disabled={
            actionLoading !== null
          }
        >
          {actionLoading === submitKey
            ? "Submitting..."
            : "Submit for Review"}
        </button>
      );
    }

    if (status === "IN_REVIEW") {

      return (
        <button
          type="button"
          className="impilo-glass-btn"
          onClick={() =>
            runArticleAction(
              article,
              "approve"
            )
          }
          disabled={
            actionLoading !== null
          }
        >
          {actionLoading === approveKey
            ? "Approving..."
            : "Approve"}
        </button>
      );
    }

    if (status === "APPROVED") {

      return (
        <button
          type="button"
          className="impilo-glass-btn"
          onClick={() =>
            runArticleAction(
              article,
              "publish"
            )
          }
          disabled={
            actionLoading !== null
          }
        >
          {actionLoading === publishKey
            ? "Publishing..."
            : "Publish"}
        </button>
      );
    }

    return null;
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="impilo-editorial-cms">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header
        className="impilo-editorial-cms-header"
      >

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

<div
  className="impilo-editorial-cms-actions"
>
  <button
    type="button"
    className="impilo-editorial-back-button"
    onClick={goBack}
  >
    ← Back
  </button>

  <button
    type="button"
    className="impilo-glass-btn"
    onClick={onOpenInReview}
  >
    In Review
  </button>

  <button
    type="button"
    className="impilo-glass-btn"
    onClick={createNewArticle}
  >
    + New Article
  </button>
</div>

      </header>

      {/* ==========================================
          MESSAGE
      ========================================== */}

      {message && (
        <div
          className="impilo-editorial-message"
          role="status"
        >
          ✓ {message}
        </div>
      )}

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          className="impilo-editorial-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (
        <div
          className="impilo-editorial-loading"
        >
          Loading articles...
        </div>
      )}

      {/* ==========================================
          EMPTY
      ========================================== */}

      {!loading &&
        !error &&
        articles.length === 0 && (

          <section
            className="impilo-editorial-empty"
          >

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
              className="impilo-glass-btn"
              onClick={createNewArticle}
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

          <section
            className="impilo-article-list"
          >

            {/* LIST HEADER */}

            <div
              className="impilo-article-list-header"
            >

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

            {/* ARTICLES */}

            {articles.map(
              (article) => (

                <article
                  key={article.id}
                  className="impilo-article-row"
                >

                  {/* ARTICLE */}

                  <div
                    className="impilo-article-info"
                  >

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
                        {article.author.displayName ||
                          article.author.username}
                      </small>
                    )}

                  </div>

                  {/* STATUS */}

                  <div>

                    <span
                      className={
                        `impilo-article-status ${
                          getStatusClass(
                            article.status
                          )
                        }`
                      }
                    >
                      {getStatusLabel(
                        article.status
                      )}
                    </span>

                  </div>

                  {/* WORD COUNT */}

                  <div>

                    <strong>
                      {article.wordCount ?? 0}
                    </strong>

                    <span>
                      {" "}words
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div
                    className="impilo-article-actions"
                  >

                    <button
                      type="button"
                      className="impilo-glass-btn"
                      onClick={() =>
                        openArticle(
                          article
                        )
                      }
                      disabled={
                        actionLoading !== null
                      }
                    >
                      Open
                    </button>

                    {renderWorkflowActions(
                      article
                    )}

                  </div>

                </article>
              )
            )}

          </section>
        )}

    </main>
  );
}

