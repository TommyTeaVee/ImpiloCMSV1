import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import NotFound from "./NotFound";
import { useInitialData } from "../initialData";
const unwrap = (j) => j?.article ?? j?.data ?? j;

// Block content normally arrives as an object; tolerate a JSON string too
const parseContent = (c) => {
  if (typeof c === "string") {
    try {
      return JSON.parse(c);
    } catch {
      return { text: c };
    }
  }
  return c ?? {};
};

// Split text into paragraphs; pass through if it is already HTML
function Text({ text }) {
  if (!text) return null;
  if (text.trim().startsWith("<")) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return text
    .split(/\n+/)
    .filter((p) => p.trim())
    .map((p, i) => <p key={i}>{p}</p>);
}

function Block({ block }) {
  const content = parseContent(block.content);

  switch (block.type) {
    case "TEXT":
      return <Text text={content.text} />;

    case "QUOTE":
      return (
        <blockquote>
          {content.text}
          {content.author && <footer>{content.author}</footer>}
        </blockquote>
      );

    case "IMAGE":
      if (!block.media?.url) return null;
      return (
        <figure>
          <img
            src={block.media.url}
            alt={content.alt ?? block.media.alt ?? block.media.altText ?? ""}
            loading="lazy"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          {content.caption && <figcaption>{content.caption}</figcaption>}
        </figure>
      );

    default:
      return null;
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const initial = useInitialData(`article:${slug}`);
  const [article, setArticle] = useState(initial ?? null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (article) return;
    api
      .get(`/articles/public/${slug}`)
      .then((r) => setArticle(unwrap(r.data)))
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <NotFound />;
  if (!article) return null;

  const blocks = [...(article.blocks ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );
  const author = article.author?.displayName ?? article.author?.username;

  return (
    <article className="uk-container uk-container-small uk-margin-top">
      <h1>{article.title}</h1>
      <p className="uk-text-meta">
        {author && <>By {author} · </>}
        {article.publishedAt &&
          new Date(article.publishedAt).toLocaleDateString("en-ZA", {
            dateStyle: "long",
          })}
      </p>
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
      <p>
        <Link to="/">← More from Impilo</Link>
      </p>
    </article>
  );
}