/**
 * Secure Configuration Manager for Chrome Extensions
 * Replaces .env file approach with secure Chrome storage
 */

class SecureConfigManager {
    constructor() {
        this.cache = new Map();
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            // Load from Chrome storage (set during installation/setup)
            const stored = await chrome.storage.local.get([
                'THIRDWEB_CLIENT_ID',
                'PINATA_API_KEY', 
                'PINATA_SECRET_KEY',
                'GOOGLE_CLIENT_ID',
                'CONTRACT_ADDRESS',
                'RPC_URL',
                'WALLET_ENCRYPTION_KEY'
            ]);

            // Set secure defaults (no sensitive data)
            const defaults = {
                CONTRACT_ADDRESS: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
                RPC_URL: 'https://rpc.ankr.com/polygon_mumbai',
                GOOGLE_CLIENT_ID: '239753403483-d62qtbm41d29p7ldikackdrru77vd1g5.apps.googleusercontent.com',
                // Sensitive keys should be set via setup process, not defaults
                THIRDWEB_CLIENT_ID: stored.THIRDWEB_CLIENT_ID || '',
                PINATA_API_KEY: stored.PINATA_API_KEY || '',
                PINATA_SECRET_KEY: stored.PINATA_SECRET_KEY || '',
                WALLET_ENCRYPTION_KEY: stored.WALLET_ENCRYPTION_KEY || this.generateSecureKey()
            };

            // Merge stored values with defaults
            Object.entries(defaults).forEach(([key, value]) => {
                this.cache.set(key, stored[key] || value);
            });

            this.initialized = true;
        } catch (error) {
            console.error('Secure config initialization failed:', error);
            throw error;
        }
    }

    async get(key) {
        if (!this.initialized) await this.initialize();
        return this.cache.get(key);
    }

    async set(key, value) {
        if (!this.initialized) await this.initialize();
        
        this.cache.set(key, value);
        await chrome.storage.local.set({ [key]: value });
    }

    generateSecureKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Setup method for initial configuration (called from options page)
    async setupCredentials(credentials) {
        const validatedCreds = this.validateCredentials(credentials);
        await chrome.storage.local.set(validatedCreds);
        await this.initialize(); // Refresh cache
    }

    validateCredentials(creds) {
        const validated = {};
        
        if (creds.THIRDWEB_CLIENT_ID && /^[a-f0-9]{32}$/.test(creds.THIRDWEB_CLIENT_ID)) {
            validated.THIRDWEB_CLIENT_ID = creds.THIRDWEB_CLIENT_ID;
        }
        
        if (creds.PINATA_API_KEY && creds.PINATA_API_KEY.length > 10) {
            validated.PINATA_API_KEY = creds.PINATA_API_KEY;
        }
        
        if (creds.PINATA_SECRET_KEY && creds.PINATA_SECRET_KEY.length > 20) {
            validated.PINATA_SECRET_KEY = creds.PINATA_SECRET_KEY;
        }
        
        return validated;
    }
}

// Singleton instance
const secureConfig = new SecureConfigManager();
export default secureConfig;