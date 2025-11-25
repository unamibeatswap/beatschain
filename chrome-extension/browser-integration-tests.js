
// BeatsChain Browser Integration Tests
// Run these in the browser console to test live functionality

class BrowserIntegrationTester {
    async testThirdwebManager() {
        console.log('🔍 Testing ThirdwebManager...');
        
        if (typeof ThirdwebManager === 'undefined') {
            console.error('❌ ThirdwebManager not found');
            return false;
        }
        
        const manager = new ThirdwebManager();
        console.log('✅ ThirdwebManager instantiated');
        
        // Test network switching
        manager.setNetwork('solana');
        console.log('Network set to:', manager.getNetwork());
        
        manager.setNetwork('ethereum');
        console.log('Network set to:', manager.getNetwork());
        
        return true;
    }
    
    async testSolanaIntegration() {
        console.log('🔍 Testing Solana Integration...');
        
        if (typeof SolanaIntegration === 'undefined') {
            console.error('❌ SolanaIntegration not found');
            return false;
        }
        
        const solana = new SolanaIntegration();
        console.log('✅ SolanaIntegration instantiated');
        
        try {
            const initialized = await solana.initialize();
            console.log('Solana initialized:', initialized);
            
            if (initialized) {
                const cost = await solana.estimateTransactionCost();
                console.log('Transaction cost estimate:', cost);
            }
        } catch (error) {
            console.error('Solana test error:', error);
        }
        
        return true;
    }
    
    async testBlockchainSelector() {
        console.log('🔍 Testing Blockchain Selector...');
        
        const selector = document.querySelector('.blockchain-selector');
        if (!selector) {
            console.error('❌ Blockchain selector not found in DOM');
            return false;
        }
        
        const ethereumRadio = document.querySelector('input[name="blockchain"][value="ethereum"]');
        const solanaRadio = document.querySelector('input[name="blockchain"][value="solana"]');
        
        if (ethereumRadio && solanaRadio) {
            console.log('✅ Both blockchain options found');
            
            // Test switching
            solanaRadio.click();
            console.log('Switched to Solana');
            
            ethereumRadio.click();
            console.log('Switched to Ethereum');
            
            return true;
        } else {
            console.error('❌ Blockchain radio buttons not found');
            return false;
        }
    }
    
    async testWalletIntegration() {
        console.log('🔍 Testing Wallet Integration...');
        
        if (typeof SolanaWalletManager === 'undefined') {
            console.error('❌ SolanaWalletManager not found');
            return false;
        }
        
        try {
            const wallet = new SolanaWalletManager();
            await wallet.initialize();
            
            const publicKey = wallet.getPublicKey();
            const balance = await wallet.getBalance();
            
            console.log('✅ Solana wallet:', publicKey.substring(0, 8) + '...');
            console.log('✅ Balance:', balance, 'SOL');
            
            return true;
        } catch (error) {
            console.error('❌ Wallet test error:', error);
            return false;
        }
    }
    
    async runAllTests() {
        console.log('🚀 Running Browser Integration Tests...');
        console.log('=' .repeat(50));
        
        const results = {
            thirdweb: await this.testThirdwebManager(),
            solana: await this.testSolanaIntegration(),
            selector: await this.testBlockchainSelector(),
            wallet: await this.testWalletIntegration()
        };
        
        const passed = Object.values(results).filter(r => r).length;
        const total = Object.keys(results).length;
        
        console.log('=' .repeat(50));
        console.log(`📊 Browser Tests: ${passed}/${total} passed`);
        
        if (passed === total) {
            console.log('🎉 All browser tests passed!');
        } else {
            console.log('⚠️ Some browser tests failed - check console for details');
        }
        
        return results;
    }
}

// Auto-run tests when loaded
const browserTester = new BrowserIntegrationTester();
browserTester.runAllTests();
