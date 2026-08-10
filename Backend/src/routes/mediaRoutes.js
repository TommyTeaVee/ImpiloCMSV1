const express = require("express");

const {
  createMedia,
  getMedia,
  updateMedia,
  deleteMedia
} = require("../controllers/mediaController");
const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();


// Create media asset
router.post(
  "/",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  createMedia
);


// Get media asset
router.get(
  "/:id",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  getMedia
);

router.put(
  "/:id",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  updateMedia
);
// Delete media asset
router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN", "EDITOR"),
  deleteMedia
);


module.exports = router;