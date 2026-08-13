const prisma = require("../lib/prisma");

const MEDIA_BLOCK_TYPES = ["IMAGE", "VIDEO", "AUDIO"];


// ==================================================
// VALIDATE MEDIA FOR BLOCK
// ==================================================

async function validateMediaForBlock(type, mediaId) {
  if (!MEDIA_BLOCK_TYPES.includes(type)) {
    return null;
  }

  if (!mediaId) {
    throw new Error(
      `${type} block requires a mediaId`
    );
  }

  const media = await prisma.mediaAsset.findUnique({
    where: {
      id: mediaId
    }
  });

  if (!media) {
    throw new Error("Media asset not found");
  }

  if (type === "IMAGE" && media.type !== "IMAGE") {
    throw new Error(
      "IMAGE block requires IMAGE media"
    );
  }

  if (type === "VIDEO" && media.type !== "VIDEO") {
    throw new Error(
      "VIDEO block requires VIDEO media"
    );
  }

  if (type === "AUDIO" && media.type !== "AUDIO") {
    throw new Error(
      "AUDIO block requires AUDIO media"
    );
  }

  return media;
}


// ==================================================
// ADD BLOCK TO ARTICLE
// ==================================================

async function addArticleBlock(req, res) {
  try {
    const { id: articleId } = req.params;

    const {
      type,
      content,
      mediaId
    } = req.body;

    if (!type) {
      return res.status(400).json({
        message: "Block type is required"
      });
    }

    // Check article
    const article = await prisma.article.findUnique({
      where: {
        id: articleId
      },

      include: {
        blocks: {
          orderBy: {
            position: "desc"
          },

          take: 1
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    // Writers can only modify their own articles.
    if (
      req.user.role === "WRITER" &&
      article.authorId !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only modify your own articles"
      });
    }

    // Validate media if this is a media block.
    await validateMediaForBlock(
      type,
      mediaId
    );

    const lastBlock = article.blocks[0];

    const position = lastBlock
      ? lastBlock.position + 1
      : 0;

    const block = await prisma.articleBlock.create({
      data: {
        articleId,
        type,
        position,
        content: content || {},
        mediaId: mediaId || null
      },

      include: {
        media: true
      }
    });

    // Recalculate word count from ALL blocks.
    const allBlocks =
      await prisma.articleBlock.findMany({
        where: {
          articleId
        }
      });

    const wordCount = allBlocks.reduce(
      (total, currentBlock) => {
        if (
          currentBlock.type !== "TEXT" &&
          currentBlock.type !== "HEADING" &&
          currentBlock.type !== "QUOTE"
        ) {
          return total;
        }

        const text =
          currentBlock.content?.text || "";

        return (
          total +
          String(text)
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length
        );
      },
      0
    );

    await prisma.article.update({
      where: {
        id: articleId
      },

      data: {
        wordCount
      }
    });

    return res.status(201).json({
      message: "Article block added",
      block,
      wordCount
    });

  } catch (error) {
    console.error(
      "Add article block error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Unable to add article block"
    });
  }
}


// ==================================================
// DELETE BLOCK
// ==================================================

async function deleteArticleBlock(req, res) {
  try {
    const {
      id: articleId,
      blockId
    } = req.params;

    const article =
      await prisma.article.findUnique({
        where: {
          id: articleId
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
        message:
          "You can only modify your own articles"
      });
    }

    const block =
      await prisma.articleBlock.findFirst({
        where: {
          id: blockId,
          articleId
        }
      });

    if (!block) {
      return res.status(404).json({
        message: "Article block not found"
      });
    }

    await prisma.articleBlock.delete({
      where: {
        id: blockId
      }
    });

    // Recalculate word count.
    const blocks =
      await prisma.articleBlock.findMany({
        where: {
          articleId
        }
      });

    const wordCount = blocks.reduce(
      (total, currentBlock) => {
        if (
          currentBlock.type !== "TEXT" &&
          currentBlock.type !== "HEADING" &&
          currentBlock.type !== "QUOTE"
        ) {
          return total;
        }

        const text =
          currentBlock.content?.text || "";

        return (
          total +
          String(text)
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length
        );
      },
      0
    );

    await prisma.article.update({
      where: {
        id: articleId
      },

      data: {
        wordCount
      }
    });

    return res.json({
      message: "Article block deleted",
      wordCount
    });

  } catch (error) {
    console.error(
      "Delete article block error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to delete article block"
    });
  }
}
// ==================================================
// REORDER ARTICLE BLOCKS
// ==================================================

