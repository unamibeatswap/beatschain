const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple /auth/verify sample. In production, verify tokens with Google and map
// the resulting email/user id to your role database. This sample supports two
// modes:
// - If GOOGLE_CLIENT_ID env var set, it will attempt a tokeninfo call (for demo only).
// - Otherwise it responds with a mock mapping for local development.

const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@beatschain.com'];

// In-memory stores for demo purposes
const nonces = new Map(); // key: nonce -> { walletAddress, email, expiresAt, used }
const linkedWallets = new Map(); // key: email -> array of walletAddresses

// Utility for nonce generation
const crypto = require('crypto');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

function generateNonce() {
  return crypto.randomBytes(32).toString('base64');
}

function nowPlusSeconds(s) {
  return Date.now() + s * 1000;
}

app.post('/auth/verify', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ success: false, message: 'token required' });

  // Development fallback: if token equals special dev tokens, return canned roles
  if (token === 'dev-admin') {
    return res.json({ success: true, role: 'admin', email: 'admin@beatschain.com', permissions: ['*'] });
  }

  // If no GOOGLE_CLIENT_ID is configured, return a mock response using token as email
  if (!process.env.GOOGLE_CLIENT_ID) {
    const email = token.includes('@') ? token : `user+${token}@example.com`;
    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
    return res.json({ success: true, role, email, permissions: role === 'admin' ? ['*'] : [] });
  }

  // Production-ish verification (demo): call Google's tokeninfo endpoint.
  try {
    // Try to treat token as an id_token first
    const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    if (!resp.ok) throw new Error('tokeninfo failed');
    const info = await resp.json();
    // Verify audience matches (if provided)
    if (process.env.GOOGLE_CLIENT_ID && info.aud && info.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ success: false, message: 'invalid_client' });
    }
    const email = info.email || '';
    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
    return res.json({ success: true, role, email, permissions: role === 'admin' ? ['*'] : [] });
  } catch (e) {
    console.warn('Token verification failed (demo):', e && e.message ? e.message : e);
    return res.status(500).json({ success: false, message: 'verification_failed' });
  }
});

// Link request: server issues a one-time nonce for the wallet to sign
app.post('/auth/link-request', async (req, res) => {
  const { token, walletAddress } = req.body || {};
  if (!token || !walletAddress) return res.status(400).json({ success: false, message: 'token and walletAddress required' });

  // Verify token (reuse the same logic as /auth/verify)
  let verified = null;
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      const email = token.includes('@') ? token : `user+${token}@example.com`;
      verified = { success: true, email };
    } else {
      const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (!resp.ok) throw new Error('tokeninfo failed');
      const info = await resp.json();
      if (process.env.GOOGLE_CLIENT_ID && info.aud && info.aud !== process.env.GOOGLE_CLIENT_ID) {
        return res.status(401).json({ success: false, message: 'invalid_client' });
      }
      verified = { success: true, email: info.email };
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: 'token verification failed' });
  }

  const nonce = generateNonce();
  const expiresAt = nowPlusSeconds(300); // expires in 5 minutes
  nonces.set(nonce, { walletAddress, email: verified.email, expiresAt, used: false });

  return res.json({ success: true, nonce, expiresAt });
});

// Link verify: client sends signature over nonce and the server verifies
app.post('/auth/link-verify', async (req, res) => {
  const { token, walletAddress, nonce, signature } = req.body || {};
  if (!token || !walletAddress || !nonce || !signature) return res.status(400).json({ success: false, message: 'token,walletAddress,nonce,signature required' });

  // Verify token -> email
  let email = null;
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      email = token.includes('@') ? token : `user+${token}@example.com`;
    } else {
      const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (!resp.ok) throw new Error('tokeninfo failed');
      const info = await resp.json();
      email = info.email;
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: 'token verification failed' });
  }

  const record = nonces.get(nonce);
  if (!record) return res.status(400).json({ success: false, message: 'invalid nonce' });
  if (record.used) return res.status(400).json({ success: false, message: 'nonce already used' });
  if (record.expiresAt < Date.now()) return res.status(400).json({ success: false, message: 'nonce expired' });
  if (record.walletAddress !== walletAddress) return res.status(400).json({ success: false, message: 'wallet mismatch' });
  if (record.email !== email) return res.status(400).json({ success: false, message: 'email mismatch' });

  // Verify signature: signature is expected as base64 string of the detached signature
  try {
    const message = Buffer.from(nonce, 'base64');
    const sig = Buffer.from(signature, 'base64');
    const pubkeyBytes = bs58.decode(walletAddress);

    const verifiedSig = nacl.sign.detached.verify(new Uint8Array(message), new Uint8Array(sig), new Uint8Array(pubkeyBytes));
    if (!verifiedSig) return res.status(400).json({ success: false, message: 'signature verification failed' });

    // Mark nonce used and store linked wallet
    record.used = true;
    const arr = linkedWallets.get(email) || [];
    if (!arr.includes(walletAddress)) arr.push(walletAddress);
    linkedWallets.set(email, arr);

    return res.json({ success: true, email, walletAddress, linkedAt: Date.now() });
  } catch (e) {
    console.error('Signature verification error', e);
    return res.status(500).json({ success: false, message: 'signature verification error' });
  }
});

// Helper: list linked wallets for demo/testing
app.get('/auth/linked-wallets', (req, res) => {
  const out = {};
  for (const [k, v] of linkedWallets.entries()) out[k] = v;
  res.json({ success: true, linked: out });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`BeatsChain backend-sample listening on ${port}`));
