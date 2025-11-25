/**
 * Configuration Setup Script
 * Run this once to initialize secure configuration in Chrome storage
 */

import config from './lib/config.js';

async function setupConfiguration() {
    try {
        console.log('🔧 Setting up BeatsChain configuration...');
        
        // Initialize config manager
        await config.initialize();
        
        // Set production-ready defaults (replace with real values)
        const configValues = {
            // Pinata IPFS Configuration
            PINATA_API_KEY: '039a88d61f538316a611', // Replace with real key
            PINATA_SECRET_KEY: '15d14b953368d4d5c830c6e05f4767d63443da92da3359a7223ae115315beb91', // Replace with real key
            
            // Thirdweb Configuration  
            THIRDWEB_CLIENT_ID: '0a51c6fdf5c54d8650380a82dd2b22ed', // Replace with real client ID
            
            // Blockchain Configuration
            RPC_URL: 'https://polygon-mumbai.g.alchemy.com/v2/demo',
            CONTRACT_ADDRESS: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
            
            // Security Configuration
            WALLET_ENCRYPTION_KEY: crypto.getRandomValues(new Uint8Array(32)).join(''),
            TEST_WALLET_PRIVATE_KEY: 'c0c71ecd72b802ba8f19cbe188b7e191f62889bf6adf3bb18265a626a5829171'
        };
        
        // Set all configuration values
        for (const [key, value] of Object.entries(configValues)) {
            await config.set(key, value);
            console.log(`✅ Set ${key}`);
        }
        
        console.log('🎉 Configuration setup complete!');
        console.log('📋 Configuration Summary:');
        
        const allConfig = await config.getAll();
        Object.keys(allConfig).forEach(key => {
            const value = allConfig[key];
            const displayValue = key.includes('KEY') || key.includes('SECRET') 
                ? `${value.substring(0, 8)}...` 
                : value;
            console.log(`   ${key}: ${displayValue}`);
        });
        
        return true;
    } catch (error) {
        console.error('❌ Configuration setup failed:', error);
        return false;
    }
}

// Export for use in other scripts
export { setupConfiguration };

// Auto-run if called directly
if (typeof window !== 'undefined' && window.location) {
    setupConfiguration();
}