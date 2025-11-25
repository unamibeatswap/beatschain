/**
 * Usage Limits Manager - Enhanced Monetization Controls
 * Handles daily package limits, user tiers, and upgrade messaging
 */

class UsageLimitsManager {
    constructor() {
        this.authManager = null;
        this.adminDashboard = null;
        this.limits = {
            anonymous: { daily: 1, monthly: 10 },
            authenticated: { daily: 4, monthly: 50 },
            premium: { daily: 20, monthly: 200 }
        };
        this.currentUsage = {};
        this.isInitialized = false;
    }

    async initialize(authManager, adminDashboard = null) {
        this.authManager = authManager;
        this.adminDashboard = adminDashboard;
        
        await this.loadCurrentUsage();
        await this.cleanupOldUsage();
        
        this.isInitialized = true;
        console.log('✅ Usage Limits Manager initialized');
    }

    async loadCurrentUsage() {
        try {
            const result = await chrome.storage.local.get(['usage_tracking']);
            this.currentUsage = result.usage_tracking || {
                daily: {},
                monthly: {},
                users: {},
                lastCleanup: Date.now()
            };
        } catch (error) {
            console.error('Failed to load usage data:', error);
            this.currentUsage = { daily: {}, monthly: {}, users: {} };
        }
    }

    async saveCurrentUsage() {
        try {
            await chrome.storage.local.set({ usage_tracking: this.currentUsage });
        } catch (error) {
            console.error('Failed to save usage data:', error);
        }
    }

    async cleanupOldUsage() {
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

        // Clean up old daily data
        Object.keys(this.currentUsage.daily).forEach(dateKey => {
            const date = new Date(dateKey).getTime();
            if (date < oneDayAgo) {
                delete this.currentUsage.daily[dateKey];
            }
        });

        // Clean up old monthly data
        Object.keys(this.currentUsage.monthly).forEach(monthKey => {
            const [year, month] = monthKey.split('-').map(Number);
            const monthDate = new Date(year, month - 1, 1).getTime();
            if (monthDate < oneMonthAgo) {
                delete this.currentUsage.monthly[monthKey];
            }
        });

        this.currentUsage.lastCleanup = now;
        await this.saveCurrentUsage();
    }

    getUserTier() {
        if (!this.authManager) return 'anonymous';
        
        const userProfile = this.authManager.getUserProfile();
        if (!userProfile) return 'anonymous';
        
        // Check for premium tier (future implementation)
        if (userProfile.tier === 'premium') return 'premium';
        
        // Authenticated users
        return 'authenticated';
    }

    getUserId() {
        if (!this.authManager) return this.getAnonymousId();
        
        const userProfile = this.authManager.getUserProfile();
        if (!userProfile) return this.getAnonymousId();
        
        return userProfile.id;
    }

