/**
 * Native Sponsor Manager - IPFS Primary, Google Drive Fallback
 * Provides truly native sponsored content integration with proper placement
 */

class NativeSponsorManager {
    constructor() {
        this.ipfsAssetManager = null;
        this.googleDriveManager = null;
        this.manifestCache = new Map();
        this.displayedSponsors = new Set(); // Prevent duplicates
        this.placementContainers = new Map();
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize IPFS Asset Manager (PRIMARY)
            if (window.IPFSAssetManager) {
                this.ipfsAssetManager = new IPFSAssetManager();
                await this.ipfsAssetManager.initialize();
                console.log('✅ IPFS Asset Manager initialized (PRIMARY)');
            }

            // Initialize Google Drive Manager (FALLBACK)
            if (window.GoogleDriveSponsorManager) {
                this.googleDriveManager = new GoogleDriveSponsorManager();
                console.log('✅ Google Drive Manager initialized (FALLBACK)');
            }

            // Setup native placement containers
            this.setupNativePlacements();
            
            this.isInitialized = true;
            console.log('✅ Native Sponsor Manager initialized with IPFS primary');
            
        } catch (error) {
            console.error('❌ Native Sponsor Manager initialization failed:', error);
        }
    }

    setupNativePlacements() {
        // Define native placement points with proper containers
        const placements = [
            {
                id: 'after_isrc',
                selector: '.isrc-input-group',
                position: 'after',
                containerClass: 'native-sponsor-isrc'
            },
            {
                id: 'validation',
                selector: '#radio-validation-results',
                position: 'after',
                containerClass: 'native-sponsor-validation'
            },
            {
                id: 'before_package',
                selector: '#generate-radio-package',
                position: 'before',
                containerClass: 'native-sponsor-package'
            },
            {
                id: 'post_package',
                selector: 'body',
                position: 'append',
                containerClass: 'native-sponsor-floating'
            }
        ];

        placements.forEach(placement => {
            this.placementContainers.set(placement.id, placement);
        });
    }

    async displaySponsorContent(placement, forceContainer = null) {
        // Prevent duplicate displays - check both memory and DOM
        if (this.displayedSponsors.has(placement)) {
            console.log(`⚠️ Sponsor already displayed for ${placement}, skipping duplicate`);
            return;
        }
        
        // Also check if sponsor already exists in DOM
        const existingSponsor = document.querySelector(`.${placement}-sponsor, .native-sponsor-${placement}`);
        if (existingSponsor) {
            console.log(`⚠️ Sponsor already exists in DOM for ${placement}, skipping duplicate`);
            this.displayedSponsors.add(placement); // Sync memory state
            return;
        }

        try {
            // Get sponsor data (IPFS first, Google Drive fallback)
            const sponsorData = await this.getSponsorData(placement);
            if (!sponsorData) {
                console.log(`ℹ️ No sponsor data available for ${placement}`);
                return;
            }

            // Get or create native container
            const container = forceContainer || await this.getNativeContainer(placement);
            if (!container) {
                console.warn(`⚠️ No container available for ${placement}`);
                return;
            }

            // Create native sponsor card
            const sponsorCard = await this.createNativeSponsorCard(sponsorData, placement);
            
            // Insert with native feel
            this.insertNatively(container, sponsorCard, placement);
            
            // Mark as displayed
            this.displayedSponsors.add(placement);
            
            // Auto-cleanup after interaction or timeout
            this.setupSponsorCleanup(sponsorCard, placement);
            
            console.log(`✅ Native sponsor displayed for ${placement}`);
            
        } catch (error) {
            console.error(`❌ Failed to display sponsor for ${placement}:`, error);
        }
    }

    async getSponsorData(placement) {
        try {
            // Try IPFS first (PRIMARY)
            if (this.ipfsAssetManager) {
                const ipfsData = await this.ipfsAssetManager.getSponsorData(placement);
                if (ipfsData && ipfsData.sponsors && ipfsData.sponsors.length > 0) {
                    console.log(`📦 Using IPFS sponsor data for ${placement}`);
                    return this.selectSponsor(ipfsData.sponsors, placement);
                }
            }

            // Fallback to Google Drive
            if (this.googleDriveManager) {
                const manifest = await this.googleDriveManager.fetchSponsorManifest();
                if (manifest && manifest.sponsors) {
                    const activeSponsors = manifest.sponsors.filter(s => 
                        s.active && (!s.placement || s.placement === placement)
                    );
                    
                    if (activeSponsors.length > 0) {
                        console.log(`📁 Using Google Drive fallback for ${placement}`);
                        return this.selectSponsor(activeSponsors, placement);
                    }
                }
            }

            return null;
        } catch (error) {
            console.error(`❌ Error getting sponsor data for ${placement}:`, error);
            return null;
        }
    }

    selectSponsor(sponsors, placement) {
        if (!sponsors || sponsors.length === 0) return null;
        
        // Priority-based selection
        const prioritySponsors = sponsors.filter(s => s.priority > 0);
        if (prioritySponsors.length > 0) {
            prioritySponsors.sort((a, b) => (b.priority || 0) - (a.priority || 0));
            return prioritySponsors[0];
        }
        
        // Random selection from active sponsors
        return sponsors[Math.floor(Math.random() * sponsors.length)];
    }

    async getNativeContainer(placement) {
        const placementConfig = this.placementContainers.get(placement);
        if (!placementConfig) return null;

        const targetElement = document.querySelector(placementConfig.selector);
        if (!targetElement) return null;

        // Check if native container already exists
        let container = targetElement.parentElement?.querySelector(`.${placementConfig.containerClass}`);
        
        if (!container) {
            container = document.createElement('div');
            container.className = `native-sponsor-container ${placementConfig.containerClass}`;
            container.style.cssText = this.getNativeContainerStyles(placement);
            
            // Insert based on position
            switch (placementConfig.position) {
                case 'before':
                    targetElement.parentElement.insertBefore(container, targetElement);
                    break;
                case 'after':
                    targetElement.parentElement.insertBefore(container, targetElement.nextSibling);
                    break;
                case 'append':
                    targetElement.appendChild(container);
                    break;
                default:
                    targetElement.parentElement.appendChild(container);
            }
        }

        return container;
    }

    getNativeContainerStyles(placement) {
        const baseStyles = `
            margin: 12px 0;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;

        const placementStyles = {
            'after_isrc': `
                ${baseStyles}
                border-top: 1px solid #e9ecef;
                padding-top: 12px;
            `,
            'validation': `
                ${baseStyles}
                margin-top: 16px;
            `,
            'before_package': `
                ${baseStyles}
                margin-bottom: 16px;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 6px;
                border: 1px solid #e9ecef;
            `,
            'post_package': `
                position: fixed;
                bottom: 20px;
                right: 20px;
                max-width: 320px;
                z-index: 10001;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            `
        };

        return placementStyles[placement] || baseStyles;
    }

    async createNativeSponsorCard(sponsor, placement) {
        const card = document.createElement('div');
        card.className = `native-sponsor-card ${placement}-sponsor`;
        card.dataset.sponsorId = sponsor.id;
        card.dataset.placement = placement;

        // Get sponsor assets (IPFS first, fallback to text)
        const assets = await this.getSponsorAssets(sponsor);
        
        card.innerHTML = `
            <div class="sponsor-card-header">
                <span class="sponsor-badge">Sponsored</span>
                <button class="sponsor-dismiss" aria-label="Dismiss">&times;</button>
            </div>
            <div class="sponsor-card-content">
                <div class="sponsor-visual">
                    ${assets.logo ? 
                        `<img src="${assets.logo}" alt="${sponsor.name}" class="sponsor-logo">` :
                        `<div class="sponsor-logo-fallback">${this.getSponsorIcon(sponsor.tier)}</div>`
                    }
                </div>
                <div class="sponsor-info">
                    <h4 class="sponsor-name">${this.sanitize(sponsor.name)}</h4>
                    <p class="sponsor-message">${this.sanitize(sponsor.message)}</p>
                    ${sponsor.website ? 
                        `<a href="${sponsor.website}" target="_blank" class="sponsor-cta">Learn More</a>` : 
                        ''
                    }
                </div>
            </div>
        `;

        // Apply native styling
        this.applyNativeStyling(card, placement);
        
        // Setup event handlers
        this.setupCardEvents(card, sponsor, placement);
        
        return card;
    }

    async getSponsorAssets(sponsor) {
        const assets = {};
        
        try {
            // Try IPFS assets first
            if (this.ipfsAssetManager && sponsor.assets) {
                for (const [type, ipfsHash] of Object.entries(sponsor.assets)) {
                    try {
                        assets[type] = await this.ipfsAssetManager.loadAsset(ipfsHash);
                    } catch (error) {
                        console.warn(`Failed to load IPFS asset ${type}:`, error);
                    }
                }
            }
            
            // Fallback to Google Drive URLs (if available)
            if (!assets.logo && sponsor.logo_url) {
                assets.logo = sponsor.logo_url;
            }
            
        } catch (error) {
            console.warn('Asset loading failed, using fallbacks:', error);
        }
        
        return assets;
    }

    getSponsorIcon(tier) {
        const icons = {
            'enterprise': '⭐',
            'premium': '🏆',
            'basic': '📢'
        };
        return icons[tier] || '📢';
    }

    applyNativeStyling(card, placement) {
        const baseStyles = `
            background: #ffffff;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            line-height: 1.4;
            overflow: hidden;
        `;

        const placementStyles = {
            'after_isrc': `
                ${baseStyles}
                border-left: 4px solid #007bff;
            `,
            'validation': `
                ${baseStyles}
                border-left: 4px solid #28a745;
            `,
            'before_package': `
                ${baseStyles}
                border-left: 4px solid #ffc107;
                background: #fffbf0;
            `,
            'post_package': `
                ${baseStyles}
                border-left: 4px solid #dc3545;
                box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            `
        };

        card.style.cssText = placementStyles[placement] || baseStyles;

        // Add internal styling
        const style = document.createElement('style');
        style.textContent = `
            .sponsor-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }
            
            .sponsor-badge {
                font-size: 10px;
                background: #dc3545;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .sponsor-dismiss {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                color: #6c757d;
                padding: 0;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .sponsor-dismiss:hover {
                background-color: #e9ecef;
            }
            
            .sponsor-card-content {
                padding: 12px;
                display: flex;
                gap: 12px;
                align-items: flex-start;
            }
            
            .sponsor-visual {
                flex-shrink: 0;
            }
            
            .sponsor-logo {
                width: 60px;
                height: 30px;
                object-fit: contain;
                border-radius: 4px;
            }
            
            .sponsor-logo-fallback {
                width: 60px;
                height: 30px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #6c757d;
                text-align: center;
            }
            
            .sponsor-info {
                flex: 1;
                min-width: 0;
            }
            
            .sponsor-name {
                margin: 0 0 4px 0;
                font-size: 14px;
                font-weight: 600;
                color: #333;
                line-height: 1.2;
            }
            
            .sponsor-message {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 12px;
                line-height: 1.3;
            }
            
            .sponsor-cta {
                display: inline-block;
                color: #007bff;
                text-decoration: none;
                font-size: 12px;
                font-weight: 500;
                padding: 4px 8px;
                border: 1px solid #007bff;
                border-radius: 4px;
                transition: all 0.2s;
            }
            
            .sponsor-cta:hover {
                background-color: #007bff;
                color: white;
                text-decoration: none;
            }
        `;
        
        card.appendChild(style);
    }

    setupCardEvents(card, sponsor, placement) {
        // Dismiss button
        const dismissBtn = card.querySelector('.sponsor-dismiss');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', async () => {
                await this.trackSponsorDismissal(sponsor, placement);
                this.dismissSponsor(card, sponsor, placement);
            });
        }

        // CTA tracking
        const ctaLink = card.querySelector('.sponsor-cta');
        if (ctaLink) {
            ctaLink.addEventListener('click', async () => {
                await this.trackSponsorClick(sponsor, placement);
            });
        }

        // Impression tracking (async)
        setTimeout(async () => {
            await this.trackSponsorImpression(sponsor, placement);
        }, 1000);
    }

    insertNatively(container, card, placement) {
        // Clear any existing sponsors in this container
        const existing = container.querySelectorAll('.native-sponsor-card');
        existing.forEach(el => el.remove());
        
        // Insert the new card
        container.appendChild(card);
        
        // Animate in
        requestAnimationFrame(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });
    }

    setupSponsorCleanup(card, placement) {
        // Auto-dismiss for floating sponsors
        if (placement === 'post_package') {
            setTimeout(() => {
                if (card.parentNode && !card.dataset.interacted) {
                    this.dismissSponsor(card, null, placement);
                }
            }, 8000);
        }
        
        // Mark interaction on hover
        card.addEventListener('mouseenter', () => {
            card.dataset.interacted = 'true';
        });
    }

    dismissSponsor(card, sponsor, placement) {
        // Animate out
        card.style.transform = 'translateY(-10px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            if (card.parentNode) {
                card.parentNode.remove(); // Remove entire container
            }
        }, 300);
        
        // Remove from displayed set
        this.displayedSponsors.delete(placement);
        
        // Track dismissal
        if (sponsor) {
            this.trackSponsorDismissal(sponsor, placement);
        }
    }

    // Analytics methods with measurement integration
    async trackSponsorImpression(sponsor, placement) {
        console.log(`📊 Sponsor impression: ${sponsor.name} at ${placement}`);
        
        // Record in PackageMeasurementSystem
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorDisplay?.(placement, {
                sponsorId: sponsor.id,
                sponsorName: sponsor.name,
                timestamp: Date.now()
            });
        }
        
        // Record in AnalyticsManager
        if (window.analyticsManager) {
            await window.analyticsManager.recordSponsorDisplay?.(placement);
        }
        
        // Store verification data on IPFS
        await this.storeVerificationOnIPFS('impression', sponsor, placement);
    }

    async trackSponsorClick(sponsor, placement) {
        console.log(`🖱️ Sponsor click: ${sponsor.name} at ${placement}`);
        
        // Record in PackageMeasurementSystem
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorInteraction?.('click', placement, {
                sponsorId: sponsor.id,
                sponsorName: sponsor.name,
                timestamp: Date.now()
            });
        }
        
        // Record in AnalyticsManager
        if (window.analyticsManager) {
            await window.analyticsManager.recordSponsorInteraction?.('click', placement);
        }
        
        // Store verification data on IPFS
        await this.storeVerificationOnIPFS('click', sponsor, placement);
    }

    async trackSponsorDismissal(sponsor, placement) {
        console.log(`❌ Sponsor dismissed: ${sponsor.name} at ${placement}`);
        
        // Record in PackageMeasurementSystem
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorInteraction?.('dismiss', placement, {
                sponsorId: sponsor.id,
                sponsorName: sponsor.name,
                timestamp: Date.now()
            });
        }
        
        // Record in AnalyticsManager
        if (window.analyticsManager) {
            await window.analyticsManager.recordSponsorInteraction?.('dismiss', placement);
        }
        
        // Store verification data on IPFS
        await this.storeVerificationOnIPFS('dismiss', sponsor, placement);
    }

    // IPFS Verification Storage
    async storeVerificationOnIPFS(action, sponsor, placement) {
        try {
            if (!this.ipfsAssetManager) return;
            
            const verificationData = {
                action,
                sponsorId: sponsor.id,
                sponsorName: sponsor.name,
                placement,
                timestamp: Date.now(),
                userAgent: navigator.userAgent.substring(0, 100),
                extensionVersion: chrome.runtime?.getManifest()?.version || '2.1.0',
                verificationHash: await this.generateVerificationHash(action, sponsor, placement)
            };
            
            // Store on IPFS for verification
            const result = await this.ipfsAssetManager.uploadJSON(
                verificationData, 
                `sponsor-${action}-${Date.now()}.json`
            );
            
            if (result.success) {
                console.log(`✅ Sponsor ${action} verification stored on IPFS:`, result.ipfsHash);
            }
            
        } catch (error) {
            console.warn(`⚠️ Failed to store ${action} verification on IPFS:`, error);
        }
    }

    async generateVerificationHash(action, sponsor, placement) {
        const data = `${action}-${sponsor.id}-${placement}-${Date.now()}`;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

    // Public API methods
    async displayAfterISRC() {
        await this.displaySponsorContent('after_isrc');
    }

    async displayAfterValidation() {
        await this.displaySponsorContent('validation');
    }

    async displayBeforePackage() {
        await this.displaySponsorContent('before_package');
    }

    async displayPostPackage() {
        await this.displaySponsorContent('post_package');
    }

    // Reset displayed sponsors (for testing)
    resetDisplayedSponsors() {
        this.displayedSponsors.clear();
        console.log('🔄 Displayed sponsors reset');
    }

    // Static integration method
    static enhanceApp(app) {
        const nativeManager = new NativeSponsorManager();
        app.nativeSponsorManager = nativeManager;
        
        // Initialize when ready
        if (app.isInitialized) {
            nativeManager.initialize();
        } else {
            const checkInit = setInterval(() => {
                if (app.isInitialized) {
                    clearInterval(checkInit);
                    nativeManager.initialize();
                }
            }, 100);
        }

        // Make available globally for testing
        window.nativeSponsorManager = nativeManager;
        
        return nativeManager;
    }
}

window.NativeSponsorManager = NativeSponsorManager;