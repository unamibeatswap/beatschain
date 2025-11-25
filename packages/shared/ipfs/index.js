const fs = require('fs');
const path = require('path');

class SharedIpfs {
  constructor(token) {
    this.token = token || process.env.WEB3STORAGE_TOKEN || null;
    this.enabled = !!this.token;
    if (this.enabled) {
      try {
        const { Web3Storage, File } = require('web3.storage');
        this.Web3Storage = Web3Storage;
        this.File = File;
        this.client = new Web3Storage({ token: this.token });
      } catch (e) {
        console.warn('web3.storage not available in shared/ipfs:', e.message);
        this.enabled = false;
      }
    }
  }

  async pinJSON(obj) {
    if (!this.enabled) return { ipfsHash: 'QmDevMock' + Math.random().toString(16).slice(2, 12) };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const file = new this.File([blob], 'metadata.json');
    const cid = await this.client.put([file], { wrapWithDirectory: false });
    return { ipfsHash: cid };
  }

  async pinFile(filePath, originalName) {
    if (!this.enabled) return { ipfsHash: 'QmDevMock' + Math.random().toString(16).slice(2, 8) };
    const buffer = fs.readFileSync(filePath);
    const file = new this.File([buffer], originalName || path.basename(filePath));
    const cid = await this.client.put([file], { wrapWithDirectory: false });
    return { ipfsHash: cid };
  }
}

module.exports = SharedIpfs;
