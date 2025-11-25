/**
 * Revenue Management System - Comprehensive Rands-based Revenue Tracking
 * Handles campaign creation, sponsor billing, revenue analytics, and final delivery
 * Follows BeatsChain design system and all mandatory dev rules
 */

class RevenueManagementSystem {
    constructor() {
        this.storageKey = 'revenue_management';
        this.revenueData = null;
        this.campaignManager = null;
        this.packageMeasurementSystem = null;
        this.nativeSponsorManager = null;
        this.chromeAIOptimizer = null;
        this.isInitialized = false;
        
        // South African Revenue Configuration
        this.currency = 'ZAR';
        this.currencySymbol = 'R';
        this.vatRate = 0.15; // 15% VAT in South Africa
        this.exchangeRates = new Map(); // For international sponsors
        
        // AI Optimization Tracking
        this.aiOptimizationEnabled = false;
        this.optimizationMetrics = {
            costSavings: 0,
            revenueEnhancement: 0,
            processedAssets: 0,
            optimizedCampaigns: 0
        };
    }

    async initialize(campaignManager, packageMeasurementSystem, nativeSponsorManager) {
        this.campaignManager = campaignManager;
        this.packageMeasurementSystem = packageMeasurementSystem;
        this.nativeSponsorManager = nativeSponsorManager;
        
        await this.loadRevenueData();
        await this.initializeExchangeRates();
        await this.initializeChromeAIOptimizer();
        
        this.isInitialized = true;
        console.log('✅ Revenue Management System initialized');
    }

    async initializeChromeAIOptimizer() {
        try {
            if (window.ChromeAIRevenueOptimizer) {
                this.chromeAIOptimizer = new window.ChromeAIRevenueOptimizer();
                this.aiOptimizationEnabled = await this.chromeAIOptimizer.initialize();
                
                if (this.aiOptimizationEnabled) {
                    console.log('🤖 Chrome AI Revenue Optimization enabled');
                    this.loadOptimizationMetrics();
                } else {
                    console.log('📊 Revenue system running with standard optimization');
                }
            }
        } catch (error) {
            console.log('Chrome AI optimizer initialization failed, using standard processing');
            this.aiOptimizationEnabled = false;
        }
    }

    async loadOptimizationMetrics() {
        try {
            const result = await chrome.storage.local.get(['ai_optimization_metrics']);
            if (result.ai_optimization_metrics) {
                this.optimizationMetrics = { ...this.optimizationMetrics, ...result.ai_optimization_metrics };
            }
        } catch (error) {
            console.error('Failed to load optimization metrics:', error);
        }
    }

    async saveOptimizationMetrics() {
        try {
            await chrome.storage.local.set({ ai_optimization_metrics: this.optimizationMetrics });
        } catch (error) {
            console.error('Failed to save optimization metrics:', error);
        }
    }

    async loadRevenueData() {
        try {
            const result = await chrome.storage.local.get([this.storageKey]);
            this.revenueData = result[this.storageKey] || this.getDefaultRevenueData();
        } catch (error) {
            console.error('Failed to load revenue data:', error);
            this.revenueData = this.getDefaultRevenueData();
        }
    }

    getDefaultRevenueData() {
        return {
            version: '1.0.0',
            created: Date.now(),
            currency: this.currency,
            vatRate: this.vatRate,
            
            // Revenue Streams
            streams: {
                sponsorPlacements: {
                    total: 0,
                    monthly: 0,
                    campaigns: new Map()
                },
                premiumFeatures: {
                    total: 0,
                    monthly: 0,
                    subscriptions: new Map()
                },
                transactionFees: {
                    total: 0,
                    monthly: 0,
                    fees: []
                },
                nftRoyalties: {
                    total: 0,
                    monthly: 0,
                    royalties: []
                }
            },
            
            // Campaign Revenue Tracking
            campaigns: new Map(),
            
            // Sponsor Billing
            sponsors: new Map(),
            
            // Revenue Analytics
            analytics: {
                daily: new Map(),
                monthly: new Map(),
                yearly: new Map()
            },
            
            // Payment Processing
            payments: {
                pending: [],
                processed: [],
                failed: []
            },
            
            // Revenue Projections
            projections: {
                monthly: 0,
                quarterly: 0,
                yearly: 0
            }
        };
    }

