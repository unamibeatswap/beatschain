/**
 * Minting Sponsor Integration - Extends Radio Flow to NFT Minting
 * Adds 4 strategic sponsor placements in the NFT minting process
 */

class MintingSponsorIntegration extends EnhancedSponsorIntegration {
    constructor() {
        super();
        this.ipfsAssetManager = new IPFSAssetManager();
        this.manifestUrl = null; // Will be set from deployed IPFS manifest
    }

    async initialize(app) {
        await super.initialize(app);
        
        // Load deployed IPFS manifest
        await this.loadIPFSManifest();
        
        // Setup minting flow hooks
        this.setupMintingHooks(app);
        
        console.log('✅ Minting Sponsor Integration initialized');
    }

    async loadIPFSManifest() {
        try {
            const result = await chrome.storage.local.get(['deployed_manifest_hash']);
            if (result.deployed_manifest_hash) {
                this.manifestUrl = `ipfs://${result.deployed_manifest_hash}`;
                console.log('📋 IPFS manifest loaded:', this.manifestUrl);
            }
        } catch (error) {
            console.warn('⚠️ Failed to load IPFS manifest:', error);
        }
    }

    setupMintingHooks(app) {
        // Hook into license generation completion
        this.enhanceLicenseGeneration(app);
        
        // Hook into minting button click
        this.enhanceMintingProcess(app);
        
        // Hook into minting success
        this.enhanceMintingSuccess(app);
        
        // Hook into download package
        this.enhanceDownloadPackage(app);
    }

    enhanceLicenseGeneration(app) {
        // Hook into AI license generation completion
        const originalGenerateLicense = app.generateLicense;
        if (originalGenerateLicense) {
            app.generateLicense = async function() {
                const result = await originalGenerateLicense.call(this);
                
                if (result) {
                    setTimeout(() => {
                        app.mintingSponsorIntegration?.displayLicensingSponsor();
                    }, 1000);
                }
                
                return result;
            };
        }
    }

    enhanceMintingProcess(app) {
        // Hook into mint NFT button click
        const mintButton = document.getElementById('mint-nft-btn');
        if (mintButton) {
            const originalClick = mintButton.onclick;
            mintButton.addEventListener('click', async () => {
                await this.displayPreMintingSponsor();
                // Original minting logic continues
            });
        }
    }

    enhanceMintingSuccess(app) {
        // Hook into successful minting completion
        const originalMintNFT = app.mintNFT;
        if (originalMintNFT) {
            app.mintNFT = async function(...args) {
                const result = await originalMintNFT.call(this, ...args);
                
                if (result && result.success !== false) {
                    setTimeout(() => {
                        app.mintingSponsorIntegration?.displayPostMintingSponsor(result);
                    }, 1500);
                }
                
                return result;
            };
        }
    }

    enhanceDownloadPackage(app) {
        // Hook into download package generation
        const originalGeneratePackage = app.generateDownloadPackage;
        if (originalGeneratePackage) {
            app.generateDownloadPackage = async function(...args) {
                const result = await originalGeneratePackage.call(this, ...args);
                
                if (result) {
                    setTimeout(() => {
                        app.mintingSponsorIntegration?.displayDownloadSponsor();
                    }, 500);
                }
                
                return result;
            };
        }
    }

    // Position 1: After License Generation
    async displayLicensingSponsor() {
        const containers = [
            document.getElementById('license-section'),
            document.querySelector('.license-actions')?.parentElement,
            document.querySelector('.license-options')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_license', containers[0]);
        }
    }

    // Position 2: Before NFT Minting
    async displayPreMintingSponsor() {
        const containers = [
            document.getElementById('minting-section'),
            document.querySelector('.mint-actions')?.parentElement,
            document.getElementById('mint-nft-btn')?.parentElement
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('before_minting', containers[0]);
        }
    }

