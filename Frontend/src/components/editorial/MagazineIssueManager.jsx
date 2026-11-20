import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { mockGames } from "../../data/mockGames.js";
import {
  DEFAULT_EDITORIAL_THEME,
  EDITORIAL_THEMES,
} from "../editorial/editorialThemeConfig.js";

const API_PREFIX = "/magazine-admin/issues";

const PAGE_TYPES = [
  "COVER",
  "HIGHLIGHTS",
  "CONTENTS",
  "ABOUT",
  "ARTICLE",
  "GAME",
  "AD",
  "STATIC",
  "PRIVACY",
  "CONTACT",
];

function getPageLabel(type) {
  return String(type || "STATIC").replace(/_/g, " ").toUpperCase();
}

function getPagePreview(page) {
  if (page?.article?.title) return page.article.title;
  if (page?.title) return page.title;
  if (page?.content?.title) return page.content.title;
  if (typeof page?.content === "string") return page.content;
  return "Untitled page";
}

function getArticleId(page) {
  return page?.articleId || page?.article?.id || "";
}

function getContentObject(page) {
  const value = page?.content;

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};
    } catch {
      return {};
    }
  }

  return {};
}

function isAllowedGameUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname))
    );
  } catch {
    return false;
  }
}

function normalisePages(pages) {
  if (!Array.isArray(pages)) return [];

  return [...pages]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((page, index) => ({ ...page, position: index + 1 }));
}

const EMPTY_PAGE = {
  type: "STATIC",
  title: "",
  slug: "",
  articleId: "",
  content: "",
};

const EMPTY_GAME_FIELDS = {
  gameId: "",
  gameUrl: "",
  gameTheme: DEFAULT_EDITORIAL_THEME,
};

