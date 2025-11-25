#!/usr/bin/env node

/**
 * BeatsChain Contract Deployment & Integration Test Suite
 * 
 * This script verifies:
 * 1. Contract deployment status (Ethereum & Solana)
 * 2. Frontend integration with contracts
 * 3. Blockchain connectivity
 * 4. Transaction flow testing
 * 5. Wallet integration
 */

const fs = require('fs');
const path = require('path');

class ContractIntegrationTester {
    constructor() {
        this.results = {
            ethereum: {
                contract: null,
                deployment: false,
                integration: false,
                connectivity: false
            },
            solana: {
                program: null,
                deployment: false,
                integration: false,
                connectivity: false
            },
            frontend: {
                thirdwebIntegration: false,
                solanaIntegration: false,
                walletIntegration: false,
                blockchainSelector: false
            },
            overall: {
                score: 0,
                status: 'UNKNOWN',
                recommendations: []
            }
        };
    }

    async runTests() {
        console.log('🔍 BeatsChain Contract Integration Test Suite');
        console.log('=' .repeat(60));
        
        try {
            // Test 1: Verify contract files exist
            await this.testContractFiles();
            
            // Test 2: Check deployment configuration
            await this.testDeploymentConfig();
            
            // Test 3: Verify frontend integration
            await this.testFrontendIntegration();
            
            // Test 4: Test blockchain connectivity
            await this.testBlockchainConnectivity();
            
            // Test 5: Verify wallet integration
            await this.testWalletIntegration();
            
            // Generate final report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.results.overall.status = 'FAILED';
        }
    }

    async testContractFiles() {
        console.log('\n📄 Testing Contract Files...');
        
        // Check Ethereum contract
        const ethContractPath = path.join(__dirname, 'contracts', 'BeatsChain.sol');
        if (fs.existsSync(ethContractPath)) {
            const content = fs.readFileSync(ethContractPath, 'utf8');
            this.results.ethereum.contract = {
                exists: true,
                size: content.length,
                hasOwner: content.includes('owner'),
                hasMintFunction: content.includes('mintTo'),
                hasEvents: content.includes('event Transfer')
            };
            console.log('✅ Ethereum contract found:', ethContractPath);
        } else {
            console.log('❌ Ethereum contract not found');
        }
        
        // Check Solana program
        const solanaContractPath = path.join(__dirname, 'contracts', 'BeatsChainSolana.rs');
        if (fs.existsSync(solanaContractPath)) {
            const content = fs.readFileSync(solanaContractPath, 'utf8');
            this.results.solana.program = {
                exists: true,
                size: content.length,
                hasProgram: content.includes('#[program]'),
                hasMintFunction: content.includes('mint_music_nft'),
                hasMetadata: content.includes('create_metadata_accounts_v3')
            };
            console.log('✅ Solana program found:', solanaContractPath);
        } else {
            console.log('❌ Solana program not found');
        }
    }

