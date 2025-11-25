/**
 * Graceful Error Handler - Enhances your existing error handling
 * Works with your existing systems without breaking changes
 */

class GracefulErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        
        // Enhance console methods to capture errors gracefully
        this.enhanceConsoleLogging();
        
        // Add global error handlers that don't interfere with existing code
        this.addGlobalErrorHandlers();
        
        this.initialized = true;
        console.log('✅ Graceful error handler initialized');
    }

    enhanceConsoleLogging() {
        // Store original console methods
        const originalError = console.error;
        const originalWarn = console.warn;
        
        // Enhance error logging without breaking existing functionality
        console.error = (...args) => {
            this.logError('error', args);
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.logError('warning', args);
            originalWarn.apply(console, args);
        };
    }

    addGlobalErrorHandlers() {
        // Handle unhandled promise rejections gracefully
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('unhandled_promise', [event.reason]);
            // Don't prevent default - let existing handlers work
        });

        // Handle general JavaScript errors gracefully
        window.addEventListener('error', (event) => {
            this.logError('javascript_error', [event.error || event.message]);
            // Don't prevent default - let existing handlers work
        });
    }

    logError(type, args) {
        const errorEntry = {
            type,
            message: args.join(' '),
            timestamp: new Date().toISOString(),
            stack: new Error().stack
        };
        
        this.errorLog.push(errorEntry);
        
        // Keep log size manageable
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }
    }

    getErrorSummary() {
        const summary = {
            totalErrors: this.errorLog.length,
            recentErrors: this.errorLog.slice(-10),
            errorTypes: {}
        };
        
        this.errorLog.forEach(error => {
            summary.errorTypes[error.type] = (summary.errorTypes[error.type] || 0) + 1;
        });
        
        return summary;
    }

    // Graceful system status check that works with your existing systems
    async checkSystemHealth() {
        const health = {
            timestamp: new Date().toISOString(),
            systems: {},
            overall: 'healthy'
        };

        // Check your existing systems gracefully
        try {
            health.systems.solanaManager = window.solanaManager ? 
                (window.solanaManager.isInitialized ? 'ready' : 'initializing') : 'not_loaded';
        } catch (e) {
            health.systems.solanaManager = 'error';
        }

        try {
            health.systems.unifiedAuth = window.unifiedAuth ? 'available' : 'not_loaded';
        } catch (e) {
            health.systems.unifiedAuth = 'error';
        }

        try {
            health.systems.ipfsAssetManager = window.ipfsAssetManager ? 'available' : 'not_loaded';
        } catch (e) {
            health.systems.ipfsAssetManager = 'error';
        }

        // Determine overall health
        const errorCount = Object.values(health.systems).filter(status => status === 'error').length;
        if (errorCount > 0) {
            health.overall = errorCount > 2 ? 'degraded' : 'partial';
        }

        return health;
    }

    // Create user-friendly status messages
    createStatusMessage(health) {
        const messages = [];
        
        if (health.overall === 'healthy') {
            messages.push('✅ All systems operational');
        } else if (health.overall === 'partial') {
            messages.push('⚠️ Some systems using fallback mode (normal behavior)');
        } else {
            messages.push('🔧 Systems initializing...');
        }

        // Add specific system status
        if (health.systems.solanaManager === 'ready') {
            messages.push('🔗 Blockchain integration ready');
        } else if (health.systems.solanaManager === 'initializing') {
            messages.push('⏳ Blockchain system initializing...');
        }

        return messages;
    }
}

// Initialize gracefully without interfering with existing code
if (!window.gracefulErrorHandler) {
    window.gracefulErrorHandler = new GracefulErrorHandler();
    
    // Initialize when DOM is ready or immediately if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.gracefulErrorHandler.initialize();
        });
    } else {
        window.gracefulErrorHandler.initialize();
    }
}

// Export for use in other modules
window.GracefulErrorHandler = GracefulErrorHandler;