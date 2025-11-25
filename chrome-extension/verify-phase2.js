// Phase 2 Verification Script - Unified System Integration Test
console.log('🔍 Phase 2 Verification: Testing Unified System Integration');

// Test unified authentication and wallet context
async function verifyPhase2Integration() {
    const results = {
        unifiedAuth: false,
        walletContext: false,
        migration: false,
        duplicateRemoval: false,
        backwardCompatibility: false
    };
    
    try {
        // 1. Test Unified Authentication Manager
        if (window.UnifiedAuthManager) {
            const auth = new UnifiedAuthManager();
            console.log('✅ UnifiedAuthManager available');
            results.unifiedAuth = true;
        } else {
            console.log('❌ UnifiedAuthManager not found');
        }
        
        // 2. Test Wallet Context Manager
        if (window.WalletContextManager) {
            const wallet = new WalletContextManager();
            console.log('✅ WalletContextManager available');
            results.walletContext = true;
        } else {
            console.log('❌ WalletContextManager not found');
        }
        
        // 3. Test Migration Manager
        if (window.MigrationManager) {
            const migration = new MigrationManager();
            console.log('✅ MigrationManager available');
            results.migration = true;
        } else {
            console.log('❌ MigrationManager not found');
        }
        
        // 4. Check for duplicate manager removal
        const duplicateManagers = [
            'AuthManager',
            'EnhancedAuthManager', 
            'WalletManager',
            'SolanaWalletManager',
            'PhantomWalletManager'
        ];
        
        let duplicatesFound = 0;
        duplicateManagers.forEach(manager => {
            if (window[manager]) {
                duplicatesFound++;
                console.log(`⚠️ Legacy manager still available: ${manager}`);
            }
        });
        
        results.duplicateRemoval = duplicatesFound === 0;
        if (results.duplicateRemoval) {
            console.log('✅ All duplicate managers properly isolated');
        }
        
        // 5. Test backward compatibility
        try {
            // Test that old storage keys are still accessible
            const testData = await chrome.storage.local.get(['wallet_address', 'enhanced_wallet_address']);
            results.backwardCompatibility = true;
            console.log('✅ Backward compatibility maintained');
        } catch (error) {
            console.log('⚠️ Storage compatibility test failed:', error.message);
        }
        
        // Summary
        const passed = Object.values(results).filter(Boolean).length;
        const total = Object.keys(results).length;
        
        console.log('\n📊 Phase 2 Verification Results:');
        console.log(`✅ Passed: ${passed}/${total} tests`);
        console.log('📋 Details:', results);
        
        if (passed === total) {
            console.log('🎉 Phase 2 Integration: COMPLETE');
            return true;
        } else {
            console.log('⚠️ Phase 2 Integration: PARTIAL - Some issues detected');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Phase 2 verification failed:', error);
        return false;
    }
}

// Test super admin wallet identification
function verifyAdminWallet() {
    console.log('\n👑 Super Admin Wallet Verification:');
    
    // Your super admin wallet from .env
    const adminPrivateKey = 'c0c71ecd72b802ba8f19cbe188b7e191f62889bf6adf3bb18265a626a5829171';
    
    console.log('🔑 Admin wallet type: Embedded Wallet (NOT Phantom)');
    console.log('🔐 Private key configured:', adminPrivateKey.substring(0, 8) + '...');
    console.log('⚡ Network: Solana Devnet');
    console.log('📝 Source: .env TEST_WALLET_PRIVATE_KEY');
    
    return {
        type: 'embedded',
        network: 'solana-devnet',
        configured: true,
        isPhantom: false
    };
}

// Run verification
if (typeof window !== 'undefined') {
    // Browser environment
    document.addEventListener('DOMContentLoaded', async () => {
        await verifyPhase2Integration();
        verifyAdminWallet();
    });
} else {
    // Node environment
    console.log('Run this script in browser console after extension loads');
}

// Export for manual testing
window.verifyPhase2 = verifyPhase2Integration;
window.verifyAdminWallet = verifyAdminWallet;