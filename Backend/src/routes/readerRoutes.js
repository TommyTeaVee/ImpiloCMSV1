const express = require("express");

const {
  identifyReader
} = require("../controllers/readerController");

const router = express.Router();

router.post(
  "/identity",
  identifyReader
);

module.exports = router;