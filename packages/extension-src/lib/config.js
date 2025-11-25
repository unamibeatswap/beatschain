/**
 * Configuration Manager - Non-Module Version
 * Provides configuration access without ES6 modules
 */

class ConfigManager {
    constructor() {
        this.cache = new Map();
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            // SECURITY FIX: Load from secure storage instead of hardcoded values
            const storedConfig = await chrome.storage.local.get([
                'PINATA_API_KEY', 'PINATA_SECRET_KEY', 'SOLANA_RPC_URL', 'SOLANA_PROGRAM_ID', 'RPC_URL'
            ]);
            
            const hardcodedConfig = {
                'PINATA_API_KEY': storedConfig.PINATA_API_KEY || '',
                'PINATA_SECRET_KEY': storedConfig.PINATA_SECRET_KEY || '',
                'SOLANA_RPC_URL': storedConfig.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
                'SOLANA_PROGRAM_ID': storedConfig.SOLANA_PROGRAM_ID || 'BeatsChainSolanaProgram11111111111111111111',
                'RPC_URL': storedConfig.RPC_URL || 'https://rpc.sepolia.org'
            };
            
            this.cache = new Map(Object.entries(hardcodedConfig));
            this.initialized = true;
            console.log('✅ Config Manager initialized');
        } catch (error) {
            console.error('Config initialization failed:', error);
            this.initialized = true;
        }
    }

    async get(key) {
        if (!this.initialized) await this.initialize();
        return this.cache.get(key);
    }

    async set(key, value) {
        if (!this.initialized) await this.initialize();
        this.cache.set(key, value);
    }
}

window.config = new ConfigManager();