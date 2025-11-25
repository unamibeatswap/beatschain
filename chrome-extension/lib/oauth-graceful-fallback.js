/**
 * OAuth Graceful Fallback - Enhances OAuth handling without breaking existing code
 * Works with your existing unified-auth.js system
 */

class OAuthGracefulFallback {
    constructor() {
        this.initialized = false;
        this.fallbackActive = false;
    }

    initialize() {
        if (this.initialized) return;
        
        // Enhance existing OAuth handling gracefully
        this.enhanceOAuthHandling();
        this.initialized = true;
        console.log('✅ OAuth graceful fallback initialized');
    }

    enhanceOAuthHandling() {
        // Only enhance if chrome.identity exists
        if (typeof chrome !== 'undefined' && chrome.identity) {
            const originalGetAuthToken = chrome.identity.getAuthToken;
            
            chrome.identity.getAuthToken = (details, callback) => {
                // Wrap the original function with graceful error handling
                const enhancedCallback = (token) => {
                    if (chrome.runtime.lastError) {
                        const error = chrome.runtime.lastError.message;
                        
                        // Handle specific OAuth errors gracefully
                        if (this.isOAuthConfigurationError(error)) {
                            // Only enable guest mode automatically in explicit development mode
                            if (window.__DEV_GUEST_MODE__ === true) {
                                console.log('ℹ️ OAuth configuration issue detected, enabling guest mode (dev)');
                                this.enableGuestMode();
                                // Provide graceful fallback response
                                callback(null);
                                return;
                            } else {
                                console.warn('⚠️ OAuth configuration issue detected. To enable guest-mode fallback for local development set window.__DEV_GUEST_MODE__ = true. Guest mode will not be enabled automatically in production.');
                                callback(null);
                                return;
                            }
                        }
                    }
                    
                    // Call original callback for successful cases
                    callback(token);
                };
                
                // Call original function with enhanced callback
                originalGetAuthToken.call(chrome.identity, details, enhancedCallback);
            };
        }
    }

    isOAuthConfigurationError(errorMessage) {
        const configErrors = [
            'bad client id',
            'invalid_client',
            'unauthorized_client',
            'client_id not found'
        ];
        
        return configErrors.some(error => 
            errorMessage.toLowerCase().includes(error)
        );
    }

    enableGuestMode() {
        // Only enable guest mode automatically if explicitly allowed for dev
        if (window.__DEV_GUEST_MODE__ !== true) {
            console.info('ℹ️ Guest mode not enabled: set window.__DEV_GUEST_MODE__ = true for development guest-mode behavior');
            return;
        }

        if (this.fallbackActive) return;

        this.fallbackActive = true;
        
        // Show user-friendly notification
        if (window.productionStatusEnhancer) {
            window.productionStatusEnhancer.showStatus(
                'Running in guest mode - full features available without sign-in',
                'info',
                5000
            );
        }
        
        // Enhance existing unified auth with guest mode if not already present
        if (window.unifiedAuth && !window.unifiedAuth.guestMode) {
            const originalSignIn = window.unifiedAuth.signInWithGoogle;
            
            window.unifiedAuth.signInWithGoogle = async () => {
                try {
                    return await originalSignIn.call(window.unifiedAuth);
                } catch (error) {
                    console.log('ℹ️ Sign-in unavailable, continuing in guest mode');
                    return {
                        success: false,
                        guestMode: true,
                        message: 'Continuing in guest mode - all features available'
                    };
                }
            };
            
            window.unifiedAuth.guestMode = true;
        }
    }

    // Check if OAuth is working
    async testOAuthConnection() {
        return new Promise((resolve) => {
            if (!chrome.identity) {
                resolve({ working: false, reason: 'chrome.identity not available' });
                return;
            }
            
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (chrome.runtime.lastError) {
                    const error = chrome.runtime.lastError.message;
                    resolve({ 
                        working: false, 
                        reason: error,
                        isConfigError: this.isOAuthConfigurationError(error)
                    });
                } else {
                    resolve({ working: true, hasToken: !!token });
                }
            });
        });
    }
}

// Initialize gracefully without interfering with existing code
if (!window.oauthGracefulFallback) {
    window.oauthGracefulFallback = new OAuthGracefulFallback();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.oauthGracefulFallback.initialize();
        });
    } else {
        window.oauthGracefulFallback.initialize();
    }
}

// Export for use in other modules
window.OAuthGracefulFallback = OAuthGracefulFallback;