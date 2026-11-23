import StaticPage from "./StaticPage.jsx";

export default function Contact() {
  return (
    <StaticPage title="Contact us">
      <p className="uk-text-lead">
        For editorial enquiries, story ideas, advertising, partnerships and corrections, email us.
      </p>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:info@impilomag.co.za">info@impilomag.co.za</a>
      </p>

      <p>We aim to reply within a few working days.</p>

      <h2 className="uk-heading-small">Follow Impilo</h2>
      <ul className="uk-list">
        <li>
          <a href="https://instagram.com/impilomag" rel="noopener noreferrer" target="_blank">
            Instagram
          </a>
        </li>
        <li>
          <a href="https://facebook.com/impilomag" rel="noopener noreferrer" target="_blank">
            Facebook
          </a>
        </li>
        <li>
          <a href="https://tiktok.com/@impilomag" rel="noopener noreferrer" target="_blank">
            TikTok
          </a>
        </li>
        <li>
          <a href="https://youtube.com/@impilomag" rel="noopener noreferrer" target="_blank">
            YouTube
          </a>
        </li>
      </ul>
    </StaticPage>
  );
}