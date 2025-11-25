/**
 * Campaign Manager - Sponsor Campaign Management System
 * Handles campaign creation, scheduling, and performance tracking
 */

class CampaignManager {
    constructor() {
        this.campaigns = new Map();
        this.isInitialized = false;
        this.budgetTracking = new Map();
        this.performanceMetrics = new Map();
        this.sponsorDependencies = new Map();
    }

    async initialize() {
        await this.loadCampaigns();
        await this.loadBudgetTracking();
        await this.loadPerformanceMetrics();
        await this.loadSponsorDependencies();
        this.isInitialized = true;
        console.log('✅ Campaign Manager initialized with Method 3 enhancements');
    }

    async loadCampaigns() {
        try {
            const result = await chrome.storage.local.get(['campaigns']);
            const campaignsData = result.campaigns || {};
            
            this.campaigns.clear();
            Object.entries(campaignsData).forEach(([id, campaign]) => {
                // Ensure campaign has Method 3 enhancements
                const enhancedCampaign = {
                    ...campaign,
                    dailyBudgetLimit: campaign.dailyBudgetLimit || 0,
                    totalSpend: campaign.totalSpend || 0,
                    roi: campaign.roi || 0,
                    targeting: campaign.targeting || {},
                    schedule: campaign.schedule || { type: 'continuous' },
                    performance: campaign.performance || {
                        impressions: 0,
                        clicks: 0,
                        conversions: 0,
                        revenue: 0
                    }
                };
                this.campaigns.set(id, enhancedCampaign);
            });
        } catch (error) {
            console.error('Failed to load campaigns:', error);
        }
    }

    async saveCampaigns() {
        try {
            const campaignsData = Object.fromEntries(this.campaigns);
            await chrome.storage.local.set({ campaigns: campaignsData });
            
            // Save enhanced data
            await this.saveBudgetTracking();
            await this.savePerformanceMetrics();
            await this.saveSponsorDependencies();
        } catch (error) {
            console.error('Failed to save campaigns:', error);
            throw error;
        }
    }

    validateCampaignData(data) {
        const errors = [];
        
        // Sanitize inputs
        const sanitizedData = this.sanitizeCampaignData(data);
        
        // Name validation
        if (!sanitizedData.name?.trim()) errors.push('Campaign name is required');
        if (sanitizedData.name?.length > 100) errors.push('Campaign name must be 100 characters or less');
        
        // Sponsor validation
        if (!sanitizedData.sponsorId) errors.push('Sponsor selection is required');
        if (!sanitizedData.placement) errors.push('Placement selection is required');
        
        // Date validation
        if (!sanitizedData.startDate) errors.push('Start date is required');
        if (!sanitizedData.endDate) errors.push('End date is required');
        
        if (sanitizedData.startDate && sanitizedData.endDate) {
            const startDate = new Date(sanitizedData.startDate);
            const endDate = new Date(sanitizedData.endDate);
            
            if (isNaN(startDate.getTime())) errors.push('Invalid start date format');
            if (isNaN(endDate.getTime())) errors.push('Invalid end date format');
            
            if (startDate >= endDate) {
                errors.push('End date must be after start date');
            }
            
            // Check if start date is in the past (allow 1 hour buffer)
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            if (startDate < oneHourAgo) {
                errors.push('Start date cannot be in the past');
            }
        }
        
        // Budget validation
        if (sanitizedData.budget !== undefined && sanitizedData.budget !== '') {
            const budget = parseFloat(sanitizedData.budget);
            if (isNaN(budget) || budget < 0) {
                errors.push('Budget must be a positive number');
            }
            if (budget > 1000000) {
                errors.push('Budget cannot exceed R1,000,000');
            }
        }
        
        // Daily budget validation
        if (sanitizedData.dailyBudgetLimit !== undefined && sanitizedData.dailyBudgetLimit !== '') {
            const dailyBudget = parseFloat(sanitizedData.dailyBudgetLimit);
            if (isNaN(dailyBudget) || dailyBudget < 0) {
                errors.push('Daily budget limit must be a positive number');
            }
            
            const totalBudget = parseFloat(sanitizedData.budget) || 0;
            if (totalBudget > 0 && dailyBudget > totalBudget) {
                errors.push('Daily budget limit cannot exceed total budget');
            }
        }
        
        // Schedule validation
        if (sanitizedData.schedule?.type) {
            const validScheduleTypes = ['continuous', 'scheduled', 'burst'];
            if (!validScheduleTypes.includes(sanitizedData.schedule.type)) {
                errors.push('Invalid schedule type');
            }
        }
        
        return errors;
    }
    
