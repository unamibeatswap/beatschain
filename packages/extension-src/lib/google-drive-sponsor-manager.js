/**
 * Google Drive Sponsor Manager - Chrome Web Store Compliant
 * Fetches sponsor content from public Google Drive JSON manifest
 */

class GoogleDriveSponsorManager {
    constructor() {
        this.manifestUrl = null;
        this.sponsorData = null;
        this.cache = {
            data: null,
            timestamp: 0,
            duration: 24 * 60 * 60 * 1000 // 24 hours
        };
        this.analytics = {
            impressions: [],
            clicks: [],
            interactions: []
        };
        this.csrfProtection = window.CSRFProtection ? new CSRFProtection() : null;
    }

    // Set Google Drive manifest URL
    setManifestUrl(url) {
        this.manifestUrl = url;
        console.log('✅ Google Drive manifest URL configured');
    }

    // Fetch sponsor manifest from Google Drive
    async fetchSponsorManifest() {
        console.log('🔍 fetchSponsorManifest called, manifestUrl:', this.manifestUrl);
        
        if (!this.manifestUrl) {
            console.warn('⚠️ No Google Drive manifest URL configured');
            // Use default manifest URL if not set
            this.manifestUrl = 'https://drive.usercontent.google.com/download?id=1HVUsr945s8-yksHHhA1MXoMJNzCT-ODC&export=download';
            console.log('🔧 Using default manifest URL:', this.manifestUrl);
        }

        try {
            // Check cache first
            if (this.isCacheValid()) {
                console.log('📦 Using cached sponsor data');
                return this.cache.data;
            }

            console.log('🌐 Fetching sponsor manifest from Google Drive...');
            const requestOptions = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'omit'
            };
            
            const response = this.csrfProtection ? 
                await this.csrfProtection.secureRequest(this.manifestUrl, requestOptions) :
                await fetch(this.manifestUrl, requestOptions);

            console.log('📡 Response status:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const manifest = await response.json();
            console.log('📋 Manifest loaded:', manifest.version, `${manifest.sponsors?.length || 0} sponsors`);
            
            // Validate manifest structure
            if (!this.validateManifest(manifest)) {
                throw new Error('Invalid manifest structure');
            }

            // Cache the data
            this.cache.data = manifest;
            this.cache.timestamp = Date.now();
            
            // Store in local storage for offline use
            await this.storeOfflineCache(manifest);
            
            this.sponsorData = manifest;
            console.log('✅ Sponsor manifest loaded successfully');
            return manifest;

        } catch (error) {
            console.error('❌ Failed to fetch sponsor manifest:', error);
            
            // Try to use offline cache
            const offlineData = await this.getOfflineCache();
            if (offlineData) {
                console.log('📱 Using offline cached sponsor data');
                this.sponsorData = offlineData;
                return offlineData;
            }
            
            // Load local fallback manifest
            // Try to use cached data even if expired
            const cached = await this.getCachedManifest();
            if (cached) {
                console.log('📋 Using expired cached sponsor manifest as fallback');
                return cached.data;
            }
            
            // Load local manifest as last resort
            return await this.loadLocalManifest();
            
            console.error('💥 No sponsor data available (online or offline)');
            return null;
        }
    }

    // Get cached manifest
    async getCachedManifest() {
        try {
            const result = await chrome.storage.local.get(['google_drive_sponsor_cache']);
            return result.google_drive_sponsor_cache || null;
        } catch (error) {
            console.warn('Failed to get cached manifest:', error);
            return null;
        }
    }

