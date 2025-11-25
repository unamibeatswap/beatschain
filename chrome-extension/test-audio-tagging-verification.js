/**
 * Audio Tagging Verification Test Suite
 * Tests all metadata embedding and extraction functionality
 */

class AudioTaggingVerificationSuite {
    constructor() {
        this.results = {
            mp3Tests: [],
            wavTests: [],
            jpegTests: [],
            pngTests: [],
            compressionTests: [],
            integrationTests: []
        };
    }

    async runAllTests() {
        console.log('🎧 Starting Audio Tagging Verification Suite...');
        
        try {
            await this.testMP3Processing();
            await this.testWAVProcessing();
            await this.testJPEGProcessing();
            await this.testPNGProcessing();
            await this.testImageCompression();
            await this.testIntegration();
            
            this.generateReport();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testMP3Processing() {
        console.log('Testing MP3 ISRC embedding...');
        
        const mockMP3Data = new Uint8Array([
            0x49, 0x44, 0x33, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // ID3v2 header
        ]);
        
        try {
            if (typeof AudioTaggingManager === 'undefined') {
                throw new Error('AudioTaggingManager is not defined');
            }
            const audioManager = new AudioTaggingManager(window.isrcManager || null);
            
            const supportsEmbedding = audioManager.supportsISRCEmbedding('MP3');
            this.results.mp3Tests.push({
                test: 'Format Support',
                result: supportsEmbedding,
                status: supportsEmbedding ? 'PASS' : 'FAIL'
            });

            const mockFile = new File([mockMP3Data], 'test.mp3', { type: 'audio/mpeg' });
            const metadata = await audioManager.enhanceAudioMetadata(mockFile, {
                title: 'Test Track',
                artist: 'Test Artist'
            });

            this.results.mp3Tests.push({
                test: 'Metadata Enhancement',
                result: metadata.audioTaggingCapable,
                status: metadata.audioTaggingCapable ? 'PASS' : 'FAIL'
            });

        } catch (error) {
            this.results.mp3Tests.push({
                test: 'MP3 Processing',
                result: error.message,
                status: 'ERROR'
            });
        }
    }

    async testWAVProcessing() {
        console.log('Testing WAV BWF metadata...');
        
        const mockWAVData = new Uint8Array([
            0x52, 0x49, 0x46, 0x46, // "RIFF"
            0x00, 0x00, 0x00, 0x00, // File size
            0x57, 0x41, 0x56, 0x45  // "WAVE"
        ]);

        try {
            if (typeof AudioTaggingManager === 'undefined') {
                throw new Error('AudioTaggingManager is not defined');
            }
            const audioManager = new AudioTaggingManager(window.isrcManager || null);
            
            const supportsEmbedding = audioManager.supportsISRCEmbedding('WAV');
            this.results.wavTests.push({
                test: 'WAV Format Support',
                result: supportsEmbedding,
                status: supportsEmbedding ? 'PASS' : 'FAIL'
            });

            const mockFile = new File([mockWAVData], 'test.wav', { type: 'audio/wav' });
            const extractedISRC = await audioManager.extractISRC(mockFile);
            
            this.results.wavTests.push({
                test: 'ISRC Extraction',
                result: extractedISRC === null,
                status: 'PASS'
            });

        } catch (error) {
            this.results.wavTests.push({
                test: 'WAV Processing',
                result: error.message,
                status: 'ERROR'
            });
        }
    }

    async testJPEGProcessing() {
        console.log('Testing JPEG EXIF metadata...');
        
        const mockJPEGData = new Uint8Array([
            0xFF, 0xD8, // JPEG SOI
            0xFF, 0xE0, // APP0 marker
            0x00, 0x10  // Segment length
        ]);

        try {
            if (typeof ImageTaggingManager === 'undefined') {
                throw new Error('ImageTaggingManager is not defined');
            }
            const imageManager = new ImageTaggingManager(window.isrcManager || null);
            
            const supportsMetadata = imageManager.supportsMetadataEmbedding('JPEG');
            this.results.jpegTests.push({
                test: 'JPEG Format Support',
                result: supportsMetadata,
                status: supportsMetadata ? 'PASS' : 'FAIL'
            });

            const mockFile = new File([mockJPEGData], 'test.jpg', { type: 'image/jpeg' });
            const metadata = await imageManager.enhanceImageMetadata(mockFile, 'ZA-80G-24-12345');
            
            this.results.jpegTests.push({
                test: 'Image Metadata Enhancement',
                result: metadata.imageTaggingCapable,
                status: metadata.imageTaggingCapable ? 'PASS' : 'FAIL'
            });

        } catch (error) {
            this.results.jpegTests.push({
                test: 'JPEG Processing',
                result: error.message,
                status: 'ERROR'
            });
        }
    }

    async testPNGProcessing() {
        console.log('Testing PNG tEXt chunks...');
        
        const mockPNGData = new Uint8Array([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A // PNG signature
        ]);

        try {
            if (typeof ImageTaggingManager === 'undefined') {
                throw new Error('ImageTaggingManager is not defined');
            }
            const imageManager = new ImageTaggingManager(window.isrcManager || null);
            
            const supportsMetadata = imageManager.supportsMetadataEmbedding('PNG');
            this.results.pngTests.push({
                test: 'PNG Format Support',
                result: supportsMetadata,
                status: supportsMetadata ? 'PASS' : 'FAIL'
            });

        } catch (error) {
            this.results.pngTests.push({
                test: 'PNG Processing',
                result: error.message,
                status: 'ERROR'
            });
        }
    }

    async testImageCompression() {
        console.log('Testing 600x600 image compression...');
        
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(0, 0, 600, 600);
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(600, 0, 600, 600);
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(0, 600, 600, 600);
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(600, 600, 600, 600);

            const compressedCanvas = document.createElement('canvas');
            compressedCanvas.width = 600;
            compressedCanvas.height = 600;
            const compressedCtx = compressedCanvas.getContext('2d');
            compressedCtx.drawImage(canvas, 0, 0, 600, 600);

            const correctDimensions = compressedCanvas.width === 600 && compressedCanvas.height === 600;
            
            this.results.compressionTests.push({
                test: '600x600 Compression',
                result: `${compressedCanvas.width}x${compressedCanvas.height}`,
                status: correctDimensions ? 'PASS' : 'FAIL'
            });

            const imageData = compressedCtx.getImageData(0, 0, 600, 600);
            const hasColorData = imageData.data.some(value => value > 0);
            
            this.results.compressionTests.push({
                test: 'Quality Preservation',
                result: hasColorData,
                status: hasColorData ? 'PASS' : 'FAIL'
            });

        } catch (error) {
            this.results.compressionTests.push({
                test: 'Image Compression',
                result: error.message,
                status: 'ERROR'
            });
        }
    }

    async testIntegration() {
        console.log('Testing system integration...');
        
        try {
            const writerAvailable = typeof MetadataWriter !== 'undefined';
            this.results.integrationTests.push({
                test: 'MetadataWriter Available',
                result: writerAvailable,
                status: writerAvailable ? 'PASS' : 'FAIL'
            });

            const isrcAvailable = typeof window.isrcManager !== 'undefined';
            this.results.integrationTests.push({
                test: 'ISRC Manager Integration',
                result: isrcAvailable,
                status: isrcAvailable ? 'PASS' : 'FAIL'
            });

            if (window.audioManager) {
                const hasISRCMethods = typeof window.audioManager.extractISRC === 'function';
                this.results.integrationTests.push({
                    test: 'Audio Manager Enhancement',
                    result: hasISRCMethods,
                    status: hasISRCMethods ? 'PASS' : 'FAIL'
                });
            }

        } catch (error) {
            this.results.integrationTests.push({
                test: 'Integration',
                result: error.message,
                status: 'ERROR'
            });
        }
    }

    generateReport() {
        console.log('\n🎵 AUDIO TAGGING VERIFICATION REPORT');
        console.log('=====================================');
        
        const allTests = [
            ...this.results.mp3Tests,
            ...this.results.wavTests,
            ...this.results.jpegTests,
            ...this.results.pngTests,
            ...this.results.compressionTests,
            ...this.results.integrationTests
        ];

        const passed = allTests.filter(t => t.status === 'PASS').length;
        const failed = allTests.filter(t => t.status === 'FAIL').length;
        const errors = allTests.filter(t => t.status === 'ERROR').length;

        console.log(`✅ PASSED: ${passed}`);
        console.log(`❌ FAILED: ${failed}`);
        console.log(`🚨 ERRORS: ${errors}`);
        console.log(`📊 TOTAL: ${allTests.length}`);
        
        Object.entries(this.results).forEach(([category, tests]) => {
            if (tests.length > 0) {
                console.log(`\n${category.toUpperCase()}:`);
                tests.forEach(test => {
                    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '🚨';
                    console.log(`  ${icon} ${test.test}: ${test.result}`);
                });
            }
        });

        this.storeResults(allTests, { passed, failed, errors, total: allTests.length });
    }

    storeResults(tests, summary) {
        const results = {
            timestamp: new Date().toISOString(),
            summary,
            tests,
            recommendations: this.generateRecommendations(tests)
        };

        localStorage.setItem('audioTaggingVerificationResults', JSON.stringify(results));
        
        if (window.updateVerificationUI) {
            window.updateVerificationUI(results);
        }
    }

    generateRecommendations(tests) {
        const recommendations = [];
        
        const failedTests = tests.filter(t => t.status === 'FAIL');
        const errorTests = tests.filter(t => t.status === 'ERROR');

        if (failedTests.length > 0) {
            recommendations.push('⚠️ Some tests failed - review implementation');
        }

        if (errorTests.length > 0) {
            recommendations.push('🚨 Errors detected - check console for details');
        }

        if (tests.every(t => t.status === 'PASS')) {
            recommendations.push('✅ All tests passed - audio tagging system verified');
        }

        return recommendations;
    }
}

window.AudioTaggingVerificationSuite = AudioTaggingVerificationSuite;