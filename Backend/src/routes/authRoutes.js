const express = require("express");
const { login, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimits");

const router = express.Router();

router.post("/login", loginLimiter, login);
router.get("/me", authenticate, me);

module.exports = router;