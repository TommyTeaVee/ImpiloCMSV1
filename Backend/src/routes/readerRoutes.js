const express = require("express");
const { identifyReader, getMe, changeUsername } = require("../controllers/readerController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");
const { identityLimiter, usernameLimiter } = require("../middleware/rateLimits");

const router = express.Router();

router.post("/identity", identityLimiter, identifyReader);
router.get("/me", authenticate, requireRole("READER"), getMe);
router.patch("/me/username", authenticate, requireRole("READER"), usernameLimiter, changeUsername);

module.exports = router;