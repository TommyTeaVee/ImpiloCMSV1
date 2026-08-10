const express = require("express");

const {
  getPublishedArticles,
  getPublishedArticle,
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  submitArticle,
  approveArticle,
  publishArticle
} = require("../controllers/articleController");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// PUBLIC ARTICLE ROUTES
// ==================================================

// Get published articles
// No login required
router.get("/", getPublishedArticles);

// Get one published article by slug
// No login required
router.get("/public/:slug", getPublishedArticle);


// ==================================================
// CMS / EDITORIAL ROUTES
// ==================================================

// Get all articles including drafts and articles in review
router.get(
  "/manage",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  getArticles
);

// Get a specific article from the CMS
router.get(
  "/manage/:id",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  getArticle
);


// ==================================================
// CREATE / EDIT
// ==================================================

// Create draft
router.post(
  "/",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  createArticle
);

// Update article
router.put(
  "/manage/:id",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  updateArticle
);


// ==================================================
// EDITORIAL WORKFLOW
// ==================================================

// Submit draft for editorial review
router.post(
  "/:id/submit",
  authenticate,
  requireRole("ADMIN", "EDITOR", "WRITER"),
  submitArticle
);

// Approve article
// Only ADMIN and EDITOR
router.post(
  "/:id/approve",
  authenticate,
  requireRole("ADMIN", "EDITOR"),
  approveArticle
);

// Publish approved article
// Only ADMIN and EDITOR
router.post(
  "/:id/publish",
  authenticate,
  requireRole("ADMIN", "EDITOR"),
  publishArticle
);


module.exports = router;