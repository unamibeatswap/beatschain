/**
 * Smart Asset Hub Integration - Mount Smart Trees AI into Asset Hub
 * Provides AI-powered asset insights, recommendations, and intelligence
 */

class SmartAssetHubIntegration {
    constructor(smartTreesAI, assetHub, chromeAI) {
        this.smartTreesAI = smartTreesAI;
        this.assetHub = assetHub;
        this.chromeAI = chromeAI;
        this.isInitialized = false;
        this.assetInsights = new Map();
        this.hubAnalytics = new Map();
    }

    async initialize() {
        try {
            // Graceful initialization - don't break if components unavailable
            if (!this.smartTreesAI || !this.assetHub) {
                console.log('⚠️ Smart Trees AI or Asset Hub not available, skipping integration');
                return false;
            }

            // Load existing asset insights
            await this.loadAssetInsights();
            
            // Setup asset intelligence monitoring
            this.setupAssetIntelligence();
            
            // Enhance asset hub UI with AI features
            this.enhanceAssetHubUI();
            
            this.isInitialized = true;
            console.log('✅ Smart Asset Hub Integration initialized');
            return true;
            
        } catch (error) {
            console.error('❌ Smart Asset Hub Integration failed:', error);
            return false;
        }
    }

    async loadAssetInsights() {
        try {
            const stored = await chrome.storage.local.get(['smartAssetInsights']);
            if (stored.smartAssetInsights) {
                this.assetInsights = new Map(Object.entries(stored.smartAssetInsights));
            }
        } catch (error) {
            console.warn('Failed to load asset insights:', error);
        }
    }

    async saveAssetInsights() {
        try {
            await chrome.storage.local.set({
                smartAssetInsights: Object.fromEntries(this.assetInsights)
            });
        } catch (error) {
            console.error('Failed to save asset insights:', error);
        }
    }

    setupAssetIntelligence() {
        // Monitor asset interactions for intelligence gathering
        this.monitorAssetViews();
        this.monitorAssetPlays();
        this.monitorSearchPatterns();
        this.monitorFilterUsage();
    }

    monitorAssetViews() {
        // Track which assets users view most
        document.addEventListener('click', (e) => {
            const assetCard = e.target.closest('[data-asset-id]');
            if (assetCard && !e.target.closest('.play-btn')) {
                const assetId = assetCard.dataset.assetId;
                this.recordAssetInteraction(assetId, 'view');
            }
        });
    }