    sanitizeCampaignData(data) {
        const sanitize = (text) => {
            if (!text) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .trim()
                .substring(0, 200);
        };
        
        return {
            name: sanitize(data.name),
            sponsorId: sanitize(data.sponsorId),
            placement: sanitize(data.placement),
            startDate: data.startDate,
            endDate: data.endDate,
            budget: data.budget,
            dailyBudgetLimit: data.dailyBudgetLimit,
            schedule: data.schedule || { type: 'continuous' },
            targeting: data.targeting || {}
        };
    }

    async createCampaign(campaignData) {
        const errors = this.validateCampaignData(campaignData);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Sanitize and validate data
        const sanitizedData = this.sanitizeCampaignData(campaignData);
        
        const campaign = {
            id: campaignId,
            name: sanitizedData.name.trim(),
            sponsorId: sanitizedData.sponsorId,
            placement: sanitizedData.placement || 'after_isrc',
            startDate: sanitizedData.startDate,
            endDate: sanitizedData.endDate,
            budget: parseFloat(sanitizedData.budget) || 0,
            dailyBudgetLimit: parseFloat(sanitizedData.dailyBudgetLimit) || 0,
            status: 'scheduled',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            totalSpend: 0,
            roi: 0,
            targeting: sanitizedData.targeting || {},
            schedule: sanitizedData.schedule || { type: 'continuous' },
            metrics: {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                spend: 0
            },
            performance: {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                revenue: 0,
                ctr: 0,
                conversionRate: 0
            }
        };

        this.campaigns.set(campaignId, campaign);
        
        // Initialize budget tracking
        this.budgetTracking.set(campaignId, {
            dailySpend: {},
            totalSpend: 0,
            budgetAlerts: []
        });
        
        // Update sponsor dependencies
        this.updateSponsorDependencies(campaignData.sponsorId, campaignId, 'add');
        
        await this.saveCampaigns();
        
        return campaign;
    }

