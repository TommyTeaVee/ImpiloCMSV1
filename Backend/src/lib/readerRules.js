// Pure rules for reader ids, secrets and usernames (unit-tested, no database).
const crypto = require("crypto");

// Matomo's visitor id is 16 hex characters; our own fallback id is a UUID without dashes (32 hex).
// Anything 16-64 of [A-Za-z0-9_-] is accepted so existing readers keep working.
const VISITOR_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;
const SECRET_RE = /^[A-Za-z0-9_-]{32,128}$/;

const USERNAME_RE = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
const RESERVED = ["admin", "administrator", "impilo", "impilomag", "editor", "moderator", "support", "staff", "system", "root", "null", "undefined"];
// Keep this list small and extend it as needed; it only blocks the obvious.
const BLOCKED_FRAGMENTS = ["fuck", "shit", "cunt", "nigg", "rape", "nazi", "hitler"];

const USERNAME_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

function isValidVisitorId(v) {
  return typeof v === "string" && VISITOR_ID_RE.test(v);
}
function isValidSecret(v) {
  return typeof v === "string" && SECRET_RE.test(v);
}

// Returns null if fine, otherwise a message for the reader.
function usernameProblem(name) {
  if (typeof name !== "string") return "Username is required";
  if (!USERNAME_RE.test(name)) {
    return "Use 3-20 letters, numbers or underscores, starting with a letter";
  }
  const lower = name.toLowerCase();
  if (RESERVED.includes(lower)) return "That username is reserved";
  if (BLOCKED_FRAGMENTS.some((w) => lower.includes(w))) return "That username is not allowed";
  return null;
}

function newSecret() {
  return crypto.randomBytes(32).toString("base64url"); // 43 chars
}

function secretMatches(secret, storedHash) {
  if (!isValidSecret(secret) || !storedHash) return false;
  const a = Buffer.from(sha256(secret), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function canChangeUsername(lastChangedAt, now = Date.now()) {
  if (!lastChangedAt) return { ok: true };
  const wait = new Date(lastChangedAt).getTime() + USERNAME_COOLDOWN_MS - now;
  return wait <= 0 ? { ok: true } : { ok: false, retryAfterMs: wait };
}

module.exports = {
  sha256, isValidVisitorId, isValidSecret, usernameProblem,
  newSecret, secretMatches, canChangeUsername, USERNAME_COOLDOWN_MS,
};
