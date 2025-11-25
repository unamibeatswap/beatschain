// Session Manager - Advanced Session Management and Monitoring
class SessionManager {
    constructor() {
        this.sessionId = null;
        this.userId = null;
        this.userRole = 'artist';
        this.startTime = null;
        this.lastActivity = null;
        this.isActive = false;
        this.activityTimer = null;
        this.warningTimer = null;
        this.maxSessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        this.inactivityTimeout = 2 * 60 * 60 * 1000; // 2 hours
        this.warningThreshold = 0.9; // Warn at 90% of timeout
        this.securityEvents = [];
    }

    async initialize(userProfile, role = 'artist') {
        try {
            this.userId = userProfile.id;
            this.userRole = role;
            this.sessionId = await this.generateSecureSessionId();
            this.startTime = Date.now();
            this.lastActivity = Date.now();
            this.isActive = true;

            // Store session data
            await this.storeSessionData();

            // Start activity monitoring
            this.startActivityMonitoring();

            // Setup session timeout
            this.setupSessionTimeout();

            console.log('🔄 Session manager initialized:', {
                sessionId: this.sessionId.substring(0, 8) + '...',
                userId: this.userId,
                role: this.userRole,
                maxDuration: this.formatDuration(this.maxSessionDuration),
                inactivityTimeout: this.formatDuration(this.inactivityTimeout)
            });

            await this.logSecurityEvent('session_start');
            return true;
        } catch (error) {
            console.error('Session manager initialization failed:', error);
            return false;
        }
    }

