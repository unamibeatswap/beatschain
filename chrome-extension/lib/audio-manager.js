// Audio Manager - Centralized Audio Handling with Security
class AudioManager {
    constructor() {
        this.activeAudioElements = new Map();
        this.activeUrls = new Set();
        this.audioContexts = new Map();
    }
    
    // Comprehensive security validation using SecurityValidator
    async validateAudioFile(file) {
        if (!window.SecurityValidator) {
            console.warn('SecurityValidator not available, using basic validation');
            return this.basicValidateAudioFile(file);
        }
        
        const securityValidator = new SecurityValidator();
        const validation = await securityValidator.validateAudioFile(file);
        
        if (!validation.isValid) {
            console.error('Audio file validation failed:', validation.errors);
            // Show user-friendly error with file details
            const errorMsg = validation.errors[0] || 'File validation failed';
            console.log('File details:', {
                name: file.name,
                type: file.type,
                size: file.size,
                extension: file.name.split('.').pop()
            });
            throw new Error(errorMsg);
        }
        
        return validation.isValid;
    }
    
    // Fallback basic validation
    basicValidateAudioFile(file) {
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
        const validExtensions = ['.mp3', '.wav', '.flac'];
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        if (!file || !file.name) {
            console.error('No file or filename provided');
            return false;
        }
        
        const fileName = file.name.toLowerCase();
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!hasValidExtension) {
            console.error('Invalid extension:', fileName, 'Valid:', validExtensions);
            return false;
        }
        
        if (file.type && !validTypes.includes(file.type)) {
            console.warn('MIME type mismatch:', file.type, 'but extension is valid');
            // Allow if extension is valid (some browsers report wrong MIME)
        }
        
