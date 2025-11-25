// NFT Metadata Integration - Phase 1 Implementation
class NFTMetadataIntegrator {
    constructor() {
        this.metadataWriter = null;
        this.isrcManager = null;
        this.duplicateHashes = new Set();
    }

    async initialize() {
        try {
            // Initialize existing systems
            if (window.MetadataWriter) {
                this.metadataWriter = new MetadataWriter();
            }
            
            if (window.ISRCManager) {
                this.isrcManager = new ISRCManager();
                await this.isrcManager.initialize();
            }
            
            // Load existing hashes for duplicate detection
            await this.loadExistingHashes();
            
            console.log('✅ NFT Metadata Integrator initialized');
            return true;
        } catch (error) {
            console.error('❌ NFT Metadata Integrator failed:', error);
            return false;
        }
    }

    async processForNFTMinting(audioFile, metadata, nftDetails = {}) {
        try {
            console.log('🔄 Processing audio for NFT minting with metadata embedding...');
            
            // 1. Generate ISRC for NFT
            let isrcCode = null;
            if (this.isrcManager) {
                isrcCode = await this.isrcManager.generateISRC();
                console.log('✅ ISRC generated for NFT:', isrcCode);
            }
            
            // 2. Check for duplicates
            const isDuplicate = await this.checkForDuplicates(audioFile);
            if (isDuplicate.found) {
                console.warn('⚠️ Potential duplicate detected:', isDuplicate.reason);
                // Don't block, just warn for now
            }
            
            // 3. Prepare NFT metadata for embedding
            const nftMetadata = {
                isrc: isrcCode,
                title: metadata.title || 'Untitled',
                artist: metadata.artist || 'Unknown Artist',
                genre: metadata.genre || metadata.suggestedGenre,
                mintDate: new Date().toISOString(),
                beatsChainExtension: chrome.runtime?.id || 'local-development',
                // NFT details will be added after minting
                nftContract: nftDetails.contract || 'pending',
                tokenId: nftDetails.tokenId || 'pending',
                transactionHash: nftDetails.transactionHash || 'pending'
            };
            
            // 4. Embed metadata in audio file
            let processedAudioFile = audioFile;
            if (this.metadataWriter) {
                try {
                    processedAudioFile = await this.metadataWriter.writeAudioMetadata(audioFile, nftMetadata);
                    console.log('✅ Metadata embedded in audio file for NFT');
                } catch (error) {
                    console.warn('⚠️ Metadata embedding failed, using original file:', error);
                }
            }
            
            // 5. Store hash for duplicate detection
            await this.storeAudioHash(audioFile);
            
            return {
                processedAudioFile,
                isrcCode,
                nftMetadata,
                isDuplicate: isDuplicate.found
            };
            
        } catch (error) {
            console.error('❌ NFT metadata processing failed:', error);
            return {
                processedAudioFile: audioFile,
                isrcCode: null,
                nftMetadata: {},
                isDuplicate: false
            };
        }
    }

    async updateWithNFTDetails(processedFile, nftDetails) {
        try {
            if (!this.metadataWriter || !nftDetails.transactionHash) {
                return processedFile;
            }
            
            // Update metadata with actual NFT details
            const updatedMetadata = {
                nftContract: nftDetails.contract,
                tokenId: nftDetails.tokenId,
                transactionHash: nftDetails.transactionHash,
                explorerUrl: nftDetails.explorerUrl,
                network: nftDetails.network
            };
            
            const finalFile = await this.metadataWriter.updateAudioMetadata(processedFile, updatedMetadata);
            console.log('✅ NFT details updated in audio metadata');
            return finalFile;
            
        } catch (error) {
            console.warn('⚠️ NFT details update failed:', error);
            return processedFile;
        }
    }

    async checkForDuplicates(audioFile) {
        try {
            // Basic file hash checking
            const fileHash = await this.generateFileHash(audioFile);
            
            if (this.duplicateHashes.has(fileHash)) {
                return {
                    found: true,
                    reason: 'Exact file already uploaded',
                    confidence: 1.0
                };
            }
            
            // TODO: Audio fingerprinting in Phase 2
            
            return { found: false };
            
        } catch (error) {
            console.error('Duplicate check failed:', error);
            return { found: false };
        }
    }

    async generateFileHash(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Hash generation failed:', error);
            return Date.now().toString(); // Fallback
        }
    }

    async storeAudioHash(file) {
        try {
            const hash = await this.generateFileHash(file);
            this.duplicateHashes.add(hash);
            
            // Store in Chrome storage
            if (chrome.storage) {
                const stored = await chrome.storage.local.get(['audioHashes']);
                const hashes = stored.audioHashes || [];
                hashes.push(hash);
                await chrome.storage.local.set({ audioHashes: hashes.slice(-1000) }); // Keep last 1000
            }
        } catch (error) {
            console.error('Hash storage failed:', error);
        }
    }

    async loadExistingHashes() {
        try {
            if (chrome.storage) {
                const stored = await chrome.storage.local.get(['audioHashes']);
                const hashes = stored.audioHashes || [];
                this.duplicateHashes = new Set(hashes);
                console.log(`📊 Loaded ${hashes.length} existing audio hashes for duplicate detection`);
            }
        } catch (error) {
            console.error('Hash loading failed:', error);
        }
    }

    getISRCForDisplay() {
        return this.isrcManager ? this.isrcManager.getLastGenerated() : null;
    }

    generateNFTMetadata(audioData, transactionData, isrcCode) {
        return {
            name: audioData.title || 'BeatNFT',
            description: `Music NFT by ${audioData.artist}: ${audioData.title} - ${audioData.genre}`,
            external_url: `https://mumbai.polygonscan.com/tx/${transactionData.hash}`,
            attributes: [
                { trait_type: 'Artist', value: audioData.artist },
                { trait_type: 'Genre', value: audioData.genre },
                { trait_type: 'ISRC', value: isrcCode },
                { trait_type: 'BPM', value: audioData.bpm || 'Unknown' },
                { trait_type: 'Duration', value: audioData.duration || 'Unknown' },
                { trait_type: 'Quality', value: audioData.quality || 'Unknown' },
                { trait_type: 'Energy Level', value: audioData.energyLevel || 'Unknown' },
                { trait_type: 'Format', value: audioData.format || 'MP3' }
            ],
            properties: {
                isrc: isrcCode,
                registrant: isrcCode ? isrcCode.split('-')[1] : null,
                year: isrcCode ? isrcCode.split('-')[2] : null,
                designation: isrcCode ? isrcCode.split('-')[3] : null
            },
            blockchain: {
                contract: transactionData.contract,
                tokenId: transactionData.tokenId,
                transactionHash: transactionData.hash,
                network: transactionData.network || 'Polygon Mumbai'
            }
        };
    }

    getDuplicateStats() {
        return {
            totalHashes: this.duplicateHashes.size,
            duplicateChecksEnabled: true,
            isrcEnabled: !!this.isrcManager,
            metadataEmbeddingEnabled: !!this.metadataWriter
        };
    }
}

// Export for global use
window.NFTMetadataIntegrator = NFTMetadataIntegrator;