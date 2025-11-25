/**
 * Radio Submission Sponsor Integration - Adds timed sponsor content to radio flow
 * Implements 4 strategic sponsor placements with timer delays like minting system
 */

class RadioSponsorIntegration {
    constructor() {
        this.ipfsAssetManager = null;
        this.manifestUrl = null;
        this.app = null;
    }

    async initialize(app) {
        this.app = app;
        
        // Initialize IPFS Asset Manager if available
        if (window.IPFSAssetManager) {
            this.ipfsAssetManager = new IPFSAssetManager();
        }
        
        // Load deployed IPFS manifest
        await this.loadIPFSManifest();
        
        // Setup radio flow hooks with timers
        this.setupRadioHooks(app);
        
        console.log('✅ Radio Sponsor Integration initialized with timers');
    }

    async loadIPFSManifest() {
        try {
            const result = await chrome.storage.local.get(['deployed_manifest_hash']);
            if (result.deployed_manifest_hash) {
                this.manifestUrl = `ipfs://${result.deployed_manifest_hash}`;
                console.log('📋 IPFS manifest loaded for radio sponsors:', this.manifestUrl);
            }
        } catch (error) {
            console.warn('⚠️ Failed to load IPFS manifest for radio:', error);
        }
    }

    setupRadioHooks(app) {
        // Hook into radio file processing completion
        this.enhanceRadioFileProcessing(app);
        
        // Hook into radio validation
        this.enhanceRadioValidation(app);
        
        // Hook into radio package generation
        this.enhanceRadioPackageGeneration(app);
        
        // Hook into radio package success
        this.enhanceRadioPackageSuccess(app);
        
        // NEW: Hook into essential package component events
        this.enhanceEssentialPackageComponents(app);
    }

    enhanceEssentialPackageComponents(app) {
        // Hook into cover image upload
        this.enhanceCoverImageUpload(app);
        
        // Hook into metadata entry
        this.enhanceMetadataEntry(app);
        
        // Hook into split sheets completion
        this.enhanceSplitSheetsCompletion(app);
        
        // Hook into SAMRO documentation
        this.enhanceSAMRODocumentation(app);
        
        // Hook into contact information
        this.enhanceContactInformation(app);
        
        // Hook into artist biography
        this.enhanceArtistBiography(app);
        
        // Hook into package download preparation
        this.enhancePackageDownload(app);
    }

