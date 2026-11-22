/**
 * IMPILO page server (SSR)
 * ------------------------
 * Renders public pages (/, /articles/:slug) to full HTML on request, using
 * the bundle built by: vite build --ssr src/entry-server.jsx --outDir dist/server
 *
 * - No npm dependencies: only Node built-ins (Node 18+ for global fetch).
 * - Your Express API is untouched; this server only READS from it.
 * - Private pages (/editorial, /admin, /reader, /preview) get the plain app
 *   shell and are marked noindex.
 *
 * Place this file at:  Frontend/server/ssr-server.mjs
 * Run:                 node server/ssr-server.mjs
 *
 * Settings (environment variables, all optional):
 *   PORT          default 3001
 *   HOST          default 127.0.0.1
 *   API_URL       default https://api.impilomag.co.za/api
 *   SITE_URL      default https://impilomag.co.za  (used for canonical links + sitemap)
 *   CACHE_TTL_MS  default 60000
 */

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLIENT_DIR = path.join(ROOT, "dist", "client");
const SERVER_ENTRY = path.join(ROOT, "dist", "server", "entry-server.js");

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "127.0.0.1";
const API = (process.env.API_URL || "https://api.impilomag.co.za/api").replace(/\/$/, "");
const SITE = (process.env.SITE_URL || "https://impilomag.co.za").replace(/\/$/, "");
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS) || 60_000;
const SITEMAP_TTL_MS = 10 * 60_000;
const MAX_CACHE_ENTRIES = 300;

const PRIVATE_PREFIXES = [
  "/editorial",
  "/admin",
  "/reader",
  "/preview",
  "/media-picker-test",
  "/cloudfront-test",
];

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

/* ------------------------------------------------------------------
   Startup: load the HTML template and the server bundle once
   ------------------------------------------------------------------ */

const template = await fs.readFile(path.join(CLIENT_DIR, "index.html"), "utf-8");

if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
  console.error(
    "dist/client/index.html is missing the <!--app-head--> or <!--app-html--> marker.\n" +
      "Check index.html in the project root, then run: npm run build"
  );
  process.exit(1);
}

const { render } = await import(pathToFileURL(SERVER_ENTRY).href);

/* ------------------------------------------------------------------
   Small helpers
   ------------------------------------------------------------------ */

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const cache = new Map();

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(key, value, ttl = CACHE_TTL_MS) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    cache.delete(cache.keys().next().value); // drop the oldest entry
  }
  cache.set(key, { value, expires: Date.now() + ttl });
}

