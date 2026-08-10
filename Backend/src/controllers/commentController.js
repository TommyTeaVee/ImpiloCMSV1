const prisma = require("../lib/prisma");

// ==================================================
// CREATE COMMENT
// ==================================================

async function createComment(req, res) {
  try {
    const { id: articleId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        status: "PUBLISHED"
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    const comment = await prisma.comment.create({
      data: {
        articleId,
        userId: req.user.id,
        content: content.trim()
      },
      include: {
        user: {
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
      message: "Comment created",
      comment
    });

  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      message: "Unable to create comment"
    });
  }
}


// ==================================================
// GET ARTICLE COMMENTS
// ==================================================

async function getArticleComments(req, res) {
  try {
    const { id: articleId } = req.params;

    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        status: "PUBLISHED"
      }
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        status: "VISIBLE"
      },
      orderBy: {
        createdAt: "asc"
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    return res.status(200).json({
      comments
    });

  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      message: "Unable to retrieve comments"
    });
  }
}


// ==================================================
// REPORT COMMENT
// ==================================================

async function reportComment(req, res) {
  try {
    const { id: commentId } = req.params;
    const { reason } = req.body;

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        message: "A report reason is required"
      });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId
      }
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    const report = await prisma.commentReport.create({
      data: {
        commentId,
        reporterId: req.user.id,
        reason: reason.trim()
      }
    });

    return res.status(201).json({
      message: "Comment reported",
      report
    });

  } catch (error) {
    console.error("Report comment error:", error);

    return res.status(500).json({
      message: "Unable to report comment"
    });
  }
}


module.exports = {
  createComment,
  getArticleComments,
  reportComment
};