/**
 * Sponsor Reporting - Generate reports for sponsors
 */

class SponsorReporting {
    constructor(analyticsManager, googleDriveManager) {
        this.analyticsManager = analyticsManager;
        this.googleDriveManager = googleDriveManager;
    }

    // Generate sponsor report
    async generateSponsorReport(sponsorId, dateRange = 30) {
        const endDate = Date.now();
        const startDate = endDate - (dateRange * 24 * 60 * 60 * 1000);
        
        const analytics = this.googleDriveManager.analytics;
        
        // Filter data for sponsor and date range
        const impressions = analytics.impressions.filter(e => 
            e.sponsorId === sponsorId && e.timestamp >= startDate
        );
        const clicks = analytics.clicks.filter(e => 
            e.sponsorId === sponsorId && e.timestamp >= startDate
        );
        const interactions = analytics.interactions.filter(e => 
            e.sponsorId === sponsorId && e.timestamp >= startDate
        );

        return {
            sponsorId,
            period: `${dateRange} days`,
            metrics: {
                impressions: impressions.length,
                clicks: clicks.length,
                interactions: interactions.length,
                ctr: impressions.length > 0 ? (clicks.length / impressions.length * 100).toFixed(2) : 0
            },
            placements: this.getPlacementBreakdown(impressions, clicks),
            generatedAt: new Date().toISOString()
        };
    }

    getPlacementBreakdown(impressions, clicks) {
        const placements = {};
        
        impressions.forEach(imp => {
            if (!placements[imp.placement]) {
                placements[imp.placement] = { impressions: 0, clicks: 0 };
            }
            placements[imp.placement].impressions++;
        });
        
        clicks.forEach(click => {
            if (placements[click.placement]) {
                placements[click.placement].clicks++;
            }
        });
        
        return placements;
    }

    // Export report as JSON
    async exportReport(sponsorId, dateRange = 30) {
        const report = await this.generateSponsorReport(sponsorId, dateRange);
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sponsor-report-${sponsorId}-${dateRange}days.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

window.SponsorReporting = SponsorReporting;