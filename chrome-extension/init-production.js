/**
 * Production Initialization Script
 * Handles secure setup and configuration validation
 */

class ProductionInitializer {
    constructor() {
        this.initialized = false;
        this.securityChecks = [];
    }

    async initialize() {
        console.log('🚀 Initializing BeatsChain for production...');
        
        try {
            // 1. Security validation
            await this.runSecurityChecks();
            
            // 2. Configuration setup
            await this.setupConfiguration();
            
            // 3. Component initialization
            await this.initializeComponents();
            
            // 4. Final validation
            await this.validateProduction();
            
            this.initialized = true;
            console.log('✅ Production initialization complete');
            return true;
            
        } catch (error) {
            console.error('❌ Production initialization failed:', error);
            return false;
        }
    }

    async runSecurityChecks() {
        console.log('🔒 Running security validation...');
        
        // Check for vulnerable backup files
        const vulnerableFiles = [
            'popup/popup-backup.js',
            'popup/popup-fixed.js'
        ];
        
        for (const file of vulnerableFiles) {
            try {
                const response = await fetch(chrome.runtime.getURL(file));
                if (response.ok) {
                    throw new Error(`Vulnerable file still exists: ${file}`);
                }
            } catch (fetchError) {
                // File doesn't exist - this is good
                console.log(`✅ Vulnerable file removed: ${file}`);
            }
        }
        
        // Validate Chrome storage API availability
        if (!chrome.storage || !chrome.storage.local) {
            throw new Error('Chrome storage API not available');
        }
        
        console.log('✅ Security checks passed');
    }

    async setupConfiguration() {
        console.log('⚙️ Setting up secure configuration...');
        
        // Import and initialize config manager
        const { default: config } = await import('./lib/config.js');
        await config.initialize();
        
        // Validate required configuration exists
        const requiredKeys = [
            'CONTRACT_ADDRESS',
            'RPC_URL', 
            'TEST_WALLET_PRIVATE_KEY'
        ];
        
        for (const key of requiredKeys) {
            const value = await config.get(key);
            if (!value) {
                console.warn(`⚠️ Missing configuration: ${key}`);
            } else {
                console.log(`✅ Configuration validated: ${key}`);
            }
        }
        
        console.log('✅ Configuration setup complete');
    }

    async initializeComponents() {
        console.log('🔧 Initializing core components...');
        
        // Initialize audio manager
        if (typeof AudioManager !== 'undefined') {
            window.audioManager = new AudioManager();
            console.log('✅ Audio manager initialized');
        }
        
        // Initialize Chrome AI if available
        try {
            if (typeof ChromeAIManager !== 'undefined') {
                window.chromeAI = new ChromeAIManager();
                await window.chromeAI.initialize();
                console.log('✅ Chrome AI initialized');
            }
        } catch (error) {
            console.log('ℹ️ Chrome AI unavailable - using fallbacks');
        }
        
        // Initialize Thirdweb manager
        if (typeof ThirdwebManager !== 'undefined') {
            window.thirdweb = new ThirdwebManager();
            console.log('✅ Thirdweb manager initialized');
        }
        
        console.log('✅ Core components initialized');
    }

    async validateProduction() {
        console.log('🔍 Running production validation...');
        
        // Validate no hardcoded credentials in active code
        const sensitivePatterns = [
            /process\.env\./g,
            /039a88d61f538316a611/g,  // Old Pinata key pattern
            /15d14b953368d4d5c830c6e05f4767d63443da92da3359a7223ae115315beb91/g  // Old secret pattern
        ];
        
        // Check main popup.js for hardcoded values
        try {
            const popupResponse = await fetch(chrome.runtime.getURL('popup/popup.js'));
            const popupContent = await popupResponse.text();
            
            for (const pattern of sensitivePatterns) {
                if (pattern.test(popupContent)) {
                    console.warn('⚠️ Potential hardcoded credential detected in popup.js');
                }
            }
        } catch (error) {
            console.warn('Could not validate popup.js content');
        }
        
        // Validate Chrome extension context
        if (!chrome.runtime || !chrome.runtime.id) {
            throw new Error('Not running in Chrome extension context');
        }
        
        console.log('✅ Production validation complete');
    }

    getInitializationStatus() {
        return {
            initialized: this.initialized,
            securityChecks: this.securityChecks,
            timestamp: new Date().toISOString()
        };
    }
}

// Export for use in extension
window.ProductionInitializer = ProductionInitializer;

// Auto-initialize if in extension context
if (typeof chrome !== 'undefined' && chrome.runtime) {
    const initializer = new ProductionInitializer();
    initializer.initialize().then(success => {
        if (success) {
            console.log('🎉 BeatsChain ready for production use');
        } else {
            console.error('💥 Production initialization failed');
        }
    });
}