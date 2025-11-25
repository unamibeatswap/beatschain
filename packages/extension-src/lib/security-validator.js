/**
 * Security Validator - Input Sanitization and XSS Prevention
 * Follows BeatsChain Extension security patterns
 */
class SecurityValidator {
    constructor() {
        this.htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
    }
    
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        return text.replace(/[&<>"'\/]/g, (s) => this.htmlEntities[s]);
    }
    
    sanitizeSponsorInput(sponsorData) {
        return {
            id: this.sanitizeId(sponsorData.id),
            name: this.escapeHtml(sponsorData.name?.trim() || ''),
            message: this.escapeHtml(sponsorData.message?.trim() || ''),
            website: this.sanitizeUrl(sponsorData.website?.trim() || ''),
            category: this.sanitizeCategory(sponsorData.category)
        };
    }
    
    sanitizeId(id) {
        if (typeof id !== 'string') return '';
        return id.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50);
    }
    
    sanitizeUrl(url) {
        if (!url) return '';
        try {
            const urlObj = new URL(url);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                return urlObj.toString();
            }
        } catch (e) {
            return '';
        }
        return '';
    }
    
    sanitizeCategory(category) {
        const validCategories = [
            'music_services', 'legal_services', 'promotion', 
            'distribution', 'analytics', 'tools', 'other'
        ];
        return validCategories.includes(category) ? category : 'other';
    }
    
    // CRITICAL FIX: Missing sanitizeInput method
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return this.escapeHtml(input.trim());
    }
    
    // Audio file validation - CRITICAL FIX
    async validateAudioFile(file) {
        const errors = [];
        
        if (!file || !file.name) {
            errors.push('No file provided');
            return { isValid: false, errors };
        }
        
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            errors.push('File size exceeds 50MB limit');
        }
        
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
        const validExtensions = ['.mp3', '.wav', '.flac'];
        
        const fileName = file.name.toLowerCase();
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!hasValidExtension) {
            errors.push('Invalid file extension. Allowed: .mp3, .wav, .flac');
        }
        
        if (file.type && !validTypes.includes(file.type) && !hasValidExtension) {
            errors.push('Invalid file type');
        }
        
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.js', '.vbs'];
        if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
            errors.push('Suspicious file extension detected');
        }
        
        if (!/^[a-zA-Z0-9._\-\s]+$/.test(fileName)) {
            errors.push('Filename contains invalid characters');
        }
        
        return { isValid: errors.length === 0, errors };
    }
    
    // Image file validation - CRITICAL FIX
    async validateImageFile(file) {
        const errors = [];
        
        if (!file || !file.name) {
            errors.push('No file provided');
            return { isValid: false, errors };
        }
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            errors.push('Image size exceeds 5MB limit');
        }
        
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        const fileName = file.name.toLowerCase();
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!hasValidExtension) {
            errors.push('Invalid image extension. Allowed: .jpg, .jpeg, .png, .gif, .webp');
        }
        
        if (file.type && !validTypes.includes(file.type) && !hasValidExtension) {
            errors.push('Invalid image type');
        }
        
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.js', '.vbs'];
        if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
            errors.push('Suspicious file extension detected');
        }
        
        return { isValid: errors.length === 0, errors };
    }
}

if (typeof window !== 'undefined') {
    window.SecurityValidator = SecurityValidator;
}