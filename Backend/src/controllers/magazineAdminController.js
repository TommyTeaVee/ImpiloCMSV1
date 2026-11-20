const prisma = require("../lib/prisma");

/*
 * ============================================================
 * IMPILO MAGAZINE ADMIN CONTROLLER
 * ============================================================
 *
 * Used by the Editorial / Admin CMS.
 *
 * Responsibilities:
 * - List magazine issues
 * - Get a complete issue
 * - Create an issue
 * - Update issue metadata
 * - Publish an issue
 * - Unpublish an issue
 * - Add pages
 * - Update pages
 * - Delete pages
 * - Reorder pages safely
 *
 * IMPORTANT:
 * IMPILO 101 is not migrated or recreated by this controller.
 * Existing issues are simply read from the database.
 * ============================================================
 */


/* ============================================================
   HELPERS
   ============================================================ */

function cleanString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const cleaned = String(value).trim();

  return cleaned || null;
}


function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function parseIssueNumber(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isInteger(number)) {
    return null;
  }

  return number;
}


/* ============================================================
   LIST ISSUES
   GET /api/magazine-admin
   ============================================================ */

async function getMagazineIssues(req, res) {
  try {
    const issues = await prisma.magazineIssue.findMany({
      orderBy: [
        {
          issueNumber: "desc"
        },
        {
          createdAt: "desc"
        }
      ],

      include: {
        _count: {
          select: {
            pages: true
          }
        }
      }
    });

    return res.json({
      success: true,
      issues
    });
  } catch (error) {
    console.error(
      "Get magazine issues error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load magazine issues."
    });
  }
}


/* ============================================================
   GET ONE ISSUE
   GET /api/magazine-admin/:id
   ============================================================ */

async function getMagazineIssue(req, res) {
  try {
    const { id } = req.params;

    const issue =
      await prisma.magazineIssue.findUnique({
        where: {
          id
        },

        include: {
          pages: {
            orderBy: {
              position: "asc"
            },

            include: {
              article: {
                include: {
                  author: {
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
                  }
                }
              }
            }
          }
        }
      });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Magazine issue not found."
      });
    }

    return res.json({
      success: true,
      issue
    });
  } catch (error) {
    console.error(
      "Get magazine issue error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load magazine issue."
    });
  }
}


/* ============================================================
   CREATE ISSUE
   POST /api/magazine-admin
   ============================================================ */

async function createMagazineIssue(req, res) {
  try {
    const {
      title,
      slug,
      description,
      issueNumber,
      volume,
      coverUrl
    } = req.body;

    const cleanTitle = cleanString(title);

    if (!cleanTitle) {
      return res.status(400).json({
        success: false,
        message: "Magazine title is required."
      });
    }

    let finalSlug =
      cleanString(slug) ||
      slugify(cleanTitle);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid magazine slug is required."
      });
    }

    /*
     * Make sure the slug is unique.
     *
     * We do not silently overwrite an existing issue.
     */
    const existing =
      await prisma.magazineIssue.findUnique({
        where: {
          slug: finalSlug
        }
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "A magazine issue with this slug already exists."
      });
    }

    const issue =
      await prisma.magazineIssue.create({
        data: {
          title: cleanTitle,

          slug: finalSlug,

          description:
            cleanString(description),

          issueNumber:
            parseIssueNumber(issueNumber),

          volume:
            cleanString(volume),

          coverUrl:
            cleanString(coverUrl)
        }
      });

    return res.status(201).json({
      success: true,
      message: "Magazine issue created.",
      issue
    });
  } catch (error) {
    console.error(
      "Create magazine issue error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create magazine issue."
    });
  }
}


/* ============================================================
   UPDATE ISSUE
   PUT /api/magazine-admin/:id
   ============================================================ */

async function updateMagazineIssue(req, res) {
  try {
    const { id } = req.params;

    const existing =
      await prisma.magazineIssue.findUnique({
        where: {
          id
        }
      });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Magazine issue not found."
      });
    }

    const {
      title,
      slug,
      description,
      issueNumber,
      volume,
      coverUrl
    } = req.body;

    const data = {};

    if (title !== undefined) {
      const cleanTitle =
        cleanString(title);

      if (!cleanTitle) {
        return res.status(400).json({
          success: false,
          message:
            "Magazine title cannot be empty."
        });
      }

      data.title = cleanTitle;
    }

    if (slug !== undefined) {
      const cleanSlug =
        slugify(slug);

      if (!cleanSlug) {
        return res.status(400).json({
          success: false,
          message:
            "Magazine slug cannot be empty."
        });
      }

      const slugOwner =
        await prisma.magazineIssue.findFirst({
          where: {
            slug: cleanSlug,

            NOT: {
              id
            }
          }
        });

      if (slugOwner) {
        return res.status(409).json({
          success: false,
          message:
            "Another magazine issue already uses this slug."
        });
      }

      data.slug = cleanSlug;
    }

    if (description !== undefined) {
      data.description =
        cleanString(description);
    }

    if (issueNumber !== undefined) {
      data.issueNumber =
        parseIssueNumber(issueNumber);
    }

    if (volume !== undefined) {
      data.volume =
        cleanString(volume);
    }

    if (coverUrl !== undefined) {
      data.coverUrl =
        cleanString(coverUrl);
    }

    const issue =
      await prisma.magazineIssue.update({
        where: {
          id
        },

        data
      });

    return res.json({
      success: true,
      message: "Magazine issue updated.",
      issue
    });
  } catch (error) {
    console.error(
      "Update magazine issue error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update magazine issue."
    });
  }
}


