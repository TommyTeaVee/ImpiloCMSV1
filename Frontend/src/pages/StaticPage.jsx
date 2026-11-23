import { useEffect } from "react";
import { Link } from "react-router-dom";

// Shared layout for About, Contact and Privacy.
export default function StaticPage({ title, updated, children }) {
  useEffect(() => {
    document.title = `${title} | Impilo Magazine`;
  }, [title]);

  return (
    <main className="uk-section uk-section-default">
      <div className="uk-container uk-container-small">
        <p className="uk-margin-small">
          <Link to="/" className="uk-link-text">
            ← Impilo Magazine
          </Link>
        </p>
        <h1 className="uk-heading-medium">{title}</h1>
        {updated && <p className="uk-text-meta">Last updated: {updated}</p>}
        <div className="uk-margin-medium-top">{children}</div>
      </div>
    </main>
  );
}