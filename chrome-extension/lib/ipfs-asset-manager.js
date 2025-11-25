/**
 * IPFS Asset Manager - cleaned and safe implementation.
 * - Client-side uploads are disabled (use server-side endpoints).
 * - Provides robust multi-gateway fetching for JSON manifests and assets.
 */

class IPFSAssetManager {
    constructor() {
        this.pinataApiKey = null; // intentionally null in client
        this.pinataSecretKey = null;
        this.assetCache = new Map();
        this.manifestCache = null;
        this.productionManifestHash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
        this.manifestUrl = `ipfs://${this.productionManifestHash}`;
        this.isInitialized = false;
        this.isProduction = this.detectProductionEnvironment();
        this.csrfProtection = (typeof window !== 'undefined' && window.CSRFProtection) ? new CSRFProtection() : null;
    }

    async initialize() {
        try {
            await this.loadCachedManifest();
            await this.validateConnection();
            this.isInitialized = true;
            console.log('✅ IPFS Asset Manager initialized');
        } catch (err) {
            console.warn('⚠️ IPFS Asset Manager initialization failed, will use fallbacks:', err);
            this.isInitialized = false;
        }
    }

    async validateConnection() {
        const gateways = [
            'https://cloudflare-ipfs.com/ipfs/',
            'https://ipfs.io/ipfs/',
            'https://dweb.link/ipfs/',
            'https://gateway.pinata.cloud/ipfs/'
        ];

        for (const g of gateways) {
            try {
                const url = g + this.productionManifestHash + '/readme';
                const resp = await fetch(url, { method: 'GET', mode: 'cors' });
                if (resp && resp.ok) {
                    console.log('✅ IPFS gateway connection validated via', g);
                    return true;
                }
            } catch (e) {
                // try next
            }
        }

        console.warn('⚠️ IPFS gateway validation failed for public gateways');
        return false;
    }

