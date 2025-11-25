const fetch = global.fetch || require('node-fetch');
const LIVEPEER_API_KEY = process.env.LIVEPEER_API_KEY;
const LIVEPEER_API_BASE = process.env.LIVEPEER_API_BASE || process.env.LIVEPEER_API_HOST || 'https://livepeer.studio/api';

async function createAsset(name = 'beatschain-asset', options = {}) {
  // Default to mocking when no key is provided (safe for local dev)
  if (!LIVEPEER_API_KEY) {
    return {
      id: `mock-${Date.now()}`,
      name,
      status: 'created',
      uploadUrl: `ipfs://mock-${Date.now()}`,
      mocked: true,
      createdAt: Date.now()
    };
  }

  // Build request for Livepeer asset creation with transcoding profiles
  const url = `${LIVEPEER_API_BASE.replace(/\/$/, '')}/asset`;
  const body = Object.assign({ 
    name, 
    upload: { approach: 'tus' },
    profiles: [
      { name: '720p', bitrate: 2000000, fps: 30, width: 1280, height: 720 },
      { name: '480p', bitrate: 1000000, fps: 30, width: 854, height: 480 },
      { name: '360p', bitrate: 500000, fps: 30, width: 640, height: 360 }
    ]
  }, options);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LIVEPEER_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Livepeer createAsset failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  // Normalize common upload URL locations so callers can find uploadUrl easily
  const uploadUrl = data?.upload?.url || data?.upload?.tus?.endpoint || data?.urls?.uploadUrl || data?.uploadUrl;
  if (uploadUrl) data.uploadUrl = uploadUrl;

  return data;
}

async function getAsset(assetId) {
  if (!LIVEPEER_API_KEY) {
    return {
      id: assetId,
      status: 'ready',
      playbackUrl: `ipfs://QmMockPlayback${assetId}`,
      mocked: true
    };
  }

  const url = `${LIVEPEER_API_BASE.replace(/\/$/, '')}/asset/${assetId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${LIVEPEER_API_KEY}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Livepeer getAsset failed: ${res.status} ${text}`);
  }

  return await res.json();
}

async function handleWebhook(payload) {
  try {
    if (payload.event === 'asset.ready' && payload.asset) {
      const asset = payload.asset;
      
      // Sync with real-time service if available
      try {
        const realTimeSync = require('./realTimeSync');
        await realTimeSync.syncBeatData({
          livepeerAssetId: asset.id,
          playbackUrl: asset.playbackUrl,
          status: 'ready',
          duration: asset.duration
        });
      } catch (syncError) {
        console.warn('Real-time sync not available:', syncError.message);
      }
      
      console.log(`Asset ${asset.id} processed successfully`);
      return { success: true, assetId: asset.id };
    }
    
    return { success: true, message: 'Webhook processed' };
  } catch (error) {
    console.error('Webhook processing failed:', error);
    throw error;
  }
}

module.exports = {
  createAsset,
  getAsset,
  handleWebhook
};
