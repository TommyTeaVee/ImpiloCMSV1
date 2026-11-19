import fs from "node:fs/promises";
import path from "node:path";

const API = process.env.VITE_API_URL || "https://api.impilomag.co.za/api";
const SITE = process.env.SITE_URL || "https://impilomag.co.za";
const OUT = "dist/client";

const get = async (p) => {
  const r = await fetch(`${API}${p}`);
  if (!r.ok) throw new Error(`${p} -> ${r.status}`);
  return r.json();
};
const list = (j) =>
  Array.isArray(j) ? j : j?.articles ?? j?.magazines ?? j?.issues ?? j?.data ?? [];
const one = (j) => j?.article ?? j?.magazine ?? j?.issue ?? j?.data ?? j;
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const template = await fs.readFile(`${OUT}/index.html`, "utf-8");
const { render } = await import("../dist/server/entry-server.js");

const data = {};
const routes = [];

// Articles
const articles = list(await get("/articles"));
data.articles = articles;
routes.push({
  url: "/",
  title: "Impilo Magazine",
  desc: "Impilo Magazine: stories, culture and ideas.",
});

for (const a of articles) {
  const full = one(await get(`/articles/public/${a.slug}`));
  data[`article:${a.slug}`] = full;
  routes.push({
    url: `/articles/${a.slug}`,
    title: full.title,
    desc: (full.excerpt || "").slice(0, 160),
  });
}

// Magazine issues
for (const m of list(await get("/magazines"))) {
  const full = one(await get(`/magazines/public/${m.slug}`));
  data[`issue:${m.slug}`] = full;
  routes.push({
    url: `/read/${m.slug}`,
    title: full.title,
    desc: (full.description || full.excerpt || "").slice(0, 160),
  });
}

const inject = (head, html, payload) =>
  template
    .replace("<!--app-head-->", () => head)
    .replace("<!--app-html-->", () => html)
    .replace(
      "</body>",
      () =>
        `<script>window.__DATA__=${JSON.stringify(payload)
          .replace(/</g, "\\u003c")
          .replace(/\u2028|\u2029/g, "")}</script></body>`
    );

for (const r of routes) {
  const head = `<title>${esc(r.title)}</title>
<meta name="description" content="${esc(r.desc)}">
<link rel="canonical" href="${SITE}${r.url === "/" ? "" : r.url}">`;
  const page = inject(head, render(r.url, data), data);
  const file = path.join(OUT, r.url, "index.html");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, page);
}

// 404 page
await fs.writeFile(
  `${OUT}/404.html`,
  inject(
    `<title>Page not found</title><meta name="robots" content="noindex">`,
    render("/__404__", {}),
    {}
  )
);

// sitemap and robots
await fs.writeFile(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `<url><loc>${SITE}${r.url === "/" ? "" : r.url}</loc></url>`).join("\n")}
</urlset>`
);

await fs.writeFile(
  `${OUT}/robots.txt`,
  `User-agent: *
Disallow: /editorial
Disallow: /admin
Disallow: /reader
Sitemap: ${SITE}/sitemap.xml
`
);

console.log(`Prerendered ${routes.length} routes`);