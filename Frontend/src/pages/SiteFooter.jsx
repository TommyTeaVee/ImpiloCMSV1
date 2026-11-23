import { Link, useLocation } from "react-router-dom";

// Pages that must not show the public footer (private tools and the full-screen reader).
const HIDE_ON = ["/editorial", "/admin", "/reader", "/read", "/preview", "/media-picker-test", "/cloudfront-test"];

export default function SiteFooter() {
  const { pathname } = useLocation();
  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  return (
    <footer className="uk-section uk-section-muted uk-section-small">
      <div className="uk-container">
        <ul className="uk-subnav uk-subnav-divider uk-flex-center uk-margin-small-bottom">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <a href="https://co.impilomag.co.za/terms.html" rel="noopener noreferrer" target="_blank">
              Terms
            </a>
          </li>
          <li>
            <a href="/sitemap.xml">Sitemap</a>
          </li>
        </ul>
        <p className="uk-text-center uk-text-meta uk-margin-remove">
          © {new Date().getFullYear()} Impilo Digital Media Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
}