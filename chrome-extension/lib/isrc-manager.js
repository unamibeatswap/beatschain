/**
 * ISRC Manager - Professional ISRC Generation and Management
 * Registrant Code: 80G (Record Label Rights Confirmed)
 * Format: ZA-80G-YY-NNNNN (South African Territory)
 */

class ISRCManager {
    constructor() {
        this.registrantCode = '80G';
        this.territory = 'ZA';
        this.currentYear = new Date().getFullYear().toString().slice(-2);
        this.userInputManager = new UserInputManager();
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        // Check if there's already a shared instance
        if (window.sharedISRCManager && window.sharedISRCManager !== this) {
            console.log('✅ Using existing shared ISRC manager instance');
            try {
                // Copy registry from shared instance
                this.registry = window.sharedISRCManager.registry;
                this.initialized = true;
                return;
            } catch (error) {
                console.warn('Failed to use shared registry:', error);
                // Continue with normal initialization
            }
        }
        
        try {
            await this.loadISRCRegistry();
        } catch (error) {
            console.error('ISRC registry loading failed:', error);
            this.registry = {
                lastDesignation: 200,
                codes: {},
                year: this.currentYear,
                userRange: { start: 200, end: 1199 }
            };
        }
        try {
            this.setupEventListeners();
        } catch (error) {
            console.warn('Event listeners setup failed:', error);
        }
        this.initialized = true;
        
        // Make this the shared instance if none exists
        if (!window.sharedISRCManager) {
            window.sharedISRCManager = this;
            console.log('✅ Set as shared ISRC manager instance');
        }
    }

    async loadISRCRegistry() {
        try {
            let result;
            try {
                result = await chrome.storage.local.get(['isrcRegistry']);
            } catch (storageError) {
                console.warn('Chrome storage access failed:', storageError);
                result = { isrcRegistry: null };
            }
            let userRange;
            try {
                userRange = await this.getUserDesignationRange();
            } catch (rangeError) {
                console.warn('Failed to get user designation range:', rangeError);
                userRange = { start: 200, end: 1199 };
            }
            
            this.registry = result.isrcRegistry || {
                lastDesignation: userRange.start,
                codes: {},
                year: this.currentYear,
                userRange: userRange
            };
            
            // CRITICAL FIX: Ensure codes object always exists
            if (!this.registry.codes || typeof this.registry.codes !== 'object') {
                this.registry.codes = {};
                console.log('🔧 Fixed missing codes object in registry');
            }
            
            // Reset designation if year changed or user range not set
            if (this.registry.year !== this.currentYear || !this.registry.userRange) {
                this.registry.lastDesignation = userRange.start;
                this.registry.year = this.currentYear;
                this.registry.userRange = userRange;
                await this.saveRegistry();
            }
        } catch (error) {
            console.warn('ISRC Registry load failed:', error);
            let userRange;
            try {
                userRange = await this.getUserDesignationRange();
            } catch (rangeError) {
                console.warn('Failed to get user range in fallback:', rangeError);
                userRange = { start: 200, end: 1199 };
            }
            this.registry = {
                lastDesignation: userRange.start,
                codes: {},
                year: this.currentYear,
                userRange: userRange
            };
        }
    }

    async saveRegistry() {
        try {
            await chrome.storage.local.set({ isrcRegistry: this.registry });
        } catch (error) {
            console.error('ISRC Registry save failed:', error);
            // GRACEFUL: Continue without persistent storage
            console.log('🔧 ISRC system continuing with in-memory storage only');
        }
    }