    async updateCampaign(campaignId, updates) {
        const campaign = this.campaigns.get(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        // Sanitize updates
        const sanitizedUpdates = this.sanitizeCampaignData(updates);
        const updatedData = { ...campaign, ...sanitizedUpdates };
        
        const errors = this.validateCampaignData(updatedData);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        updatedData.updatedAt = Date.now();
        
        // Update sponsor dependencies if sponsor changed
        if (updates.sponsorId && updates.sponsorId !== campaign.sponsorId) {
            this.updateSponsorDependencies(campaign.sponsorId, campaignId, 'remove');
            this.updateSponsorDependencies(updates.sponsorId, campaignId, 'add');
        }
        
        this.campaigns.set(campaignId, updatedData);
        await this.saveCampaigns();
        
        return updatedData;
    }

    async deleteCampaign(campaignId) {
        if (!this.campaigns.has(campaignId)) {
            throw new Error('Campaign not found');
        }

        const campaign = this.campaigns.get(campaignId);
        
        // Clean up related data
        this.budgetTracking.delete(campaignId);
        this.performanceMetrics.delete(campaignId);
        
        // Update sponsor dependencies
        if (campaign.sponsorId) {
            this.updateSponsorDependencies(campaign.sponsorId, campaignId, 'remove');
        }
        
        this.campaigns.delete(campaignId);
        await this.saveCampaigns();
    }

    getCampaign(campaignId) {
        return this.campaigns.get(campaignId);
    }

    getAllCampaigns() {
        try {
            if (!this.campaigns || typeof this.campaigns.values !== 'function') {
                console.warn('Campaign storage not properly initialized');
                return [];
            }
            
            return Array.from(this.campaigns.values()).map(campaign => {
                // Ensure all campaigns have proper structure with safe fallbacks
                if (!campaign || typeof campaign !== 'object') {
                    console.warn('Invalid campaign object found:', campaign);
                    return {
                        id: 'invalid_' + Date.now(),
                        name: 'Invalid Campaign',
                        status: 'error',
                        metrics: { impressions: 0, clicks: 0, conversions: 0, spend: 0 },
                        sponsorId: 'unknown',
                        startDate: new Date().toISOString(),
                        endDate: new Date().toISOString(),
                        budget: 0
                    };
                }
                
                return {
                    ...campaign,
                    metrics: campaign.metrics || { impressions: 0, clicks: 0, conversions: 0, spend: 0 },
                    status: campaign.status || 'scheduled',
                    name: campaign.name || 'Untitled Campaign',
                    sponsorId: campaign.sponsorId || 'unknown',
                    startDate: campaign.startDate || new Date().toISOString(),
                    endDate: campaign.endDate || new Date().toISOString(),
                    budget: campaign.budget || 0
                };
            });
        } catch (error) {
            console.error('Error in getAllCampaigns:', error);
            return [];
        }
    }

    getActiveCampaigns() {
        const now = Date.now();
        return this.getAllCampaigns().filter(campaign => {
            const startTime = new Date(campaign.startDate).getTime();
            const endTime = new Date(campaign.endDate).getTime();
            return campaign.status === 'active' && now >= startTime && now <= endTime;
        });
    }

    async recordImpression(campaignId) {
        try {
            const campaign = this.campaigns.get(campaignId);
            if (campaign) {
                // Ensure metrics object exists
                if (!campaign.metrics) {
                    campaign.metrics = { impressions: 0, clicks: 0, conversions: 0, spend: 0 };
                }
                campaign.metrics.impressions++;
                campaign.updatedAt = Date.now();
                await this.saveCampaigns();
            }
        } catch (error) {
            console.error('Failed to record impression:', error);
        }
    }

    async recordClick(campaignId) {
        try {
            const campaign = this.campaigns.get(campaignId);
            if (campaign) {
                // Ensure metrics object exists
                if (!campaign.metrics) {
                    campaign.metrics = { impressions: 0, clicks: 0, conversions: 0, spend: 0 };
                }
                campaign.metrics.clicks++;
                campaign.updatedAt = Date.now();
                await this.saveCampaigns();
            }
        } catch (error) {
            console.error('Failed to record click:', error);
        }
    }

    generateCampaignHTML(campaign) {
        // Graceful fallback for campaign metrics
        const metrics = campaign.metrics || { impressions: 0, clicks: 0, conversions: 0, spend: 0 };
        
        const statusColor = {
            'scheduled': '#ffc107',
            'active': '#28a745',
            'paused': '#6c757d',
            'completed': '#17a2b8',
            'cancelled': '#dc3545'
        }[campaign.status] || '#6c757d';

        return `
            <div class="campaign-card" data-campaign-id="${campaign.id}">
                <div class="campaign-header">
                    <div class="campaign-title">
                        <h6>${campaign.name || 'Untitled Campaign'}</h6>
                        <span class="campaign-status" style="background-color: ${statusColor}">${campaign.status || 'unknown'}</span>
                    </div>
                    <div class="campaign-actions">
                        <button class="btn-small btn-secondary edit-campaign" data-campaign-id="${campaign.id}">✏️</button>
                        <button class="btn-small btn-danger delete-campaign" data-campaign-id="${campaign.id}">🗑️</button>
                    </div>
                </div>
                
                <div class="campaign-details">
                    <div class="campaign-info">
                        <small>Sponsor: ${campaign.sponsorId || 'Unknown'}</small>
                        <small>Period: ${campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'TBD'} - ${campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'TBD'}</small>
                        <small>Budget: $${campaign.budget || 0}</small>
                    </div>
                    
                    <div class="campaign-metrics">
                        <div class="metric-item">
                            <span class="metric-value">${metrics.impressions}</span>
                            <span class="metric-label">Impressions</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">${metrics.clicks}</span>
                            <span class="metric-label">Clicks</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">${metrics.clicks > 0 && metrics.impressions > 0 ? ((metrics.clicks / metrics.impressions) * 100).toFixed(1) : 0}%</span>
                            <span class="metric-label">CTR</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCampaignFormHTML(campaign = null, sponsors = {}) {
        const isEdit = !!campaign;
        
        return `
            <div class="campaign-form-overlay">
                <div class="campaign-form-modal">
                    <div class="form-header">
                        <h5>${isEdit ? 'Edit Campaign' : 'Create Enhanced Campaign'}</h5>
                        <button class="close-form-btn" type="button">✕</button>
                    </div>
                    
                    <form id="campaign-form" class="campaign-form">
                        <div class="form-row">
                            <label for="campaign-name">Campaign Name *</label>
                            <input type="text" id="campaign-name" class="form-input" 
                                   value="${campaign?.name || ''}" maxlength="100" required>
                            <small class="field-help">Max 100 characters</small>
                        </div>
                        
                        <div class="form-row">
                            <label for="campaign-sponsor">Sponsor *</label>
                            <select id="campaign-sponsor" class="form-input" required>
                                <option value="">Select Sponsor</option>
                                ${Object.entries(sponsors).map(([key, sponsor]) => 
                                    `<option value="${key}" ${campaign?.sponsorId === key ? 'selected' : ''}>${sponsor.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <label for="campaign-placement">Placement *</label>
                            <select id="campaign-placement" class="form-input" required>
                                <option value="">Select Placement</option>
                                <optgroup label="Radio System Placements">
                                    <option value="after_isrc" ${campaign?.placement === 'after_isrc' ? 'selected' : ''}>After ISRC Generation</option>
                                    <option value="validation" ${campaign?.placement === 'validation' ? 'selected' : ''}>After Validation</option>
                                    <option value="before_package" ${campaign?.placement === 'before_package' ? 'selected' : ''}>Before Package Generation</option>
                                    <option value="post_package" ${campaign?.placement === 'post_package' ? 'selected' : ''}>After Package Complete</option>
                                    <option value="during_download" ${campaign?.placement === 'during_download' ? 'selected' : ''}>During Download</option>
                                </optgroup>
                                <optgroup label="Mint/NFT System Placements">
                                    <option value="before_mint_nft" ${campaign?.placement === 'before_mint_nft' ? 'selected' : ''}>Before Mint NFT</option>
                                    <option value="after_minting" ${campaign?.placement === 'after_minting' ? 'selected' : ''}>After NFT Minting</option>
                                    <option value="ipfs_upload" ${campaign?.placement === 'ipfs_upload' ? 'selected' : ''}>During IPFS Upload</option>
                                    <option value="metadata_creation" ${campaign?.placement === 'metadata_creation' ? 'selected' : ''}>After Metadata Creation</option>
                                </optgroup>
                                <optgroup label="Cross-Platform Placements">
                                    <option value="licensing_proceed" ${campaign?.placement === 'licensing_proceed' ? 'selected' : ''}>Proceed to Licensing</option>
                                    <option value="analytics_view" ${campaign?.placement === 'analytics_view' ? 'selected' : ''}>Analytics Dashboard</option>
                                    <option value="profile_view" ${campaign?.placement === 'profile_view' ? 'selected' : ''}>Profile Section</option>
                                </optgroup>
                            </select>
                            <small class="field-help">Choose where the sponsor content will appear</small>
                        </div>
                        
                        <div class="form-grid-two-col">
                            <div class="form-row">
                                <label for="campaign-start-date">Start Date *</label>
                                <input type="datetime-local" id="campaign-start-date" class="form-input" 
                                       value="${campaign ? new Date(campaign.startDate).toISOString().slice(0, 16) : ''}" required>
                            </div>
                            
                            <div class="form-row">
                                <label for="campaign-end-date">End Date *</label>
                                <input type="datetime-local" id="campaign-end-date" class="form-input" 
                                       value="${campaign ? new Date(campaign.endDate).toISOString().slice(0, 16) : ''}" required>
                            </div>
                        </div>
                        
                        <div class="form-grid-two-col">
                            <div class="form-row">
                                <label for="campaign-budget">Total Budget (R)</label>
                                <input type="number" id="campaign-budget" class="form-input" 
                                       value="${campaign?.budget || ''}" min="0" step="0.01">
                                <small class="field-help">Total campaign budget</small>
                            </div>
                            
                            <div class="form-row">
                                <label for="campaign-daily-budget">Daily Limit (R)</label>
                                <input type="number" id="campaign-daily-budget" class="form-input" 
                                       value="${campaign?.dailyBudgetLimit || ''}" min="0" step="0.01">
                                <small class="field-help">Daily spending limit</small>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <label for="campaign-schedule">Schedule Type</label>
                            <select id="campaign-schedule" class="form-input">
                                <option value="continuous" ${campaign?.schedule?.type === 'continuous' ? 'selected' : ''}>Continuous</option>
                                <option value="scheduled" ${campaign?.schedule?.type === 'scheduled' ? 'selected' : ''}>Scheduled Hours</option>
                                <option value="burst" ${campaign?.schedule?.type === 'burst' ? 'selected' : ''}>Burst Campaign</option>
                            </select>
                            <small class="field-help">Campaign scheduling strategy</small>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary cancel-campaign-btn">Cancel</button>
                            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Campaign' : 'Create Enhanced Campaign'}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
    // Method 3 Enhanced Features
    
    async loadBudgetTracking() {
        try {
            const result = await chrome.storage.local.get(['campaign_budgets']);
            const budgetData = result.campaign_budgets || {};
            
            this.budgetTracking.clear();
            Object.entries(budgetData).forEach(([id, budget]) => {
                this.budgetTracking.set(id, budget);
            });
        } catch (error) {
            console.error('Failed to load budget tracking:', error);
        }
    }
    
    async saveBudgetTracking() {
        try {
            const budgetData = Object.fromEntries(this.budgetTracking);
            await chrome.storage.local.set({ campaign_budgets: budgetData });
        } catch (error) {
            console.error('Failed to save budget tracking:', error);
        }
    }
    
    async loadPerformanceMetrics() {
        try {
            const result = await chrome.storage.local.get(['campaign_performance']);
            const performanceData = result.campaign_performance || {};
            
            this.performanceMetrics.clear();
            Object.entries(performanceData).forEach(([id, metrics]) => {
                this.performanceMetrics.set(id, metrics);
            });
        } catch (error) {
            console.error('Failed to load performance metrics:', error);
        }
    }
    
    async savePerformanceMetrics() {
        try {
            const performanceData = Object.fromEntries(this.performanceMetrics);
            await chrome.storage.local.set({ campaign_performance: performanceData });
        } catch (error) {
            console.error('Failed to save performance metrics:', error);
        }
    }
    
    async loadSponsorDependencies() {
        try {
            const result = await chrome.storage.local.get(['sponsor_dependencies']);
            const dependencyData = result.sponsor_dependencies || {};
            
            this.sponsorDependencies.clear();
            Object.entries(dependencyData).forEach(([sponsorId, campaigns]) => {
                this.sponsorDependencies.set(sponsorId, new Set(campaigns));
            });
        } catch (error) {
            console.error('Failed to load sponsor dependencies:', error);
        }
    }
    
    async saveSponsorDependencies() {
        try {
            const dependencyData = {};
            this.sponsorDependencies.forEach((campaigns, sponsorId) => {
                dependencyData[sponsorId] = Array.from(campaigns);
            });
            await chrome.storage.local.set({ sponsor_dependencies: dependencyData });
        } catch (error) {
            console.error('Failed to save sponsor dependencies:', error);
        }
    }
    
    updateSponsorDependencies(sponsorId, campaignId, action) {
        if (!this.sponsorDependencies.has(sponsorId)) {
            this.sponsorDependencies.set(sponsorId, new Set());
        }
        
        const campaigns = this.sponsorDependencies.get(sponsorId);
        if (action === 'add') {
            campaigns.add(campaignId);
        } else if (action === 'remove') {
            campaigns.delete(campaignId);
        }
    }
    
    async createEnhancedCampaign(campaignData) {
        const errors = this.validateCampaignData(campaignData);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Sanitize and validate data
        const sanitizedData = this.sanitizeCampaignData(campaignData);
        
        const campaign = {
            id: campaignId,
            name: sanitizedData.name.trim(),
            sponsorId: sanitizedData.sponsorId,
            placement: sanitizedData.placement || 'after_isrc',
            startDate: sanitizedData.startDate,
            endDate: sanitizedData.endDate,
            budget: parseFloat(sanitizedData.budget) || 0,
            dailyBudgetLimit: parseFloat(sanitizedData.dailyBudgetLimit) || 0,
            status: 'scheduled',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            totalSpend: 0,
            roi: 0,
            targeting: sanitizedData.targeting || {
                placements: [sanitizedData.placement],
                demographics: {},
                behavioral: {}
            },
            schedule: sanitizedData.schedule || { 
                type: 'continuous',
                hours: null,
                timezone: 'Africa/Johannesburg'
            },
            metrics: {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                spend: 0
            },
            performance: {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                revenue: 0,
                ctr: 0,
                conversionRate: 0,
                costPerClick: 0,
                costPerConversion: 0
            }
        };

        this.campaigns.set(campaignId, campaign);
        
        // Initialize enhanced tracking
        this.budgetTracking.set(campaignId, {
            dailySpend: {},
            totalSpend: 0,
            budgetAlerts: [],
            spendHistory: []
        });
        
        this.performanceMetrics.set(campaignId, {
            hourlyMetrics: {},
            dailyMetrics: {},
            placementMetrics: {},
            lastUpdated: Date.now()
        });
        
        // Update sponsor dependencies
        this.updateSponsorDependencies(campaignData.sponsorId, campaignId, 'add');
        
        await this.saveCampaigns();
        
        return campaign;
    }
    
    async setBudget(campaignId, budget, dailyLimit = 0) {
        const campaign = this.campaigns.get(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        
        campaign.budget = parseFloat(budget) || 0;
        campaign.dailyBudgetLimit = parseFloat(dailyLimit) || 0;
        campaign.updatedAt = Date.now();
        
        // Update budget tracking
        const budgetTracking = this.budgetTracking.get(campaignId) || {
            dailySpend: {},
            totalSpend: 0,
            budgetAlerts: [],
            spendHistory: []
        };
        
        budgetTracking.budgetAlerts.push({
            type: 'budget_updated',
            timestamp: Date.now(),
            oldBudget: campaign.budget,
            newBudget: budget,
            dailyLimit: dailyLimit
        });
        
        this.budgetTracking.set(campaignId, budgetTracking);
        
        await this.saveCampaigns();
        
        return campaign;
    }
    
    async recordSpend(campaignId, amount, type = 'impression') {
        const campaign = this.campaigns.get(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        
        const spendAmount = parseFloat(amount) || 0;
        const today = new Date().toDateString();
        
        // Get budget tracking
        const budgetTracking = this.budgetTracking.get(campaignId) || {
            dailySpend: {},
            totalSpend: 0,
            budgetAlerts: [],
            spendHistory: []
        };
        
        // Check daily budget limit
        const todaySpend = budgetTracking.dailySpend[today] || 0;
        if (campaign.dailyBudgetLimit > 0 && (todaySpend + spendAmount) > campaign.dailyBudgetLimit) {
            throw new Error(`Daily budget limit exceeded. Limit: R${campaign.dailyBudgetLimit}, Current: R${todaySpend}`);
        }
        
        // Check total budget
        if (campaign.budget > 0 && (budgetTracking.totalSpend + spendAmount) > campaign.budget) {
            throw new Error(`Total budget limit exceeded. Budget: R${campaign.budget}, Spent: R${budgetTracking.totalSpend}`);
        }
        
        // Record spend
        budgetTracking.dailySpend[today] = todaySpend + spendAmount;
        budgetTracking.totalSpend += spendAmount;
        budgetTracking.spendHistory.push({
            timestamp: Date.now(),
            amount: spendAmount,
            type: type,
            date: today
        });
        
        // Update campaign metrics
        campaign.totalSpend = budgetTracking.totalSpend;
        campaign.metrics.spend += spendAmount;
        campaign.updatedAt = Date.now();
        
        this.budgetTracking.set(campaignId, budgetTracking);
        
        await this.saveCampaigns();
        
        return {
            success: true,
            totalSpend: budgetTracking.totalSpend,
            dailySpend: budgetTracking.dailySpend[today],
            remainingBudget: campaign.budget - budgetTracking.totalSpend,
            remainingDaily: campaign.dailyBudgetLimit - budgetTracking.dailySpend[today]
        };
    }
    
    calculateCampaignROI(campaignId) {
        const campaign = this.campaigns.get(campaignId);
        if (!campaign) {
            return { roi: 0, error: 'Campaign not found' };
        }
        
        const budgetTracking = this.budgetTracking.get(campaignId);
        const totalSpend = budgetTracking?.totalSpend || 0;
        const revenue = campaign.performance?.revenue || 0;
        
        if (totalSpend === 0) {
            return { roi: 0, revenue: revenue, spend: totalSpend, status: 'no_spend' };
        }
        
        const roi = ((revenue - totalSpend) / totalSpend) * 100;
        
        // Update campaign ROI
        campaign.roi = roi;
        campaign.updatedAt = Date.now();
        
        return {
            roi: Math.round(roi * 100) / 100,
            revenue: revenue,
            spend: totalSpend,
            profit: revenue - totalSpend,
            status: roi > 0 ? 'profitable' : 'loss'
        };
    }
    
    async checkSponsorDependencies(sponsorId) {
        const dependencies = this.sponsorDependencies.get(sponsorId) || new Set();
        const activeCampaigns = [];
        const scheduledCampaigns = [];
        
        dependencies.forEach(campaignId => {
            const campaign = this.campaigns.get(campaignId);
            if (campaign) {
                if (campaign.status === 'active') {
                    activeCampaigns.push({
                        id: campaign.id,
                        name: campaign.name,
                        status: campaign.status,
                        budget: campaign.budget,
                        spend: campaign.totalSpend || 0
                    });
                } else if (campaign.status === 'scheduled') {
                    scheduledCampaigns.push({
                        id: campaign.id,
                        name: campaign.name,
                        status: campaign.status,
                        startDate: campaign.startDate
                    });
                }
            }
        });
        
        return {
            activeCampaigns,
            scheduledCampaigns,
            totalCampaigns: dependencies.size,
            canDelete: activeCampaigns.length === 0
        };
    }
    
    async deleteSponsor(sponsorId) {
        // 1. Check dependencies FIRST
        const dependencies = await this.checkSponsorDependencies(sponsorId);
        if (dependencies.activeCampaigns.length > 0) {
            throw new Error(`Cannot delete sponsor. Active campaigns: ${dependencies.activeCampaigns.map(c => c.name).join(', ')}`);
        }
        
        if (dependencies.scheduledCampaigns.length > 0) {
            const proceed = confirm(`This sponsor has ${dependencies.scheduledCampaigns.length} scheduled campaigns. Delete anyway?`);
            if (!proceed) {
                throw new Error('Sponsor deletion cancelled by user');
            }
        }
        
        // 2. Safe deletion process
        try {
            // Delete all associated campaigns
            const campaignIds = Array.from(dependencies.activeCampaigns.concat(dependencies.scheduledCampaigns).map(c => c.id));
            for (const campaignId of campaignIds) {
                await this.deleteCampaign(campaignId);
            }
            
            // Clean up sponsor assets if IPFS manager available
            if (window.IPFSAssetManager) {
                await this.cleanupSponsorAssets(sponsorId);
            }
            
            // Remove from sponsor templates (admin dashboard will handle this)
            await this.removeSponsorFromTemplates(sponsorId);
            
            // Update IPFS manifest if available
            if (window.IPFSAssetManager) {
                await this.updateIPFSManifest();
            }
            
            // Clean up dependencies
            this.sponsorDependencies.delete(sponsorId);
            await this.saveSponsorDependencies();
            
            return {
                success: true,
                deletedCampaigns: campaignIds.length,
                message: `Sponsor deleted successfully. ${campaignIds.length} campaigns removed.`
            };
            
        } catch (error) {
            console.error('Sponsor deletion failed:', error);
            throw new Error(`Sponsor deletion failed: ${error.message}`);
        }
    }
    
    async cleanupSponsorAssets(sponsorId) {
        try {
            const key = `sponsor_assets_${sponsorId}`;
            await chrome.storage.local.remove([key]);
        } catch (error) {
            console.warn('Failed to cleanup sponsor assets:', error);
        }
    }
    
    async removeSponsorFromTemplates(sponsorId) {
        try {
            const result = await chrome.storage.local.get(['sponsor_config']);
            const sponsorConfig = result.sponsor_config || {};
            
            if (sponsorConfig.templates && sponsorConfig.templates[sponsorId]) {
                delete sponsorConfig.templates[sponsorId];
                
                // Update current sponsor if it was the deleted one
                if (sponsorConfig.currentSponsor === sponsorId) {
                    const remainingSponsors = Object.keys(sponsorConfig.templates);
                    sponsorConfig.currentSponsor = remainingSponsors.length > 0 ? remainingSponsors[0] : 'default';
                }
                
                await chrome.storage.local.set({ sponsor_config: sponsorConfig });
            }
        } catch (error) {
            console.warn('Failed to remove sponsor from templates:', error);
        }
    }
    
    async updateIPFSManifest() {
        try {
            if (window.AdminDashboardManager && window.AdminDashboardManager.generateIPFSManifest) {
                await window.AdminDashboardManager.generateIPFSManifest();
            }
        } catch (error) {
            console.warn('Failed to update IPFS manifest:', error);
        }
    }
    
    getPerformanceAnalytics(campaignId) {
        const campaign = this.campaigns.get(campaignId);
        if (!campaign) {
            return null;
        }
        
        const performance = campaign.performance || {};
        const metrics = campaign.metrics || {};
        
        return {
            impressions: performance.impressions || metrics.impressions || 0,
            clicks: performance.clicks || metrics.clicks || 0,
            conversions: performance.conversions || metrics.conversions || 0,
            revenue: performance.revenue || 0,
            ctr: performance.impressions > 0 ? (performance.clicks / performance.impressions * 100) : 0,
            conversionRate: performance.clicks > 0 ? (performance.conversions / performance.clicks * 100) : 0,
            costPerClick: performance.clicks > 0 ? (campaign.totalSpend / performance.clicks) : 0,
            costPerConversion: performance.conversions > 0 ? (campaign.totalSpend / performance.conversions) : 0,
            roi: this.calculateCampaignROI(campaignId)
        };
    }
    
    async recordConversion(campaignId, revenue = 0) {
        try {
            const campaign = this.campaigns.get(campaignId);
            if (campaign) {
                if (!campaign.performance) {
                    campaign.performance = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
                }
                if (!campaign.metrics) {
                    campaign.metrics = { impressions: 0, clicks: 0, conversions: 0, spend: 0 };
                }
                
                campaign.performance.conversions++;
                campaign.metrics.conversions++;
                campaign.performance.revenue += parseFloat(revenue) || 0;
                campaign.updatedAt = Date.now();
                
                // Update performance metrics
                const performanceMetrics = this.performanceMetrics.get(campaignId) || {
                    hourlyMetrics: {},
                    dailyMetrics: {},
                    placementMetrics: {},
                    lastUpdated: Date.now()
                };
                
                const today = new Date().toDateString();
                if (!performanceMetrics.dailyMetrics[today]) {
                    performanceMetrics.dailyMetrics[today] = { conversions: 0, revenue: 0 };
                }
                performanceMetrics.dailyMetrics[today].conversions++;
                performanceMetrics.dailyMetrics[today].revenue += parseFloat(revenue) || 0;
                performanceMetrics.lastUpdated = Date.now();
                
                this.performanceMetrics.set(campaignId, performanceMetrics);
                
                await this.saveCampaigns();
            }
        } catch (error) {
            console.error('Failed to record conversion:', error);
        }
    }
}

window.CampaignManager = CampaignManager;