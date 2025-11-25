/**
 * Revenue Dashboard UI - Comprehensive Revenue Management Interface
 * Integrates with admin dashboard following BeatsChain design system
 */

class RevenueDashboardUI {
    constructor(revenueManagementSystem) {
        this.revenueSystem = revenueManagementSystem;
        this.refreshInterval = null;
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;
        console.log('✅ Revenue Dashboard UI initialized');
    }

    // Generate Revenue Dashboard HTML
    generateRevenueDashboardHTML() {
        if (!this.revenueSystem?.isInitialized) {
            return '<div class="revenue-loading">Loading revenue data...</div>';
        }

        const dashboard = this.revenueSystem.generateRevenueDashboard();
        
        return `
            <div class="revenue-dashboard">
                ${this.generateRevenueOverviewHTML(dashboard.overview)}
                ${this.generateRevenueStreamsHTML(dashboard.streams)}
                ${this.generateCampaignPerformanceHTML(dashboard.campaigns)}
                ${this.generateBillingStatusHTML(dashboard.billing)}
                ${this.generateRevenueChartsHTML(dashboard)}
                ${this.generateRevenueActionsHTML()}
            </div>
        `;
    }

    generateRevenueOverviewHTML(overview) {
        const aiOptimizationCard = overview.aiOptimizationEnabled ? `
            <div class="revenue-stat-card ai-optimization">
                <div class="stat-icon">🤖</div>
                <div class="stat-content">
                    <div class="stat-value">${overview.currencySymbol}${(overview.aiOptimizationBenefit || 0).toFixed(2)}</div>
                    <div class="stat-label">AI Optimization Benefit</div>
                </div>
            </div>
        ` : '';
        
        return `
            <div class="revenue-overview">
                <h4>💰 Revenue Overview ${overview.aiOptimizationEnabled ? '🤖' : ''}</h4>
                <div class="revenue-stats-grid">
                    <div class="revenue-stat-card total-revenue">
                        <div class="stat-icon">💎</div>
                        <div class="stat-content">
                            <div class="stat-value">${overview.currencySymbol}${overview.totalRevenue.toFixed(2)}</div>
                            <div class="stat-label">Total Revenue</div>
                        </div>
                    </div>
                    
                    <div class="revenue-stat-card monthly-revenue">
                        <div class="stat-icon">📅</div>
                        <div class="stat-content">
                            <div class="stat-value">${overview.currencySymbol}${overview.monthlyRevenue.toFixed(2)}</div>
                            <div class="stat-label">This Month</div>
                        </div>
                    </div>
                    
                    <div class="revenue-stat-card projected-monthly">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <div class="stat-value">${overview.currencySymbol}${overview.projectedMonthly.toFixed(2)}</div>
                            <div class="stat-label">Projected Monthly</div>
                        </div>
                    </div>
                    
                    <div class="revenue-stat-card projected-yearly">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-value">${overview.currencySymbol}${(overview.projectedYearly / 1000).toFixed(1)}K</div>
                            <div class="stat-label">Projected Yearly</div>
                        </div>
                    </div>
                    
                    ${aiOptimizationCard}
                </div>
            </div>
        `;
    }

