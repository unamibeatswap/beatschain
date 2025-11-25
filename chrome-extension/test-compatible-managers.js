/**
 * Test-Compatible Manager Stubs
 * Provides fallback implementations for testing without Chrome APIs
 */

// Mock Chrome Storage for testing
if (typeof chrome === 'undefined') {
    window.chrome = {
        storage: {
            local: {
                set: (data, callback) => {
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(`chrome_${key}`, JSON.stringify(data[key]));
                    });
                    if (callback) callback();
                },
                get: (keys, callback) => {
                    const result = {};
                    if (Array.isArray(keys)) {
                        keys.forEach(key => {
                            const stored = localStorage.getItem(`chrome_${key}`);
                            if (stored) {
                                try {
                                    result[key] = JSON.parse(stored);
                                } catch (e) {
                                    result[key] = stored;
                                }
                            }
                        });
                    }
                    if (callback) callback(result);
                }
            }
        }
    };
}

// Test-compatible Google Drive Sponsor Manager
class TestGoogleDriveSponsorManager {
    constructor() {
        this.manifestUrl = null;
        this.sponsorData = null;
        this.analytics = {
            impressions: [],
            clicks: [],
            interactions: []
        };
    }

    setManifestUrl(url) {
        this.manifestUrl = url;
    }

    async fetchSponsorManifest() {
        // For testing, return null or use provided data
        return this.sponsorData;
    }

    async storeOfflineCache(data) {
        localStorage.setItem('test_sponsor_cache', JSON.stringify(data));
    }

    async getOfflineCache() {
        const cached = localStorage.getItem('test_sponsor_cache');
        return cached ? JSON.parse(cached) : null;
    }

    getActiveSponsors(placement = 'after_isrc') {
        if (!this.sponsorData || !this.sponsorData.sponsors) {
            return [];
        }
        return this.sponsorData.sponsors.filter(sponsor => 
            sponsor.active && 
            (!sponsor.placement || sponsor.placement === placement)
        );
    }

    createSponsorCard(sponsor, placement) {
        const card = document.createElement('div');
        card.className = 'google-drive-sponsor-card';
        card.innerHTML = `
            <div class="sponsor-card-container">
                <div class="sponsor-header">
                    <span class="sponsor-label">Sponsored</span>
                    <button class="sponsor-close" onclick="this.closest('.google-drive-sponsor-card').style.display='none'">&times;</button>
                </div>
                <div class="sponsor-content">
                    <div class="sponsor-info">
                        <h4 class="sponsor-name">${sponsor.name}</h4>
                        <p class="sponsor-message">${sponsor.message}</p>
                        ${sponsor.website ? `<a href="${sponsor.website}" target="_blank" class="sponsor-link">Learn More</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    async displaySponsorContent(placement, container) {
        if (!container) return;

        const sponsors = this.getActiveSponsors(placement);
        if (sponsors.length === 0) return;

        const sponsor = sponsors[0]; // Use first sponsor for testing
        const card = this.createSponsorCard(sponsor, placement);
        container.appendChild(card);
    }

    recordAnalytics(action, sponsorId, placement) {
        // Simple analytics for testing
        this.analytics[action === 'impression' ? 'impressions' : 
                     action === 'click' ? 'clicks' : 'interactions'].push({
            timestamp: Date.now(),
            action,
            sponsorId,
            placement
        });
    }

    getAnalyticsSummary() {
        return {
            totalImpressions: this.analytics.impressions.length,
            totalClicks: this.analytics.clicks.length,
            totalInteractions: this.analytics.interactions.length,
            clickThroughRate: this.analytics.impressions.length > 0 ? 
                (this.analytics.clicks.length / this.analytics.impressions.length * 100).toFixed(2) : 0
        };
    }
}

// Override the global class if Chrome APIs aren't available
if (typeof chrome === 'undefined' || !chrome.storage) {
    window.GoogleDriveSponsorManager = TestGoogleDriveSponsorManager;
}