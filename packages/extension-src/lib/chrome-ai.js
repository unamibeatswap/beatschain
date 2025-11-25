// Chrome Built-in AI APIs Manager - All 5 APIs Integration
class ChromeAIManager {
    constructor() {
        this.isAvailable = false;
        this.apis = {
            prompt: null,
            writer: null,
            rewriter: null,
            summarizer: null,
            translator: null
        };
    }

    async initialize() {
        try {
            // Check if Chrome AI is available
            if (!window.ai) {
                console.log('ℹ️ Chrome AI APIs not available (experimental feature) - using professional fallback templates');
                return false;
            }

            // Initialize available APIs
            if (window.ai.languageModel) {
                const capabilities = await window.ai.languageModel.capabilities();
                if (capabilities.available === 'readily') {
                    this.apis.prompt = await window.ai.languageModel.create();
                }
            }

            if (window.ai.writer) {
                const capabilities = await window.ai.writer.capabilities();
                if (capabilities.available === 'readily') {
                    this.apis.writer = await window.ai.writer.create();
                }
            }

            if (window.ai.rewriter) {
                const capabilities = await window.ai.rewriter.capabilities();
                if (capabilities.available === 'readily') {
                    this.apis.rewriter = await window.ai.rewriter.create();
                }
            }

            if (window.ai.summarizer) {
                const capabilities = await window.ai.summarizer.capabilities();
                if (capabilities.available === 'readily') {
                    this.apis.summarizer = await window.ai.summarizer.create();
                }
            }

            this.isAvailable = Object.values(this.apis).some(api => api !== null);
            
            if (this.isAvailable) {
                console.log('✅ Chrome AI initialized:', this.getAvailableAPIs());
            } else {
                console.log('ℹ️ Chrome AI APIs not ready - using professional fallback templates');
            }
            
            return this.isAvailable;
        } catch (error) {
            console.error('Chrome AI initialization failed:', error);
            return false;
        }
    }

    async generateLicense(beatMetadata, userPreferences = {}) {
        try {
            // Build comprehensive contextual prompt using all metadata
            const contextualPrompt = this.buildLicensePrompt(beatMetadata, userPreferences);

            if (this.apis.prompt) {
                const response = await this.apis.prompt.prompt(contextualPrompt);
                
                // Optimize the generated license using rewriter API
                if (this.apis.rewriter && response) {
                    const optimized = await this.apis.rewriter.rewrite(response, {
                        tone: 'professional',
                        format: 'more-formal'
                    });
                    return optimized;
                }
                
                return response;
            }

            return this.getFallbackLicense(beatMetadata);
        } catch (error) {
            console.error('License generation failed:', error);
            return this.getFallbackLicense(beatMetadata);
        }
    }

