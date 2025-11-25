/**
 * Analytics Manager - Chrome Web Store Compliant Local Analytics
 * Tracks package generation, ISRC usage, and sponsor engagement
 * All data stored locally - no external transmission
 */

class AnalyticsManager {
    constructor() {
        this.storageKey = 'beatschain_analytics';
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            // Ensure analytics structure exists
            const stats = await this.getStats();
            if (!stats.version) {
                await this.initializeStats();
            }
            
            this.initialized = true;
            console.log('✅ Analytics Manager initialized (local storage only)');
        } catch (error) {
            console.error('❌ Analytics Manager initialization failed:', error);
        }
    }

    async initializeStats() {
        const defaultStats = {
            version: '2.0.0',
            created: Date.now(),
            packages: {
                successful: 0,
                totalFiles: 0,
                withSponsored: 0,
                lastGenerated: null
            },
            isrc: {
                inPackages: 0,
                lastGenerated: null
            },
            sponsor: {
                displays: 0,
                interactions: {},
                locations: {},
                locationActions: {}
            }
        };
        
        await this.saveStats(defaultStats);
    }

    async getStats() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Failed to get analytics stats:', error);
            return {};
        }
    }

    async saveStats(stats) {
        try {
            stats.lastUpdated = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(stats));
        } catch (error) {
            console.error('Failed to save analytics stats:', error);
        }
    }

    // Package Analytics
    async recordPackageSuccess(packageData) {
        if (!window.consentManager?.hasAnalyticsConsent()) return;
        
        const stats = await this.getStats();
        stats.packages = stats.packages || {};
        stats.packages.successful = (stats.packages.successful || 0) + 1;
        stats.packages.totalFiles = (stats.packages.totalFiles || 0) + packageData.fileCount;
        stats.packages.lastGenerated = packageData.timestamp;
        
        if (packageData.hasSponsoredContent) {
            stats.packages.withSponsored = (stats.packages.withSponsored || 0) + 1;
        }
        
        await this.saveStats(stats);
    }

    // ISRC Analytics
    async recordISRCInPackage() {
        const stats = await this.getStats();
        stats.isrc = stats.isrc || {};
        stats.isrc.inPackages = (stats.isrc.inPackages || 0) + 1;
        stats.isrc.lastGenerated = Date.now();
        
        await this.saveStats(stats);
    }

    // Sponsor Analytics
    async recordSponsorDisplay(location) {
        const stats = await this.getStats();
        stats.sponsor = stats.sponsor || {};
        stats.sponsor.displays = (stats.sponsor.displays || 0) + 1;
        stats.sponsor.locations = stats.sponsor.locations || {};
        stats.sponsor.locations[location] = (stats.sponsor.locations[location] || 0) + 1;
        
        await this.saveStats(stats);
    }

    async recordSponsorInteraction(action, location) {
        const stats = await this.getStats();
        stats.sponsor = stats.sponsor || {};
        stats.sponsor.interactions = stats.sponsor.interactions || {};
        stats.sponsor.interactions[action] = (stats.sponsor.interactions[action] || 0) + 1;
        
        const key = `${location}_${action}`;
        stats.sponsor.locationActions = stats.sponsor.locationActions || {};
        stats.sponsor.locationActions[key] = (stats.sponsor.locationActions[key] || 0) + 1;
        
        await this.saveStats(stats);
    }

    // Analytics Summary
    async getAnalyticsSummary() {
        const stats = await this.getStats();
        
        return {
            packages: {
                total: stats.packages?.successful || 0,
                withSponsored: stats.packages?.withSponsored || 0,
                averageFiles: Math.round((stats.packages?.totalFiles || 0) / Math.max(stats.packages?.successful || 1, 1)),
                sponsorInclusionRate: Math.round(((stats.packages?.withSponsored || 0) / Math.max(stats.packages?.successful || 1, 1)) * 100)
            },
            
            isrc: {
                generated: stats.isrc?.inPackages || 0,
                utilizationRate: Math.round(((stats.isrc?.inPackages || 0) / Math.max(stats.packages?.successful || 1, 1)) * 100)
            },
            
            sponsor: {
                displays: stats.sponsor?.displays || 0,
                interactions: stats.sponsor?.interactions || {},
                engagementRate: this.calculateEngagementRate(stats.sponsor)
            },
            
            lastUpdated: stats.lastUpdated || null
        };
    }

    calculateEngagementRate(sponsorStats) {
        if (!sponsorStats?.displays) return 0;
        const totalInteractions = Object.values(sponsorStats.interactions || {}).reduce((a, b) => a + b, 0);
        return Math.round((totalInteractions / sponsorStats.displays) * 100);
    }

    // Export analytics (for debugging/admin view)
    async exportAnalytics() {
        const stats = await this.getStats();
        const summary = await this.getAnalyticsSummary();
        
        return {
            summary: summary,
            rawData: stats,
            exportedAt: new Date().toISOString(),
            version: '2.0.0'
        };
    }

    // Clear analytics (privacy compliance)
    async clearAnalytics() {
        try {
            localStorage.removeItem(this.storageKey);
            await this.initializeStats();
            console.log('✅ Analytics cleared and reset');
        } catch (error) {
            console.error('❌ Failed to clear analytics:', error);
        }
    }
}

// Export for Chrome extension compatibility
window.AnalyticsManager = AnalyticsManager;