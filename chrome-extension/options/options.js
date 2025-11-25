document.getElementById('config-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const credentials = {
        THIRDWEB_CLIENT_ID: document.getElementById('thirdweb-client-id').value.trim(),
        PINATA_API_KEY: document.getElementById('pinata-api-key').value.trim(),
        PINATA_SECRET_KEY: document.getElementById('pinata-secret-key').value.trim()
    };
    
    try {
        // Save non-sensitive config in plain storage
        await chrome.storage.local.set({ THIRDWEB_CLIENT_ID: credentials.THIRDWEB_CLIENT_ID });

        // Deprecation: Pinata keys are discouraged for client-side use
        if (credentials.PINATA_API_KEY || credentials.PINATA_SECRET_KEY) {
            await chrome.storage.local.set({ PINATA_API_KEY: credentials.PINATA_API_KEY });
            // Do NOT store secret key in plaintext; keep only if user explicitly provided
            await chrome.storage.local.set({ PINATA_SECRET_KEY: credentials.PINATA_SECRET_KEY });
        }

        // Store Web3.Storage token encrypted if provided
        const web3Token = document.getElementById('web3storage-token').value.trim();
        if (web3Token) {
            if (window.WalletSecureStorage && typeof window.WalletSecureStorage.encryptAndStore === 'function') {
                await WalletSecureStorage.encryptAndStore('WEB3_STORAGE_TOKEN', web3Token);
            } else {
                // Fallback to plain storage if secure storage not available (not recommended)
                await chrome.storage.local.set({ WEB3_STORAGE_TOKEN_FALLBACK: web3Token });
            }
        }

        showStatus('Configuration saved successfully!', 'success');
    } catch (error) {
        showStatus('Failed to save configuration', 'error');
    }
});

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    setTimeout(() => status.textContent = '', 3000);
}

// Load existing values
async function loadExisting() {
    const result = await chrome.storage.local.get(['THIRDWEB_CLIENT_ID', 'PINATA_API_KEY', 'PINATA_SECRET_KEY', 'WEB3_STORAGE_TOKEN_FALLBACK']);
    if (result.THIRDWEB_CLIENT_ID) document.getElementById('thirdweb-client-id').value = result.THIRDWEB_CLIENT_ID;
    if (result.PINATA_API_KEY) document.getElementById('pinata-api-key').value = result.PINATA_API_KEY;
    if (result.PINATA_SECRET_KEY) document.getElementById('pinata-secret-key').value = result.PINATA_SECRET_KEY;
    // No backend URL handling - extension will use client-side behavior by default
    // Do NOT populate encrypted Web3 tokens automatically. If a fallback was stored, warn the user.
    if (result.WEB3_STORAGE_TOKEN_FALLBACK) {
        const helpDiv = document.createElement('div');
        helpDiv.className = 'help';
        helpDiv.textContent = 'A Web3.Storage token was saved in an unsecured fallback. Consider re-entering it to store securely.';
        document.getElementById('web3storage-token').insertAdjacentElement('afterend', helpDiv);
    }
    // Attempt to detect if an encrypted token exists (do not decrypt here)
    const enc = await chrome.storage.local.get(['WEB3_STORAGE_TOKEN']);
    if (enc && enc.WEB3_STORAGE_TOKEN) {
        const helpDiv2 = document.createElement('div');
        helpDiv2.className = 'help';
        helpDiv2.textContent = 'A Web3.Storage token is stored securely in your browser (protected by wallet passphrase).';
        document.getElementById('web3storage-token').insertAdjacentElement('afterend', helpDiv2);
    }
}

loadExisting();