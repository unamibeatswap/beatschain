/**
 * Sponsor Content Manager - Professional Sponsor Integration
 * Handles sponsor content display with Chrome Web Store compliance
 */

class SponsorContentManager {
    constructor() {
        this.adminDashboard = null;
        this.sponsorConfig = null;
        this.isInitialized = false;
    }

    async initialize(adminDashboard = null) {
        this.adminDashboard = adminDashboard;
        await this.loadSponsorConfig();
        this.isInitialized = true;
        console.log('✅ Sponsor Content Manager initialized');
    }

    async loadSponsorConfig() {
        try {
            if (this.adminDashboard) {
                this.sponsorConfig = this.adminDashboard.getSponsorContent();
            } else {
                // Load from storage directly
                const result = await chrome.storage.local.get(['sponsor_config']);
                const config = result.sponsor_config || { enabled: false };
                
                if (config.enabled) {
                    const template = config.templates?.[config.currentSponsor] || config.templates?.default;
                    this.sponsorConfig = {
                        enabled: true,
                        placement: config.placement || 'after_isrc',
                        content: template || {
                            name: 'BeatsChain',
                            message: 'Powered by BeatsChain',
                            logo: null,
                            website: 'https://beatschain.com'
                        }
                    };
                } else {
                    this.sponsorConfig = { enabled: false };
                }
            }
        } catch (error) {
            console.error('Failed to load sponsor config:', error);
            this.sponsorConfig = { enabled: false };
        }
    }

    shouldShowSponsorContent(placement) {
        if (!this.sponsorConfig || !this.sponsorConfig.enabled) {
            return false;
        }
        
        return this.sponsorConfig.placement === placement;
    }

