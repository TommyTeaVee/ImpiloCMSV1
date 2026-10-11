import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import EditorialArticlePreview, {
  getEditorialPreviewMetadata,
} from "../components/editorial/EditorialArticlePreview.jsx";


const PAGE_STATUS_CSS = `
.impilo-article-preview-page-status { min-height:100vh; display:grid; place-items:center; padding:40px; background:#eeeae4; font-family:Montserrat,Arial,sans-serif; color:#171717; box-sizing:border-box; }
.impilo-article-preview-page-status > div { width:min(620px,100%); padding:44px; background:#fff; box-shadow:0 18px 50px rgba(0,0,0,.12); border-top:4px solid #d4af37; box-sizing:border-box; }
.impilo-article-preview-page-status span { font-size:.62rem; letter-spacing:.18em; font-weight:700; color:#9a7511; }
.impilo-article-preview-page-status h1 { font-family:Playfair Display,Didot,Georgia,serif; font-size:2rem; margin:12px 0; }
.impilo-article-preview-page-status p { font-size:.88rem; line-height:1.7; color:#666; }
.impilo-article-preview-page-status button { margin-top:16px; border:1px solid #222; background:#111; color:#fff; border-radius:999px; padding:11px 16px; cursor:pointer; }
@media(max-width:700px){ .impilo-article-preview-page-status{padding:18px} .impilo-article-preview-page-status>div{padding:28px} }
`;
export default function EditorialArticlePreviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("articleId");

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(Boolean(articleId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!articleId) {
      setLoading(false);
      setError("No article was supplied for preview.");
      return;
    }

    let active = true;

    async function loadArticle() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/articles/manage/${articleId}`);
        const loaded = response.data?.article || response.data;

        if (!loaded) {
          throw new Error("Article was not returned by the server.");
        }

        if (active) setArticle(loaded);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load article preview."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadArticle();

    return () => {
      active = false;
    };
  }, [articleId]);

  if (loading) {
    return (
      <><style>{PAGE_STATUS_CSS}</style><main className="impilo-article-preview-page-status">
        <div>
          <span>IMPILO EDITORIAL</span>
          <h1>Loading article preview…</h1>
          <p>Retrieving the current article from the editorial system.</p>
        </div>
      </main></>
    );
  }

  if (error || !article) {
    return (
      <><style>{PAGE_STATUS_CSS}</style><main className="impilo-article-preview-page-status">
        <div>
          <span>IMPILO EDITORIAL</span>
          <h1>Preview unavailable</h1>
          <p>{error || "The requested article could not be loaded."}</p>
          <button type="button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </main></>
    );
  }

  const blocks = Array.isArray(article.blocks)
    ? [...article.blocks].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      )
    : [];

  const metadata = getEditorialPreviewMetadata(blocks);

  return (
    <EditorialArticlePreview
      standalone
      title={article.title || ""}
      excerpt={article.excerpt || ""}
      blocks={blocks}
      templateId={metadata.templateId}
      themeId={metadata.themeId}
    />
  );
}
