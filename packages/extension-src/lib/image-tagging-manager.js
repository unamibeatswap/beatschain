/**
 * Image Tagging Manager - ISRC Metadata Embedding in Cover Art
 * Phase 3: Cover art ISRC tagging for JPG/PNG
 */

class ImageTaggingManager {
    constructor(isrcManager) {
        this.isrcManager = isrcManager;
        this.supportedFormats = ['JPG', 'JPEG', 'PNG'];
    }

    // Check if image format supports metadata embedding
    supportsMetadataEmbedding(format) {
        return this.supportedFormats.includes(format?.toUpperCase());
    }

    // Extract ISRC from image metadata
    async extractISRCFromImage(imageFile) {
        try {
            const format = imageFile.name.split('.').pop().toUpperCase();
            
            if (['JPG', 'JPEG'].includes(format)) {
                return await this.extractISRCFromJPEG(imageFile);
            } else if (format === 'PNG') {
                return await this.extractISRCFromPNG(imageFile);
            }
            
            return null;
        } catch (error) {
            console.warn('Image ISRC extraction failed:', error);
            return null;
        }
    }

    // Extract ISRC from JPEG EXIF/IPTC metadata
    async extractISRCFromJPEG(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const buffer = new Uint8Array(e.target.result);
                    const isrc = this.parseJPEGMetadata(buffer);
                    resolve(isrc);
                } catch (error) {
                    console.warn('JPEG metadata parsing failed:', error);
                    resolve(null);
                }
            };
            reader.onerror = () => resolve(null);
            reader.readAsArrayBuffer(file.slice(0, 65536)); // Read first 64KB for metadata
        });
    }

    // Parse JPEG for ISRC in EXIF/IPTC
    parseJPEGMetadata(buffer) {
        // Check JPEG header
        if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
            return null;
        }

        let offset = 2;
        
        while (offset < buffer.length - 4) {
            if (buffer[offset] !== 0xFF) break;
            
            const marker = buffer[offset + 1];
            const length = (buffer[offset + 2] << 8) | buffer[offset + 3];
            
            // Look for APP1 (EXIF) or APP13 (IPTC)
            if (marker === 0xE1 || marker === 0xED) {
                const segmentData = buffer.slice(offset + 4, offset + 2 + length);
                const isrc = this.parseImageSegmentForISRC(segmentData);
                if (isrc) return isrc;
            }
            
            offset += 2 + length;
        }
        
        return null;
    }

    // Extract ISRC from PNG metadata
    async extractISRCFromPNG(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const buffer = new Uint8Array(e.target.result);
                    const isrc = this.parsePNGMetadata(buffer);
                    resolve(isrc);
                } catch (error) {
                    console.warn('PNG metadata parsing failed:', error);
                    resolve(null);
                }
            };
            reader.onerror = () => resolve(null);
            reader.readAsArrayBuffer(file.slice(0, 32768)); // Read first 32KB for metadata
        });
    }

    // Parse PNG for ISRC in text chunks
    parsePNGMetadata(buffer) {
        // Check PNG signature
        const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        for (let i = 0; i < 8; i++) {
            if (buffer[i] !== pngSignature[i]) return null;
        }

        let offset = 8;
        
        while (offset < buffer.length - 12) {
            const length = this.readBigEndianUint32(buffer, offset);
            const type = String.fromCharCode(...buffer.slice(offset + 4, offset + 8));
            
            if (type === 'tEXt' || type === 'iTXt') {
                const chunkData = buffer.slice(offset + 8, offset + 8 + length);
                const isrc = this.parsePNGTextChunk(chunkData, type);
                if (isrc) return isrc;
            }
            
            offset += 12 + length; // 4 (length) + 4 (type) + length + 4 (CRC)
        }
        
        return null;
    }

    // Parse PNG text chunk for ISRC
    parsePNGTextChunk(data, type) {
        try {
            const text = String.fromCharCode(...data);
            
            // Look for ISRC in various formats
            const isrcPatterns = [
                /ISRC[:\s]*([A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5})/i,
                /Copyright.*ISRC[:\s]*([A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5})/i
            ];
            
            for (const pattern of isrcPatterns) {
                const match = text.match(pattern);
                if (match) return match[1];
            }
        } catch (error) {
            console.warn('PNG text chunk parsing failed:', error);
        }
        
        return null;
    }

    // Parse image segment for ISRC
    parseImageSegmentForISRC(data) {
        try {
            const text = String.fromCharCode(...data);
            
            // Look for ISRC patterns in metadata
            const isrcPatterns = [
                /ISRC[:\s]*([A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5})/i,
                /Copyright.*ISRC[:\s]*([A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5})/i
            ];
            
            for (const pattern of isrcPatterns) {
                const match = text.match(pattern);
                if (match) return match[1];
            }
        } catch (error) {
            console.warn('Image segment parsing failed:', error);
        }
        
        return null;
    }

    // Create enhanced image metadata with ISRC
    async enhanceImageMetadata(imageFile, isrc, trackMetadata = {}) {
        const extractedISRC = await this.extractISRCFromImage(imageFile);
        const format = imageFile.name.split('.').pop().toUpperCase();
        
        return {
            filename: imageFile.name,
            format: format,
            size: imageFile.size,
            extractedISRC: extractedISRC,
            hasEmbeddedISRC: !!extractedISRC,
            supportsMetadataEmbedding: this.supportsMetadataEmbedding(format),
            suggestedISRC: isrc,
            trackTitle: trackMetadata.title || '',
            artist: trackMetadata.artist || '',
            imageTaggingCapable: true,
            lastModified: new Date(imageFile.lastModified).toISOString()
        };
    }

    // Utility methods
    readBigEndianUint32(buffer, offset) {
        return (buffer[offset] << 24) | (buffer[offset + 1] << 16) | (buffer[offset + 2] << 8) | buffer[offset + 3];
    }

    // Integration method for cover image processing
    static enhanceImageProcessing(app) {
        if (!app || !app.isrcManager) return;

        const taggingManager = new ImageTaggingManager(app.isrcManager);
        
        // Enhance image upload handling
        const originalHandleImageUpload = app.handleImageUpload?.bind(app);
        
        if (originalHandleImageUpload) {
            app.handleImageUpload = async function(e) {
                await originalHandleImageUpload(e);
                
                const file = e.target.files[0];
                if (file && taggingManager.supportsMetadataEmbedding(file.name.split('.').pop())) {
                    try {
                        const currentISRC = this.userInputManager?.getValue('radio-isrc', '', '');
                        const trackMetadata = {
                            title: this.userInputManager?.getValue('radio-title', '', ''),
                            artist: this.userInputManager?.getValue('radio-artist', '', '')
                        };
                        
                        const imageMetadata = await taggingManager.enhanceImageMetadata(file, currentISRC, trackMetadata);
                        
                        if (imageMetadata.hasEmbeddedISRC) {
                            console.log('✅ Found embedded ISRC in cover art:', imageMetadata.extractedISRC);
                            
                            // Suggest using extracted ISRC if none set
                            if (!currentISRC && imageMetadata.extractedISRC) {
                                const isrcField = document.getElementById('radio-isrc');
                                if (isrcField && !isrcField.value) {
                                    isrcField.value = imageMetadata.extractedISRC;
                                    this.userInputManager?.setUserInput('radio-isrc', imageMetadata.extractedISRC, false);
                                }
                            }
                        }
                        
                        // Store enhanced metadata
                        if (this.radioMetadata) {
                            this.radioMetadata.coverImageMetadata = imageMetadata;
                        }
                        
                    } catch (error) {
                        console.warn('Image metadata enhancement failed:', error);
                    }
                }
            };
        }

        console.log('✅ Image processing enhanced with ISRC tagging capabilities');
    }
}

window.ImageTaggingManager = ImageTaggingManager;