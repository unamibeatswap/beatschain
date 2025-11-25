/**
 * Enhanced Sponsor Integration - Base Class for Advanced Sponsor Management
 * Provides foundation for Method 3 Campaign-Based Management
 */

class EnhancedSponsorIntegration {
    constructor() {
        this.sponsorConfig = null;
        this.campaignManager = null;
        this.isInitialized = false;
        this.activeSponsors = new Map();
        this.placementMetrics = new Map();
    }

    async initialize(app) {
        try {
            await this.loadSponsorConfig();
            await this.initializeCampaignManager();
            this.isInitialized = true;
            console.log('✅ Enhanced Sponsor Integration initialized');
        } catch (error) {
            console.error('❌ Enhanced Sponsor Integration initialization failed:', error);
        }
    }

    async loadSponsorConfig() {
        try {
            const result = await chrome.storage.local.get(['sponsor_config']);
            this.sponsorConfig = result.sponsor_config || {
                enabled: false,
                templates: {},
                currentSponsor: 'default'
            };
        } catch (error) {
            console.error('Failed to load sponsor config:', error);
            this.sponsorConfig = { enabled: false, templates: {} };
        }
    }

    async initializeCampaignManager() {
        try {
            if (window.CampaignManager) {
                this.campaignManager = new CampaignManager();
                await this.campaignManager.initialize();
            }
        } catch (error) {
            console.warn('Campaign Manager not available:', error);
        }
    }

    async getActiveSponsors(placement = null) {
        try {
            if (!this.sponsorConfig.enabled) return [];

            // Get sponsors from campaign manager if available
            if (this.campaignManager) {
                const activeCampaigns = this.campaignManager.getActiveCampaigns();
                return activeCampaigns
                    .filter(campaign => !placement || campaign.placement === placement)
                    .map(campaign => this.campaignToSponsor(campaign));
            }

            // Fallback to template-based sponsors
            return this.getTemplateSponsorsByPlacement(placement);
        } catch (error) {
            console.error('Failed to get active sponsors:', error);
            return [];
        }
    }

    campaignToSponsor(campaign) {
        const template = this.sponsorConfig.templates[campaign.sponsorId];
        return {
            id: campaign.sponsorId,
            name: template?.name || campaign.sponsorId,
            message: template?.message || 'Professional partner content',
            website: template?.website,
            assets: template?.assets || {},
            placement: campaign.placement,
            priority: campaign.priority || 0,
            campaignId: campaign.id
        };
    }

    getTemplateSponsorsByPlacement(placement) {
        if (!placement) return [];
        
        return Object.entries(this.sponsorConfig.templates)
            .filter(([id, template]) => template.placement === placement || !template.placement)
            .map(([id, template]) => ({
                id,
                name: template.name,
                message: template.message,
                website: template.website,
                assets: template.assets || {},
                placement: placement,
                priority: template.priority || 0
            }));
    }

    selectSponsorByPriority(sponsors) {
        if (!sponsors || sponsors.length === 0) return null;
        if (sponsors.length === 1) return sponsors[0];

        // Sort by priority (higher first)
        sponsors.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        return sponsors[0];
    }

    async trackSponsorImpression(sponsorId, placement) {
        try {
            // Record in campaign manager if available
            if (this.campaignManager) {
                const sponsor = this.activeSponsors.get(sponsorId);
                if (sponsor && sponsor.campaignId) {
                    await this.campaignManager.recordImpression(sponsor.campaignId);
                }
            }

            // Record in placement metrics
            const key = `${placement}_${sponsorId}`;
            const metrics = this.placementMetrics.get(key) || { impressions: 0, clicks: 0 };
            metrics.impressions++;
            this.placementMetrics.set(key, metrics);

            // Store in analytics
            await this.storeAnalytics('impression', sponsorId, placement);

        } catch (error) {
            console.error('Failed to track sponsor impression:', error);
        }
    }

    async trackSponsorInteraction(sponsorId, placement, action) {
        try {
            // Record in campaign manager if available
            if (this.campaignManager && action === 'click') {
                const sponsor = this.activeSponsors.get(sponsorId);
                if (sponsor && sponsor.campaignId) {
                    await this.campaignManager.recordClick(sponsor.campaignId);
                }
            }

            // Record in placement metrics
            const key = `${placement}_${sponsorId}`;
            const metrics = this.placementMetrics.get(key) || { impressions: 0, clicks: 0 };
            if (action === 'click') metrics.clicks++;
            this.placementMetrics.set(key, metrics);

            // Store in analytics
            await this.storeAnalytics(action, sponsorId, placement);

        } catch (error) {
            console.error('Failed to track sponsor interaction:', error);
        }
    }

