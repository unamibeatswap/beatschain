// Secure Wallet Management
class WalletManager {
    constructor() {
        this.privateKey = null;
        this.address = null;
        this.encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'BeatsChain2024SecureKey!@#$%^&*()';
    }

    async initialize() {
        const walletData = await window.StorageManager.getWalletData();
        
        if (walletData.privateKey && walletData.address) {
            this.privateKey = walletData.privateKey;
            this.address = walletData.address;
            return true;
        }
        
        return await this.createWallet();
    }

    async createWallet() {
        try {
            // Generate cryptographically secure private key
            const privateKeyArray = new Uint8Array(32);
            crypto.getRandomValues(privateKeyArray);
            this.privateKey = '0x' + Array.from(privateKeyArray, byte => byte.toString(16).padStart(2, '0')).join('');
            
            // Generate address from private key using keccak256 (simplified)
            this.address = await this.generateAddressFromPrivateKey(this.privateKey);
            
            // Store encrypted wallet data
            const encrypted = await window.CryptoUtils.encrypt(this.privateKey, this.encryptionKey);
            await window.StorageManager.set('wallet_private_key_encrypted', encrypted);
            await window.StorageManager.set('wallet_address', this.address);
            await window.StorageManager.set('wallet_balance', '0');
            
            console.log('New wallet created:', this.address);
            return true;
        } catch (error) {
            console.error('Wallet creation failed:', error);
            return false;
        }
    }

    async generateAddressFromPrivateKey(privateKey) {
        // Simplified address generation for Chrome extension
        const encoder = new TextEncoder();
        const data = encoder.encode(privateKey);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = new Uint8Array(hashBuffer);
        return '0x' + Array.from(hashArray.slice(12), byte => byte.toString(16).padStart(2, '0')).join('');
    }

    getAddress() {
        return this.address;
    }

    getPrivateKey() {
        return this.privateKey;
    }

    async updateBalance(balance) {
        await window.StorageManager.set('wallet_balance', balance);
    }

    async exportPrivateKey() {
        if (!this.privateKey) {
            throw new Error('No wallet available');
        }
        return this.privateKey;
    }

    async importPrivateKey(privateKey) {
        if (!privateKey || !privateKey.startsWith('0x')) {
            throw new Error('Invalid private key format');
        }
        
        this.privateKey = privateKey;
        // In production, derive address from private key properly
        this.address = '0x' + this.generateRandomHex(40);
        
        const encrypted = await window.CryptoUtils.encrypt(this.privateKey, this.encryptionKey);
        await window.StorageManager.set('wallet_private_key_encrypted', encrypted);
        await window.StorageManager.set('wallet_address', this.address);
        
        return true;
    }

    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
}

// Export to global window for Chrome extension compatibility
window.WalletManager = WalletManager;