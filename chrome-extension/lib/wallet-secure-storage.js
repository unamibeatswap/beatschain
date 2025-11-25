/*
 * Wallet Secure Storage
 * Minimal AES-GCM based encryption for storing private keys in chrome.storage.local.
 * This improves security by avoiding plaintext private keys in storage. NOTE: The
 * encryption key is persisted in storage for compatibility with extension context.
 * For stronger security, use user-supplied passphrases or an external KMS.
 */

class WalletSecureStorage {
    static cryptoKey = null;
    // In-memory session key (derived from passphrase) to avoid re-prompting
    static sessionKey = null;

    static arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    static base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    static async ensureKey() {
        if (this.cryptoKey) return this.cryptoKey;

        try {
            const stored = await chrome.storage.local.get(['wallet_encryption_key_raw', 'wallet_salt']);

            // Backward-compat: if a raw key was stored previously, import and use it.
            if (stored && stored.wallet_encryption_key_raw) {
                const raw = this.base64ToArrayBuffer(stored.wallet_encryption_key_raw);
                const key = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
                this.cryptoKey = key;
                return key;
            }

            // Prefer passphrase-derived key: if a salt exists, request a passphrase via
            // an optional UI provider (window.WalletPassphraseProvider). If the provider
            // is not present, fall back to prompt/confirm for backwards compatibility.
            if (stored && stored.wallet_salt) {
                // Use sessionKey if already derived in this runtime
                if (this.sessionKey) {
                    this.cryptoKey = this.sessionKey;
                    return this.cryptoKey;
                }

                let pass = null;
                if (window.WalletPassphraseProvider && typeof window.WalletPassphraseProvider.requestPassphrase === 'function') {
                    try {
                        pass = await window.WalletPassphraseProvider.requestPassphrase('unlock');
                    } catch (e) {
                        console.warn('WalletPassphraseProvider.unlock failed:', e);
                    }
                }

                // Fallback to prompt for environments without the modal provider
                if (!pass) {
                    pass = window.prompt('Enter your wallet passphrase to unlock your BeatsChain wallet');
                }

                if (!pass) throw new Error('Passphrase required to unlock wallet');

                const saltBuf = this.base64ToArrayBuffer(stored.wallet_salt);
                const derived = await this.deriveKeyFromPassphrase(pass, saltBuf);
                this.sessionKey = derived;
                this.cryptoKey = derived;
                return derived;
            }

            // No existing key/salt found — offer the user a passphrase-first flow via
            // an optional provider. If provider not present, fallback to confirm+prompts.
            let createAccepted = false;
            let createdPassphrase = null;

            if (window.WalletPassphraseProvider && typeof window.WalletPassphraseProvider.requestPassphrase === 'function') {
                try {
                    createdPassphrase = await window.WalletPassphraseProvider.requestPassphrase('create');
                    createAccepted = !!createdPassphrase;
                } catch (e) {
                    console.warn('WalletPassphraseProvider.create failed:', e);
                }
            } else {
                createAccepted = window.confirm('No wallet encryption found. Would you like to secure your wallet with a passphrase? (Recommended)');
                if (createAccepted) {
                    const pass1 = window.prompt('Create a strong wallet passphrase (do NOT forget this)');
                    if (!pass1) throw new Error('Passphrase creation cancelled');
                    const pass2 = window.prompt('Confirm your passphrase');
                    if (pass1 !== pass2) throw new Error('Passphrases do not match');
                    createdPassphrase = pass1;
                }
            }

            if (createAccepted) {
                const pass1 = createdPassphrase;
                // Generate salt and derive key
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const derived = await this.deriveKeyFromPassphrase(pass1, salt.buffer);

                // Persist the salt (not the passphrase)
                await chrome.storage.local.set({ 'wallet_salt': this.arrayBufferToBase64(salt.buffer) });

                this.sessionKey = derived;
                this.cryptoKey = derived;
                return derived;
            }

            // If user declines passphrase creation, fall back to generating a raw key (legacy behavior)
            const newKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
            const exported = await crypto.subtle.exportKey('raw', newKey);
            const b64 = this.arrayBufferToBase64(exported);
            await chrome.storage.local.set({ 'wallet_encryption_key_raw': b64 });
            this.cryptoKey = newKey;
            return newKey;
        } catch (error) {
            console.error('WalletSecureStorage: failed to ensure key', error);
            throw error;
        }
    }

    static async deriveKeyFromPassphrase(passphrase, saltBuffer) {
        const encoder = new TextEncoder();
        const passKey = await crypto.subtle.importKey('raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']);
        const derivedBits = await crypto.subtle.deriveKey({
            name: 'PBKDF2',
            salt: saltBuffer instanceof ArrayBuffer ? new Uint8Array(saltBuffer) : saltBuffer,
            iterations: 200000,
            hash: 'SHA-256'
        }, passKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
        return derivedBits;
    }

    static async encryptAndStore(storageKey, plaintext) {
        try {
            const key = await this.ensureKey();
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encoder = new TextEncoder();
            const data = encoder.encode(plaintext);
            const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

            const payload = {
                iv: this.arrayBufferToBase64(iv.buffer),
                data: this.arrayBufferToBase64(cipher)
            };

            await chrome.storage.local.set({ [storageKey]: JSON.stringify(payload) });
            return true;
        } catch (error) {
            console.error('WalletSecureStorage.encryptAndStore failed:', error);
            throw error;
        }
    }

    static async decryptFromStorage(storageKey) {
        try {
            const stored = await chrome.storage.local.get([storageKey]);
            const raw = stored[storageKey];
            if (!raw) return null;

            const payload = JSON.parse(raw);
            const ivBuf = this.base64ToArrayBuffer(payload.iv);
            const dataBuf = this.base64ToArrayBuffer(payload.data);
            const key = await this.ensureKey();
            const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(ivBuf) }, key, dataBuf);
            const decoder = new TextDecoder();
            return decoder.decode(plainBuf);
        } catch (error) {
            console.error('WalletSecureStorage.decryptFromStorage failed:', error);
            return null;
        }
    }

    static async remove(storageKey) {
        try {
            await chrome.storage.local.remove([storageKey]);
            return true;
        } catch (error) {
            console.error('WalletSecureStorage.remove failed:', error);
            return false;
        }
    }
}

window.WalletSecureStorage = WalletSecureStorage;
