// Radio Validator - Reuses existing audio analysis
class RadioValidator {
    constructor(chromeAI) {
        this.chromeAI = chromeAI;
    }

    // REUSE existing beatMetadata from extractAudioMetadata()
    validateForRadio(beatMetadata) {
        return {
            duration: this.checkRadioDuration(beatMetadata.durationSeconds),
            quality: this.checkRadioQuality(beatMetadata.estimatedBitrate),
            format: this.checkRadioFormat(beatMetadata.format),
            profanity: this.detectProfanity(beatMetadata.title)
        };
    }
    
    checkRadioDuration(seconds) {
        // Radio preferred: 2:30-3:30 (150-210 seconds)
        if (seconds >= 150 && seconds <= 210) {
            return { status: 'optimal', message: 'Perfect radio length (2:30-3:30)', score: 100 };
        }
        if (seconds <= 240) {
            return { status: 'acceptable', message: 'Acceptable for radio (<4:00)', score: 80 };
        }
        return { status: 'warning', message: 'Too long for radio (>4min)', score: 40 };
    }
    
    checkRadioQuality(bitrateStr) {
        const bitrate = parseInt(bitrateStr);
        if (bitrate >= 320) {
            return { status: 'optimal', message: 'Excellent quality (320+ kbps)', score: 100 };
        }
        if (bitrate >= 256) {
            return { status: 'good', message: 'Good quality (256+ kbps)', score: 85 };
        }
        if (bitrate >= 192) {
            return { status: 'acceptable', message: 'Acceptable quality (192+ kbps)', score: 70 };
        }
        return { status: 'warning', message: 'Low quality for radio (<192 kbps)', score: 30 };
    }
    
    checkRadioFormat(format) {
        const radioFormats = ['MP3', 'WAV'];
        if (radioFormats.includes(format)) {
            return { status: 'optimal', message: `${format} format supported`, score: 100 };
        }
        return { status: 'warning', message: `${format} may need conversion`, score: 60 };
    }
    
    async detectProfanity(title) {
        try {
            if (this.chromeAI && this.chromeAI.apis.languageModel) {
                const prompt = `Analyze this track title for profanity or inappropriate content for radio: "${title}". Respond with only "CLEAN" or "EXPLICIT".`;
                const result = await this.chromeAI.generateContent(prompt);
                const isClean = result.includes('CLEAN');
                return {
                    status: isClean ? 'optimal' : 'warning',
                    message: isClean ? 'Clean version suitable for radio' : 'May contain explicit content',
                    score: isClean ? 100 : 20
                };
            }
        } catch (error) {
            console.log('AI profanity detection unavailable, using fallback');
        }
        
        // Fallback: basic profanity check
        const profanityWords = ['fuck', 'shit', 'damn', 'bitch', 'ass', 'hell'];
        const hasExplicit = profanityWords.some(word => title.toLowerCase().includes(word));
        return {
            status: hasExplicit ? 'warning' : 'optimal',
            message: hasExplicit ? 'May contain explicit content' : 'Appears clean for radio',
            score: hasExplicit ? 20 : 90
        };
    }
    
    calculateOverallScore(validation) {
        const scores = Object.values(validation).map(v => v.score || 0);
        return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    }
}

window.RadioValidator = RadioValidator;