export default function MagazineIssueManager({ issue, onBack, onUpdated }) {
  const navigate = useNavigate();

  const [fullIssue, setFullIssue] = useState(issue || null);
  const [pages, setPages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingPage, setEditingPage] = useState(null);
  const [showPageForm, setShowPageForm] = useState(false);
  const [pageForm, setPageForm] = useState({
    ...EMPTY_PAGE,
    ...EMPTY_GAME_FIELDS,
  });

  const issueId = issue?.id;

  async function loadIssue() {
    if (!issueId) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`${API_PREFIX}/${issueId}`);
      const loaded = response.data?.issue || response.data;

      if (!loaded) {
        throw new Error("Magazine issue was not returned.");
      }

      setFullIssue(loaded);
      setPages(normalisePages(loaded.pages));
    } catch (err) {
      console.error("Load magazine issue manager error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load magazine issue."
      );
    } finally {
      setLoading(false);
    }
  }

  function extractArticles(data) {
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.articles)
        ? data.articles
        : [];
  }

  async function loadArticles() {
    try {
      setArticlesLoading(true);

      let loaded = [];

      try {
        // Editorial route: includes drafts and articles in review
        const response = await api.get("/articles/manage");
        loaded = extractArticles(response.data);
      } catch (manageErr) {
        console.warn(
          "Could not load /articles/manage, falling back to published articles:",
          manageErr
        );
        const response = await api.get("/articles");
        loaded = extractArticles(response.data);
      }

      setArticles(loaded);
    } catch (err) {
      console.error("Load article picker error:", err);
      setArticles([]);
    } finally {
      setArticlesLoading(false);
    }
  }

  useEffect(() => {
    loadIssue();
    loadArticles();
  }, [issueId]);

  const articleMap = useMemo(() => {
    const map = new Map();

    articles.forEach((article) => {
      if (article?.id) {
        map.set(article.id, article);
      }
    });

    return map;
  }, [articles]);

  function openAddPage() {
    setMessage("");
    setError("");
    setEditingPage(null);
    setPageForm({ ...EMPTY_PAGE, ...EMPTY_GAME_FIELDS });
    setShowPageForm(true);
  }

  function openEditPage(page) {
    if (!page) return;

    setMessage("");
    setError("");
    setEditingPage(page);

    let content = "";

    if (typeof page.content === "string") {
      content = page.content;
    } else if (page.content && typeof page.content === "object") {
      try {
        content = JSON.stringify(page.content, null, 2);
      } catch {
        content = "";
      }
    }

    const contentObject = getContentObject(page);
    const gameConfig = page?.game || contentObject.game || {};
    const existingGameId = gameConfig.gameId || contentObject.gameId || "";
    const catalogueGame = mockGames.find(
      (game) => game.gameId === existingGameId
    );

    setPageForm({
      ...EMPTY_PAGE,
      ...EMPTY_GAME_FIELDS,
      type: page.type || "STATIC",
      title: page.title || "",
      slug: page.slug || "",
      articleId: getArticleId(page),
      gameId: existingGameId,
      gameUrl:
        gameConfig.url || contentObject.gameUrl || catalogueGame?.url || "",
      gameTheme: gameConfig.theme || DEFAULT_EDITORIAL_THEME,
      content,
    });

    setShowPageForm(true);
  }

  function closePageForm() {
    if (saving) return;

    setShowPageForm(false);
    setEditingPage(null);
    setError("");
    setPageForm({ ...EMPTY_PAGE, ...EMPTY_GAME_FIELDS });
  }

  function handlePageFormChange(event) {
    const { name, value } = event.target;

    if (name === "gameId") {
      const selectedGame = mockGames.find((game) => game.gameId === value);
      setPageForm((current) => ({
        ...current,
        gameId: value,
        gameUrl: selectedGame?.url || "",
      }));
      return;
    }

    setPageForm((current) => ({ ...current, [name]: value }));
  }

  function parseContent(value) {
    const clean = String(value || "").trim();

    if (!clean) return null;

    try {
      return JSON.parse(clean);
    } catch {
      return clean;
    }
  }

  async function savePage(event) {
    event.preventDefault();

    if (!issueId) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const parsedContent = parseContent(pageForm.content);

      const selectedGame = mockGames.find(
        (game) => game.gameId === pageForm.gameId
      );

      if (pageForm.type === "GAME" && !selectedGame) {
        setError("Choose a game from the IMPILO PLAY catalogue before saving.");
        return;
      }

      const gameUrl = (pageForm.gameUrl || "").trim();

      if (pageForm.type === "GAME" && !isAllowedGameUrl(gameUrl)) {
        setError(
          "Enter a valid HTTPS game URL, or an HTTP localhost URL for development."
        );
        return;
      }

      const existingContent =
        parsedContent &&
        typeof parsedContent === "object" &&
        !Array.isArray(parsedContent)
          ? parsedContent
          : {};
      const existingGame = existingContent.game || {};

      const pageContent =
        pageForm.type === "GAME"
          ? {
              ...existingContent,
              game: {
                ...existingGame,
                gameId: selectedGame.gameId,
                title: pageForm.title.trim() || selectedGame.title,
                description: selectedGame.description,
                url: gameUrl,
                coverImage: selectedGame.coverImage,
                displayMode: selectedGame.displayMode,
                allowFullscreen: selectedGame.allowFullscreen,
                status: selectedGame.status,
                category: selectedGame.category,
                shortDescription: selectedGame.shortDescription,
                estimatedMinutes: selectedGame.estimatedMinutes,
                theme: pageForm.gameTheme || DEFAULT_EDITORIAL_THEME,
              },
            }
          : parsedContent;

      const payload = {
        type: pageForm.type,
        title:
          pageForm.title.trim() ||
          (pageForm.type === "GAME" ? selectedGame?.title : ""),
        slug:
          pageForm.slug.trim() ||
          (pageForm.type === "GAME" ? selectedGame?.slug : ""),
        articleId:
          pageForm.type === "ARTICLE" ? pageForm.articleId || null : null,
        content: pageContent,
      };

      let response;

      if (editingPage?.id) {
        response = await api.put(
          `${API_PREFIX}/${issueId}/pages/${editingPage.id}`,
          payload
        );
      } else {
        response = await api.post(`${API_PREFIX}/${issueId}/pages`, payload);
      }

      const returnedIssue = response.data?.issue || response.data?.magazine;
      const returnedPage = response.data?.page;

      if (returnedIssue?.pages) {
        setFullIssue(returnedIssue);
        setPages(normalisePages(returnedIssue.pages));
      } else if (returnedPage?.id) {
        if (editingPage?.id) {
          setPages((current) =>
            current.map((page) =>
              page.id === returnedPage.id ? returnedPage : page
            )
          );
        } else {
          setPages((current) => normalisePages([...current, returnedPage]));
        }

        await loadIssue();
      } else {
        await loadIssue();
      }

      setMessage(
        response.data?.message ||
          (editingPage ? "Magazine page updated." : "Magazine page added.")
      );

      setShowPageForm(false);
      setEditingPage(null);
      setPageForm({ ...EMPTY_PAGE, ...EMPTY_GAME_FIELDS });

      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Save magazine page error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save magazine page."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePage(page) {
    if (!page?.id || !issueId) return;

    const confirmed = window.confirm(
      `Delete page ${page.position}: "${getPagePreview(page)}"?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.delete(`${API_PREFIX}/${issueId}/pages/${page.id}`);
      await loadIssue();

      setMessage("Magazine page deleted.");

      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Delete magazine page error:", err);
      setError(
        err.response?.data?.message || "Unable to delete magazine page."
      );
    } finally {
      setSaving(false);
    }
  }

  function movePage(index, direction) {
    setPages((current) => {
      const next = [...current];
      const target = index + direction;

      if (target < 0 || target >= next.length) return current;

      [next[index], next[target]] = [next[target], next[index]];

      return next.map((page, pageIndex) => ({
        ...page,
        position: pageIndex + 1,
      }));
    });

    setMessage("");
    setError("");
  }

  async function saveOrder() {
    if (!issueId) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.patch(
        `${API_PREFIX}/${issueId}/pages/reorder`,
        { pageIds: pages.map((page) => page.id) }
      );

      const savedPages = response.data?.pages;

      if (Array.isArray(savedPages)) {
        setPages(normalisePages(savedPages));
      } else {
        await loadIssue();
      }

      setMessage("Magazine page order saved.");

      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Save magazine page order error:", err);
      setError(err.response?.data?.message || "Unable to save page order.");
    } finally {
      setSaving(false);
    }
  }

  function editArticle(page) {
    const articleId = getArticleId(page);

    if (!articleId) {
      setError("This magazine page is not linked to an article.");
      return;
    }

    navigate(`/editorial/new?articleId=${articleId}`);
  }

  function createArticleForPage(page) {
    const params = new URLSearchParams();

    if (page?.title) {
      params.set("title", page.title);
    }

    navigate(`/editorial/new?${params.toString()}`);
  }

  if (loading) {
    return (
      <section className="impilo-issue-manager">
        <div className="impilo-issue-manager-loading">
          <span className="impilo-issue-manager-mark">IMPILO</span>
          <div className="impilo-issue-manager-loading-line" />
          <p>Opening issue desk...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="impilo-issue-manager">
      <header className="impilo-issue-manager-header">
        <div>
          <button
            type="button"
            className="impilo-issue-back"
            onClick={onBack}
          >
            ← Issues
          </button>

          <span className="impilo-issue-kicker">MAGAZINE ISSUE DESK</span>

          <h2>{fullIssue?.title || issue?.title || "Magazine Issue"}</h2>

          <p>
            Organise the physical magazine sequence, then open individual
            articles in the editorial workspace.
          </p>
        </div>

        <div className="impilo-issue-header-actions">
          <button
            type="button"
            className="impilo-issue-secondary"
            onClick={openAddPage}
            disabled={saving}
          >
            + Add Page
          </button>

          <button
            type="button"
            className="impilo-issue-primary"
            onClick={saveOrder}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Page Order"}
          </button>
        </div>
      </header>

      {message && (
        <div className="impilo-issue-message" role="status">
          ✓ {message}
        </div>
      )}

      {/* While the modal is open, errors show inside the modal instead */}
      {error && !showPageForm && (
        <div className="impilo-issue-error" role="alert">
          ! {error}
        </div>
      )}

      <div className="impilo-issue-summary">
        <div>
          <span>ISSUE</span>
          <strong>{fullIssue?.issueNumber ?? "—"}</strong>
        </div>

        <div>
          <span>VOLUME</span>
          <strong>{fullIssue?.volume ?? "—"}</strong>
        </div>

        <div>
          <span>PAGES</span>
          <strong>{pages.length}</strong>
        </div>

        <div>
          <span>ARTICLES</span>
          <strong>
            {pages.filter((page) => Boolean(getArticleId(page))).length}
          </strong>
        </div>
      </div>

      <div className="impilo-issue-order-note">
        <span>EDITORIAL ORDER</span>
        <p>
          The order below is the order used by the magazine issue. Move pages
          here; article blocks are arranged separately inside the Article
          Editor.
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="impilo-issue-empty">
          <span>✦</span>
          <small>EMPTY ISSUE</small>
          <h3>No pages have been added.</h3>
          <p>
            Start with a cover, contents page, article or static editorial
            page.
          </p>

          <button
            type="button"
            className="impilo-issue-primary"
            onClick={openAddPage}
          >
            Add First Page
          </button>
        </div>
      ) : (
        <div className="impilo-issue-page-list">
          {pages.map((page, index) => {
            const linkedArticle =
              articleMap.get(getArticleId(page)) || page.article;

            return (
              <article
                key={page.id || `${page.position}-${index}`}
                className="impilo-issue-page-row"
              >
                <div className="impilo-issue-page-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="impilo-issue-page-type">
                  <span>{getPageLabel(page.type)}</span>
                  <small>PAGE TYPE</small>
                </div>

                <div className="impilo-issue-page-main">
                  <h3>{getPagePreview(page)}</h3>

                  {page.type === "ARTICLE" && linkedArticle ? (
                    <div className="impilo-issue-linked-article">
                      <span>ARTICLE</span>
                      <strong>{linkedArticle.title}</strong>
                      {linkedArticle.status && (
                        <em>{linkedArticle.status}</em>
                      )}
                    </div>
                  ) : page.type === "ARTICLE" ? (
                    <div className="impilo-issue-unlinked">
                      No article attached
                    </div>
                  ) : page.type === "GAME" ? (
                    <div className="impilo-issue-page-slug">
                      {page?.content?.game?.category ||
                        page?.game?.category ||
                        "IMPILO PLAY"}
                      {" · "}
                      {page?.content?.game?.status ||
                        page?.game?.status ||
                        "DRAFT"}
                    </div>
                  ) : (
                    <div className="impilo-issue-page-slug">
                      {page.slug ? `/${page.slug}` : "Editorial / static page"}
                    </div>
                  )}
                </div>

                <div className="impilo-issue-page-reorder">
                  <button
                    type="button"
                    onClick={() => movePage(index, -1)}
                    disabled={index === 0 || saving}
                    aria-label="Move page up"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => movePage(index, 1)}
                    disabled={index === pages.length - 1 || saving}
                    aria-label="Move page down"
                  >
                    ↓
                  </button>
                </div>

                <div className="impilo-issue-page-actions">
                  {page.type === "ARTICLE" && getArticleId(page) ? (
                    <button
                      type="button"
                      className="gold"
                      onClick={() => editArticle(page)}
                      disabled={saving}
                    >
                      Edit Article
                    </button>
                  ) : page.type === "ARTICLE" ? (
                    <button
                      type="button"
                      onClick={() => createArticleForPage(page)}
                      disabled={saving}
                    >
                      Create Article
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => openEditPage(page)}
                    disabled={saving}
                  >
                    Edit Page
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => deletePage(page)}
                    disabled={saving}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showPageForm && (
        <div className="impilo-issue-modal-backdrop">
          <section
            className="impilo-issue-modal"
            role="dialog"
            aria-modal="true"
          >
            <header className="impilo-issue-modal-header">
              <div>
                <span>{editingPage ? "EDIT PAGE" : "ADD PAGE"}</span>
                <h3>
                  {editingPage ? "Update Magazine Page" : "Add Magazine Page"}
                </h3>
                <p>
                  Pages control the issue sequence. Articles remain editable in
                  the Editorial Workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={closePageForm}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <form
              className="impilo-issue-page-form"
              onSubmit={savePage}
              noValidate
            >
              <label>
                <span>PAGE TYPE</span>
                <select
                  name="type"
                  value={pageForm.type}
                  onChange={handlePageFormChange}
                  disabled={saving}
                >
                  {PAGE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {getPageLabel(type)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>PAGE TITLE</span>
                <input
                  name="title"
                  value={pageForm.title}
                  onChange={handlePageFormChange}
                  placeholder="Contents"
                  disabled={saving}
                />
              </label>

              <label>
                <span>SLUG</span>
                <input
                  name="slug"
                  value={pageForm.slug}
                  onChange={handlePageFormChange}
                  placeholder="contents"
                  disabled={saving}
                />
              </label>

              {pageForm.type === "GAME" && (
                <label className="full">
                  <span>SELECT MOCK GAME</span>
                  <select
                    name="gameId"
                    value={pageForm.gameId || ""}
                    onChange={handlePageFormChange}
                    disabled={saving}
                  >
                    <option value="">Choose a game</option>
                    {mockGames.map((game) => (
                      <option key={game.gameId} value={game.gameId}>
                        {game.title} — {game.category}
                      </option>
                    ))}
                  </select>
                  <small>
                    Select a game from the IMPILO PLAY catalogue. Games without
                    hosted URLs will show a coming-soon screen.
                  </small>
                </label>
              )}

              {pageForm.type === "GAME" && (
                <>
                  <label className="full">
                    <span>GAME EMBED URL</span>
                    <input
                      type="url"
                      name="gameUrl"
                      value={pageForm.gameUrl || ""}
                      onChange={handlePageFormChange}
                      placeholder="http://localhost:5174 or https://games.impilomag.co.za/game"
                      disabled={saving}
                    />
                    <small>
                      Use localhost for local development, or HTTPS for hosted
                      games.
                    </small>
                  </label>

                  <label className="full">
                    <span>EDITORIAL THEME</span>
                    <select
                      name="gameTheme"
                      value={pageForm.gameTheme || DEFAULT_EDITORIAL_THEME}
                      onChange={handlePageFormChange}
                      disabled={saving}
                    >
                      {Object.entries(EDITORIAL_THEMES).map(
                        ([themeId, theme]) => (
                          <option key={themeId} value={themeId}>
                            {theme?.name || theme?.label || themeId}
                          </option>
                        )
                      )}
                    </select>
                    <small>
                      Uses the existing IMPILO Magazine editorial palette.
                    </small>
                  </label>
                </>
              )}

              {pageForm.type === "ARTICLE" && (
                <label>
                  <span>ATTACH ARTICLE</span>
                  <select
                    name="articleId"
                    value={pageForm.articleId}
                    onChange={handlePageFormChange}
                    disabled={saving || articlesLoading}
                  >
                    <option value="">No article</option>
                    {articles.map((article) => (
                      <option key={article.id} value={article.id}>
                        {article.title}
                        {article.status && article.status !== "PUBLISHED"
                          ? ` (${article.status})`
                          : ""}
                      </option>
                    ))}
                  </select>
                  <small>
                    {articlesLoading
                      ? "Loading editorial articles..."
                      : `${articles.length} article${
                          articles.length === 1 ? "" : "s"
                        } available`}
                  </small>
                </label>
              )}

              <label className="full">
                <span>PAGE CONTENT</span>
                <textarea
                  name="content"
                  value={pageForm.content}
                  onChange={handlePageFormChange}
                  placeholder={`Optional JSON or plain text, for example:

{
  "heading": "Contents",
  "intro": "Inside this issue..."
}`}
                  rows={8}
                  disabled={saving}
                />
                <small>
                  JSON is saved as structured content when valid; otherwise the
                  value is saved as text.
                </small>
              </label>

              {error && (
                <div className="impilo-issue-error full" role="alert">
                  ! {error}
                </div>
              )}

              <footer>
                <button
                  type="button"
                  className="impilo-issue-secondary"
                  onClick={closePageForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="impilo-issue-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingPage
                      ? "Save Page"
                      : "Add Page"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}