/* ============================================================
   PUBLISH ISSUE
   PATCH /api/magazine-admin/:id/publish
   ============================================================ */

async function publishMagazineIssue(req, res) {
  try {
    const { id } = req.params;

    const issue =
      await prisma.magazineIssue.findUnique({
        where: {
          id
        },

        include: {
          pages: {
            orderBy: {
              position: "asc"
            }
          }
        }
      });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Magazine issue not found."
      });
    }

    if (!issue.pages.length) {
      return res.status(400).json({
        success: false,
        message:
          "A magazine issue must contain at least one page before publishing."
      });
    }

    const published =
      await prisma.magazineIssue.update({
        where: {
          id
        },

        data: {
          publishedAt: new Date()
        }
      });

    return res.json({
      success: true,
      message: "Magazine issue published.",
      issue: published
    });
  } catch (error) {
    console.error(
      "Publish magazine issue error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to publish magazine issue."
    });
  }
}


/* ============================================================
   UNPUBLISH ISSUE
   PATCH /api/magazine-admin/:id/unpublish
   ============================================================ */

async function unpublishMagazineIssue(req, res) {
  try {
    const { id } = req.params;

    const existing =
      await prisma.magazineIssue.findUnique({
        where: {
          id
        }
      });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Magazine issue not found."
      });
    }

    const issue =
      await prisma.magazineIssue.update({
        where: {
          id
        },

        data: {
          publishedAt: null
        }
      });

    return res.json({
      success: true,
      message: "Magazine issue unpublished.",
      issue
    });
  } catch (error) {
    console.error(
      "Unpublish magazine issue error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to unpublish magazine issue."
    });
  }
}
/* ============================================================
   PREVIEW ISSUE (drafts allowed)
   GET /api/magazine-admin/issues/:id/preview
   Same response shape as the public reader route: { magazine }
   ============================================================ */

async function previewMagazineIssue(req, res) {
  try {
    const { id } = req.params;

    const magazine = await prisma.magazineIssue.findUnique({
      where: { id },

      include: {
        pages: {
          orderBy: { position: "asc" },

          include: {
            article: {
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
                  orderBy: { position: "asc" },
                  include: { media: true }
                },
                categories: { include: { category: true } },
                tags: { include: { tag: true } },
                quiz: {
                  include: {
                    questions: {
                      orderBy: { position: "asc" },
                      include: {
                        options: {
                          orderBy: { position: "asc" },
                          select: { id: true, text: true, position: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine issue not found."
      });
    }

    return res.json({ success: true, magazine });
  } catch (error) {
    console.error("Preview magazine issue error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load magazine preview."
    });
  }
}


/* ============================================================
   ADD PAGE
   POST /api/magazine-admin/:id/pages
   ============================================================ */

async function addMagazinePage(req, res) {
  try {
    const { id } = req.params;

    const issue =
      await prisma.magazineIssue.findUnique({
        where: {
          id
        }
      });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Magazine issue not found."
      });
    }

    const {
      type,
      title,
      slug,
      articleId,
      content
    } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Page type is required."
      });
    }

    /*
     * Position is always appended.
     *
     * Existing pages are never overwritten.
     */
    const lastPage =
      await prisma.magazinePage.findFirst({
        where: {
          issueId: id
        },

        orderBy: {
          position: "desc"
        },

        select: {
          position: true
        }
      });

    const position =
      lastPage
        ? lastPage.position + 1
        : 1;

    /*
     * If this is an article page, verify
     * that the article exists.
     */
    if (articleId) {
      const article =
        await prisma.article.findUnique({
          where: {
            id: articleId
          }
        });

      if (!article) {
        return res.status(400).json({
          success: false,
          message: "Article not found."
        });
      }
    }

    const page =
      await prisma.magazinePage.create({
        data: {
          issueId: id,

          position,

          type,

          title:
            cleanString(title),

          slug:
            cleanString(slug),

          articleId:
            articleId || null,

          content:
  content === null || content === undefined
    ? prisma.DbNull
    : content
        },

        include: {
          article: true
        }
      });

    return res.status(201).json({
      success: true,
      message: "Magazine page added.",
      page
    });
  } catch (error) {
    console.error(
      "Add magazine page error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add magazine page."
    });
  }
}


/* ============================================================
   UPDATE PAGE
   PATCH /api/magazine-admin/:id/pages/:pageId
   ============================================================ */