    enhanceCoverImageUpload(app) {
        // Listen for cover image upload events
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file' && e.target.accept && e.target.accept.includes('image')) {
                if (e.target.files && e.target.files.length > 0) {
                    setTimeout(() => {
                        this.displayAfterCoverUploadSponsor();
                    }, 1000);
                }
            }
        });
    }

    enhanceMetadataEntry(app) {
        // Listen for metadata form completion
        const metadataFields = ['radio-track-title', 'radio-artist-name', 'radio-genre'];
        
        metadataFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    if (field.value.trim()) {
                        setTimeout(() => {
                            this.displayAfterMetadataSponsor();
                        }, 800);
                    }
                });
            }
        });
    }

    enhanceSplitSheetsCompletion(app) {
        // Hook into SAMRO split manager if available
        if (window.SAMROSplitManager) {
            const originalSaveSplitSheets = window.SAMROSplitManager.prototype.saveSplitSheets;
            if (originalSaveSplitSheets) {
                window.SAMROSplitManager.prototype.saveSplitSheets = async function(...args) {
                    const result = await originalSaveSplitSheets.apply(this, args);
                    if (result) {
                        setTimeout(() => {
                            app.radioSponsorIntegration?.displayAfterSplitSheetsSponsor();
                        }, 900);
                    }
                    return result;
                };
            }
        }
    }

    enhanceSAMRODocumentation(app) {
        // Hook into SAMRO PDF manager if available
        if (window.SAMROPDFManager) {
            const originalGeneratePDF = window.SAMROPDFManager.prototype.generatePDF;
            if (originalGeneratePDF) {
                window.SAMROPDFManager.prototype.generatePDF = async function(...args) {
                    const result = await originalGeneratePDF.apply(this, args);
                    if (result) {
                        setTimeout(() => {
                            app.radioSponsorIntegration?.displayAfterSAMROSponsor();
                        }, 1100);
                    }
                    return result;
                };
            }
        }
    }

    enhanceContactInformation(app) {
        // Listen for contact form completion
        const contactFields = ['artist-email', 'artist-phone', 'artist-address'];
        
        contactFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    if (field.value.trim()) {
                        setTimeout(() => {
                            this.displayAfterContactSponsor();
                        }, 700);
                    }
                });
            }
        });
    }

    enhanceArtistBiography(app) {
        // Listen for biography completion
        const biographyField = document.getElementById('artist-biography');
        if (biographyField) {
            biographyField.addEventListener('blur', () => {
                if (biographyField.value.trim().length > 50) { // Minimum meaningful biography
                    setTimeout(() => {
                        this.displayAfterBiographySponsor();
                    }, 600);
                }
            });
        }
    }

    enhancePackageDownload(app) {
        // Hook into download preparation
        const originalPrepareDownload = app.prepareRadioDownload;
        if (originalPrepareDownload) {
            app.prepareRadioDownload = async function(...args) {
                // Show premium services before download
                setTimeout(() => {
                    app.radioSponsorIntegration?.displayBeforeDownloadSponsor();
                }, 500);
                
                return await originalPrepareDownload.apply(this, args);
            };
        }
    }

    enhanceRadioFileProcessing(app) {
        // Hook into radio file processing completion
        const originalProcessRadioFile = app.processRadioFile;
        if (originalProcessRadioFile) {
            app.processRadioFile = async function(file) {
                const result = await originalProcessRadioFile.call(this, file);
                
                if (result !== false && this.radioAudioFile) {
                    // Timer delay similar to minting system
                    setTimeout(() => {
                        app.radioSponsorIntegration?.displayAfterUploadSponsor();
                    }, 1200); // Slightly longer than minting (1000ms)
                }
                
                return result;
            };
        }
    }

    enhanceRadioValidation(app) {
        // Hook into radio validation completion
        const originalValidateForRadio = app.validateForRadio;
        if (originalValidateForRadio) {
            app.validateForRadio = async function() {
                const result = await originalValidateForRadio.call(this);
                
                if (result) {
                    // Timer delay before package generation
                    setTimeout(() => {
                        app.radioSponsorIntegration?.displayBeforePackageSponsor();
                    }, 800);
                }
                
                return result;
            };
        }
    }

    enhanceRadioPackageGeneration(app) {
        // Hook into radio package generation
        const originalGenerateRadioPackage = app.generateRadioPackage;
        if (originalGenerateRadioPackage) {
            app.generateRadioPackage = async function() {
                // Show sponsor during package generation
                setTimeout(() => {
                    app.radioSponsorIntegration?.displayDuringPackageSponsor();
                }, 300);
                
                const result = await originalGenerateRadioPackage.call(this);
                
                if (result) {
                    // Show success sponsor after package completion
                    setTimeout(() => {
                        app.radioSponsorIntegration?.displayAfterPackageSponsor(result);
                    }, 1800); // Longer delay for package success
                }
                
                return result;
            };
        }
    }

    enhanceRadioPackageSuccess(app) {
        // Additional hook for package success tracking
        const originalRecordPackageSuccess = app.recordPackageSuccess;
        if (originalRecordPackageSuccess) {
            app.recordPackageSuccess = async function(packageData) {
                const result = await originalRecordPackageSuccess.call(this, packageData);
                
                // Timer delay for post-success sponsor content
                setTimeout(() => {
                    app.radioSponsorIntegration?.displayPostSuccessSponsor(packageData);
                }, 2500);
                
                return result;
            };
        }
    }

    // Position 1: After Audio Upload (Timer: 1200ms)
    async displayAfterUploadSponsor() {
        const containers = [
            document.getElementById('radio-metadata-display'),
            document.querySelector('.radio-upload-section'),
            document.getElementById('radio-validation')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_upload', containers[0]);
        }
    }

    // NEW: Position for Cover Image Upload (Timer: 1000ms)
    async displayAfterCoverUploadSponsor() {
        const containers = [
            document.querySelector('.cover-image-section'),
            document.getElementById('radio-metadata-display'),
            document.querySelector('.radio-upload-section')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_cover_upload', containers[0]);
        }
    }

    // NEW: Position for Metadata Entry (Timer: 800ms)
    async displayAfterMetadataSponsor() {
        const containers = [
            document.querySelector('.metadata-section'),
            document.getElementById('radio-metadata-display'),
            document.querySelector('.radio-form-section')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_metadata', containers[0]);
        }
    }

    // NEW: Position for Split Sheets (Timer: 900ms)
    async displayAfterSplitSheetsSponsor() {
        const containers = [
            document.querySelector('.split-sheets-section'),
            document.getElementById('samro-split-manager'),
            document.querySelector('.radio-form-section')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_split_sheets', containers[0]);
        }
    }

    // NEW: Position for SAMRO Documentation (Timer: 1100ms)
    async displayAfterSAMROSponsor() {
        const containers = [
            document.querySelector('.samro-section'),
            document.getElementById('samro-pdf-manager'),
            document.querySelector('.radio-form-section')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_samro', containers[0]);
        }
    }

    // NEW: Position for Contact Information (Timer: 700ms)
    async displayAfterContactSponsor() {
        const containers = [
            document.querySelector('.contact-section'),
            document.querySelector('.artist-info-section'),
            document.querySelector('.radio-form-section')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_contact', containers[0]);
        }
    }

    // NEW: Position for Artist Biography (Timer: 600ms)
    async displayAfterBiographySponsor() {
        const containers = [
            document.querySelector('.biography-section'),
            document.querySelector('.artist-info-section'),
            document.querySelector('.radio-form-section')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_biography', containers[0]);
        }
    }

    // NEW: Position for Before Download (Timer: 500ms)
    async displayBeforeDownloadSponsor() {
        // Create floating sponsor container for premium services
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-sponsor-container premium';
        floatingContainer.style.cssText = `
            position: fixed; top: 20px; left: 20px;
            max-width: 350px; z-index: 10003;
            background: linear-gradient(135deg, rgba(0, 214, 122, 0.95), rgba(0, 180, 100, 0.95));
            backdrop-filter: blur(15px);
            border: 2px solid rgba(0, 214, 122, 0.4);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 214, 122, 0.3);
        `;
        
        document.body.appendChild(floatingContainer);
        
        await this.displaySponsorContent('before_download', floatingContainer);
        
        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (floatingContainer.parentNode) {
                floatingContainer.remove();
            }
        }, 15000);
    }



    // Position 2: Before Package Generation (Timer: 800ms)
    async displayBeforePackageSponsor() {
        const containers = [
            document.getElementById('radio-validation'),
            document.querySelector('.validation-results'),
            document.querySelector('.radio-actions')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('before_package', containers[0]);
        }
    }

    // Position 3: During Package Generation (Timer: 300ms)
    async displayDuringPackageSponsor() {
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
        
        await this.displaySponsorContent('during_package', floatingContainer);
        
        // Auto-remove after 15 seconds (optimal display time)
        setTimeout(() => {
            if (floatingContainer.parentNode) {
                floatingContainer.remove();
            }
        }, 15000);
    }

    // Position 4: After Package Success (Timer: 1800ms)
    async displayAfterPackageSponsor(packageResult) {
        const containers = [
            document.querySelector('.package-success'),
            document.querySelector('.radio-results'),
            document.getElementById('radio-validation')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_package', containers[0], {
                packageCount: packageResult?.fileCount || 0,
                packageName: packageResult?.packageName || 'Radio Package'
            });
        }
    }

    // Position 5: Post Success Follow-up (Timer: 2500ms)
    async displayPostSuccessSponsor(packageData) {
        // Create floating sponsor container
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-sponsor-container';
        floatingContainer.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            max-width: 300px; z-index: 10002;
            background: rgba(0, 214, 122, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 214, 122, 0.3);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 214, 122, 0.2);
        `;
        
        document.body.appendChild(floatingContainer);
        
        await this.displaySponsorContent('post_success', floatingContainer, packageData);
        
        // Auto-remove after 15 seconds (longest timer)
        setTimeout(() => {
            if (floatingContainer.parentNode) {
                floatingContainer.remove();
            }
        }, 15000);
    }

    // NEW: Position for ISRC Generation (Timer: 1500ms)
    async displayAfterISRCGeneration() {
        const containers = [
            document.querySelector('.isrc-section'),
            document.getElementById('radio-isrc')?.parentElement,
            document.querySelector('.radio-form-section')
        ].filter(Boolean);

        if (containers.length > 0) {
            await this.displaySponsorContent('after_isrc_generation', containers[0]);
        }
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
            
            // Create sponsor element using minting format
            const sponsorElement = this.createMintingSponsorElement(sponsor, assets, placement, context);
            
            // Clear existing sponsors in this container
            const existing = container.querySelector('.minting-sponsor-section');
            if (existing) existing.remove();
            
            container.appendChild(sponsorElement);
            
            // Track impression
            this.trackSponsorImpression(sponsor.id, placement);
            
            console.log(`✅ Radio sponsor displayed: ${sponsor.name} at ${placement}`);
            
        } catch (error) {
            console.error('❌ Failed to display radio sponsor:', error);
        }
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
            after_upload: '🎵 Audio Services',
            after_cover_upload: '🖼️ Image Services',
            after_metadata: '📝 Metadata Services',
            after_split_sheets: '⚖️ Legal Services',
            after_samro: '🏛️ Compliance Services',
            after_contact: '📞 Professional Services',
            after_biography: '✍️ Content Services',
            before_download: '✨ Premium Services',
            after_isrc_generation: '🎯 ISRC Services',
            before_package: '📻 Radio Services', 
            during_package: '📦 Distribution Services',
            after_package: '🚀 Promotion Services',
            post_success: '📈 Marketing Services'
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
            
            ${context.packageCount ? `
                <div class="sponsor-context" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <small style="color: var(--bc-text-muted); font-size: 11px;">
                        Radio package ready with ${context.packageCount} files: ${context.packageName}
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
                    (placement === 'after_package' && s.placement === 'radio_success'))
                );
            } catch (error) {
                console.warn('Failed to fetch IPFS manifest for radio, using fallback');
            }
        }

        // Fallback to mock sponsors for radio
        return this.getMockRadioSponsors(placement);
    }

    getMockRadioSponsors(placement) {
        const radioIndustrySponsors = {
            // NEW: Essential Package Component Placements
            after_cover_upload: [{
                id: 'image_services_pro',
                name: 'Professional Image Services',
                message: 'High-quality cover art design and optimization for radio submissions.',
                website: 'https://imageservices.pro',
                active: true,
                priority: 10,
                category: 'image_services'
            }],
            after_metadata: [{
                id: 'metadata_services_pro',
                name: 'Metadata Enhancement Services',
                message: 'Professional metadata optimization for radio and streaming platforms.',
                website: 'https://metadataservices.pro',
                active: true,
                priority: 9,
                category: 'metadata_services'
            }],
            after_split_sheets: [{
                id: 'legal_services_pro',
                name: 'Music Legal Services',
                message: 'Professional legal review and split sheet verification for radio submissions.',
                website: 'https://musiclegal.co.za',
                active: true,
                priority: 8,
                category: 'legal_services'
            }],
            after_samro: [{
                id: 'samro_compliance_pro',
                name: 'SAMRO Compliance Pro',
                message: 'Expert SAMRO documentation and compliance services for South African radio.',
                website: 'https://samrocompliance.co.za',
                active: true,
                priority: 10,
                category: 'compliance_services'
            }],
            after_contact: [{
                id: 'professional_services_hub',
                name: 'Professional Services Hub',
                message: 'Complete artist management and professional services for radio campaigns.',
                website: 'https://professionalservices.co.za',
                active: true,
                priority: 7,
                category: 'professional_services'
            }],
            after_biography: [{
                id: 'content_creation_pro',
                name: 'Content Creation Services',
                message: 'Professional biography writing and content creation for radio promotion.',
                website: 'https://contentcreation.pro',
                active: true,
                priority: 6,
                category: 'content_services'
            }],
            before_download: [{
                id: 'premium_services_suite',
                name: 'Premium Services Suite',
                message: 'Unlock premium features and advanced radio submission tools.',
                website: 'https://beatschain.com/premium',
                active: true,
                priority: 10,
                category: 'premium_services'
            }],
            
            // Enhanced Existing Placements with Radio Industry Focus
            after_upload: [{
                id: 'radio_mastering_pro',
                name: 'Radio Mastering Services',
                message: 'Professional mastering optimized for South African radio broadcast standards.',
                website: 'https://radiomastering.co.za',
                active: true,
                priority: 9,
                category: 'audio_services'
            }],

            before_package: [{
                id: 'radio_plugging_sa',
                name: 'SA Radio Plugging Network',
                message: 'Direct connections to program directors at major South African radio stations.',
                website: 'https://radioplugger.co.za',
                active: true,
                priority: 10,
                category: 'radio_submission'
            }],
            during_package: [{
                id: 'radio_distribution_hub',
                name: 'Radio Distribution Hub',
                message: 'Specialized distribution to radio stations and streaming platforms simultaneously.',
                website: 'https://radiodistribution.co.za',
                active: true,
                priority: 8,
                category: 'distribution_services'
            }],
            after_package: [{
                id: 'airplay_promotion_pro',
                name: 'Airplay Promotion Services',
                message: 'Professional radio promotion campaigns with guaranteed airplay tracking.',
                website: 'https://airplaypromotion.co.za',
                active: true,
                priority: 9,
                category: 'promotion_services'
            }],
            post_success: [{
                id: 'radio_analytics_pro',
                name: 'Radio Analytics & Monitoring',
                message: 'Comprehensive airplay analytics and radio campaign performance tracking.',
                website: 'https://radioanalytics.co.za',
                active: true,
                priority: 8,
                category: 'analytics_services'
            }],
            
            // NEW: ISRC Generation Services
            after_isrc_generation: [{
                id: 'isrc_services_pro',
                name: 'Professional ISRC Services',
                message: 'Expert ISRC registration and music industry compliance for radio submissions.',
                website: 'https://isrcservices.co.za',
                active: true,
                priority: 10,
                category: 'isrc_services'
            }],
            
            // South African Radio Market Specific
            sa_radio_specific: [{
                id: 'sabc_submission_pro',
                name: 'SABC Submission Services',
                message: 'Specialized submission services for SABC radio stations and compliance.',
                website: 'https://sabcsubmission.co.za',
                active: true,
                priority: 10,
                category: 'sa_radio_services'
            }, {
                id: 'commercial_radio_network',
                name: 'Commercial Radio Network SA',
                message: 'Direct access to commercial radio stations across South Africa.',
                website: 'https://commercialradio.co.za',
                active: true,
                priority: 9,
                category: 'sa_radio_services'
            }, {
                id: 'community_radio_outreach',
                name: 'Community Radio Outreach',
                message: 'Grassroots promotion through South African community radio stations.',
                website: 'https://communityradio.co.za',
                active: true,
                priority: 7,
                category: 'sa_radio_services'
            }],
            
            // Broadcasting Industry Services
            broadcasting_services: [{
                id: 'program_director_access',
                name: 'Program Director Network',
                message: 'Direct connections to program directors at major radio stations.',
                website: 'https://programdirectors.co.za',
                active: true,
                priority: 10,
                category: 'broadcasting_services'
            }, {
                id: 'music_director_outreach',
                name: 'Music Director Connections',
                message: 'Professional outreach to music directors and playlist curators.',
                website: 'https://musicdirectors.co.za',
                active: true,
                priority: 9,
                category: 'broadcasting_services'
            }, {
                id: 'radio_interview_booking',
                name: 'Radio Interview Booking',
                message: 'Professional booking services for radio interviews and live sessions.',
                website: 'https://radiointerviews.co.za',
                active: true,
                priority: 8,
                category: 'broadcasting_services'
            }],
            
            // Airplay & Analytics Services
            airplay_services: [{
                id: 'airplay_monitoring_pro',
                name: 'Airplay Monitoring Pro',
                message: 'Real-time airplay monitoring across all South African radio stations.',
                website: 'https://airplaymonitor.co.za',
                active: true,
                priority: 9,
                category: 'airplay_services'
            }, {
                id: 'playlist_placement_pro',
                name: 'Playlist Placement Services',
                message: 'Strategic playlist placement on radio and streaming platforms.',
                website: 'https://playlistplacement.co.za',
                active: true,
                priority: 8,
                category: 'airplay_services'
            }]
        };

        // Return sponsors for specific placement or fallback to general categories
        if (radioIndustrySponsors[placement]) {
            return radioIndustrySponsors[placement];
        }
        
        // Fallback mapping for new placements
        const placementMapping = {
            after_cover_upload: radioIndustrySponsors.after_cover_upload,
            after_metadata: radioIndustrySponsors.after_metadata,
            after_split_sheets: radioIndustrySponsors.after_split_sheets,
            after_samro: radioIndustrySponsors.after_samro,
            after_contact: radioIndustrySponsors.after_contact,
            after_biography: radioIndustrySponsors.after_biography,
            before_download: radioIndustrySponsors.before_download,
            after_isrc_generation: radioIndustrySponsors.after_isrc_generation
        };
        
        return placementMapping[placement] || radioIndustrySponsors.sa_radio_specific || [];
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

    async loadSponsorAssets(sponsor) {
        const assets = {};
        
        if (sponsor.assets && this.ipfsAssetManager) {
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

    getFallbackAsset(type) {
        const fallbacks = {
            logo: '📢',
            banner: '📻'
        };
        return fallbacks[type] || '🎵';
    }

    async trackSponsorImpression(sponsorId, placement) {
        console.log(`📊 Radio sponsor impression: ${sponsorId} at ${placement} (with timer)`);
        
        // Record in PackageMeasurementSystem with enhanced context
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorDisplay(placement, {
                sponsorId,
                timestamp: Date.now(),
                context: 'radio_flow',
                packageComponent: this.getPackageComponentForPlacement(placement),
                placementType: 'essential_package_component'
            });
        }
        
        // Record in AnalyticsManager
        if (window.analyticsManager) {
            await window.analyticsManager.recordSponsorDisplay(placement);
        }
        
        // Record new placement metrics
        await this.recordNewPlacementMetrics(placement, sponsorId);
        
        // Store verification on IPFS
        await this.storeVerificationOnIPFS('impression', { id: sponsorId }, placement);
    }

    async trackSponsorInteraction(sponsorId, placement, action) {
        console.log(`📊 Radio sponsor ${action}: ${sponsorId} at ${placement} (with timer)`);
        
        // Record in PackageMeasurementSystem with enhanced context
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorInteraction(action, placement, {
                sponsorId,
                timestamp: Date.now(),
                context: 'radio_flow',
                packageComponent: this.getPackageComponentForPlacement(placement),
                placementType: 'essential_package_component'
            });
        }
        
        // Record in AnalyticsManager
        if (window.analyticsManager) {
            await window.analyticsManager.recordSponsorInteraction(action, placement);
        }
        
        // Record new placement metrics
        await this.recordNewPlacementMetrics(placement, sponsorId, { action });
        
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
                context: 'radio_flow',
                extensionVersion: chrome.runtime?.getManifest()?.version || '2.1.0',
                verificationHash: await this.generateVerificationHash(action, sponsor, placement)
            };
            
            const result = await this.ipfsAssetManager.uploadJSON(
                verificationData,
                `radio-sponsor-${action}-${Date.now()}.json`
            );
            
            if (result.success) {
                console.log(`✅ Radio sponsor ${action} verification stored on IPFS:`, result.ipfsHash);
            }
            
        } catch (error) {
            console.warn(`⚠️ Failed to store radio ${action} verification on IPFS:`, error);
        }
    }

    async generateVerificationHash(action, sponsor, placement) {
        const data = `radio-${action}-${sponsor.id}-${placement}-${Date.now()}`;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Static integration method
    static enhanceApp(app) {
        const integration = new RadioSponsorIntegration();
        app.radioSponsorIntegration = integration;
        
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

    // Integration with Package Measurement System for new placements
    async recordNewPlacementMetrics(placement, sponsorId, context = {}) {
        if (window.packageMeasurementSystem) {
            await window.packageMeasurementSystem.recordSponsorDisplay(placement, {
                sponsorId,
                timestamp: Date.now(),
                context: 'radio_essential_package',
                packageComponent: this.getPackageComponentForPlacement(placement),
                ...context
            });
        }
    }

    getPackageComponentForPlacement(placement) {
        const componentMapping = {
            after_cover_upload: 'cover_image',
            after_metadata: 'track_metadata',
            after_split_sheets: 'split_sheets',
            after_samro: 'samro_documentation',
            after_contact: 'contact_information',
            after_biography: 'artist_biography',
            before_download: 'package_download'
        };
        
        return componentMapping[placement] || 'unknown_component';
    }
}

window.RadioSponsorIntegration = RadioSponsorIntegration;