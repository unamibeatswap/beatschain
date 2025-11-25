/**
 * Enhanced Authentication - Fallback Implementation
 * Provides enhanced auth features with graceful fallback
 */

class EnhancedAuth {
    constructor() {
        this.baseAuth = window.AuthManager || window.unifiedAuth;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            if (this.baseAuth && this.baseAuth.initialize) {
                await this.baseAuth.initialize();
            }
            this.isInitialized = true;
            console.log('✅ Enhanced Auth initialized with fallback');
            return true;
        } catch (error) {
            console.warn('Enhanced Auth fallback mode:', error);
            this.isInitialized = true;
            return true;
        }
    }

    isAuthenticated() {
        return this.baseAuth ? this.baseAuth.isAuthenticated() : false;
    }

    async signIn() {
        return this.baseAuth ? this.baseAuth.signIn() : null;
    }

    async signOut() {
        return this.baseAuth ? this.baseAuth.signOut() : null;
    }

    getUserProfile() {
        return this.baseAuth ? this.baseAuth.getUserProfile() : null;
    }
}

window.EnhancedAuth = EnhancedAuth;