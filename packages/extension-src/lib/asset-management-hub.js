// Asset Management Hub - Core CRUD Operations
class AssetManagementHub {
  constructor() {
    this.assets = new Map();
    this.audioPlayer = null;
    this.currentlyPlaying = null;
  }

  async initialize() {
    await this.loadAssets();
    this.setupAudioPlayer();
    this.setupEventListeners();
  }

  async loadAssets() {
    try {
      let stored;
      
      // Try Chrome storage first
      try {
        stored = await chrome.storage.local.get(['nftAssets', 'campaigns', 'isrcRegistry']);
        console.log('💾 Loaded from Chrome storage:', stored);
      } catch (chromeError) {
        console.warn('⚠️ Chrome storage unavailable, trying localStorage:', chromeError);
        // Fallback to localStorage
        stored = {
          nftAssets: JSON.parse(localStorage.getItem('nftAssets') || '[]'),
          campaigns: JSON.parse(localStorage.getItem('campaigns') || '[]'),
          isrcRegistry: JSON.parse(localStorage.getItem('isrcRegistry') || '[]')
        };
        console.log('💾 Loaded from localStorage:', stored);
      }
      
      // Clear existing assets
      this.assets.clear();
      
      // Combine all asset types
      const nftAssets = stored.nftAssets || [];
      const campaigns = stored.campaigns || [];
      const isrcCodes = stored.isrcRegistry || [];

      // Process NFT assets
      nftAssets.forEach(nft => {
        this.assets.set(nft.id || `nft_${Date.now()}`, {
          id: nft.id,
          type: 'nft',
          title: nft.title,
          artist: nft.artist,
          genre: nft.genre,
          isrc: nft.isrc,
          duration: nft.duration,
          format: nft.format,
          audioUrl: nft.audioUrl,
          coverUrl: nft.coverUrl,
          blockchain: nft.blockchain,
          createdAt: nft.createdAt,
          plays: nft.plays || 0,
          likes: nft.likes || 0,
          isMockData: nft.isMockData || false
        });
      });

      // Process campaigns
      campaigns.forEach(campaign => {
        this.assets.set(campaign.id || `campaign_${Date.now()}`, {
          id: campaign.id,
          type: 'campaign',
          title: campaign.title,
          artist: campaign.sponsor || campaign.artist,
          description: campaign.description,
          status: campaign.status,
          impressions: campaign.impressions || campaign.metrics?.impressions || 0,
          clicks: campaign.clicks || campaign.metrics?.clicks || 0,
          createdAt: campaign.createdAt,
          isMockData: campaign.isMockData || false
        });
      });
      
      // Process ISRC codes as assets
      isrcCodes.forEach(isrc => {
        this.assets.set(isrc.id || `isrc_${Date.now()}`, {
          id: isrc.id,
          type: 'isrc',
          title: isrc.title,
          artist: isrc.artist,
          isrc: isrc.isrc,
          status: isrc.status,
          embedded: isrc.embedded,
          createdAt: isrc.createdAt,
          isMockData: isrc.isMockData || false
        });
      });

      console.log(`✅ Loaded ${this.assets.size} assets (${nftAssets.length} NFTs, ${campaigns.length} campaigns, ${isrcCodes.length} ISRC codes)`);
    } catch (error) {
      console.error('❌ Failed to load assets:', error);
    }
  }