        if (file.size > maxSize) {
            console.error('File too large:', file.size, 'Max:', maxSize);
            return false;
        }
        
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.js', '.vbs'];
        if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
            console.error('Suspicious extension detected:', fileName);
            return false;
        }
        
        return true;
    }
    
    // Secure metadata extraction with comprehensive validation
    async extractAudioMetadata(file, systemId = 'default') {
        return new Promise(async (resolve, reject) => {
            try {
                const isValid = await this.validateAudioFile(file);
                if (!isValid) {
                    reject(new Error('Audio file validation failed'));
                    return;
                }
            } catch (error) {
                reject(error);
                return;
            }
            
            const audio = new Audio();
            const url = URL.createObjectURL(file);
            
            // Track URL for cleanup
            this.activeUrls.add(url);
            
            const cleanup = () => {
                URL.revokeObjectURL(url);
                this.activeUrls.delete(url);
                audio.removeEventListener('loadedmetadata', onMetadata);
                audio.removeEventListener('error', onError);
            };
            
            const onMetadata = () => {
                try {
                    const fileName = this.sanitizeString(file.name.replace(/\.[^/.]+$/, ""));
                    const fileExt = file.name.split('.').pop().toUpperCase();
                    const bitrate = this.estimateBitrate(file.size, audio.duration);
                    const quality = this.getQualityLevel(bitrate, fileExt);
                    
                    const metadata = {
                        title: fileName,
                        originalFileName: this.sanitizeString(file.name),
                        duration: this.formatDuration(audio.duration),
                        durationSeconds: Math.round(audio.duration),
                        fileSize: this.formatFileSize(file.size),
                        fileSizeBytes: file.size,
                        format: fileExt,
                        mimeType: file.type,
                        estimatedBitrate: bitrate,
                        qualityLevel: quality,
                        estimatedBPM: this.estimateBPM(fileName),
                        suggestedGenre: this.inferGenre(fileName),
                        energyLevel: this.inferEnergyLevel(fileName, audio.duration),
                        createdDate: new Date().toISOString(),
                        uploadTimestamp: Date.now(),
                        systemId: systemId
                    };
                    
                    cleanup();
                    resolve(metadata);
                } catch (error) {
                    cleanup();
                    reject(error);
                }
            };
            
            const onError = () => {
                cleanup();
                reject(new Error('Failed to load audio metadata'));
            };
            
            audio.addEventListener('loadedmetadata', onMetadata);
            audio.addEventListener('error', onError);
            
            // Set timeout for metadata loading
            setTimeout(() => {
                if (audio.readyState === 0) {
                    cleanup();
                    reject(new Error('Audio metadata loading timeout'));
                }
            }, 10000);
            
            audio.src = url;
        });
    }
    
    // Secure audio preview creation
    createAudioPreview(file, containerId, systemId = 'default') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return null;
        }
        
        // Clean up existing audio in this container
        this.cleanupAudioInContainer(containerId);
        
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.style.width = '100%';
        audio.style.maxWidth = '100%';
        audio.preload = 'metadata';
        
        const url = URL.createObjectURL(file);
        this.activeUrls.add(url);
        
        audio.src = url;
        audio.dataset.systemId = systemId;
        audio.dataset.containerId = containerId;
        
        // Track audio element
        this.activeAudioElements.set(`${systemId}-${containerId}`, {
            element: audio,
            url: url,
            container: container
        });
        
        // Add cleanup on audio end
        audio.addEventListener('ended', () => {
            this.pauseAudio(`${systemId}-${containerId}`);
        });
        
        container.innerHTML = '';
        container.appendChild(audio);
        
        return audio;
    }
    
    // Audio playback control
    pauseAudio(audioId) {
        const audioData = this.activeAudioElements.get(audioId);
        if (audioData && audioData.element) {
            audioData.element.pause();
            audioData.element.currentTime = 0;
        }
    }
    
    pauseAllAudio() {
        this.activeAudioElements.forEach((audioData, audioId) => {
            this.pauseAudio(audioId);
        });
    }
    
    // Cleanup methods
    cleanupAudioInContainer(containerId) {
        const toRemove = [];
        this.activeAudioElements.forEach((audioData, audioId) => {
            if (audioData.container && audioData.container.id === containerId) {
                this.pauseAudio(audioId);
                if (audioData.url) {
                    URL.revokeObjectURL(audioData.url);
                    this.activeUrls.delete(audioData.url);
                }
                toRemove.push(audioId);
            }
        });
        
        toRemove.forEach(audioId => {
            this.activeAudioElements.delete(audioId);
        });
    }
    
    cleanupSystem(systemId) {
        const toRemove = [];
        this.activeAudioElements.forEach((audioData, audioId) => {
            if (audioId.startsWith(systemId)) {
                this.pauseAudio(audioId);
                if (audioData.url) {
                    URL.revokeObjectURL(audioData.url);
                    this.activeUrls.delete(audioData.url);
                }
                toRemove.push(audioId);
            }
        });
        
        toRemove.forEach(audioId => {
            this.activeAudioElements.delete(audioId);
        });
    }
    
    cleanupAll() {
        this.activeAudioElements.forEach((audioData, audioId) => {
            this.pauseAudio(audioId);
            if (audioData.url) {
                URL.revokeObjectURL(audioData.url);
            }
        });
        
        this.activeUrls.forEach(url => {
            URL.revokeObjectURL(url);
        });
        
        this.activeAudioElements.clear();
        this.activeUrls.clear();
        this.audioContexts.clear();
    }
    
    // Enhanced security validation for images
    async validateImageFile(file) {
        if (!window.SecurityValidator) {
            console.warn('SecurityValidator not available for image validation');
            return file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
        }
        
        const securityValidator = new SecurityValidator();
        const validation = await securityValidator.validateImageFile(file);
        
        if (!validation.isValid) {
            console.error('Image file validation failed:', validation.errors);
            throw new Error(validation.errors[0] || 'Image validation failed');
        }
        
        return validation.isValid;
    }
    
    // Utility methods with enhanced security
    sanitizeString(str) {
        if (!window.SecurityValidator) {
            // Fallback sanitization
            if (!str) return '';
            try {
                return String(str)
                    .replace(/[<>"'&]/g, function(match) {
                        const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
                        return map[match] || match;
                    })
                    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
                    .trim()
                    .substring(0, 200);
            } catch (error) {
                console.error('String sanitization error:', error);
                return String(str).substring(0, 200);
            }
        }
        
        try {
            const securityValidator = new SecurityValidator();
            return securityValidator.sanitizeInput(str);
        } catch (error) {
            console.error('SecurityValidator error:', error);
            return String(str).substring(0, 200);
        }
    }
    
    estimateBitrate(fileSize, duration) {
        if (!duration || duration === 0) return 'Unknown';
        const bitrate = Math.round((fileSize * 8) / (duration * 1000));
        return `${bitrate} kbps`;
    }
    
    getQualityLevel(bitrate, format) {
        const rate = parseInt(bitrate);
        if (format === 'FLAC' || format === 'WAV') return 'Lossless';
        if (rate >= 320) return 'High (320+ kbps)';
        if (rate >= 192) return 'Medium (192-319 kbps)';
        if (rate >= 128) return 'Standard (128-191 kbps)';
        return 'Low (<128 kbps)';
    }
    
    estimateBPM(fileName) {
        const bpmMatch = fileName.match(/(\d{2,3})\s*bpm/i);
        if (bpmMatch) return `${bpmMatch[1]} BPM`;
        
        const name = fileName.toLowerCase();
        if (name.includes('slow') || name.includes('chill')) return '70-90 BPM (Slow)';
        if (name.includes('trap') || name.includes('hip')) return '140-180 BPM (Trap/Hip-Hop)';
        if (name.includes('house') || name.includes('dance')) return '120-130 BPM (House/Dance)';
        if (name.includes('drum') || name.includes('bass')) return '160-180 BPM (DnB)';
        return '120-140 BPM (Estimated)';
    }
    
    inferGenre(fileName) {
        const name = fileName.toLowerCase();
        if (name.includes('trap')) return 'Trap';
        if (name.includes('house')) return 'House';
        if (name.includes('techno')) return 'Techno';
        if (name.includes('hip') || name.includes('rap')) return 'Hip-Hop';
        if (name.includes('drum') || name.includes('bass')) return 'Drum & Bass';
        if (name.includes('chill') || name.includes('lo')) return 'Chill/Lo-Fi';
        if (name.includes('pop')) return 'Pop';
        if (name.includes('rock')) return 'Rock';
        return 'Electronic/Instrumental';
    }
    
    inferEnergyLevel(fileName, duration) {
        const name = fileName.toLowerCase();
        if (name.includes('chill') || name.includes('ambient')) return 'Low Energy';
        if (name.includes('hard') || name.includes('aggressive')) return 'High Energy';
        if (duration > 300) return 'Medium Energy (Extended)';
        if (duration < 120) return 'High Energy (Short)';
        return 'Medium Energy';
    }
    
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Global audio manager instance
window.AudioManager = AudioManager;