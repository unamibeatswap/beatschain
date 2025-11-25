// Thirdweb adapter stub - server-side gasless minting helpers
// This module is intentionally lightweight and will attempt to require thirdweb
// SDK dynamically when available. In the meantime it exposes a stubbed gaslessMint function.

async function gaslessMint(metadata, opts = {}) {
  // opts may include targetChain, walletAddress, etc.
  // For now return a mock response; real implementation will call thirdweb server SDK
  return {
    success: true,
    message: 'mock mint completed',
    tx: null,
    cid: metadata && metadata.ipfs ? metadata.ipfs.ipfsHash || metadata.ipfs : null
  };
}

module.exports = { gaslessMint };
