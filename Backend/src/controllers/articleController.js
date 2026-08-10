const prisma = require("../lib/prisma");

const MIN_WORDS = 700;

const MEDIA_BLOCK_TYPES = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO"
};


// ==================================================
// WORD COUNT
// ==================================================

function countWords(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function calculateWordCount(blocks = []) {
  return blocks.reduce((total, block) => {
    if (!block || !block.content) {
      return total;
    }

    if (
      block.type === "TEXT" ||
      block.type === "HEADING" ||
      block.type === "QUOTE"
    ) {
      return total + countWords(block.content.text || "");
    }

    return total;
  }, 0);
}


// ==================================================
// MEDIA VALIDATION
// ==================================================

async function validateMediaBlock(block) {
  if (!block.mediaId) {
    throw new Error(
      `${block.type} block requires mediaId`
    );
  }

  const media = await prisma.mediaAsset.findUnique({
    where: {
      id: block.mediaId
    }
  });

  if (!media) {
    throw new Error(
      `Media asset ${block.mediaId} not found`
    );
  }

  if (
    block.type === MEDIA_BLOCK_TYPES.IMAGE &&
    media.type !== "IMAGE"
  ) {
    throw new Error(
      "IMAGE block requires IMAGE media"
    );
  }

  if (
    block.type === MEDIA_BLOCK_TYPES.VIDEO &&
    media.type !== "VIDEO"
  ) {
    throw new Error(
      "VIDEO block requires VIDEO media"
    );
  }

  if (
    block.type === MEDIA_BLOCK_TYPES.AUDIO &&
    media.type !== "AUDIO"
  ) {
    throw new Error(
      "AUDIO block requires AUDIO media"
    );
  }

  return media;
}

async function validateBlocks(blocks = []) {
  for (const block of blocks) {
    if (!block.type) {
      throw new Error(
        "Every article block requires a type"
      );
    }

    if (
      block.type === "IMAGE" ||
      block.type === "VIDEO" ||
      block.type === "AUDIO"
    ) {
      await validateMediaBlock(block);
    }
  }
}


// ==================================================
// PUBLIC: GET PUBLISHED ARTICLES
// ==================================================

async function getPublishedArticles(req, res) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED"
      },

      orderBy: {
        publishedAt: "desc"
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },

        blocks: {
          orderBy: {
            position: "asc"
          },

          include: {
            media: true
          }
        },

        categories: {
          include: {
            category: true
          }
        },

        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return res.json({
      articles
    });

  } catch (error) {
    console.error(
      "Get published articles error:",
      error
    );

    return res.status(500).json({
      message: "Unable to retrieve published articles"
    });
  }
}


// ==================================================
// PUBLIC: GET ONE PUBLISHED ARTICLE
// ==================================================