    monitorAssetPlays() {
        // Track audio plays for engagement analysis
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('play-btn')) {
                const assetId = e.target.closest('[data-asset-id]')?.dataset.assetId;
                if (assetId) {
                    this.recordAssetInteraction(assetId, 'play');
                }
            }
        });
    }

    monitorSearchPatterns() {
        // Track search behavior for recommendation engine
        const searchInput = document.getElementById('asset-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.trim()) {
                        this.recordSearchPattern(e.target.value.trim());
                    }
                }, 1000);
            });
        }
    }

    monitorFilterUsage() {
        // Track filter preferences for personalization
        const typeFilter = document.getElementById('asset-type-filter');
        const sortOptions = document.getElementById('sort-options');
        
        [typeFilter, sortOptions].forEach(element => {
            if (element) {
                element.addEventListener('change', (e) => {
                    this.recordFilterUsage(element.id, e.target.value);
                });
            }
        });
    }

    recordAssetInteraction(assetId, type) {
        if (!this.smartTreesAI) return;
        
        const asset = this.assetHub?.getAssetById?.(assetId);
        if (asset) {
            this.smartTreesAI.recordActivity(`asset_${type}`, {
                assetId,
                assetType: asset.type,
                genre: asset.genre,
                artist: asset.artist,
                interactionType: type
            });
        }
    }

    recordSearchPattern(searchTerm) {
        if (!this.smartTreesAI) return;
        
        this.smartTreesAI.recordActivity('hub_search', {
            searchTerm: searchTerm.substring(0, 50), // Limit for privacy
            searchLength: searchTerm.length,
            hasNumbers: /\d/.test(searchTerm),
            hasISRC: /ZA-80G-\d{2}-\d{5}/.test(searchTerm)
        });
    }

    recordFilterUsage(filterId, value) {
        if (!this.smartTreesAI) return;
        
        this.smartTreesAI.recordActivity('hub_filter', {
            filterType: filterId,
            filterValue: value
        });
    }

    enhanceAssetHubUI() {
        // Add AI insights panel to asset hub
        this.addAIInsightsPanel();
        
        // Add smart recommendations
        this.addSmartRecommendations();
        
        // Add asset intelligence indicators
        this.addAssetIntelligence();
    }

    addAIInsightsPanel() {
        const hubHeader = document.querySelector('.hub-header');
        if (!hubHeader) return;

        // Check if already added
        if (document.getElementById('hub-ai-insights')) return;

        const aiPanel = document.createElement('div');
        aiPanel.id = 'hub-ai-insights';
        aiPanel.className = 'hub-ai-panel';
        aiPanel.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 12px;
            margin: 12px 0;
            font-size: 13px;
        `;

        aiPanel.innerHTML = `
            <div class="ai-panel-header" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span>🧠</span>
                <strong>Asset Intelligence</strong>
                <button class="ai-panel-toggle" style="margin-left: auto; background: none; border: none; cursor: pointer;">▼</button>
            </div>
            <div class="ai-panel-content" id="hub-ai-content">
                <div id="hub-insights-mini" class="insights-mini">
                    <div class="insight-loading">Analyzing your assets...</div>
                </div>
                <div class="ai-actions" style="margin-top: 8px;">
                    <button id="generate-hub-insight" class="btn btn-secondary btn-sm">Generate Insight</button>
                    <button id="view-all-insights" class="btn btn-secondary btn-sm">View All</button>
                </div>
            </div>
        `;

        hubHeader.appendChild(aiPanel);

        // Setup panel interactions
        this.setupAIPanelInteractions(aiPanel);
        
        // Load initial insights
        this.loadHubInsights();
    }

    setupAIPanelInteractions(panel) {
        const toggle = panel.querySelector('.ai-panel-toggle');
        const content = panel.querySelector('.ai-panel-content');
        
        toggle.addEventListener('click', () => {
            const isCollapsed = content.style.display === 'none';
            content.style.display = isCollapsed ? 'block' : 'none';
            toggle.textContent = isCollapsed ? '▼' : '▶';
        });

        const generateBtn = panel.querySelector('#generate-hub-insight');
        generateBtn.addEventListener('click', () => this.generateHubInsight());

        const viewAllBtn = panel.querySelector('#view-all-insights');
        viewAllBtn.addEventListener('click', () => this.navigateToInsights());
    }

    async loadHubInsights() {
        if (!this.smartTreesAI) return;

        const insights = this.smartTreesAI.getInsights(3);
        const hubInsights = insights.filter(insight => 
            insight.category === 'performance' || 
            insight.category === 'opportunities'
        );

        const container = document.getElementById('hub-insights-mini');
        if (!container) return;

        if (hubInsights.length === 0) {
            container.innerHTML = '<div class="no-insights">No asset insights yet</div>';
            return;
        }

        container.innerHTML = '';
        hubInsights.forEach(insight => {
            const insightDiv = document.createElement('div');
            insightDiv.className = 'mini-insight';
            insightDiv.style.cssText = `
                padding: 6px 8px;
                background: white;
                border-radius: 4px;
                margin-bottom: 4px;
                border-left: 3px solid #007bff;
                cursor: pointer;
            `;
            
            const preview = insight.description.length > 60 ? 
                insight.description.substring(0, 60) + '...' : insight.description;
            
            insightDiv.innerHTML = `
                <div style="font-weight: 500; font-size: 12px;">${insight.title}</div>
                <div style="color: #666; font-size: 11px;">${preview}</div>
            `;
            
            insightDiv.addEventListener('click', () => this.navigateToInsights());
            container.appendChild(insightDiv);
        });
    }

    async generateHubInsight() {
        if (!this.smartTreesAI || !this.assetHub) return;

        const generateBtn = document.getElementById('generate-hub-insight');
        const originalText = generateBtn.textContent;
        generateBtn.disabled = true;
        generateBtn.textContent = 'Analyzing...';

        try {
            // Analyze current asset portfolio
            const assets = await this.assetHub.getAssets();
            const analysis = this.analyzeAssetPortfolio(assets);
            
            // Generate insight based on analysis
            await this.smartTreesAI.generateInsight(
                'performance',
                'Asset Portfolio Analysis',
                this.createPortfolioInsight(analysis),
                { source: 'asset_hub', analysis }
            );

            // Refresh insights display
            await this.loadHubInsights();
            
            generateBtn.textContent = '✨ Generated!';
            setTimeout(() => {
                generateBtn.textContent = originalText;
                generateBtn.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Hub insight generation failed:', error);
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        }
    }

    analyzeAssetPortfolio(assets) {
        const analysis = {
            totalAssets: assets.length,
            assetTypes: {},
            genres: {},
            totalPlays: 0,
            avgPlaysPerAsset: 0,
            topPerformer: null,
            recentActivity: 0
        };

        assets.forEach(asset => {
            // Count asset types
            analysis.assetTypes[asset.type] = (analysis.assetTypes[asset.type] || 0) + 1;
            
            // Count genres
            if (asset.genre) {
                analysis.genres[asset.genre] = (analysis.genres[asset.genre] || 0) + 1;
            }
            
            // Track plays
            const plays = asset.plays || 0;
            analysis.totalPlays += plays;
            
            if (!analysis.topPerformer || plays > (analysis.topPerformer.plays || 0)) {
                analysis.topPerformer = asset;
            }
            
            // Recent activity (last 7 days)
            const assetDate = new Date(asset.createdAt);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            if (assetDate > weekAgo) {
                analysis.recentActivity++;
            }
        });

        analysis.avgPlaysPerAsset = assets.length > 0 ? 
            Math.round(analysis.totalPlays / assets.length) : 0;

        return analysis;
    }

    createPortfolioInsight(analysis) {
        const insights = [];
        
        if (analysis.totalAssets === 0) {
            return "Your asset portfolio is just getting started! Upload your first track to begin building your music catalog.";
        }
        
        if (analysis.totalAssets >= 5) {
            insights.push(`You've built a solid portfolio of ${analysis.totalAssets} assets`);
        }
        
        if (analysis.topPerformer && analysis.topPerformer.plays > 0) {
            insights.push(`"${analysis.topPerformer.title}" is your top performer with ${analysis.topPerformer.plays} plays`);
        }
        
        const topGenre = Object.entries(analysis.genres)
            .sort(([,a], [,b]) => b - a)[0];
        if (topGenre) {
            insights.push(`${topGenre[0]} represents your strongest genre focus`);
        }
        
        if (analysis.recentActivity > 0) {
            insights.push(`${analysis.recentActivity} new assets this week shows consistent creative output`);
        }
        
        return insights.length > 0 ? 
            insights.join('. ') + '.' : 
            'Continue creating and uploading to build portfolio insights.';
    }

    addSmartRecommendations() {
        const hubContent = document.querySelector('.hub-content');
        if (!hubContent || document.getElementById('smart-recommendations')) return;

        const recommendationsPanel = document.createElement('div');
        recommendationsPanel.id = 'smart-recommendations';
        recommendationsPanel.className = 'smart-recommendations';
        recommendationsPanel.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            position: relative;
        `;

        recommendationsPanel.innerHTML = `
            <div class="recommendations-header" style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span>🎯</span>
                <strong>Smart Recommendations</strong>
                <button class="rec-dismiss" style="margin-left: auto; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">×</button>
            </div>
            <div id="recommendations-content" class="recommendations-content">
                <div class="rec-loading">Analyzing your portfolio...</div>
            </div>
        `;

        hubContent.insertBefore(recommendationsPanel, hubContent.firstChild);

        // Setup dismiss functionality
        recommendationsPanel.querySelector('.rec-dismiss').addEventListener('click', () => {
            recommendationsPanel.remove();
        });

        // Load recommendations
        this.loadSmartRecommendations();
    }

    async loadSmartRecommendations() {
        if (!this.assetHub) return;

        const assets = await this.assetHub.getAssets();
        const recommendations = this.generateRecommendations(assets);
        
        const container = document.getElementById('recommendations-content');
        if (!container) return;

        if (recommendations.length === 0) {
            container.innerHTML = '<div class="no-recommendations">Upload more assets to get personalized recommendations</div>';
            return;
        }

        container.innerHTML = '';
        recommendations.slice(0, 2).forEach(rec => {
            const recDiv = document.createElement('div');
            recDiv.className = 'recommendation-item';
            recDiv.style.cssText = `
                background: rgba(255,255,255,0.1);
                border-radius: 6px;
                padding: 8px 12px;
                margin-bottom: 8px;
                font-size: 12px;
            `;
            
            recDiv.innerHTML = `
                <div style="font-weight: 500; margin-bottom: 4px;">${rec.title}</div>
                <div style="opacity: 0.9;">${rec.description}</div>
            `;
            
            container.appendChild(recDiv);
        });
    }

    generateRecommendations(assets) {
        const recommendations = [];
        
        if (assets.length === 0) {
            return [{
                title: 'Start Your Journey',
                description: 'Upload your first track to begin building your music portfolio'
            }];
        }
        
        // Genre diversification recommendation
        const genres = new Set(assets.map(a => a.genre).filter(Boolean));
        if (genres.size === 1 && assets.length >= 3) {
            recommendations.push({
                title: 'Explore New Genres',
                description: `All your tracks are ${Array.from(genres)[0]}. Consider experimenting with complementary genres to expand your audience.`
            });
        }
        
        // Engagement optimization
        const avgPlays = assets.reduce((sum, a) => sum + (a.plays || 0), 0) / assets.length;
        if (avgPlays < 5 && assets.length >= 2) {
            recommendations.push({
                title: 'Boost Engagement',
                description: 'Your tracks average fewer than 5 plays. Consider sharing on social media or collaborating with other artists.'
            });
        }
        
        // ISRC optimization
        const withISRC = assets.filter(a => a.isrc).length;
        const withoutISRC = assets.length - withISRC;
        if (withoutISRC > 0) {
            recommendations.push({
                title: 'Add ISRC Codes',
                description: `${withoutISRC} assets missing ISRC codes. Professional identification codes improve discoverability and royalty tracking.`
            });
        }
        
        return recommendations;
    }

    addAssetIntelligence() {
        // Add intelligence indicators to asset cards
        this.enhanceAssetCards();
        
        // Add trending indicators
        this.addTrendingIndicators();
    }

    enhanceAssetCards() {
        // Use MutationObserver to enhance cards as they're added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const assetCards = node.querySelectorAll ? 
                            node.querySelectorAll('[data-asset-id]') : 
                            (node.dataset?.assetId ? [node] : []);
                        
                        assetCards.forEach(card => this.enhanceAssetCard(card));
                    }
                });
            });
        });

        const assetGrid = document.getElementById('asset-grid');
        if (assetGrid) {
            observer.observe(assetGrid, { childList: true, subtree: true });
            
            // Enhance existing cards
            assetGrid.querySelectorAll('[data-asset-id]').forEach(card => {
                this.enhanceAssetCard(card);
            });
        }
    }

    enhanceAssetCard(card) {
        if (card.querySelector('.ai-enhancement')) return; // Already enhanced
        
        const assetId = card.dataset.assetId;
        if (!assetId) return;

        // Add AI enhancement indicator
        const enhancement = document.createElement('div');
        enhancement.className = 'ai-enhancement';
        enhancement.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 123, 255, 0.9);
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 500;
        `;

        // Get intelligence score for this asset
        const score = this.getAssetIntelligenceScore(assetId);
        enhancement.textContent = `AI ${score}%`;
        enhancement.title = `Asset Intelligence Score: ${score}%`;

        card.style.position = 'relative';
        card.appendChild(enhancement);
    }

    getAssetIntelligenceScore(assetId) {
        // Calculate intelligence score based on various factors
        let score = 50; // Base score
        
        const asset = this.assetHub?.getAssetById?.(assetId);
        if (!asset) return score;
        
        // Has ISRC code
        if (asset.isrc) score += 20;
        
        // Has plays/engagement
        if (asset.plays > 0) score += 15;
        
        // Complete metadata
        if (asset.genre && asset.artist && asset.title) score += 10;
        
        // Recent activity
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (new Date(asset.createdAt) > weekAgo) score += 5;
        
        return Math.min(score, 100);
    }

    addTrendingIndicators() {
        // Add trending badges to high-performing assets
        setTimeout(() => {
            this.updateTrendingIndicators();
        }, 1000);
    }

    async updateTrendingIndicators() {
        if (!this.assetHub) return;
        
        const assets = await this.assetHub.getAssets();
        const sorted = assets.sort((a, b) => (b.plays || 0) - (a.plays || 0));
        const topPerformers = sorted.slice(0, 3);
        
        topPerformers.forEach((asset, index) => {
            const card = document.querySelector(`[data-asset-id="${asset.id}"]`);
            if (card && !card.querySelector('.trending-badge')) {
                const badge = document.createElement('div');
                badge.className = 'trending-badge';
                badge.style.cssText = `
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    background: #ff6b6b;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 500;
                `;
                
                const labels = ['🔥 Hot', '📈 Rising', '⭐ Popular'];
                badge.textContent = labels[index] || '⭐ Popular';
                
                card.style.position = 'relative';
                card.appendChild(badge);
            }
        });
    }

    navigateToInsights() {
        // Trigger navigation to insights section
        const event = new CustomEvent('switchSection', {
            detail: { section: 'insights' }
        });
        document.dispatchEvent(event);
    }

    // Public API methods for external integration
    async analyzeAsset(assetId) {
        if (!this.smartTreesAI || !this.assetHub) return null;
        
        const asset = await this.assetHub.getAssetById(assetId);
        if (!asset) return null;
        
        // Generate asset-specific insights
        const insight = await this.smartTreesAI.generateInsight(
            'performance',
            `${asset.title} Analysis`,
            `This ${asset.type} has ${asset.plays || 0} plays and represents your ${asset.genre || 'music'} catalog.`,
            { assetId, assetType: asset.type }
        );
        
        return insight;
    }

    async getAssetRecommendations(assetId) {
        const asset = await this.assetHub?.getAssetById?.(assetId);
        if (!asset) return [];
        
        // Generate recommendations based on asset characteristics
        const recommendations = [];
        
        if (!asset.isrc) {
            recommendations.push({
                type: 'isrc',
                title: 'Add ISRC Code',
                description: 'Professional identification improves discoverability'
            });
        }
        
        if ((asset.plays || 0) === 0) {
            recommendations.push({
                type: 'promotion',
                title: 'Promote This Asset',
                description: 'Share on social media to increase plays'
            });
        }
        
        return recommendations;
    }

    // Cleanup method
    cleanup() {
        if (this.smartTreesAI) {
            this.smartTreesAI.cleanup();
        }
        
        // Clean up asset insights older than 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        for (const [key, insight] of this.assetInsights.entries()) {
            if (insight.timestamp < thirtyDaysAgo) {
                this.assetInsights.delete(key);
            }
        }
        
        this.saveAssetInsights();
    }

    // Static integration method
    static enhanceAssetHub(assetHub, smartTreesAI, chromeAI) {
        const integration = new SmartAssetHubIntegration(smartTreesAI, assetHub, chromeAI);
        
        // Initialize when ready
        setTimeout(async () => {
            await integration.initialize();
        }, 1000);
        
        return integration;
    }

    // Auto-initialize when components are available
    static autoInitialize() {
        // Wait for components to be available
        const checkAndInit = () => {
            if (window.AssetManagementHub && window.SmartTreesAI) {
                const assetHub = new window.AssetManagementHub();
                const smartTreesAI = new window.SmartTreesAI();
                const chromeAI = window.ChromeAIManager ? new window.ChromeAIManager() : null;
                
                return SmartAssetHubIntegration.enhanceAssetHub(assetHub, smartTreesAI, chromeAI);
            }
            return null;
        };
        
        // Try immediate initialization
        let integration = checkAndInit();
        
        // If not ready, wait and retry
        if (!integration) {
            setTimeout(() => {
                integration = checkAndInit();
                if (integration) {
                    console.log('✅ Smart Asset Hub Integration auto-initialized');
                }
            }, 2000);
        }
        
        return integration;
    }
}

window.SmartAssetHubIntegration = SmartAssetHubIntegration;