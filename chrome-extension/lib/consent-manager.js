/**
 * Consent Manager - Chrome Web Store Compliant
 */

class ConsentManager {
    constructor() {
        this.consentKey = 'user_consent';
        this.consent = null;
    }

    async initialize() {
        await this.loadConsent();
        if (!this.consent) {
            this.showConsentDialog();
        }
    }

    async loadConsent() {
        try {
            const result = await chrome.storage.local.get([this.consentKey]);
            this.consent = result[this.consentKey] || null;
        } catch (error) {
            console.error('Failed to load consent:', error);
        }
    }

    async saveConsent(consent) {
        try {
            this.consent = consent;
            await chrome.storage.local.set({ [this.consentKey]: consent });
        } catch (error) {
            console.error('Failed to save consent:', error);
        }
    }

    showConsentDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'consent-dialog';
        dialog.innerHTML = `
            <div class="consent-overlay">
                <div class="consent-content">
                    <h3>Privacy & Data Usage</h3>
                    <p>BeatsChain collects minimal usage data locally to improve your experience.</p>
                    <p><a href="https://www.unamifoundation.org/legal/beatschain-privacy-policy" target="_blank">Privacy Policy</a></p>
                    <div class="consent-actions">
                        <button id="consent-accept" class="btn btn-primary">Accept</button>
                        <button id="consent-decline" class="btn btn-secondary">Decline</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        dialog.querySelector('#consent-accept').addEventListener('click', () => {
            this.saveConsent({ analytics: true, timestamp: Date.now() });
            document.body.removeChild(dialog);
        });

        dialog.querySelector('#consent-decline').addEventListener('click', () => {
            this.saveConsent({ analytics: false, timestamp: Date.now() });
            document.body.removeChild(dialog);
        });
    }

    hasAnalyticsConsent() {
        return this.consent?.analytics === true;
    }
}

window.ConsentManager = ConsentManager;