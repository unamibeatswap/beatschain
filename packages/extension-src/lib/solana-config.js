/**
 * Solana Configuration Manager
 * Handles Solana network configuration and endpoints
 */
class SolanaConfig {
    constructor() {
        this.network = 'devnet';
        this.programId = 'BeatsChainSolanaProgram11111111111111111111';
        this.rpcEndpoints = {
            devnet: 'https://api.devnet.solana.com',
            mainnet: 'https://api.mainnet-beta.solana.com'
        };
        this.metaplexProgramId = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
    }

    getRpcUrl() {
        return this.rpcEndpoints[this.network];
    }

    getProgramId() {
        return this.programId;
    }

    getMetaplexProgramId() {
        return this.metaplexProgramId;
    }

    getNetwork() {
        return this.network;
    }

    setNetwork(network) {
        if (network === 'devnet' || network === 'mainnet') {
            this.network = network;
            console.log(`✅ Solana network set to: ${network}`);
        } else {
            console.error('❌ Invalid network. Use "devnet" or "mainnet"');
        }
    }

    getExplorerUrl(signature) {
        const cluster = this.network === 'mainnet' ? '' : `?cluster=${this.network}`;
        return `https://explorer.solana.com/tx/${signature}${cluster}`;
    }

    getNFTUrl(mintAddress) {
        const cluster = this.network === 'mainnet' ? '' : `?cluster=${this.network}`;
        return `https://explorer.solana.com/address/${mintAddress}${cluster}`;
    }

    // Migration settings
    getMigrationSettings() {
        return {
            preferSolana: true,
            enableEthereumFallback: false, // Set to false for Solana-only
            realMinting: true,
            testMode: this.network === 'devnet'
        };
    }
}

// Export for global use
window.SolanaConfig = SolanaConfig;