    buildLicensePrompt(metadata, preferences) {
        const contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A';
        const isrcInfo = this.buildISRCContext(metadata);
        
        return `Generate a comprehensive music licensing agreement using these EXACT specifications:

TRACK ANALYSIS:
- Title: ${metadata.title || 'Untitled Beat'}
- Original File: ${metadata.originalFileName || 'audio-file'}
- Duration: ${metadata.duration || '0:00'} (${metadata.durationSeconds || 0} seconds)
- Genre: ${metadata.genre || metadata.suggestedGenre || 'Electronic'} (USER SELECTED)
- BPM: ${metadata.estimatedBPM || '120'}
- Energy Level: ${metadata.energyLevel || 'Medium'}
- Quality: ${metadata.qualityLevel || 'High'} (${metadata.estimatedBitrate || '320kbps'})
- Format: ${metadata.format || 'MP3'} (${metadata.fileSize || 'Unknown'})
- Created: ${new Date().toLocaleDateString()}
${isrcInfo}

LICENSE REQUIREMENTS:
1. LICENSE TYPE: Non-Exclusive (allows multiple licensees)
2. USAGE RIGHTS: Commercial and Non-Commercial use permitted
3. TERRITORY: Worldwide distribution rights
4. DURATION: Perpetual (never expires - suitable for NFT)
5. ATTRIBUTION: Required format "${metadata.title} - BeatsChain NFT"
6. DERIVATIVE WORKS: Remixes and samples allowed with attribution
7. SYNCHRONIZATION: Video/media sync rights included
8. PERFORMANCE: Live and broadcast performance rights included
9. MECHANICAL: Digital reproduction and streaming rights included
10. ROYALTY: 2.5% on commercial revenue over $1,000

TECHNICAL SPECIFICATIONS TO INCLUDE:
- File Format: ${metadata.format} at ${metadata.qualityLevel}
- Bitrate: ${metadata.estimatedBitrate}
- File Size: ${metadata.fileSize}
- Duration: ${metadata.durationSeconds} seconds
- Quality maintained as delivered

BLOCKCHAIN VERIFICATION CLAUSE:
- NFT ownership verification required for license validity
- Smart contract address: ${contractAddress}
- Blockchain: Polygon Mumbai Testnet
- License terms immutably stored on blockchain
- Verification URL: https://mumbai.polygonscan.com/address/${contractAddress}

Generate a professional, legally-sound agreement with clear sections for:
1. Grant of Rights
2. Usage Permissions
3. Attribution Requirements
4. Technical Specifications
5. Royalty Terms
6. Blockchain Verification
7. Termination Conditions

Use formal legal language appropriate for music industry contracts.`;
    }

    async optimizeLicense(licenseText) {
        try {
            if (!this.apis.rewriter) return licenseText;

            return await this.apis.rewriter.rewrite(licenseText, {
                tone: 'professional',
                length: 'shorter'
            });
        } catch (error) {
            console.error('License optimization failed:', error);
            return licenseText;
        }
    }

    async summarizeTerms(longText) {
        try {
            if (!this.apis.summarizer) return longText;

            return await this.apis.summarizer.summarize(longText, {
                type: 'key-points',
                length: 'short'
            });
        } catch (error) {
            console.error('Summarization failed:', error);
            return longText;
        }
    }

    async translateContent(text, targetLanguage = 'es') {
        try {
            if (!this.apis.translator) return text;

            return await this.apis.translator.translate(text, {
                sourceLanguage: 'en',
                targetLanguage: targetLanguage
            });
        } catch (error) {
            console.error('Translation failed:', error);
            return text;
        }
    }

    async generateNFTDescription(beatMetadata) {
        try {
            const prompt = `Create an engaging NFT marketplace description for:
Title: ${beatMetadata.title}
Genre: ${beatMetadata.genre}
Key features: AI-generated licensing, blockchain ownership
Make it compelling for collectors and music enthusiasts.`;

            if (this.apis.prompt) {
                const response = await this.apis.prompt.prompt(prompt);
                return response;
            }

            return `${beatMetadata.title} - A unique music NFT with AI-generated licensing terms, ensuring clear ownership and usage rights on the blockchain.`;
        } catch (error) {
            console.error('NFT description generation failed:', error);
            return `${beatMetadata.title} - Music NFT with blockchain ownership`;
        }
    }

    getFallbackLicense(metadata) {
        const finalGenre = metadata.genre || metadata.suggestedGenre || 'Electronic';
        return `MUSIC LICENSING AGREEMENT

Track: ${metadata.title}
Artist: ${metadata.artist}
Genre: ${finalGenre} (USER SELECTED)
Duration: ${metadata.duration}

USAGE RIGHTS:
- Non-exclusive license for personal and commercial use
- Attribution required: "${metadata.artist} - ${metadata.title}"
- No resale or redistribution of original audio file
- Derivative works permitted with attribution

TERMS:
- License valid indefinitely
- No warranty provided
- Governed by blockchain smart contract
- Generated by BeatsChain AI on ${new Date().toLocaleDateString()}`;
    }