async function apiGet(p) {
  const res = await fetch(`${API}${p}`, {
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return { status: 404, data: null };
  if (!res.ok) throw new Error(`${p} -> ${res.status}`);
  return { status: 200, data: await res.json() };
}

function safeRender(url, data) {
  const html = render(url, data);
  if (!html || html.includes("Switched to client rendering")) {
    throw new Error(`Server render failed for ${url}`);
  }
  return html;
}

/** Fill the template. `url` marks which URL the HTML was rendered for. */
function buildPage({ head, html = "", data = null, url = "" }) {
  const payload = data
    ? `<script>window.__DATA__=${JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/\u2028|\u2029/g, "")}</script>`
    : "";

  let page = template;
  if (url) {
    page = page.replace('<div id="root">', () => `<div id="root" data-path="${esc(url)}">`);
  }
  return page
    .replace("<!--app-head-->", () => head)
    .replace("<!--app-html-->", () => html)
    .replace("</body>", () => `${payload}</body>`);
}

const SHELL_HEAD = `<title>Impilo Magazine</title>`;

function shellPage() {
  return buildPage({ head: SHELL_HEAD });
}

const SITE_NAME = "Impilo Magazine";
const SITE_DESC =
  "Impilo Magazine is a South African digital magazine covering fashion, lifestyle, culture and business.";
const PARENT_SITE = "https://co.impilomag.co.za"; // Impilo Digital Media Group

// Collapse whitespace, strip tags, cut at a word boundary.
function clip(text, max = 160) {
  const t = String(text || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length) + "…";
}

const absoluteUrl = (u) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return u.startsWith("/") ? `${SITE}${u}` : "";
};

const sortedBlocks = (article) =>
  [...(article?.blocks || [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

// Description: CMS excerpt, else the first paragraph of the article.
function articleDescription(article) {
  const excerpt = clip(article?.excerpt);
  if (excerpt) return excerpt;
  const firstText = sortedBlocks(article).find((b) => b.type === "TEXT" && b.content?.text);
  return clip(firstText?.content?.text) || SITE_DESC;
}

// Social/search image: the first image block in the article.
function articleImage(article) {
  const img = sortedBlocks(article).find((b) => b.type === "IMAGE" && b.media?.url);
  return absoluteUrl(img?.media?.url);
}

// JSON-LD must not be able to close the script tag.
const jsonLdTag = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

function headFor({
  title,
  desc,
  canonicalPath,
  type = "website",
  image = "",
  published = "",
  modified = "",
  author = "",
  jsonLd = null,
}) {
  const canonical = `${SITE}${canonicalPath === "/" ? "" : canonicalPath}`;
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${esc(canonical)}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta property="og:locale" content="en_ZA">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
  ];
  if (image) {
    lines.push(`<meta property="og:image" content="${esc(image)}">`);
    lines.push(`<meta name="twitter:image" content="${esc(image)}">`);
  }
  if (type === "article") {
    if (published) lines.push(`<meta property="article:published_time" content="${esc(published)}">`);
    if (modified) lines.push(`<meta property="article:modified_time" content="${esc(modified)}">`);
    if (author) lines.push(`<meta name="author" content="${esc(author)}">`);
  }
  if (jsonLd) lines.push(jsonLdTag(jsonLd));
  return lines.join("\n");
}

const PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE,
  parentOrganization: { "@type": "Organization", name: "Impilo Digital Media Group", url: PARENT_SITE },
};

const unwrapArticle = (j) => j?.article ?? j?.data ?? j;
const listArticles = (j) =>
  Array.isArray(j) ? j : j?.articles ?? j?.data ?? [];

/* ------------------------------------------------------------------
   Page builders. Each returns { status, body, headers }
   ------------------------------------------------------------------ */

const HTML = "text/html; charset=utf-8";
const PUBLIC_CACHE = "public, max-age=60";

async function homePage() {
  const cached = cacheGet("page:/");
  if (cached) return cached;

  const { data } = await apiGet("/articles");
  const articles = listArticles(data);
  const payload = { articles };

  const result = {
    status: 200,
    headers: { "Content-Type": HTML, "Cache-Control": PUBLIC_CACHE },
    body: buildPage({
      head: headFor({
        title: "Impilo Magazine | Fashion, Culture & Lifestyle from South Africa",
        desc: SITE_DESC,
        canonicalPath: "/",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE,
              inLanguage: "en-ZA",
              publisher: { "@type": "Organization", name: SITE_NAME },
            },
            {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE,
              parentOrganization: { "@type": "Organization", name: "Impilo Digital Media Group", url: PARENT_SITE },
              sameAs: [PARENT_SITE],
            },
          ],
        },
      }),
      html: safeRender("/", payload),
      data: payload,
      url: "/",
    }),
  };

  cacheSet("page:/", result);
  return result;
}