    // Position 3: After Successful Minting
    async displayPostMintingSponsor(mintingResult) {
        const containers = [
            document.getElementById('success-section'),
            document.querySelector('.transaction-details')?.parentElement,
            document.querySelector('.mint-status')?.parentElement
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_minting', containers[0], {
                transactionHash: mintingResult?.transactionHash,
                tokenId: mintingResult?.tokenId,
                isrc: mintingResult?.isrc
            });
        }
    }

    // Position 4: During Download Package
    async displayDownloadSponsor() {
        // Create floating sponsor container
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-sponsor-container';
        floatingContainer.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            max-width: 320px; z-index: 10001;
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(floatingContainer);
        
        await this.displaySponsorContent('during_download', floatingContainer);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (floatingContainer.parentNode) {
                floatingContainer.remove();
            }
        }, 10000);
    }

    async displaySponsorContent(placement, container, context = {}) {
        if (!container) return;

        try {
            // Get sponsors for this placement
            const sponsors = await this.getActiveSponsorsByPlacement(placement);
            if (!sponsors.length) return;

            const sponsor = this.selectSponsorByPriority(sponsors);
            
            // Load IPFS assets if available
            const assets = await this.loadSponsorAssets(sponsor);
            
            // Create sponsor element
            const sponsorElement = this.createMintingSponsorElement(sponsor, assets, placement, context);
            
            // Clear existing sponsors in this container
            const existing = container.querySelector('.minting-sponsor-section');
            if (existing) existing.remove();
            
            container.appendChild(sponsorElement);
            
            // Track impression
            this.trackSponsorImpression(sponsor.id, placement);
            
            console.log(`✅ Minting sponsor displayed: ${sponsor.name} at ${placement}`);
            
        } catch (error) {
            console.error('❌ Failed to display minting sponsor:', error);
        }
    }

    async loadSponsorAssets(sponsor) {
        const assets = {};
        
        if (sponsor.assets) {
            for (const [type, ipfsUrl] of Object.entries(sponsor.assets)) {
                try {
                    if (ipfsUrl.startsWith('ipfs://')) {
                        const ipfsHash = ipfsUrl.replace('ipfs://', '');
                        assets[type] = await this.ipfsAssetManager.loadAsset(ipfsHash);
                    }
                } catch (error) {
                    console.warn(`Failed to load ${type} asset:`, error);
                    assets[type] = this.getFallbackAsset(type);
                }
            }
        }
        
        return assets;
    }

    createMintingSponsorElement(sponsor, assets, placement, context) {
        const sponsorEl = document.createElement('div');
        sponsorEl.className = 'minting-sponsor-section';
        sponsorEl.style.cssText = `
            margin: 15px 0; padding: 16px;
            background: rgba(0, 214, 122, 0.05);
            border-radius: 8px;
            border-left: 4px solid var(--bc-accent-green);
            border: 1px solid rgba(0, 214, 122, 0.2);
        `;

        const placementLabels = {
            after_license: '⚖️ Legal Services',
            before_minting: '🔗 Blockchain Services', 
            after_minting: '🎉 NFT Promotion',
            during_download: '💾 Storage Services'
        };

        sponsorEl.innerHTML = `
            <div class="sponsor-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="sponsor-label" style="font-size: 11px; color: var(--bc-text-muted); text-transform: uppercase;">
                    ${placementLabels[placement] || 'Sponsored'}
                </span>
                <button class="sponsor-close" style="background: none; border: none; color: var(--bc-text-muted); cursor: pointer;">&times;</button>
            </div>
            
            <div class="sponsor-content" style="display: flex; align-items: center; gap: 12px;">
                <div class="sponsor-visual" style="font-size: 24px; width: 40px; text-align: center;">
                    ${assets.logo ? `<img src="${assets.logo}" alt="${sponsor.name}" style="width: 40px; height: 20px; object-fit: contain;">` : '📢'}
                </div>
                
                <div class="sponsor-info" style="flex: 1;">
                    <h4 style="margin: 0 0 4px 0; color: var(--bc-text-primary); font-size: 14px; font-weight: 600;">
                        ${sponsor.name}
                    </h4>
                    <p style="margin: 0 0 8px 0; color: var(--bc-text-secondary); font-size: 13px; line-height: 1.4;">
                        ${sponsor.message}
                    </p>
                    ${sponsor.website ? `
                        <a href="${sponsor.website}" target="_blank" class="sponsor-link" 
                           style="color: var(--bc-accent-green); font-size: 12px; text-decoration: none; font-weight: 500;">
                           Learn More →
                        </a>
                    ` : ''}
                </div>
            </div>
            
            ${context.transactionHash ? `
                <div class="sponsor-context" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <small style="color: var(--bc-text-muted); font-size: 11px;">
                        NFT minted successfully with ISRC: ${context.isrc || 'Generated'}
                    </small>
                </div>
            ` : ''}
        `;

        // Add event listeners
        const closeBtn = sponsorEl.querySelector('.sponsor-close');
        closeBtn.addEventListener('click', async () => {
            await this.trackSponsorInteraction(sponsor.id, placement, 'close');
            sponsorEl.remove();
        });

        const link = sponsorEl.querySelector('.sponsor-link');
        if (link) {
            link.addEventListener('click', async () => {
                await this.trackSponsorInteraction(sponsor.id, placement, 'click');
            });
        }
        
        // Track impression after element is displayed
        setTimeout(async () => {
            await this.trackSponsorImpression(sponsor.id, placement);
        }, 1000);

        return sponsorEl;
    }

    async getActiveSponsorsByPlacement(placement) {
        // Try IPFS manifest first, fallback to local config
        if (this.manifestUrl) {
            try {
                const manifest = await this.fetchIPFSManifest();
                return manifest.sponsors.filter(s => 
                    s.active && (s.placement === placement || 
                    (placement === 'after_minting' && s.placement === 'post_package'))
                );
            } catch (error) {
                console.warn('Failed to fetch IPFS manifest, using fallback');
            }
        }

        // Fallback to existing system
        return super.getActiveSponsors ? super.getActiveSponsors(placement) : [];
    }

    async fetchIPFSManifest() {
        if (!this.manifestUrl) return { sponsors: [] };
        
        const ipfsHash = this.manifestUrl.replace('ipfs://', '');
        const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
        const response = await fetch(url);
        return await response.json();
    }

    selectSponsorByPriority(sponsors) {
        if (sponsors.length === 0) return null;
        if (sponsors.length === 1) return sponsors[0];

        // Sort by priority (higher first)
        sponsors.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        return sponsors[0];
    }

    getFallbackAsset(type) {
        const fallbacks = {
            logo: '📢',
            banner: '🎵'
        };
        return fallbacks[type] || '📄';
    }

    async trackSponsorImpression(sponsorId, placement) {
        console.log(`📊 Sponsor impression: ${sponsorId} at ${placement}`);
        
        // Record in PackageMeasurementSystem
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorDisplay(placement, {
                sponsorId,
                timestamp: Date.now()
            });
        }
        
        // Record in AnalyticsManager
        if (window.analyticsManager) {
            await window.analyticsManager.recordSponsorDisplay(placement);
        }
        
        // Store verification on IPFS
        await this.storeVerificationOnIPFS('impression', { id: sponsorId }, placement);
    }

    async trackSponsorInteraction(sponsorId, placement, action) {
        console.log(`📊 Sponsor ${action}: ${sponsorId} at ${placement}`);
        
        // Record in PackageMeasurementSystem
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorInteraction(action, placement, {
                sponsorId,
                timestamp: Date.now()
            });
        }
        
        // Record in AnalyticsManager
        if (window.analyticsManager) {
            await window.analyticsManager.recordSponsorInteraction(action, placement);
        }
        
        // Store verification on IPFS
        await this.storeVerificationOnIPFS(action, { id: sponsorId }, placement);
    }

    // IPFS Verification Storage
    async storeVerificationOnIPFS(action, sponsor, placement) {
        try {
            if (!this.ipfsAssetManager) return;
            
            const verificationData = {
                action,
                sponsorId: sponsor.id,
                placement,
                timestamp: Date.now(),
                context: 'minting_flow',
                extensionVersion: chrome.runtime?.getManifest()?.version || '2.1.0',
                verificationHash: await this.generateVerificationHash(action, sponsor, placement)
            };
            
            const result = await this.ipfsAssetManager.uploadJSON(
                verificationData,
                `minting-sponsor-${action}-${Date.now()}.json`
            );
            
            if (result.success) {
                console.log(`✅ Minting sponsor ${action} verification stored on IPFS:`, result.ipfsHash);
            }
            
        } catch (error) {
            console.warn(`⚠️ Failed to store minting ${action} verification on IPFS:`, error);
        }
    }

    async generateVerificationHash(action, sponsor, placement) {
        const data = `minting-${action}-${sponsor.id}-${placement}-${Date.now()}`;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Static integration method
    static enhanceApp(app) {
        const integration = new MintingSponsorIntegration();
        app.mintingSponsorIntegration = integration;
        
        // Initialize when app is ready
        if (app.isInitialized) {
            integration.initialize(app);
        } else {
            const checkInit = setInterval(() => {
                if (app.isInitialized) {
                    clearInterval(checkInit);
                    integration.initialize(app);
                }
            }, 100);
        }

        return integration;
    }
}

window.MintingSponsorIntegration = MintingSponsorIntegration;