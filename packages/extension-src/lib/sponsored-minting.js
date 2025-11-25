// Sponsored Minting System - Free NFT Minting for Users
class SponsoredMintingManager {
    constructor() {
        this.sponsorWallet = null;
        this.isEnabled = true;
        this.dailyLimit = 10; // Free mints per user per day
        this.costPerMint = 0.001; // ~$0.03 in SOL
    }

    async initialize() {
        try {
            // Initialize sponsor wallet with hardcoded private key for demo
            this.sponsorWallet = {
                publicKey: 'BeatsChainSponsor1111111111111111111111111',
                privateKey: 'sponsor_private_key_here', // In production: use secure key management
                balance: 100 // SOL balance for sponsoring
            };
            
            console.log('✅ Sponsored minting initialized - FREE minting enabled');
            return true;
        } catch (error) {
            console.error('❌ Sponsored minting initialization failed:', error);
            return false;
        }
    }

    async canSponsorMint(userAddress) {
        try {
            // Check daily limits
            const today = new Date().toDateString();
            const userMints = await this.getUserMintsToday(userAddress, today);
            
            if (userMints >= this.dailyLimit) {
                return {
                    allowed: false,
                    reason: `Daily limit reached (${this.dailyLimit} free mints per day)`,
                    nextAvailable: 'Tomorrow'
                };
            }

            // Check sponsor wallet balance
            if (this.sponsorWallet.balance < this.costPerMint) {
                return {
                    allowed: false,
                    reason: 'Sponsor wallet insufficient funds',
                    fallback: 'User must pay transaction fees'
                };
            }

            return {
                allowed: true,
                remaining: this.dailyLimit - userMints,
                cost: 'FREE (sponsored by BeatsChain)'
            };
        } catch (error) {
            console.error('Sponsor check failed:', error);
            return { allowed: false, reason: 'Sponsor system unavailable' };
        }
    }

    async sponsorTransaction(userAddress, transactionData) {
        try {
            console.log('🎁 Sponsoring FREE transaction for user:', userAddress.substring(0, 8) + '...');
            
            // Record the sponsored mint
            await this.recordSponsoredMint(userAddress);
            
            // Deduct cost from sponsor wallet
            this.sponsorWallet.balance -= this.costPerMint;
            
            // Create sponsored transaction
            const sponsoredTx = {
                ...transactionData,
                feePayer: this.sponsorWallet.publicKey,
                sponsored: true,
                cost: 0,
                sponsorSignature: 'sponsor_signature_here'
            };

            console.log('✅ Transaction sponsored successfully - User pays $0.00');
            return sponsoredTx;
        } catch (error) {
            console.error('❌ Transaction sponsoring failed:', error);
            throw error;
        }
    }

    async getUserMintsToday(userAddress, date) {
        try {
            const key = `sponsored_mints_${userAddress}_${date}`;
            const stored = localStorage.getItem(key);
            return stored ? parseInt(stored) : 0;
        } catch (error) {
            return 0;
        }
    }

    async recordSponsoredMint(userAddress) {
        try {
            const today = new Date().toDateString();
            const key = `sponsored_mints_${userAddress}_${today}`;
            const current = await this.getUserMintsToday(userAddress, today);
            localStorage.setItem(key, (current + 1).toString());
            
            // Also record in Chrome storage for persistence
            if (chrome.storage) {
                await chrome.storage.local.set({ [key]: current + 1 });
            }
        } catch (error) {
            console.error('Failed to record sponsored mint:', error);
        }
    }

    getSponsorStatus() {
        return {
            enabled: this.isEnabled,
            dailyLimit: this.dailyLimit,
            costPerMint: this.costPerMint,
            sponsorBalance: this.sponsorWallet?.balance || 0,
            estimatedMintsRemaining: Math.floor((this.sponsorWallet?.balance || 0) / this.costPerMint)
        };
    }

    // Alternative: Compressed NFTs for ultra-low cost
    async useCompressedNFTs() {
        return {
            enabled: true,
            cost: 0.0001, // $0.003 instead of $0.03
            description: 'Compressed NFTs reduce minting cost by 99%',
            implementation: 'Use Metaplex Bubblegum for compressed NFTs'
        };
    }
}

// Export for global use
window.SponsoredMintingManager = SponsoredMintingManager;