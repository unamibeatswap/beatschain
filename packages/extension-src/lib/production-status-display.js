/**
 * Production Status Display - User-friendly production mode status
 */

class ProductionStatusDisplay {
    constructor() {
        this.statusElement = null;
        this.isVisible = false;
    }

    showStatus(status) {
        this.hideStatus(); // Remove any existing status

        const statusDiv = document.createElement('div');
        statusDiv.id = 'production-status-display';
        statusDiv.className = `production-status ${status.success ? 'success' : 'warning'}`;
        
        statusDiv.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0;
            background: ${status.success ? '#d4edda' : '#fff3cd'};
            border-bottom: 2px solid ${status.success ? '#c3e6cb' : '#ffeaa7'};
            color: ${status.success ? '#155724' : '#856404'};
            padding: 16px 20px; z-index: 20000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        const content = this.createStatusContent(status);
        statusDiv.appendChild(content);

        document.body.insertBefore(statusDiv, document.body.firstChild);
        this.statusElement = statusDiv;
        this.isVisible = true;

        // Auto-hide success messages after 15 seconds
        if (status.success) {
            setTimeout(() => {
                this.hideStatus();
            }, 15000);
        }

        // Adjust main content margin to account for status bar
        const container = document.querySelector('.container');
        if (container) {
            container.style.marginTop = '80px';
        }
    }

    createStatusContent(status) {
        const content = document.createElement('div');
        content.style.cssText = 'display: flex; align-items: center; justify-content: space-between;';

        const leftContent = document.createElement('div');
        leftContent.style.cssText = 'flex: 1;';

        const title = document.createElement('div');
        title.style.cssText = 'font-weight: 600; font-size: 16px; margin-bottom: 4px;';
        title.innerHTML = status.success ? 
            '✅ Production Mode Active' : 
            '⚠️ Production Mode - System Issues Detected';

        const details = document.createElement('div');
        details.style.cssText = 'font-size: 14px; opacity: 0.9;';
        details.innerHTML = this.formatSystemDetails(status);

        leftContent.appendChild(title);
        leftContent.appendChild(details);

        const rightContent = document.createElement('div');
        rightContent.style.cssText = 'display: flex; align-items: center; gap: 12px;';

        if (!status.success && status.recommendations) {
            const helpButton = document.createElement('button');
            helpButton.textContent = 'Show Help';
            helpButton.style.cssText = `
                background: #856404; color: white; border: none;
                padding: 6px 12px; border-radius: 4px; cursor: pointer;
                font-size: 12px; font-weight: 500;
            `;
            helpButton.onclick = () => this.showHelp(status);
            rightContent.appendChild(helpButton);
        }

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            background: none; border: none; font-size: 24px;
            cursor: pointer; opacity: 0.7; padding: 0;
            width: 30px; height: 30px; display: flex;
            align-items: center; justify-content: center;
        `;
        closeButton.onclick = () => this.hideStatus();
        rightContent.appendChild(closeButton);

        content.appendChild(leftContent);
        content.appendChild(rightContent);

        return content;
    }

    formatSystemDetails(status) {
        if (status.success) {
            const healthySystems = Object.entries(status.systems || {})
                .filter(([_, state]) => state === true || state === 'healthy')
                .map(([system, _]) => system);
            
            return `All systems operational: ${healthySystems.join(', ')}`;
        } else {
            const issues = Object.entries(status.systems || {})
                .filter(([_, state]) => state !== true && state !== 'healthy')
                .map(([system, state]) => `${system}: ${state}`)
                .slice(0, 3); // Show max 3 issues

            return `Issues detected: ${issues.join(', ')}${issues.length > 3 ? '...' : ''}`;
        }
    }

    showHelp(status) {
        const helpModal = document.createElement('div');
        helpModal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8); z-index: 25000;
            display: flex; align-items: center; justify-content: center;
            padding: 20px;
        `;

        const helpContent = document.createElement('div');
        helpContent.style.cssText = `
            background: white; border-radius: 8px; padding: 24px;
            max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;
        `;

        helpContent.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #333;">🔧 Production Mode Help</h3>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #856404; margin: 0 0 8px 0;">System Status:</h4>
                ${this.formatDetailedSystemStatus(status.systems)}
            </div>
            
            ${status.recommendations ? `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #856404; margin: 0 0 8px 0;">Recommendations:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${status.recommendations.map(rec => `<li style="margin-bottom: 4px;">${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #856404; margin: 0 0 8px 0;">What This Means:</h4>
                <p style="margin: 0; line-height: 1.5;">
                    The extension is running in production mode but some systems couldn't initialize properly. 
                    This may affect certain features, but core functionality should still work.
                </p>
            </div>
            
            <div style="text-align: right;">
                <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                        style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;

        helpModal.appendChild(helpContent);
        document.body.appendChild(helpModal);

        // Close on backdrop click
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        });
    }

    formatDetailedSystemStatus(systems) {
        if (!systems) return '<p>No system information available</p>';

        return Object.entries(systems)
            .map(([system, state]) => {
                const icon = this.getSystemIcon(state);
                const description = this.getSystemDescription(system, state);
                return `
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span style="margin-right: 8px; font-size: 16px;">${icon}</span>
                        <span style="font-weight: 500; margin-right: 8px;">${system}:</span>
                        <span style="color: #666;">${description}</span>
                    </div>
                `;
            }).join('');
    }

    getSystemIcon(state) {
        switch (state) {
            case true:
            case 'healthy': return '✅';
            case 'fallback': return '🔧';
            case 'mock': return '🎭';
            case 'limited': return '⚠️';
            case 'minimal': return '📦';
            case false: return '❌';
            default: return '❓';
        }
    }

    getSystemDescription(system, state) {
        const descriptions = {
            unifiedAuth: {
                true: 'Authentication system working normally',
                fallback: 'Using backup authentication system',
                false: 'Authentication system unavailable'
            },
            thirdwebSDK: {
                true: 'Thirdweb gasless minting active',
                mock: 'Using simulated minting (development mode)',
                limited: 'Thirdweb SDK with limitations',
                false: 'Thirdweb SDK unavailable'
            },
            adminPermissions: {
                true: 'Admin features available',
                minimal: 'Basic admin features only',
                false: 'Admin features unavailable'
            },
            ipfsAssetManager: {
                true: 'IPFS storage system working',
                fallback: 'Using backup storage system',
                false: 'IPFS storage unavailable'
            },
            productionManifest: {
                true: 'Production configuration loaded',
                fallback: 'Using development configuration',
                false: 'Configuration unavailable'
            }
        };

        return descriptions[system]?.[state] || `Status: ${state}`;
    }

    hideStatus() {
        if (this.statusElement && this.statusElement.parentNode) {
            this.statusElement.remove();
            this.statusElement = null;
            this.isVisible = false;

            // Reset main content margin
            const container = document.querySelector('.container');
            if (container) {
                container.style.marginTop = '';
            }
        }
    }

    isStatusVisible() {
        return this.isVisible;
    }
}

// Make globally available
window.ProductionStatusDisplay = ProductionStatusDisplay;
window.productionStatusDisplay = new ProductionStatusDisplay();

console.log('📊 Production Status Display loaded');