    // Build ISRC context for AI prompts
    buildISRCContext(metadata) {
        let isrcContext = '';
        
        if (metadata.isrc) {
            isrcContext += `\n- ISRC: ${metadata.isrc} (International Standard Recording Code)`;
            
            if (metadata.isrcGenerated) {
                isrcContext += `\n- ISRC Authority: 80G Registrant (Professional Record Label)`;
                isrcContext += `\n- ISRC Territory: South Africa (ZA)`;
            }
            
            if (metadata.hasEmbeddedISRC) {
                isrcContext += `\n- ISRC Source: Embedded in audio metadata`;
            }
        }
        
        if (metadata.extractedISRC && metadata.extractedISRC !== metadata.isrc) {
            isrcContext += `\n- Original ISRC: ${metadata.extractedISRC} (extracted from file)`;
        }
        
        return isrcContext;
    }

    // Generate ISRC-enhanced licensing terms
    async generateISRCLicense(metadata, isrc) {
        try {
            const enhancedMetadata = { ...metadata, isrc, isrcGenerated: true };
            const prompt = this.buildISRCLicensePrompt(enhancedMetadata);
            
            if (this.apis.prompt) {
                const response = await this.apis.prompt.prompt(prompt);
                
                if (this.apis.rewriter && response) {
                    return await this.apis.rewriter.rewrite(response, {
                        tone: 'professional',
                        format: 'more-formal'
                    });
                }
                
                return response;
            }
            
            return this.getFallbackISRCLicense(enhancedMetadata);
        } catch (error) {
            console.error('ISRC license generation failed:', error);
            return this.getFallbackISRCLicense({ ...metadata, isrc });
        }
    }

    buildISRCLicensePrompt(metadata) {
        return `Generate a professional music license with ISRC integration:

TRACK IDENTIFICATION:
- Title: ${metadata.title}
- ISRC: ${metadata.isrc} (80G Registrant Authority)
- Territory: South Africa (ZA)
- Genre: ${metadata.genre || metadata.suggestedGenre}
- Duration: ${metadata.duration}

RIGHTS FRAMEWORK:
- Performance Rights: SAMRO (South African Music Rights Organisation)
- Mechanical Rights: SAMRO Mechanical Division
- Synchronization Rights: Included with ISRC tracking
- International Rights: Via ISRC global database

LICENSE TERMS:
1. ISRC-tracked usage for royalty collection
2. Global rights management via ISRC database
3. Professional industry-standard terms
4. Blockchain verification with ISRC metadata

Generate comprehensive licensing terms that leverage ISRC for professional rights management.`;
    }

    getFallbackISRCLicense(metadata) {
        return `PROFESSIONAL MUSIC LICENSE WITH ISRC

═══════════════════════════════════════════════════════════════
TRACK IDENTIFICATION
═══════════════════════════════════════════════════════════════

Title: ${metadata.title}
ISRC: ${metadata.isrc}
Registrant: 80G (Professional Record Label Authority)
Territory: South Africa (ZA)
Genre: ${metadata.genre || metadata.suggestedGenre}

═══════════════════════════════════════════════════════════════
RIGHTS MANAGEMENT
═══════════════════════════════════════════════════════════════

✓ PERFORMANCE RIGHTS: Tracked via ISRC for global royalty collection
✓ MECHANICAL RIGHTS: Digital reproduction with ISRC identification
✓ SYNCHRONIZATION RIGHTS: Video/media sync with ISRC metadata
✓ INTERNATIONAL RIGHTS: Global database registration via ISRC

═══════════════════════════════════════════════════════════════
PROFESSIONAL COMPLIANCE
═══════════════════════════════════════════════════════════════

• SAMRO Compliant (South African Music Rights Organisation)
• ISRC Global Database Integration
• Professional Industry Standards
• Blockchain Verification with ISRC Metadata

Generated: ${new Date().toLocaleString()}
ISRC Authority: 80G Registrant Code
License Type: Professional with ISRC Integration`;
    }

    getAvailableAPIs() {
        return Object.entries(this.apis)
            .filter(([_, api]) => api !== null)
            .map(([name, _]) => name);
    }
}

// Export to global window for Chrome extension compatibility
window.ChromeAIManager = ChromeAIManager;