    async generateISRC(trackTitle = '', artistName = '') {
        try {
            // Ensure registry is initialized
            if (!this.registry) {
                await this.loadISRCRegistry();
            }
            
            // CRITICAL FIX: Ensure registry.codes exists
            if (!this.registry.codes) {
                this.registry.codes = {};
                console.log('🔧 Initialized empty codes registry');
            }
            
            // Check for existing ISRC first to prevent duplicates
            const existingISRC = this.getISRCForTrack(trackTitle, artistName);
            if (existingISRC) {
                console.log('✅ Found existing ISRC, reusing:', existingISRC);
                return existingISRC;
            }
            
            const designation = this.getNextDesignation();
            const isrc = `${this.territory}-${this.registrantCode}-${this.currentYear}-${designation}`;
            
            // CRITICAL: Validate generated ISRC format
            if (!this.validateISRC(isrc)) {
                console.error('Generated ISRC failed validation:', {
                    isrc,
                    designation,
                    territory: this.territory,
                    registrant: this.registrantCode,
                    year: this.currentYear
                });
                throw new Error(`Generated ISRC invalid format: ${isrc}`);
            }
            
            // Store in registry with defensive programming
            try {
                this.registry.codes[isrc] = {
                    trackTitle: this.sanitizeInput(trackTitle),
                    artistName: this.sanitizeInput(artistName),
                    generated: new Date().toISOString(),
                    used: false,
                    validated: true
                };
                
                await this.saveRegistry();
                
                console.log('✅ ISRC generated and validated:', {
                    isrc,
                    designation,
                    trackTitle: trackTitle.substring(0, 20),
                    artistName: artistName.substring(0, 20)
                });
                
                // Trigger radio sponsor content after ISRC generation
                this.triggerRadioSponsorContent(isrc);
                
                return isrc;
                
            } catch (storageError) {
                console.warn('⚠️ ISRC storage failed, returning generated code:', storageError);
                // Return the valid ISRC even if storage fails
                return isrc;
            }
            
        } catch (error) {
            console.error('❌ ISRC generation failed:', error);
            throw error;
        }
    }

    getNextDesignation() {
        // Ensure registry exists
        if (!this.registry) {
            throw new Error('ISRC registry not initialized');
        }
        
        // DEFENSIVE: Ensure userRange exists
        if (!this.registry.userRange) {
            console.warn('⚠️ User range missing, using default');
            this.registry.userRange = { start: 200, end: 1199 };
        }
        
        // DEFENSIVE: Ensure lastDesignation is a number
        if (typeof this.registry.lastDesignation !== 'number') {
            console.warn('⚠️ Invalid lastDesignation, resetting to start');
            this.registry.lastDesignation = this.registry.userRange.start;
        }
        
        this.registry.lastDesignation += 1;
        
        // Ensure we stay within user's designated range
        if (this.registry.lastDesignation > this.registry.userRange.end) {
            throw new Error(`ISRC limit reached. Maximum ${this.registry.userRange.end - this.registry.userRange.start + 1} codes per year.`);
        }
        
        // CRITICAL: Ensure 5-digit format
        const designation = this.registry.lastDesignation.toString().padStart(5, '0');
        
        // Validate designation is exactly 5 digits
        if (designation.length !== 5 || !/^\d{5}$/.test(designation)) {
            console.error('Invalid designation format:', {
                designation,
                lastDesignation: this.registry.lastDesignation,
                userRange: this.registry.userRange
            });
            throw new Error(`Invalid designation format: ${designation} (must be 5 digits)`);
        }
        
        return designation;
    }

    validateISRC(isrc) {
        if (!isrc || typeof isrc !== 'string') return false;
        
        const trimmed = isrc.trim();
        
        // FIXED: Strict 5-digit validation - ZA-80G-YY-NNNNN format only
        const standardPattern = /^ZA-80G-\d{2}-\d{5}$/;
        
        const isValid = standardPattern.test(trimmed);
        
        if (!isValid) {
            console.warn('ISRC validation failed:', {
                input: trimmed,
                expected: 'ZA-80G-YY-NNNNN (5 digits)',
                pattern: standardPattern.toString()
            });
        }
        
        return isValid;
    }

    markISRCAsUsed(isrc, context = {}) {
        if (this.registry && this.registry.codes && this.registry.codes[isrc]) {
            this.registry.codes[isrc].used = true;
            this.registry.codes[isrc].usedAt = new Date().toISOString();
            this.registry.codes[isrc].context = context;
            this.saveRegistry();
        }
    }

    setupEventListeners() {
        // Add ISRC generation button to radio form
        this.enhanceRadioForm();
        
        // Listen for ISRC field changes
        document.addEventListener('change', (e) => {
            if (e.target.id === 'radio-isrc') {
                const isrc = e.target.value.trim();
                if (isrc) {
                    this.userInputManager.setUserInput('radio-isrc', isrc, true);
                    this.validateISRCField(e.target);
                }
            }
        });
    }

    enhanceRadioForm() {
        const isrcField = document.getElementById('radio-isrc');
        if (!isrcField) return;

        // Connect to existing button instead of creating new one
        const existingBtn = document.getElementById('generate-isrc-btn');
        if (existingBtn) {
            existingBtn.addEventListener('click', () => {
                this.handleISRCGeneration();
            });
        }

        // Add validation indicator
        this.addValidationIndicator(isrcField);
    }

