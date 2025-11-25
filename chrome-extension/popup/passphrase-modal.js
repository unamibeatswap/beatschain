(function(){
    'use strict';

    // Simple passphrase modal provider for WalletSecureStorage.
    // Exposes window.WalletPassphraseProvider.requestPassphrase(mode)
    // mode: 'unlock' -> returns passphrase string or null
    // mode: 'create' -> returns created passphrase string or null

    const modal = document.getElementById('passphrase-modal');
    const modalTitle = modal?.querySelector('#passphrase-modal-title');
    const modalBody = modal?.querySelector('#passphrase-modal-body');
    const modalFooter = modal?.querySelector('#passphrase-modal-footer');
    const modalClose = modal?.querySelector('#passphrase-modal-close');

    let pendingResolve = null;
    let pendingReject = null;

    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';
        modalTitle.textContent = 'Unlock Wallet';
        if (pendingResolve) {
            // if modal closed without explicit action, resolve with null
            pendingResolve(null);
            pendingResolve = null;
            pendingReject = null;
        }
    }

    function openModal() {
        if (!modal) return;
        modal.style.display = 'block';
        // small focus trap
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }

    if (modalClose) modalClose.addEventListener('click', () => closeModal());

    async function requestPassphrase(mode) {
        // Prevent concurrent modal instances
        if (pendingResolve) {
            throw new Error('Passphrase request already in progress');
        }

        return new Promise((resolve, reject) => {
            pendingResolve = resolve;
            pendingReject = reject;

            try {
                if (!modal) {
                    // No modal in DOM - fallback to null so caller can fallback to prompt
                    resolve(null);
                    pendingResolve = null;
                    pendingReject = null;
                    return;
                }

                if (mode === 'unlock') {
                    modalTitle.textContent = 'Unlock BeatsChain Wallet';
                    modalBody.innerHTML = `
                        <p>Enter your wallet passphrase to unlock your BeatsChain wallet.</p>
                        <input id="pw-unlock-input" type="password" placeholder="Passphrase" class="form-input" style="width:100%; padding:8px; margin-top:8px;">
                        <div id="pw-unlock-error" style="color:#ff6b6b; margin-top:8px; display:none;"></div>
                    `;

                    modalFooter.innerHTML = `
                        <button id="pw-unlock-cancel" class="btn btn-secondary">Cancel</button>
                        <button id="pw-unlock-submit" class="btn btn-primary">Unlock</button>
                    `;

                    openModal();

                    const input = modal.querySelector('#pw-unlock-input');
                    const cancel = modal.querySelector('#pw-unlock-cancel');
                    const submit = modal.querySelector('#pw-unlock-submit');
                    const errDiv = modal.querySelector('#pw-unlock-error');

                    cancel.addEventListener('click', () => {
                        closeModal();
                        resolve(null);
                        pendingResolve = null;
                        pendingReject = null;
                    }, { once: true });

                    submit.addEventListener('click', () => {
                        const v = input.value && input.value.trim();
                        if (!v) {
                            if (errDiv) { errDiv.textContent = 'Passphrase cannot be empty.'; errDiv.style.display = 'block'; }
                            return;
                        }
                        closeModal();
                        resolve(v);
                        pendingResolve = null;
                        pendingReject = null;
                    }, { once: true });

                    input.addEventListener('keydown', (ev) => {
                        if (ev.key === 'Enter') submit.click();
                    });

                } else if (mode === 'create') {
                    modalTitle.textContent = 'Secure Your BeatsChain Wallet';
                    modalBody.innerHTML = `
                        <p>Protect your wallet with a passphrase. You will need this passphrase to export or unlock your private key.</p>
                        <input id="pw-create-1" type="password" placeholder="Create passphrase" class="form-input" style="width:100%; padding:8px; margin-top:8px;">
                        <input id="pw-create-2" type="password" placeholder="Confirm passphrase" class="form-input" style="width:100%; padding:8px; margin-top:8px;">
                        <div id="pw-create-error" style="color:#ff6b6b; margin-top:8px; display:none;"></div>
                    `;

                    modalFooter.innerHTML = `
                        <button id="pw-create-cancel" class="btn btn-secondary">Skip (Use unencrypted)</button>
                        <button id="pw-create-submit" class="btn btn-primary">Create Passphrase</button>
                    `;

                    openModal();

                    const p1 = modal.querySelector('#pw-create-1');
                    const p2 = modal.querySelector('#pw-create-2');
                    const cancel = modal.querySelector('#pw-create-cancel');
                    const submit = modal.querySelector('#pw-create-submit');
                    const errDiv = modal.querySelector('#pw-create-error');

                    cancel.addEventListener('click', () => {
                        closeModal();
                        resolve(null);
                        pendingResolve = null;
                        pendingReject = null;
                    }, { once: true });

                    submit.addEventListener('click', () => {
                        const v1 = p1.value && p1.value.trim();
                        const v2 = p2.value && p2.value.trim();
                        if (!v1) { errDiv.textContent = 'Passphrase cannot be empty.'; errDiv.style.display = 'block'; return; }
                        if (v1 !== v2) { errDiv.textContent = 'Passphrases do not match.'; errDiv.style.display = 'block'; return; }
                        closeModal();
                        resolve(v1);
                        pendingResolve = null;
                        pendingReject = null;
                    }, { once: true });

                    p2.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') submit.click(); });
                } else {
                    // Unknown mode, return null
                    resolve(null);
                    pendingResolve = null;
                    pendingReject = null;
                }

            } catch (e) {
                pendingResolve = null;
                pendingReject = null;
                reject(e);
            }
        });
    }

    // Expose provider
    window.WalletPassphraseProvider = {
        requestPassphrase
    };

})();
