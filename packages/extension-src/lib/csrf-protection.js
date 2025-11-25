/**
 * CSRF Protection Utility - Minimal Security Enhancement
 * Adds request validation and security headers without breaking changes
 */

class CSRFProtection {
    constructor() {
        this.sessionToken = this.generateSessionToken();
        this.requestNonce = new Map();
    }

    generateSessionToken() {
        return 'csrf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateRequestNonce() {
        return 'nonce_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Enhance fetch requests with CSRF protection
    secureRequest(url, options = {}) {
        const nonce = this.generateRequestNonce();
        this.requestNonce.set(nonce, Date.now());
        
        // Add security headers
        const secureOptions = {
            ...options,
            headers: {
                ...options.headers,
                'X-Requested-With': 'BeatsChain-Extension',
                'X-Extension-ID': chrome.runtime?.id || 'development',
                'X-Request-Nonce': nonce,
                'X-Session-Token': this.sessionToken
            }
        };

        // Add referrer policy for external requests
        if (url.startsWith('https://api.pinata.cloud') || url.startsWith('https://gateway.pinata.cloud')) {
            secureOptions.referrerPolicy = 'strict-origin-when-cross-origin';
        }

        return fetch(url, secureOptions);
    }

    // Validate response nonce (if server supports it)
    validateResponse(response, expectedNonce) {
        const responseNonce = response.headers.get('X-Response-Nonce');
        if (responseNonce && this.requestNonce.has(expectedNonce)) {
            this.requestNonce.delete(expectedNonce);
            return responseNonce === expectedNonce;
        }
        return true; // Allow if server doesn't support nonce validation
    }

    // Clean up old nonces (prevent memory leaks)
    cleanupNonces() {
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        for (const [nonce, timestamp] of this.requestNonce.entries()) {
            if (now - timestamp > maxAge) {
                this.requestNonce.delete(nonce);
            }
        }
    }
}

window.CSRFProtection = CSRFProtection;