  async getAssets(filters = {}) {
    let assets = Array.from(this.assets.values());

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      assets = assets.filter(asset => asset.type === filters.type);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      assets = assets.filter(asset => 
        asset.title?.toLowerCase().includes(searchTerm) ||
        asset.artist?.toLowerCase().includes(searchTerm) ||
        asset.genre?.toLowerCase().includes(searchTerm) ||
        asset.isrc?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        assets.sort((a, b) => (b.plays || 0) - (a.plays || 0));
        break;
      case 'trending':
        assets.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default: // newest
        assets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return assets;
  }

  async createAsset(assetData) {
    const id = Date.now().toString();
    const asset = {
      id,
      ...assetData,
      createdAt: new Date().toISOString(),
      plays: 0,
      likes: 0
    };

    this.assets.set(id, asset);
    await this.saveAssets();
    return asset;
  }

  async updateAsset(id, updates) {
    const asset = this.assets.get(id);
    if (!asset) throw new Error('Asset not found');

    const updatedAsset = { ...asset, ...updates };
    this.assets.set(id, updatedAsset);
    await this.saveAssets();
    return updatedAsset;
  }

  async deleteAsset(id) {
    const deleted = this.assets.delete(id);
    if (deleted) {
      await this.saveAssets();
    }
    return deleted;
  }

  async getAssetById(id) {
    return this.assets.get(id);
  }

  async playAudio(assetId) {
    const asset = this.assets.get(assetId);
    if (!asset || !asset.audioUrl) return false;

    try {
      if (this.currentlyPlaying === assetId) {
        this.pauseAudio();
        return false;
      }

      if (this.audioPlayer) {
        this.audioPlayer.pause();
      }

      this.audioPlayer = new Audio(asset.audioUrl);
      this.currentlyPlaying = assetId;

      this.audioPlayer.addEventListener('ended', () => {
        this.currentlyPlaying = null;
        this.updatePlayButton(assetId, false);
      });

      await this.audioPlayer.play();
      this.updatePlayButton(assetId, true);
      
      // Increment play count
      await this.incrementPlays(assetId);
      
      return true;
    } catch (error) {
      console.error('Audio play failed:', error);
      return false;
    }
  }

  pauseAudio() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.updatePlayButton(this.currentlyPlaying, false);
      this.currentlyPlaying = null;
    }
  }

  async incrementPlays(assetId) {
    const asset = this.assets.get(assetId);
    if (asset) {
      asset.plays = (asset.plays || 0) + 1;
      await this.saveAssets();
      // Record measurement
      await this.recordAssetInteraction(assetId, 'play');
    }
  }

  // Measurement Integration
  async recordAssetInteraction(assetId, interactionType) {
    if (window.packageMeasurementSystem) {
      await window.packageMeasurementSystem.recordAssetInteraction?.({ assetId, type: interactionType, timestamp: Date.now() });
    }
  }

  getAssetMetrics(assetId) {
    const asset = this.assets.get(assetId);
    if (!asset) return null;
    return {
      plays: asset.plays || 0,
      likes: asset.likes || 0,
      qualityScore: this.calculateQualityScore(asset),
      completeness: this.calculateCompleteness(asset)
    };
  }

  calculateQualityScore(asset) {
    let score = 50;
    if (asset.isrc) score += 20;
    if (asset.genre) score += 10;
    if (asset.duration) score += 10;
    if (asset.coverUrl) score += 10;
    return Math.min(score, 100);
  }

  calculateCompleteness(asset) {
    const fields = ['title', 'artist', 'genre', 'isrc', 'duration'];
    const completed = fields.filter(field => asset[field]).length;
    return Math.round((completed / fields.length) * 100);
  }

  updatePlayButton(assetId, isPlaying) {
    const playBtn = document.querySelector(`[data-asset-id="${assetId}"] .play-btn`);
    if (playBtn) {
      playBtn.textContent = isPlaying ? '⏸️' : '▶️';
      playBtn.classList.toggle('playing', isPlaying);
    }
  }

  async saveAssets() {
    try {
      const nftAssets = [];
      const campaigns = [];
      const isrcRegistry = [];

      this.assets.forEach(asset => {
        if (asset.type === 'nft') {
          nftAssets.push(asset);
        } else if (asset.type === 'campaign') {
          campaigns.push(asset);
        } else if (asset.type === 'isrc') {
          isrcRegistry.push(asset);
        }
      });

      try {
        await chrome.storage.local.set({
          nftAssets,
          campaigns,
          isrcRegistry
        });
        console.log('✅ Assets saved to Chrome storage');
      } catch (chromeError) {
        console.warn('⚠️ Chrome storage unavailable, using localStorage:', chromeError);
        localStorage.setItem('nftAssets', JSON.stringify(nftAssets));
        localStorage.setItem('campaigns', JSON.stringify(campaigns));
        localStorage.setItem('isrcRegistry', JSON.stringify(isrcRegistry));
        console.log('✅ Assets saved to localStorage');
      }
    } catch (error) {
      console.error('❌ Failed to save assets:', error);
    }
  }

  getStats() {
    const assets = Array.from(this.assets.values());
    return {
      totalAssets: assets.length,
      totalPlays: assets.reduce((sum, asset) => sum + (asset.plays || 0), 0),
      activeCampaigns: assets.filter(asset => asset.type === 'campaign' && asset.status === 'active').length,
      nftCount: assets.filter(asset => asset.type === 'nft').length,
      avgQualityScore: this.getAverageQualityScore(assets),
      avgCompleteness: this.getAverageCompleteness(assets)
    };
  }

  getAverageQualityScore(assets) {
    if (assets.length === 0) return 0;
    const total = assets.reduce((sum, asset) => sum + this.calculateQualityScore(asset), 0);
    return Math.round(total / assets.length);
  }

  getAverageCompleteness(assets) {
    if (assets.length === 0) return 0;
    const total = assets.reduce((sum, asset) => sum + this.calculateCompleteness(asset), 0);
    return Math.round(total / assets.length);
  }

  setupAudioPlayer() {
    // Global audio player setup
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('play-btn')) {
        const assetId = e.target.closest('[data-asset-id]')?.dataset.assetId;
        if (assetId) {
          this.playAudio(assetId);
        }
      }
    });
  }

  setupEventListeners() {
    // Asset card click handlers
    document.addEventListener('click', (e) => {
      if (e.target.closest('.asset-card') && !e.target.closest('.play-btn')) {
        const assetId = e.target.closest('[data-asset-id]')?.dataset.assetId;
        if (assetId) {
          this.showAssetDetails(assetId);
        }
      }
    });
  }

  async showAssetDetails(assetId) {
    const asset = await this.getAssetById(assetId);
    if (!asset) return;

    // Record view interaction
    await this.recordAssetInteraction(assetId, 'view');

    const modal = document.getElementById('asset-detail-modal');
    const content = document.getElementById('asset-detail-content');
    
    content.innerHTML = this.renderAssetDetails(asset);
    modal.style.display = 'block';

    // Close modal handlers
    modal.querySelector('.modal-close').onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }

  renderAssetDetails(asset) {
    return `
      <div class="asset-detail-grid">
        <div class="detail-section">
          <h4>Basic Information</h4>
          <div class="detail-item">
            <span class="detail-label">Title:</span>
            <span class="detail-value">${asset.title}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Artist:</span>
            <span class="detail-value">${asset.artist}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Genre:</span>
            <span class="detail-value">${asset.genre || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">ISRC:</span>
            <span class="detail-value isrc-tag">${asset.isrc || 'N/A'}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Statistics</h4>
          <div class="detail-item">
            <span class="detail-label">Plays:</span>
            <span class="detail-value">${asset.plays || 0}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Likes:</span>
            <span class="detail-value">${asset.likes || 0}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Created:</span>
            <span class="detail-value">${new Date(asset.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${asset.type.toUpperCase()}</span>
          </div>
        </div>
      </div>
      
      ${asset.audioUrl ? `
        <div class="audio-player">
          <div class="player-controls">
            <button class="player-btn play-btn" data-asset-id="${asset.id}">▶️</button>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <span class="time-display">0:00 / ${asset.duration || '0:00'}</span>
          </div>
        </div>
      ` : ''}
      
      ${asset.blockchain ? `
        <div class="detail-section">
          <h4>Blockchain Information</h4>
          <div class="detail-item">
            <span class="detail-label">Network:</span>
            <span class="detail-value">${asset.blockchain.network}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Contract:</span>
            <span class="detail-value">${asset.blockchain.contract}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Token ID:</span>
            <span class="detail-value">${asset.blockchain.tokenId}</span>
          </div>
        </div>
      ` : ''}
    `;
  }
}

window.AssetManagementHub = AssetManagementHub;