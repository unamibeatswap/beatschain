/**
 * Backend Authentication Client
 * Small client used by the extension to verify Google tokens server-side and
 * receive authoritative role/permission mappings (admin vs artist).
 * Configure the backend URL via `envConfig` or chrome.storage (key: backend_auth_url).
 */

class BackendAuthClient {
    constructor() {
        this.backendUrl = (window.envConfig && window.envConfig.BACKEND_AUTH_URL) || null;
    }

    async resolveBackendUrl() {
        if (this.backendUrl) return this.backendUrl;
        try {
            const stored = await chrome.storage.local.get(['BACKEND_AUTH_URL']);
            if (stored && stored.BACKEND_AUTH_URL) {
                this.backendUrl = stored.BACKEND_AUTH_URL;
                return this.backendUrl;
            }
        } catch (err) {
            console.warn('BackendAuthClient: could not read BACKEND_AUTH_URL from storage', err);
        }
        return null;
    }

    // Verify a Google access token (or ID token) with your backend.
    // Expected backend contract: POST /auth/verify with JSON { token }
    // Returns { success: true, role: 'admin'|'artist', permissions: [] } or { success:false, error }
    async verifyGoogleToken(token) {
        try {
            const url = await this.resolveBackendUrl();
            if (!url) {
                return { success: false, error: 'No backend configured' };
            }

            const resp = await fetch(url.replace(/\/$/, '') + '/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (!resp.ok) {
                const text = await resp.text();
                return { success: false, error: 'Backend verification failed: ' + text };
            }

            const data = await resp.json();
            return data;
        } catch (error) {
            console.error('BackendAuthClient.verifyGoogleToken failed:', error);
            return { success: false, error: String(error) };
        }
    }
}

window.BackendAuthClient = BackendAuthClient;
