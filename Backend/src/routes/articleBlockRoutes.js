const express = require("express");

const {
  addArticleBlock,
  deleteArticleBlock,
  reorderArticleBlocks
} = require("../controllers/articleBlockController");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// ADD BLOCK
// ==================================================

router.post(
  "/:id/blocks",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  addArticleBlock
);


// ==================================================
// DELETE BLOCK
// ==================================================

router.delete(
  "/:id/blocks/:blockId",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  deleteArticleBlock
);


// ==================================================
// REORDER BLOCKS
// ==================================================

router.patch(
  "/:id/blocks/reorder",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  reorderArticleBlocks
);


module.exports = router;