const prisma = require("../lib/prisma");

const USER_ROLES = [
  "ADMIN",
  "EDITOR",
  "WRITER",
  "READER",
  "MODERATOR"
];

/*
 * ==========================================
 * LIST USERS
 * ==========================================
 */

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      users
    });

  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res.status(500).json({
      message: "Unable to retrieve users"
    });
  }
}


/*
 * ==========================================
 * GET SINGLE USER
 * ==========================================
 */

async function getUser(req, res) {
  try {
    const { id } = req.params;

    const user =
      await prisma.user.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true
        }
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      user
    });

  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    return res.status(500).json({
      message: "Unable to retrieve user"
    });
  }
}


/*
 * ==========================================
 * CHANGE USER ROLE
 * ==========================================
 */

async function updateUserRole(req, res) {
  try {

    const { id } = req.params;
    const { role } = req.body;


    // ==================================================
    // VALIDATE ROLE
    // ==================================================

    if (!role) {

      return res.status(400).json({
        message: "Role is required"
      });

    }


    if (!USER_ROLES.includes(role)) {

      return res.status(400).json({
        message: "Invalid user role",
        allowedRoles: USER_ROLES
      });

    }


    // ==================================================
    // PREVENT SELF ROLE CHANGE
    // ==================================================

    if (id === req.user.id) {

      return res.status(400).json({
        message:
          "You cannot change your own role"
      });

    }


    // ==================================================
    // FIND TARGET USER
    // ==================================================

    const existingUser =
      await prisma.user.findUnique({

        where: {
          id
        },

        select: {
          id: true,
          role: true
        }

      });


    if (!existingUser) {

      return res.status(404).json({
        message: "User not found"
      });

    }


    // ==================================================
    // EDITOR PERMISSION RESTRICTION
    // ==================================================

    /*
     * Editors can manage users, but they
     * cannot create another ADMIN or change
     * an existing ADMIN.
     */

    if (req.user.role === "EDITOR") {

      if (
        existingUser.role === "ADMIN" ||
        role === "ADMIN"
      ) {

        return res.status(403).json({
          message:
            "Editors cannot modify administrator roles"
        });

      }

    }


    // ==================================================
    // UPDATE ROLE
    // ==================================================

    const user =
      await prisma.user.update({

        where: {
          id
        },

        data: {
          role
        },

        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true
        }

      });


    return res.json({

      message:
        "User role updated successfully",

      user

    });


  } catch (error) {

    console.error(
      "Update user role error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update user role"
    });

  }
}


module.exports = {
  getUsers,
  getUser,
  updateUserRole
};