    async saveRevenueData() {
        try {
            this.revenueData.lastUpdated = Date.now();
            await chrome.storage.local.set({ [this.storageKey]: this.revenueData });
        } catch (error) {
            console.error('Failed to save revenue data:', error);
        }
    }

    async initializeExchangeRates() {
        // Initialize with common exchange rates (would be updated from API in production)
        this.exchangeRates.set('USD', 18.50); // USD to ZAR
        this.exchangeRates.set('EUR', 20.10); // EUR to ZAR
        this.exchangeRates.set('GBP', 23.40); // GBP to ZAR
        this.exchangeRates.set('ZAR', 1.00);  // ZAR to ZAR
    }

    // Campaign Revenue Management with AI Optimization
    async createRevenueCampaign(campaignData) {
        const campaignId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // AI-powered campaign optimization
        let optimizedCampaign = campaignData;
        if (this.aiOptimizationEnabled && this.chromeAIOptimizer) {
            try {
                const optimization = await this.chromeAIOptimizer.optimizeSponsorPlacement(
                    campaignData, 
                    { interests: [], genres: [] } // Would be populated from user data
                );
                
                optimizedCampaign = {
                    ...campaignData,
                    aiOptimization: optimization,
                    optimizedPricing: optimization.pricing
                };
                
                this.optimizationMetrics.optimizedCampaigns++;
                await this.saveOptimizationMetrics();
                
                console.log(`🤖 Campaign AI-optimized: ${campaignId} - Expected revenue increase: ${optimization.expectedRevenue}`);
            } catch (error) {
                console.log('AI campaign optimization failed, using standard creation');
            }
        }
        
        const revenueCampaign = {
            id: campaignId,
            name: optimizedCampaign.name,
            sponsorId: optimizedCampaign.sponsorId,
            
            // Revenue Configuration (AI-optimized if available)
            pricing: {
                impressionRate: this.convertToZAR(optimizedCampaign.impressionRate || 0.50, optimizedCampaign.currency || 'ZAR'),
                clickRate: this.convertToZAR(optimizedCampaign.clickRate || 2.00, optimizedCampaign.currency || 'ZAR'),
                conversionRate: this.convertToZAR(optimizedCampaign.conversionRate || 10.00, optimizedCampaign.currency || 'ZAR'),
                flatFee: this.convertToZAR(optimizedCampaign.flatFee || 0, optimizedCampaign.currency || 'ZAR')
            },
            
            // Budget and Billing
            budget: {
                total: this.convertToZAR(campaignData.budget || 0, campaignData.currency || 'ZAR'),
                spent: 0,
                remaining: this.convertToZAR(campaignData.budget || 0, campaignData.currency || 'ZAR')
            },
            
            // Performance Metrics
            metrics: {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                revenue: 0,
                profit: 0
            },
            
            // Billing Configuration
            billing: {
                model: campaignData.billingModel || 'performance', // 'performance', 'flat', 'hybrid'
                frequency: campaignData.billingFrequency || 'monthly', // 'daily', 'weekly', 'monthly'
                invoiceGenerated: false,
                lastBilled: null
            },
            
            // Campaign Lifecycle
            status: 'active',
            startDate: campaignData.startDate,
            endDate: campaignData.endDate,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.revenueData.campaigns.set(campaignId, revenueCampaign);
        await this.saveRevenueData();
        
        console.log(`💰 Revenue campaign created: ${campaignId} - R${revenueCampaign.budget.total.toFixed(2)}`);
        return revenueCampaign;
    }

    // Sponsor Revenue Tracking
    async recordSponsorImpression(sponsorId, placement, campaignId = null) {
        const campaign = campaignId ? this.revenueData.campaigns.get(campaignId) : null;
        
        if (campaign) {
            campaign.metrics.impressions++;
            const revenue = campaign.pricing.impressionRate;
            campaign.metrics.revenue += revenue;
            campaign.budget.spent += revenue;
            campaign.budget.remaining = Math.max(0, campaign.budget.total - campaign.budget.spent);
            
            await this.recordRevenueEvent('sponsor_impression', {
                sponsorId,
                placement,
                campaignId,
                revenue,
                timestamp: Date.now()
            });
            
            console.log(`📊 Impression revenue: R${revenue.toFixed(2)} from ${sponsorId}`);
        }
        
        await this.saveRevenueData();
    }

    async recordSponsorClick(sponsorId, placement, campaignId = null) {
        const campaign = campaignId ? this.revenueData.campaigns.get(campaignId) : null;
        
        if (campaign) {
            campaign.metrics.clicks++;
            const revenue = campaign.pricing.clickRate;
            campaign.metrics.revenue += revenue;
            campaign.budget.spent += revenue;
            campaign.budget.remaining = Math.max(0, campaign.budget.total - campaign.budget.spent);
            
            await this.recordRevenueEvent('sponsor_click', {
                sponsorId,
                placement,
                campaignId,
                revenue,
                timestamp: Date.now()
            });
            
            console.log(`🖱️ Click revenue: R${revenue.toFixed(2)} from ${sponsorId}`);
        }
        
        await this.saveRevenueData();
    }

    async recordSponsorConversion(sponsorId, placement, campaignId = null, conversionValue = null) {
        const campaign = campaignId ? this.revenueData.campaigns.get(campaignId) : null;
        
        if (campaign) {
            campaign.metrics.conversions++;
            const revenue = conversionValue || campaign.pricing.conversionRate;
            campaign.metrics.revenue += revenue;
            campaign.budget.spent += revenue;
            campaign.budget.remaining = Math.max(0, campaign.budget.total - campaign.budget.spent);
            
            await this.recordRevenueEvent('sponsor_conversion', {
                sponsorId,
                placement,
                campaignId,
                revenue,
                conversionValue,
                timestamp: Date.now()
            });
            
            console.log(`🎯 Conversion revenue: R${revenue.toFixed(2)} from ${sponsorId}`);
        }
        
        await this.saveRevenueData();
    }

    // Premium Features Revenue with AI Enhancement
    async recordPremiumSubscription(userId, planType, amount, currency = 'ZAR') {
        const zarAmount = this.convertToZAR(amount, currency);
        const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // AI-powered premium insights generation
        let aiInsights = null;
        if (this.aiOptimizationEnabled && this.chromeAIOptimizer && planType.includes('AI')) {
            try {
                aiInsights = await this.chromeAIOptimizer.generatePremiumInsights(
                    { userId, planType },
                    this.revenueData
                );
                
                // Record AI premium feature revenue
                this.optimizationMetrics.revenueEnhancement += 25; // R25 per AI insight
                await this.saveOptimizationMetrics();
                
                console.log(`🤖 AI Premium insights generated for ${userId}`);
            } catch (error) {
                console.log('AI insights generation failed, standard premium features active');
            }
        }
        
        const subscription = {
            id: subscriptionId,
            userId,
            planType,
            amount: zarAmount,
            originalAmount: amount,
            originalCurrency: currency,
            status: 'active',
            startDate: Date.now(),
            nextBilling: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
            createdAt: Date.now(),
            aiInsights
        };
        
        this.revenueData.streams.premiumFeatures.subscriptions.set(subscriptionId, subscription);
        this.revenueData.streams.premiumFeatures.total += zarAmount;
        this.revenueData.streams.premiumFeatures.monthly += zarAmount;
        
        await this.recordRevenueEvent('premium_subscription', {
            subscriptionId,
            userId,
            planType,
            revenue: zarAmount,
            timestamp: Date.now()
        });
        
        console.log(`💎 Premium subscription: R${zarAmount.toFixed(2)} - ${planType}`);
        await this.saveRevenueData();
        
        return subscription;
    }

    // Transaction Fees Revenue
    async recordTransactionFee(transactionType, baseAmount, feePercentage = 0.025) {
        const feeAmount = baseAmount * feePercentage;
        const netAmount = baseAmount - feeAmount;
        
        const fee = {
            id: `fee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            transactionType,
            baseAmount,
            feePercentage,
            feeAmount,
            netAmount,
            timestamp: Date.now()
        };
        
        this.revenueData.streams.transactionFees.fees.push(fee);
        this.revenueData.streams.transactionFees.total += feeAmount;
        this.revenueData.streams.transactionFees.monthly += feeAmount;
        
        await this.recordRevenueEvent('transaction_fee', {
            feeId: fee.id,
            transactionType,
            revenue: feeAmount,
            timestamp: Date.now()
        });
        
        console.log(`💳 Transaction fee: R${feeAmount.toFixed(2)} from ${transactionType}`);
        await this.saveRevenueData();
        
        return fee;
    }

    // NFT Royalties Revenue with AI Optimization
    async recordNFTRoyalty(nftId, saleAmount, royaltyPercentage = 0.05, assetData = null) {
        let optimizedRoyalty = royaltyPercentage;
        let aiOptimization = null;
        
        // AI-powered royalty optimization
        if (this.aiOptimizationEnabled && this.chromeAIOptimizer && assetData) {
            try {
                const mintingOptimization = await this.chromeAIOptimizer.optimizeMintingCost(assetData);
                
                // Adjust royalty based on AI quality assessment
                if (mintingOptimization.qualityScore > 85) {
                    optimizedRoyalty = royaltyPercentage * 1.2; // 20% increase for high quality
                } else if (mintingOptimization.qualityScore < 60) {
                    optimizedRoyalty = royaltyPercentage * 0.9; // 10% decrease for low quality
                }
                
                aiOptimization = mintingOptimization;
                this.optimizationMetrics.processedAssets++;
                this.optimizationMetrics.costSavings += mintingOptimization.costSaving;
                
                await this.saveOptimizationMetrics();
                
                console.log(`🤖 NFT royalty AI-optimized: ${nftId} - Quality: ${mintingOptimization.qualityScore}`);
            } catch (error) {
                console.log('AI royalty optimization failed, using standard rate');
            }
        }
        
        const royaltyAmount = saleAmount * optimizedRoyalty;
        
        const royalty = {
            id: `roy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            nftId,
            saleAmount,
            royaltyPercentage: optimizedRoyalty,
            royaltyAmount,
            timestamp: Date.now(),
            aiOptimization
        };
        
        this.revenueData.streams.nftRoyalties.royalties.push(royalty);
        this.revenueData.streams.nftRoyalties.total += royaltyAmount;
        this.revenueData.streams.nftRoyalties.monthly += royaltyAmount;
        
        await this.recordRevenueEvent('nft_royalty', {
            royaltyId: royalty.id,
            nftId,
            revenue: royaltyAmount,
            timestamp: Date.now()
        });
        
        console.log(`🎨 NFT royalty: R${royaltyAmount.toFixed(2)} from ${nftId}`);
        await this.saveRevenueData();
        
        return royalty;
    }

    // Revenue Analytics and Reporting
    async recordRevenueEvent(eventType, eventData) {
        const today = new Date().toDateString();
        const monthKey = this.getMonthKey();
        const yearKey = new Date().getFullYear().toString();
        
        // Daily analytics
        if (!this.revenueData.analytics.daily.has(today)) {
            this.revenueData.analytics.daily.set(today, {
                totalRevenue: 0,
                events: [],
                breakdown: {}
            });
        }
        
        const dailyData = this.revenueData.analytics.daily.get(today);
        dailyData.totalRevenue += eventData.revenue || 0;
        dailyData.events.push({ eventType, ...eventData });
        
        if (!dailyData.breakdown[eventType]) {
            dailyData.breakdown[eventType] = { count: 0, revenue: 0 };
        }
        dailyData.breakdown[eventType].count++;
        dailyData.breakdown[eventType].revenue += eventData.revenue || 0;
        
        // Monthly analytics
        if (!this.revenueData.analytics.monthly.has(monthKey)) {
            this.revenueData.analytics.monthly.set(monthKey, {
                totalRevenue: 0,
                breakdown: {}
            });
        }
        
        const monthlyData = this.revenueData.analytics.monthly.get(monthKey);
        monthlyData.totalRevenue += eventData.revenue || 0;
        
        if (!monthlyData.breakdown[eventType]) {
            monthlyData.breakdown[eventType] = { count: 0, revenue: 0 };
        }
        monthlyData.breakdown[eventType].count++;
        monthlyData.breakdown[eventType].revenue += eventData.revenue || 0;
        
        // Yearly analytics
        if (!this.revenueData.analytics.yearly.has(yearKey)) {
            this.revenueData.analytics.yearly.set(yearKey, {
                totalRevenue: 0,
                breakdown: {}
            });
        }
        
        const yearlyData = this.revenueData.analytics.yearly.get(yearKey);
        yearlyData.totalRevenue += eventData.revenue || 0;
        
        if (!yearlyData.breakdown[eventType]) {
            yearlyData.breakdown[eventType] = { count: 0, revenue: 0 };
        }
        yearlyData.breakdown[eventType].count++;
        yearlyData.breakdown[eventType].revenue += eventData.revenue || 0;
    }

    // Invoice Generation and Billing
    async generateInvoice(campaignId, billingPeriod = 'monthly') {
        const campaign = this.revenueData.campaigns.get(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        
        const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const vatAmount = campaign.metrics.revenue * this.vatRate;
        const totalAmount = campaign.metrics.revenue + vatAmount;
        
        const invoice = {
            id: invoiceId,
            campaignId,
            sponsorId: campaign.sponsorId,
            
            // Invoice Details
            invoiceNumber: this.generateInvoiceNumber(),
            issueDate: Date.now(),
            dueDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
            
            // Financial Details
            subtotal: campaign.metrics.revenue,
            vatRate: this.vatRate,
            vatAmount,
            totalAmount,
            currency: this.currency,
            
            // Performance Summary
            performance: {
                impressions: campaign.metrics.impressions,
                clicks: campaign.metrics.clicks,
                conversions: campaign.metrics.conversions,
                ctr: campaign.metrics.impressions > 0 ? 
                    ((campaign.metrics.clicks / campaign.metrics.impressions) * 100).toFixed(2) : 0,
                conversionRate: campaign.metrics.clicks > 0 ? 
                    ((campaign.metrics.conversions / campaign.metrics.clicks) * 100).toFixed(2) : 0
            },
            
            // Billing Period
            billingPeriod: {
                type: billingPeriod,
                startDate: campaign.billing.lastBilled || campaign.startDate,
                endDate: Date.now()
            },
            
            status: 'pending',
            createdAt: Date.now()
        };
        
        // Add to pending payments
        this.revenueData.payments.pending.push(invoice);
        
        // Update campaign billing status
        campaign.billing.invoiceGenerated = true;
        campaign.billing.lastBilled = Date.now();
        
        await this.saveRevenueData();
        
        console.log(`📄 Invoice generated: ${invoiceId} - R${totalAmount.toFixed(2)}`);
        return invoice;
    }

    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const sequence = String(this.revenueData.payments.pending.length + 1).padStart(4, '0');
        return `BC-${year}${month}-${sequence}`;
    }

    // AI-Enhanced Revenue Projections
    async calculateRevenueProjections() {
        const currentMonth = this.getMonthKey();
        const monthlyData = this.revenueData.analytics.monthly.get(currentMonth);
        const currentMonthRevenue = monthlyData?.totalRevenue || 0;
        
        // Calculate growth rate from previous months
        const growthRate = await this.calculateGrowthRate();
        
        // Standard projections
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const currentDay = new Date().getDate();
        const monthlyProjection = (currentMonthRevenue / currentDay) * daysInMonth;
        const quarterlyProjection = monthlyProjection * 3 * (1 + growthRate);
        const yearlyProjection = monthlyProjection * 12 * Math.pow(1 + growthRate, 12);
        
        // AI-enhanced projections
        let aiProjections = null;
        if (this.aiOptimizationEnabled && this.chromeAIOptimizer) {
            try {
                aiProjections = await this.chromeAIOptimizer.generateRevenueProjections({
                    monthly: currentMonthRevenue,
                    growthRate: growthRate * 100,
                    marketTrends: 'stable',
                    seasonality: 'none'
                });
                
                console.log('🤖 AI-enhanced revenue projections generated');
            } catch (error) {
                console.log('AI projections failed, using standard calculations');
            }
        }
        
        this.revenueData.projections = {
            monthly: monthlyProjection,
            quarterly: quarterlyProjection,
            yearly: yearlyProjection,
            growthRate,
            aiProjections,
            aiOptimizationBenefit: this.optimizationMetrics.costSavings + this.optimizationMetrics.revenueEnhancement,
            lastCalculated: Date.now()
        };
        
        await this.saveRevenueData();
        
        return this.revenueData.projections;
    }

    async calculateGrowthRate() {
        const monthlyAnalytics = Array.from(this.revenueData.analytics.monthly.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-3); // Last 3 months
        
        if (monthlyAnalytics.length < 2) return 0.05; // Default 5% growth
        
        let totalGrowth = 0;
        let growthPeriods = 0;
        
        for (let i = 1; i < monthlyAnalytics.length; i++) {
            const prevRevenue = monthlyAnalytics[i - 1][1].totalRevenue;
            const currentRevenue = monthlyAnalytics[i][1].totalRevenue;
            
            if (prevRevenue > 0) {
                const growth = (currentRevenue - prevRevenue) / prevRevenue;
                totalGrowth += growth;
                growthPeriods++;
            }
        }
        
        return growthPeriods > 0 ? totalGrowth / growthPeriods : 0.05;
    }

    // AI-Enhanced Revenue Dashboard Data
    generateRevenueDashboard() {
        const currentMonth = this.getMonthKey();
        const monthlyData = this.revenueData.analytics.monthly.get(currentMonth);
        const currentMonthRevenue = monthlyData?.totalRevenue || 0;
        
        // Get AI optimization summary
        const aiSummary = this.chromeAIOptimizer ? this.chromeAIOptimizer.getOptimizationSummary() : null;
        
        return {
            overview: {
                totalRevenue: this.getTotalRevenue(),
                monthlyRevenue: currentMonthRevenue,
                projectedMonthly: this.revenueData.projections.monthly,
                projectedYearly: this.revenueData.projections.yearly,
                currency: this.currency,
                currencySymbol: this.currencySymbol,
                aiOptimizationEnabled: this.aiOptimizationEnabled,
                aiOptimizationBenefit: this.optimizationMetrics.costSavings + this.optimizationMetrics.revenueEnhancement
            },
            
            aiOptimization: aiSummary ? {
                enabled: this.aiOptimizationEnabled,
                costSavings: this.optimizationMetrics.costSavings,
                revenueEnhancement: this.optimizationMetrics.revenueEnhancement,
                processedAssets: this.optimizationMetrics.processedAssets,
                optimizedCampaigns: this.optimizationMetrics.optimizedCampaigns,
                totalBenefit: aiSummary.totalBenefit,
                monthlyBenefit: aiSummary.costSavings.monthly + aiSummary.revenueEnhancement.monthly
            } : null,
            
            streams: {
                sponsorPlacements: {
                    revenue: this.revenueData.streams.sponsorPlacements.total,
                    percentage: this.calculateStreamPercentage('sponsorPlacements')
                },
                premiumFeatures: {
                    revenue: this.revenueData.streams.premiumFeatures.total,
                    percentage: this.calculateStreamPercentage('premiumFeatures')
                },
                transactionFees: {
                    revenue: this.revenueData.streams.transactionFees.total,
                    percentage: this.calculateStreamPercentage('transactionFees')
                },
                nftRoyalties: {
                    revenue: this.revenueData.streams.nftRoyalties.total,
                    percentage: this.calculateStreamPercentage('nftRoyalties')
                }
            },
            
            campaigns: {
                active: Array.from(this.revenueData.campaigns.values())
                    .filter(c => c.status === 'active').length,
                totalRevenue: Array.from(this.revenueData.campaigns.values())
                    .reduce((sum, c) => sum + c.metrics.revenue, 0),
                topPerforming: this.getTopPerformingCampaigns(5)
            },
            
            billing: {
                pendingInvoices: this.revenueData.payments.pending.length,
                pendingAmount: this.revenueData.payments.pending
                    .reduce((sum, inv) => sum + inv.totalAmount, 0),
                processedThisMonth: this.revenueData.payments.processed
                    .filter(p => this.isCurrentMonth(p.processedAt)).length
            }
        };
    }

    // Utility Methods
    convertToZAR(amount, fromCurrency) {
        if (fromCurrency === 'ZAR') return amount;
        const rate = this.exchangeRates.get(fromCurrency) || 1;
        return amount * rate;
    }

    getTotalRevenue() {
        return Object.values(this.revenueData.streams)
            .reduce((sum, stream) => sum + (stream.total || 0), 0);
    }

    calculateStreamPercentage(streamName) {
        const totalRevenue = this.getTotalRevenue();
        if (totalRevenue === 0) return 0;
        
        const streamRevenue = this.revenueData.streams[streamName]?.total || 0;
        return ((streamRevenue / totalRevenue) * 100).toFixed(1);
    }

    getTopPerformingCampaigns(limit = 5) {
        return Array.from(this.revenueData.campaigns.values())
            .sort((a, b) => b.metrics.revenue - a.metrics.revenue)
            .slice(0, limit)
            .map(campaign => ({
                id: campaign.id,
                name: campaign.name,
                revenue: campaign.metrics.revenue,
                impressions: campaign.metrics.impressions,
                clicks: campaign.metrics.clicks,
                ctr: campaign.metrics.impressions > 0 ? 
                    ((campaign.metrics.clicks / campaign.metrics.impressions) * 100).toFixed(2) : 0
            }));
    }

    getMonthKey() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}`;
    }

    isCurrentMonth(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    formatCurrency(amount) {
        return `${this.currencySymbol}${amount.toFixed(2)}`;
    }

    // Export and Integration with AI Metrics
    async exportRevenueReport(period = 'monthly') {
        const dashboard = this.generateRevenueDashboard();
        const projections = await this.calculateRevenueProjections();
        
        const report = {
            period,
            generatedAt: new Date().toISOString(),
            currency: this.currency,
            dashboard,
            projections,
            campaigns: Array.from(this.revenueData.campaigns.values()),
            analytics: {
                daily: Object.fromEntries(this.revenueData.analytics.daily),
                monthly: Object.fromEntries(this.revenueData.analytics.monthly),
                yearly: Object.fromEntries(this.revenueData.analytics.yearly)
            },
            aiOptimization: {
                enabled: this.aiOptimizationEnabled,
                metrics: this.optimizationMetrics,
                summary: this.chromeAIOptimizer ? this.chromeAIOptimizer.getOptimizationSummary() : null
            },
            version: this.revenueData.version
        };
        
        return report;
    }
    
    // AI Optimization Management
    async enableAIOptimization() {
        if (!this.chromeAIOptimizer) {
            await this.initializeChromeAIOptimizer();
        }
        return this.aiOptimizationEnabled;
    }
    
    async disableAIOptimization() {
        this.aiOptimizationEnabled = false;
        if (this.chromeAIOptimizer) {
            await this.chromeAIOptimizer.cleanup();
        }
        console.log('AI optimization disabled');
    }
    
    getAIOptimizationMetrics() {
        return {
            ...this.optimizationMetrics,
            enabled: this.aiOptimizationEnabled,
            summary: this.chromeAIOptimizer ? this.chromeAIOptimizer.getOptimizationSummary() : null
        };
    }
    
    // Cleanup
    async cleanup() {
        if (this.chromeAIOptimizer) {
            await this.chromeAIOptimizer.cleanup();
        }
        console.log('Revenue Management System cleaned up');
    }
}

window.RevenueManagementSystem = RevenueManagementSystem;