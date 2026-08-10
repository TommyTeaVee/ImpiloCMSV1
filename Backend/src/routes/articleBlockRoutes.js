const express = require("express");

const {
  addArticleBlock,
  deleteArticleBlock
} = require("../controllers/articleBlockController");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();


// Add block
router.post(
  "/:id/blocks",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  addArticleBlock
);


// Delete block
router.delete(
  "/:id/blocks/:blockId",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  deleteArticleBlock
);


module.exports = router;