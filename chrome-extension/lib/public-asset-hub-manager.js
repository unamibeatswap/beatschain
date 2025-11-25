// Public Asset Hub Manager - Main Controller
class PublicAssetHubManager {
  constructor() {
    this.assetHub = new AssetManagementHub();
    this.cardRenderer = new AssetCardRenderer();
    this.currentFilters = {
      search: '',
      type: 'all',
      sortBy: 'newest'
    };
    this.assetsPerPage = 12;
    this.currentPage = 0;
    this.allAssets = [];
  }

  async initialize() {
    await this.assetHub.initialize();
    this.setupEventListeners();
    await this.loadAndDisplayAssets();
    this.updateStats();
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('asset-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(() => {
        this.currentFilters.search = searchInput.value;
        this.filterAndDisplayAssets();
      }, 300));
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.currentFilters.search = searchInput.value;
        this.filterAndDisplayAssets();
      });
    }

    // Filter controls
    const typeFilter = document.getElementById('asset-type-filter');
    const sortOptions = document.getElementById('sort-options');

    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.currentFilters.type = e.target.value;
        this.filterAndDisplayAssets();
      });
    }

    if (sortOptions) {
      sortOptions.addEventListener('change', (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.filterAndDisplayAssets();
      });
    }

    // Load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreAssets();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            searchInput?.focus();
            break;
          case 'r':
            e.preventDefault();
            this.refreshAssets();
            break;
        }
      }
    });
  }

  async loadAndDisplayAssets() {
    try {
      this.allAssets = await this.assetHub.getAssets(this.currentFilters);
      this.currentPage = 0;
      this.displayAssets();
    } catch (error) {
      console.error('Failed to load assets:', error);
      this.showError('Failed to load assets');
    }
  }

  async filterAndDisplayAssets() {
    try {
      this.allAssets = await this.assetHub.getAssets(this.currentFilters);
      this.currentPage = 0;
      this.displayAssets();
      this.updateStats();
    } catch (error) {
      console.error('Failed to filter assets:', error);
    }
  }

  displayAssets() {
    const grid = document.getElementById('asset-grid');
    if (!grid) return;

    const startIndex = 0;
    const endIndex = (this.currentPage + 1) * this.assetsPerPage;
    const assetsToShow = this.allAssets.slice(startIndex, endIndex);

    if (assetsToShow.length === 0) {
      grid.innerHTML = this.renderEmptyState();
      this.hideLoadMoreButton();
      return;
    }

    grid.innerHTML = this.cardRenderer.renderAssetGrid(assetsToShow);
    this.updateLoadMoreButton();
  }

  loadMoreAssets() {
    this.currentPage++;
    const startIndex = this.currentPage * this.assetsPerPage;
    const endIndex = startIndex + this.assetsPerPage;
    const newAssets = this.allAssets.slice(startIndex, endIndex);

    if (newAssets.length > 0) {
      const grid = document.getElementById('asset-grid');
      grid.innerHTML += this.cardRenderer.renderAssetGrid(newAssets);
    }

    this.updateLoadMoreButton();
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;

    const totalShown = (this.currentPage + 1) * this.assetsPerPage;
    const hasMore = totalShown < this.allAssets.length;

    if (hasMore) {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.textContent = `Load More (${this.allAssets.length - totalShown} remaining)`;
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  hideLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
  }

  updateStats() {
    const stats = this.assetHub.getStats();
    
    const totalAssetsEl = document.getElementById('total-assets');
    const totalPlaysEl = document.getElementById('total-plays');
    const activeCampaignsEl = document.getElementById('active-campaigns');

    if (totalAssetsEl) totalAssetsEl.textContent = stats.totalAssets;
    if (totalPlaysEl) totalPlaysEl.textContent = stats.totalPlays;
    if (activeCampaignsEl) activeCampaignsEl.textContent = stats.activeCampaigns;
  }

  renderEmptyState() {
    const hasFilters = this.currentFilters.search || this.currentFilters.type !== 'all';
    
    if (hasFilters) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No assets found</h3>
          <p>Try adjusting your search or filters</p>
          <button class="btn-secondary" onclick="publicAssetHub.clearFilters()">Clear Filters</button>
        </div>
      `;
    }

    return `
      <div class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>No assets yet</h3>
        <p>Start by minting your first NFT or creating a campaign</p>
        <button class="btn-primary" onclick="publicAssetHub.navigateToMinting()">Create Asset</button>
      </div>
    `;
  }

  clearFilters() {
    this.currentFilters = {
      search: '',
      type: 'all',
      sortBy: 'newest'
    };

    // Reset UI
    const searchInput = document.getElementById('asset-search');
    const typeFilter = document.getElementById('asset-type-filter');
    const sortOptions = document.getElementById('sort-options');

    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';
    if (sortOptions) sortOptions.value = 'newest';

    this.filterAndDisplayAssets();
  }

  async refreshAssets() {
    await this.assetHub.loadAssets();
    await this.loadAndDisplayAssets();
    this.showSuccess('Assets refreshed');
  }

  navigateToMinting() {
    const event = new CustomEvent('switchSection', {
      detail: { section: 'minting' }
    });
    document.dispatchEvent(event);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  showSuccess(message) {
    console.log('Success:', message);
    // TODO: Implement toast notification
  }

  showError(message) {
    console.error('Error:', message);
    // TODO: Implement toast notification
  }

  // Public API methods
  async addAsset(assetData) {
    const asset = await this.assetHub.createAsset(assetData);
    await this.refreshAssets();
    return asset;
  }

  async updateAsset(id, updates) {
    const asset = await this.assetHub.updateAsset(id, updates);
    this.cardRenderer.updateAssetCard(id, updates);
    this.updateStats();
    return asset;
  }

  async deleteAsset(id) {
    const deleted = await this.assetHub.deleteAsset(id);
    if (deleted) {
      const card = document.querySelector(`[data-asset-id="${id}"]`);
      if (card) {
        card.remove();
      }
      this.updateStats();
    }
    return deleted;
  }

  getAssetById(id) {
    return this.assetHub.getAssetById(id);
  }
}

// PublicAssetHubManager is now manually initialized by popup.js loadAssetHub function
// No auto-initialization to prevent conflicts

window.PublicAssetHubManager = PublicAssetHubManager;