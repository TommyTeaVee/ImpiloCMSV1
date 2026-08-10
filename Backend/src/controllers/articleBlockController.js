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


module.exports = {
  addArticleBlock,
  deleteArticleBlock
};