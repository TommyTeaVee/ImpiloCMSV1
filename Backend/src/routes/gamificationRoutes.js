const express = require("express");

const {
   getMyGamification,
  getLeaderboard,
  getMyRank,
  getAchievements,
  getMyAchievements,
  getGamificationDashboard,
} = require("../controllers/gamificationController");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// LEADERBOARD
// ==================================================

router.get(
  "/leaderboard",
  getLeaderboard
);


// ==================================================
// MY GAMIFICATION PROFILE
// ==================================================

router.get(
  "/me",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER",
    "MODERATOR"
  ),
  getMyGamification
);
router.get(
  "/dashboard",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER",
    "MODERATOR"
  ),
  getGamificationDashboard
);

// ==================================================
// MY RANK
// ==================================================

router.get(
  "/me/rank",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER",
    "MODERATOR"
  ),
  getMyRank
);

router.get(
  "/achievements",
  getAchievements
);


// ==================================================
// MY ACHIEVEMENTS
// ==================================================

router.get(
  "/me/achievements",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER",
    "MODERATOR"
  ),
  getMyAchievements
);
module.exports = router;