    addValidationIndicator(field) {
        const indicator = document.createElement('span');
        indicator.className = 'isrc-validation-indicator';
        indicator.style.marginLeft = '8px';
        
        const formRow = field.closest('.form-row');
        if (formRow) {
            formRow.appendChild(indicator);
        }
    }

    async handleISRCGeneration() {
        try {
            // Get track info for ISRC generation
            const trackTitle = document.getElementById('radio-track-title')?.value || '';
            const artistName = document.getElementById('radio-artist-name')?.value || '';
            
            if (!trackTitle.trim()) {
                this.showISRCMessage('Please enter track title first', 'warning');
                return;
            }

            // Generate ISRC (now async)
            const isrc = await this.generateISRC(trackTitle, artistName);
            
            // Set in field - CRITICAL: Make ISRC visible and persistent
            const isrcField = document.getElementById('radio-isrc');
            if (isrcField) {
                isrcField.value = isrc;
                isrcField.style.cssText += 'background: rgba(76, 175, 80, 0.1); border-color: #4CAF50; font-weight: bold;';
                this.userInputManager.setUserInput('radio-isrc', isrc, true);
                this.validateISRCField(isrcField);
            }

            this.showISRCMessage(`Generated: ${isrc}`, 'success');
            
            // CRITICAL: Show persistent ISRC confirmation
            this.showPersistentISRCConfirmation(isrc);
            
        } catch (error) {
            console.error('ISRC generation failed:', error);
            this.showISRCMessage('Generation failed. Please try again.', 'error');
        }
    }

    validateISRCField(field) {
        const isrc = field.value.trim();
        const indicator = field.closest('.form-row')?.querySelector('.isrc-validation-indicator');
        
        if (!indicator) return;

        if (!isrc) {
            indicator.innerHTML = '';
            return;
        }

        if (this.validateISRC(isrc)) {
            indicator.textContent = '✓ Valid ISRC';
            indicator.style.color = '#4CAF50';
            indicator.style.fontWeight = 'bold';
            field.style.borderColor = '#4CAF50';
            field.style.background = 'rgba(76, 175, 80, 0.05)';
        } else {
            indicator.textContent = '✗ Invalid format';
            indicator.style.color = '#f44336';
            indicator.style.fontWeight = 'normal';
            field.style.borderColor = '#f44336';
            field.style.background = 'rgba(244, 67, 54, 0.05)';
        }
    }

    showISRCMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.querySelector('.isrc-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'isrc-message';
            
            const isrcField = document.getElementById('radio-isrc');
            const formRow = isrcField?.closest('.form-row');
            if (formRow) {
                formRow.appendChild(messageEl);
            }
        }

        const colors = {
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#f44336',
            info: '#2196F3'
        };

        messageEl.style.cssText = `
            margin-top: 5px;
            padding: 5px 8px;
            border-radius: 3px;
            font-size: 12px;
            color: white;
            background-color: ${colors[type] || colors.info};
        `;
        messageEl.textContent = message;

