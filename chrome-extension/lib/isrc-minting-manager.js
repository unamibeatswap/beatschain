// ISRC Minting Manager - Professional Music Industry Integration
class ISRCMintingManager {
  constructor() {
    this.isrcManager = null;
    this.metadataWriter = null;
    this.sponsorManager = null;
    this.currentISRC = null;
    this.sponsorEnabled = true;
  }

  async initialize() {
    try {
      // Initialize dependencies with error handling
      if (window.ISRCManager) {
        this.isrcManager = new ISRCManager();
        await this.isrcManager.initialize();
      }
      
      if (window.MetadataWriter) {
        this.metadataWriter = new MetadataWriter();
      }
      
      if (window.SponsorContentManager) {
        this.sponsorManager = new SponsorContentManager();
      }
      
      await this.loadISRCRegistry();
      this.setupEventListeners();
      this.updateRegistryDisplay();
      this.loadSponsorContent();
    } catch (error) {
      console.error('ISRC Minting Manager initialization failed:', error);
    }
  }

  setupEventListeners() {
    document.getElementById('generate-isrc')?.addEventListener('click', () => this.generateNewISRC());
    document.getElementById('validate-isrc')?.addEventListener('click', () => this.validateCurrentISRC());
    document.getElementById('copy-isrc')?.addEventListener('click', () => this.copyISRCToClipboard());
    document.getElementById('enable-sponsor-isrc')?.addEventListener('change', (e) => this.toggleSponsorContent(e.target.checked));
    document.getElementById('proceed-to-mint')?.addEventListener('click', () => this.proceedToMinting());
    document.getElementById('export-registry')?.addEventListener('click', () => this.exportRegistry());
  }

  async generateNewISRC() {
    try {
      if (!this.isrcManager) {
        this.showError('ISRC Manager not available');
        return;
      }
      
      this.updateStatus('Generating...');
      
      // Ensure ISRC manager is initialized
      if (!this.isrcManager.registry) {
        await this.isrcManager.initialize();
      }
      
      // Generate new ISRC code
      this.currentISRC = await this.isrcManager.generateISRC();
      
      // Update display
      this.updateISRCDisplay(this.currentISRC);
      this.updateStatus('Generated');
      
      // Update registry
      await this.updateRegistry();
      
      // Show success animation
      this.showSuccessAnimation();
      
    } catch (error) {
      console.error('ISRC generation failed:', error);
      this.updateStatus('Error');
      this.showError('Failed to generate ISRC code');
    }
  }

  updateISRCDisplay(isrcCode) {
    const display = document.getElementById('generated-isrc');
    if (display) {
      display.textContent = isrcCode;
      display.classList.add('updated');
      setTimeout(() => display.classList.remove('updated'), 1000);
    }

    // Update breakdown
    const parts = isrcCode.split('-');
    const breakdown = document.querySelector('.isrc-breakdown');
    if (breakdown && parts.length === 4) {
      breakdown.innerHTML = `
        <span class="isrc-part">${parts[0]} <small>Country</small></span>
        <span class="isrc-part">${parts[1]} <small>Registrant</small></span>
        <span class="isrc-part">${parts[2]} <small>Year</small></span>
        <span class="isrc-part">${parts[3]} <small>Designation</small></span>
      `;
    }
  }

  async validateCurrentISRC() {
    if (!this.currentISRC) {
      this.showError('No ISRC code to validate');
      return;
    }

    try {
      this.updateStatus('Validating...');
      
      const isValid = await this.isrcManager.validateISRC(this.currentISRC);
      
      if (isValid) {
        this.updateStatus('Valid');
        this.showSuccess('ISRC code is valid');
      } else {
        this.updateStatus('Invalid');
        this.showError('ISRC code is invalid');
      }
      
    } catch (error) {
      console.error('ISRC validation failed:', error);
      this.updateStatus('Error');
      this.showError('Validation failed');
    }
  }

