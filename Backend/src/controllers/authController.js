const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// Compared against when the email is unknown, so "no such user" takes as long as "wrong password"
// and response time cannot be used to find out which emails have accounts.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);



async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || password.length > 200) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    const passwordValid = await bcrypt.compare(
      String(password),
      user && user.passwordHash ? user.passwordHash : DUMMY_HASH
    );

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (user.role === "READER") {
      return res.status(403).json({
        message: "Readers cannot access the editorial dashboard"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to login"
    });
  }
}
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true
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
    console.error("Auth me error:", error);

    return res.status(500).json({
      message: "Unable to retrieve user"
    });
  }
}

module.exports = {
  login,
  me
};