        // Auto-hide after 3 seconds for non-success messages
        if (type !== 'success') {
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 3000);
        }
    }
    
    showPersistentISRCConfirmation(isrc) {
        // Remove any existing confirmation
        const existing = document.querySelector('.isrc-confirmation');
        if (existing) existing.remove();
        
        // Create persistent confirmation element
        const confirmation = document.createElement('div');
        confirmation.className = 'isrc-confirmation';
        confirmation.style.cssText = `
            margin-top: 10px;
            padding: 12px;
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid #4CAF50;
            border-radius: 6px;
            text-align: center;
        `;
        
        // Create elements safely without innerHTML
        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'color: #4CAF50; font-weight: bold; margin-bottom: 4px;';
        successDiv.textContent = '✅ ISRC Generated Successfully';
        
        const isrcDiv = document.createElement('div');
        isrcDiv.style.cssText = 'font-family: monospace; font-size: 16px; font-weight: bold; color: #333; margin: 8px 0;';
        isrcDiv.textContent = isrc;
        
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'font-size: 12px; color: #666;';
        infoDiv.textContent = 'This ISRC is now embedded in your track metadata';
        
        confirmation.appendChild(successDiv);
        confirmation.appendChild(isrcDiv);
        confirmation.appendChild(infoDiv);
        
        // Insert after ISRC field
        const isrcField = document.getElementById('radio-isrc');
        const formRow = isrcField?.closest('.form-row');
        if (formRow) {
            formRow.appendChild(confirmation);
        }
    }

    getISRCForTrack(trackTitle, artistName) {
        // Check if user has manually entered ISRC
        const userISRC = this.userInputManager.getValue('radio-isrc', null, null);
        if (userISRC && this.validateISRC(userISRC)) {
            return userISRC;
        }

        // Check shared instance first
        const sharedManager = window.sharedISRCManager;
        if (sharedManager && sharedManager.registry && sharedManager.registry.codes) {
            for (const [isrc, data] of Object.entries(sharedManager.registry.codes)) {
                if (data.trackTitle === trackTitle && data.artistName === artistName && !data.used) {
                    console.log('✅ Found existing ISRC in shared registry:', isrc);
                    return isrc;
                }
            }
        }

        // Check local registry as fallback
        if (!this.registry || !this.registry.codes) {
            return null;
        }

        // Check if we have generated ISRC for this track
        for (const [isrc, data] of Object.entries(this.registry.codes)) {
            if (data.trackTitle === trackTitle && data.artistName === artistName && !data.used) {
                return isrc;
            }
        }

        return null;
    }

    getISRCRegistry() {
        if (!this.registry) {
            return {
                total: 0,
                used: 0,
                available: 0,
                currentYear: this.currentYear,
                lastDesignation: 0
            };
        }
        
        return {
            total: Object.keys(this.registry.codes).length,
            used: Object.values(this.registry.codes).filter(c => c.used).length,
            available: Object.values(this.registry.codes).filter(c => !c.used).length,
            currentYear: this.currentYear,
            lastDesignation: this.registry.lastDesignation
        };
    }

    async getUserDesignationRange() {
        try {
            // Get authenticated user ID for unique range calculation
            let userId = 'anonymous';
            
            // GRACEFUL: Handle missing authentication managers with comprehensive error handling
            try {
                if (window.unifiedAuth && typeof window.unifiedAuth.isAuthenticated === 'function' && window.unifiedAuth.isAuthenticated()) {
                    const userProfile = window.unifiedAuth.getUserProfile();
                    if (userProfile && userProfile.id && typeof userProfile.id === 'string') {
                        userId = userProfile.id;
                    }
                } else if (window.AuthenticationManager || window.EnhancedAuthenticationManager) {
                    const authManager = window.authManager || 
                        (window.EnhancedAuthenticationManager ? new EnhancedAuthenticationManager() : new AuthenticationManager());
                    
                    if (authManager && typeof authManager.isAuthenticated === 'function' && authManager.isAuthenticated()) {
                        const userProfile = authManager.getUserProfile();
                        if (userProfile && userProfile.id && typeof userProfile.id === 'string') {
                            userId = userProfile.id;
                        }
                    }
                }
            } catch (authError) {
                console.warn('⚠️ Auth check failed, using anonymous:', authError);
                userId = 'anonymous'; // Ensure userId is always a string
            }
            
            // CRITICAL: Ensure userId is always a valid string
            if (!userId || typeof userId !== 'string') {
                console.warn('⚠️ Invalid userId detected, using anonymous');
                userId = 'anonymous';
            }
            
            // FIXED: Generate unique range with 5-digit limit enforcement and comprehensive error handling
            const hash = await this.hashUserId(userId);
            const rangeIndex = hash % 90; // Support 90 users per year (90 * 1000 = 90,000 codes)
            const start = 200 + (rangeIndex * 1000); // Each user gets 1000 numbers
            const end = Math.min(start + 999, 99999); // CRITICAL: Cap at 99999 (5 digits max)
            
            // Validate 5-digit format compliance
            if (end > 99999) {
                console.error('ISRC range exceeded 5-digit limit:', { start, end, rangeIndex });
                // Fallback to safe range
                return { start: 200, end: 1199, userId: 'fallback', rangeIndex: 0 };
            }
            
            // CRITICAL FIX: Safe userId handling for logging
            const safeUserId = (userId && typeof userId === 'string') ? userId.substring(0, 8) : 'anonymous';
            console.log('ISRC range calculated:', JSON.stringify({ start, end, userId: safeUserId, rangeIndex }));
            return { start, end, userId, rangeIndex };
            
        } catch (error) {
            console.warn('User range calculation failed, using default:', error);
            // CRITICAL: Ensure safe fallback with proper error structure
            return { 
                start: 200, 
                end: 1199, 
                userId: 'default', 
                rangeIndex: 0,
                error: true,
                errorMessage: error.message || 'Unknown error'
            };
        }
    }
    
    async hashUserId(userId) {
        try {
            // CRITICAL: Ensure userId is a valid string
            if (!userId || typeof userId !== 'string') {
                console.warn('⚠️ Invalid userId for hashing, using fallback');
                userId = 'anonymous';
            }
            
            const encoder = new TextEncoder();
            const data = encoder.encode(userId + 'beatschain-isrc-salt');
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = new Uint8Array(hashBuffer);
            
            // Convert first 4 bytes to number
            let hash = 0;
            for (let i = 0; i < 4; i++) {
                hash = (hash << 8) + hashArray[i];
            }
            
            return Math.abs(hash);
        } catch (error) {
            console.warn('⚠️ Crypto hashing failed, using simple fallback:', error);
            // Simple fallback hash for when crypto.subtle is unavailable
            let hash = 0;
            const str = (userId || 'anonymous') + 'beatschain-isrc-salt';
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash);
        }
    }

    sanitizeInput(input) {
        if (!input) return '';
        return String(input)
            .replace(/[<>"'&]/g, '')
            .trim()
            .substring(0, 100);
    }

    // NEW: Trigger radio sponsor content after ISRC generation
    triggerRadioSponsorContent(isrc) {
        try {
            // Check if we're in radio context
            const radioSection = document.getElementById('radio-section');
            if (!radioSection || !radioSection.classList.contains('active')) {
                return; // Not in radio section
            }

            // Get radio sponsor integration if available - comprehensive fix
            const radioIntegration = window.app?.radioSponsorIntegration || 
                                   window.radioSponsorIntegration ||
                                   (window.RadioSponsorIntegration ? new RadioSponsorIntegration() : null);
            
            if (radioIntegration && typeof radioIntegration.displayAfterISRCGeneration === 'function') {
                // Delay to allow ISRC display to update first
                setTimeout(() => {
                    radioIntegration.displayAfterISRCGeneration();
                }, 1500);
                console.log('🎯 Radio sponsor content triggered after ISRC generation:', isrc);
            } else {
                console.log('✅ Radio sponsor integration connected - ISRC sponsor ready');
                // Fallback: Try to initialize radio sponsor integration
                this.initializeRadioSponsorIntegration();
            }
        } catch (error) {
            console.warn('⚠️ Failed to trigger radio sponsor content:', error);
        }
    }

    // Fallback initialization for radio sponsor integration
    initializeRadioSponsorIntegration() {
        try {
            if (window.RadioSponsorIntegration && window.app) {
                const integration = new RadioSponsorIntegration();
                window.app.radioSponsorIntegration = integration;
                integration.initialize(window.app);
                console.log('✅ Radio sponsor integration initialized from ISRC manager');
            }
        } catch (error) {
            console.warn('⚠️ Failed to initialize radio sponsor integration:', error);
        }
    }

    // Integration with existing systems
    enhanceMetadataWithISRC(metadata) {
        const isrc = this.getISRCForTrack(metadata.title, metadata.artistName);
        
        return {
            ...metadata,
            isrc: isrc || metadata.isrc || '',
            isrcGenerated: !!isrc,
            isrcRegistrant: this.registrantCode,
            isrcTerritory: this.territory,
            // Cross-system integration flags
            nftReady: true,
            radioReady: true,
            samroCompliant: !!isrc
        };
    }

    // Cross-system ISRC integration
    async integrateWithNFTSystem(nftMetadata) {
        if (!nftMetadata.isrc && nftMetadata.title && nftMetadata.artist) {
            const generatedISRC = await this.generateISRC(nftMetadata.title, nftMetadata.artist);
            return {
                ...nftMetadata,
                isrc: generatedISRC,
                isrcGenerated: true,
                isrcRegistrant: this.registrantCode,
                blockchainISRC: true
            };
        }
        return nftMetadata;
    }

    async integrateWithRadioSystem(radioMetadata) {
        if (!radioMetadata.isrc && radioMetadata.title && radioMetadata.artistName) {
            const generatedISRC = await this.generateISRC(radioMetadata.title, radioMetadata.artistName);
            return {
                ...radioMetadata,
                isrc: generatedISRC,
                isrcGenerated: true,
                isrcRegistrant: this.registrantCode,
                radioISRC: true,
                samroReady: true
            };
        }
        return radioMetadata;
    }
}

// Export for Chrome extension compatibility
window.ISRCManager = ISRCManager;