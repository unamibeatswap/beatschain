// Thirdweb Gasless Integration - Unlimited Free Minting
class ThirdwebGaslessManager {
    constructor() {
        this.sdk = null;
        this.isEnabled = false;
        this.relayerUrl = null;
        this.contractAddress = null;
    }

    async initialize() {
        try {
            // Check if Thirdweb SDK is available
            if (typeof window.ThirdwebSDK === 'undefined') {
                console.warn('⚠️ Thirdweb SDK not available - using fallback');
                return false;
            }

            // Initialize Thirdweb SDK with gasless configuration
            this.sdk = new ThirdwebSDK("solana-devnet", {
                clientId: "your_thirdweb_client_id", // Replace with actual client ID
                gasless: {
                    engine: {
                        relayerUrl: "https://engine.thirdweb.com/relayer/your-relayer-id",
                        relayerForwarderAddress: "your_relayer_forwarder_address"
                    }
                }
            });

            this.isEnabled = true;
            console.log('✅ Thirdweb gasless integration initialized');
            return true;
        } catch (error) {
            console.error('❌ Thirdweb gasless initialization failed:', error);
            return false;
        }
    }

    async canGaslessMint(userAddress) {
        if (!this.isEnabled) {
            return {
                allowed: false,
                reason: 'Thirdweb gasless not available',
                fallback: 'Use sponsored minting'
            };
        }

        try {
            // Check relayer status
            const relayerStatus = await this.checkRelayerStatus();
            if (!relayerStatus.active) {
                return {
                    allowed: false,
                    reason: 'Relayer temporarily unavailable',
                    fallback: 'Use sponsored minting'
                };
            }

            return {
                allowed: true,
                unlimited: true,
                cost: 'FREE (gasless via Thirdweb)',
                relayerBalance: relayerStatus.balance
            };
        } catch (error) {
            console.error('Gasless check failed:', error);
            return {
                allowed: false,
                reason: 'Gasless system error',
                fallback: 'Use sponsored minting'
            };
        }
    }

    async gaslessMint(userWallet, metadataUri, metadata = {}) {
        try {
            if (!this.isEnabled) {
                throw new Error('Thirdweb gasless not available');
            }

            console.log('🔄 Starting gasless NFT minting via Thirdweb...');

            // Get contract instance
            const contract = await this.sdk.getContract(this.contractAddress);

            // Prepare mint data
            const mintData = {
                to: userWallet,
                metadata: {
                    name: metadata.title,
                    description: metadata.description,
                    image: metadata.imageUri,
                    animation_url: metadata.audioUri,
                    attributes: metadata.attributes || [],
                    properties: metadata.properties || {}
                }
            };

            // Execute gasless mint - user signs, Thirdweb pays gas
            const result = await contract.erc721.mintTo(mintData.to, mintData.metadata);

            console.log('✅ Gasless NFT minted successfully:', result.receipt.transactionHash);

            return {
                transactionHash: result.receipt.transactionHash,
                tokenId: result.id,
                cost: 'FREE (gasless via Thirdweb)',
                gasless: true,
                network: 'solana-devnet',
                explorerUrl: this.getExplorerUrl(result.receipt.transactionHash)
            };
        } catch (error) {
            console.error('❌ Gasless minting failed:', error);
            throw error;
        }
    }

    async checkRelayerStatus() {
        try {
            if (!this.relayerUrl) {
                return { active: false, balance: 0 };
            }

            const response = await fetch(`${this.relayerUrl}/status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return { active: false, balance: 0 };
            }

            const status = await response.json();
            return {
                active: status.active || false,
                balance: status.balance || 0,
                transactions: status.transactions || 0
            };
        } catch (error) {
            console.error('Relayer status check failed:', error);
            return { active: false, balance: 0 };
        }
    }

    getExplorerUrl(transactionHash) {
        return `https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`;
    }

    getGaslessStatus() {
        return {
            enabled: this.isEnabled,
            unlimited: true,
            provider: 'Thirdweb Engine',
            network: 'Solana',
            costToUser: 'FREE'
        };
    }
}

// Enhanced Sponsored Minting with Thirdweb Fallback
class EnhancedSponsoredMinting extends SponsoredMintingManager {
    constructor() {
        super();
        this.thirdwebGasless = new ThirdwebGaslessManager();
    }

    async initialize() {
        // Initialize both systems
        const sponsorReady = await super.initialize();
        const gaslessReady = await this.thirdwebGasless.initialize();
        
        console.log(`✅ Enhanced minting initialized - Sponsor: ${sponsorReady}, Gasless: ${gaslessReady}`);
        return sponsorReady || gaslessReady;
    }

    async mintNFT(recipientAddress, metadataUri, metadata = {}) {
        try {
            // Try Thirdweb gasless first (unlimited)
            if (this.thirdwebGasless.isEnabled) {
                const gaslessCheck = await this.thirdwebGasless.canGaslessMint(recipientAddress);
                if (gaslessCheck.allowed) {
                    console.log('🚀 Using Thirdweb gasless minting (unlimited)');
                    return await this.thirdwebGasless.gaslessMint(recipientAddress, metadataUri, metadata);
                }
            }

            // Fallback to sponsored minting (daily limits)
            const sponsorCheck = await this.canSponsorMint(recipientAddress);
            if (sponsorCheck.allowed) {
                console.log('🎁 Using sponsored minting (daily limit)');
                return await this.sponsorTransaction(recipientAddress, {
                    type: 'nft_mint',
                    metadataUri,
                    recipient: recipientAddress
                });
            }

            // Final fallback: user pays
            throw new Error('No free minting options available - user must pay fees');
        } catch (error) {
            console.error('❌ Enhanced minting failed:', error);
            throw error;
        }
    }

    getSystemStatus() {
        return {
            thirdwebGasless: this.thirdwebGasless.getGaslessStatus(),
            sponsoredMinting: this.getSponsorStatus(),
            recommendation: this.thirdwebGasless.isEnabled ? 'Thirdweb Gasless' : 'Sponsored Minting'
        };
    }
}

// Export for global use
window.ThirdwebGaslessManager = ThirdwebGaslessManager;
window.EnhancedSponsoredMinting = EnhancedSponsoredMinting;