/**
 * Audio Tagging Manager - ISRC Metadata Embedding
 * Phase 2: Audio file ISRC tagging for MP3/WAV
 */

class AudioTaggingManager {
    constructor(isrcManager) {
        this.isrcManager = isrcManager;
        this.supportedFormats = ['MP3', 'WAV'];
    }

    // Check if audio format supports ISRC embedding
    supportsISRCEmbedding(format) {
        return this.supportedFormats.includes(format?.toUpperCase());
    }

    // Extract ISRC from audio file metadata
    async extractISRC(audioFile) {
        try {
            const format = audioFile.name.split('.').pop().toUpperCase();
            
            if (format === 'MP3') {
                return await this.extractISRCFromMP3(audioFile);
            } else if (format === 'WAV') {
                return await this.extractISRCFromWAV(audioFile);
            }
            
            return null;
        } catch (error) {
            console.warn('ISRC extraction failed:', error);
            return null;
        }
    }

    // Extract ISRC from MP3 ID3v2 tags
    async extractISRCFromMP3(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const buffer = new Uint8Array(e.target.result);
                    const isrc = this.parseID3v2ISRC(buffer);
                    resolve(isrc);
                } catch (error) {
                    console.warn('MP3 ISRC parsing failed:', error);
                    resolve(null);
                }
            };
            reader.onerror = () => resolve(null);
            reader.readAsArrayBuffer(file.slice(0, 8192)); // Read first 8KB for ID3 tags
        });
    }

    // Parse ID3v2 tags for ISRC
    parseID3v2ISRC(buffer) {
        // Check for ID3v2 header
        if (buffer[0] !== 0x49 || buffer[1] !== 0x44 || buffer[2] !== 0x33) {
            return null;
        }

        const version = buffer[3];
        const flags = buffer[4];
        const size = this.synchsafeToInt(buffer.slice(6, 10));

        let offset = 10;
        const endOffset = Math.min(10 + size, buffer.length);

        // Look for TSRC frame (ISRC)
        while (offset < endOffset - 10) {
            const frameId = String.fromCharCode(...buffer.slice(offset, offset + 4));
            const frameSize = this.synchsafeToInt(buffer.slice(offset + 4, offset + 8));
            
            if (frameId === 'TSRC') {
                const encoding = buffer[offset + 10];
                const textStart = offset + 11;
                const textEnd = textStart + frameSize - 1;
                
                if (textEnd <= buffer.length) {
                    const isrcBytes = buffer.slice(textStart, textEnd);
                    const isrc = String.fromCharCode(...isrcBytes).replace(/\0/g, '');
                    return isrc.trim();
                }
            }
            
            offset += 10 + frameSize;
        }
        
        return null;
    }

    // Extract ISRC from WAV BWF metadata
    async extractISRCFromWAV(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const buffer = new Uint8Array(e.target.result);
                    const isrc = this.parseWAVISRC(buffer);
                    resolve(isrc);
                } catch (error) {
                    console.warn('WAV ISRC parsing failed:', error);
                    resolve(null);
                }
            };
            reader.onerror = () => resolve(null);
            reader.readAsArrayBuffer(file.slice(0, 16384)); // Read first 16KB for headers
        });
    }

    // Parse WAV file for ISRC in BWF chunk
    parseWAVISRC(buffer) {
        // Check RIFF header
        if (String.fromCharCode(...buffer.slice(0, 4)) !== 'RIFF') {
            return null;
        }

        let offset = 12; // Skip RIFF header
        
        while (offset < buffer.length - 8) {
            const chunkId = String.fromCharCode(...buffer.slice(offset, offset + 4));
            const chunkSize = this.readLittleEndianUint32(buffer, offset + 4);
            
            if (chunkId === 'bext') {
                // BWF Broadcast Extension chunk contains ISRC
                const isrcOffset = offset + 8 + 602; // ISRC is at offset 602 in bext chunk
                if (isrcOffset + 12 <= buffer.length) {
                    const isrcBytes = buffer.slice(isrcOffset, isrcOffset + 12);
                    const isrc = String.fromCharCode(...isrcBytes).replace(/\0/g, '');
                    return isrc.trim() || null;
                }
            }
            
            offset += 8 + chunkSize;
            if (chunkSize % 2) offset++; // Align to even boundary
        }
        
        return null;
    }

    // Create enhanced metadata with ISRC
    async enhanceAudioMetadata(audioFile, existingMetadata) {
        const extractedISRC = await this.extractISRC(audioFile);
        const format = audioFile.name.split('.').pop().toUpperCase();
        
        return {
            ...existingMetadata,
            extractedISRC: extractedISRC,
            hasEmbeddedISRC: !!extractedISRC,
            supportsISRCEmbedding: this.supportsISRCEmbedding(format),
            isrcEmbeddingFormat: format,
            audioTaggingCapable: true
        };
    }

    // Generate ISRC for audio if needed
    async generateISRCForAudio(trackTitle, artistName) {
        if (!this.isrcManager) {
            console.warn('ISRC Manager not available');
            return null;
        }

        try {
            return this.isrcManager.generateISRC(trackTitle, artistName);
        } catch (error) {
            console.error('ISRC generation failed:', error);
            return null;
        }
    }

    // Utility methods
    synchsafeToInt(bytes) {
        return (bytes[0] << 21) | (bytes[1] << 14) | (bytes[2] << 7) | bytes[3];
    }

    readLittleEndianUint32(buffer, offset) {
        return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24);
    }

    // Integration method for existing audio manager
    static enhanceAudioManager(audioManager, isrcManager) {
        if (!audioManager || !isrcManager) return;

        const taggingManager = new AudioTaggingManager(isrcManager);
        
        // Extend extractAudioMetadata method
        const originalExtractMetadata = audioManager.extractAudioMetadata.bind(audioManager);
        
        audioManager.extractAudioMetadata = async function(file, systemId = 'default') {
            const basicMetadata = await originalExtractMetadata(file, systemId);
            return await taggingManager.enhanceAudioMetadata(file, basicMetadata);
        };

        // Add ISRC generation method
        audioManager.generateISRCForAudio = (trackTitle, artistName) => {
            return taggingManager.generateISRCForAudio(trackTitle, artistName);
        };

        // Add ISRC extraction method
        audioManager.extractISRC = (audioFile) => {
            return taggingManager.extractISRC(audioFile);
        };

        console.log('✅ Audio Manager enhanced with ISRC tagging capabilities');
    }
}

window.AudioTaggingManager = AudioTaggingManager;