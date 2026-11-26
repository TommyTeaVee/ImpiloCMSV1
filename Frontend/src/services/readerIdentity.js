// Anonymous reader profile, tied to the Matomo visitor id.
//
//  localStorage keys
//    readerVisitorId  the id we identify with (Matomo's, or our own if Matomo is blocked)
//    readerSecret     random secret the server gave us when the profile was created
//    readerToken      30-day login token (services/api.js already sends it)
//    userId           the profile's id (App.jsx hands it to Matomo)
//
// Call ensureReader() once on app start. It never throws: if anything fails the site keeps working
// without a profile.

import api from "./api";

const LS = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

// Matomo's id is 16 hex characters. Ask the tracker; give up after 2.5s (blocked or slow).
function matomoVisitorId(timeoutMs = 2500) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    const timer = setTimeout(() => resolve(null), timeoutMs);
    window._paq = window._paq || [];
    window._paq.push([
      function () {
        clearTimeout(timer);
        try { resolve(this.getVisitorId()); } catch { resolve(null); }
      },
    ]);
  });
}

function randomId() {
  return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}${Math.random()}`).replace(/-/g, "");
}

async function callIdentity(visitorId, secret) {
  const body = { visitorId };
  if (secret) body.secret = secret;
  return api.post("/readers/identity", body);
}

function remember(res, visitorId) {
  const { token, secret, user } = res.data;
  LS.set("readerVisitorId", visitorId);
  if (secret) LS.set("readerSecret", secret);
  LS.set("readerToken", token);
  LS.set("userId", user.id);
  return user;
}

let inFlight = null;

export function ensureReader() {
  if (!inFlight) inFlight = run().catch(() => null);
  return inFlight;
}

async function run() {
  // Staff browsing the site keep their editorial session; do not create a reader profile for them.
  if (LS.get("adminToken") || LS.get("editorialToken") || LS.get("token")) return null;

  const stored = LS.get("readerVisitorId");
  const visitorId = stored || (await matomoVisitorId()) || randomId();
  const secret = LS.get("readerSecret");

  try {
    return remember(await callIdentity(visitorId, secret), visitorId);
  } catch (err) {
    const code = err?.response?.data?.code;
    // The profile for this id exists but we do not hold its secret (new device, cleared storage).
    // A Matomo id is not a password, so start a fresh profile with our own random id.
    if (err?.response?.status === 403 && (code === "PROFILE_LOCKED" || code === "SECRET_REQUIRED")) {
      LS.del("readerSecret");
      const fresh = randomId();
      return remember(await callIdentity(fresh), fresh);
    }
    throw err;
  }
}

export async function getMyReader() {
  const { data } = await api.get("/readers/me");
  return data;
}

export async function changeUsername(username) {
  const { data } = await api.patch("/readers/me/username", { username });
  return data.user;
}
