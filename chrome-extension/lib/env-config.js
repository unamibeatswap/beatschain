// Environment Configuration Loader
class EnvConfigLoader {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    async loadConfig() {
        if (this.loaded) {
            return this.config;
        }

        try {
            // Production configuration with real wallet
            this.config = {
                // Solana Configuration
                SOLANA_NETWORK: 'devnet',
                SOLANA_RPC_URL: 'https://api.devnet.solana.com',
                SOLANA_MAINNET_RPC_URL: 'https://api.mainnet-beta.solana.com',
                SOLANA_PROGRAM_ID: 'BeatsChainSolanaProgram11111111111111111111',
                METAPLEX_PROGRAM_ID: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',

                // Google OAuth2 Configuration - Updated for production
                GOOGLE_CLIENT_ID: '239753403483-58n7vlbvs1nsu9qnf1qmoenh2cjjimbc.apps.googleusercontent.com',

                // IPFS Configuration
                NEXT_PUBLIC_IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
                PINATA_API_KEY: '', // SECURITY FIX: Removed hardcoded credentials
                PINATA_SECRET_KEY: '', // SECURITY FIX: Removed hardcoded credentials

                // Security Configuration - SECURITY FIX: Generate secure keys dynamically
                WALLET_ENCRYPTION_KEY: this.generateSecureKey(),
                TEST_WALLET_PRIVATE_KEY: '', // SECURITY FIX: Removed hardcoded private key
                ADMIN_WALLET_ADDRESS: '' // SECURITY FIX: Removed hardcoded address
            };

            // Make config globally available
            window.envConfig = this.config;
            this.loaded = true;

            console.log('✅ Environment configuration loaded with production settings');
            return this.config;

        } catch (error) {
            console.error('❌ Failed to load environment configuration:', error);
            
            // Fallback configuration - SECURITY FIX: No hardcoded credentials
            this.config = {
                TEST_WALLET_PRIVATE_KEY: '',
                ADMIN_WALLET_ADDRESS: ''
            };
            
            window.envConfig = this.config;
            this.loaded = true;
            
            return this.config;
        }
    }

    getConfig(key) {
        if (!this.loaded) {
            console.warn('⚠️ Config not loaded yet, call loadConfig() first');
            return null;
        }
        return this.config[key];
    }

    generateSecureKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    isProduction() {
        return this.config && this.loaded;
    }
}

// Initialize and load configuration immediately
const envConfigLoader = new EnvConfigLoader();
envConfigLoader.loadConfig();

// Export for use in other modules
window.EnvConfigLoader = EnvConfigLoader;
window.envConfigLoader = envConfigLoader;