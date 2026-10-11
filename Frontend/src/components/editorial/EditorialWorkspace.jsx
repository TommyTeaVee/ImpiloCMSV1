import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate,
  useSearchParams
} from "react-router-dom";
import MediaControls from "../../components/magazine/MediaControls.jsx";
import api from "../../services/api";
import MediaPicker from "./MediaPicker.jsx";
import EditorialArticlePreview from "./EditorialArticlePreview.jsx";


/* ============================================================
   IMPILO EDITORIAL DESIGN SYSTEM
   Self-contained in this workspace so this update does not
   require changes to the API, Prisma schema, public reader,
   Home.jsx, or existing article routes.
   ============================================================ */

const EDITORIAL_TEMPLATES = {
  EDITORIAL_FEATURE: {
    id: "EDITORIAL_FEATURE",
    name: "Editorial Feature",
    shortName: "Feature",
    description: "Hero-led feature with editorial columns and a pull quote.",
    eyebrow: "IMPILO EDITORIAL"
  },
  PROFILE: {
    id: "PROFILE",
    name: "Profile / Model",
    shortName: "Profile",
    description: "Portrait-led profile with biography columns and quote treatment.",
    eyebrow: "PROFILE / EDITORIAL"
  },
  BRAND_POWER: {
    id: "BRAND_POWER",
    name: "Brand Power",
    shortName: "Brand",
    description: "Thought-leadership layout with insight panels and media.",
    eyebrow: "BRAND POWER"
  },
  EDUCATIONAL: {
    id: "EDUCATIONAL",
    name: "Educational / Essay",
    shortName: "Insight",
    description: "Structured essay with sections, columns and key ideas.",
    eyebrow: "IMPILO INSIGHT"
  },
  MEDIA_FEATURE: {
    id: "MEDIA_FEATURE",
    name: "Media Feature",
    shortName: "Media",
    description: "Mixed-media story built around video, image and editorial text.",
    eyebrow: "IMPILO MEDIA"
  },
  PORTFOLIO: {
    id: "PORTFOLIO",
    name: "Visual Portfolio",
    shortName: "Portfolio",
    description: "Image-forward composition for models, photographers and visual work.",
    eyebrow: "VISUAL PORTFOLIO"
  }
};

const EDITORIAL_THEMES = {
  NEUTRAL: {
    id: "NEUTRAL",
    name: "Neutral",
    description: "White editorial page with restrained gold accents.",
    accent: "#a58216",
    accentStrong: "#d4af37",
    surface: "#f7f3ee",
    soft: "#f1eee8",
    ink: "#161616",
    muted: "#666666"
  },
  SIGNATURE_GOLD: {
    id: "SIGNATURE_GOLD",
    name: "Signature Gold",
    description: "IMPILO's core luxury finish.",
    accent: "#a58216",
    accentStrong: "#d4af37",
    surface: "#f8f2df",
    soft: "#efe4bd",
    ink: "#17130b",
    muted: "#675d44"
  },
  NOIR: {
    id: "NOIR",
    name: "Noir",
    description: "Black editorial accents while keeping the page white.",
    accent: "#222222",
    accentStrong: "#111111",
    surface: "#f3f3f3",
    soft: "#e9e9e9",
    ink: "#0d0d0d",
    muted: "#5f5f5f"
  },
  RED_WINE: {
    id: "RED_WINE",
    name: "Red Wine",
    description: "Dramatic editorial accent for culture and showbiz.",
    accent: "#7a0c0c",
    accentStrong: "#4e0707",
    surface: "#f8eded",
    soft: "#efdbdb",
    ink: "#1d1111",
    muted: "#6d5858"
  },
  DARK_BLUE: {
    id: "DARK_BLUE",
    name: "Dark Blue",
    description: "Cinema, technology and serious feature storytelling.",
    accent: "#0b2a55",
    accentStrong: "#020b1a",
    surface: "#eef4fa",
    soft: "#dfeaf5",
    ink: "#0f1720",
    muted: "#5c6875"
  },
  EMERALD: {
    id: "EMERALD",
    name: "Emerald",
    description: "Growth, heritage and premium natural themes.",
    accent: "#008c5b",
    accentStrong: "#062e2a",
    surface: "#edf8f3",
    soft: "#d8eee5",
    ink: "#0d2019",
    muted: "#5b7268"
  },
  PURPLE: {
    id: "PURPLE",
    name: "Purple Silk",
    description: "Creative identity and fashion-forward editorial work.",
    accent: "#6f3697",
    accentStrong: "#341147",
    surface: "#f5eff8",
    soft: "#eadcf0",
    ink: "#1b1020",
    muted: "#6b5c70"
  },
  LIME: {
    id: "LIME",
    name: "Lime",
    description: "Youth culture, innovation and energetic features.",
    accent: "#6f821b",
    accentStrong: "#b8d232",
    surface: "#f4f8df",
    soft: "#e9f1bd",
    ink: "#182007",
    muted: "#657044"
  },
  SILVER: {
    id: "SILVER",
    name: "Silver",
    description: "Industrial luxe with a cool editorial finish.",
    accent: "#67707a",
    accentStrong: "#34383d",
    surface: "#f1f2f3",
    soft: "#e3e5e7",
    ink: "#191b1e",
    muted: "#61676d"
  }
};

const BLOCK_TYPE_OPTIONS = [
  { value: "TEXT", label: "Paragraph" },
  { value: "HEADING", label: "Heading" },
  { value: "QUOTE", label: "Quote" },
  { value: "IMAGE", label: "Image" },
  { value: "VIDEO", label: "Video" },
  { value: "AUDIO", label: "Audio" },
  { value: "FOOTNOTE", label: "Footnote / Reference" }
];

function getBlockVariant(block) {
  return block?.content?.editorialLayout?.variant ||
    block?.content?.editorialLayout?.role ||
    "";
}

function isFootnoteBlock(block) {
  return (
    block?.type === "TEXT" &&
    (getBlockVariant(block) === "FOOTNOTE" ||
      getBlockVariant(block) === "footnote" ||
      block?.content?.footnote === true)
  );
}

