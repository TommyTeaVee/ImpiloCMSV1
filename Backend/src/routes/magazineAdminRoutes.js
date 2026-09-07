const express = require("express");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const {
  getMagazineIssues,
  getMagazineIssue,
  createMagazineIssue,
  updateMagazineIssue,
  publishMagazineIssue,
  unpublishMagazineIssue,
  addMagazinePage,
  updateMagazinePage,
  deleteMagazinePage,
  reorderMagazinePages
} = require("../controllers/magazineAdminController");

const router = express.Router();

// ==================================================
// ADMIN MAGAZINE ROUTES
// ==================================================

// All magazine management routes require authentication
// and are available to ADMIN and EDITOR.
router.use(
  authenticate,
  requireRole("ADMIN", "EDITOR")
);

// ==================================================
// MAGAZINE ISSUES
// ==================================================

// Get all magazine issues
router.get(
  "/",
  getMagazineIssues
);

// Get one magazine issue
router.get(
  "/:id",
  getMagazineIssue
);

// Create magazine issue
router.post(
  "/",
  createMagazineIssue
);

// Update magazine issue
router.put(
  "/:id",
  updateMagazineIssue
);

// Publish magazine issue
router.post(
  "/:id/publish",
  publishMagazineIssue
);

// Unpublish magazine issue
router.post(
  "/:id/unpublish",
  unpublishMagazineIssue
);

// ==================================================
// MAGAZINE PAGES
// ==================================================

// Add page to magazine
router.post(
  "/:id/pages",
  addMagazinePage
);

// Update page
router.put(
  "/:id/pages/:pageId",
  updateMagazinePage
);

// Delete page
router.delete(
  "/:id/pages/:pageId",
  deleteMagazinePage
);

// Reorder pages
router.patch(
  "/:id/pages/reorder",
  reorderMagazinePages
);

module.exports = router;