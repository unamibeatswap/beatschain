// Minimal client helper to call backend linking endpoints
(function () {
  const BACKEND = window.BEATSCHAIN_BACKEND_URL || 'http://localhost:4000';

  async function verifyIdToken(idToken) {
    // For the client we just forward token to server - server verifies
    return !!idToken;
  }

  async function requestLink(idToken, walletAddress) {
    const resp = await fetch(`${BACKEND}/auth/link-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken, walletAddress })
    });
    return await resp.json();
  }

  async function verifyLink(idToken, walletAddress, nonce, signatureBase64) {
    const resp = await fetch(`${BACKEND}/auth/link-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken, walletAddress, nonce, signature: signatureBase64 })
    });
    return await resp.json();
  }

  window.WalletLinkClient = { requestLink, verifyLink, verifyIdToken };
})();
