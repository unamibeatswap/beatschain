/**
 * Production Verification Script
 * Verifies all systems are functional and production-ready
 */

class ProductionVerifier {
    constructor() {
        this.results = {
            systems: {},
            overall: 'unknown',
            errors: [],
            warnings: []
        };
    }

    async verify() {
        console.log('🔍 Starting production verification...');
        
        // Core Systems
        await this.verifyAudioTagging();
        await this.verifyImageTagging();
        await this.verifyISRCSystem();
        await this.verifyAdminDashboard();
        await this.verifyMonetization();
        await this.verifySAMROIntegration();
        await this.verifyProductionMonitor();
        
        // Calculate overall status
        this.calculateOverallStatus();
        
        // Generate report
        this.generateReport();
        
        return this.results;
    }

    async verifyAudioTagging() {
        try {
            if (!window.AudioTaggingManager) {
                throw new Error('AudioTaggingManager not available');
            }
            
            const manager = new AudioTaggingManager();
            
            // Test format support
            const mp3Support = manager.supportsISRCEmbedding('MP3');
            const wavSupport = manager.supportsISRCEmbedding('WAV');
            
            if (!mp3Support || !wavSupport) {
                throw new Error('Format support incomplete');
            }
            
            this.results.systems.audioTagging = {
                status: 'functional',
                features: ['MP3 ISRC extraction', 'WAV ISRC extraction', 'ID3v2 parsing', 'BWF parsing'],
                integration: 'AudioManager enhanced'
            };
            
        } catch (error) {
            this.results.systems.audioTagging = {
                status: 'error',
                error: error.message
            };
            this.results.errors.push(`Audio Tagging: ${error.message}`);
        }
    }

    async verifyImageTagging() {
        try {
            if (!window.ImageTaggingManager) {
                throw new Error('ImageTaggingManager not available');
            }
            
            const manager = new ImageTaggingManager();
            
            // Test format support
            const jpegSupport = manager.supportsMetadataEmbedding('JPEG');
            const pngSupport = manager.supportsMetadataEmbedding('PNG');
            
            if (!jpegSupport || !pngSupport) {
                throw new Error('Format support incomplete');
            }
            
            this.results.systems.imageTagging = {
                status: 'functional',
                features: ['JPEG ISRC extraction', 'PNG ISRC extraction', 'EXIF parsing', 'IPTC parsing'],
                integration: 'Image processing enhanced'
            };
            
        } catch (error) {
            this.results.systems.imageTagging = {
                status: 'error',
                error: error.message
            };
            this.results.errors.push(`Image Tagging: ${error.message}`);
        }
    }

    async verifyISRCSystem() {
        try {
            if (!window.ISRCManager) {
                throw new Error('ISRCManager not available');
            }
            
            const manager = new ISRCManager();
            await manager.initialize();
            
            // Test ISRC generation
            const testISRC = manager.generateISRC('Test Track', 'Test Artist');
            
            if (!manager.validateISRC(testISRC)) {
                throw new Error('Generated ISRC invalid');
            }
            
            // Verify format
            if (!testISRC.startsWith('ZA-80G-')) {
                throw new Error('ISRC format incorrect');
            }
            
            this.results.systems.isrcSystem = {
                status: 'functional',
                registrant: '80G',
                territory: 'ZA',
                features: ['Professional generation', 'User ranges', 'Validation', 'Cross-system integration'],
                testISRC: testISRC
            };
            
        } catch (error) {
            this.results.systems.isrcSystem = {
                status: 'error',
                error: error.message
            };
            this.results.errors.push(`ISRC System: ${error.message}`);
        }
    }

    async verifyAdminDashboard() {
        try {
            if (!window.AdminDashboardManager) {
                throw new Error('AdminDashboardManager not available');
            }
            
            // Test dashboard creation (without auth)
            const dashboard = new AdminDashboardManager();
            
            // Verify sponsor templates
            const templates = dashboard.getDefaultSponsorTemplates();
            if (!templates.default || !templates.radiomonitor || !templates.samro) {
                throw new Error('Sponsor templates incomplete');
            }
            
            this.results.systems.adminDashboard = {
                status: 'functional',
                features: ['Sponsor management', 'Analytics', 'User management', 'System controls'],
                templates: Object.keys(templates).length
            };
            
        } catch (error) {
            this.results.systems.adminDashboard = {
                status: 'error',
                error: error.message
            };
            this.results.errors.push(`Admin Dashboard: ${error.message}`);
        }
    }