    getAnonymousId() {
        // Generate privacy-compliant session ID
        return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async checkDailyLimit(packageType = 'radio') {
        const userId = this.getUserId();
        const userTier = this.getUserTier();
        const today = new Date().toDateString();
        
        // Get current daily usage
        if (!this.currentUsage.daily[today]) {
            this.currentUsage.daily[today] = {};
        }
        
        const todayUsage = this.currentUsage.daily[today][userId] || 0;
        const dailyLimit = this.limits[userTier].daily;
        
        return {
            allowed: todayUsage < dailyLimit,
            used: todayUsage,
            limit: dailyLimit,
            remaining: Math.max(0, dailyLimit - todayUsage),
            tier: userTier,
            resetTime: this.getNextResetTime('daily')
        };
    }

    async checkMonthlyLimit(packageType = 'radio') {
        const userId = this.getUserId();
        const userTier = this.getUserTier();
        const currentMonth = this.getCurrentMonthKey();
        
        // Get current monthly usage
        if (!this.currentUsage.monthly[currentMonth]) {
            this.currentUsage.monthly[currentMonth] = {};
        }
        
        const monthlyUsage = this.currentUsage.monthly[currentMonth][userId] || 0;
        const monthlyLimit = this.limits[userTier].monthly;
        
        return {
            allowed: monthlyUsage < monthlyLimit,
            used: monthlyUsage,
            limit: monthlyLimit,
            remaining: Math.max(0, monthlyLimit - monthlyUsage),
            tier: userTier,
            resetTime: this.getNextResetTime('monthly')
        };
    }

    async recordPackageGeneration(packageType = 'radio') {
        const userId = this.getUserId();
        const today = new Date().toDateString();
        const currentMonth = this.getCurrentMonthKey();
        
        // Record daily usage
        if (!this.currentUsage.daily[today]) {
            this.currentUsage.daily[today] = {};
        }
        this.currentUsage.daily[today][userId] = (this.currentUsage.daily[today][userId] || 0) + 1;
        
        // Record monthly usage
        if (!this.currentUsage.monthly[currentMonth]) {
            this.currentUsage.monthly[currentMonth] = {};
        }
        this.currentUsage.monthly[currentMonth][userId] = (this.currentUsage.monthly[currentMonth][userId] || 0) + 1;
        
        // Record user-specific data
        if (!this.currentUsage.users[userId]) {
            this.currentUsage.users[userId] = {
                tier: this.getUserTier(),
                firstSeen: Date.now(),
                totalPackages: 0
            };
        }
        this.currentUsage.users[userId].totalPackages++;
        this.currentUsage.users[userId].lastSeen = Date.now();
        
        await this.saveCurrentUsage();
        
        // Record in admin dashboard if available
        if (this.adminDashboard) {
            await this.adminDashboard.recordPackageGeneration(userId);
        }
    }

    getCurrentMonthKey() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}`;
    }

    getNextResetTime(type) {
        const now = new Date();
        
        if (type === 'daily') {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            return tomorrow.getTime();
        } else if (type === 'monthly') {
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            return nextMonth.getTime();
        }
        
        return now.getTime();
    }

    formatTimeUntilReset(resetTime) {
        const now = Date.now();
        const diff = resetTime - now;
        
        if (diff <= 0) return 'Now';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    async canGeneratePackage(packageType = 'radio') {
        const dailyCheck = await this.checkDailyLimit(packageType);
        const monthlyCheck = await this.checkMonthlyLimit(packageType);
        
        return {
            allowed: dailyCheck.allowed && monthlyCheck.allowed,
            daily: dailyCheck,
            monthly: monthlyCheck,
            blockingFactor: !dailyCheck.allowed ? 'daily' : (!monthlyCheck.allowed ? 'monthly' : null)
        };
    }

    getUpgradeMessage(limitCheck) {
        const userTier = this.getUserTier();
        
        if (userTier === 'anonymous') {
            return {
                title: 'Sign in for 4x More Packages!',
                message: `Get ${this.limits.authenticated.daily} packages daily instead of ${this.limits.anonymous.daily}`,
                action: 'Sign In with Google',
                actionType: 'signin'
            };
        } else if (userTier === 'authenticated') {
            return {
                title: 'Upgrade to Premium',
                message: `Get ${this.limits.premium.daily} packages daily and ${this.limits.premium.monthly} monthly`,
                action: 'Upgrade to Premium',
                actionType: 'upgrade'
            };
        }
        
        return null;
    }

    showLimitReachedMessage(limitCheck, container) {
        const upgradeMsg = this.getUpgradeMessage(limitCheck);
        const blockingFactor = limitCheck.blockingFactor;
        const relevantLimit = blockingFactor === 'daily' ? limitCheck.daily : limitCheck.monthly;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'limit-reached-message';
        messageEl.innerHTML = `
            <div class="limit-warning">
                <div class="warning-header">
                    <span class="warning-icon">⚠️</span>
                    <span class="warning-title">${blockingFactor === 'daily' ? 'Daily' : 'Monthly'} Limit Reached</span>
                </div>
                <div class="limit-details">
                    <p>You've used ${relevantLimit.used} of ${relevantLimit.limit} packages this ${blockingFactor === 'daily' ? 'day' : 'month'}.</p>
                    <p class="reset-time">Resets in: <strong>${this.formatTimeUntilReset(relevantLimit.resetTime)}</strong></p>
                </div>
                ${upgradeMsg ? `
                    <div class="upgrade-offer">
                        <h4>${upgradeMsg.title}</h4>
                        <p>${upgradeMsg.message}</p>
                        <button class="btn btn-primary upgrade-btn" data-action="${upgradeMsg.actionType}">
                            ${upgradeMsg.action}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add event listener for upgrade button
        const upgradeBtn = messageEl.querySelector('.upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'signin') {
                    this.handleSignInRequest();
                } else if (action === 'upgrade') {
                    this.handleUpgradeRequest();
                }
            });
        }
        
        if (container) {
            container.appendChild(messageEl);
        }
        
        return messageEl;
    }

    handleSignInRequest() {
        // Trigger sign-in flow
        if (window.beatsChainApp && window.beatsChainApp.handleGoogleSignIn) {
            window.beatsChainApp.handleGoogleSignIn();
        } else {
            console.log('Sign-in requested - no handler available');
        }
    }

    handleUpgradeRequest() {
        // Show premium upgrade modal (future implementation)
        this.showPremiumUpgradeModal();
    }

    showPremiumUpgradeModal() {
        const modal = document.createElement('div');
        modal.className = 'premium-upgrade-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🚀 Upgrade to Premium</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="premium-features">
                            <h4>Premium Benefits:</h4>
                            <ul>
                                <li>✅ ${this.limits.premium.daily} packages per day</li>
                                <li>✅ ${this.limits.premium.monthly} packages per month</li>
                                <li>✅ Priority AI processing</li>
                                <li>✅ Advanced analytics</li>
                                <li>✅ Premium support</li>
                            </ul>
                        </div>
                        <div class="pricing">
                            <div class="price">$9.99/month</div>
                            <div class="price-note">Cancel anytime</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-cancel">Maybe Later</button>
                        <button class="btn btn-primary modal-upgrade">Upgrade Now</button>
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-upgrade').addEventListener('click', () => {
            // Future: Implement actual upgrade flow
            alert('Premium upgrade coming soon! Sign in now for 4x more packages.');
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.body.removeChild(modal);
            }
        });
        
        document.body.appendChild(modal);
    }

    updatePackageLimitUI() {
        const currentLimitEl = document.getElementById('radio-current-limit');
        const upgradeOption = document.getElementById('radio-upgrade-option');
        
        if (currentLimitEl) {
            const userTier = this.getUserTier();
            const dailyLimit = this.limits[userTier].daily;
            currentLimitEl.textContent = `${dailyLimit} per day`;
        }
        
        if (upgradeOption) {
            const userTier = this.getUserTier();
            upgradeOption.style.display = userTier === 'anonymous' ? 'flex' : 'none';
        }
    }

    async getUsageStats() {
        const userId = this.getUserId();
        const userTier = this.getUserTier();
        const today = new Date().toDateString();
        const currentMonth = this.getCurrentMonthKey();
        
        const dailyUsed = this.currentUsage.daily[today]?.[userId] || 0;
        const monthlyUsed = this.currentUsage.monthly[currentMonth]?.[userId] || 0;
        
        return {
            tier: userTier,
            daily: {
                used: dailyUsed,
                limit: this.limits[userTier].daily,
                remaining: Math.max(0, this.limits[userTier].daily - dailyUsed)
            },
            monthly: {
                used: monthlyUsed,
                limit: this.limits[userTier].monthly,
                remaining: Math.max(0, this.limits[userTier].monthly - monthlyUsed)
            },
            totalPackages: this.currentUsage.users[userId]?.totalPackages || 0
        };
    }
}

// Export for Chrome extension compatibility
window.UsageLimitsManager = UsageLimitsManager;