// UI handler to connect Phantom wallet and run link flow
(async function () {
  const connectBtn = document.getElementById('connect-external-wallet');
  if (!connectBtn) return;

  connectBtn.addEventListener('click', async (e) => {
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    try {
      if (!window.solana || !window.solana.isPhantom) {
        alert('No Phantom wallet detected. Please install Phantom or use a compatible Solana wallet.');
        connectBtn.disabled = false; connectBtn.textContent = '🔗 Connect Wallet';
        return;
      }

      // Request connection
      const resp = await window.solana.connect();
      const publicKey = resp.publicKey.toString();
      console.log('Connected wallet:', publicKey);

      // Ask the backend for a nonce
      const idToken = window.unifiedAuth && window.unifiedAuth.getIdToken ? await window.unifiedAuth.getIdToken() : null;
      if (!idToken) {
        // Optionally prompt sign-in
        const proceed = confirm('You must be signed in with Google to link a wallet. Sign-in now?');
        if (!proceed) {
          connectBtn.disabled = false; connectBtn.textContent = '🔗 Connect Wallet';
          return;
        }
        if (window.unifiedAuth && window.unifiedAuth.signInWithGoogle) {
          await window.unifiedAuth.signInWithGoogle(true);
        }
      }

      const idTok = window.unifiedAuth && window.unifiedAuth.getIdToken ? await window.unifiedAuth.getIdToken() : null;
      if (!idTok) throw new Error('No id token available after sign-in');

      const linkReq = await window.WalletLinkClient.requestLink(idTok, publicKey);
      if (!linkReq || !linkReq.nonce) throw new Error('Failed to obtain nonce from server: ' + (linkReq && linkReq.message));

      // Sign the nonce with the wallet
      const nonce = linkReq.nonce; // base64
      const encoder = new TextEncoder();
      const message = Uint8Array.from(atob(nonce), c => c.charCodeAt(0));

      // Try Phantom signMessage (returns { signature, publicKey })
      let signed;
      try {
        signed = await window.solana.signMessage(message, 'base64');
        // Some providers return signature as Uint8Array
      } catch (e) {
        // Fallback: use signTransaction? Not ideal. Bail with instructions.
        throw new Error('Wallet does not support signMessage in this environment. Please use a wallet that supports message signing (Phantom).');
      }

      // Normalize signature to base64
      let signatureBase64 = null;
      if (signed && signed.signature) {
        if (typeof signed.signature === 'string') signatureBase64 = signed.signature;
        else signatureBase64 = btoa(String.fromCharCode(...signed.signature));
      }
      if (!signatureBase64) throw new Error('Unable to obtain signature from wallet');

      // Send to server for verification
      const verifyResp = await window.WalletLinkClient.verifyLink(idTok, publicKey, nonce, signatureBase64);
      if (verifyResp && verifyResp.success) {
        alert('Wallet linked successfully: ' + publicKey);
      } else {
        throw new Error('Link verification failed: ' + JSON.stringify(verifyResp));
      }

    } catch (error) {
      console.error('Wallet link error', error);
      alert('Failed to link wallet: ' + (error && error.message ? error.message : error));
    } finally {
      connectBtn.disabled = false; connectBtn.textContent = '🔗 Connect Wallet';
    }
  });
})();
