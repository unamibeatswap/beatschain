;
  targeting?: {
    userType?;
    timeOfDay?;
    frequency?;
  };
}

// Enhanced CRUD operations for sponsored content
class SponsorManager {
  sponsors = [];
  
  constructor() {
    this.loadSponsors();
  }
  
  // Create new sponsor
  createSponsor(sponsorData, 'id'>) {
    const sponsor = {
      id.generateId(),
      ...sponsorData
    };
    
    this.sponsors.push(sponsor);
    this.saveSponsors();
    return sponsor;
  }
  
  // Read sponsors with filtering
  readSponsors(filters?: { 
    placement?; 
    active?; 
    campaign? 
  }) {
    let filtered = [...this.sponsors];
    
    if (filters?.placement) {
      filtered = filtered.filter(s => s.placement === filters.placement);
    }
    
    if (filters?.active !== undefined) {
      filtered = filtered.filter(s => s.active === filters.active);
    }
    
    if (filters?.campaign) {
      filtered = filtered.filter(s => s.campaign.includes(filters.campaign));
    }
    
    return filtered.sort((a, b) => b.priority - a.priority);
  }
  
  // Update sponsor
  updateSponsor(id, updates) | null {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.sponsors[index] = { ...this.sponsors[index], ...updates };
    this.saveSponsors();
    return this.sponsors[index];
  }
  
  // Delete sponsor
  deleteSponsor(id) {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.sponsors.splice(index, 1);
    this.saveSponsors();
    return true;
  }
  
  // Get sponsors for specific placement
  getSponsorsForPlacement(placement) {
    return this.readSponsors({ placement, active });
  }
  
  generateId() {
    return 'sponsor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  loadSponsors() {
    // Load from chrome storage or localStorage
    try {
      const stored = localStorage.getItem('beatschain_sponsors');
      if (stored) {
        this.sponsors = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load sponsors:', e);
    }
  }
  
  saveSponsors() {
    try {
      localStorage.setItem('beatschain_sponsors', JSON.stringify(this.sponsors));
    } catch (e) {
      console.warn('Failed to save sponsors:', e);
    }
  }
}

// Default sponsors for BeatsChain
export const defaultSponsors, 'id'>[] = [
  {
    brand: 'Radiomonitor South Africa',
    campaign: 'Radio Tracking Services',
    placement: 'after_isrc',
    active,
    priority: 10,
    content: {
      title: 'Track Your Radio Airplay',
      description: 'Professional radio monitoring across South Africa',
      actionUrl: 'https://radiomonitor.co.za'
    }
  },
  {
    brand: 'SAMRO Official',
    campaign: 'Music Rights Management',
    placement: 'before_package',
    active,
    priority: 9,
    content: {
      title: 'Protect Your Music Rights',
      description: 'Official SAMRO registration and royalty collection',
      actionUrl: 'https://samro.org.za'
    }
  },
  {
    brand: 'BeatsChain Pro',
    campaign: 'Platform Upgrade',
    placement: 'after_package',
    active,
    priority: 5,
    content: {
      title: 'Upgrade to BeatsChain Pro',
      description: 'Unlimited uploads and premium features',
      actionUrl: '#upgrade'
    }
  }
];