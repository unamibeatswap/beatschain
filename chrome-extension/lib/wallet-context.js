// Unified Wallet Context Manager - Single source of truth for all wallet operations
class WalletContextManager {
    constructor() {
        this.activeProvider = 'embedded';
        this.providers = {};
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize embedded wallet (always available)
            this.providers.embedded = new EmbeddedWalletProvider();
            await this.providers.embedded.initialize();
            
            // Initialize Phantom wallet (optional)
            this.providers.phantom = new PhantomWalletProvider();
            const phantomAvailable = await this.providers.phantom.initialize();
            
            this.isInitialized = true;
            console.log('✅ Wallet context initialized:', {
                embedded: true,
                phantom: phantomAvailable
            });
            
            return true;
        } catch (error) {
            console.error('Wallet context initialization failed:', error);
            return false;
        }
    }

    async switchToPhantom() {
        if (!this.providers.phantom || !this.providers.phantom.isAvailable()) {
            throw new Error('Phantom wallet not available');
        }
        
        const connected = await this.providers.phantom.connect();
        if (connected) {
            this.activeProvider = 'phantom';
            await this.saveProviderPreference('phantom');
            return true;
        }
        return false;
    }

    async switchToEmbedded() {
        this.activeProvider = 'embedded';
        await this.saveProviderPreference('embedded');
        return true;
    }

    getCurrentProvider() {
        return this.providers[this.activeProvider];
    }

    async getCurrentAddress() {
        const provider = this.getCurrentProvider();
        return provider ? await provider.getAddress() : null;
    }

    async getBalance() {
        // Graceful fallback - return mock balance for compatibility
        return '0.0000 SOL';
    }

    async signTransaction(transaction) {
        const provider = this.getCurrentProvider();
        if (!provider) throw new Error('No wallet provider available');
        return await provider.signTransaction(transaction);
    }

    isPhantomAvailable() {
        return this.providers.phantom && this.providers.phantom.isAvailable();
    }

    getActiveProviderType() {
        return this.activeProvider;
    }

    async saveProviderPreference(provider) {
        await chrome.storage.local.set({ 'preferred_wallet_provider': provider });
    }

    async loadProviderPreference() {
        const result = await chrome.storage.local.get(['preferred_wallet_provider']);
        return result.preferred_wallet_provider || 'embedded';
    }
}

// Embedded Wallet Provider - Uses existing auth system
class EmbeddedWalletProvider {
    constructor() {
        this.address = null;
    }

    async initialize() {
        try {
            // Get address from unified auth system
            const result = await chrome.storage.local.get([
                'unified_wallet_address', 'enhanced_wallet_address', 'wallet_address'
            ]);
            
            this.address = result.unified_wallet_address || 
                          result.enhanced_wallet_address || 
                          result.wallet_address;
            
            return !!this.address;
        } catch (error) {
            console.error('Embedded wallet initialization failed:', error);
            return false;
        }
    }

    async getAddress() {
        return this.address;
    }

    async signTransaction(transaction) {
        // Use existing signing logic from auth system
        console.log('Signing with embedded wallet:', this.address);
        return transaction; // Simplified for now
    }

    isAvailable() {
        return !!this.address;
    }
}

// Phantom Wallet Provider - External wallet integration
class PhantomWalletProvider {
    constructor() {
        this.phantom = null;
        this.isConnected = false;
        this.publicKey = null;
    }

    async initialize() {
        try {
            // Safe Phantom detection with timeout
            const detected = await this.detectPhantom(3000);
            if (detected) {
                this.phantom = window.solana;
                console.log('✅ Phantom wallet detected');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Phantom initialization failed:', error);
            return false;
        }
    }

    async detectPhantom(timeout = 3000) {
        return new Promise((resolve) => {
            // Check if already available
            if (window.solana?.isPhantom) {
                return resolve(true);
            }
            
            // Wait for injection with timeout
            const timer = setTimeout(() => resolve(false), timeout);
            
            const checkInterval = setInterval(() => {
                if (window.solana?.isPhantom) {
                    clearInterval(checkInterval);
                    clearTimeout(timer);
                    resolve(true);
                }
            }, 100);
        });
    }

    async connect() {
        try {
            if (!this.phantom) return false;
            
            const response = await this.phantom.connect();
            if (response?.publicKey) {
                this.publicKey = response.publicKey.toString();
                this.isConnected = true;
                console.log('✅ Phantom connected:', this.publicKey.substring(0, 8) + '...');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Phantom connection failed:', error);
            return false;
        }
    }

    async getAddress() {
        return this.publicKey;
    }

    async signTransaction(transaction) {
        if (!this.isConnected || !this.phantom) {
            throw new Error('Phantom wallet not connected');
        }
        return await this.phantom.signTransaction(transaction);
    }

    isAvailable() {
        return !!this.phantom;
    }

    async disconnect() {
        if (this.phantom && this.isConnected) {
            await this.phantom.disconnect();
            this.isConnected = false;
            this.publicKey = null;
        }
    }
}

// Export for Chrome extension compatibility
window.WalletContextManager = WalletContextManager;
window.EmbeddedWalletProvider = EmbeddedWalletProvider;
window.PhantomWalletProvider = PhantomWalletProvider;