async function getPublishedArticle(req, res) {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findFirst({
      where: {
        slug,
        status: "PUBLISHED"
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },

        blocks: {
          orderBy: {
            position: "asc"
          },

          include: {
            media: true
          }
        },

        categories: {
          include: {
            category: true
          }
        },

        tags: {
          include: {
            tag: true
          }
        },

        quiz: {
          include: {
            questions: {
              orderBy: {
                position: "asc"
              },

              include: {
                options: {
                  orderBy: {
                    position: "asc"
                  },

                  select: {
                    id: true,
                    text: true,
                    position: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Published article not found"
      });
    }

    return res.json({
      article
    });

  } catch (error) {
    console.error(
      "Get published article error:",
      error
    );

    return res.status(500).json({
      message: "Unable to retrieve article"
    });
  }
}


// ==================================================
// CMS: CREATE ARTICLE
// ==================================================

async function createArticle(req, res) {
  try {
    const {
      title,
      slug,
      excerpt,
      blocks
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({
        message: "Title and slug are required"
      });
    }

    const existing = await prisma.article.findUnique({
      where: {
        slug
      }
    });

    if (existing) {
      return res.status(409).json({
        message: "An article with this slug already exists"
      });
    }

    const safeBlocks = Array.isArray(blocks)
      ? blocks
      : [];

    await validateBlocks(safeBlocks);

    const wordCount =
      calculateWordCount(safeBlocks);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        wordCount,
        authorId: req.user.id,

        blocks: {
          create: safeBlocks.map((block, index) => ({
            type: block.type,
            position: index,
            content: block.content || {},
            mediaId: block.mediaId || null
          }))
        }
      },

      include: {
        blocks: {
          orderBy: {
            position: "asc"
          },

          include: {
            media: true
          }
        },

        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    return res.status(201).json({
      message: "Article created",
      article
    });

  } catch (error) {
    console.error(
      "Create article error:",
      error
    );

    return res.status(400).json({
      message: error.message || "Unable to create article"
    });
  }
}


// ==================================================
// CMS: GET ALL ARTICLES
// ==================================================

async function getArticles(req, res) {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        updatedAt: "desc"
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    return res.json({
      articles
    });

  } catch (error) {
    console.error(
      "Get articles error:",
      error
    );

    return res.status(500).json({
      message: "Unable to retrieve articles"
    });
  }
}


// ==================================================
// CMS: GET SINGLE ARTICLE
// ==================================================

async function getArticle(req, res) {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: {
        id
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },

        approvedBy: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },

        publishedBy: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },

        blocks: {
          orderBy: {
            position: "asc"
          },

          include: {
            media: true
          }
        },

        categories: {
          include: {
            category: true
          }
        },

        tags: {
          include: {
            tag: true
          }
        },

        quiz: {
          include: {
            questions: {
              orderBy: {
                position: "asc"
              },

              include: {
                options: {
                  orderBy: {
                    position: "asc"
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    return res.json({
      article
    });

  } catch (error) {
    console.error(
      "Get article error:",
      error
    );

    return res.status(500).json({
      message: "Unable to retrieve article"
    });
  }
}


// ==================================================
// CMS: UPDATE ARTICLE
// ==================================================

async function updateArticle(req, res) {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      excerpt,
      blocks
    } = req.body;

    const existing = await prisma.article.findUnique({
      where: {
        id
      },

      include: {
        blocks: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });

    if (!existing) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    if (
      req.user.role === "WRITER" &&
      existing.authorId !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only edit your own articles"
      });
    }

    const data = {};

    if (title !== undefined) {
      data.title = title;
    }

    if (excerpt !== undefined) {
      data.excerpt = excerpt;
    }

    if (slug !== undefined) {
      data.slug = slug;
    }

    /*
     * Only replace blocks when blocks are supplied.
     *
     * Otherwise calculate the word count from
     * the existing stored blocks.
     */
    if (Array.isArray(blocks)) {
      await validateBlocks(blocks);

      const wordCount =
        calculateWordCount(blocks);

      data.wordCount = wordCount;

      await prisma.articleBlock.deleteMany({
        where: {
          articleId: id
        }
      });

      data.blocks = {
        create: blocks.map((block, index) => ({
          type: block.type,
          position: index,
          content: block.content || {},
          mediaId: block.mediaId || null
        }))
      };

    } else {
      data.wordCount =
        calculateWordCount(existing.blocks);
    }

    const article = await prisma.article.update({
      where: {
        id
      },

      data,

      include: {
        blocks: {
          orderBy: {
            position: "asc"
          },

          include: {
            media: true
          }
        }
      }
    });

    return res.json({
      message: "Article updated",
      article
    });

  } catch (error) {
    console.error(
      "Update article error:",
      error
    );

    return res.status(400).json({
      message: error.message || "Unable to update article"
    });
  }
}


// ==================================================
// SUBMIT ARTICLE
// ==================================================

async function submitArticle(req, res) {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: {
        id
      },

      include: {
        blocks: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    if (
      req.user.role === "WRITER" &&
      article.authorId !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only submit your own articles"
      });
    }

    const wordCount =
      calculateWordCount(article.blocks);

    if (article.wordCount !== wordCount) {
      await prisma.article.update({
        where: {
          id
        },

        data: {
          wordCount
        }
      });

      article.wordCount = wordCount;
    }

    if (article.wordCount < MIN_WORDS) {
      return res.status(400).json({
        message:
          `Article must contain at least ${MIN_WORDS} words before submission`,
        wordCount: article.wordCount,
        minimumWords: MIN_WORDS
      });
    }

    if (
      article.status !== "DRAFT" &&
      article.status !== "ARCHIVED"
    ) {
      return res.status(400).json({
        message:
          "Only draft articles can be submitted for review"
      });
    }

    const updated = await prisma.article.update({
      where: {
        id
      },

      data: {
        status: "IN_REVIEW"
      }
    });

    return res.json({
      message: "Article submitted for review",
      article: updated
    });

  } catch (error) {
    console.error(
      "Submit article error:",
      error
    );

    return res.status(500).json({
      message: "Unable to submit article"
    });
  }
}


// ==================================================
// APPROVE ARTICLE
// ==================================================

async function approveArticle(req, res) {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: {
        id
      },

      include: {
        blocks: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    const wordCount =
      calculateWordCount(article.blocks);

    if (article.wordCount !== wordCount) {
      await prisma.article.update({
        where: {
          id
        },

        data: {
          wordCount
        }
      });

      article.wordCount = wordCount;
    }

    if (article.wordCount < MIN_WORDS) {
      return res.status(400).json({
        message:
          `Article must contain at least ${MIN_WORDS} words`,
        wordCount: article.wordCount,
        minimumWords: MIN_WORDS
      });
    }

    if (article.status !== "IN_REVIEW") {
      return res.status(400).json({
        message:
          "Only articles in review can be approved"
      });
    }

    const updated = await prisma.article.update({
      where: {
        id
      },

      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedById: req.user.id
      },

      include: {
        approvedBy: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    });

    return res.json({
      message: "Article approved",
      article: updated
    });

  } catch (error) {
    console.error(
      "Approve article error:",
      error
    );

    return res.status(500).json({
      message: "Unable to approve article"
    });
  }
}


// ==================================================
// PUBLISH ARTICLE
// ==================================================

async function publishArticle(req, res) {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: {
        id
      },

      include: {
        blocks: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    const wordCount =
      calculateWordCount(article.blocks);

    if (article.wordCount !== wordCount) {
      await prisma.article.update({
        where: {
          id
        },

        data: {
          wordCount
        }
      });

      article.wordCount = wordCount;
    }

    if (article.wordCount < MIN_WORDS) {
      return res.status(400).json({
        message:
          `Article must contain at least ${MIN_WORDS} words`,
        wordCount: article.wordCount,
        minimumWords: MIN_WORDS
      });
    }

    if (article.status !== "APPROVED") {
      return res.status(400).json({
        message:
          "Only approved articles can be published"
      });
    }

    const updated = await prisma.article.update({
      where: {
        id
      },

      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        publishedById: req.user.id
      },

      include: {
        publishedBy: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    });

    return res.json({
      message: "Article published",
      article: updated
    });

  } catch (error) {
    console.error(
      "Publish article error:",
      error
    );

    return res.status(500).json({
      message: "Unable to publish article"
    });
  }
}


// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  getPublishedArticles,
  getPublishedArticle,
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  submitArticle,
  approveArticle,
  publishArticle
};