async function articlePage(slug) {
  const key = `page:/articles/${slug}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const { status, data } = await apiGet(`/articles/public/${encodeURIComponent(slug)}`);
  if (status === 404) return notFoundPage();

  const article = unwrapArticle(data);
  if (!article?.title) return notFoundPage();

  const payload = { [`article:${slug}`]: article };

  const result = {
    status: 200,
    headers: { "Content-Type": HTML, "Cache-Control": PUBLIC_CACHE },
    body: buildPage({
      head: headFor({
        title: `${article.title} | ${SITE_NAME}`,
        desc: articleDescription(article),
        canonicalPath: `/articles/${slug}`,
        type: "article",
        image: articleImage(article),
        published: article.publishedAt || "",
        modified: article.updatedAt || article.publishedAt || "",
        author: article.author?.displayName || "",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: String(article.title).slice(0, 110),
          description: articleDescription(article),
          mainEntityOfPage: `${SITE}/articles/${slug}`,
          inLanguage: "en-ZA",
          ...(articleImage(article) ? { image: [articleImage(article)] } : {}),
          ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
          dateModified: article.updatedAt || article.publishedAt || undefined,
          ...(article.author?.displayName
            ? { author: { "@type": "Person", name: article.author.displayName } }
            : { author: { "@type": "Organization", name: SITE_NAME } }),
          publisher: PUBLISHER,
        },
      }),
      html: safeRender(`/articles/${slug}`, payload),
      data: payload,
      url: `/articles/${slug}`,
    }),
  };

  cacheSet(key, result);
  return result;
}

function notFoundPage() {
  // data-path "/__404__" never matches the address bar, so the browser
  // re-renders fresh instead of trying to hydrate.
  return {
    status: 404,
    headers: {
      "Content-Type": HTML,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
    body: buildPage({
      head: `<title>Page not found</title><meta name="robots" content="noindex">`,
      html: safeRender("/__404__", {}),
      data: {},
      url: "/__404__",
    }),
  };
}

function shellResponse({ status = 200, noindex = false } = {}) {
  return {
    status,
    headers: {
      "Content-Type": HTML,
      "Cache-Control": "no-store",
      ...(noindex ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
    },
    body: shellPage(),
  };
}

async function sitemap() {
  const cached = cacheGet("sitemap");
  if (cached) return cached;

  const { data } = await apiGet("/articles");
  const articles = listArticles(data);

  const urls = [
    `<url><loc>${esc(SITE)}</loc></url>`,
    ...articles
      .filter((a) => a?.slug)
      .map((a) => {
        const last = a.updatedAt || a.publishedAt;
        return `<url><loc>${esc(`${SITE}/articles/${a.slug}`)}</loc>${
          last ? `<lastmod>${new Date(last).toISOString()}</lastmod>` : ""
        }</url>`;
      }),
  ];

  const result = {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" },
    body: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`,
  };

  cacheSet("sitemap", result, SITEMAP_TTL_MS);
  return result;
}

function robots() {
  return {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    body: `User-agent: *
${PRIVATE_PREFIXES.filter((p) => !p.includes("test")).map((p) => `Disallow: ${p}`).join("\n")}
Sitemap: ${SITE}/sitemap.xml
`,
  };
}

/* ------------------------------------------------------------------
   Static files (scripts, styles, images). Nginx should serve these in
   production; this also makes local testing work.
   ------------------------------------------------------------------ */

async function staticFile(pathname) {
  const filePath = path.join(CLIENT_DIR, pathname);
  if (!filePath.startsWith(CLIENT_DIR + path.sep)) return null; // path traversal guard
  if (path.basename(filePath) === "index.html") return null;

  try {
    const body = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return {
      status: 200,
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=3600",
      },
      body,
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------
   Request routing
   ------------------------------------------------------------------ */

const isPrivate = (p) =>
  PRIVATE_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));

async function route(pathname) {
  if (pathname === "/robots.txt") return robots();
  if (pathname === "/sitemap.xml") return sitemap();

  if (path.extname(pathname)) {
    const file = await staticFile(pathname);
    if (file) return file;
    return {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      body: "Not found",
    };
  }

  if (pathname === "/") return homePage();

  const article = pathname.match(/^\/articles\/([A-Za-z0-9_-]+)$/);
  if (article) return articlePage(article[1]);

  if (isPrivate(pathname)) return shellResponse({ noindex: true });

  // Magazine reader: client-rendered (page-flip needs the browser)
  if (/^\/read\/[^/]+(\/page\/\d+)?$/.test(pathname)) return shellResponse();

  return notFoundPage();
}

function send(req, res, { status, headers, body }) {
  res.writeHead(status, {
    ...headers,
    "X-Content-Type-Options": "nosniff",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(req.method === "HEAD" ? undefined : body);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return send(req, res, {
        status: 405,
        headers: { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" },
        body: "Method not allowed",
      });
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      return send(req, res, {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: "Bad request",
      });
    }

    if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");

    const result = await route(pathname);
    send(req, res, result);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}:`, err.message);

    // Page could not be rendered (API down or render error): serve the app
    // shell so the browser can still try, but signal the failure.
    try {
      const shell = shellResponse({ status: 503 });
      shell.headers["Retry-After"] = "30";
      send(req, res, shell);
    } catch {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Server error");
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`IMPILO page server on http://${HOST}:${PORT}`);
  console.log(`API: ${API}`);
  console.log(`Site URL: ${SITE}`);
});

process.on("unhandledRejection", (err) => console.error("Unhandled rejection:", err));