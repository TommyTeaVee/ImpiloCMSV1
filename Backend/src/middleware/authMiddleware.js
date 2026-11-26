const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// The role comes from the database, not the token, so demoting or deleting someone
// takes effect within CACHE_MS instead of after the token expires.
const CACHE_MS = 30 * 1000;
const cache = new Map(); // userId -> { role, at }

async function currentRole(userId) {
  const hit = cache.get(userId);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.role;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const role = user ? user.role : null;
  if (cache.size > 5000) cache.clear();
  cache.set(userId, { role, at: Date.now() });
  return role;
}

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const role = await currentRole(decoded.userId);
    if (!role) return res.status(401).json({ message: "Invalid or expired token" });

    req.user = { id: decoded.userId, role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to access this resource" });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
