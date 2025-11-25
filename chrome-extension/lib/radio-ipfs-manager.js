// Radio IPFS Manager - Separate storage for radio submissions
class RadioIPFSManager {
    constructor() {
        this.pinataApiKey = null;
        this.pinataSecretKey = null;
        this.radioFolder = 'radio-submissions';
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            // Import config manager
            const { default: config } = await import('./config.js');
            await config.initialize();
            // Prefer server-side configured keys. Do not fall back to hard-coded secrets.
            this.pinataApiKey = await config.get('PINATA_API_KEY') || null;
            this.pinataSecretKey = await config.get('PINATA_SECRET_KEY') || null;
            this.initialized = true;
        } catch (error) {
            console.error('RadioIPFS initialization failed:', error);
            // Ensure no secret defaults are used in client code
            this.pinataApiKey = null;
            this.pinataSecretKey = null;
            this.initialized = true;
        }
    }

    async uploadRadioPackage(files, metadata, artistProfile) {
        await this.initialize();
        try {
            console.log('📻 Uploading radio package to IPFS...');
            
            const packageFiles = [];
            
            // Upload audio file
            if (files.audio) {
                const audioResult = await this.uploadSingleFile(files.audio, {
                    ...metadata,
                    type: 'audio',
                    purpose: 'radio_submission'
                });
                packageFiles.push({
                    type: 'audio',
                    filename: files.audio.name,
                    ipfsHash: audioResult.ipfsHash,
                    size: files.audio.size
                });
            }
            
            // Upload cover image
            if (files.coverImage) {
                const imageResult = await this.uploadSingleFile(files.coverImage, {
                    ...metadata,
                    type: 'cover_image',
                    purpose: 'radio_submission'
                });
                packageFiles.push({
                    type: 'cover_image',
                    filename: files.coverImage.name,
                    ipfsHash: imageResult.ipfsHash,
                    size: files.coverImage.size
                });
            }
            
            // Create comprehensive metadata package
            const radioMetadata = {
                packageType: 'radio_submission',
                submissionDate: new Date().toISOString(),
                trackInfo: metadata,
                artistProfile: artistProfile,
                files: packageFiles,
                radioReady: true,
                samroCompliant: true
            };
            
            // Upload metadata as JSON
            const metadataResult = await this.uploadJSON(radioMetadata, 'radio-package-metadata.json');
            
            return {
                success: true,
                packageHash: metadataResult.ipfsHash,
                files: packageFiles,
                metadata: radioMetadata,
                radioPackageUrl: `https://gateway.pinata.cloud/ipfs/${metadataResult.ipfsHash}`
            };
            
        } catch (error) {
            console.error('❌ Radio package upload failed:', error);
            
            // Fallback with mock hash
            const mockHash = 'QmRadio' + Array.from(crypto.getRandomValues(new Uint8Array(20)), 
                byte => byte.toString(16).padStart(2, '0')).join('').substring(0, 40);
            
            return {
                success: false,
                error: error.message,
                fallback: true,
                packageHash: mockHash,
                radioPackageUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`
            };
        }
    }

    async uploadSingleFile(file, metadata) {
        await this.initialize();
        if (!this.pinataApiKey || !this.pinataSecretKey) {
            throw new Error('Client-side Pinata keys are not configured. Use a server-side endpoint to pin files to IPFS securely.');
        }
        const formData = new FormData();
        formData.append('file', file);
        
        const pinataMetadata = {
            name: `${this.radioFolder}/${metadata.title || file.name}`,
            keyvalues: {
                type: metadata.type,
                purpose: 'radio_submission',
                artist: metadata.artistName || 'Unknown',
                genre: metadata.genre || 'Music',
                uploadedAt: new Date().toISOString(),
                radioReady: true
            }
        };
        
        formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
        
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'pinata_api_key': this.pinataApiKey,
                'pinata_secret_api_key': this.pinataSecretKey
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        return {
            success: true,
            ipfsHash: result.IpfsHash,
            ipfsUrl: `https://ipfs.io/ipfs/${result.IpfsHash}`,
            pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
            size: result.PinSize
        };
    }

    async uploadJSON(jsonData, filename) {
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
            type: 'application/json'
        });
        
        const file = new File([blob], filename, {
            type: 'application/json'
        });
        
        return await this.uploadSingleFile(file, {
            title: filename,
            type: 'metadata',
            purpose: 'radio_submission'
        });
    }

    async generateEnhancedRadioPackage(audioFile, coverImage, metadata, artistProfile) {
        try {
            const files = [];
            
            // 1. Audio file
            if (audioFile) {
                files.push({
                    name: `audio/${this.sanitizeFilename(metadata.title)}.${this.getFileExtension(audioFile.name)}`,
                    content: audioFile
                });
            }
            
            // 2. Cover image
            if (coverImage) {
                files.push({
                    name: `images/cover_art.${this.getFileExtension(coverImage.name)}`,
                    content: coverImage
                });
            }
            
            // 3. Enhanced metadata JSON
            const enhancedMetadata = {
                track: {
                    title: metadata.title,
                    artist: metadata.artistName,
                    stageName: metadata.stageName,
                    genre: metadata.genre,
                    language: metadata.language,
                    duration: metadata.duration,
                    isrc: metadata.isrc,
                    contentRating: metadata.contentRating
                },
                artist: {
                    name: metadata.artistName,
                    stageName: metadata.stageName,
                    biography: artistProfile.biography || '',
                    influences: artistProfile.influences || '',
                    social: artistProfile.social || {},
                    contact: artistProfile.contact || {}
                },
                submission: {
                    date: new Date().toISOString(),
                    type: 'radio_submission',
                    radioReady: true,
                    samroCompliant: true
                }
            };
            
            files.push({
                name: 'metadata/enhanced_metadata.json',
                content: JSON.stringify(enhancedMetadata, null, 2)
            });
            
            // 4. Enhanced Press Kit Files
            if (artistProfile.biography) {
                // Biography Text
                const bioText = `ARTIST BIOGRAPHY\n\nArtist: ${metadata.artistName}\nStage Name: ${metadata.stageName || 'N/A'}\n\n${artistProfile.biography}\n\nInfluences: ${artistProfile.influences || 'Not specified'}\n\nSocial Media:\n${artistProfile.social?.instagram ? `Instagram: ${artistProfile.social.instagram}\n` : ''}${artistProfile.social?.twitter ? `Twitter: ${artistProfile.social.twitter}\n` : ''}\n\nGenerated: ${new Date().toLocaleString()}`;
                
                files.push({
                    name: 'press_kit/artist_biography.txt',
                    content: bioText
                });
                
                // Professional Press Release (HTML)
                const pressRelease = this.generatePressRelease(metadata, artistProfile);
                files.push({
                    name: 'press_kit/press_release.html',
                    content: pressRelease
                });
                
                // Artist Fact Sheet (CSV)
                const factSheet = this.generateFactSheet(metadata, artistProfile);
                files.push({
                    name: 'press_kit/artist_fact_sheet.csv',
                    content: factSheet
                });
                
                // Radio Contact Template
                const contactTemplate = this.generateContactTemplate(metadata, artistProfile);
                files.push({
                    name: 'press_kit/radio_contact_template.txt',
                    content: contactTemplate
                });
            }
            
            // 5. Radio submission README
            const readmeContent = `RADIO SUBMISSION PACKAGE\n\nTrack: ${metadata.title}\nArtist: ${metadata.artistName}\nGenre: ${metadata.genre}\nLanguage: ${metadata.language}\n\nPACKAGE CONTENTS:\n- audio/ - Main audio file\n- images/ - Cover artwork\n- metadata/ - Enhanced metadata (JSON)\n- artist/ - Artist biography and information\n\nSUBMISSION DATE: ${new Date().toLocaleString()}\nGENERATED BY: BeatsChain Radio Submission System\n\nThis package is ready for radio station submission.`;
            
            files.push({
                name: 'README.txt',
                content: readmeContent
            });
            
            return files;
            
        } catch (error) {
            console.error('Enhanced package generation failed:', error);
            throw error;
        }
    }

    sanitizeFilename(filename) {
        if (!filename) return 'untitled';
        return filename.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }
    
    generatePressRelease(metadata, artistProfile) {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Press Release - ${metadata.artistName}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .content { margin: 20px 0; line-height: 1.6; }
        .highlight { background-color: #f0f0f0; padding: 15px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FOR IMMEDIATE RELEASE</h1>
        <h2>${metadata.artistName} Releases New ${metadata.genre} Track "${metadata.title}"</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="content">
        <div class="highlight">
            <p><strong>Artist:</strong> ${metadata.artistName}</p>
            <p><strong>Track:</strong> ${metadata.title}</p>
            <p><strong>Genre:</strong> ${metadata.genre}</p>
            <p><strong>Duration:</strong> ${metadata.duration}</p>
            <p><strong>Language:</strong> ${metadata.language}</p>
        </div>
        
        <p>${artistProfile.biography || 'Emerging artist making waves in the music industry.'}</p>
        
        <h3>About the Artist</h3>
        <p><strong>Musical Influences:</strong> ${artistProfile.influences || 'Various contemporary artists'}</p>
        
        <h3>Contact Information</h3>
        <p><strong>Social Media:</strong></p>
        <ul>
            ${artistProfile.social?.instagram ? `<li>Instagram: <a href="${artistProfile.social.instagram}">${artistProfile.social.instagram}</a></li>` : ''}
            ${artistProfile.social?.twitter ? `<li>Twitter: <a href="${artistProfile.social.twitter}">${artistProfile.social.twitter}</a></li>` : ''}
        </ul>
        
        <div class="highlight">
            <p><strong>For radio play consideration, please contact:</strong></p>
            <p>BeatsChain Radio Submissions</p>
            <p>Generated via BeatsChain Chrome Extension</p>
        </div>
    </div>
</body>
</html>`;
    }
    
    generateFactSheet(metadata, artistProfile) {
        return `Field,Value
Artist Name,"${metadata.artistName}"
Stage Name,"${metadata.stageName || 'N/A'}"
Track Title,"${metadata.title}"
Genre,"${metadata.genre}"
Language,"${metadata.language}"
Duration,"${metadata.duration}"
ISRC,"${metadata.isrc || 'Not assigned'}"
Content Rating,"${metadata.contentRating}"
Record Label,"${metadata.recordLabel || 'Independent'}"
Release Date,"${new Date().toLocaleDateString()}"
Biography,"${(artistProfile.biography || '').replace(/"/g, '""')}"
Influences,"${(artistProfile.influences || '').replace(/"/g, '""')}"
Instagram,"${artistProfile.social?.instagram || ''}"
Twitter,"${artistProfile.social?.twitter || ''}"
Submission Date,"${new Date().toISOString()}"
Generated By,"BeatsChain Radio Submission System"`;
    }
    
    generateContactTemplate(metadata, artistProfile) {
        return `RADIO STATION CONTACT TEMPLATE

