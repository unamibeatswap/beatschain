// Asset Card Renderer - Styled Cards with Extension Design Patterns
class AssetCardRenderer {
  constructor() {
    this.cardTemplates = new Map();
    this.setupTemplates();
  }

  setupTemplates() {
    this.cardTemplates.set('nft', this.nftCardTemplate);
    this.cardTemplates.set('campaign', this.campaignCardTemplate);
    this.cardTemplates.set('isrc', this.isrcCardTemplate);
  }

  renderAssetCard(asset) {
    const template = this.cardTemplates.get(asset.type) || this.defaultCardTemplate;
    return template.call(this, asset);
  }

  nftCardTemplate(asset) {
    const mockBadge = asset.isMockData ? '<span class="mock-badge">MOCK</span>' : '';
    const coverImage = asset.coverUrl ? `<img src="${asset.coverUrl}" alt="${asset.title}" class="cover-thumbnail">` : '<div class="cover-placeholder">🎵</div>';
    return `
      <div class="asset-card" data-asset-id="${asset.id}">
        <div class="asset-card-header">
          ${coverImage}
          <div class="asset-info">
            <h3>${asset.title} ${mockBadge}</h3>
            <p class="artist">${asset.artist}</p>
          </div>
          <span class="asset-type-badge">NFT</span>
        </div>
        
        <div class="asset-metadata">
          ${asset.genre ? `<span class="metadata-tag">${asset.genre}</span>` : ''}
          ${asset.isrc ? `<span class="metadata-tag isrc-tag">${asset.isrc}</span>` : ''}
          ${asset.duration ? `<span class="metadata-tag">⏱️ ${asset.duration}</span>` : ''}
          ${asset.format ? `<span class="metadata-tag">${asset.format}</span>` : ''}
        </div>
        
        <div class="asset-actions">
          ${asset.audioUrl ? `<button class="play-btn" data-asset-id="${asset.id}">▶️</button>` : '<div></div>'}
          <div class="asset-stats">
            <span class="stat">
              <span>▶️</span>
              <span>${asset.plays || 0}</span>
            </span>
            <span class="stat">
              <span>❤️</span>
              <span>${asset.likes || 0}</span>
            </span>
          </div>
        </div>
        
        ${asset.blockchain ? `
          <div class="blockchain-info">
            <span class="network-badge">${asset.blockchain.network}</span>
            <span class="token-id">#${asset.blockchain.tokenId}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  campaignCardTemplate(asset) {
    const statusColor = asset.status === 'active' ? 'var(--primary-green)' : 'var(--text-secondary)';
    const mockBadge = asset.isMockData ? '<span class="mock-badge">MOCK</span>' : '';
    
    return `
      <div class="asset-card campaign-card" data-asset-id="${asset.id}">
        <div class="asset-card-header">
          <div class="asset-info">
            <h3>${asset.title} ${mockBadge}</h3>
            <p class="artist">${asset.artist}</p>
          </div>
          <span class="asset-type-badge" style="background: #ff9800;">Campaign</span>
        </div>
        
        <div class="campaign-description">
          <p>${asset.description || 'No description available'}</p>
        </div>
        
        <div class="campaign-metrics">
          <div class="metric-item">
            <span class="metric-value">${asset.impressions || 0}</span>
            <span class="metric-label">Impressions</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">${asset.clicks || 0}</span>
            <span class="metric-label">Clicks</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">${this.calculateCTR(asset.clicks, asset.impressions)}%</span>
            <span class="metric-label">CTR</span>
          </div>
        </div>
        
        <div class="campaign-status">
          <span class="status-indicator" style="background: ${statusColor}"></span>
          <span class="status-text">${asset.status || 'Unknown'}</span>
        </div>
      </div>
    `;
  }

  isrcCardTemplate(asset) {
    const mockBadge = asset.isMockData ? '<span class="mock-badge">MOCK</span>' : '';
    return `
      <div class="asset-card isrc-card" data-asset-id="${asset.id}">
        <div class="asset-card-header">
          <div class="asset-info">
            <h3>${asset.isrc} ${mockBadge}</h3>
            <p class="artist">${asset.artist || 'Unknown Artist'}</p>
          </div>
          <span class="asset-type-badge" style="background: #9c27b0;">ISRC</span>
        </div>
        
        <div class="isrc-breakdown">
          ${this.renderISRCBreakdown(asset.isrc)}
        </div>
        
        <div class="isrc-metadata">
          <div class="metadata-item">
            <span class="metadata-label">Generated:</span>
            <span class="metadata-value">${new Date(asset.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Status:</span>
            <span class="metadata-value">${asset.status || 'Active'}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Embedded:</span>
            <span class="metadata-value">${asset.embedded ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    `;
  }

  defaultCardTemplate(asset) {
    return `
      <div class="asset-card" data-asset-id="${asset.id}">
        <div class="asset-card-header">
          <div class="asset-info">
            <h3>${asset.title || 'Untitled'}</h3>
            <p class="artist">${asset.artist || 'Unknown'}</p>
          </div>
          <span class="asset-type-badge">${asset.type.toUpperCase()}</span>
        </div>
        
        <div class="asset-metadata">
          <span class="metadata-tag">Created: ${new Date(asset.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;
  }

  renderISRCBreakdown(isrc) {
    if (!isrc) return '<p>Invalid ISRC</p>';
    
    const parts = isrc.split('-');
    if (parts.length !== 4) return '<p>Invalid ISRC format</p>';
    
    return `
      <div class="isrc-parts">
        <div class="isrc-part">
          <span class="part-value">${parts[0]}</span>
          <span class="part-label">Country</span>
        </div>
        <div class="isrc-part">
          <span class="part-value">${parts[1]}</span>
          <span class="part-label">Registrant</span>
        </div>
        <div class="isrc-part">
          <span class="part-value">${parts[2]}</span>
          <span class="part-label">Year</span>
        </div>
        <div class="isrc-part">
          <span class="part-value">${parts[3]}</span>
          <span class="part-label">Designation</span>
        </div>
      </div>
    `;
  }

  calculateCTR(clicks, impressions) {
    if (!impressions || impressions === 0) return '0.0';
    return ((clicks / impressions) * 100).toFixed(1);
  }

  renderAssetGrid(assets) {
    return assets.map(asset => this.renderAssetCard(asset)).join('');
  }

  updateAssetCard(assetId, updates) {
    const card = document.querySelector(`[data-asset-id="${assetId}"]`);
    if (!card) return;

    // Update specific elements based on updates
    if (updates.plays !== undefined) {
      const playsElement = card.querySelector('.stat:first-child span:last-child');
      if (playsElement) playsElement.textContent = updates.plays;
    }

    if (updates.likes !== undefined) {
      const likesElement = card.querySelector('.stat:last-child span:last-child');
      if (likesElement) likesElement.textContent = updates.likes;
    }
  }
}

window.AssetCardRenderer = AssetCardRenderer;