const EDITORIAL_BLUEPRINTS = {
  EDITORIAL_FEATURE: [
    ["TEXT", "eyebrow", "IMPILO EDITORIAL"],
    ["HEADING", "title", ""],
    ["TEXT", "deck", ""],
    ["IMAGE", "hero", ""],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["QUOTE", "pull-quote", ""],
    ["HEADING", "section-heading", "The Story Continues"],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["IMAGE", "inline-image", ""]
  ],
  PROFILE: [
    ["TEXT", "eyebrow", "PROFILE / EDITORIAL"],
    ["HEADING", "title", ""],
    ["TEXT", "deck", ""],
    ["IMAGE", "portrait-hero", ""],
    ["QUOTE", "signature-quote", ""],
    ["HEADING", "section-heading", "Editorial Biography"],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["HEADING", "section-heading", "Career & Direction"],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["IMAGE", "portrait-small", ""]
  ],
  BRAND_POWER: [
    ["TEXT", "eyebrow", "BRAND POWER"],
    ["HEADING", "title", ""],
    ["TEXT", "deck", ""],
    ["TEXT", "body-full", ""],
    ["VIDEO", "hero-video", ""],
    ["HEADING", "section-heading", "Value Is Framed"],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["QUOTE", "pull-quote", ""],
    ["TEXT", "body-full", ""],
    ["HEADING", "insight-heading", "Perspective as Competitive Edge"],
    ["TEXT", "callout", ""]
  ],
  EDUCATIONAL: [
    ["TEXT", "eyebrow", "IMPILO INSIGHT"],
    ["HEADING", "title", ""],
    ["TEXT", "deck", ""],
    ["IMAGE", "hero", ""],
    ["TEXT", "dropcap", ""],
    ["HEADING", "section-heading", ""],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["QUOTE", "pull-quote", ""],
    ["HEADING", "section-heading", "Key Considerations"],
    ["TEXT", "callout", ""],
    ["TEXT", "body-full", ""]
  ],
  MEDIA_FEATURE: [
    ["TEXT", "eyebrow", "IMPILO MEDIA"],
    ["HEADING", "title", ""],
    ["TEXT", "deck", ""],
    ["VIDEO", "hero-video", ""],
    ["TEXT", "body-full", ""],
    ["IMAGE", "split-image", ""],
    ["TEXT", "body-right", ""],
    ["QUOTE", "pull-quote", ""],
    ["TEXT", "body-full", ""]
  ],
  PORTFOLIO: [
    ["TEXT", "eyebrow", "VISUAL PORTFOLIO"],
    ["HEADING", "title", ""],
    ["TEXT", "deck", ""],
    ["IMAGE", "gallery-1", ""],
    ["IMAGE", "gallery-2", ""],
    ["IMAGE", "gallery-3", ""],
    ["IMAGE", "gallery-4", ""],
    ["QUOTE", "gallery-quote", ""],
    ["IMAGE", "gallery-5", ""],
    ["IMAGE", "gallery-6", ""]
  ]
};

function makeEditorialBlock(type, role, text = "", extra = {}) {
  return {
    clientId: crypto.randomUUID(),
    type,
    content: {
      text,
      editorialLayout: {
        role,
        ...extra
      }
    },
    mediaId: null
  };
}

function buildTemplateBlocks(templateId, articleTitle = "") {
  const blueprint =
    EDITORIAL_BLUEPRINTS[templateId] ||
    EDITORIAL_BLUEPRINTS.EDITORIAL_FEATURE;

  return blueprint.map(([type, role, seed]) =>
    makeEditorialBlock(
      type,
      role,
      role === "title" ? articleTitle : seed,
      { template: templateId }
    )
  );
}

function applyEditorialMetadata(blockList, templateId, themeId) {
  return blockList.map((item) => ({
    ...item,
    content: {
      ...(item.content || {}),
      editorialLayout: {
        ...(item.content?.editorialLayout || {}),
        template: templateId,
        theme: themeId
      }
    }
  }));
}

function applyTemplateToBlocks(blockList, templateId, themeId) {
  const blueprint =
    EDITORIAL_BLUEPRINTS[templateId] ||
    EDITORIAL_BLUEPRINTS.EDITORIAL_FEATURE;

  const usedRoles = new Set();
  const roleEntries = blueprint.map(([type, role]) => ({ type, role }));

  return blockList.map((item, index) => {
    if (isFootnoteBlock(item)) {
      return {
        ...item,
        type: "TEXT",
        content: {
          ...(item.content || {}),
          footnote: true,
          editorialLayout: {
            ...(item.content?.editorialLayout || {}),
            template: templateId,
            theme: themeId,
            role: "footnote",
            variant: "FOOTNOTE"
          }
        }
      };
    }

    const exactIndex = roleEntries.findIndex(
      (entry) =>
        !usedRoles.has(entry.role) &&
        entry.type === item.type
    );

    let role =
      exactIndex >= 0
        ? roleEntries[exactIndex].role
        : null;

    if (!role) {
      if (item.type === "HEADING") {
        role = index === 0 ? "title" : "section-heading";
      } else if (item.type === "QUOTE") {
        role = "pull-quote";
      } else if (
        item.type === "IMAGE" ||
        item.type === "VIDEO"
      ) {
        role = index === 0 ? "hero" : "inline-image";
      } else {
        role = "body-full";
      }
    }

    usedRoles.add(role);

    return {
      ...item,
      content: {
        ...(item.content || {}),
        editorialLayout: {
          ...(item.content?.editorialLayout || {}),
          template: templateId,
          theme: themeId,
          role
        }
      }
    };
  });
}

function detectEditorialMetadata(blockList = []) {
  for (const item of blockList) {
    const metadata = item?.content?.editorialLayout;
    if (metadata?.template || metadata?.theme) {
      return {
        templateId:
          EDITORIAL_TEMPLATES[metadata.template]
            ? metadata.template
            : "EDITORIAL_FEATURE",
        themeId:
          EDITORIAL_THEMES[metadata.theme]
            ? metadata.theme
            : "NEUTRAL"
      };
    }
  }

  return {
    templateId: "EDITORIAL_FEATURE",
    themeId: "NEUTRAL"
  };
}

