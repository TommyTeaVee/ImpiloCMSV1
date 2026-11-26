const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const {
  sha256, isValidVisitorId, isValidSecret, usernameProblem,
  newSecret, secretMatches, canChangeUsername,
} = require("../lib/readerRules");

const publicReader = (u) => ({
  id: u.id,
  username: u.username,
  displayName: u.displayName,
  avatarUrl: u.avatarUrl,
  role: u.role,
});

const signReader = (u) =>
  jwt.sign({ userId: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

// avidreader + 6 digits (a million names). Tries a few random ones, then gives up loudly
// instead of looping forever.
async function generateUniqueUsername() {
  for (let i = 0; i < 20; i++) {
    const name = `avidreader${String(crypto.randomInt(0, 1000000)).padStart(6, "0")}`;
    const taken = await prisma.user.findUnique({ where: { username: name }, select: { id: true } });
    if (!taken) return name;
  }
  throw new Error("Could not generate a unique reader username");
}

/*
 * POST /api/readers/identity   { visitorId, secret? }
 *
 *  - new visitor            -> create the profile, return a secret ONCE (client keeps it)
 *  - known, secret matches  -> sign in
 *  - known, legacy profile  -> (created before secrets existed) first caller with a secret claims it
 *  - known, secret missing or wrong -> 403 PROFILE_LOCKED; the client then starts a new
 *                              profile with its own random id (a Matomo id is not a password)
 */
async function identifyReader(req, res) {
  try {
    const { visitorId, secret, userId } = req.body || {};
    const id = visitorId ?? userId; // `userId` = the old field name, still accepted
    if (!isValidVisitorId(id)) {
      return res.status(400).json({ message: "Reader id is invalid" });
    }
    if (secret !== undefined && !isValidSecret(secret)) {
      return res.status(400).json({ message: "Reader secret is invalid" });
    }

    const tokenHash = sha256(id);
    let reader = await prisma.user.findUnique({ where: { readerTokenHash: tokenHash } });

    if (!reader) {
      const newSecretValue = isValidSecret(secret) ? null : newSecret();
      const useSecret = newSecretValue || secret;
      reader = await prisma.user.create({
        data: {
          readerTokenHash: tokenHash,
          readerSecretHash: sha256(useSecret),
          username: await generateUniqueUsername(),
          role: "READER",
        },
      });
      return res.status(201).json({
        message: "Reader created",
        token: signReader(reader),
        secret: newSecretValue, // null if the client supplied its own
        user: publicReader(reader),
      });
    }

    if (reader.role !== "READER") {
      // a visitor id must never sign in as staff
      return res.status(403).json({ code: "PROFILE_LOCKED", message: "Profile locked" });
    }

    if (!reader.readerSecretHash) {
      if (!isValidSecret(secret)) {
        return res.status(403).json({ code: "SECRET_REQUIRED", message: "Send a reader secret to claim this profile" });
      }
      reader = await prisma.user.update({
        where: { id: reader.id },
        data: { readerSecretHash: sha256(secret) },
      });
      return res.json({ message: "Reader profile secured", token: signReader(reader), secret: null, user: publicReader(reader) });
    }

    if (!secretMatches(secret, reader.readerSecretHash)) {
      return res.status(403).json({ code: "PROFILE_LOCKED", message: "Profile locked" });
    }

    return res.json({ message: "Reader identified", token: signReader(reader), secret: null, user: publicReader(reader) });
  } catch (error) {
    console.error("Reader identity error:", error);
    return res.status(500).json({ message: "Unable to identify reader" });
  }
}

async function getMe(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: "Reader not found" });
  const gate = canChangeUsername(user.usernameChangedAt);
  return res.json({
    user: publicReader(user),
    canChangeUsername: gate.ok,
    usernameRetryAfterMs: gate.ok ? 0 : gate.retryAfterMs,
  });
}

// PATCH /api/readers/me/username   { username }
async function changeUsername(req, res) {
  try {
    const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
    const problem = usernameProblem(username);
    if (problem) return res.status(400).json({ message: problem });

    const me = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!me || me.role !== "READER") return res.status(403).json({ message: "Only readers can use this" });
    if (me.username === username) return res.json({ user: publicReader(me) });

    const gate = canChangeUsername(me.usernameChangedAt);
    if (!gate.ok) {
      return res.status(429).json({ message: "You can change your username once a day", retryAfterMs: gate.retryAfterMs });
    }

    const clash = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" }, NOT: { id: me.id } },
      select: { id: true },
    });
    if (clash) return res.status(409).json({ message: "That username is taken" });

    const updated = await prisma.user.update({
      where: { id: me.id },
      data: { username, usernameChangedAt: new Date() },
    });
    return res.json({ message: "Username updated", user: publicReader(updated) });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ message: "That username is taken" });
    console.error("Change username error:", error);
    return res.status(500).json({ message: "Unable to change username" });
  }
}

// kept for other modules that import it
async function getOrCreateReader(readerToken) {
  if (!isValidVisitorId(readerToken)) throw new Error("Reader token is required");
  const tokenHash = sha256(readerToken);
  const existing = await prisma.user.findUnique({ where: { readerTokenHash: tokenHash } });
  if (existing) return existing;
  return prisma.user.create({
    data: { readerTokenHash: tokenHash, username: await generateUniqueUsername(), role: "READER" },
  });
}

module.exports = { identifyReader, getMe, changeUsername, getOrCreateReader };