    generateRevenueStreamsHTML(streams) {
        return `
            <div class="revenue-streams">
                <h5>💸 Revenue Streams</h5>
                <div class="streams-grid">
                    <div class="stream-card sponsor-placements">
                        <div class="stream-header">
                            <span class="stream-icon">📢</span>
                            <span class="stream-name">Sponsor Placements</span>
                        </div>
                        <div class="stream-metrics">
                            <div class="stream-revenue">R${streams.sponsorPlacements.revenue.toFixed(2)}</div>
                            <div class="stream-percentage">${streams.sponsorPlacements.percentage}%</div>
                        </div>
                        <div class="stream-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${streams.sponsorPlacements.percentage}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stream-card premium-features">
                        <div class="stream-header">
                            <span class="stream-icon">⭐</span>
                            <span class="stream-name">Premium Features</span>
                        </div>
                        <div class="stream-metrics">
                            <div class="stream-revenue">R${streams.premiumFeatures.revenue.toFixed(2)}</div>
                            <div class="stream-percentage">${streams.premiumFeatures.percentage}%</div>
                        </div>
                        <div class="stream-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${streams.premiumFeatures.percentage}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stream-card transaction-fees">
                        <div class="stream-header">
                            <span class="stream-icon">💳</span>
                            <span class="stream-name">Transaction Fees</span>
                        </div>
                        <div class="stream-metrics">
                            <div class="stream-revenue">R${streams.transactionFees.revenue.toFixed(2)}</div>
                            <div class="stream-percentage">${streams.transactionFees.percentage}%</div>
                        </div>
                        <div class="stream-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${streams.transactionFees.percentage}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stream-card nft-royalties">
                        <div class="stream-header">
                            <span class="stream-icon">🎨</span>
                            <span class="stream-name">NFT Royalties</span>
                        </div>
                        <div class="stream-metrics">
                            <div class="stream-revenue">R${streams.nftRoyalties.revenue.toFixed(2)}</div>
                            <div class="stream-percentage">${streams.nftRoyalties.percentage}%</div>
                        </div>
                        <div class="stream-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${streams.nftRoyalties.percentage}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCampaignPerformanceHTML(campaigns) {
        return `
            <div class="campaign-performance">
                <h5>🎯 Campaign Performance</h5>
                <div class="campaign-summary">
                    <div class="campaign-stat">
                        <span class="stat-value">${campaigns.active}</span>
                        <span class="stat-label">Active Campaigns</span>
                    </div>
                    <div class="campaign-stat">
                        <span class="stat-value">R${campaigns.totalRevenue.toFixed(2)}</span>
                        <span class="stat-label">Campaign Revenue</span>
                    </div>
                </div>
                
                <div class="top-campaigns">
                    <h6>🏆 Top Performing Campaigns</h6>
                    <div class="campaigns-list">
                        ${campaigns.topPerforming.map(campaign => `
                            <div class="campaign-item">
                                <div class="campaign-info">
                                    <div class="campaign-name">${campaign.name}</div>
                                    <div class="campaign-metrics">
                                        <span class="metric">R${campaign.revenue.toFixed(2)}</span>
                                        <span class="metric">${campaign.impressions} imp</span>
                                        <span class="metric">${campaign.clicks} clicks</span>
                                        <span class="metric">${campaign.ctr}% CTR</span>
                                    </div>
                                </div>
                                <div class="campaign-actions">
                                    <button class="btn-small btn-secondary view-campaign" data-campaign-id="${campaign.id}">
                                        👁️ View
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    generateBillingStatusHTML(billing) {
        return `
            <div class="billing-status">
                <h5>📄 Billing Status</h5>
                <div class="billing-summary">
                    <div class="billing-stat pending">
                        <div class="stat-icon">⏳</div>
                        <div class="stat-content">
                            <div class="stat-value">${billing.pendingInvoices}</div>
                            <div class="stat-label">Pending Invoices</div>
                            <div class="stat-amount">R${billing.pendingAmount.toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <div class="billing-stat processed">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <div class="stat-value">${billing.processedThisMonth}</div>
                            <div class="stat-label">Processed This Month</div>
                        </div>
                    </div>
                </div>
                
                <div class="billing-actions">
                    <button class="btn btn-primary generate-invoices">
                        📄 Generate Invoices
                    </button>
                    <button class="btn btn-secondary view-billing-history">
                        📊 View Billing History
                    </button>
                </div>
            </div>
        `;
    }

    generateRevenueChartsHTML(dashboard) {
        return `
            <div class="revenue-charts">
                <h5>📊 Revenue Analytics</h5>
                
                <div class="charts-container">
                    <div class="chart-card revenue-trend">
                        <h6>Revenue Trend (Last 7 Days)</h6>
                        <div class="chart-placeholder" id="revenue-trend-chart">
                            <div class="chart-bars">
                                ${this.generateTrendBars()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="chart-card stream-breakdown">
                        <h6>Revenue Stream Breakdown</h6>
                        <div class="chart-placeholder" id="stream-breakdown-chart">
                            <div class="pie-chart">
                                ${this.generateStreamPieChart(dashboard.streams)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateTrendBars() {
        // Generate simple trend bars for last 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => {
            const height = Math.random() * 80 + 20; // Random height for demo
            return `
                <div class="chart-bar-container">
                    <div class="chart-bar" style="height: ${height}%"></div>
                    <div class="chart-label">${day}</div>
                </div>
            `;
        }).join('');
    }

    generateStreamPieChart(streams) {
        const total = Object.values(streams).reduce((sum, stream) => sum + parseFloat(stream.percentage), 0);
        let currentAngle = 0;
        
        return Object.entries(streams).map(([key, stream]) => {
            const percentage = parseFloat(stream.percentage);
            const angle = (percentage / 100) * 360;
            const slice = `
                <div class="pie-slice ${key}" 
                     style="--start-angle: ${currentAngle}deg; --end-angle: ${currentAngle + angle}deg;">
                </div>
            `;
            currentAngle += angle;
            return slice;
        }).join('');
    }

    generateRevenueActionsHTML() {
        const dashboard = this.revenueSystem?.generateRevenueDashboard();
        const aiEnabled = dashboard?.overview?.aiOptimizationEnabled;
        
        const aiActions = aiEnabled ? `
            <button class="action-btn ai-insights">
                <span class="action-icon">🤖</span>
                <span class="action-label">AI Insights</span>
            </button>
            
            <button class="action-btn ai-optimize">
                <span class="action-icon">⚡</span>
                <span class="action-label">AI Optimize</span>
            </button>
        ` : `
            <button class="action-btn enable-ai">
                <span class="action-icon">🤖</span>
                <span class="action-label">Enable AI</span>
            </button>
        `;
        
        return `
            <div class="revenue-actions">
                <h5>⚡ Quick Actions</h5>
                <div class="actions-grid">
                    <button class="action-btn create-campaign">
                        <span class="action-icon">🎯</span>
                        <span class="action-label">Create Campaign</span>
                    </button>
                    
                    <button class="action-btn add-sponsor">
                        <span class="action-icon">🤝</span>
                        <span class="action-label">Add Sponsor</span>
                    </button>
                    
                    <button class="action-btn export-report">
                        <span class="action-icon">📊</span>
                        <span class="action-label">Export Report</span>
                    </button>
                    
                    ${aiActions}
                    
                    <button class="action-btn revenue-settings">
                        <span class="action-icon">⚙️</span>
                        <span class="action-label">Revenue Settings</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Campaign Creation Form
    generateCampaignCreationForm() {
        const dashboard = this.revenueSystem?.generateRevenueDashboard();
        const aiEnabled = dashboard?.overview?.aiOptimizationEnabled;
        const aiNote = aiEnabled ? `
            <div class="ai-enhancement-note">
                🤖 AI optimization will automatically enhance this campaign with intelligent targeting and pricing
            </div>
        ` : '';
        
        return `
            <div class="campaign-creation-form">
                <div class="form-header">
                    <h5>🎯 Create Revenue Campaign ${aiEnabled ? '🤖' : ''}</h5>
                    <button class="close-form-btn" type="button">✕</button>
                </div>
                ${aiNote}
                
                <form id="revenue-campaign-form" class="revenue-form">
                    <div class="form-grid-two-col">
                        <div class="form-row">
                            <label for="campaign-name">Campaign Name *</label>
                            <input type="text" id="campaign-name" class="form-input" 
                                   placeholder="e.g., Q1 Music Promotion" required>
                        </div>
                        
                        <div class="form-row">
                            <label for="sponsor-select">Sponsor *</label>
                            <select id="sponsor-select" class="form-input" required>
                                <option value="">Select Sponsor</option>
                                <option value="spotify">Spotify</option>
                                <option value="apple-music">Apple Music</option>
                                <option value="local-radio">Local Radio Station</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-section pricing-section">
                        <h6>💰 Pricing Configuration</h6>
                        <div class="form-grid-two-col">
                            <div class="form-row">
                                <label for="impression-rate">Impression Rate (ZAR)</label>
                                <input type="number" id="impression-rate" class="form-input" 
                                       value="0.50" step="0.01" min="0">
                                <small class="field-help">Cost per impression</small>
                            </div>
                            
                            <div class="form-row">
                                <label for="click-rate">Click Rate (ZAR)</label>
                                <input type="number" id="click-rate" class="form-input" 
                                       value="2.00" step="0.01" min="0">
                                <small class="field-help">Cost per click</small>
                            </div>
                            
                            <div class="form-row">
                                <label for="conversion-rate">Conversion Rate (ZAR)</label>
                                <input type="number" id="conversion-rate" class="form-input" 
                                       value="10.00" step="0.01" min="0">
                                <small class="field-help">Cost per conversion</small>
                            </div>
                            
                            <div class="form-row">
                                <label for="flat-fee">Flat Fee (ZAR)</label>
                                <input type="number" id="flat-fee" class="form-input" 
                                       value="0" step="0.01" min="0">
                                <small class="field-help">Optional flat fee</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section budget-section">
                        <h6>💳 Budget & Billing</h6>
                        <div class="form-grid-two-col">
                            <div class="form-row">
                                <label for="total-budget">Total Budget (ZAR) *</label>
                                <input type="number" id="total-budget" class="form-input" 
                                       placeholder="5000" step="0.01" min="0" required>
                            </div>
                            
                            <div class="form-row">
                                <label for="billing-model">Billing Model</label>
                                <select id="billing-model" class="form-input">
                                    <option value="performance">Performance-based</option>
                                    <option value="flat">Flat Fee</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            
                            <div class="form-row">
                                <label for="billing-frequency">Billing Frequency</label>
                                <select id="billing-frequency" class="form-input">
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="daily">Daily</option>
                                </select>
                            </div>
                            
                            <div class="form-row">
                                <label for="currency">Currency</label>
                                <select id="currency" class="form-input">
                                    <option value="ZAR" selected>ZAR (South African Rand)</option>
                                    <option value="USD">USD (US Dollar)</option>
                                    <option value="EUR">EUR (Euro)</option>
                                    <option value="GBP">GBP (British Pound)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section schedule-section">
                        <h6>📅 Campaign Schedule</h6>
                        <div class="form-grid-two-col">
                            <div class="form-row">
                                <label for="start-date">Start Date *</label>
                                <input type="datetime-local" id="start-date" class="form-input" required>
                            </div>
                            
                            <div class="form-row">
                                <label for="end-date">End Date *</label>
                                <input type="datetime-local" id="end-date" class="form-input" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary cancel-campaign-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Campaign</button>
                    </div>
                </form>
            </div>
        `;
    }

    // Event Handlers
    setupEventHandlers() {
        // Campaign creation and AI actions
        document.addEventListener('click', async (e) => {
            if (e.target.matches('.create-campaign')) {
                this.showCampaignCreationForm();
            }
            
            if (e.target.matches('.export-report')) {
                await this.exportRevenueReport();
            }
            
            if (e.target.matches('.generate-invoices')) {
                await this.generatePendingInvoices();
            }
            
            if (e.target.matches('.view-campaign')) {
                const campaignId = e.target.dataset.campaignId;
                this.showCampaignDetails(campaignId);
            }
            
            if (e.target.matches('.enable-ai')) {
                await this.enableAIOptimization();
            }
            
            if (e.target.matches('.ai-insights')) {
                await this.showAIInsights();
            }
            
            if (e.target.matches('.ai-optimize')) {
                await this.runAIOptimization();
            }
        });

        // Form submission
        document.addEventListener('submit', async (e) => {
            if (e.target.matches('#revenue-campaign-form')) {
                e.preventDefault();
                await this.handleCampaignCreation(e.target);
            }
        });
    }

    showCampaignCreationForm() {
        const overlay = document.createElement('div');
        overlay.className = 'form-overlay';
        overlay.innerHTML = this.generateCampaignCreationForm();
        document.body.appendChild(overlay);

        // Setup form event handlers
        overlay.querySelector('.close-form-btn').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.querySelector('.cancel-campaign-btn').addEventListener('click', () => {
            overlay.remove();
        });
    }

    async handleCampaignCreation(form) {
        try {
            const formData = new FormData(form);
            const campaignData = {
                name: formData.get('campaign-name'),
                sponsorId: formData.get('sponsor-select'),
                impressionRate: parseFloat(formData.get('impression-rate')),
                clickRate: parseFloat(formData.get('click-rate')),
                conversionRate: parseFloat(formData.get('conversion-rate')),
                flatFee: parseFloat(formData.get('flat-fee')),
                budget: parseFloat(formData.get('total-budget')),
                billingModel: formData.get('billing-model'),
                billingFrequency: formData.get('billing-frequency'),
                currency: formData.get('currency'),
                startDate: formData.get('start-date'),
                endDate: formData.get('end-date')
            };

            const campaign = await this.revenueSystem.createRevenueCampaign(campaignData);
            
            // Close form and refresh dashboard
            document.querySelector('.form-overlay')?.remove();
            await this.refreshDashboard();
            
            // Show success message
            this.showSuccessMessage(`Campaign "${campaign.name}" created successfully!`);
            
        } catch (error) {
            console.error('Campaign creation failed:', error);
            this.showErrorMessage('Failed to create campaign: ' + error.message);
        }
    }

    async exportRevenueReport() {
        try {
            const dashboard = this.revenueSystem.generateRevenueDashboard();
            const reportType = dashboard.overview.aiOptimizationEnabled ? 'ai-enhanced' : 'standard';
            const report = await this.revenueSystem.exportRevenueReport(reportType);
            
            const blob = new Blob([JSON.stringify(report, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `revenue-report-${reportType}-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showSuccessMessage(`${reportType} revenue report exported successfully!`);
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showErrorMessage('Failed to export report: ' + error.message);
        }
    }
    
    async enableAIOptimization() {
        try {
            const enabled = await this.revenueSystem.enableAIOptimization();
            if (enabled) {
                this.showSuccessMessage('🤖 AI optimization enabled! Your revenue system is now AI-powered.');
                await this.refreshDashboard();
            } else {
                this.showErrorMessage('Chrome AI not available. Please ensure you have Chrome Canary with AI features enabled.');
            }
        } catch (error) {
            console.error('AI enable failed:', error);
            this.showErrorMessage('Failed to enable AI optimization: ' + error.message);
        }
    }
    
    async showAIInsights() {
        try {
            if (!this.revenueSystem.chromeAIOptimizer) {
                this.showErrorMessage('AI optimization not available');
                return;
            }
            
            this.showMessage('🤖 Generating AI insights...', 'info');
            
            const insights = await this.revenueSystem.chromeAIOptimizer.generatePremiumInsights(
                { userId: 'admin' },
                this.revenueSystem.revenueData
            );
            
            this.showAIInsightsModal(insights);
        } catch (error) {
            console.error('AI insights failed:', error);
            this.showErrorMessage('Failed to generate AI insights: ' + error.message);
        }
    }
    
    showAIInsightsModal(insights) {
        const modal = document.createElement('div');
        modal.className = 'ai-insights-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>🤖 AI Revenue Insights</h4>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="insights-section">
                            <h5>📈 Revenue Projections</h5>
                            <div class="projections-grid">
                                <div class="projection-item">
                                    <span class="projection-label">3-Month:</span>
                                    <span class="projection-value">R${insights.revenueProjections.threeMonth?.toFixed(2) || 'N/A'}</span>
                                </div>
                                <div class="projection-item">
                                    <span class="projection-label">6-Month:</span>
                                    <span class="projection-value">R${insights.revenueProjections.sixMonth?.toFixed(2) || 'N/A'}</span>
                                </div>
                                <div class="projection-item">
                                    <span class="projection-label">12-Month:</span>
                                    <span class="projection-value">R${insights.revenueProjections.twelveMonth?.toFixed(2) || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="insights-section">
                            <h5>💡 Optimization Suggestions</h5>
                            <ul class="suggestions-list">
                                ${insights.optimizationSuggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="insights-section">
                            <h5>⭐ Premium Recommendations</h5>
                            <ul class="recommendations-list">
                                ${insights.premiumRecommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="insights-section">
                            <h5>🎯 Market Opportunities</h5>
                            <ul class="opportunities-list">
                                ${insights.marketOpportunities.map(opp => `<li>${opp}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-close">Close</button>
                        <button class="btn btn-primary export-insights">Export Insights</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup modal event handlers
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
        
        modal.querySelector('.export-insights').addEventListener('click', () => {
            this.exportAIInsights(insights);
            modal.remove();
        });
    }
    
    async runAIOptimization() {
        try {
            if (!this.revenueSystem.chromeAIOptimizer) {
                this.showErrorMessage('AI optimization not available');
                return;
            }
            
            this.showMessage('🤖 Running AI optimization...', 'info');
            
            const metrics = this.revenueSystem.getAIOptimizationMetrics();
            const summary = this.revenueSystem.chromeAIOptimizer.getOptimizationSummary();
            
            this.showSuccessMessage(`🤖 AI optimization complete! Total benefit: R${summary.totalBenefit.toFixed(2)}`);
            await this.refreshDashboard();
        } catch (error) {
            console.error('AI optimization failed:', error);
            this.showErrorMessage('AI optimization failed: ' + error.message);
        }
    }
    
    exportAIInsights(insights) {
        try {
            const blob = new Blob([JSON.stringify(insights, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-insights-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showSuccessMessage('AI insights exported successfully!');
        } catch (error) {
            console.error('AI insights export failed:', error);
            this.showErrorMessage('Failed to export AI insights: ' + error.message);
        }
    }

    async generatePendingInvoices() {
        try {
            const campaigns = Array.from(this.revenueSystem.revenueData.campaigns.values())
                .filter(c => c.status === 'active' && !c.billing.invoiceGenerated);
            
            let generatedCount = 0;
            for (const campaign of campaigns) {
                await this.revenueSystem.generateInvoice(campaign.id);
                generatedCount++;
            }
            
            await this.refreshDashboard();
            this.showSuccessMessage(`Generated ${generatedCount} invoices successfully!`);
            
        } catch (error) {
            console.error('Invoice generation failed:', error);
            this.showErrorMessage('Failed to generate invoices: ' + error.message);
        }
    }

    async refreshDashboard() {
        const dashboardContainer = document.querySelector('.revenue-dashboard');
        if (dashboardContainer) {
            dashboardContainer.innerHTML = this.generateRevenueDashboardHTML();
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `admin-message admin-message-${type}`;
        messageEl.innerHTML = message; // Use innerHTML to support emojis
        
        const container = document.querySelector('.revenue-dashboard') || document.body;
        container.insertBefore(messageEl, container.firstChild);
        
        setTimeout(() => messageEl.remove(), type === 'info' ? 3000 : 5000);
    }

    // Auto-refresh functionality
    startAutoRefresh(intervalMs = 30000) {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(async () => {
            await this.refreshDashboard();
        }, intervalMs);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Integration with Admin Dashboard
    static enhanceAdminDashboard(adminDashboard, revenueSystem) {
        const revenueDashboardUI = new RevenueDashboardUI(revenueSystem);
        
        // Add revenue tab to admin dashboard
        const revenueTab = {
            id: 'revenue',
            label: '💰 Revenue',
            content: () => revenueDashboardUI.generateRevenueDashboardHTML()
        };
        
        // Initialize and setup
        revenueDashboardUI.initialize();
        revenueDashboardUI.setupEventHandlers();
        
        return { revenueDashboardUI, revenueTab };
    }
}

window.RevenueDashboardUI = RevenueDashboardUI;