    async storeAnalytics(action, sponsorId, placement) {
        try {
            const analytics = {
                timestamp: Date.now(),
                action,
                sponsorId,
                placement,
                sessionId: this.getSessionId()
            };

            const result = await chrome.storage.local.get(['sponsor_analytics']);
            const existing = result.sponsor_analytics || [];
            existing.push(analytics);

            // Keep only last 1000 entries
            if (existing.length > 1000) {
                existing.splice(0, existing.length - 1000);
            }

            await chrome.storage.local.set({ sponsor_analytics: existing });
        } catch (error) {
            console.error('Failed to store analytics:', error);
        }
    }

    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return this.sessionId;
    }

    createBaseSponsorElement(sponsor, placement, context = {}) {
        const sponsorEl = document.createElement('div');
        sponsorEl.className = 'enhanced-sponsor-content';
        sponsorEl.dataset.sponsorId = sponsor.id;
        sponsorEl.dataset.placement = placement;

        return sponsorEl;
    }

    async displaySponsorContent(placement, container, context = {}) {
        if (!container) return;

        try {
            const sponsors = await this.getActiveSponsors(placement);
            if (!sponsors.length) return;

            const sponsor = this.selectSponsorByPriority(sponsors);
            if (!sponsor) return;

            // Store active sponsor
            this.activeSponsors.set(sponsor.id, sponsor);

            // Create sponsor element (to be implemented by subclasses)
            const sponsorElement = this.createSponsorElement(sponsor, placement, context);
            if (!sponsorElement) return;

            // Clear existing sponsors in this container
            const existing = container.querySelector('.enhanced-sponsor-content');
            if (existing) existing.remove();

            container.appendChild(sponsorElement);

            // Track impression
            await this.trackSponsorImpression(sponsor.id, placement);

            console.log(`✅ Enhanced sponsor displayed: ${sponsor.name} at ${placement}`);

        } catch (error) {
            console.error('❌ Failed to display enhanced sponsor content:', error);
        }
    }

    // To be implemented by subclasses
    createSponsorElement(sponsor, placement, context) {
        throw new Error('createSponsorElement must be implemented by subclass');
    }

    // Utility methods
    sanitizeText(text) {
        if (!text) return '';
        return String(text)
            .replace(/[<>\"'&]/g, function(match) {
                const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
                return map[match] || match;
            })
            .trim()
            .substring(0, 200);
    }

    formatPlacementName(placement) {
        const names = {
            // Radio System
            'after_isrc': 'After ISRC Generation',
            'validation': 'After Validation',
            'before_package': 'Before Package Generation',
            'post_package': 'After Package Complete',
            'during_download': 'During Download',
            
            // Mint/NFT System
            'before_mint_nft': 'Before Mint NFT',
            'after_minting': 'After NFT Minting',
            'ipfs_upload': 'During IPFS Upload',
            'metadata_creation': 'After Metadata Creation',
            
            // Cross-Platform
            'licensing_proceed': 'Proceed to Licensing',
            'analytics_view': 'Analytics Dashboard',
            'profile_view': 'Profile Section'
        };
        return names[placement] || placement;
    }

    async getPlacementMetrics() {
        const metrics = {};
        
        for (const [key, data] of this.placementMetrics.entries()) {
            const [placement, sponsorId] = key.split('_');
            if (!metrics[placement]) {
                metrics[placement] = { displays: 0, interactions: 0 };
            }
            metrics[placement].displays += data.impressions;
            metrics[placement].interactions += data.clicks;
        }

        return metrics;
    }

    // Integration hooks for existing systems
    enhanceRadioFlow(radioApp) {
        // To be implemented by subclasses
    }

    enhanceMintingFlow(mintApp) {
        // To be implemented by subclasses
    }

    // Static factory method
    static create(type = 'base') {
        switch (type) {
            case 'minting':
                return window.MintingSponsorIntegration ? new MintingSponsorIntegration() : new EnhancedSponsorIntegration();
            case 'radio':
                return window.RadioSponsorIntegration ? new RadioSponsorIntegration() : new EnhancedSponsorIntegration();
            default:
                return new EnhancedSponsorIntegration();
        }
    }

    // Static enhanceApp method for compatibility
    static enhanceApp(app) {
        try {
            const integration = new EnhancedSponsorIntegration();
            integration.initialize(app);
            return integration;
        } catch (error) {
            console.error('Enhanced sponsor integration failed:', error);
            return null;
        }
    }
}

window.EnhancedSponsorIntegration = EnhancedSponsorIntegration;