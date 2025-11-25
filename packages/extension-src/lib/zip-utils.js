// ZIP Utilities for Chrome Extension - CSP Compliant
class ZipUtils {
    constructor() {
        this.files = new Map();
    }

    // Add file to ZIP archive
    addFile(path, content) {
        this.files.set(path, content);
    }

    // Generate ZIP archive using native browser APIs
    async generateZip() {
        try {
            // Use CompressionStream if available (modern browsers)
            if ('CompressionStream' in window) {
                return await this.createCompressedZip();
            } else {
                // Fallback to uncompressed archive
                return await this.createUncompressedArchive();
            }
        } catch (error) {
            console.error('ZIP generation failed:', error);
            // Final fallback: create text archive
            return this.createTextArchive();
        }
    }

    async createCompressedZip() {
        const files = Array.from(this.files.entries());
        const zipData = [];

        // Create ZIP file structure
        for (const [path, content] of files) {
            const fileData = await this.processFileContent(content);
            const entry = this.createZipEntry(path, fileData);
            zipData.push(entry);
        }

        // Combine all entries
        const totalSize = zipData.reduce((sum, entry) => sum + entry.byteLength, 0);
        const zipBuffer = new Uint8Array(totalSize + 1024); // Extra space for headers
        let offset = 0;

        // Write ZIP entries
        for (const entry of zipData) {
            zipBuffer.set(entry, offset);
            offset += entry.byteLength;
        }

        return new Blob([zipBuffer.slice(0, offset)], { type: 'application/zip' });
    }

    async createUncompressedArchive() {
        // Create a simple archive format
        const files = Array.from(this.files.entries());
        const archiveParts = [];

        archiveParts.push(this.createArchiveHeader());

        for (const [path, content] of files) {
            const fileData = await this.processFileContent(content);
            const fileEntry = this.createFileEntry(path, fileData);
            archiveParts.push(fileEntry);
        }

        return new Blob(archiveParts, { type: 'application/octet-stream' });
    }

    createTextArchive() {
        // Fallback: create a text-based archive
        const files = Array.from(this.files.entries());
        let archiveContent = 'BEATSCHAIN NFT PACKAGE ARCHIVE\\n';
        archiveContent += '================================\\n\\n';

        for (const [path, content] of files) {
            archiveContent += `--- FILE: ${path} ---\\n`;
            if (content instanceof Blob || content instanceof File) {
                archiveContent += '[Binary file - see original download]\\n';
            } else {
                archiveContent += content;
            }
            archiveContent += '\\n\\n';
        }

        archiveContent += '\\n--- END OF ARCHIVE ---\\n';
        archiveContent += 'Note: This is a text representation. For full files, use a modern browser.\\n';

        return new Blob([archiveContent], { type: 'text/plain' });
    }

    async processFileContent(content) {
        if (content instanceof File || content instanceof Blob) {
            return new Uint8Array(await content.arrayBuffer());
        } else if (typeof content === 'string') {
            return new TextEncoder().encode(content);
        } else {
            return new Uint8Array(0);
        }
    }

    createZipEntry(path, data) {
        // Simplified ZIP entry structure
        const pathBytes = new TextEncoder().encode(path);
        const entry = new Uint8Array(30 + pathBytes.length + data.length);
        
        // Local file header signature
        entry[0] = 0x50; entry[1] = 0x4b; entry[2] = 0x03; entry[3] = 0x04;
        
        // Version needed to extract
        entry[4] = 0x14; entry[5] = 0x00;
        
        // File name length
        entry[26] = pathBytes.length & 0xff;
        entry[27] = (pathBytes.length >> 8) & 0xff;
        
        // Uncompressed size
        entry[22] = data.length & 0xff;
        entry[23] = (data.length >> 8) & 0xff;
        entry[24] = (data.length >> 16) & 0xff;
        entry[25] = (data.length >> 24) & 0xff;
        
        // Copy file name
        entry.set(pathBytes, 30);
        
        // Copy file data
        entry.set(data, 30 + pathBytes.length);
        
        return entry;
    }

    createArchiveHeader() {
        const header = 'BEATSCHAIN ARCHIVE v1.0\\n';
        return new Blob([header], { type: 'text/plain' });
    }

    createFileEntry(path, data) {
        const separator = `\\n--- ${path} (${data.length} bytes) ---\\n`;
        return new Blob([separator, data, '\\n'], { type: 'application/octet-stream' });
    }

    // Clear all files
    clear() {
        this.files.clear();
    }

    // Get file count
    getFileCount() {
        return this.files.size;
    }
}

// Export for use in popup
window.ZipUtils = ZipUtils;