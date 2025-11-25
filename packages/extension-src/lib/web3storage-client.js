/**
 * Minimal Web3.Storage client for browser use.
 * Stores API token securely using WalletSecureStorage when available.
 */

class Web3StorageClient {
    static storageKey = 'WEB3_STORAGE_TOKEN';

    static async setToken(token) {
        if (!token) return false;
        if (window.WalletSecureStorage && typeof WalletSecureStorage.encryptAndStore === 'function') {
            await WalletSecureStorage.encryptAndStore(this.storageKey, token);
            return true;
        }
        await chrome.storage.local.set({ WEB3_STORAGE_TOKEN_FALLBACK: token });
        return true;
    }

    static async getToken() {
        if (window.WalletSecureStorage && typeof WalletSecureStorage.decryptFromStorage === 'function') {
            try {
                const t = await WalletSecureStorage.decryptFromStorage(this.storageKey);
                if (t) return t;
            } catch (e) {
                console.warn('Web3StorageClient: secure token read failed', e);
            }
        }
        const r = await chrome.storage.local.get(['WEB3_STORAGE_TOKEN_FALLBACK']);
        return r.WEB3_STORAGE_TOKEN_FALLBACK || null;
    }

    // Upload a single file/blob to Web3.Storage and return ipfs://CID
    static async uploadFile(fileOrBlob, filename) {
        const token = await this.getToken();
        if (!token) throw new Error('Web3.Storage token not configured');

        const url = 'https://api.web3.storage/upload';
        const opts = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Let the browser set Content-Type for FormData
            }
        };

        // Use FormData to include filename metadata
        const form = new FormData();
        if (fileOrBlob instanceof Blob) {
            const name = filename || (fileOrBlob.name || 'file');
            form.append('file', fileOrBlob, name);
        } else {
            throw new Error('Invalid file for upload');
        }

        opts.body = form;

        const resp = await fetch(url, opts);
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Web3.Storage upload failed: ${resp.status} ${text}`);
        }

        const data = await resp.json();
        // Response contains cid in 'cid' field
        if (data && data.cid) {
            return `ipfs://${data.cid}`;
        }

        throw new Error('Unexpected Web3.Storage response');
    }
}

window.Web3StorageClient = Web3StorageClient;
