// Content Enhancement AI - Improve User-Created Content
class ContentAI {
    constructor(chromeAI) {
        this.chromeAI = chromeAI;
        this.isAvailable = false;
    }

    async initialize() {
        this.isAvailable = this.chromeAI && this.chromeAI.isAvailable;
        return this.isAvailable;
    }

    async enhanceUserBio(userWrittenBio) {
        if (!userWrittenBio || userWrittenBio.trim().length < 10) {
            return { 
                enhanced: '', 
                message: 'Please write a basic biography first (minimum 10 characters)',
                userControlled: true
            };
        }

        try {
            if (this.isAvailable && this.chromeAI.apis.rewriter) {
                // REWRITER API - Polish existing content only
                const enhanced = await this.chromeAI.apis.rewriter.rewrite(
                    userWrittenBio, 
                    { tone: 'professional', audience: 'radio industry' }
                );
                
                return { 
                    original: userWrittenBio,
                    enhanced: enhanced,
                    message: 'AI-enhanced version - edit as needed',
                    userControlled: true
                };
            }
            
            // Fallback - basic professional formatting
            return this.formatBioProfessionally(userWrittenBio);
            
        } catch (error) {
            console.error('Bio enhancement failed:', error);
            return this.formatBioProfessionally(userWrittenBio);
        }
    }

    async improveTrackDescription(userDescription, metadata) {
        if (!userDescription || userDescription.trim().length < 5) {
            return {
                improved: '',
                message: 'Please write a basic track description first',
                userControlled: true
            };
        }

        try {
            if (this.isAvailable && this.chromeAI.apis.writer) {
                // WRITER API - Enhance user's description with metadata
                const prompt = `Improve this track description professionally: "${userDescription}" 
                               Track: ${metadata.title}, Genre: ${metadata.genre}
                               Keep the original meaning but make it more professional for radio submission.`;
                
                const improved = await this.chromeAI.apis.writer.write(prompt);
                
                return {
                    original: userDescription,
                    improved: improved,
                    message: 'AI-improved version - you can edit or use original',
                    userControlled: true
                };
            }
            
            // Fallback - basic formatting
            return {
                original: userDescription,
                improved: this.formatDescriptionProfessionally(userDescription, metadata),
                message: 'Professionally formatted - edit as needed',
                userControlled: true
            };
            
        } catch (error) {
            console.error('Description improvement failed:', error);
            return {
                original: userDescription,
                improved: userDescription,
                message: 'Using your original description',
                userControlled: true
            };
        }
    }

    async generatePressReleaseContent(userBio, trackMetadata) {
        if (!userBio || userBio.trim().length < 20) {
            return {
                content: '',
                message: 'Please provide a detailed biography first (minimum 20 characters)',
                userControlled: true
            };
        }

        try {
            if (this.isAvailable && this.chromeAI.apis.writer) {
                // WRITER API - Create press release from user bio
                const prompt = `Create a professional press release based on this artist bio: "${userBio}"
                               Track: "${trackMetadata.title}" - ${trackMetadata.genre}
                               Make it suitable for radio stations and music media.`;
                
                const content = await this.chromeAI.apis.writer.write(prompt);
                
                return {
                    content: content,
                    message: 'AI-generated press release based on your bio - edit as needed',
                    userControlled: true
                };
            }
            
            // Fallback - template-based press release
            return this.generateFallbackPressRelease(userBio, trackMetadata);
            
        } catch (error) {
            console.error('Press release generation failed:', error);
            return this.generateFallbackPressRelease(userBio, trackMetadata);
        }
    }

    async translateContent(text, targetLanguage = 'af') {
        if (!text || text.trim().length < 5) {
            return {
                translated: '',
                message: 'Please provide content to translate',
                userControlled: true
            };
        }

        try {
            if (this.isAvailable && this.chromeAI.apis.translator) {
                // TRANSLATOR API - Multi-language support
                const translated = await this.chromeAI.apis.translator.translate(text, {
                    sourceLanguage: 'en',
                    targetLanguage: targetLanguage
                });
                
                return {
                    original: text,
                    translated: translated,
                    language: targetLanguage,
                    message: `AI-translated to ${targetLanguage.toUpperCase()} - verify accuracy`,
                    userControlled: true
                };
            }
            
            return {
                original: text,
                translated: text,
                message: 'Translation not available - using original text',
                userControlled: true
            };
            
        } catch (error) {
            console.error('Translation failed:', error);
            return {
                original: text,
                translated: text,
                message: 'Translation failed - using original text',
                userControlled: true
            };
        }
    }

    // Fallback methods for when AI is unavailable
    formatBioProfessionally(userBio) {
        const formatted = userBio
            .split('.')
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 0)
            .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
            .join('. ') + '.';
            
        return {
            original: userBio,
            enhanced: formatted,
            message: 'Professionally formatted - AI enhancement unavailable',
            userControlled: true
        };
    }

    formatDescriptionProfessionally(userDescription, metadata) {
        return `${userDescription} This ${metadata.genre} track showcases ${metadata.artist || 'the artist'}'s unique sound and creative vision.`;
    }

    generateFallbackPressRelease(userBio, trackMetadata) {
        const content = `FOR IMMEDIATE RELEASE

${trackMetadata.artist || 'Artist'} Releases New ${trackMetadata.genre} Track "${trackMetadata.title}"

${userBio}

The new track "${trackMetadata.title}" is now available for radio play and represents ${trackMetadata.artist || 'the artist'}'s continued evolution in the ${trackMetadata.genre} genre.

For more information and radio play consideration, please contact the artist through their provided channels.

Generated: ${new Date().toLocaleDateString()}`;

        return {
            content: content,
            message: 'Template-based press release - AI unavailable',
            userControlled: true
        };
    }
}

window.ContentAI = ContentAI;