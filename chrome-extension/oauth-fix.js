/**
 * OAuth Fix - Ensures extension works with or without valid OAuth
 */

// Override OAuth initialization to handle errors gracefully
(function() {
    'use strict';
    // This shim was originally used to automatically enable guest mode when OAuth
    // failed (useful for local development and demos). For production builds we
    // must not silently enable guest mode or mask real OAuth errors. Gate the
    // behavior behind an explicit developer flag: `window.__DEV_GUEST_MODE__`.

    // Store original chrome.identity methods
    const originalGetAuthToken = chrome.identity?.getAuthToken;

    if (!originalGetAuthToken) {
        console.log('🔧 OAuth shim not applied: chrome.identity.getAuthToken not available');
        return;
    }

    // Wrap getAuthToken with optional dev-only guest mode behavior
    chrome.identity.getAuthToken = function(details, callback) {
        try {
            originalGetAuthToken.call(this, details, function(token) {
                if (chrome.runtime.lastError) {
                    const error = chrome.runtime.lastError.message || '';

                    // If developer explicitly enabled guest mode, allow graceful fallback
                    if (window.__DEV_GUEST_MODE__ === true && (error.includes('bad client id') || error.includes('invalid_client'))) {
                        console.warn('🔧 [DEV] OAuth client ID invalid - enabling guest mode');
                        if (window.UnifiedAuthenticationManager) {
                            try {
                                const auth = new UnifiedAuthenticationManager();
                                auth.enableGuestMode();
                            } catch (e) {
                                console.warn('🔧 [DEV] enableGuestMode failed:', e);
                            }
                        }
                        callback(null);
                        return;
                    }
                }

                // Normal OAuth flow
                callback(token);
            });
        } catch (error) {
            console.warn('🔧 OAuth shim caught an error:', error && error.message ? error.message : error);
            // Only allow a dev fallback when explicitly enabled
            if (window.__DEV_GUEST_MODE__ === true) {
                callback(null);
                return;
            }
            // In production, surface the failure by returning null token and letting
            // the calling code handle errors (no silent guest mode).
            callback(null);
        }
    };

    console.log('🔧 OAuth shim loaded (dev guest mode: ' + (window.__DEV_GUEST_MODE__ === true) + ')');
})();