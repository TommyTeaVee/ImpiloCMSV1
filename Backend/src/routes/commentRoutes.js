const express = require("express");

const {
  createComment,
  getArticleComments,
  reportComment
} = require("../controllers/commentController.js");

const {
  authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();


// Public: read comments
router.get(
  "/:id/comments",
  getArticleComments
);


// Reader: create comment
router.post(
  "/:id/comments",
  authenticate,
  createComment
);


// Reader: report comment
router.post(
  "/:id/report",
  authenticate,
  reportComment
);


module.exports = router;