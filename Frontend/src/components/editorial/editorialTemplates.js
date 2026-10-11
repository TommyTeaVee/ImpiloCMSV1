// ============================================================
// IMPILO EDITORIAL TEMPLATE SYSTEM
// ============================================================
// These definitions are intentionally presentation-oriented.
// The existing ArticleBlock content JSON is used to persist the
// layout metadata without requiring a database schema migration.
// ============================================================

export const EDITORIAL_TEMPLATES = {
  EDITORIAL_FEATURE: {
    id: "EDITORIAL_FEATURE",
    name: "Editorial Feature",
    shortName: "Feature",
    description: "Hero-led feature with editorial columns and a pull quote.",
    eyebrow: "IMPILO EDITORIAL",
    accent: "SIGNATURE",
  },
  PROFILE: {
    id: "PROFILE",
    name: "Profile / Model",
    shortName: "Profile",
    description: "Portrait-led profile with biography columns and quote treatment.",
    eyebrow: "PROFILE / EDITORIAL",
    accent: "SIGNATURE",
  },
  BRAND_POWER: {
    id: "BRAND_POWER",
    name: "Brand Power",
    shortName: "Brand Power",
    description: "Thought-leadership layout with insight panels and media.",
    eyebrow: "BRAND POWER",
    accent: "GOLD",
  },
  EDUCATIONAL: {
    id: "EDUCATIONAL",
    name: "Educational / Essay",
    shortName: "Educational",
    description: "Structured editorial essay with sections, columns and key ideas.",
    eyebrow: "IMPILO INSIGHT",
    accent: "BLUE",
  },
  MEDIA_FEATURE: {
    id: "MEDIA_FEATURE",
    name: "Media Feature",
    shortName: "Media",
    description: "Mixed-media story built around video, image and editorial text.",
    eyebrow: "IMPILO MEDIA",
    accent: "RED",
  },
  PORTFOLIO: {
    id: "PORTFOLIO",
    name: "Visual Portfolio",
    shortName: "Portfolio",
    description: "Image-forward composition for models, photographers and visual work.",
    eyebrow: "VISUAL PORTFOLIO",
    accent: "PURPLE",
  },
};

export const EDITORIAL_THEMES = {
  NEUTRAL: {
    id: "NEUTRAL",
    name: "Neutral",
    description: "White editorial page with restrained gold accents.",
    accent: "#a58216",
    accentStrong: "#d4af37",
    surface: "#f7f3ee",
    soft: "#f1eee8",
    ink: "#161616",
    muted: "#666666",
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
    muted: "#675d44",
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
    muted: "#5f5f5f",
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
    muted: "#6d5858",
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
    muted: "#5c6875",
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
    muted: "#5b7268",
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
    muted: "#6b5c70",
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
    muted: "#657044",
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
    muted: "#61676d",
  },
};

const templateBlueprints = {
  EDITORIAL_FEATURE: [
    ["TEXT", "eyebrow", "IMPILO EDITORIAL"],
    ["HEADING", "title", ""],
    ["TEXT", "deck", ""],
    ["IMAGE", "hero", ""],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["QUOTE", "pull-quote", ""],
    ["HEADING", "section-heading", ""],
    ["TEXT", "body-left", ""],
    ["TEXT", "body-right", ""],
    ["IMAGE", "inline-image", ""],
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
    ["IMAGE", "portrait-small", ""],
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
    ["TEXT", "callout", ""],
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
    ["TEXT", "body-full", ""],
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
    ["TEXT", "body-full", ""],
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
    ["IMAGE", "gallery-6", ""],
  ],
};

function newId() {
  return crypto.randomUUID();
}

function block(type, role, text = "", extra = {}) {
  return {
    clientId: newId(),
    type,
    content: {
      text,
      editorialLayout: {
        role,
        ...extra,
      },
    },
    mediaId: null,
  };
}

export function buildTemplateBlocks(templateId, articleTitle = "") {
  const blueprint = templateBlueprints[templateId] || templateBlueprints.EDITORIAL_FEATURE;

  return blueprint.map(([type, role, seed]) => {
    let text = seed;

    if (role === "title") {
      text = articleTitle || "";
    }

    return block(type, role, text, {
      template: templateId,
    });
  });
}

export function applyEditorialMetadata(blocks, templateId, themeId) {
  return blocks.map((item) => ({
    ...item,
    content: {
      ...(item.content || {}),
      editorialLayout: {
        ...(item.content?.editorialLayout || {}),
        template: templateId,
        theme: themeId,
      },
    },
  }));
}

export function applyTemplateToBlocks(blocks, templateId, themeId) {
  const blueprint =
    templateBlueprints[templateId] ||
    templateBlueprints.EDITORIAL_FEATURE;

  const remainingRoles = blueprint.map((item) => item[1]);
  const usedRoles = new Set();

  return blocks.map((item, index) => {
    const compatibleIndex = remainingRoles.findIndex((role) => {
      if (usedRoles.has(role)) return false;

      const blueprintItem = blueprint.find((entry) => entry[1] === role);
      return blueprintItem && blueprintItem[0] === item.type;
    });

    let role =
      compatibleIndex >= 0
        ? remainingRoles[compatibleIndex]
        : null;

    if (!role) {
      if (item.type === "HEADING") {
        role = index === 0 ? "title" : "section-heading";
      } else if (item.type === "QUOTE") {
        role = "pull-quote";
      } else if (item.type === "IMAGE" || item.type === "VIDEO") {
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
          role,
        },
      },
    };
  });
}

export function detectEditorialMetadata(blocks = []) {
  for (const item of blocks) {
    const metadata = item?.content?.editorialLayout;
    if (metadata?.template || metadata?.theme) {
      return {
        templateId: metadata.template || "EDITORIAL_FEATURE",
        themeId: metadata.theme || "NEUTRAL",
      };
    }
  }

  return {
    templateId: "EDITORIAL_FEATURE",
    themeId: "NEUTRAL",
  };
}