    async generateSecureSessionId() {
        const entropy = new Uint8Array(32);
        crypto.getRandomValues(entropy);
        
        const timestamp = Date.now().toString();
        const random = Array.from(entropy, byte => byte.toString(16).padStart(2, '0')).join('');
        
        const sessionData = timestamp + random + this.userId;
        const encoder = new TextEncoder();
        const data = encoder.encode(sessionData);
        
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async storeSessionData() {
        const sessionData = {
            sessionId: this.sessionId,
            userId: this.userId,
            role: this.userRole,
            startTime: this.startTime,
            lastActivity: this.lastActivity,
            isActive: this.isActive,
            securityEvents: this.securityEvents
        };

        await chrome.storage.local.set({
            'current_session': sessionData,
            'session_timestamp': Date.now()
        });
    }

    startActivityMonitoring() {
        // Monitor user activity events
        const activityEvents = ['click', 'keypress', 'mousemove', 'scroll'];
        
        activityEvents.forEach(eventType => {
            document.addEventListener(eventType, () => {
                this.recordActivity();
            }, { passive: true });
        });

        // Monitor visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logSecurityEvent('session_hidden');
            } else {
                this.recordActivity();
                this.logSecurityEvent('session_visible');
            }
        });

        console.log('👁️ Activity monitoring started');
    }

    recordActivity() {
        const now = Date.now();
        this.lastActivity = now;

        // Reset inactivity timer
        if (this.activityTimer) {
            clearTimeout(this.activityTimer);
        }

        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }

        // Setup new inactivity detection
        this.setupInactivityDetection();

        // Update stored session data
        this.storeSessionData();
    }

    setupInactivityDetection() {
        // Warning timer (90% of inactivity timeout)
        const warningTime = this.inactivityTimeout * this.warningThreshold;
        
        this.warningTimer = setTimeout(() => {
            this.showInactivityWarning();
        }, warningTime);

        // Logout timer (full inactivity timeout)
        this.activityTimer = setTimeout(() => {
            this.handleInactivityTimeout();
        }, this.inactivityTimeout);
    }

    setupSessionTimeout() {
        // Maximum session duration timeout
        setTimeout(() => {
            this.handleSessionTimeout();
        }, this.maxSessionDuration);
    }

    showInactivityWarning() {
        const remainingTime = this.inactivityTimeout - (Date.now() - this.lastActivity);
        const minutes = Math.ceil(remainingTime / (60 * 1000));

        if (minutes <= 0) {
            this.handleInactivityTimeout();
            return;
        }

        // Create warning modal
        const warningModal = document.createElement('div');
        warningModal.id = 'inactivity-warning-modal';
        warningModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const warningContent = document.createElement('div');
        warningContent.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 8px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        warningContent.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 16px;">⏰</div>
            <h3 style="margin: 0 0 12px 0; color: #333;">Session Timeout Warning</h3>
            <p style="margin: 0 0 20px 0; color: #666;">
                Your session will expire in <strong>${minutes} minute${minutes !== 1 ? 's' : ''}</strong> due to inactivity.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="extend-session" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                ">Stay Signed In</button>
                <button id="logout-now" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Sign Out</button>
            </div>
        `;

        warningModal.appendChild(warningContent);
        document.body.appendChild(warningModal);

        // Event handlers
        document.getElementById('extend-session').addEventListener('click', () => {
            this.extendSession();
            document.body.removeChild(warningModal);
        });

        document.getElementById('logout-now').addEventListener('click', () => {
            document.body.removeChild(warningModal);
            this.handleInactivityTimeout();
        });

        this.logSecurityEvent('inactivity_warning', { remainingMinutes: minutes });
    }

    extendSession() {
        this.recordActivity();
        this.logSecurityEvent('session_extended');
        console.log('🔄 Session extended by user');
    }

    async handleInactivityTimeout() {
        console.log('⏰ Session expired due to inactivity');
        await this.logSecurityEvent('session_timeout_inactivity');
        await this.endSession();
        this.showSessionExpiredMessage('Your session has expired due to inactivity. Please sign in again.');
    }

    async handleSessionTimeout() {
        console.log('⏰ Session expired - maximum duration reached');
        await this.logSecurityEvent('session_timeout_duration');
        await this.endSession();
        this.showSessionExpiredMessage('Your session has expired. Please sign in again for security.');
    }

    showSessionExpiredMessage(message) {
        // Remove any existing modals
        const existingModal = document.getElementById('session-expired-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const expiredModal = document.createElement('div');
        expiredModal.id = 'session-expired-modal';
        expiredModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const expiredContent = document.createElement('div');
        expiredContent.style.cssText = `
            background: white;
            padding: 32px;
            border-radius: 8px;
            max-width: 450px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;

        expiredContent.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
            <h2 style="margin: 0 0 16px 0; color: #333;">Session Expired</h2>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.5;">
                ${message}
            </p>
            <button id="signin-again" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
            ">🔑 Sign In Again</button>
        `;

        expiredModal.appendChild(expiredContent);
        document.body.appendChild(expiredModal);

        // Handle sign-in button
        document.getElementById('signin-again').addEventListener('click', () => {
            document.body.removeChild(expiredModal);
            // Trigger sign-in flow
            if (window.beatsChainApp && window.beatsChainApp.handleGoogleSignIn) {
                window.beatsChainApp.handleGoogleSignIn();
            }
        });
    }

    async endSession() {
        this.isActive = false;

        // Clear timers
        if (this.activityTimer) {
            clearTimeout(this.activityTimer);
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }

        // Archive session data
        await this.archiveSession();

        // Clear current session
        await chrome.storage.local.remove(['current_session', 'session_timestamp']);

        console.log('🔚 Session ended');
    }

    async archiveSession() {
        try {
            const sessionArchive = {
                sessionId: this.sessionId,
                userId: this.userId,
                role: this.userRole,
                startTime: this.startTime,
                endTime: Date.now(),
                duration: Date.now() - this.startTime,
                securityEvents: this.securityEvents,
                archived: true
            };

            // Get existing archives
            const stored = await chrome.storage.local.get(['session_archives']);
            const archives = stored.session_archives || [];

            // Add current session
            archives.push(sessionArchive);

            // Keep only last 10 sessions
            if (archives.length > 10) {
                archives.splice(0, archives.length - 10);
            }

            await chrome.storage.local.set({ 'session_archives': archives });

        } catch (error) {
            console.error('Failed to archive session:', error);
        }
    }

    async logSecurityEvent(event, details = {}) {
        const securityEvent = {
            timestamp: Date.now(),
            event: event,
            sessionId: this.sessionId,
            userId: this.userId,
            role: this.userRole,
            details: details
        };

        this.securityEvents.push(securityEvent);

        // Keep only last 50 events per session
        if (this.securityEvents.length > 50) {
            this.securityEvents.splice(0, this.securityEvents.length - 50);
        }

        // Update stored session data
        await this.storeSessionData();
    }

    // Utility methods
    formatDuration(milliseconds) {
        const hours = Math.floor(milliseconds / (60 * 60 * 1000));
        const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    getSessionDuration() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }

    getInactivityDuration() {
        if (!this.lastActivity) return 0;
        return Date.now() - this.lastActivity;
    }

    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            role: this.userRole,
            startTime: this.startTime,
            lastActivity: this.lastActivity,
            isActive: this.isActive,
            duration: this.getSessionDuration(),
            inactivityDuration: this.getInactivityDuration(),
            securityEvents: this.securityEvents.length
        };
    }

    getSessionId() {
        return this.sessionId;
    }

    isSessionActive() {
        return this.isActive;
    }

    // Security monitoring
    detectSuspiciousActivity() {
        const recentEvents = this.securityEvents.filter(
            event => Date.now() - event.timestamp < 5 * 60 * 1000 // Last 5 minutes
        );

        // Multiple rapid sign-in attempts
        const signInAttempts = recentEvents.filter(event => 
            event.event.includes('login') || event.event.includes('signin')
        );

        if (signInAttempts.length > 3) {
            this.logSecurityEvent('suspicious_activity', { 
                type: 'multiple_signin_attempts',
                count: signInAttempts.length 
            });
            return true;
        }

        return false;
    }
}

// Export for Chrome extension compatibility
window.SessionManager = SessionManager;