    // Cache manifest data
    async cacheManifest(data) {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            await chrome.storage.local.set({
                'google_drive_sponsor_cache': cacheData
            });
        } catch (error) {
            console.warn('Failed to cache manifest:', error);
        }
    }

    // Load local manifest file
    async loadLocalManifest() {
        try {
            console.log('📦 Loading local sponsor manifest...');
            const response = await fetch(chrome.runtime.getURL('assets/fallback-sponsor-manifest.json'));
            const manifest = await response.json();
            console.log('✅ Local sponsor manifest loaded');
            
            this.sponsorData = manifest;
            this.cache.data = manifest;
            this.cache.timestamp = Date.now();
            
            return manifest;
        } catch (error) {
            console.error('❌ Failed to load local manifest:', error);
            return null;
        }
    }

    // Validate manifest structure
    validateManifest(manifest) {
        const required = ['version', 'sponsors', 'settings'];
        const hasRequired = required.every(field => manifest.hasOwnProperty(field));
        
        if (!hasRequired) return false;
        
        // Validate sponsors array
        if (!Array.isArray(manifest.sponsors)) return false;
        
        // Validate sponsor objects
        return manifest.sponsors.every(sponsor => 
            sponsor.id && sponsor.name && sponsor.message && 
            typeof sponsor.active === 'boolean'
        );
    }

    // Check if cache is still valid
    isCacheValid() {
        if (!this.cache.data || !this.cache.timestamp) return false;
        
        const age = Date.now() - this.cache.timestamp;
        return age < this.cache.duration;
    }

    // Store data for offline use
    async storeOfflineCache(data) {
        try {
            const cacheData = {
                data,
                timestamp: Date.now(),
                version: data.version
            };
            
            await chrome.storage.local.set({
                'google_drive_sponsor_cache': cacheData
            });
            
        } catch (error) {
            console.warn('Failed to store offline cache:', error);
        }
    }

    // Get offline cached data
    async getOfflineCache() {
        try {
            const result = await chrome.storage.local.get(['google_drive_sponsor_cache']);
            const cached = result.google_drive_sponsor_cache;
            
            if (cached && cached.data) {
                // Check if cache is not too old (7 days max for offline)
                const maxOfflineAge = 7 * 24 * 60 * 60 * 1000;
                const age = Date.now() - cached.timestamp;
                
                if (age < maxOfflineAge) {
                    return cached.data;
                }
            }
            
            return null;
        } catch (error) {
            console.warn('Failed to get offline cache:', error);
            return null;
        }
    }

    // Get active sponsors for specific placement
    getActiveSponsors(placement = 'after_isrc') {
        if (!this.sponsorData || !this.sponsorData.sponsors) {
            return [];
        }

        return this.sponsorData.sponsors.filter(sponsor => 
            sponsor.active && 
            (!sponsor.placement || sponsor.placement === placement || 
             (placement === 'post_package' && sponsor.placement === 'after_package'))
        );
    }

    // Create sponsor card HTML
    createSponsorCard(sponsor, placement) {
        const cardId = `sponsor-${sponsor.id}-${Date.now()}`;
        
        const card = document.createElement('div');
        card.className = 'google-drive-sponsor-card';
        card.id = cardId;
        card.innerHTML = `
            <div class="sponsor-card-container">
                <div class="sponsor-header">
                    <span class="sponsor-label">Sponsored</span>
                    <button class="sponsor-close" title="Hide">&times;</button>
                </div>
                <div class="sponsor-content ${sponsor.tier || 'basic'}">
                    ${this.renderSponsorVisual(sponsor)}
                    <div class="sponsor-info">
                        <h4 class="sponsor-name">${this.sanitize(sponsor.name)}</h4>
                        <p class="sponsor-message">${this.sanitize(sponsor.message)}</p>
                        ${sponsor.website ? `<a href="${sponsor.website}" target="_blank" class="sponsor-link">Learn More</a>` : ''}
                        ${sponsor.tier === 'enterprise' ? `<div class="tier-badge">Premium Partner</div>` : ''}
                    </div>
                </div>
                <div class="sponsor-footer">
                    <small>Professional partner content</small>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachCardEvents(card, sponsor, placement);
        
        // Record impression
        this.recordAnalytics('impression', sponsor.id, placement);
        
        return card;
    }

    // Attach event listeners to sponsor card
    attachCardEvents(card, sponsor, placement) {
        // Close button
        const closeBtn = card.querySelector('.sponsor-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                card.style.display = 'none';
                this.recordAnalytics('close', sponsor.id, placement);
            });
        }

        // Click tracking
        const link = card.querySelector('.sponsor-link');
        if (link) {
            link.addEventListener('click', () => {
                this.recordAnalytics('click', sponsor.id, placement);
            });
        }

        // Card interaction tracking
        card.addEventListener('mouseenter', () => {
            this.recordAnalytics('hover', sponsor.id, placement);
        });
    }

    // Display sponsor content at placement
    async displaySponsorContent(placement, container) {
        console.log(`🎯 GoogleDriveSponsorManager.displaySponsorContent called:`, { placement, container: !!container });
        
        if (!container) {
            console.warn('⚠️ No container provided for sponsor display');
            return;
        }

        try {
            // Ensure we have fresh sponsor data
            console.log('🔄 Fetching sponsor manifest...');
            await this.fetchSponsorManifest();
            
            console.log('📊 Sponsor data available:', !!this.sponsorData);
            if (this.sponsorData) {
                console.log('📊 Sponsors in manifest:', this.sponsorData.sponsors?.length || 0);
            }
            
            const sponsors = this.getActiveSponsors(placement);
            console.log(`🎯 Active sponsors for '${placement}':`, sponsors.length);
            
            if (sponsors.length === 0) {
                console.warn(`⚠️ No active sponsors found for placement: ${placement}`);
                return;
            }

            // Select sponsor (rotate or random)
            const sponsor = this.selectSponsor(sponsors, placement);
            if (!sponsor) {
                console.warn('⚠️ No sponsor selected');
                return;
            }
            
            console.log('🎯 Selected sponsor:', sponsor.name);

            // Create and display card
            const card = this.createSponsorCard(sponsor, placement);
            
            // Add with animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(-10px)';
            container.appendChild(card);
            
            console.log('✅ Sponsor card added to container');
            
            // Animate in
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);

        } catch (error) {
            console.error('❌ Failed to display sponsor content:', error);
        }
    }

    // Select sponsor based on strategy
    selectSponsor(sponsors, placement) {
        if (sponsors.length === 0) return null;
        if (sponsors.length === 1) return sponsors[0];

        // Priority-based selection
        const prioritySponsors = sponsors.filter(s => s.priority > 0);
        if (prioritySponsors.length > 0) {
            prioritySponsors.sort((a, b) => (b.priority || 0) - (a.priority || 0));
            return prioritySponsors[0];
        }

        // Random selection
        return sponsors[Math.floor(Math.random() * sponsors.length)];
    }

    // Record analytics
    recordAnalytics(action, sponsorId, placement) {
        const event = {
            timestamp: Date.now(),
            action,
            sponsorId,
            placement,
            sessionId: this.getSessionId()
        };

        this.analytics[action === 'impression' ? 'impressions' : 
                     action === 'click' ? 'clicks' : 'interactions'].push(event);

        // Store in local storage
        this.storeAnalytics();
    }

    // Store analytics data
    async storeAnalytics() {
        try {
            await chrome.storage.local.set({
                'google_drive_sponsor_analytics': this.analytics
            });
        } catch (error) {
            console.warn('Failed to store analytics:', error);
        }
    }

    // Get session ID
    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    }

    // Sanitize text content
    renderSponsorVisual(sponsor) {
        const tier = sponsor.tier || 'basic';
        
        // Always use text fallback to avoid CORS issues with Google Drive images
        switch (tier) {
            case 'enterprise':
                return `<div class="sponsor-logo-fallback enterprise">⭐ ${sponsor.name}</div>`;
            case 'premium':
                return `<div class="sponsor-logo-fallback premium">🏆 ${sponsor.name}</div>`;
            case 'basic':
            default:
                return `<div class="sponsor-logo-fallback basic">📢 ${sponsor.name}</div>`;
        }
    }

    sanitize(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .trim()
            .substring(0, 200);
    }

    // Get analytics summary
    getAnalyticsSummary() {
        return {
            totalImpressions: this.analytics.impressions.length,
            totalClicks: this.analytics.clicks.length,
            totalInteractions: this.analytics.interactions.length,
            clickThroughRate: this.analytics.impressions.length > 0 ? 
                (this.analytics.clicks.length / this.analytics.impressions.length * 100).toFixed(2) : 0
        };
    }

    // Integration with existing systems
    static enhanceApp(app) {
        const sponsorManager = new GoogleDriveSponsorManager();
        app.googleDriveSponsorManager = sponsorManager;

        // Set default manifest URL (can be configured)
        const defaultManifestUrl = 'https://drive.usercontent.google.com/download?id=1HVUsr945s8-yksHHhA1MXoMJNzCT-ODC&export=download';
        sponsorManager.setManifestUrl(defaultManifestUrl);

        console.log('✅ Google Drive Sponsor Manager integrated');
        return sponsorManager;
    }
}

window.GoogleDriveSponsorManager = GoogleDriveSponsorManager;