/**
 * Production Status Enhancer - Provides user-friendly status updates
 * Enhances your existing systems with better user communication
 */

class ProductionStatusEnhancer {
    constructor() {
        this.statusContainer = null;
        this.isVisible = false;
    }

    // Create non-intrusive status display
    createStatusDisplay() {
        if (this.statusContainer) return;

        this.statusContainer = document.createElement('div');
        this.statusContainer.id = 'production-status-display';
        this.statusContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            cursor: pointer;
        `;

        this.statusContainer.addEventListener('click', () => {
            this.hideStatus();
        });

        document.body.appendChild(this.statusContainer);
    }

    showStatus(message, type = 'info', duration = 5000) {
        this.createStatusDisplay();

        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };

        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        this.statusContainer.style.borderLeft = `4px solid ${colors[type]}`;
        this.statusContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>${icons[type]}</span>
                <span>${message}</span>
                <span style="margin-left: auto; opacity: 0.7; font-size: 10px;">×</span>
            </div>
        `;

        // Show the status
        this.statusContainer.style.transform = 'translateX(0)';
        this.isVisible = true;

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hideStatus();
            }, duration);
        }
    }

    hideStatus() {
        if (this.statusContainer && this.isVisible) {
            this.statusContainer.style.transform = 'translateX(100%)';
            this.isVisible = false;
        }
    }

    // Enhanced system status with user-friendly messages
    async displaySystemStatus() {
        try {
            const health = await window.gracefulErrorHandler?.checkSystemHealth() || {
                overall: 'unknown',
                systems: {}
            };

            const messages = this.createUserFriendlyMessages(health);
            
            if (health.overall === 'healthy') {
                this.showStatus(messages.join(' • '), 'success', 3000);
            } else if (health.overall === 'partial') {
                this.showStatus(messages.join(' • '), 'info', 5000);
            } else {
                this.showStatus(messages.join(' • '), 'warning', 7000);
            }
        } catch (error) {
            this.showStatus('System status check completed', 'info', 3000);
        }
    }

    createUserFriendlyMessages(health) {
        const messages = [];

        // Overall status
        if (health.overall === 'healthy') {
            messages.push('All systems ready');
        } else if (health.overall === 'partial') {
            messages.push('Systems operational');
        } else {
            messages.push('Systems initializing');
        }

        // Specific system messages
        if (health.systems.solanaManager === 'ready') {
            messages.push('Blockchain ready');
        } else if (health.systems.solanaManager === 'initializing') {
            messages.push('Connecting to blockchain');
        }

        if (health.systems.unifiedAuth === 'available') {
            messages.push('Authentication ready');
        }

        return messages;
    }

    // Show helpful tips based on system status
    showHelpfulTips(systemStatus) {
        const tips = [];

        if (systemStatus.solanaSystem === 'fallback') {
            tips.push('💡 Install Phantom wallet for real blockchain transactions');
        }

        if (systemStatus.unifiedAuth === 'fallback') {
            tips.push('💡 Sign in with Google for full features');
        }

        if (tips.length > 0) {
            setTimeout(() => {
                this.showStatus(tips.join(' • '), 'info', 8000);
            }, 2000);
        }
    }
}

// Initialize gracefully
if (!window.productionStatusEnhancer) {
    window.productionStatusEnhancer = new ProductionStatusEnhancer();
}

// Export for use in other modules
window.ProductionStatusEnhancer = ProductionStatusEnhancer;