function splitArticleParagraphs(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function makeFeederBlock(type, text = "") {
  return {
    clientId: crypto.randomUUID(),
    type,
    content: { text },
    mediaId: null
  };
}

function ArticleFeeder({ onApply, onCancel }) {
  const [rawText, setRawText] = useState("");
  const [layout, setLayout] = useState("EDITORIAL");
  const [feederError, setFeederError] = useState("");

  const paragraphs = useMemo(
    () => splitArticleParagraphs(rawText),
    [rawText]
  );

  function generateArticle() {
    if (!paragraphs.length) {
      setFeederError("Paste your article text first.");
      return;
    }

    let generatedBlocks = [];

    if (layout === "EDITORIAL") {
      generatedBlocks = paragraphs.map((text) =>
        makeFeederBlock("TEXT", text)
      );
    }

    if (layout === "MAGAZINE") {
      generatedBlocks = [
        makeFeederBlock("HEADING", paragraphs[0]),
        ...paragraphs.slice(1).map((text) =>
          makeFeederBlock("TEXT", text)
        )
      ];
    }

    if (layout === "FEATURE") {
      generatedBlocks = [
        makeFeederBlock("HEADING", paragraphs[0]),
        ...paragraphs.slice(1).flatMap((text, index) => {
          if (index > 0 && index % 3 === 0) {
            return [
              makeFeederBlock("QUOTE", ""),
              makeFeederBlock("TEXT", text)
            ];
          }
          return [makeFeederBlock("TEXT", text)];
        })
      ];
    }

    setFeederError("");
    onApply(generatedBlocks);
  }

  return (
    <div
      className="impilo-feeder-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        background: "rgba(0, 0, 0, 0.78)"
      }}
    >
      <section
        className="impilo-article-feeder"
        style={{
          width: "min(900px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "16px",
          background: "#111",
          boxShadow: "0 30px 90px rgba(0,0,0,.65)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "24px"
          }}
        >
          <div>
            <span
              style={{
                color: "#d4af37",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "2px"
              }}
            >
              IMPILO FEEDER
            </span>
            <h2 style={{ margin: "8px 0" }}>
              Feed Your Article
            </h2>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Paste the article and generate editorial blocks for the canvas.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close article feeder"
            style={{
              border: "0",
              background: "transparent",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer"
            }}
          >
            ×
          </button>
        </div>

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 700
          }}
        >
          Raw Article
        </label>

        <textarea
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder={
            "Paste your complete article here...\n\nKeep a blank line between paragraphs."
          }
          rows={16}
          autoFocus
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#090909",
            color: "#fff",
            font: "inherit",
            lineHeight: 1.6
          }}
        />

        <div style={{ marginTop: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: 700
            }}
          >
            Default Layout
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "10px"
            }}
          >
            {[
              ["EDITORIAL", "Editorial", "Clean paragraph flow"],
              ["MAGAZINE", "Magazine", "Heading + story flow"],
              ["FEATURE", "Feature", "Feature with quote breaks"]
            ].map(([value, label, description]) => (
              <button
                key={value}
                type="button"
                onClick={() => setLayout(value)}
                style={{
                  textAlign: "left",
                  padding: "14px",
                  borderRadius: "10px",
                  border:
                    layout === value
                      ? "1px solid #d4af37"
                      : "1px solid #333",
                  background:
                    layout === value
                      ? "rgba(212,175,55,.12)"
                      : "#0b0b0b",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                <strong style={{ display: "block" }}>{label}</strong>
                <small style={{ opacity: 0.65 }}>{description}</small>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginTop: "20px"
          }}
        >
          <div style={{ opacity: 0.65 }}>
            {paragraphs.length} paragraph{paragraphs.length === 1 ? "" : "s"} detected
          </div>

          {feederError && (
            <div style={{ color: "#ff8d8d" }}>
              {feederError}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "24px"
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              border: "1px solid #444",
              background: "transparent",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!rawText.trim()}
            onClick={generateArticle}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "0",
              background: "#d4af37",
              color: "#111",
              fontWeight: 800,
              cursor: rawText.trim() ? "pointer" : "not-allowed",
              opacity: rawText.trim() ? 1 : 0.45
            }}
          >
            ✦ Generate Article
          </button>
        </div>
      </section>
    </div>
  );
}

