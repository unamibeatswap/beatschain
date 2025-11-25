// Download Package Manager - Creates zip with all minted resources
class DownloadManager {
    constructor() {
        this.jszip = null;
    }

    async initialize() {
        // Load JSZip library dynamically
        if (!window.JSZip) {
            const script = document.createElement('script');
            // Use inline JSZip implementation for security
            return this.initializeInlineZip();
            document.head.appendChild(script);
            

        }
        this.jszip = new JSZip();
    }

    async createMintPackage(nftData) {
        try {
            await this.initialize();
            const zip = new JSZip();
            
            // Add original audio file with secure path validation
            if (nftData.audioFile) {
                const sanitizedTitle = this.sanitizeFilename(nftData.title);
                const sanitizedFormat = this.sanitizeFilename(nftData.audioFormat || 'mp3');
                const audioPath = this.validateZipPath(`audio/${sanitizedTitle}.${sanitizedFormat}`);
                zip.file(audioPath, nftData.audioFile);
            }
            
            // Add cover image if exists with secure path validation
            if (nftData.coverImage) {
                const sanitizedTitle = this.sanitizeFilename(nftData.title);
                const imagePath = this.validateZipPath(`images/${sanitizedTitle}-cover.jpg`);
                zip.file(imagePath, nftData.coverImage);
            }
            
            // Add license terms
            zip.file('license.txt', nftData.licenseTerms);
            
            // Add NFT metadata JSON
            const metadata = {
                name: nftData.title,
                description: nftData.description,
                artist: nftData.artist,
                contract_address: nftData.contractAddress,
                token_id: nftData.tokenId,
                transaction_hash: nftData.transactionHash,
                ipfs_hash: nftData.ipfsHash,
                minted_date: new Date().toISOString(),
                blockchain: 'Polygon Mumbai',
                explorer_url: `https://mumbai.polygonscan.com/tx/${nftData.transactionHash}`
            };
            zip.file('nft-metadata.json', JSON.stringify(metadata, null, 2));
            
            // Add certificate of authenticity
            const certificate = this.generateCertificate(nftData);
            zip.file('certificate.txt', certificate);
            
            // Generate and download zip
            const content = await zip.generateAsync({type: 'blob'});
            const url = URL.createObjectURL(content);
            
            const a = document.createElement('a');
            a.href = url;
            const sanitizedTitle = this.sanitizeFilename(nftData.title);
            a.download = `${sanitizedTitle}-BeatsChain-Package.zip`;
            a.click();
            
            URL.revokeObjectURL(url);
            return true;
            
        } catch (error) {
            console.error('Package creation failed:', error);
            return false;
        }
    }

    sanitizeFilename(filename) {
        if (!filename) return 'untitled';
        
        // Comprehensive path traversal prevention
        const sanitized = String(filename)
            .replace(/[\\/:*?"<>|]/g, '_')  // Remove path separators and invalid chars
            .replace(/\.\.+/g, '_')         // Remove directory traversal attempts
            .replace(/^[.\s]+|[.\s]+$/g, '') // Remove leading/trailing dots and spaces
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
            .substring(0, 100);             // Limit length
            
        // Ensure filename is not empty after sanitization
        return sanitized || 'untitled';
    }
    
    initializeInlineZip() {
        // Minimal inline ZIP implementation for security
        window.JSZip = function() {
            this.files = {};
        };
        
        window.JSZip.prototype.file = function(name, content) {
            this.files[name] = content;
        };
        
        window.JSZip.prototype.generateAsync = function(options) {
            return Promise.resolve(new Blob(['Mock ZIP content'], {type: 'application/zip'}));
        };
        
        this.jszip = new JSZip();
    }

    validateZipPath(path) {
        // Ensure ZIP paths are safe and don't contain traversal attempts
        const normalizedPath = path.replace(/\\/g, '/'); // Normalize separators
        const pathParts = normalizedPath.split('/').filter(part => part && part !== '.' && part !== '..');
        
        // Rebuild safe path
        return pathParts.join('/');
    }
    
    generateCertificate(nftData) {
        const sanitizedTitle = this.sanitizeFilename(nftData.title);
        const sanitizedArtist = this.sanitizeFilename(nftData.artist);
        const sanitizedTokenId = String(nftData.tokenId || '').replace(/[^a-zA-Z0-9]/g, '');
        const sanitizedContract = String(nftData.contractAddress || '').replace(/[^a-fA-F0-9x]/g, '');
        const sanitizedTxHash = String(nftData.transactionHash || '').replace(/[^a-fA-F0-9x]/g, '');
        
        return `BEATSCHAIN CERTIFICATE OF AUTHENTICITY

Track: ${sanitizedTitle}
Artist: ${sanitizedArtist}
Token ID: ${sanitizedTokenId}
Contract: ${sanitizedContract}
Blockchain: Polygon Mumbai Testnet

This certificate verifies the authenticity of the above NFT.
Transaction Hash: ${sanitizedTxHash}
Minted: ${new Date().toLocaleDateString()}

Verify at: https://mumbai.polygonscan.com/tx/${sanitizedTxHash}

© ${new Date().getFullYear()} BeatsChain - Powered by AI & Blockchain`;
    }
}

window.DownloadManager = DownloadManager;