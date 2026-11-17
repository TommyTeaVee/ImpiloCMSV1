
function pushMatomo(...args) {
  if (typeof window !== "undefined" &&
      Array.isArray(window._paq)) {
    window._paq.push(args);
  }
}

// Set the authenticated user's ID after login.
export function initMatomo(userId = null) {
  if (userId) {
    pushMatomo("setUserId", String(userId));
  }

  pushMatomo("trackPageView");
}

// Track React route changes.
export function trackPageView(title) {
  if (title) {
    pushMatomo("setDocumentTitle", title);
  }

  pushMatomo("setCustomUrl", window.location.href);
  pushMatomo("trackPageView");
}

// General event tracking.
export function trackEvent(
  category,
  action,
  name = undefined,
  value = undefined
) {
  pushMatomo(
    "trackEvent",
    category,
    action,
    name,
    value
  );
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
