/**
 * Production Monitor - System Health & Performance Tracking
 */

class ProductionMonitor {
    constructor() {
        this.metrics = {
            systemHealth: {},
            performance: {},
            errors: [],
            usage: {}
        };
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        this.startHealthChecks();
        this.setupErrorTracking();
        this.trackPerformance();
        
        this.initialized = true;
        console.log('✅ Production Monitor active');
    }

    startHealthChecks() {
        setInterval(() => {
            this.checkSystemHealth();
        }, 30000); // Every 30 seconds
    }

    async checkSystemHealth() {
        const health = {
            timestamp: Date.now(),
            systems: {
                auth: this.checkAuthSystem(),
                isrc: this.checkISRCSystem(),
                storage: await this.checkStorage(),
                chromeAI: this.checkChromeAI()
            }
        };

        this.metrics.systemHealth = health;
        
        // Alert on critical issues
        const criticalIssues = Object.entries(health.systems)
            .filter(([_, status]) => status === 'critical');
            
        if (criticalIssues.length > 0) {
            console.error('🚨 Critical system issues:', criticalIssues);
        }
    }

    checkAuthSystem() {
        try {
            return window.authManager?.isAuthenticated !== undefined ? 'healthy' : 'warning';
        } catch {
            return 'critical';
        }
    }

    checkISRCSystem() {
        try {
            return window.ISRCManager ? 'healthy' : 'warning';
        } catch {
            return 'critical';
        }
    }

    async checkStorage() {
        try {
            await chrome.storage.local.get(['test']);
            return 'healthy';
        } catch {
            return 'critical';
        }
    }

    checkChromeAI() {
        return window.ai?.languageModel ? 'healthy' : 'unavailable';
    }

    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled Promise Rejection', e.reason);
        });
    }

    logError(type, error) {
        const errorLog = {
            type,
            message: error?.message || String(error),
            stack: error?.stack,
            timestamp: Date.now(),
            url: window.location.href
        };

        this.metrics.errors.push(errorLog);
        
        // Keep only last 50 errors
        if (this.metrics.errors.length > 50) {
            this.metrics.errors = this.metrics.errors.slice(-50);
        }

        console.error(`🔥 ${type}:`, error);
    }

    trackPerformance() {
        // Track package generation performance
        const originalGeneratePackage = window.app?.generatePackage;
        if (originalGeneratePackage) {
            window.app.generatePackage = function() {
                const start = performance.now();
                const result = originalGeneratePackage.call(this);
                const duration = performance.now() - start;
                
                window.productionMonitor?.recordMetric('packageGeneration', duration);
                return result;
            };
        }
    }

    recordMetric(name, value) {
        if (!this.metrics.performance[name]) {
            this.metrics.performance[name] = [];
        }
        
        this.metrics.performance[name].push({
            value,
            timestamp: Date.now()
        });
        
        // Keep only last 100 measurements
        if (this.metrics.performance[name].length > 100) {
            this.metrics.performance[name] = this.metrics.performance[name].slice(-100);
        }
    }

    getHealthReport() {
        return {
            overall: this.calculateOverallHealth(),
            systems: this.metrics.systemHealth.systems || {},
            errorCount: this.metrics.errors.length,
            lastCheck: this.metrics.systemHealth.timestamp,
            performance: this.getPerformanceSummary()
        };
    }

    calculateOverallHealth() {
        const systems = this.metrics.systemHealth.systems || {};
        const statuses = Object.values(systems);
        
        if (statuses.includes('critical')) return 'critical';
        if (statuses.includes('warning')) return 'warning';
        return 'healthy';
    }

    getPerformanceSummary() {
        const summary = {};
        
        for (const [metric, values] of Object.entries(this.metrics.performance)) {
            if (values.length > 0) {
                const recent = values.slice(-10);
                const avg = recent.reduce((sum, v) => sum + v.value, 0) / recent.length;
                summary[metric] = {
                    average: Math.round(avg),
                    samples: recent.length
                };
            }
        }
        
        return summary;
    }
}

// Auto-initialize
window.productionMonitor = new ProductionMonitor();
window.ProductionMonitor = ProductionMonitor;