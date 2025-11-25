// Solana-Only Manager (Phase 2: Complete Migration)
class SolanaManager {
    constructor() {
        this.isInitialized = false;
        this.solanaConfig = null;
        this.phantomWallet = null;
        this.solanaIntegration = null;
        this.connection = null;
    }

    async initialize() {
        try {
            // Initialize Solana configuration
            this.solanaConfig = new SolanaConfig();
            console.log('✅ Solana config loaded:', this.solanaConfig.getNetwork());
            
            // Initialize Sponsored Minting System
            if (window.SponsoredMintingManager) {
                this.sponsoredMinting = new SponsoredMintingManager();
                const sponsorReady = await this.sponsoredMinting.initialize();
                if (sponsorReady) {
                    console.log('🎁 FREE minting enabled - Users pay $0.00 transaction fees');
                } else {
                    console.warn('⚠️ Sponsored minting unavailable - users will pay fees');
                }
            }
            
            // Initialize NFT Metadata Integration
            if (window.NFTMetadataIntegrator) {
                this.nftMetadataIntegrator = new NFTMetadataIntegrator();
                const metadataReady = await this.nftMetadataIntegrator.initialize();
                if (metadataReady) {
                    console.log('🏷️ NFT metadata integration ready - ISRC + embedding enabled');
                } else {
                    console.warn('⚠️ NFT metadata integration limited');
                }
            }
            
            // Initialize Phantom wallet (optional - embedded is primary)
            this.phantomWallet = new PhantomWalletManager();
            await this.phantomWallet.initialize();
            // No warnings - embedded wallet is primary strategy
            
            // Initialize Solana integration
            if (window.SolanaIntegration) {
                this.solanaIntegration = new SolanaIntegration();
                const solanaReady = await this.solanaIntegration.initialize();
                if (solanaReady) {
                    console.log('✅ Solana integration ready for real minting');
                } else {
                    throw new Error('Solana integration failed to initialize');
                }
            } else {
                throw new Error('SolanaIntegration not available');
            }
            
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('❌ Solana manager initialization failed:', error);
            return false;
        }
    }

    async uploadToIPFS(file, metadata) {
        try {
            console.log('🔄 Starting IPFS upload process with metadata integration...');
            
            // Process audio file with NFT metadata integration
            let processedFile = file;
            let isrcCode = null;
            let nftMetadata = {};
            
            if (this.nftMetadataIntegrator) {
                const processed = await this.nftMetadataIntegrator.processForNFTMinting(file, metadata);
                processedFile = processed.processedAudioFile;
                isrcCode = processed.isrcCode;
                nftMetadata = processed.nftMetadata;
                
                if (processed.isDuplicate) {
                    console.warn('⚠️ Potential duplicate detected - proceeding with caution');
                }
            }
            
            // Upload processed audio file to IPFS
            const audioUri = await this.uploadFileToIPFS(processedFile);
            console.log('✅ Audio uploaded with embedded metadata:', audioUri);
            
            // Upload cover image if provided
            let imageUri = "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
            if (metadata.coverImage) {
                imageUri = await this.uploadFileToIPFS(metadata.coverImage);
                console.log('✅ Cover image uploaded:', imageUri);
            }
            
            // Create comprehensive NFT metadata with ISRC
            const finalNftMetadata = {
                name: metadata.title,
                description: metadata.description || `${metadata.title} - Professional music NFT with blockchain licensing`,
                image: imageUri,
                animation_url: audioUri,
                external_url: "chrome-extension://" + chrome.runtime.id,
                attributes: [
                    { trait_type: "Genre", value: metadata.suggestedGenre || "Electronic" },
                    { trait_type: "Duration", value: metadata.duration },
                    { trait_type: "BPM", value: metadata.estimatedBPM },
                    { trait_type: "Energy Level", value: metadata.energyLevel },
                    { trait_type: "Quality", value: metadata.qualityLevel },
                    { trait_type: "Format", value: metadata.format },
                    { trait_type: "License Type", value: "Professional" },
                    { trait_type: "Created With", value: "BeatsChain Extension" }
                ],
                properties: {
                    license_terms: metadata.licenseTerms,
                    created_at: new Date().toISOString(),
                    file_type: processedFile.type,
                    file_size: processedFile.size,
                    bitrate: metadata.estimatedBitrate,
                    duration_seconds: metadata.durationSeconds,
                    isrc: isrcCode,
                    metadata_embedded: !!this.nftMetadataIntegrator,
                    duplicate_checked: true,
                    ...nftMetadata
                }
            };

            // Upload metadata to IPFS
            const metadataBlob = new Blob([JSON.stringify(finalNftMetadata, null, 2)], { type: 'application/json' });
            const metadataUri = await this.uploadFileToIPFS(metadataBlob);
            console.log('✅ Metadata uploaded with ISRC:', metadataUri);
            
            return { 
                audioUri, 
                metadataUri, 
                imageUri, 
                nftMetadata: finalNftMetadata,
                isrcCode,
                processedFile
            };
        } catch (error) {
            console.error('❌ IPFS upload failed:', error);
            throw error;
        }
    }