export default function EditorialWorkspace() {
  const navigate = useNavigate();

  const [
    searchParams
  ] = useSearchParams();

  const articleId =
    searchParams.get("articleId");

  const isEditing =
    Boolean(articleId);

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [blocks, setBlocks] =
    useState([]);

  const [layoutTemplate, setLayoutTemplate] =
    useState("EDITORIAL_FEATURE");

  const [themeId, setThemeId] =
    useState("NEUTRAL");

  const [showFeeder, setShowFeeder] =
    useState(false);
  const [previewOpen, setPreviewOpen] =
    useState(false);
  const [loadingArticle, setLoadingArticle] =
    useState(isEditing);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [originalSnapshot, setOriginalSnapshot] =
    useState(null);

  const [
    draggedIndex,
    setDraggedIndex
  ] = useState(null);

  const [
    dragOverIndex,
    setDragOverIndex
  ] = useState(null);
  // ==================================================
// MEDIA PICKER
// ==================================================

const [
  mediaPickerIndex,
  setMediaPickerIndex
] = useState(null);

  function cloneValue(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function makeSnapshot(values = {}) {
    return cloneValue({
      title: values.title ?? "",
      slug: values.slug ?? "",
      excerpt: values.excerpt ?? "",
      blocks: values.blocks ?? [],
      layoutTemplate: values.layoutTemplate ?? "EDITORIAL_FEATURE",
      themeId: values.themeId ?? "NEUTRAL"
    });
  }

  function getCurrentSnapshot() {
    return makeSnapshot({
      title,
      slug,
      excerpt,
      blocks,
      layoutTemplate,
      themeId
    });
  }

  const hasUnsavedChanges = useMemo(() => {
    if (!originalSnapshot) return false;
    return JSON.stringify(getCurrentSnapshot()) !== JSON.stringify(originalSnapshot);
  }, [title, slug, excerpt, blocks, layoutTemplate, themeId, originalSnapshot]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ==================================================
  // LOAD EXISTING ARTICLE
  // ==================================================

  useEffect(() => {
    if (!articleId) {
      setOriginalSnapshot(
        makeSnapshot({
          title: "",
          slug: "",
          excerpt: "",
          blocks: [],
          layoutTemplate: "EDITORIAL_FEATURE",
          themeId: "NEUTRAL"
        })
      );
      setLoadingArticle(false);
      return;
    }

    async function loadArticle() {
      try {
        setLoadingArticle(true);
        setError("");

        const response =
          await api.get(
            `/articles/manage/${articleId}`
          );

        /*
         * Backend may return:
         *
         * {
         *   article: {...}
         * }
         *
         * or the article directly.
         */

        const article =
          response.data?.article ||
          response.data;

        if (!article) {
          throw new Error(
            "Article was not returned by the server."
          );
        }

        setTitle(
          article.title || ""
        );

        setSlug(
          article.slug || ""
        );

        setExcerpt(
          article.excerpt || ""
        );

        const databaseBlocks =
          Array.isArray(
            article.blocks
          )
            ? [...article.blocks]
                .sort(
                  (a, b) =>
                    (a.position ?? 0) -
                    (b.position ?? 0)
                )
            : [];

        /*
         * Keep the database ID separate
         * from the temporary frontend ID.
         */

        const hydratedBlocks = databaseBlocks.map(
          (block) => ({
            ...block,

            clientId:
              block.id ||
              crypto.randomUUID(),

            content:
              block.content || {},

            mediaId:
              block.mediaId ||
              null
          })
        );

        const detected =
          detectEditorialMetadata(hydratedBlocks);

        setLayoutTemplate(
          detected.templateId
        );

        setThemeId(
          detected.themeId
        );

        setBlocks(
          hydratedBlocks
        );

        setOriginalSnapshot(
          makeSnapshot({
            title: article.title || "",
            slug: article.slug || "",
            excerpt: article.excerpt || "",
            blocks: hydratedBlocks,
            layoutTemplate: detected.templateId,
            themeId: detected.themeId
          })
        );

      } catch (err) {
        console.error(
          "Load article error:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load article."
        );
      } finally {
        setLoadingArticle(false);
      }
    }

    loadArticle();
  }, [articleId]);

  // ==================================================
  // CREATE SLUG
  // ==================================================

  function createSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );
  }

  // ==================================================
  // TITLE
  // ==================================================

  function handleTitleChange(event) {
    const value =
      event.target.value;

    setTitle(value);

    if (!isEditing && !slug) {
      setSlug(
        createSlug(value)
      );
    }
  }

  // ==================================================
  // ADD BLOCK
  // ==================================================

  function addBlock(type) {
    let block = null;

    switch (type) {
      case "TEXT":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "TEXT",
          content: {
            text: ""
          },
          mediaId: null
        };
        break;

      case "HEADING":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "HEADING",
          content: {
            text: ""
          },
          mediaId: null
        };
        break;

      case "QUOTE":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "QUOTE",
          content: {
            text: ""
          },
          mediaId: null
        };
        break;

      case "FOOTNOTE":
        block = {
          clientId: crypto.randomUUID(),
          type: "TEXT",
          content: {
            text: "",
            source: "",
            url: "",
            footnote: true,
            editorialLayout: {
              role: "footnote",
              variant: "FOOTNOTE"
            }
          },
          mediaId: null
        };
        break;

      case "IMAGE":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "IMAGE",
          content: {
            layout: "full"
          },
          mediaId: null
        };
        break;

      case "VIDEO":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "VIDEO",
          content: {
            layout: "full"
          },
          mediaId: null
        };
        break;

      case "AUDIO":
        block = {
          clientId:
            crypto.randomUUID(),
          type: "AUDIO",
          content: {
            layout: "full"
          },
          mediaId: null
        };
        break;

      default:
        return;
    }

    setBlocks(
      (current) => [
        ...current,
        block
      ]
    );

    setMessage("");
    setError("");
  }

  // ==================================================
  // CHANGE BLOCK TYPE
  // ==================================================

  function changeBlockType(index, nextType) {
    setBlocks((current) => {
      const next = [...current];
      const block = next[index];
      if (!block) return current;

      const currentIsFootnote = isFootnoteBlock(block);
      const existingText = block.content?.text || "";
      const existingSource = block.content?.source || "";
      const existingUrl = block.content?.url || "";
      const currentLayout = block.content?.editorialLayout || {};

      if (nextType === "FOOTNOTE") {
        next[index] = {
          ...block,
          type: "TEXT",
          mediaId: null,
          media: null,
          content: {
            text: existingText,
            source: existingSource,
            url: existingUrl,
            footnote: true,
            editorialLayout: {
              ...currentLayout,
              role: "footnote",
              variant: "FOOTNOTE"
            }
          }
        };
        return next;
      }

      const textType = ["TEXT", "HEADING", "QUOTE"].includes(nextType);
      const mediaType = ["IMAGE", "VIDEO", "AUDIO"].includes(nextType);

      const nextRole =
        nextType === "HEADING"
          ? "section-heading"
          : nextType === "QUOTE"
            ? "pull-quote"
            : nextType === "TEXT"
              ? "body-full"
              : currentLayout.role || "inline-image";

      next[index] = {
        ...block,
        type: nextType,
        mediaId: mediaType && block.type === nextType ? block.mediaId || null : null,
        media: mediaType && block.type === nextType ? block.media || null : null,
        content: textType
          ? {
              text: existingText,
              editorialLayout: {
                ...currentLayout,
                role: nextRole,
                variant: nextType === "TEXT" ? "PARAGRAPH" : nextType
              }
            }
          : {
              layout: "full",
              editorialLayout: {
                ...currentLayout,
                role: nextRole,
                variant: nextType
              }
            }
      };

      if (currentIsFootnote && textType) {
        delete next[index].content.footnote;
      }

      return next;
    });

    setMediaPickerIndex(null);
    setMessage("");
    setError("");
  }

  // ==================================================
  // UPDATE TEXT
  // ==================================================

  function updateText(
    index,
    value
  ) {
    setBlocks(
      (current) => {
        const next =
          [...current];

        next[index] = {
          ...next[index],

          content: {
            ...(next[index]
              .content || {}),
            text: value
          }
        };

        return next;
      }
    );
  }

  // ==================================================
  // UPDATE MEDIA ID
  // ==================================================

  function updateMediaId(
    index,
    value
  ) {
    setBlocks(
      (current) => {
        const next =
          [...current];

        next[index] = {
          ...next[index],

          mediaId:
            value.trim() ||
            null
        };

        return next;
      }
    );
  }
  // ==================================================