Subject: New Music Submission - ${metadata.artistName} - "${metadata.title}"

Dear Program Director / Music Director,

I hope this message finds you well. I am writing to submit a new ${metadata.genre} track for your consideration for airplay.

ARTIST: ${metadata.artistName}
TRACK: "${metadata.title}"
GENRE: ${metadata.genre}
DURATION: ${metadata.duration}
LANGUAGE: ${metadata.language}
CONTENT RATING: ${metadata.contentRating}

ABOUT THE ARTIST:
${artistProfile.biography || 'Emerging artist with a unique sound and growing fanbase.'}

This submission includes:
- High-quality audio file
- Complete track metadata
- Artist biography and press kit
- SAMRO-compliant split sheets
- Cover artwork
- Professional press release (HTML)
- Artist fact sheet (CSV for database import)

SOCIAL MEDIA:
${artistProfile.social?.instagram ? `Instagram: ${artistProfile.social.instagram}` : ''}
${artistProfile.social?.twitter ? `Twitter: ${artistProfile.social.twitter}` : ''}

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${metadata.artistName}

Generated: ${new Date().toLocaleString()}
Submission System: BeatsChain Radio Submission`;
    }

    async getRadioPackageInfo(packageHash) {
        try {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${packageHash}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to get package info:', error);
        }
        return null;
    }
}

window.RadioIPFSManager = RadioIPFSManager;