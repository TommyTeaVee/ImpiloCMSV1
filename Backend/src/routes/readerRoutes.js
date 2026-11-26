const express = require("express");
const { identifyReader } = require("../controllers/readerController");
const { identityLimiter } = require("../middleware/rateLimits");

const router = express.Router();

router.post("/identity", identityLimiter, identifyReader);

module.exports = router;