import React, { useEffect, useRef, useState } from "react";
import {
  DEFAULT_EDITORIAL_THEME,
  EDITORIAL_THEMES,
  makeThemeStyle,
} from "./editorialThemeConfig";


function safeGameUrl(value) {
  if (!value || typeof value !== "string") return "";

  try {
    const url = new URL(value);

    const isHttps = url.protocol === "https:";

    const isLocalhost =
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname);

    return (isHttps || isLocalhost) ? url.href : "";

  } catch {
    return "";
  }
}

export default function GamePageRenderer({ page }) {
  const frameRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
const [coverError, setCoverError] = useState(false);
  const game = page?.game || page?.content?.game || {};
  const gameUrl = safeGameUrl(game.url || game.embedUrl);
  const title = game.title || page?.title || "IMPILO PLAY";
  const description =
    game.description || page?.description || "Enter the experience and play.";

  const requestedTheme = String(game.theme || DEFAULT_EDITORIAL_THEME).toUpperCase();
  const themeId = EDITORIAL_THEMES[requestedTheme]
    ? requestedTheme
    : DEFAULT_EDITORIAL_THEME;
  const theme = EDITORIAL_THEMES[themeId];
useEffect(() => {
  setLoadError(false);
  setCoverError(false);
}, [game.url, game.embedUrl, game.coverImage]);
  async function enterFullscreen() {
    const target = frameRef.current;
    if (!target) return;
    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen();
      } else if (target.contentWindow) {
        target.contentWindow.focus();
      }
    } catch (error) {
      console.warn("Fullscreen was not available for this game:", error);
    }
  }

  return (
    <section
      className={`impilo-page impilo-game-page impilo-theme-${themeId.toLowerCase().replace(/_/g, "-")}`}
      aria-label={`Game: ${title}`}
      data-editorial-theme={themeId}
      style={makeThemeStyle(theme)}
    >
      <div
        className="impilo-game-page-inner"
        onPointerDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        <header className="impilo-game-header">
          <div className="impilo-game-brandline">
            <span>IMPILO PLAY</span>
            <span className="impilo-game-live-mark">INTERACTIVE</span>
          </div>
          <p className="impilo-game-eyebrow">PLAY · COMPETE · DISCOVER</p>
          <h1>{title}</h1>
          {description && <p className="impilo-game-description">{description}</p>}
        </header>

        {game.coverImage && !coverError && (
  <div className="impilo-game-cover">
    <img
      src={game.coverImage}
      alt={title}
      loading="lazy"
      onError={() => setCoverError(true)}
    />
  </div>
)}

        <div
          className="impilo-game-stage"
          onPointerDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
          {gameUrl ? (
            <iframe
              ref={frameRef}
              title={title}
              src={gameUrl}
              className="impilo-game-frame"
              loading="lazy"
              allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope; clipboard-read; clipboard-write"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-downloads"
              onLoad={() => setLoadError(false)}
              onError={() => setLoadError(true)}
            />
          ) : (
            <div className="impilo-game-unavailable">
              <span className="impilo-game-unavailable-icon">✦</span>
              <strong>Game experience coming soon</strong>
              <p>Add a valid HTTPS game URL, or use localhost during development, to activate this experience.</p>
            </div>
          )}
          {loadError && (
            <p className="impilo-game-error">
              The game could not be loaded. Check its embed settings and URL.
            </p>
          )}
        </div>

        <footer className="impilo-game-footer">
          <span>AN IMPILO INTERACTIVE EXPERIENCE</span>
          {gameUrl && (
            <button
              type="button"
              className="impilo-game-fullscreen"
              onClick={enterFullscreen}
            >
              ⛶ Expand game
            </button>
          )}
        </footer>
      </div>
    </section>
  );
}
