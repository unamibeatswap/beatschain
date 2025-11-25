const fetch = require('cross-fetch');
const fs = require('fs');

class LivepeerClient {
  constructor(apiKey, host) {
    this.apiKey = apiKey || null;
    this.host = host || process.env.LIVEPEER_API_HOST || 'https://livepeer.studio/api';
  }

  // Create an asset from an existing IPFS CID (or metadata). This is a best-effort helper
  async createAssetFromIPFSCid(ipfsCid, name) {
    if (!this.apiKey) {
      return {
        id: `mock-livepeer-asset-${Date.now()}`,
        status: 'mocked',
        name: name || `asset-${Date.now()}`,
        ipfsCid,
        playbackUrl: `https://playback.mock/${ipfsCid}/manifest.m3u8`
      };
    }

    // Placeholder: livepeer actual API flow varies by deployment / version.
    // Here we return a simple object indicating intent. Implementers should replace
    // this with the Livepeer Studio or LPMS upload flow (create asset -> upload -> poll).
    const body = { name: name || `asset-${Date.now()}`, ipfsCid };
    // Attempt a best-effort POST to create an asset record (non-blocking)
    try {
      const res = await fetch(`${this.host}/asset/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      return Object.assign({ status: 'created' }, json);
    } catch (err) {
      return { id: `livepeer-error-${Date.now()}`, status: 'error', error: err.message };
    }
  }

  // Create an asset and (optionally) upload the file. This is a minimal stub.
  async createAssetFromFile(filePath, name) {
    if (!this.apiKey) {
      return {
        id: `mock-livepeer-asset-${Date.now()}`,
        status: 'mocked',
        name: name || `asset-${Date.now()}`,
        filePath,
        playbackUrl: `https://playback.mock/local/${Date.now()}/manifest.m3u8`
      };
    }

    // For real integration: create an asset record then POST file bytes to the returned upload URL.
    // We'll return an informative object for now.
    try {
      const nameToUse = name || (filePath && filePath.split('/').pop()) || `asset-${Date.now()}`;
      const createRes = await fetch(`${this.host}/asset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ name: nameToUse })
      });
      const createJson = await createRes.json();

      // If Livepeer returns an upload URL, we would upload there. We'll skip and return the create response.
      return Object.assign({ status: 'created' }, createJson);
    } catch (err) {
      return { id: `livepeer-error-${Date.now()}`, status: 'error', error: err.message };
    }
  }
}

module.exports = LivepeerClient;