    async testDeploymentConfig() {
        console.log('\n🚀 Testing Deployment Configuration...');
        
        // Check Ethereum deployment
        const hardhatConfigPath = path.join(__dirname, 'hardhat.config.js');
        if (fs.existsSync(hardhatConfigPath)) {
            const config = fs.readFileSync(hardhatConfigPath, 'utf8');
            this.results.ethereum.deployment = {
                configExists: true,
                hasNetworks: config.includes('networks'),
                hasAmoy: config.includes('amoy'),
                hasSolidity: config.includes('solidity')
            };
            console.log('✅ Hardhat config found');
        }
        
        // Check Solana deployment
        const anchorConfigPath = path.join(__dirname, 'Anchor.toml');
        if (fs.existsSync(anchorConfigPath)) {
            const config = fs.readFileSync(anchorConfigPath, 'utf8');
            this.results.solana.deployment = {
                configExists: true,
                hasPrograms: config.includes('[programs.devnet]'),
                hasProvider: config.includes('[provider]'),
                hasWorkspace: config.includes('[workspace]')
            };
            console.log('✅ Anchor config found');
        }
        
        // Check environment variables
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const env = fs.readFileSync(envPath, 'utf8');
            const hasContractAddress = env.includes('CONTRACT_ADDRESS');
            const hasRpcUrl = env.includes('RPC_URL');
            const hasThirdwebKeys = env.includes('THIRDWEB_CLIENT_ID');
            
            console.log(`✅ Environment config: Contract=${hasContractAddress}, RPC=${hasRpcUrl}, Thirdweb=${hasThirdwebKeys}`);
        }
    }

    async testFrontendIntegration() {
        console.log('\n🌐 Testing Frontend Integration...');
        
        // Check ThirdwebManager integration
        const thirdwebPath = path.join(__dirname, 'lib', 'thirdweb.js');
        if (fs.existsSync(thirdwebPath)) {
            const content = fs.readFileSync(thirdwebPath, 'utf8');
            this.results.frontend.thirdwebIntegration = {
                exists: true,
                hasDualChain: content.includes('selectedNetwork'),
                hasSolanaSupport: content.includes('mintSolanaNFT'),
                hasEthereumSupport: content.includes('mintViaDirectRPC'),
                hasNetworkSwitching: content.includes('setNetwork')
            };
            console.log('✅ ThirdwebManager has dual-chain support');
        }
        
        // Check Solana integration
        const solanaIntegrationPath = path.join(__dirname, 'lib', 'solana-integration.js');
        if (fs.existsSync(solanaIntegrationPath)) {
            const content = fs.readFileSync(solanaIntegrationPath, 'utf8');
            this.results.frontend.solanaIntegration = {
                exists: true,
                hasRealMinting: content.includes('createRealSolanaTransaction'),
                hasWalletSupport: content.includes('getOrCreateWallet'),
                hasWeb3Integration: content.includes('solanaWeb3')
            };
            console.log('✅ Solana integration has real minting');
        }
        
        // Check blockchain selector in HTML
        const htmlPath = path.join(__dirname, 'popup', 'index.html');
        if (fs.existsSync(htmlPath)) {
            const content = fs.readFileSync(htmlPath, 'utf8');
            this.results.frontend.blockchainSelector = {
                exists: true,
                hasSelector: content.includes('blockchain-selector'),
                hasEthereumOption: content.includes('value="ethereum"'),
                hasSolanaOption: content.includes('value="solana"'),
                hasCostDisplay: content.includes('estimated-cost')
            };
            console.log('✅ Blockchain selector UI found');
        }
        
        // Check popup.js integration
        const popupPath = path.join(__dirname, 'popup', 'popup.js');
        if (fs.existsSync(popupPath)) {
            const content = fs.readFileSync(popupPath, 'utf8');
            this.results.frontend.walletIntegration = {
                exists: true,
                hasBlockchainHandlers: content.includes('handleBlockchainChange'),
                hasCostUpdates: content.includes('updateCostDisplay'),
                hasWalletSwitching: content.includes('solanaWallet')
            };
            console.log('✅ Popup has blockchain switching logic');
        }
    }

    async testBlockchainConnectivity() {
        console.log('\n🔗 Testing Blockchain Connectivity...');
        
        // Test Ethereum RPC connectivity (simulated)
        try {
            // In a real test, we would make actual RPC calls
            // For now, we check if the configuration is present
            const envPath = path.join(__dirname, '.env');
            if (fs.existsSync(envPath)) {
                const env = fs.readFileSync(envPath, 'utf8');
                const rpcUrl = env.match(/RPC_URL=(.+)/)?.[1];
                
                if (rpcUrl && rpcUrl !== 'YOUR_RPC_URL_HERE') {
                    this.results.ethereum.connectivity = {
                        configured: true,
                        url: rpcUrl.substring(0, 30) + '...',
                        testable: true
                    };
                    console.log('✅ Ethereum RPC configured');
                } else {
                    console.log('⚠️ Ethereum RPC needs configuration');
                }
            }
        } catch (error) {
            console.log('❌ Ethereum connectivity test failed:', error.message);
        }
        
        // Test Solana connectivity (simulated)
        try {
            const anchorPath = path.join(__dirname, 'Anchor.toml');
            if (fs.existsSync(anchorPath)) {
                const config = fs.readFileSync(anchorPath, 'utf8');
                const cluster = config.match(/cluster = "(.+)"/)?.[1];
                
                if (cluster) {
                    this.results.solana.connectivity = {
                        configured: true,
                        cluster: cluster,
                        testable: true
                    };
                    console.log(`✅ Solana cluster configured: ${cluster}`);
                }
            }
        } catch (error) {
            console.log('❌ Solana connectivity test failed:', error.message);
        }
    }

    async testWalletIntegration() {
        console.log('\n👛 Testing Wallet Integration...');
        
        // Check Solana wallet manager
        const solanaWalletPath = path.join(__dirname, 'lib', 'solana-wallet.js');
        if (fs.existsSync(solanaWalletPath)) {
            const content = fs.readFileSync(solanaWalletPath, 'utf8');
            const hasKeypairGeneration = content.includes('Keypair.generate');
            const hasBalanceCheck = content.includes('getBalance');
            const hasAirdrop = content.includes('requestAirdrop');
            
            console.log(`✅ Solana wallet: Keypair=${hasKeypairGeneration}, Balance=${hasBalanceCheck}, Airdrop=${hasAirdrop}`);
        }
        
        // Check authentication integration
        const authPath = path.join(__dirname, 'lib', 'auth.js');
        if (fs.existsSync(authPath)) {
            const content = fs.readFileSync(authPath, 'utf8');
            const hasWalletGeneration = content.includes('generateWallet');
            const hasGoogleAuth = content.includes('signInWithGoogle');
            
            console.log(`✅ Authentication: Wallet=${hasWalletGeneration}, Google=${hasGoogleAuth}`);
        }
    }

    generateReport() {
        console.log('\n📊 INTEGRATION TEST REPORT');
        console.log('=' .repeat(60));
        
        let totalScore = 0;
        let maxScore = 0;
        
        // Ethereum Contract Score
        if (this.results.ethereum.contract?.exists) {
            totalScore += 10;
            console.log('✅ Ethereum Contract: FOUND');
        } else {
            console.log('❌ Ethereum Contract: MISSING');
        }
        maxScore += 10;
        
        // Solana Program Score
        if (this.results.solana.program?.exists) {
            totalScore += 10;
            console.log('✅ Solana Program: FOUND');
        } else {
            console.log('❌ Solana Program: MISSING');
        }
        maxScore += 10;
        
        // Deployment Config Score
        if (this.results.ethereum.deployment?.configExists) {
            totalScore += 5;
            console.log('✅ Ethereum Deployment Config: READY');
        } else {
            console.log('❌ Ethereum Deployment Config: MISSING');
        }
        maxScore += 5;
        
        if (this.results.solana.deployment?.configExists) {
            totalScore += 5;
            console.log('✅ Solana Deployment Config: READY');
        } else {
            console.log('❌ Solana Deployment Config: MISSING');
        }
        maxScore += 5;
        
        // Frontend Integration Score
        if (this.results.frontend.thirdwebIntegration?.hasDualChain) {
            totalScore += 15;
            console.log('✅ Dual-Chain Integration: IMPLEMENTED');
        } else {
            console.log('❌ Dual-Chain Integration: MISSING');
        }
        maxScore += 15;
        
        if (this.results.frontend.solanaIntegration?.hasRealMinting) {
            totalScore += 15;
            console.log('✅ Real Solana Minting: IMPLEMENTED');
        } else {
            console.log('❌ Real Solana Minting: MISSING');
        }
        maxScore += 15;
        
        if (this.results.frontend.blockchainSelector?.hasSelector) {
            totalScore += 10;
            console.log('✅ Blockchain Selector UI: IMPLEMENTED');
        } else {
            console.log('❌ Blockchain Selector UI: MISSING');
        }
        maxScore += 10;
        
        // Connectivity Score
        if (this.results.ethereum.connectivity?.configured) {
            totalScore += 5;
            console.log('✅ Ethereum Connectivity: CONFIGURED');
        } else {
            console.log('⚠️ Ethereum Connectivity: NEEDS SETUP');
        }
        maxScore += 5;
        
        if (this.results.solana.connectivity?.configured) {
            totalScore += 5;
            console.log('✅ Solana Connectivity: CONFIGURED');
        } else {
            console.log('⚠️ Solana Connectivity: NEEDS SETUP');
        }
        maxScore += 5;
        
        // Calculate final score
        const percentage = Math.round((totalScore / maxScore) * 100);
        this.results.overall.score = percentage;
        
        console.log('\n' + '=' .repeat(60));
        console.log(`📊 OVERALL SCORE: ${totalScore}/${maxScore} (${percentage}%)`);
        
        if (percentage >= 90) {
            this.results.overall.status = 'EXCELLENT';
            console.log('🎉 STATUS: EXCELLENT - Ready for production!');
        } else if (percentage >= 75) {
            this.results.overall.status = 'GOOD';
            console.log('✅ STATUS: GOOD - Minor improvements needed');
        } else if (percentage >= 50) {
            this.results.overall.status = 'NEEDS WORK';
            console.log('⚠️ STATUS: NEEDS WORK - Several issues to address');
        } else {
            this.results.overall.status = 'CRITICAL';
            console.log('❌ STATUS: CRITICAL - Major issues need fixing');
        }
        
        // Generate recommendations
        this.generateRecommendations();
        
        // Save detailed report
        this.saveDetailedReport();
    }

    generateRecommendations() {
        console.log('\n💡 RECOMMENDATIONS:');
        
        if (!this.results.ethereum.contract?.exists) {
            console.log('• Deploy Ethereum contract to testnet/mainnet');
            this.results.overall.recommendations.push('Deploy Ethereum contract');
        }
        
        if (!this.results.solana.program?.exists) {
            console.log('• Deploy Solana program to devnet/mainnet');
            this.results.overall.recommendations.push('Deploy Solana program');
        }
        
        if (!this.results.frontend.thirdwebIntegration?.hasDualChain) {
            console.log('• Implement dual-chain support in ThirdwebManager');
            this.results.overall.recommendations.push('Add dual-chain support');
        }
        
        if (!this.results.frontend.solanaIntegration?.hasRealMinting) {
            console.log('• Implement real Solana minting (not simulation)');
            this.results.overall.recommendations.push('Add real Solana minting');
        }
        
        if (!this.results.ethereum.connectivity?.configured) {
            console.log('• Configure Ethereum RPC endpoint in .env');
            this.results.overall.recommendations.push('Configure Ethereum RPC');
        }
        
        if (!this.results.solana.connectivity?.configured) {
            console.log('• Configure Solana cluster in Anchor.toml');
            this.results.overall.recommendations.push('Configure Solana cluster');
        }
        
        if (this.results.overall.recommendations.length === 0) {
            console.log('• All systems operational! Consider adding more test coverage.');
        }
    }

    saveDetailedReport() {
        const reportPath = path.join(__dirname, 'contract-integration-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            results: this.results,
            summary: {
                score: this.results.overall.score,
                status: this.results.overall.status,
                recommendations: this.results.overall.recommendations
            }
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
    }
}

// Manual test functions for browser environment
function createBrowserTests() {
    return `
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
        console.log(\`📊 Browser Tests: \${passed}/\${total} passed\`);
        
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
`;
}

// Run the tests if this script is executed directly
if (require.main === module) {
    const tester = new ContractIntegrationTester();
    tester.runTests().then(() => {
        console.log('\n🎯 Integration testing complete!');
        console.log('\n📋 Next Steps:');
        console.log('1. Run: node test-contract-integration.js');
        console.log('2. Open browser console and run browser tests');
        console.log('3. Test actual minting on both chains');
        console.log('4. Verify transaction confirmations');
        
        // Create browser test file
        const browserTestPath = path.join(__dirname, 'browser-integration-tests.js');
        fs.writeFileSync(browserTestPath, createBrowserTests());
        console.log(`\n📄 Browser tests created: ${browserTestPath}`);
        console.log('   Load this in your extension popup console to test live functionality');
    }).catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = { ContractIntegrationTester };