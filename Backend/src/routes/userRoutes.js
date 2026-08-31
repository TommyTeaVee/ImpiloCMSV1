const express = require("express");

const {
  getUsers,
  getUser,
  updateUserRole
} = require("../controllers/userController");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();


/*
 * ==========================================
 * USER MANAGEMENT
 * ADMIN + EDITOR
 * ==========================================
 */

router.use(
  authenticate,
  requireRole("ADMIN", "EDITOR")
);


/*
 * GET ALL USERS
 *
 * GET /users
 */

router.get(
  "/",
  getUsers
);


/*
 * GET SINGLE USER
 *
 * GET /users/:id
 */

router.get(
  "/:id",
  getUser
);


/*
 * CHANGE USER ROLE
 *
 * PUT /users/:id/role
 */

router.put(
  "/:id/role",
  updateUserRole
);


module.exports = router;