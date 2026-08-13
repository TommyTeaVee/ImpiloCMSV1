const express = require("express");

const {
  listCloudFrontFolder
} = require(
  "../controllers/cloudfrontMediaController"
);

const {
  authenticate,
  requireRole
} = require(
  "../middleware/authMiddleware"
);


const router =
  express.Router();


// ==================================================
// LIST CLOUDFRONT FOLDER
// ==================================================

router.get(
  "/folder",

  authenticate,

  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),

  listCloudFrontFolder
);


module.exports = router;