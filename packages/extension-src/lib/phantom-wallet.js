// Phantom Wallet Integration for Real Solana Transactions
class PhantomWalletManager {
    constructor() {
        this.phantom = null;
        this.isConnected = false;
        this.publicKey = null;
    }

    async initialize() {
        // STRATEGY: Embedded wallet is primary - only check if Phantom is immediately available
        if (window.solana && window.solana.isPhantom) {
            this.phantom = window.solana;
            return true;
        }
        
        // No detection attempts - embedded wallet is primary strategy
        return false;
    }

    async connect() {
        try {
            console.log('🔗 Attempting Phantom wallet connection...');
            
            if (!this.phantom) {
                console.error('❌ Phantom wallet object not available');
                // Try one more detection attempt
                await this.initialize();
                if (!this.phantom) {
                    return {
                        success: false,
                        error: 'Phantom wallet not available. Please install Phantom extension.',
                        fallback: true
                    };
                }
            }
            
            console.log('🔍 Phantom wallet object found, attempting connection...');
            
            // Check if already connected
            if (this.phantom.isConnected) {
                console.log('🔗 Phantom already connected');
                this.publicKey = this.phantom.publicKey.toString();
                this.isConnected = true;
                return {
                    success: true,
                    publicKey: this.publicKey,
                    wallet: 'phantom'
                };
            }
            
            // Request connection with timeout
            const connectPromise = this.phantom.connect();
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), 30000);
            });
            
            const response = await Promise.race([connectPromise, timeoutPromise]);
            
            if (!response || !response.publicKey) {
                throw new Error('Invalid response from Phantom wallet');
            }
            
            this.publicKey = response.publicKey.toString();
            this.isConnected = true;
            
            console.log('✅ Successfully connected to Phantom:', this.publicKey.substring(0, 8) + '...');
            return {
                success: true,
                publicKey: this.publicKey,
                wallet: 'phantom'
            };
        } catch (error) {
            console.error('❌ Phantom connection failed:', error);
            
            // Provide specific error messages
            let errorMessage = error.message;
            if (error.message.includes('User rejected')) {
                errorMessage = 'Connection cancelled by user';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Connection timed out - please try again';
            } else if (error.message.includes('not available')) {
                errorMessage = 'Phantom wallet not available. Please install Phantom extension.';
            }
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    async disconnect() {
        try {
            if (this.phantom && this.isConnected) {
                await this.phantom.disconnect();
                this.isConnected = false;
                this.publicKey = null;
                console.log('✅ Disconnected from Phantom');
            }
        } catch (error) {
            console.error('❌ Phantom disconnect failed:', error);
        }
    }

    async signTransaction(transaction) {
        try {
            if (!this.isConnected) {
                throw new Error('Phantom wallet not connected');
            }

            const signedTransaction = await this.phantom.signTransaction(transaction);
            console.log('✅ Transaction signed by Phantom');
            return signedTransaction;
        } catch (error) {
            console.error('❌ Transaction signing failed:', error);
            throw error;
        }
    }

    getPublicKey() {
        return this.publicKey;
    }

    isWalletConnected() {
        return this.isConnected && this.publicKey;
    }

    showInstallPrompt() {
        const installDiv = document.createElement('div');
        installDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: #512da8; color: white;
            padding: 16px 20px; border-radius: 8px;
            z-index: 10000; max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        installDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">👻</span>
                <div>
                    <strong>Phantom Wallet Required</strong><br>
                    <small>Install Phantom to mint Solana NFTs</small><br>
                    <a href="https://phantom.app" target="_blank" style="color: #bb86fc;">Install Phantom →</a>
                </div>
                <button onclick="this.parentNode.parentNode.remove()" style="background: none; border: none; color: white; cursor: pointer;">×</button>
            </div>
        `;
        
        document.body.appendChild(installDiv);
        
        setTimeout(() => {
            if (installDiv.parentNode) {
                installDiv.parentNode.removeChild(installDiv);
            }
        }, 10000);
    }
}

// Export for global use
window.PhantomWalletManager = PhantomWalletManager;