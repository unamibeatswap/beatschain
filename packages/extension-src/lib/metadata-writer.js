/**
 * Metadata Writer - Embeds metadata into audio and image files
 */

class MetadataWriter {
    constructor() {
        this.supportedAudioFormats = ['MP3', 'WAV'];
        this.supportedImageFormats = ['JPEG', 'JPG', 'PNG'];
    }

    // Write metadata to audio file
    async writeAudioMetadata(file, metadata) {
        const format = file.name.split('.').pop().toUpperCase();
        
        if (format === 'MP3') {
            return await this.writeMp3Metadata(file, metadata);
        } else if (format === 'WAV') {
            return await this.writeWavMetadata(file, metadata);
        }
        
        throw new Error(`Unsupported audio format: ${format}`);
    }

    // Write metadata to image file
    async writeImageMetadata(file, metadata) {
        const format = file.name.split('.').pop().toUpperCase();
        
        if (['JPEG', 'JPG'].includes(format)) {
            return await this.writeJpegMetadata(file, metadata);
        } else if (format === 'PNG') {
            return await this.writePngMetadata(file, metadata);
        }
        
        throw new Error(`Unsupported image format: ${format}`);
    }

    // Write MP3 ID3v2 metadata
    async writeMp3Metadata(file, metadata) {
        const buffer = new Uint8Array(await file.arrayBuffer());
        const newId3 = this.createId3v2Tag(metadata);
        
        // Find existing ID3 tag
        let audioStart = 0;
        if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
            const size = this.synchsafeToInt(buffer.slice(6, 10));
            audioStart = 10 + size;
        }
        
        // Combine new ID3 + audio data
        const audioData = buffer.slice(audioStart);
        const result = new Uint8Array(newId3.length + audioData.length);
        result.set(newId3, 0);
        result.set(audioData, newId3.length);
        
