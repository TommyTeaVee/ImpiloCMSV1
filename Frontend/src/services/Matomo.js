function pushMatomo(...args) {
  if (typeof window !== "undefined" && Array.isArray(window._paq)) {
    window._paq.push(args);
  }
}

const PRIVATE_PREFIXES = [
  "/editorial",
  "/admin",
  "/reader",
  "/preview",
  "/media-picker-test",
  "/cloudfront-test",
];

function isPrivatePath(pathname) {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Set the authenticated user's ID after login. Does NOT count a page view.
export function initMatomo(userId = null) {
  if (userId) {
    pushMatomo("setUserId", String(userId));
  }
}

// Track React route changes (private pages are skipped).
export function trackPageView(title) {
  if (typeof window === "undefined" || isPrivatePath(window.location.pathname)) return;

  if (title) {
    pushMatomo("setDocumentTitle", title);
  }

  pushMatomo("setCustomUrl", window.location.href);
  pushMatomo("trackPageView");
}

// General event tracking.
export function trackEvent(category, action, name = undefined, value = undefined) {
  pushMatomo("trackEvent", category, action, name, value);
}

// Track magazine interactions.
export function trackMagazineEvent(action, magazineTitle, value) {
  trackEvent("Magazine", action, magazineTitle, value);
}

// Track game interactions.
export function trackGameEvent(action, gameTitle, value) {
  trackEvent("Games", action, gameTitle, value);
}

// Track login and registration.
export function trackUserEvent(action, userId) {
  trackEvent("User", action, userId ? String(userId) : undefined);
}