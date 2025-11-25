// production-lock.js
// Force dev-only flags off in production. Developers can set window.__UNLOCK_DEV__ = true
// before this script runs to bypass the lock (only for local dev convenience).
(function () {
  try {
    // If an explicit unlock is present, do not lock (developer responsibility)
    if (window.__UNLOCK_DEV__ === true) {
      console.warn('production-lock: development unlock present - skipping production lock');
      return;
    }

    // Force known dev flags to false to prevent accidental bypass in published builds
    if (typeof window.__DEV_GUEST_MODE__ !== 'undefined') window.__DEV_GUEST_MODE__ = false;
    else window.__DEV_GUEST_MODE__ = false;

    if (typeof window.__DEV_ADMIN__ !== 'undefined') window.__DEV_ADMIN__ = false;
    else window.__DEV_ADMIN__ = false;

    // Defensive: ensure no global unconditional bypass token remains
    if (window.__DEV_GUEST_MODE__ || window.__DEV_ADMIN__) {
      console.warn('production-lock: dev flags were forced off');
    }
  } catch (e) {
    console.warn('production-lock: error enforcing locks', e);
  }
})();
