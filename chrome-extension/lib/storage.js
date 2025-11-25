// Chrome Storage API Wrapper
class StorageManager {
    static async set(key, value) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, resolve);
        });
    }

    static async get(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key]);
            });
        });
    }

    static async remove(key) {
        return new Promise((resolve) => {
            chrome.storage.local.remove([key], resolve);
        });
    }

    static async clear() {
        return new Promise((resolve) => {
            chrome.storage.local.clear(resolve);
        });
    }

    static async getAllNFTs() {
        const nfts = await this.get('user_nfts');
        return nfts || [];
    }

    static async addNFT(nftData) {
        const nfts = await this.getAllNFTs();
        nfts.push({
            ...nftData,
            timestamp: Date.now(),
            id: Date.now().toString()
        });
        await this.set('user_nfts', nfts);
        return nftData;
    }

    static async getWalletData() {
        const encryptedKey = await this.get('wallet_private_key_encrypted');
        let privateKey = null;
        
        if (encryptedKey) {
            try {
                privateKey = await window.CryptoUtils.decrypt(encryptedKey, 'BeatsChain2024SecureKey!@#$%^&*()');
            } catch (error) {
                console.error('Failed to decrypt private key:', error);
            }
        }
        
        return {
            privateKey,
            address: await this.get('wallet_address'),
            balance: await this.get('wallet_balance') || '0'
        };
    }

    static async setWalletData(data) {
        if (data.privateKey) {
            const encrypted = await window.CryptoUtils.encrypt(data.privateKey, 'BeatsChain2024SecureKey!@#$%^&*()');
            await this.set('wallet_private_key_encrypted', encrypted);
        }
        if (data.address) await this.set('wallet_address', data.address);
        if (data.balance) await this.set('wallet_balance', data.balance);
    }
}

// Export to global window for Chrome extension compatibility
window.StorageManager = StorageManager;