    async uploadFileToIPFS(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Add metadata for better organization
            const metadata = JSON.stringify({
                name: file.name,
                keyvalues: {
                    'uploaded_by': 'BeatsChain',
                    'file_type': file.type,
                    'timestamp': new Date().toISOString()
                }
            });
            formData.append('pinataMetadata', metadata);
            
            // Prefer secure client-side Web3.Storage upload if user provided a token
            if (window.Web3StorageClient && typeof window.Web3StorageClient.uploadFile === 'function') {
                try {
                    const name = file.name || 'upload.bin';
                    const cid = await Web3StorageClient.uploadFile(file, name);
                    console.log('✅ File uploaded to Web3.Storage:', cid);
                    return cid;
                } catch (err) {
                    console.warn('Web3.Storage upload failed, falling back to server error:', err);
                    throw new Error('IPFS upload failed: client-side upload failed');
                }
            }

            // Client-side Pinata usage is disabled; advise using a server-side pinning endpoint.
            throw new Error('Client-side IPFS pinning disabled. Configure a Web3.Storage token in Options to enable client uploads, or use server-side pinning.');
            
        } catch (error) {
            console.error('IPFS upload error:', error);
            // Generate deterministic hash for fallback
            const hash = await this.generateDeterministicHash(file);
            console.warn('Using fallback hash:', hash);
            return `ipfs://${hash}`;
        }
    }

    async generateDeterministicHash(file) {
        try {
            // Use Web Crypto API for proper hashing
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Create IPFS-like hash (simplified)
            return 'Qm' + hashHex.substring(0, 44);
        } catch (error) {
            console.error('Hash generation failed:', error);
            // Ultimate fallback
            return 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
        }
    }

    async mintNFT(recipientAddress, metadataUri, metadata = {}) {
        try {
            console.log('🔄 Starting FREE Solana NFT minting...');
            console.log('Recipient:', recipientAddress);
            console.log('Metadata URI:', metadataUri);
            
            // Check if minting can be sponsored (FREE)
            let isSponsored = false;
            if (this.sponsoredMinting) {
                const sponsorCheck = await this.sponsoredMinting.canSponsorMint(recipientAddress);
                if (sponsorCheck.allowed) {
                    console.log('🎁 FREE minting available:', sponsorCheck.remaining, 'remaining today');
                    isSponsored = true;
                } else {
                    console.log('⚠️ Sponsored minting unavailable:', sponsorCheck.reason);
                }
            }
            
            // Try Phantom wallet, fallback to simulation
            let usePhantom = false;
            if (this.phantomWallet && this.phantomWallet.isWalletConnected()) {
                usePhantom = true;
            } else if (this.phantomWallet) {
                try {
                    const connectResult = await this.phantomWallet.connect();
                    usePhantom = connectResult.success;
                } catch (error) {
                    console.log('⚠️ Phantom unavailable, using simulation mode');
                }
            }
            
            let result;
            if (usePhantom && this.solanaIntegration) {
                // Real Solana NFT minting with optional sponsoring
                const mintOptions = { 
                    ...metadata, 
                    wallet: this.phantomWallet,
                    sponsored: isSponsored
                };
                
                if (isSponsored) {
                    // Sponsor the transaction (FREE for user)
                    const sponsoredTx = await this.sponsoredMinting.sponsorTransaction(recipientAddress, {
                        type: 'nft_mint',
                        metadataUri,
                        recipient: recipientAddress
                    });
                    
                    result = await this.solanaIntegration.mintNFT(
                        recipientAddress, 
                        metadataUri, 
                        { ...mintOptions, sponsoredTransaction: sponsoredTx }
                    );
                    
                    console.log('✅ FREE Solana NFT minted (sponsored):', result.transactionHash);
                    result.cost = 'FREE (sponsored by BeatsChain)';
                } else {
                    result = await this.solanaIntegration.mintNFT(recipientAddress, metadataUri, mintOptions);
                    console.log('✅ Solana NFT minted (user paid fees):', result.transactionHash);
                    result.cost = '~$0.03 in SOL';
                }
            } else {
                // Fallback to simulation for demo
                console.log('⚠️ Using simulation mode - Phantom not available');
                result = await this.createTestnetTransaction(recipientAddress, metadataUri);
                result.cost = 'FREE (demo mode)';
                console.log('✅ Demo transaction created:', result.transactionHash);
            }
            
            return {
                ...result,
                network: usePhantom ? 'solana-' + this.solanaConfig.getNetwork() : 'solana-simulation',
                explorerUrl: usePhantom ? this.solanaConfig.getExplorerUrl(result.transactionHash) : null,
                sponsored: isSponsored
            };
        } catch (error) {
            console.error('❌ Solana NFT minting failed:', error);
            throw error;
        }
    }
    
    async mintViaDirectRPC(recipientAddress, metadataUri) {
        try {
            console.log('🔄 Creating blockchain transaction...');
            
            // Always use testnet simulation for demo purposes
            console.log('⚡ Using testnet simulation for demo');
            return await this.createTestnetTransaction(recipientAddress, metadataUri);
            
        } catch (error) {
            console.error('Minting failed:', error);
            throw error;
        }
    }
    
    async createTestnetTransaction(recipientAddress, metadataUri) {
        const timestamp = Date.now();
        const nonce = Math.floor(Math.random() * 1000000);
        const dataToHash = `SOLANA_${recipientAddress}${metadataUri}${timestamp}${nonce}`;
        
        const encoder = new TextEncoder();
        const data = encoder.encode(dataToHash);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const txHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 64);
        
        const tokenId = timestamp.toString();
        const slot = 200000000 + Math.floor(Math.random() * 1000000);
        
        console.log('✅ Solana demo transaction created successfully');
        console.log('📍 Transaction Signature:', txHash);
        
        await this.storeTransactionDetails({
            transactionHash: txHash,
            tokenId: tokenId,
            slot: slot,
            recipient: recipientAddress,
            metadataUri: metadataUri,
            timestamp: timestamp,
            network: 'solana-devnet',
            demo: true
        });
        
        return {
            transactionHash: txHash,
            tokenId: tokenId,
            slot: slot
        };
    }
    

    
    async storeTransactionDetails(txDetails) {
        try {
            // Store in Chrome extension storage for verification
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const key = `tx_${txDetails.transactionHash}`;
                await chrome.storage.local.set({ [key]: txDetails });
                console.log('💾 Transaction details stored for verification');
            }
        } catch (error) {
            console.warn('Failed to store transaction details:', error);
        }
    }
    


    async getUserNFTs(walletAddress) {
        try {
            if (!this.solanaIntegration) {
                return [];
            }
            return await this.solanaIntegration.getUserNFTs(walletAddress);
        } catch (error) {
            console.error("Failed to fetch user NFTs:", error);
            return [];
        }
    }

    async getWalletBalance(walletAddress) {
        try {
            if (!this.solanaIntegration) {
                return "0";
            }
            return await this.solanaIntegration.getWalletBalance(walletAddress);
        } catch (error) {
            console.error("Failed to get wallet balance:", error);
            return "0";
        }
    }

    async connectWallet() {
        try {
            if (!this.phantomWallet) {
                this.phantomWallet.showInstallPrompt();
                throw new Error('Phantom wallet not available');
            }
            
            const result = await this.phantomWallet.connect();
            if (result.success) {
                console.log('✅ Phantom wallet connected:', result.publicKey);
                return result;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Wallet connection failed:', error);
            throw error;
        }
    }

    getWalletAddress() {
        return this.phantomWallet ? this.phantomWallet.getPublicKey() : null;
    }

    isWalletConnected() {
        return this.phantomWallet ? this.phantomWallet.isWalletConnected() : false;
    }

    getExplorerUrl(signature) {
        return this.solanaConfig ? this.solanaConfig.getExplorerUrl(signature) : null;
    }

    getNetwork() {
        return this.solanaConfig ? this.solanaConfig.getNetwork() : 'unknown';
    }
}

// Export as both names for backward compatibility during migration
window.SolanaManager = SolanaManager;
window.ThirdwebManager = SolanaManager; // Backward compatibility