async function updateMagazinePage(req, res) {
  try {
    const {
      id,
      pageId
    } = req.params;

    const page =
      await prisma.magazinePage.findFirst({
        where: {
          id: pageId,
          issueId: id
        }
      });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Magazine page not found."
      });
    }

    const {
      type,
      title,
      slug,
      articleId,
      content
    } = req.body;

    const data = {};

    if (type !== undefined) {
      data.type = type;
    }

    if (title !== undefined) {
      data.title =
        cleanString(title);
    }

    if (slug !== undefined) {
      data.slug =
        cleanString(slug);
    }

    if (articleId !== undefined) {
      if (articleId) {
        const article =
          await prisma.article.findUnique({
            where: {
              id: articleId
            }
          });

        if (!article) {
          return res.status(400).json({
            success: false,
            message: "Article not found."
          });
        }
      }

      data.articleId =
        articleId || null;
    }

   if (content !== undefined) {
  data.content =
    content === null
      ? prisma.DbNull
      : content;
}

    const updated =
      await prisma.magazinePage.update({
        where: {
          id: pageId
        },

        data,

        include: {
          article: true
        }
      });

    return res.json({
      success: true,
      message: "Magazine page updated.",
      page: updated
    });
  } catch (error) {
    console.error(
      "Update magazine page error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update magazine page."
    });
  }
}


/* ============================================================
   DELETE PAGE
   DELETE /api/magazine-admin/:id/pages/:pageId
   ============================================================ */

async function deleteMagazinePage(req, res) {
  try {
    const {
      id,
      pageId
    } = req.params;

    const page =
      await prisma.magazinePage.findFirst({
        where: {
          id: pageId,
          issueId: id
        }
      });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Magazine page not found."
      });
    }

    await prisma.magazinePage.delete({
      where: {
        id: pageId
      }
    });

    /*
     * Compact the remaining positions.
     *
     * We do this safely by temporarily moving
     * positions into negative values first.
     */
    const remaining =
      await prisma.magazinePage.findMany({
        where: {
          issueId: id
        },

        orderBy: {
          position: "asc"
        }
      });

    await prisma.$transaction(
      remaining.map((item, index) =>
        prisma.magazinePage.update({
          where: {
            id: item.id
          },

          data: {
            position:
              -(index + 1)
          }
        })
      )
    );

    await prisma.$transaction(
      remaining.map((item, index) =>
        prisma.magazinePage.update({
          where: {
            id: item.id
          },

          data: {
            position:
              index + 1
          }
        })
      )
    );

    return res.json({
      success: true,
      message: "Magazine page deleted."
    });
  } catch (error) {
    console.error(
      "Delete magazine page error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete magazine page."
    });
  }
}


/* ============================================================
   REORDER PAGES
   PATCH /api/magazine-admin/:id/pages/reorder
   ============================================================ */

async function reorderMagazinePages(req, res) {
  try {
    const { id } = req.params;

    const { pageIds } = req.body;

    if (!Array.isArray(pageIds)) {
      return res.status(400).json({
        success: false,
        message:
          "pageIds must be an array."
      });
    }

    const pages =
      await prisma.magazinePage.findMany({
        where: {
          issueId: id
        },

        select: {
          id: true
        }
      });

    const existingIds =
      new Set(
        pages.map(
          (page) => page.id
        )
      );

    /*
     * Every page currently belonging to
     * this issue must appear exactly once.
     */
    if (
      pageIds.length !==
      pages.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The reorder list must contain every page exactly once."
      });
    }

    const uniqueIds =
      new Set(pageIds);

    if (
      uniqueIds.size !==
      pageIds.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate page IDs are not allowed."
      });
    }

    for (const pageId of pageIds) {
      if (!existingIds.has(pageId)) {
        return res.status(400).json({
          success: false,
          message:
            "One or more page IDs do not belong to this magazine issue."
        });
      }
    }

    /*
     * IMPORTANT:
     *
     * MagazinePage has:
     *
     * @@unique([issueId, position])
     *
     * Therefore we cannot directly change
     * page 1 -> position 2 while another page
     * is still at position 2.
     *
     * First move everything into temporary
     * negative positions.
     */
    await prisma.$transaction(
      pages.map((page, index) =>
        prisma.magazinePage.update({
          where: {
            id: page.id
          },

          data: {
            position:
              -(index + 1)
          }
        })
      )
    );

    /*
     * Now apply the requested order.
     */
    await prisma.$transaction(
      pageIds.map((pageId, index) =>
        prisma.magazinePage.update({
          where: {
            id: pageId
          },

          data: {
            position:
              index + 1
          }
        })
      )
    );

    const updated =
      await prisma.magazinePage.findMany({
        where: {
          issueId: id
        },

        orderBy: {
          position: "asc"
        },

        include: {
          article: true
        }
      });

    return res.json({
      success: true,
      message:
        "Magazine pages reordered.",
      pages: updated
    });
  } catch (error) {
    console.error(
      "Reorder magazine pages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reorder magazine pages."
    });
  }
}


/* ============================================================
   EXPORTS
   ============================================================ */

module.exports = {
  getMagazineIssues,
  getMagazineIssue,
  createMagazineIssue,
  updateMagazineIssue,
  publishMagazineIssue,
  unpublishMagazineIssue,
  addMagazinePage,
  updateMagazinePage,
  deleteMagazinePage,
  reorderMagazinePages,
   previewMagazineIssue
};