// REMOVE MEDIA FROM BLOCK
// ==================================================

function removeMedia(index) {

  setBlocks((current) => {

    const next = [...current];

    next[index] = {
      ...next[index],

      mediaId: null,

      media: null
    };

    return next;

  });

  setMessage("");
  setError("");
}
  // ==================================================
// SELECT MEDIA FROM MEDIA PICKER
// ==================================================

async function handleMediaSelected(
  index,
  media
) {
  try {
    setError("");
    setMessage("");

    if (!media) {
      return;
    }

    // ------------------------------------------------
    // Existing database media
    // ------------------------------------------------

    if (media.id) {
      setBlocks((current) => {
        const next = [...current];

        next[index] = {
          ...next[index],

          mediaId: media.id,

          media: media
        };

        return next;
      });

      setMediaPickerIndex(null);

      return;
    }

    // ------------------------------------------------
    // CloudFront media
    //
    // CloudFront library gives us a URL/key,
    // but not yet a mediaAsset ID.
    //
    // Register it in mediaAsset first.
    // ------------------------------------------------

    const response =
  await api.post(
    "/media",
    {
      type:
        media.type ||
        "IMAGE",

      provider:
        media.provider ||
        "CLOUDFRONT",

      url:
        media.url,

      externalId:
        media.externalId ||
        null,

      filename:
        media.filename ||
        null,

      mimeType:
        media.mimeType ||
        null,

      altText:
        media.altText ||
        null,

      caption:
        media.caption ||
        null,

      credit:
        media.credit ||
        null,

      width:
        media.width ??
        null,

      height:
        media.height ??
        null,

      duration:
        media.duration ??
        null
    }
  );

    const createdMedia =
      response.data?.media;

    if (!createdMedia?.id) {
      throw new Error(
        "Media asset was not created."
      );
    }

    // ------------------------------------------------
    // Attach mediaAsset to block
    // ------------------------------------------------

    setBlocks((current) => {
      const next = [...current];

      next[index] = {
        ...next[index],

        mediaId:
          createdMedia.id,

        media:
          createdMedia
      };

      return next;
    });

    setMediaPickerIndex(null);

    setMessage(
      "Media added to article."
    );

  } catch (err) {
    console.error(
      "Select media error:",
      err
    );

    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to add media."
    );
  }
}

  // ==================================================
  // DELETE BLOCK
  // ==================================================

  function deleteBlock(index) {
    setBlocks(
      (current) =>
        current.filter(
          (_, blockIndex) =>
            blockIndex !== index
        )
    );
  }

  // ==================================================
  // MOVE BLOCK
  // ==================================================

  function moveBlock(
    index,
    direction
  ) {
    setBlocks(
      (current) => {
        const next =
          [...current];

        const newIndex =
          index + direction;

        if (
          newIndex < 0 ||
          newIndex >=
            next.length
        ) {
          return current;
        }

        [
          next[index],
          next[newIndex]
        ] = [
          next[newIndex],
          next[index]
        ];

        return next;
      }
    );
  }

  // ==================================================
  // DRAG START
  // ==================================================

  function handleDragStart(
    index,
    event
  ) {
    setDraggedIndex(index);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(index)
    );
  }

  // ==================================================
  // DRAG OVER
  // ==================================================

  function handleDragOver(
    index,
    event
  ) {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setDragOverIndex(index);
  }

  // ==================================================
  // DROP
  // ==================================================

  function handleDrop(
    index,
    event
  ) {
    event.preventDefault();

    if (
      draggedIndex === null ||
      draggedIndex === index
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setBlocks(
      (current) => {
        const next =
          [...current];

        const [
          movedBlock
        ] =
          next.splice(
            draggedIndex,
            1
          );

        next.splice(
          index,
          0,
          movedBlock
        );

        return next;
      }
    );

    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  // ==================================================
  // DRAG END
  // ==================================================

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  // ==================================================
  // WORD COUNT
  // ==================================================

  const wordCount =
    useMemo(() => {
      return blocks.reduce(
        (
          total,
          block
        ) => {
          if (
            (block.type !== "TEXT" &&
              block.type !== "HEADING" &&
              block.type !== "QUOTE") ||
            isFootnoteBlock(block)
          ) {
            return total;
          }

          const text =
            block.content
              ?.text || "";

          const words =
            String(text)
              .replace(
                /<[^>]*>/g,
                " "
              )
              .trim()
              .split(/\s+/)
              .filter(Boolean);

          return (
            total +
            words.length
          );
        },
        0
      );
    }, [blocks]);

  // ==================================================
  // SAVE NEW ARTICLE
  // ==================================================

  async function createDraft() {
    const payload = {
      title:
        title.trim(),

      slug:
        slug.trim(),

      excerpt:
        excerpt.trim(),

      blocks:
        blocks.map(
          (
            block,
            index
          ) => ({
            type:
              block.type,

            position:
              index,

            content:
              block.content ||
              {},

            mediaId:
              block.mediaId ||
              null
          })
        )
    };

    return api.post(
      "/articles",
      payload
    );
  }

  // ==================================================
  // SAVE
  // ==================================================

 // ==================================================
// SAVE ARTICLE
// ==================================================
// ==================================================
// NAVIGATION / DISCARD CHANGES
// ==================================================

function resetToOriginal() {
  if (!originalSnapshot) return;

  const snapshot = cloneValue(originalSnapshot);
  setTitle(snapshot.title);
  setSlug(snapshot.slug);
  setExcerpt(snapshot.excerpt);
  setBlocks(snapshot.blocks);
  setLayoutTemplate(snapshot.layoutTemplate);
  setThemeId(snapshot.themeId);
  setMediaPickerIndex(null);
  setPreviewOpen(false);
  setShowFeeder(false);
  setMessage("Changes discarded.");
  setError("");
}

function handleDiscardChanges() {
  if (!hasUnsavedChanges) return;

  const confirmed = window.confirm(
    "Discard all unsaved changes to this article? This cannot be undone."
  );

  if (confirmed) {
    resetToOriginal();
  }
}

function handleBack() {
  if (hasUnsavedChanges) {
    const confirmed = window.confirm(
      "You have unsaved changes. Leave without saving?"
    );
    if (!confirmed) return;
  }

  navigate(-1);
}

// ==================================================
// INSERT LAYOUT TEMPLATE
// ==================================================

function applyTemplateSelection(templateId) {
  setLayoutTemplate(templateId);

  if (blocks.length === 0) {
    setBlocks(
      buildTemplateBlocks(
        templateId,
        title
      ).map((block) => ({
        ...block,
        content: {
          ...(block.content || {}),
          editorialLayout: {
            ...(block.content?.editorialLayout || {}),
            template: templateId,
            theme: themeId
          }
        }
      }))
    );
  } else {
    setBlocks((current) =>
      applyTemplateToBlocks(
        current,
        templateId,
        themeId
      )
    );
  }

  setMessage(
    `${EDITORIAL_TEMPLATES[templateId]?.name || "Editorial template"} selected.`
  );
  setError("");
}

function handleThemeChange(nextThemeId) {
  setThemeId(nextThemeId);

  setBlocks((current) =>
    applyEditorialMetadata(
      current,
      layoutTemplate,
      nextThemeId
    )
  );

  setMessage(
    `${EDITORIAL_THEMES[nextThemeId]?.name || "Editorial theme"} selected.`
  );
  setError("");
}

async function saveDraft() {
  setMessage("");
  setError("");

  if (!title.trim()) {
    setError(
      "Article title is required."
    );
    return;
  }

  if (!slug.trim()) {
    setError(
      "Article slug is required."
    );
    return;
  }

  if (blocks.length === 0) {
    setError(
      "Add at least one content block."
    );
    return;
  }

  try {
    setSaving(true);

    // ==================================================
    // PREPARE BLOCKS
    // ==================================================

    const preparedBlocks =
      blocks.map(
        (block, index) => ({
          type: block.type,

          position: index,

          content:
            block.content || {},

          mediaId:
            block.mediaId || null
        })
      );

    // ==================================================
    // UPDATE EXISTING ARTICLE
    // ==================================================

    if (isEditing) {
      const response =
        await api.put(
          `/articles/manage/${articleId}`,
          {
            title:
              title.trim(),

            slug:
              slug.trim(),

            excerpt:
              excerpt.trim(),

            blocks:
              preparedBlocks
          }
        );

      const updatedArticle =
        response.data?.article;

      // Update the local block IDs returned
      // by the database.

      if (
        updatedArticle &&
        Array.isArray(
          updatedArticle.blocks
        )
      ) {
        const nextBlocks = updatedArticle.blocks.map(
          (block) => ({
            ...block,
            clientId: block.id,
            content: block.content || {},
            mediaId: block.mediaId || null
          })
        );

        setBlocks(nextBlocks);

        setOriginalSnapshot(
          makeSnapshot({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            blocks: nextBlocks,
            layoutTemplate,
            themeId
          })
        );
      } else {
        setOriginalSnapshot(getCurrentSnapshot());
      }

      setMessage(
        response.data?.message ||
        "Article updated successfully."
      );

      return;
    }

    // ==================================================
    // CREATE NEW ARTICLE
    // ==================================================

    const response =
      await api.post(
        "/articles",
        {
          title:
            title.trim(),

          slug:
            slug.trim(),

          excerpt:
            excerpt.trim(),

          blocks:
            preparedBlocks
        }
      );

    const createdArticle =
      response.data?.article;

    setMessage(
      response.data?.message ||
      "Draft saved successfully."
    );

    // Move the newly created article
    // into edit mode.

    if (
      createdArticle?.id
    ) {
      navigate(
        `/editorial/new?articleId=${createdArticle.id}`,
        {
          replace: true
        }
      );
    }

  } catch (err) {
    console.error(
      "Save article error:",
      err
    );

    setError(
      err.response?.data?.message ||
      "Unable to save article."
    );
  } finally {
    setSaving(false);
  }
}

  // ==================================================
  // BLOCK LABEL
  // ==================================================

  function getBlockLabel(
    type,
    block = null
  ) {
    if (isFootnoteBlock(block)) {
      return "FOOTNOTE";
    }

    switch (type) {
      case "TEXT":
        return "PARAGRAPH";

      case "HEADING":
        return "HEADING";

      case "QUOTE":
        return "QUOTE";

      case "IMAGE":
        return "IMAGE";

      case "VIDEO":
        return "VIDEO";

      case "AUDIO":
        return "AUDIO";

      default:
        return type;
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loadingArticle) {
    return (
      <main className="impilo-editorial-workspace">

        <section className="impilo-empty-editorial">

          <h2>
            Loading article...
          </h2>

          <p>
            Retrieving the draft
            from the editorial system.
          </p>

        </section>

      </main>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="impilo-editorial-workspace">

      {/* HEADER */}

      <header className="impilo-editorial-header">

        <div>

          <span className="impilo-editorial-kicker">
            IMPILO EDITORIAL CMS
          </span>

          <h1>
            {isEditing
              ? "Edit Article"
              : "New Article"}
          </h1>

          <p>
            Build and arrange the
            visual story before
            sending it for editorial
            review.
          </p>

        </div>

        <div className="impilo-editorial-actions">

          <button
            type="button"
            onClick={handleBack}
            className="impilo-editorial-secondary-action"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleDiscardChanges}
            disabled={!hasUnsavedChanges || saving}
            className="impilo-editorial-discard-action"
          >
            Discard Changes
          </button>

          <div className="impilo-word-count">
            {wordCount} / 700 words
          </div>

          {hasUnsavedChanges && (
            <span className="impilo-unsaved-indicator">UNSAVED</span>
          )}

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="impilo-preview-article-header-button"
          >
            Preview Article
          </button>

          <button
            type="button"
            onClick={
              saveDraft
            }
            disabled={saving}
            className="impilo-save-draft"
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Save Draft"}
          </button>

        </div>

      </header>

      {/* STATUS */}

      {message && (
        <div className="impilo-editorial-success">
          {message}
        </div>
      )}

      {error && (
        <div className="impilo-editorial-error">
          {error}
        </div>
      )}

      {/* ARTICLE DETAILS */}

      <section className="impilo-article-details">

        <div className="impilo-form-field">

          <label>
            Article Title
          </label>

          <input
            type="text"
            value={title}
            onChange={
              handleTitleChange
            }
            placeholder="Enter article title"
          />

        </div>

        <div className="impilo-form-field">

          <label>
            Slug
          </label>

          <input
            type="text"
            value={slug}
            onChange={(event) =>
              setSlug(
                event.target.value
              )
            }
            placeholder="article-slug"
          />

        </div>

        <div className="impilo-form-field impilo-form-full">

          <label>
            Excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(event) =>
              setExcerpt(
                event.target.value
              )
            }
            placeholder="Short description of the article"
            rows={3}
          />

        </div>

      </section>

      {showFeeder && !isEditing && (
        <ArticleFeeder
          onCancel={() => setShowFeeder(false)}
          onApply={(generatedBlocks) => {
            setBlocks(
              applyTemplateToBlocks(
                generatedBlocks,
                layoutTemplate,
                themeId
              )
            );
            setShowFeeder(false);
            setMessage(
              "Article generated. Review the structure before saving."
            );
            setError("");
          }}
        />
      )}

      {/* BUILDER */}

      <section className="impilo-builder">

        {/* TOOLS */}

        <aside className="impilo-builder-tools">

          <h2>
            Add Content
          </h2>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setShowFeeder(true)}
              style={{
                width: "100%",
                marginBottom: "12px",
                padding: "14px",
                textAlign: "left",
                borderRadius: "10px",
                border: "1px solid rgba(212,175,55,.45)",
                background: "rgba(212,175,55,.08)",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              <strong style={{ display: "block", color: "#d4af37" }}>
                ✦ Feed Article
              </strong>
              <small style={{ opacity: 0.7 }}>
                Paste raw text and build the article automatically.
              </small>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              addBlock("TEXT")
            }
          >
            ＋ Paragraph
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("HEADING")
            }
          >
            ＋ Heading
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("QUOTE")
            }
          >
            ＋ Quote
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("IMAGE")
            }
          >
            ＋ Image
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("VIDEO")
            }
          >
            ＋ Video
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("AUDIO")
            }
          >
            ＋ Audio
          </button>

          <button
            type="button"
            onClick={() =>
              addBlock("FOOTNOTE")
            }
            className="impilo-footnote-tool-button"
          >
            ＋ Footnote / Reference
          </button>

          <p className="impilo-footnote-tool-note">
            Footnotes are stored as editorial reference text, so no database enum or migration is required.
          </p>

          <div className="impilo-tool-divider" />

          <div className="impilo-design-panel">
            <div className="impilo-design-panel-heading">
              <span>EDITORIAL DESIGN</span>
              <h2>Magazine Layout</h2>
            </div>

            <p className="impilo-design-panel-copy">
              Choose a structured IMPILO composition. The content blocks remain editable,
              while the template controls the magazine rhythm, columns and visual hierarchy.
            </p>

            <div className="impilo-template-list impilo-template-grid">
              {Object.values(EDITORIAL_TEMPLATES).map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={
                    layoutTemplate === template.id
                      ? "is-selected"
                      : ""
                  }
                  onClick={() =>
                    applyTemplateSelection(template.id)
                  }
                >
                  <span className="impilo-template-number">
                    {String(
                      Object.keys(EDITORIAL_TEMPLATES).indexOf(template.id) + 1
                    ).padStart(2, "0")}
                  </span>
                  <strong>{template.name}</strong>
                  <small>{template.description}</small>
                </button>
              ))}
            </div>

            <div className="impilo-theme-panel">
              <div className="impilo-theme-panel-heading">
                <span>PAGE THEME</span>
                <strong>{EDITORIAL_THEMES[themeId]?.name || "Neutral"}</strong>
              </div>

              <div className="impilo-theme-grid">
                {Object.values(EDITORIAL_THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    title={theme.description}
                    aria-label={`Use ${theme.name} theme`}
                    className={
                      themeId === theme.id
                        ? "is-selected"
                        : ""
                    }
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    <span
                      className="impilo-theme-swatch"
                      style={{
                        background: `linear-gradient(135deg, ${theme.surface}, ${theme.accentStrong})`
                      }}
                    />
                    <span>{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </aside>

        {/* CANVAS */}

        <section className="impilo-editorial-canvas">

          <div className="impilo-canvas-top">

            <div>

              <span>
                ARTICLE CANVAS
              </span>

              <h2>
                {title ||
                  "Untitled Article"}
              </h2>

            </div>

            <span>
              {blocks.length} blocks
            </span>

          </div>

          <div className="impilo-editorial-preview-launcher">

            <div>
              <span className="impilo-editorial-preview-launcher-kicker">LIVE ARTICLE PREVIEW</span>
              <strong>Review the article as an IMPILO editorial story</strong>
              <small>Opens the selected layout in a focused preview without taking space from the block editor.</small>
            </div>

            <button
              type="button"
              className="impilo-editorial-preview-button"
              onClick={() => setPreviewOpen(true)}
            >
              Preview Article
            </button>

          </div>

          {blocks.length === 0 ? (

            <div className="impilo-empty-editorial">

              <div className="impilo-empty-icon">
                ✦
              </div>

              <h2>
                Start your story
              </h2>

              <p>
                Choose a magazine layout or add content from
                the panel on the left.
              </p>

            </div>

          ) : (

            <div className="impilo-block-stack">

              {blocks.map(
                (
                  block,
                  index
                ) => {

                  const dragging =
                    draggedIndex ===
                    index;

                  const dropTarget =
                    dragOverIndex ===
                    index;

                  return (
                    <article
                      key={
                        block.clientId ||
                        block.id
                      }
                      draggable={true}
                      onDragStart={(event) =>
                        handleDragStart(
                          index,
                          event
                        )
                      }
                      onDragOver={(event) =>
                        handleDragOver(
                          index,
                          event
                        )
                      }
                      onDrop={(event) =>
                        handleDrop(
                          index,
                          event
                        )
                      }
                      onDragEnd={handleDragEnd}
                      className={[
                        "impilo-content-block",
                        dragging
                          ? "is-dragging"
                          : "",
                        dropTarget
                          ? "is-drop-target"
                          : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >

                      <div className="impilo-block-number">
                        {index + 1}
                      </div>

                      <div className="impilo-drag-handle">
                        ⋮⋮
                      </div>

                      <div className="impilo-block-content">

                        <div className="impilo-block-header">

                          <strong>
                            {getBlockLabel(block.type, block)}
                          </strong>

                          <div className="impilo-block-header-actions">
                            <label className="impilo-block-type-control">
                              <span>Type</span>
                              <select
                                value={isFootnoteBlock(block) ? "FOOTNOTE" : block.type}
                                onChange={(event) => changeBlockType(index, event.target.value)}
                                aria-label="Change block type"
                              >
                                {BLOCK_TYPE_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <button
                              type="button"
                              onClick={() => moveBlock(index, -1)}
                              disabled={index === 0}
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              onClick={() => moveBlock(index, 1)}
                              disabled={index === blocks.length - 1}
                            >
                              ↓
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteBlock(index)}
                              title="Delete block"
                            >
                              Delete
                            </button>
                          </div>

                        </div>


                        {(block.type ===
                          "TEXT" ||
                          block.type ===
                            "HEADING" ||
                          block.type ===
                            "QUOTE") && (

                          <>
                            <textarea
                              value={
                                block.content
                                  ?.text ||
                                ""
                              }
                              onChange={(event) =>
                                updateText(
                                  index,
                                  event.target.value
                                )
                              }
                              placeholder={
                                isFootnoteBlock(block)
                                  ? "Enter reference or footnote..."
                                  : block.type === "HEADING"
                                    ? "Enter heading..."
                                    : block.type === "QUOTE"
                                      ? "Enter editorial quote..."
                                      : "Write your content..."
                              }
                              rows={
                                block.type === "HEADING"
                                  ? 2
                                  : isFootnoteBlock(block)
                                    ? 5
                                    : 7
                              }
                              className="impilo-block-textarea"
                            />

                            {isFootnoteBlock(block) && (
                              <div className="impilo-footnote-fields">
                                <label>
                                  Source / Reference
                                  <input
                                    type="text"
                                    value={block.content?.source || ""}
                                    onChange={(event) =>
                                      setBlocks((current) => {
                                        const next = [...current];
                                        next[index] = {
                                          ...next[index],
                                          content: {
                                            ...(next[index].content || {}),
                                            source: event.target.value
                                          }
                                        };
                                        return next;
                                      })
                                    }
                                    placeholder="Author, publication, document or reference"
                                  />
                                </label>

                                <label>
                                  Reference URL (optional)
                                  <input
                                    type="url"
                                    value={block.content?.url || ""}
                                    onChange={(event) =>
                                      setBlocks((current) => {
                                        const next = [...current];
                                        next[index] = {
                                          ...next[index],
                                          content: {
                                            ...(next[index].content || {}),
                                            url: event.target.value
                                          }
                                        };
                                        return next;
                                      })
                                    }
                                    placeholder="https://..."
                                  />
                                </label>
                              </div>
                            )}
                          </>

                        )}
{(block.type ===
  "IMAGE" ||
  block.type ===
    "VIDEO" ||
  block.type ===
    "AUDIO") && (

  <div className="impilo-media-block">

    {/* ==============================================
        SELECTED MEDIA
    ============================================== */}

    {block.media ? (

      <div className="impilo-selected-media">

        {block.type === "IMAGE" && (
          <img
            src={block.media.url}
            alt={
              block.media.altText ||
              block.media.caption ||
              "Selected IMPILO media"
            }
            className="impilo-selected-media-image"
          />
        )}

        {block.type === "VIDEO" && (
          <video
            src={block.media.url}
            controls
            className="impilo-selected-media-video"
          />
        )}

        {block.type === "AUDIO" && (
          <audio
            src={block.media.url}
            controls
            className="impilo-selected-media-audio"
          />
        )}

        <div className="impilo-selected-media-info">

          <strong>
            {block.media.caption ||
              block.media.filename ||
              "Selected media"}
          </strong>

          <small>
            {block.media.provider}
          </small>

        </div>

      </div>

    ) : (

      /* ==============================================
         EMPTY MEDIA BLOCK
      ============================================== */

      <div className="impilo-media-placeholder">

        <strong>
          {getBlockLabel(
            block.type
          )}
        </strong>

        <p>
          No media selected.
        </p>

      </div>

    )}


    {/* ==============================================
        MEDIA PICKER BUTTON
    ============================================== */}

   {block.media ? (

  <MediaControls
    media={block.media}

    onChangeMedia={() =>
      setMediaPickerIndex(index)
    }

    onEditDetails={() =>
      setMediaPickerIndex(index)
    }

    onRemove={() =>
      removeMedia(index)
    }
  />

) : (

  <button
    type="button"
    className="impilo-select-media-button"
    onClick={() =>
      setMediaPickerIndex(index)
    }
  >
    {`Select ${getBlockLabel(
      block.type
    )}`}
  </button>

)}


    {/* ==============================================
        MEDIA ID — TEMPORARILY VISIBLE FOR DEBUGGING
    ============================================== */}

    {block.mediaId && (
      <small className="impilo-media-id">
        Media ID: {block.mediaId}
      </small>
    )}


    {/* ==============================================
        MEDIA PICKER
    ============================================== */}

    {mediaPickerIndex === index && (

      <div className="impilo-media-picker-container">

        <MediaPicker
          type={block.type}
          selectedMediaId={
            block.mediaId || null
          }

          onSelect={(media) =>
            handleMediaSelected(
              index,
              media
            )
          }

          onClose={() =>
            setMediaPickerIndex(null)
          }
        />

      </div>

    )}

  </div>
)}

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </section>

      <EditorialArticlePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        excerpt={excerpt}
        blocks={blocks}
        templateId={layoutTemplate}
        themeId={themeId}
      />

    </main>
  );
}