    async loadCachedManifest() {
        try {
            if (typeof localStorage === 'undefined') return;
            const cached = localStorage.getItem('ipfs_sponsor_manifest');
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    this.manifestCache = data.manifest;
                    console.log('📦 Using cached IPFS sponsor manifest');
                    return;
                }
            }
            await this.fetchSponsorManifest();
        } catch (e) {
            console.warn('⚠️ Failed to load sponsor manifest:', e);
        }
    }

    async fetchSponsorManifest() {
        // Try production manifest first, then fall back to a local development manifest
        try {
            // Attempt to fetch the production manifest with a single retry to handle transient gateway issues
            let realManifest = null;
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    realManifest = await this.fetchFromIPFS(this.productionManifestHash);
                    if (realManifest && realManifest.sponsors) {
                        this.manifestCache = realManifest;
                        console.log('✅ Production IPFS sponsor manifest loaded (attempt ' + attempt + ')');
                        if (typeof localStorage !== 'undefined') {
                            localStorage.setItem('ipfs_sponsor_manifest', JSON.stringify({ manifest: realManifest, timestamp: Date.now() }));
                        }
                        return realManifest;
                    }
                } catch (e) {
                    if (attempt === 1) {
                        console.info('ℹ️ First attempt to load production manifest failed, retrying once...');
                    } else {
                        console.info('ℹ️ Second attempt to load production manifest failed; will use development fallback. Last error:', e && e.message);
                    }
                }
            }

            const developmentManifest = {
                version: 'dev-fallback',
                sponsors: [
                    {
                        id: 'legal_services',
                        name: 'Music Legal Services',
                        message: 'Professional legal review for your music contracts and ISRC registration',
                        placement: 'after_isrc',
                        active: true,
                        priority: 10,
                        tier: 'premium',
                        website: 'https://example.com/legal',
                        assets: { logo: this.productionManifestHash, banner: this.productionManifestHash }
                    },
                    {
                        id: 'radio_analytics',
                        name: 'Airplay Analytics',
                        message: 'Track your radio airplay and audience engagement across stations',
                        placement: 'validation',
                        active: true,
                        priority: 8,
                        tier: 'enterprise',
                        website: 'https://example.com/analytics',
                        assets: { logo: this.productionManifestHash, banner: this.productionManifestHash }
                    }
                ]
            };

            this.manifestCache = developmentManifest;
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('ipfs_sponsor_manifest', JSON.stringify({ manifest: developmentManifest, timestamp: Date.now() }));
            }
            console.info('ℹ️ IPFS sponsor manifest loaded (development fallback)');
            return developmentManifest;
        } catch (err) {
            console.error('❌ Failed to fetch IPFS sponsor manifest:', err);
            throw err;
        }
    }

    detectProductionEnvironment() {
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
                const manifest = chrome.runtime.getManifest();
                return !manifest.version.includes('dev') && !manifest.version.includes('test');
            }
        } catch (e) {
            // ignore
        }
        return false;
    }

    async fetchFromIPFS(ipfsHash) {
        // If a backend proxy is configured (non-breaking), prefer it to avoid CORS issues
        const backendUrl = await this.getBackendUrl();
        if (backendUrl) {
            try {
                const proxyUrl = `${backendUrl.replace(/\/$/, '')}/api/ipfs/${ipfsHash}`;
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const signal = controller ? controller.signal : undefined;
                const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;
                const resp = await fetch(proxyUrl, { method: 'GET', headers: { Accept: 'application/json' }, signal, mode: 'cors' });
                if (timeoutId) clearTimeout(timeoutId);
                if (resp && resp.ok) {
                    const text = await resp.text();
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        // If proxy returned non-JSON, fall through to other gateways
                    }
                } else {
                    console.info('ℹ️ Backend proxy returned non-OK status, falling back to public gateways', resp && resp.status);
                }
            } catch (err) {
                console.info('ℹ️ Backend proxy fetch failed, falling back to gateways:', err && err.message);
            }
        }

        const gateways = [
            'https://cloudflare-ipfs.com/ipfs/',
            'https://ipfs.io/ipfs/',
            'https://dweb.link/ipfs/',
            'https://gateway.pinata.cloud/ipfs/'
        ];

        let lastError = null;
        for (const g of gateways) {
            try {
                const url = `${g}${ipfsHash}`;
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const signal = controller ? controller.signal : undefined;
                const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;
                const resp = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' }, signal, mode: 'cors' });
                if (timeoutId) clearTimeout(timeoutId);
                if (!resp.ok) { lastError = new Error(`HTTP ${resp.status} from ${g}`); continue; }
                const contentType = resp.headers.get('content-type') || '';
                const text = await resp.text();
                if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || contentType.includes('text/html')) {
                    lastError = new Error(`IPFS gateway ${g} returned HTML for hash ${ipfsHash}`);
                    continue;
                }
                try {
                    return JSON.parse(text);
                } catch (e) {
                    lastError = new Error(`Failed to parse JSON from ${g}: ${e.message}`);
                    continue;
                }
            } catch (err) {
                lastError = err;
                continue;
            }
        }
        throw lastError || new Error('Failed to fetch from IPFS - no gateway succeeded');
    }

    // Try to discover a configured backend URL for proxying IPFS requests.
    async getBackendUrl() {
        try {
            if (typeof window !== 'undefined' && window.BEATSCHAIN_BACKEND_URL) return window.BEATSCHAIN_BACKEND_URL;
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                const keys = await new Promise((resolve) => chrome.storage.local.get(['BACKEND_URL', 'backend_url', 'backend'], resolve));
                return keys && (keys.BACKEND_URL || keys.backend_url || keys.backend) ? (keys.BACKEND_URL || keys.backend_url || keys.backend) : null;
            }
        } catch (e) {
            // ignore and return null
        }
        return null;
    }

    async getSponsorData(placement) {
        if (!this.manifestCache) await this.fetchSponsorManifest();
        if (!this.manifestCache) return null;
        return { sponsors: (this.manifestCache.sponsors || []).filter(s => s.active && s.placement === placement) };
    }

    async loadAsset(ipfsHash) {
        if (this.assetCache.has(ipfsHash)) return this.assetCache.get(ipfsHash);
        const gateways = [
            'https://cloudflare-ipfs.com/ipfs/',
            'https://ipfs.io/ipfs/',
            'https://dweb.link/ipfs/',
            'https://gateway.pinata.cloud/ipfs/'
        ];
        for (const g of gateways) {
            try {
                const url = `${g}${ipfsHash}`;
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const signal = controller ? controller.signal : undefined;
                const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;
                const resp = await fetch(url, { signal, mode: 'cors' });
                if (timeoutId) clearTimeout(timeoutId);
                if (!resp.ok) continue;
                const blob = await resp.blob();
                const objectUrl = URL.createObjectURL(blob);
                this.assetCache.set(ipfsHash, objectUrl);
                return objectUrl;
            } catch (e) {
                // try next gateway
            }
        }
        const fallback = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        this.assetCache.set(ipfsHash, fallback);
        return fallback;
    }

    // Client-side uploads are disabled to avoid embedding Pinata keys
    async uploadAsset() {
        throw new Error('Client-side IPFS uploads are disabled. Use server-side upload endpoints.');
    }

    async uploadJSON() {
        throw new Error('Client-side IPFS uploads are disabled. Use server-side upload endpoints.');
    }

    async uploadSponsorManifest() {
        throw new Error('Client-side sponsor manifest upload disabled. Use a secure server endpoint to update the sponsor manifest.');
    }

    // Analytics helpers
    getAnalytics() {
        try { return JSON.parse(localStorage.getItem('ipfs_sponsor_analytics') || 'null') || { impressions: 0, clicks: 0, interactions: 0 }; } catch (e) { return { impressions:0, clicks:0, interactions:0 }; }
    }

    recordAnalytics(event, sponsorId, placement) {
        try {
            const analytics = this.getAnalytics();
            if (event === 'impression') analytics.impressions++; if (event === 'click') analytics.clicks++; if (event === 'interaction') analytics.interactions++;
            localStorage.setItem('ipfs_sponsor_analytics', JSON.stringify(analytics));
        } catch (e) { /* ignore */ }
    }

    clearCache() {
        this.assetCache.clear();
        this.manifestCache = null;
        if (this.csrfProtection && typeof this.csrfProtection.cleanupNonces === 'function') this.csrfProtection.cleanupNonces();
        if (typeof localStorage !== 'undefined') localStorage.removeItem('ipfs_sponsor_manifest');
    }

    async healthCheck() {
        const health = { initialized: this.isInitialized, manifestLoaded: !!this.manifestCache, cacheSize: this.assetCache.size, gatewayAccessible: false, lastUpdate: null };
        try { health.gatewayAccessible = await this.validateConnection(); } catch (e) { health.gatewayAccessible = false; }
        if (this.manifestCache) health.lastUpdate = this.manifestCache.updated || null;
        return health;
    }
}

if (typeof window !== 'undefined') window.IPFSAssetManager = IPFSAssetManager;
if (typeof module !== 'undefined' && module.exports) module.exports = IPFSAssetManager;
// End of IPFSAssetManager implementation

// Expose globally and for CommonJS if present
if (typeof window !== 'undefined') window.IPFSAssetManager = IPFSAssetManager;
if (typeof module !== 'undefined' && module.exports) module.exports = IPFSAssetManager;