    createSponsorContent(placement, context = {}) {
        if (!this.shouldShowSponsorContent(placement)) {
            return null;
        }

        const content = this.sponsorConfig.content;
        const sponsorEl = document.createElement('div');
        sponsorEl.className = 'sponsor-content-display';
        sponsorEl.innerHTML = `
            <div class="sponsor-container">
                <div class="sponsor-header">
                    <span class="sponsor-label">Sponsored</span>
                    <button class="sponsor-close" title="Hide sponsor content">&times;</button>
                </div>
                <div class="sponsor-body">
                    ${content.logo ? `<div class="sponsor-logo"><img src="${content.logo}" alt="${content.name}"></div>` : ''}
                    <div class="sponsor-info">
                        <div class="sponsor-name">${this.sanitizeText(content.name)}</div>
                        <div class="sponsor-message">${this.sanitizeText(content.message)}</div>
                        ${content.website ? `<a href="${content.website}" target="_blank" class="sponsor-link">Learn More</a>` : ''}
                    </div>
                </div>
                <div class="sponsor-footer">
                    <small class="sponsor-disclosure">Professional partner content</small>
                </div>
            </div>
        `;

        // Add close functionality
        const closeBtn = sponsorEl.querySelector('.sponsor-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                sponsorEl.style.display = 'none';
                this.recordSponsorInteraction('closed', placement);
            });
        }

        // Add click tracking
        const sponsorLink = sponsorEl.querySelector('.sponsor-link');
        if (sponsorLink) {
            sponsorLink.addEventListener('click', () => {
                this.recordSponsorInteraction('clicked', placement);
            });
        }

        // Record impression
        this.recordSponsorInteraction('shown', placement);

        return sponsorEl;
    }

    showSponsorAfterISRC(isrcValue, container) {
        if (!this.shouldShowSponsorContent('after_isrc')) {
            return;
        }

        const sponsorContent = this.createSponsorContent('after_isrc', { isrc: isrcValue });
        if (sponsorContent && container) {
            // Add with animation
            sponsorContent.style.opacity = '0';
            sponsorContent.style.transform = 'translateY(-10px)';
            container.appendChild(sponsorContent);
            
            setTimeout(() => {
                sponsorContent.style.transition = 'all 0.3s ease';
                sponsorContent.style.opacity = '1';
                sponsorContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    showSponsorBeforePackage(packageType, container) {
        if (!this.shouldShowSponsorContent('before_package')) {
            return;
        }

        const sponsorContent = this.createSponsorContent('before_package', { packageType });
        if (sponsorContent && container) {
            container.insertBefore(sponsorContent, container.firstChild);
        }
    }

    showSponsorAfterPackage(packageInfo, container) {
        if (!this.shouldShowSponsorContent('after_package')) {
            return;
        }

        const sponsorContent = this.createSponsorContent('after_package', packageInfo);
        if (sponsorContent && container) {
            container.appendChild(sponsorContent);
        }
    }

    async recordSponsorInteraction(action, placement, context = {}) {
        try {
            const interaction = {
                timestamp: Date.now(),
                action: action, // 'shown', 'clicked', 'closed'
                placement: placement,
                sponsor: this.sponsorConfig?.content?.name || 'unknown',
                context: context
            };

            // Get existing interactions
            const result = await chrome.storage.local.get(['sponsor_interactions']);
            const interactions = result.sponsor_interactions || [];
            
            interactions.push(interaction);
            
            // Keep only last 1000 interactions
            if (interactions.length > 1000) {
                interactions.splice(0, interactions.length - 1000);
            }
            
            await chrome.storage.local.set({ sponsor_interactions: interactions });
            
        } catch (error) {
            console.error('Failed to record sponsor interaction:', error);
        }
    }

    async getSponsorAnalytics() {
        try {
            const result = await chrome.storage.local.get(['sponsor_interactions']);
            const interactions = result.sponsor_interactions || [];
            
            const analytics = {
                totalImpressions: 0,
                totalClicks: 0,
                totalClosed: 0,
                clickThroughRate: 0,
                closeRate: 0,
                byPlacement: {},
                bySponsor: {},
                last7Days: this.getRecentAnalytics(interactions, 7),
                last30Days: this.getRecentAnalytics(interactions, 30)
            };
            
            interactions.forEach(interaction => {
                // Overall stats
                if (interaction.action === 'shown') analytics.totalImpressions++;
                if (interaction.action === 'clicked') analytics.totalClicks++;
                if (interaction.action === 'closed') analytics.totalClosed++;
                
                // By placement
                if (!analytics.byPlacement[interaction.placement]) {
                    analytics.byPlacement[interaction.placement] = { shown: 0, clicked: 0, closed: 0 };
                }
                analytics.byPlacement[interaction.placement][interaction.action]++;
                
                // By sponsor
                if (!analytics.bySponsor[interaction.sponsor]) {
                    analytics.bySponsor[interaction.sponsor] = { shown: 0, clicked: 0, closed: 0 };
                }
                analytics.bySponsor[interaction.sponsor][interaction.action]++;
            });
            
            // Calculate rates
            if (analytics.totalImpressions > 0) {
                analytics.clickThroughRate = (analytics.totalClicks / analytics.totalImpressions * 100).toFixed(2);
                analytics.closeRate = (analytics.totalClosed / analytics.totalImpressions * 100).toFixed(2);
            }
            
            return analytics;
            
        } catch (error) {
            console.error('Failed to get sponsor analytics:', error);
            return { totalImpressions: 0, totalClicks: 0, totalClosed: 0 };
        }
    }

    getRecentAnalytics(interactions, days) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const recent = interactions.filter(i => i.timestamp > cutoff);
        
        return {
            impressions: recent.filter(i => i.action === 'shown').length,
            clicks: recent.filter(i => i.action === 'clicked').length,
            closed: recent.filter(i => i.action === 'closed').length
        };
    }

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

    // Integration with existing systems
    enhanceISRCGeneration(isrcManager) {
        if (!isrcManager) return;

        // Override the ISRC generation success handler
        const originalHandleGeneration = isrcManager.handleISRCGeneration;
        if (originalHandleGeneration) {
            isrcManager.handleISRCGeneration = async function() {
                const result = await originalHandleGeneration.call(this);
                
                // Show sponsor content after ISRC generation
                if (window.sponsorContentManager) {
                    const isrcField = document.getElementById('radio-isrc');
                    if (isrcField && isrcField.value) {
                        const container = isrcField.closest('.form-row');
                        if (container) {
                            setTimeout(() => {
                                window.sponsorContentManager.showSponsorAfterISRC(isrcField.value, container);
                            }, 1000); // Delay to let ISRC message show first
                        }
                    }
                }
                
                return result;
            };
        }
    }

    enhancePackageGeneration(radioApp) {
        if (!radioApp) return;

        // Override package generation methods
        const originalGeneratePackage = radioApp.generateRadioPackage;
        if (originalGeneratePackage) {
            radioApp.generateRadioPackage = async function() {
                // Show sponsor content before package generation
                if (window.sponsorContentManager) {
                    const packageSection = document.getElementById('radio-step-6');
                    if (packageSection) {
                        window.sponsorContentManager.showSponsorBeforePackage('radio', packageSection);
                    }
                }
                
                const result = await originalGeneratePackage.call(this);
                
                // Show sponsor content after successful package generation
                if (window.sponsorContentManager && result) {
                    const packageSection = document.getElementById('radio-step-6');
                    if (packageSection) {
                        setTimeout(() => {
                            window.sponsorContentManager.showSponsorAfterPackage({
                                type: 'radio',
                                success: true
                            }, packageSection);
                        }, 2000);
                    }
                }
                
                return result;
            };
        }
    }

    // Chrome Web Store compliance helpers
    getUserConsent() {
        // Check if user has consented to sponsor content
        const consent = localStorage.getItem('sponsor_consent');
        if (consent === 'true') return true;
        if (consent === 'false') return false;
        return null; // No choice made yet
    }

    async requestUserConsent() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'consent-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            `;
            
            modal.innerHTML = `
                <div class="modal-content" style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    text-align: center;
                ">
                    <div class="modal-header" style="margin-bottom: 16px;">
                        <h3 style="margin: 0; color: #333; font-size: 18px;">📢 Professional Partner Content</h3>
                    </div>
                    <div class="modal-body" style="margin-bottom: 20px;">
                        <p style="margin: 0 0 12px 0; color: #666; font-size: 14px; line-height: 1.4;">BeatsChain partners with professional music industry services to provide you with relevant tools and resources.</p>
                        <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.4;">We may show you content from our verified partners that could help with your music career.</p>
                        <div class="consent-options" style="margin: 16px 0;">
                            <label class="consent-option" style="display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="consent-checkbox" style="margin: 0;">
                                <span style="color: #333; font-size: 14px;">I agree to see relevant partner content</span>
                            </label>
                        </div>
                        <small class="consent-note" style="color: #888; font-size: 12px; line-height: 1.3;">You can change this preference anytime in settings. No personal data is shared with partners.</small>
                    </div>
                    <div class="modal-footer" style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn btn-secondary consent-decline" style="
                            padding: 8px 16px;
                            border: 1px solid #ddd;
                            background: #f8f9fa;
                            color: #666;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">No Thanks</button>
                        <button class="btn btn-primary consent-accept" disabled style="
                            padding: 8px 16px;
                            border: none;
                            background: #007bff;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            opacity: 0.5;
                        ">Accept</button>
                    </div>
                </div>
            `;

            const checkbox = modal.querySelector('#consent-checkbox');
            const acceptBtn = modal.querySelector('.consent-accept');
            const declineBtn = modal.querySelector('.consent-decline');

            checkbox.addEventListener('change', () => {
                acceptBtn.disabled = !checkbox.checked;
                acceptBtn.style.opacity = checkbox.checked ? '1' : '0.5';
                acceptBtn.style.cursor = checkbox.checked ? 'pointer' : 'not-allowed';
            });

            acceptBtn.addEventListener('click', () => {
                if (!checkbox.checked) return;
                localStorage.setItem('sponsor_consent', 'true');
                document.body.removeChild(modal);
                resolve(true);
            });

            declineBtn.addEventListener('click', () => {
                localStorage.setItem('sponsor_consent', 'false');
                document.body.removeChild(modal);
                resolve(false);
            });

            // Prevent closing by clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    // Don't allow closing by clicking outside - user must make a choice
                    return;
                }
            });

            document.body.appendChild(modal);
        });
    }

    async ensureCompliance() {
        if (!this.getUserConsent()) {
            const consent = await this.requestUserConsent();
            if (!consent) {
                // Disable sponsor content if user declines
                this.sponsorConfig = { enabled: false };
            }
        }
    }

    // Show partner consent at popup initialization
    async showInitialPartnerConsent() {
        const existingConsent = this.getUserConsent();
        if (existingConsent !== null) {
            return existingConsent; // User has already made a choice
        }
        
        // Show consent modal immediately when popup loads - blocks all interaction
        return await this.requestUserConsent();
    }
}

// Export for Chrome extension compatibility
window.SponsorContentManager = SponsorContentManager;