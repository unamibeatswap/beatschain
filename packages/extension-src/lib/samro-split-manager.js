/**
 * SAMRO Split Manager - Official Split Sheet Integration
 * Based on SAMRO Composer Split Confirmation Form
 */

class SAMROSplitManager {
    constructor(isrcManager) {
        this.isrcManager = isrcManager;
        this.splitData = null;
    }

    // Generate split sheet based on SAMRO template
    generateSplitSheet(trackData, contributors) {
        const splitSheet = {
            // Track Information
            trackTitle: trackData.title || '',
            isrc: trackData.isrc || '',
            duration: trackData.duration || '',
            recordingDate: trackData.recordingDate || new Date().toISOString().split('T')[0],
            
            // Contributors with splits
            contributors: contributors.map(c => ({
                name: c.name || '',
                role: c.role || 'Composer', // Composer, Lyricist, Producer, etc.
                percentage: c.percentage || 0,
                ipi: c.ipi || '',
                samroMember: c.samroMember || false
            })),
            
            // Validation
            totalPercentage: contributors.reduce((sum, c) => sum + (c.percentage || 0), 0),
            
            // Metadata
            generated: new Date().toISOString(),
            formVersion: 'SAMRO-2024'
        };

        this.splitData = splitSheet;
        return splitSheet;
    }

    // Validate split percentages
    validateSplits(contributors) {
        const total = contributors.reduce((sum, c) => sum + (c.percentage || 0), 0);
        return {
            valid: total === 100,
            total: total,
            errors: total !== 100 ? [`Total must equal 100% (currently ${total}%)`] : []
        };
    }

    // Export as SAMRO-compliant format
    exportSAMROFormat() {
        if (!this.splitData) return null;

        return {
            // SAMRO Required Fields
            work_title: this.splitData.trackTitle,
            isrc_code: this.splitData.isrc,
            duration_minutes: this.splitData.duration,
            recording_date: this.splitData.recordingDate,
            
            // Contributors
            composers: this.splitData.contributors.filter(c => c.role === 'Composer'),
            lyricists: this.splitData.contributors.filter(c => c.role === 'Lyricist'),
            publishers: this.splitData.contributors.filter(c => c.role === 'Publisher'),
            
            // Confirmation
            total_percentage: this.splitData.totalPercentage,
            confirmed: this.splitData.totalPercentage === 100,
            form_type: 'COMPOSER_SPLIT_CONFIRMATION'
        };
    }

    // Integration with existing systems
    static enhanceApp(app) {
        if (!app.isrcManager) return;

        const splitManager = new SAMROSplitManager(app.isrcManager);
        app.samroSplitManager = splitManager;

        // Add split sheet generation to package creation
        const originalGeneratePackage = app.generatePackage?.bind(app);
        if (originalGeneratePackage) {
            app.generatePackage = function() {
                const result = originalGeneratePackage();
                
                // Add split sheet if contributors exist
                if (this.contributors && this.contributors.length > 0) {
                    const trackData = {
                        title: this.userInputManager?.getValue('radio-title', '', ''),
                        isrc: this.userInputManager?.getValue('radio-isrc', '', ''),
                        duration: this.radioMetadata?.duration || ''
                    };
                    
                    const splitSheet = splitManager.generateSplitSheet(trackData, this.contributors);
                    result.splitSheet = splitManager.exportSAMROFormat();
                }
                
                return result;
            };
        }

        console.log('✅ SAMRO Split Manager integrated');
    }
}

window.SAMROSplitManager = SAMROSplitManager;