// ==================================================
// REORDER ARTICLE BLOCKS
// ==================================================

async function reorderArticleBlocks(req, res) {
  try {
    const { id: articleId } = req.params;
    const { blocks } = req.body;

    if (!Array.isArray(blocks)) {
      return res.status(400).json({
        message: "blocks must be an array"
      });
    }

    if (blocks.length === 0) {
      return res.status(400).json({
        message: "At least one block is required"
      });
    }

    // ==================================================
    // CHECK ARTICLE
    // ==================================================

    const article =
      await prisma.article.findUnique({
        where: {
          id: articleId
        }
      });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    // ==================================================
    // WRITER OWNERSHIP
    // ==================================================

    if (
      req.user.role === "WRITER" &&
      article.authorId !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only modify your own articles"
      });
    }

    // ==================================================
    // GET EXISTING BLOCKS
    // ==================================================

    const existingBlocks =
      await prisma.articleBlock.findMany({
        where: {
          articleId
        },
        select: {
          id: true
        }
      });

    const existingIds = new Set(
      existingBlocks.map(
        (block) => block.id
      )
    );

    // ==================================================
    // VALIDATE SUBMITTED IDS
    // ==================================================

    const submittedIds =
      blocks.map(
        (block) => block.id
      );

    const uniqueIds =
      new Set(submittedIds);

    if (
      uniqueIds.size !==
      submittedIds.length
    ) {
      return res.status(400).json({
        message:
          "Duplicate block IDs are not allowed"
      });
    }

    // Every submitted block must belong
    // to this article.

    for (const block of blocks) {
      if (!existingIds.has(block.id)) {
        return res.status(400).json({
          message:
            "One or more blocks do not belong to this article"
        });
      }
    }

    // Every existing block must be
    // included in the new order.

    if (
      submittedIds.length !==
      existingBlocks.length
    ) {
      return res.status(400).json({
        message:
          "All article blocks must be included when reordering"
      });
    }

    // ==================================================
    // SAFE REORDER
    // ==================================================
    //
    // First move every block to a temporary
    // negative position.
    //
    // This prevents conflicts if position
    // has a unique constraint.
    //
    // Example:
    //
    // 0 → -1
    // 1 → -2
    // 2 → -3
    //
    // Then assign the real positions.
    // ==================================================

    await prisma.$transaction(async (tx) => {

      // ----------------------------------------------
      // TEMPORARY POSITIONS
      // ----------------------------------------------

      for (
        let index = 0;
        index < existingBlocks.length;
        index++
      ) {
        await tx.articleBlock.update({
          where: {
            id: existingBlocks[index].id
          },
          data: {
            position: -(index + 1)
          }
        });
      }

      // ----------------------------------------------
      // FINAL POSITIONS
      // ----------------------------------------------

      for (
        let index = 0;
        index < blocks.length;
        index++
      ) {
        await tx.articleBlock.update({
          where: {
            id: blocks[index].id
          },
          data: {
            position: index
          }
        });
      }
    });

    // ==================================================
    // RETURN NEW ORDER
    // ==================================================

    const reorderedBlocks =
      await prisma.articleBlock.findMany({
        where: {
          articleId
        },
        orderBy: {
          position: "asc"
        },
        include: {
          media: true
        }
      });

    return res.json({
      message:
        "Article blocks reordered",
      blocks: reorderedBlocks
    });

  } catch (error) {
    console.error(
      "Reorder article blocks error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to reorder article blocks"
    });
  }
}

module.exports = {
  addArticleBlock,
  deleteArticleBlock,
  reorderArticleBlocks
};