  async copyISRCToClipboard() {
    if (!this.currentISRC) return;

    try {
      await navigator.clipboard.writeText(this.currentISRC);
      
      const copyBtn = document.getElementById('copy-isrc');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✅';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1500);
      
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  async loadSponsorContent() {
    try {
      if (this.sponsorManager && typeof this.sponsorManager.getSponsorContent === 'function') {
        const sponsorData = await this.sponsorManager.getSponsorContent('isrc-minting');
        
        if (sponsorData) {
          this.renderSponsorContent(sponsorData);
        }
      }
      
    } catch (error) {
      console.error('Failed to load sponsor content:', error);
    }
  }

  renderSponsorContent(sponsorData) {
    const container = document.getElementById('isrc-sponsor-content');
    if (!container) return;

    container.innerHTML = `
      <div class="sponsor-banner">
        <div class="sponsor-logo">
          <img src="${sponsorData.logo}" alt="${sponsorData.name}" />
        </div>
        <div class="sponsor-message">
          <h4>${sponsorData.title}</h4>
          <p>${sponsorData.description}</p>
          <button class="sponsor-cta" onclick="window.open('${sponsorData.url}', '_blank')">
            ${sponsorData.ctaText}
          </button>
        </div>
      </div>
    `;
  }

  toggleSponsorContent(enabled) {
    this.sponsorEnabled = enabled;
    
    const revenueDisplay = document.querySelector('.revenue-badge');
    if (revenueDisplay) {
      revenueDisplay.textContent = enabled ? '+$2.50 Revenue' : 'Disabled';
      revenueDisplay.style.opacity = enabled ? '1' : '0.5';
    }

    // Track sponsor engagement
    if (enabled && this.sponsorManager && typeof this.sponsorManager.trackEngagement === 'function') {
      this.sponsorManager.trackEngagement('isrc-sponsor-enabled');
    }
  }

  async updateRegistry() {
    if (!this.currentISRC) return;

    try {
      // Registry is already updated in generateISRC method
      this.updateRegistryDisplay();
      
    } catch (error) {
      console.error('Registry update failed:', error);
    }
  }

  async updateRegistryDisplay() {
    try {
      const registry = this.isrcManager.getISRCRegistry();
      const count = registry.total;
      
      const countDisplay = document.getElementById('isrc-count');
      if (countDisplay) {
        countDisplay.textContent = `${count} codes generated`;
      }

      // Update registry list preview
      const listContainer = document.getElementById('isrc-registry-list');
      if (listContainer && count > 0 && this.isrcManager.registry) {
        const codes = Object.entries(this.isrcManager.registry.codes);
        const recentCodes = codes.slice(-3).reverse();
        listContainer.innerHTML = recentCodes.map(([isrc, data]) => `
          <div class="registry-item">
            <span class="registry-isrc">${isrc}</span>
            <span class="registry-date">${new Date(data.generated).toLocaleDateString()}</span>
          </div>
        `).join('');
      }
      
    } catch (error) {
      console.error('Registry display update failed:', error);
    }
  }

  async proceedToMinting() {
    if (!this.currentISRC) {
      this.showError('Please generate an ISRC code first');
      return;
    }

    try {
      // Prepare minting data with ISRC
      const mintingData = {
        isrc: this.currentISRC,
        sponsorEnabled: this.sponsorEnabled,
        timestamp: Date.now()
      };

      // Store for minting process
      await chrome.storage.local.set({
        'current-minting-isrc': mintingData
      });

      // Track sponsor revenue if enabled
      if (this.sponsorEnabled && this.sponsorManager && typeof this.sponsorManager.trackRevenue === 'function') {
        await this.sponsorManager.trackRevenue('isrc-minting', 2.50);
      }

      // Navigate to minting section
      this.navigateToMinting();
      
    } catch (error) {
      console.error('Minting preparation failed:', error);
      this.showError('Failed to prepare for minting');
    }
  }

  navigateToMinting() {
    // Switch to minting section
    const event = new CustomEvent('switchSection', {
      detail: { section: 'minting', data: { isrc: this.currentISRC } }
    });
    document.dispatchEvent(event);
  }

  async exportRegistry() {
    try {
      if (!this.isrcManager.registry) {
        await this.isrcManager.initialize();
      }
      
      const codes = Object.entries(this.isrcManager.registry.codes);
      
      const csvContent = [
        'ISRC,Date Generated,Track Title,Artist Name,Used',
        ...codes.map(([isrc, data]) => 
          `${isrc},${data.generated},${data.trackTitle || ''},${data.artistName || ''},${data.used ? 'Yes' : 'No'}`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `isrc-registry-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Registry export failed:', error);
      this.showError('Failed to export registry');
    }
  }

  updateStatus(status) {
    const statusBadge = document.getElementById('isrc-status');
    if (statusBadge) {
      statusBadge.textContent = status;
      statusBadge.className = `status-badge ${status.toLowerCase()}`;
    }
  }

  showSuccessAnimation() {
    const isrcDisplay = document.querySelector('.isrc-display');
    if (isrcDisplay) {
      isrcDisplay.classList.add('success-pulse');
      setTimeout(() => isrcDisplay.classList.remove('success-pulse'), 1000);
    }
  }

  showSuccess(message) {
    // Implementation for success notification
    console.log('Success:', message);
  }

  showError(message) {
    // Implementation for error notification
    console.error('Error:', message);
  }

  async loadISRCRegistry() {
    try {
      // Ensure ISRC manager is initialized
      if (!this.isrcManager.registry) {
        await this.isrcManager.initialize();
      }
      
      const registry = this.isrcManager.getISRCRegistry();
      if (registry.total > 0) {
        // Get the last generated ISRC from registry codes
        const codes = Object.keys(this.isrcManager.registry.codes);
        if (codes.length > 0) {
          this.currentISRC = codes[codes.length - 1];
          this.updateISRCDisplay(this.currentISRC);
        }
      }
    } catch (error) {
      console.error('Failed to load ISRC registry:', error);
    }
  }
}

// Initialize ISRC Minting Manager
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('isrc-minting-section')) {
    const isrcMintingManager = new ISRCMintingManager();
    isrcMintingManager.initialize();
  }
});