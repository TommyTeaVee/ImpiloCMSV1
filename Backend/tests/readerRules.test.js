const test = require("node:test");
const assert = require("node:assert/strict");
const r = require("../src/lib/readerRules");

test("visitor ids: Matomo 16-hex, UUID, and bad input", () => {
  assert.ok(r.isValidVisitorId("0123456789abcdef"));
  assert.ok(r.isValidVisitorId("550e8400-e29b-41d4-a716-446655440000"));
  assert.ok(!r.isValidVisitorId("short"));
  assert.ok(!r.isValidVisitorId("has spaces in it but long enough"));
  assert.ok(!r.isValidVisitorId(12345678901234567));
  assert.ok(!r.isValidVisitorId(null));
});

test("secrets: generated ones validate and match their hash only", () => {
  const s = r.newSecret();
  assert.ok(r.isValidSecret(s));
  assert.ok(r.secretMatches(s, r.sha256(s)));
  assert.ok(!r.secretMatches(r.newSecret(), r.sha256(s)));
  assert.ok(!r.secretMatches(undefined, r.sha256(s)));
  assert.ok(!r.secretMatches(s, null));
});

test("usernames", () => {
  assert.equal(r.usernameProblem("Nomsa_01"), null);
  assert.ok(r.usernameProblem("ab"));
  assert.ok(r.usernameProblem("1abc"));
  assert.ok(r.usernameProblem("has space"));
  assert.ok(r.usernameProblem("x".repeat(21)));
  assert.ok(r.usernameProblem("Admin"));
  assert.ok(r.usernameProblem("super_hitler_fan"));
  assert.ok(r.usernameProblem(null));
});

test("username cooldown is one day", () => {
  const now = Date.now();
  assert.ok(r.canChangeUsername(null, now).ok);
  assert.ok(!r.canChangeUsername(new Date(now - 1000), now).ok);
  assert.ok(r.canChangeUsername(new Date(now - r.USERNAME_COOLDOWN_MS - 1), now).ok);
});