        return new Blob([result], { type: 'audio/mpeg' });
    }

    // Create ID3v2 tag with metadata
    createId3v2Tag(metadata) {
        const frames = [];
        
        // ISRC frame (TSRC)
        if (metadata.isrc) {
            frames.push(this.createTextFrame('TSRC', metadata.isrc));
        }
        
        // Title frame (TIT2)
        if (metadata.title) {
            frames.push(this.createTextFrame('TIT2', metadata.title));
        }
        
        // Artist frame (TPE1)
        if (metadata.artist) {
            frames.push(this.createTextFrame('TPE1', metadata.artist));
        }
        
        // Genre frame (TCON)
        if (metadata.genre) {
            frames.push(this.createTextFrame('TCON', metadata.genre));
        }
        
        // Calculate total size
        const framesSize = frames.reduce((sum, frame) => sum + frame.length, 0);
        const headerSize = 10;
        const totalSize = headerSize + framesSize;
        
        // Create ID3v2 header
        const header = new Uint8Array(10);
        header[0] = 0x49; header[1] = 0x44; header[2] = 0x33; // "ID3"
        header[3] = 0x04; header[4] = 0x00; // Version 2.4
        header[5] = 0x00; // Flags
        this.intToSynchsafe(framesSize, header, 6);
        
        // Combine header + frames
        const result = new Uint8Array(totalSize);
        result.set(header, 0);
        let offset = 10;
        frames.forEach(frame => {
            result.set(frame, offset);
            offset += frame.length;
        });
        
        return result;
    }

    // Create ID3v2 text frame
    createTextFrame(frameId, text) {
        const textBytes = new TextEncoder().encode(text);
        const frame = new Uint8Array(10 + 1 + textBytes.length);
        
        // Frame ID
        for (let i = 0; i < 4; i++) {
            frame[i] = frameId.charCodeAt(i);
        }
        
        // Frame size
        this.intToSynchsafe(1 + textBytes.length, frame, 4);
        
        // Flags
        frame[8] = 0x00; frame[9] = 0x00;
        
        // Encoding (UTF-8)
        frame[10] = 0x03;
        
        // Text data
        frame.set(textBytes, 11);
        
        return frame;
    }

    // Write WAV BWF metadata
    async writeWavMetadata(file, metadata) {
        const buffer = new Uint8Array(await file.arrayBuffer());
        
        // Find data chunk
        let dataOffset = 12;
        while (dataOffset < buffer.length - 8) {
            const chunkId = String.fromCharCode(...buffer.slice(dataOffset, dataOffset + 4));
            const chunkSize = this.readLittleEndianUint32(buffer, dataOffset + 4);
            
            if (chunkId === 'data') {
                break;
            }
            dataOffset += 8 + chunkSize + (chunkSize % 2);
        }
        
        // Create BWF chunk
        const bextChunk = this.createBextChunk(metadata);
        
        // Insert BWF chunk before data
        const result = new Uint8Array(buffer.length + bextChunk.length);
        result.set(buffer.slice(0, dataOffset), 0);
        result.set(bextChunk, dataOffset);
        result.set(buffer.slice(dataOffset), dataOffset + bextChunk.length);
        
        // Update RIFF size
        const newSize = result.length - 8;
        result[4] = newSize & 0xff;
        result[5] = (newSize >> 8) & 0xff;
        result[6] = (newSize >> 16) & 0xff;
        result[7] = (newSize >> 24) & 0xff;
        
        return new Blob([result], { type: 'audio/wav' });
    }

    // Create BWF broadcast extension chunk
    createBextChunk(metadata) {
        const chunk = new Uint8Array(8 + 602);
        
        // Chunk ID "bext"
        chunk[0] = 0x62; chunk[1] = 0x65; chunk[2] = 0x78; chunk[3] = 0x74;
        
        // Chunk size
        this.writeLittleEndianUint32(chunk, 4, 602);
        
        // ISRC at offset 602 in BWF spec (offset 8 + 602 = 610 in our chunk)
        if (metadata.isrc) {
            const isrcBytes = new TextEncoder().encode(metadata.isrc.substring(0, 12));
            chunk.set(isrcBytes, 8 + 602);
        }
        
        return chunk;
    }

    // Write JPEG EXIF metadata
    async writeJpegMetadata(file, metadata) {
        const buffer = new Uint8Array(await file.arrayBuffer());
        
        // Find APP1 segment or insert after SOI
        let insertPos = 2; // After SOI marker
        
        // Skip existing APP segments
        while (insertPos < buffer.length - 1) {
            if (buffer[insertPos] === 0xFF && (buffer[insertPos + 1] & 0xF0) === 0xE0) {
                const segmentLength = (buffer[insertPos + 2] << 8) | buffer[insertPos + 3];
                insertPos += 2 + segmentLength;
            } else {
                break;
            }
        }
        
        // Create EXIF segment
        const exifSegment = this.createExifSegment(metadata);
        
        // Insert EXIF segment
        const result = new Uint8Array(buffer.length + exifSegment.length);
        result.set(buffer.slice(0, insertPos), 0);
        result.set(exifSegment, insertPos);
        result.set(buffer.slice(insertPos), insertPos + exifSegment.length);
        
        return new Blob([result], { type: 'image/jpeg' });
    }

    // Create EXIF segment with ISRC in UserComment
    createExifSegment(metadata) {
        const comment = `ISRC:${metadata.isrc || ''}`;
        const commentBytes = new TextEncoder().encode(comment);
        const segmentSize = 20 + commentBytes.length;
        
        const segment = new Uint8Array(segmentSize);
        
        // APP1 marker
        segment[0] = 0xFF; segment[1] = 0xE1;
        
        // Segment length
        segment[2] = (segmentSize - 2) >> 8;
        segment[3] = (segmentSize - 2) & 0xFF;
        
        // EXIF identifier
        segment.set([0x45, 0x78, 0x69, 0x66, 0x00, 0x00], 4);
        
        // TIFF header (little endian)
        segment.set([0x49, 0x49, 0x2A, 0x00], 10);
        
        // IFD offset
        segment[14] = 0x08; segment[15] = 0x00; segment[16] = 0x00; segment[17] = 0x00;
        
        // UserComment tag data
        segment.set(commentBytes, 18);
        
        return segment;
    }

    // Write PNG metadata
    async writePngMetadata(file, metadata) {
        const buffer = new Uint8Array(await file.arrayBuffer());
        
        // Find IDAT chunk
        let idatPos = 8; // After PNG signature
        while (idatPos < buffer.length - 8) {
            const chunkType = String.fromCharCode(...buffer.slice(idatPos + 4, idatPos + 8));
            if (chunkType === 'IDAT') break;
            
            const chunkLength = this.readBigEndianUint32(buffer, idatPos);
            idatPos += 12 + chunkLength; // Length + Type + Data + CRC
        }
        
        // Create tEXt chunk with ISRC
        const textChunk = this.createPngTextChunk('ISRC', metadata.isrc || '');
        
        // Insert before IDAT
        const result = new Uint8Array(buffer.length + textChunk.length);
        result.set(buffer.slice(0, idatPos), 0);
        result.set(textChunk, idatPos);
        result.set(buffer.slice(idatPos), idatPos + textChunk.length);
        
        return new Blob([result], { type: 'image/png' });
    }

    // Create PNG tEXt chunk
    createPngTextChunk(keyword, text) {
        const keywordBytes = new TextEncoder().encode(keyword);
        const textBytes = new TextEncoder().encode(text);
        const dataLength = keywordBytes.length + 1 + textBytes.length;
        
        const chunk = new Uint8Array(12 + dataLength);
        
        // Length
        this.writeBigEndianUint32(chunk, 0, dataLength);
        
        // Type "tEXt"
        chunk.set([0x74, 0x45, 0x58, 0x74], 4);
        
        // Data: keyword + null separator + text
        chunk.set(keywordBytes, 8);
        chunk[8 + keywordBytes.length] = 0x00;
        chunk.set(textBytes, 8 + keywordBytes.length + 1);
        
        // CRC32 (simplified - just use 0 for minimal implementation)
        chunk.set([0x00, 0x00, 0x00, 0x00], 8 + dataLength);
        
        return chunk;
    }

    // Utility methods
    synchsafeToInt(bytes) {
        return (bytes[0] << 21) | (bytes[1] << 14) | (bytes[2] << 7) | bytes[3];
    }

    intToSynchsafe(value, buffer, offset) {
        buffer[offset] = (value >> 21) & 0x7F;
        buffer[offset + 1] = (value >> 14) & 0x7F;
        buffer[offset + 2] = (value >> 7) & 0x7F;
        buffer[offset + 3] = value & 0x7F;
    }

    readLittleEndianUint32(buffer, offset) {
        return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24);
    }

    writeLittleEndianUint32(buffer, offset, value) {
        buffer[offset] = value & 0xff;
        buffer[offset + 1] = (value >> 8) & 0xff;
        buffer[offset + 2] = (value >> 16) & 0xff;
        buffer[offset + 3] = (value >> 24) & 0xff;
    }

    readBigEndianUint32(buffer, offset) {
        return (buffer[offset] << 24) | (buffer[offset + 1] << 16) | (buffer[offset + 2] << 8) | buffer[offset + 3];
    }

    writeBigEndianUint32(buffer, offset, value) {
        buffer[offset] = (value >> 24) & 0xff;
        buffer[offset + 1] = (value >> 16) & 0xff;
        buffer[offset + 2] = (value >> 8) & 0xff;
        buffer[offset + 3] = value & 0xff;
    }
}

window.MetadataWriter = MetadataWriter;