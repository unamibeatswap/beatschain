export interface Sponsor {
  id: string;
  brand: string;
  campaign: string;
  placement: 'after_isrc' | 'validation' | 'before_package' | 'after_package';
  active: boolean;
  priority: number;
  content: {
    title: string;
    description: string;
    imageUrl?: string;
    actionUrl?: string;
  };
  targeting?: {
    userType?: string[];
    timeOfDay?: string[];
    frequency?: number;
  };
}

// Enhanced CRUD operations for sponsored content
export class SponsorManager {
  private sponsors: Sponsor[] = [];
  
  constructor() {
    this.loadSponsors();
  }
  
  // Create new sponsor
  createSponsor(sponsorData: Omit<Sponsor, 'id'>): Sponsor {
    const sponsor: Sponsor = {
      id: this.generateId(),
      ...sponsorData
    };
    
    this.sponsors.push(sponsor);
    this.saveSponsors();
    return sponsor;
  }
  
  // Read sponsors with filtering
  readSponsors(filters?: { 
    placement?: string; 
    active?: boolean; 
    campaign?: string 
  }): Sponsor[] {
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
  updateSponsor(id: string, updates: Partial<Sponsor>): Sponsor | null {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.sponsors[index] = { ...this.sponsors[index], ...updates };
    this.saveSponsors();
    return this.sponsors[index];
  }
  
  // Delete sponsor
  deleteSponsor(id: string): boolean {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.sponsors.splice(index, 1);
    this.saveSponsors();
    return true;
  }
  
  // Get sponsors for specific placement
  getSponsorsForPlacement(placement: string): Sponsor[] {
    return this.readSponsors({ placement, active: true });
  }
  
  private generateId(): string {
    return 'sponsor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  private loadSponsors(): void {
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
  
  private saveSponsors(): void {
    try {
      localStorage.setItem('beatschain_sponsors', JSON.stringify(this.sponsors));
    } catch (e) {
      console.warn('Failed to save sponsors:', e);
    }
  }
}

// Default sponsors for BeatsChain
export const defaultSponsors: Omit<Sponsor, 'id'>[] = [
  {
    brand: 'Radiomonitor South Africa',
    campaign: 'Radio Tracking Services',
    placement: 'after_isrc',
    active: true,
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
    active: true,
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
    active: true,
    priority: 5,
    content: {
      title: 'Upgrade to BeatsChain Pro',
      description: 'Unlimited uploads and premium features',
      actionUrl: '#upgrade'
    }
  }
];