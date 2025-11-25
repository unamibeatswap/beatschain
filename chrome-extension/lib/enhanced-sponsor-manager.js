// Enhanced Sponsor Manager Integration
// Integrates with existing chrome-extension/lib/google-drive-sponsor-manager.js

class EnhancedSponsorManager {
  constructor() {
    this.sponsors = [];
    this.loadSponsors();
  }
  
  // Enhanced CRUD operations
  createSponsor(sponsorData) {
    const sponsor = {
      id: this.generateId(),
      ...sponsorData,
      created: new Date().toISOString()
    };
    
    this.sponsors.push(sponsor);
    this.saveSponsors();
    return sponsor;
  }
  
  readSponsors(filters = {}) {
    let filtered = [...this.sponsors];
    
    if (filters.placement) {
      filtered = filtered.filter(s => s.placement === filters.placement);
    }
    
    if (filters.active !== undefined) {
      filtered = filtered.filter(s => s.active === filters.active);
    }
    
    return filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }
  
  updateSponsor(id, updates) {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.sponsors[index] = { ...this.sponsors[index], ...updates };
    this.saveSponsors();
    return this.sponsors[index];
  }
  
  deleteSponsor(id) {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.sponsors.splice(index, 1);
    this.saveSponsors();
    return true;
  }
  
  generateId() {
    return 'sponsor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  loadSponsors() {
    try {
      chrome.storage.local.get(['beatschain_sponsors'], (result) => {
        if (result.beatschain_sponsors) {
          this.sponsors = result.beatschain_sponsors;
        }
      });
    } catch (e) {
      console.warn('Failed to load sponsors:', e);
    }
  }
  
  saveSponsors() {
    try {
      chrome.storage.local.set({ beatschain_sponsors: this.sponsors });
    } catch (e) {
      console.warn('Failed to save sponsors:', e);
    }
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.EnhancedSponsorManager = EnhancedSponsorManager;
}