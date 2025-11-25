const express = require('express');
const router = express.Router();
const Livepeer = require('../services/livepeerAdapter');
const Store = require('../services/livepeerStore');
const IpfsPinner = require('../services/ipfsPinner');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const tus = require('tus-js-client');
const fs = require('fs');

// POST /api/livepeer/upload
// body: { ipfsCid, name, metadata }
router.post('/livepeer/upload', async (req, res) => {
  try {
    const { ipfsCid, name, metadata } = req.body || {};
    if (!ipfsCid && !req.body) return res.status(400).json({ success: false, message: 'ipfsCid or body required' });

    const asset = await Livepeer.createAsset(name || `beats-${Date.now()}`, { metadata });
    const record = {
      assetId: asset.id || asset._id || asset.assetId || `mock-${Date.now()}`,
      name: name || asset.name || 'beatschain-asset',
      ipfsCid: ipfsCid || null,
      createdAt: Date.now(),
      asset,
    };

    await Store.saveAsset(record);

    res.json({ success: true, asset: record });
  } catch (err) {
    console.error('livepeer upload error', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/livepeer/upload-file
// Accepts multipart form with `file` field. Server uploads file to Livepeer via tus.
router.post('/livepeer/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'file required' });

    const name = req.body.name || req.file.originalname;

    // Create asset in Livepeer (adapter will return mock if no key)
    const asset = await Livepeer.createAsset(name, { metadata: req.body.metadata || {} });

    // If mocked, just save local mapping and return
    if (asset.mocked) {
      const record = {
        assetId: asset.id,
        name,
        path: req.file.path,
        size: req.file.size,
        createdAt: Date.now(),
        asset
      };
      await Store.saveAsset(record);
      return res.json({ success: true, asset: record });
    }

    // If Livepeer provided an upload URL that supports tus, use tus-js-client to upload
    const uploadUrl = asset.uploadUrl || asset.urls?.uploadUrl || asset.upload?.url || asset.upload_url;
    if (!uploadUrl) {
      // If Livepeer API requires a separate upload creation step, adapter should provide it; return asset for now
      const record = { assetId: asset.id || asset._id, name, createdAt: Date.now(), asset };
      await Store.saveAsset(record);
      return res.json({ success: true, asset: record, warning: 'no uploadUrl returned from Livepeer adapter' });
    }

    const fileStream = fs.createReadStream(req.file.path);

    const upload = new tus.Upload(fileStream, {
      endpoint: uploadUrl,
      metadata: {
        filename: req.file.originalname,
        filetype: req.file.mimetype
      },
      uploadSize: req.file.size,
      onError: function(error) {
        console.error('tus upload failed:', error);
      },
      onProgress: function(bytesUploaded, bytesTotal) {
        // optional: could write progress to store
      },
      onSuccess: async function() {
        try {
          const record = { assetId: asset.id || asset._id, name, uploadedAt: Date.now(), asset };
          await Store.saveAsset(record);
        } catch (err) {
          console.warn('saving asset record failed', err && err.message);
        }
      }
    });

    // Start upload (node stream support)
    upload.start();

    res.json({ success: true, started: true, asset });
  } catch (err) {
    console.error('upload-file error', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/livepeer/webhook - Enhanced webhook with real-time sync
router.post('/livepeer/webhook', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log('Livepeer webhook received:', payload);
    
    // Use enhanced webhook handler from adapter
    const result = await Livepeer.handleWebhook(payload);
    
    // Update local store for backward compatibility
    const assetId = payload.id || (payload.asset && (payload.asset.id || payload.asset._id));
    if (assetId) {
      const patch = { 
        lastWebhook: payload, 
        updatedAt: Date.now(),
        status: payload.asset?.status || 'processing'
      };
      await Store.updateAsset(assetId, patch);
    }
    
    // Log to success table if available
    try {
      const { getClient } = require('../services/supabaseClient');
      const sb = getClient();
      if (sb) {
        const insert = {
          event: 'livepeer_webhook',
          status: 'processed',
          metadata: { assetId, event: payload.event },
          details: { webhook: payload, result }
        };
        sb.from('success').insert([insert]).then(() => {}).catch(err => 
          console.warn('Success logging failed:', err?.message)
        );
      }
    } catch (logError) {
      console.warn('Success logging failed:', logError.message);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/livepeer/assets
router.get('/livepeer/assets', async (req, res) => {
  try {
    const list = await Store.listAssets();
    res.json({ success: true, assets: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

