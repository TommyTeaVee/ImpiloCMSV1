const express = require("express");

const {
  listMediaFolder
} = require("../controllers/cloudFrontMediaController");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==================================================
// LIST MEDIA FOLDER
// ==================================================

router.get(
  "/folder",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  listMediaFolder
);

module.exports = router;