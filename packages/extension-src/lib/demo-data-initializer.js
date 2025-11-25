/**
 * Demo Data Initializer - Creates sample data to demonstrate recent implementations
 * Shows Chrome AI Revenue Optimization and Revenue Management System in action
 */

class DemoDataInitializer {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            await this.createChromeAIOptimizationData();
            await this.createRevenueManagementData();
            await this.createPackageMeasurementData();
            await this.createISRCRegistryData();
            await this.createAssetHubData();
            
            this.isInitialized = true;
            console.log('✅ Demo data initialized - recent implementations visible');
        } catch (error) {
            console.error('Failed to initialize demo data:', error);
        }
    }

    async createChromeAIOptimizationData() {
        const aiOptimizationMetrics = {
            costSavings: 1247.50, // R1,247.50 in cost savings
            revenueEnhancement: 2156.80, // R2,156.80 in revenue enhancement
            processedAssets: 47, // 47 assets processed with AI
            optimizedCampaigns: 12, // 12 campaigns optimized
            totalBenefit: 3404.30, // Total benefit R3,404.30
            lastUpdated: Date.now(),
            monthlyProjection: 59580, // R59,580 monthly projection
            annualProjection: 714960 // R714,960 annual projection
        };

        const chromeAIRevenueOptimizer = {
            enabled: true,
            initializedAt: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
            version: '1.0.0',
            features: {
                smartCostAnalysis: true,
                revenueTargeting: true,
                realTimeOptimization: true,
                privacyFirstProcessing: true
            },
            performance: {
                costReductionRange: '29-60%',
                averageOptimizationTime: '2.3s',
                successRate: 94.7,
                userSatisfaction: 4.8
            }
        };

        await chrome.storage.local.set({
            ai_optimization_metrics: aiOptimizationMetrics,
            chrome_ai_revenue_optimizer: chromeAIRevenueOptimizer
        });

        console.log('✅ Chrome AI optimization demo data created');
    }

    async createRevenueManagementData() {
        const revenueManagement = {
            version: '1.0.0',
            created: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
            currency: 'ZAR',
            vatRate: 0.15,
            
            streams: {
                sponsorPlacements: {
                    total: 4567.80,
                    monthly: 1523.60,
                    campaigns: new Map([
                        ['camp_001', { revenue: 1200.50, impressions: 2400, clicks: 120 }],
                        ['camp_002', { revenue: 890.30, impressions: 1780, clicks: 89 }]
                    ])
                },
                premiumFeatures: {
                    total: 2340.00,
                    monthly: 780.00,
                    subscriptions: new Map([
                        ['sub_001', { planType: 'AI Premium', amount: 299.00, userId: 'user_123' }],
                        ['sub_002', { planType: 'Pro', amount: 149.00, userId: 'user_456' }]
                    ])
                },
                transactionFees: {
                    total: 567.45,
                    monthly: 189.15,
                    fees: [
                        { type: 'nft_mint', amount: 25.50, timestamp: Date.now() },
                        { type: 'package_generation', amount: 12.75, timestamp: Date.now() }
                    ]
                },
                nftRoyalties: {
                    total: 1234.56,
                    monthly: 411.52,
                    royalties: [
                        { nftId: 'nft_001', amount: 156.78, royaltyPercentage: 0.05 },
                        { nftId: 'nft_002', amount: 234.56, royaltyPercentage: 0.06 }
                    ]
                }
            },
            
            campaigns: new Map([
                ['rev_001', {
                    id: 'rev_001',
                    name: 'Music Distribution Sponsors',
                    status: 'active',
                    metrics: { revenue: 1200.50, impressions: 2400, clicks: 120 }
                }],
                ['rev_002', {
                    id: 'rev_002',
                    name: 'AI Premium Features',
                    status: 'active',
                    metrics: { revenue: 890.30, impressions: 1780, clicks: 89 }
                }]
            ]),
            
            analytics: {
                monthly: new Map([
                    ['2025-1', { totalRevenue: 8709.81, breakdown: { sponsor_impression: { revenue: 4567.80 } } }]
                ])
            },
            
            payments: {
                pending: [
                    {
                        id: 'inv_001',
                        totalAmount: 1380.58,
                        subtotal: 1200.50,
                        vatAmount: 180.08,
                        status: 'pending'
                    }
                ],
                processed: []
            },
            
            projections: {
                monthly: 8709.81,
                quarterly: 26129.43,
                yearly: 104517.72,
                aiOptimizationBenefit: 3404.30
            }
        };

        await chrome.storage.local.set({ revenue_management: revenueManagement });
        console.log('✅ Revenue management demo data created');
    }

    async createPackageMeasurementData() {
        const packageMeasurementData = {
            totalPackages: 156,
            radioPackages: 89,
            mintPackages: 67,
            lastUpdated: Date.now(),
            dailyStats: {
                [new Date().toDateString()]: { radio: 12, mint: 8 },
                [new Date(Date.now() - 86400000).toDateString()]: { radio: 15, mint: 10 }
            },
            sponsorMetrics: {
                displays: 234,
                interactions: 67,
                engagementRate: 28.6,
                placements: {
                    'after_isrc': { displays: 89, interactions: 25 },
                    'validation': { displays: 78, interactions: 22 },
                    'post_package': { displays: 67, interactions: 20 }
                }
            }
        };

        await chrome.storage.local.set({ package_measurement_data: packageMeasurementData });
        console.log('✅ Package measurement demo data created');
    }

    async createISRCRegistryData() {
        const isrcRegistry = [
            {
                isrc: 'ZA-80G-25-00001',
                title: 'Summer Vibes',
                artist: 'DJ Producer',
                generated: Date.now() - (5 * 24 * 60 * 60 * 1000),
                status: 'active'
            },
            {
                isrc: 'ZA-80G-25-00002',
                title: 'Night Drive',
                artist: 'Beat Maker',
                generated: Date.now() - (3 * 24 * 60 * 60 * 1000),
                status: 'active'
            },
            {
                isrc: 'ZA-80G-25-00003',
                title: 'Urban Flow',
                artist: 'Hip Hop Artist',
                generated: Date.now() - (1 * 24 * 60 * 60 * 1000),
                status: 'active'
            }
        ];

        await chrome.storage.local.set({ isrc_registry: isrcRegistry });
        console.log('✅ ISRC registry demo data created');
    }

    async createAssetHubData() {
        const nftAssets = [
            {
                id: 'nft_001',
                title: 'Electronic Dreams',
                artist: 'Synth Master',
                genre: 'Electronic',
                plays: 1247,
                likes: 89,
                created: Date.now() - (10 * 24 * 60 * 60 * 1000),
                ipfsHash: 'QmX1Y2Z3...',
                qualityScore: 92
            },
            {
                id: 'nft_002',
                title: 'Afro House Anthem',
                artist: 'House Producer',
                genre: 'House',
                plays: 2156,
                likes: 156,
                created: Date.now() - (7 * 24 * 60 * 60 * 1000),
                ipfsHash: 'QmA4B5C6...',
                qualityScore: 88
            },
            {
                id: 'nft_003',
                title: 'Hip Hop Chronicles',
                artist: 'Rap Artist',
                genre: 'Hip-Hop',
                plays: 3421,
                likes: 234,
                created: Date.now() - (4 * 24 * 60 * 60 * 1000),
                ipfsHash: 'QmD7E8F9...',
                qualityScore: 95
            }
        ];

        const campaigns = [
            {
                id: 'campaign_001',
                name: 'Summer Music Promotion',
                type: 'sponsor',
                status: 'active',
                impressions: 5678,
                clicks: 234,
                conversions: 45,
                created: Date.now() - (14 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'campaign_002',
                name: 'AI Premium Launch',
                type: 'promotion',
                status: 'active',
                impressions: 3456,
                clicks: 167,
                conversions: 32,
                created: Date.now() - (8 * 24 * 60 * 60 * 1000)
            }
        ];

        await chrome.storage.local.set({
            nftAssets: nftAssets,
            campaigns: campaigns
        });

        console.log('✅ Asset hub demo data created');
    }

    async updateUsageStats() {
        const existingStats = await chrome.storage.local.get(['usage_stats']);
        const currentStats = existingStats.usage_stats || {};

        const updatedStats = {
            ...currentStats,
            totalPackages: (currentStats.totalPackages || 0) + 156,
            packageTypes: {
                radio: (currentStats.packageTypes?.radio || 0) + 89,
                mint: (currentStats.packageTypes?.mint || 0) + 67
            },
            isrcUsage: (currentStats.isrcUsage || 0) + 3,
            ipfsUsage: (currentStats.ipfsUsage || 0) + 3,
            lastUpdated: Date.now()
        };

        await chrome.storage.local.set({ usage_stats: updatedStats });
        console.log('✅ Usage stats updated with demo data');
    }

    async clearDemoData() {
        const keysToRemove = [
            'ai_optimization_metrics',
            'chrome_ai_revenue_optimizer',
            'revenue_management',
            'package_measurement_data',
            'isrc_registry'
        ];

        await chrome.storage.local.remove(keysToRemove);
        console.log('✅ Demo data cleared');
    }

    async getDemoDataSummary() {
        const data = await chrome.storage.local.get([
            'ai_optimization_metrics',
            'chrome_ai_revenue_optimizer',
            'revenue_management',
            'package_measurement_data',
            'isrc_registry',
            'nftAssets',
            'campaigns'
        ]);

        return {
            chromeAI: {
                enabled: data.chrome_ai_revenue_optimizer?.enabled || false,
                totalBenefit: data.ai_optimization_metrics?.totalBenefit || 0,
                processedAssets: data.ai_optimization_metrics?.processedAssets || 0
            },
            revenue: {
                totalRevenue: this.calculateTotalRevenue(data.revenue_management),
                activeCampaigns: data.revenue_management?.campaigns?.size || 0,
                pendingInvoices: data.revenue_management?.payments?.pending?.length || 0
            },
            packages: {
                total: data.package_measurement_data?.totalPackages || 0,
                radio: data.package_measurement_data?.radioPackages || 0,
                mint: data.package_measurement_data?.mintPackages || 0
            },
            assets: {
                nfts: data.nftAssets?.length || 0,
                campaigns: data.campaigns?.length || 0,
                isrcCodes: data.isrc_registry?.length || 0
            }
        };
    }

    calculateTotalRevenue(revenueData) {
        if (!revenueData?.streams) return 0;
        
        return Object.values(revenueData.streams)
            .reduce((sum, stream) => sum + (stream.total || 0), 0);
    }
}

// Export demo data initializer but DO NOT auto-initialize
window.DemoDataInitializer = DemoDataInitializer;

// Demo data initialization is now manual only - no automatic mock data