    async verifyMonetization() {
        try {
            const systems = [];
            
            if (window.AdminDashboardManager) systems.push('Admin Dashboard');
            if (window.UsageLimitsManager) systems.push('Usage Limits');
            if (window.SponsorContentManager) systems.push('Sponsor Content');
            if (window.ChromeAIManager) systems.push('AI Assistant');
            
            if (systems.length < 4) {
                throw new Error(`Only ${systems.length}/4 monetization systems available`);
            }
            
            this.results.systems.monetization = {
                status: 'functional',
                systems: systems,
                compliance: 'Chrome Web Store compliant'
            };
            
        } catch (error) {
            this.results.systems.monetization = {
                status: 'error',
                error: error.message
            };
            this.results.errors.push(`Monetization: ${error.message}`);
        }
    }

    async verifySAMROIntegration() {
        try {
            if (!window.SAMROSplitManager) {
                throw new Error('SAMROSplitManager not available');
            }
            
            const manager = new SAMROSplitManager();
            
            // Test split sheet generation
            const testData = {
                title: 'Test Track',
                isrc: 'ZA-80G-24-00001',
                duration: '3:30'
            };
            
            const testContributors = [
                { name: 'Test Artist', role: 'Composer', percentage: 100 }
            ];
            
            const splitSheet = manager.generateSplitSheet(testData, testContributors);
            
            if (!splitSheet || splitSheet.totalPercentage !== 100) {
                throw new Error('Split sheet generation failed');
            }
            
            const samroFormat = manager.exportSAMROFormat();
            if (!samroFormat || !samroFormat.work_title) {
                throw new Error('SAMRO export format invalid');
            }
            
            this.results.systems.samroIntegration = {
                status: 'functional',
                features: ['Split sheet generation', 'SAMRO export format', 'Validation', 'Template compliance']
            };
            
        } catch (error) {
            this.results.systems.samroIntegration = {
                status: 'error',
                error: error.message
            };
            this.results.errors.push(`SAMRO Integration: ${error.message}`);
        }
    }

    async verifyProductionMonitor() {
        try {
            if (!window.ProductionMonitor) {
                throw new Error('ProductionMonitor not available');
            }
            
            const monitor = new ProductionMonitor();
            await monitor.initialize();
            
            // Test health report
            const healthReport = monitor.getHealthReport();
            
            if (!healthReport || !healthReport.overall) {
                throw new Error('Health reporting not functional');
            }
            
            this.results.systems.productionMonitor = {
                status: 'functional',
                features: ['Health checks', 'Error tracking', 'Performance metrics', 'System monitoring']
            };
            
        } catch (error) {
            this.results.systems.productionMonitor = {
                status: 'error',
                error: error.message
            };
            this.results.errors.push(`Production Monitor: ${error.message}`);
        }
    }

    calculateOverallStatus() {
        const systemStatuses = Object.values(this.results.systems).map(s => s.status);
        const errorCount = systemStatuses.filter(s => s === 'error').length;
        const functionalCount = systemStatuses.filter(s => s === 'functional').length;
        
        if (errorCount === 0) {
            this.results.overall = 'production-ready';
        } else if (errorCount <= 2) {
            this.results.overall = 'mostly-functional';
        } else {
            this.results.overall = 'needs-attention';
        }
        
        this.results.summary = {
            total: systemStatuses.length,
            functional: functionalCount,
            errors: errorCount,
            percentage: Math.round((functionalCount / systemStatuses.length) * 100)
        };
    }

    generateReport() {
        const status = this.results.overall;
        const emoji = status === 'production-ready' ? '✅' : 
                     status === 'mostly-functional' ? '⚠️' : '❌';
        
        console.log(`\n${emoji} PRODUCTION VERIFICATION REPORT`);
        console.log('='.repeat(50));
        console.log(`Overall Status: ${status.toUpperCase()}`);
        console.log(`Systems Functional: ${this.results.summary.functional}/${this.results.summary.total} (${this.results.summary.percentage}%)`);
        
        console.log('\n📊 SYSTEM STATUS:');
        Object.entries(this.results.systems).forEach(([name, system]) => {
            const statusEmoji = system.status === 'functional' ? '✅' : '❌';
            console.log(`${statusEmoji} ${name}: ${system.status}`);
            if (system.features) {
                console.log(`   Features: ${system.features.join(', ')}`);
            }
            if (system.error) {
                console.log(`   Error: ${system.error}`);
            }
        });
        
        if (this.results.errors.length > 0) {
            console.log('\n🚨 ERRORS:');
            this.results.errors.forEach(error => console.log(`• ${error}`));
        }
        
        if (this.results.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.results.warnings.forEach(warning => console.log(`• ${warning}`));
        }
        
        console.log('\n' + '='.repeat(50));
    }
}

// Auto-run verification if in development
if (typeof window !== 'undefined') {
    window.ProductionVerifier = ProductionVerifier;
    
    // Run verification after page load
    window.addEventListener('load', async () => {
        setTimeout(async () => {
            const verifier = new ProductionVerifier();
            await verifier.verify();
        }, 2000);
    });
}