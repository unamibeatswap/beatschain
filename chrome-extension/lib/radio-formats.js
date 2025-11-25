// Professional Radio Package Format Generator
class RadioFormats {
    constructor() {
        this.formats = {
            pdf: this.generatePDF.bind(this),
            csv: this.generateCSV.bind(this),
            html: this.generateHTML.bind(this),
            vcf: this.generateVCF.bind(this),
            xml: this.generateXML.bind(this)
        };
    }

    // Generate professional press kit PDF content
    generatePressPDF(metadata, enhancedBio) {
        const content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Press Kit - ${metadata.artist}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 25px 0; }
        .highlight { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; }
        .contact-info { background-color: #e9ecef; padding: 15px; border-radius: 5px; }
        .track-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media print { body { margin: 0; padding: 15px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>${metadata.artist}</h1>
        ${metadata.stageName ? `<h2>"${metadata.stageName}"</h2>` : ''}
        <p><strong>New Release:</strong> "${metadata.title}"</p>
        <p><em>${metadata.genre} • ${metadata.duration} • ${new Date().getFullYear()}</em></p>
    </div>
    
    <div class="section">
        <h3>Artist Biography</h3>
        <p>${enhancedBio || 'Professional artist biography to be provided.'}</p>
    </div>
    
    <div class="section">
        <h3>Track Information</h3>
        <div class="track-details">
            <div>
                <p><strong>Title:</strong> ${metadata.title}</p>
                <p><strong>Artist:</strong> ${metadata.artist}</p>
                <p><strong>Genre:</strong> ${metadata.genre}</p>
                <p><strong>Duration:</strong> ${metadata.duration}</p>
            </div>
            <div>
                <p><strong>Language:</strong> ${metadata.language}</p>
                <p><strong>Content Rating:</strong> ${metadata.contentRating}</p>
                <p><strong>ISRC:</strong> ${metadata.isrc || 'To be assigned'}</p>
                <p><strong>Label:</strong> ${metadata.recordLabel || 'Independent'}</p>
            </div>
        </div>
    </div>
    
    ${metadata.influences ? `
    <div class="section">
        <h3>Musical Influences</h3>
        <p>${metadata.influences}</p>
    </div>
    ` : ''}
    
    <div class="section contact-info">
        <h3>Contact Information</h3>
        <p><strong>For Radio Play & Media Inquiries:</strong></p>
        ${metadata.social?.instagram ? `<p>Instagram: <a href="${metadata.social.instagram}">${metadata.social.instagram}</a></p>` : ''}
        ${metadata.social?.twitter ? `<p>Twitter: <a href="${metadata.social.twitter}">${metadata.social.twitter}</a></p>` : ''}
        <p><em>Generated via BeatsChain Radio Submission System</em></p>
        <p><em>Date: ${new Date().toLocaleDateString()}</em></p>
    </div>
</body>
</html>`;

        return content;
    }

    // Generate CSV for database import
    generateTrackCSV(metadata) {
        const csvHeaders = [
            'Artist Name', 'Stage Name', 'Track Title', 'Genre', 'Language', 
            'Duration', 'ISRC', 'Content Rating', 'Record Label', 'Submission Date',
            'Instagram', 'Twitter', 'Biography', 'Influences'
        ];

        const csvData = [
            metadata.artist || '',
            metadata.stageName || '',
            metadata.title || '',
            metadata.genre || '',
            metadata.language || '',
            metadata.duration || '',
            metadata.isrc || '',
            metadata.contentRating || '',
            metadata.recordLabel || 'Independent',
            new Date().toISOString(),
            metadata.social?.instagram || '',
            metadata.social?.twitter || '',
            (metadata.biography || '').replace(/"/g, '""'),
            (metadata.influences || '').replace(/"/g, '""')
        ];

        return csvHeaders.join(',') + '\n' + 
               csvData.map(field => `"${field}"`).join(',');
    }

    // Generate split sheet CSV (SAMRO compatible)
    generateSplitCSV(splitSheet) {
        const headers = [
            'Track Title', 'Artist', 'Contributor Name', 'Role', 
            'Percentage', 'SAMRO Number', 'Royalty Share'
        ];

        let csvContent = headers.join(',') + '\n';
        
        splitSheet.contributors.forEach(contributor => {
            const row = [
                splitSheet.trackInfo.title || '',
                splitSheet.trackInfo.artist || '',
                contributor.name || '',
                contributor.role || '',
                contributor.percentage || '0',
                contributor.samroNumber || '',
                contributor.royaltyShare || '0.0000'
            ];
            csvContent += row.map(field => `"${field}"`).join(',') + '\n';
        });

        return csvContent;
    }

    // Generate HTML artist bio
    generateBioHTML(metadata, enhancedBio) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.artist} - Artist Biography</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        .bio-container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .artist-header { text-align: center; margin-bottom: 30px; }
        .artist-name { color: #333; margin-bottom: 10px; }
        .stage-name { color: #666; font-style: italic; }
        .bio-content { line-height: 1.8; color: #444; margin-bottom: 25px; }
        .social-links { display: flex; gap: 15px; justify-content: center; margin-top: 25px; }
        .social-link { padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .social-link:hover { background: #0056b3; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        @media (max-width: 600px) { .social-links { flex-direction: column; align-items: center; } }
    </style>
</head>
<body>
    <div class="bio-container">
        <div class="artist-header">
            <h1 class="artist-name">${metadata.artist}</h1>
            ${metadata.stageName ? `<h2 class="stage-name">"${metadata.stageName}"</h2>` : ''}
        </div>
        
        <div class="bio-content">
            <p>${enhancedBio || 'Professional artist biography coming soon.'}</p>
            ${metadata.influences ? `<p><strong>Musical Influences:</strong> ${metadata.influences}</p>` : ''}
        </div>
        
        ${metadata.social?.instagram || metadata.social?.twitter ? `
        <div class="social-links">
            ${metadata.social?.instagram ? `<a href="${metadata.social.instagram}" class="social-link" target="_blank">Instagram</a>` : ''}
            ${metadata.social?.twitter ? `<a href="${metadata.social.twitter}" class="social-link" target="_blank">Twitter</a>` : ''}
        </div>
        ` : ''}
        
        <div class="footer">
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            <p>BeatsChain Radio Submission System</p>
        </div>
    </div>
</body>
</html>`;
    }

    // Generate VCF contact card
    generateContactVCF(metadata) {
        let vcf = `BEGIN:VCARD
VERSION:3.0
FN:${metadata.artist}${metadata.stageName ? ` (${metadata.stageName})` : ''}
N:${metadata.artist};;;;
ORG:${metadata.recordLabel || 'Independent Artist'}
TITLE:Recording Artist
NOTE:${metadata.genre} artist. Latest release: "${metadata.title}"`;
        
        // Add contact information if available
        if (metadata.contact?.email) {
            vcf += `
EMAIL:${metadata.contact.email}`;
        }
        if (metadata.contact?.phone) {
            vcf += `
TEL:${metadata.contact.phone}`;
        }
        if (metadata.contact?.website) {
            vcf += `
URL:${metadata.contact.website}`;
        }
        
        // Add social media
        if (metadata.social?.instagram) {
            vcf += `
URL:${metadata.social.instagram}`;
        }
        if (metadata.social?.twitter) {
            vcf += `
URL:${metadata.social.twitter}`;
        }
        
        vcf += `
REV:${new Date().toISOString()}
END:VCARD`;
        return vcf;
    }

    // Generate XML metadata for broadcasting systems
    generateBroadcastXML(metadata) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<RadioSubmission xmlns="http://beatschain.com/radio/v1">
    <Track>
        <Title>${this.escapeXML(metadata.title)}</Title>
        <Artist>${this.escapeXML(metadata.artist)}</Artist>
        <StageName>${this.escapeXML(metadata.stageName || '')}</StageName>
        <Genre>${this.escapeXML(metadata.genre)}</Genre>
        <Language>${this.escapeXML(metadata.language)}</Language>
        <Duration>${this.escapeXML(metadata.duration)}</Duration>
        <ISRC>${this.escapeXML(metadata.isrc || '')}</ISRC>
        <ContentRating>${this.escapeXML(metadata.contentRating)}</ContentRating>
        <RecordLabel>${this.escapeXML(metadata.recordLabel || 'Independent')}</RecordLabel>
    </Track>
    <Technical>
        <Format>${this.escapeXML(metadata.format)}</Format>
        <Quality>${this.escapeXML(metadata.quality)}</Quality>
        <Bitrate>${this.escapeXML(metadata.bitrate)}</Bitrate>
        <BPM>${this.escapeXML(metadata.bpm)}</BPM>
    </Technical>
    <Submission>
        <Date>${new Date().toISOString()}</Date>
        <Type>radio_submission</Type>
        <Platform>BeatsChain</Platform>
        <RadioReady>true</RadioReady>
    </Submission>
    <Social>
        ${metadata.social?.instagram ? `<Instagram>${this.escapeXML(metadata.social.instagram)}</Instagram>` : ''}
        ${metadata.social?.twitter ? `<Twitter>${this.escapeXML(metadata.social.twitter)}</Twitter>` : ''}
    </Social>
</RadioSubmission>`;
    }

    // Utility method for XML escaping
    escapeXML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Generate professional package with multiple formats
    generateProfessionalPackage(metadata, enhancedBio, splitSheet) {
        return {
            'press_kit.html': this.generatePressPDF(metadata, enhancedBio),
            'track_metadata.csv': this.generateTrackCSV(metadata),
            'split_sheet.csv': this.generateSplitCSV(splitSheet),
            'artist_bio.html': this.generateBioHTML(metadata, enhancedBio),
            'contact_info.vcf': this.generateContactVCF(metadata),
            'broadcast_metadata.xml': this.generateBroadcastXML(metadata)
        };
    }
    
    // Generate professional press release with AI enhancement
    async generatePressRelease(metadata, enhancedBio, contentAI = null) {
        let pressContent = '';
        
        if (contentAI) {
            try {
                const result = await contentAI.generatePressReleaseContent(enhancedBio, metadata);
                pressContent = result.content || this.generateFallbackPressRelease(metadata, enhancedBio);
            } catch (error) {
                console.error('AI press release generation failed:', error);
                pressContent = this.generateFallbackPressRelease(metadata, enhancedBio);
            }
        } else {
            pressContent = this.generateFallbackPressRelease(metadata, enhancedBio);
        }
        
        return pressContent;
    }
    
    generateFallbackPressRelease(metadata, enhancedBio) {
        return `FOR IMMEDIATE RELEASE

${metadata.artist || 'Artist'} Releases New ${metadata.genre} Track "${metadata.title}"

${enhancedBio || 'Professional artist with new release.'}

The new track "${metadata.title}" showcases ${metadata.artist || 'the artist'}'s unique sound in the ${metadata.genre} genre. Available for radio play and streaming.

Track Details:
- Title: ${metadata.title}
- Artist: ${metadata.artist}
- Genre: ${metadata.genre}
- Duration: ${metadata.duration}
- Language: ${metadata.language || 'English'}

For radio play consideration and media inquiries, contact through provided channels.

###

Generated: ${new Date().toLocaleDateString()}
BeatsChain Radio Submission System`;
    }
    
    // Generate radio station submission letter
    generateSubmissionLetter(metadata, enhancedBio) {
        return `Dear Radio Programming Director,

I am writing to submit "${metadata.title}" by ${metadata.artist} for your consideration for radio airplay.

Track Information:
- Title: ${metadata.title}
- Artist: ${metadata.artist}
- Genre: ${metadata.genre}
- Duration: ${metadata.duration}
- Language: ${metadata.language || 'English'}
- Content Rating: ${metadata.contentRating || 'Clean'}

Artist Background:
${enhancedBio || 'Emerging artist with professional production quality.'}

This track has been professionally mastered and is radio-ready. All necessary licensing and split sheet documentation is included in this submission package.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${metadata.artist}

Submission Date: ${new Date().toLocaleDateString()}
Generated via BeatsChain Radio Submission System`;
    }
    
    // Generate SAMRO-specific documentation
    generateSAMROSubmission(metadata, splitSheet) {
        let samroDoc = `SAMRO SUBMISSION DOCUMENTATION

`;
        samroDoc += `Track: ${metadata.title}
`;
        samroDoc += `Primary Artist: ${metadata.artist}
`;
        samroDoc += `Genre: ${metadata.genre}
`;
        samroDoc += `Duration: ${metadata.duration}
`;
        samroDoc += `ISRC: ${metadata.isrc || 'To be assigned'}
`;
        samroDoc += `Language: ${metadata.language || 'English'}
\n`;
        
        samroDoc += `RIGHTS HOLDERS:
`;
        if (splitSheet && splitSheet.contributors) {
            splitSheet.contributors.forEach((contributor, index) => {
                samroDoc += `${index + 1}. ${contributor.name} - ${contributor.role} (${contributor.percentage}%)
`;
                if (contributor.samroNumber) {
                    samroDoc += `   SAMRO Number: ${contributor.samroNumber}
`;
                }
            });
        }
        
        samroDoc += `\nSubmission Date: ${new Date().toISOString()}
`;
        samroDoc += `Generated by BeatsChain Radio Submission System
`;
        
        return samroDoc;
    }
}

// Add professional format generation method to BeatsChain app
if (typeof window !== 'undefined') {
    window.RadioFormats = RadioFormats;
    
    // Extend BeatsChain app with professional format generation
    window.addEventListener('DOMContentLoaded', () => {
        if (window.beatsChainApp) {
            window.beatsChainApp.generateProfessionalFormats = async function(metadata, enhancedBio, splitSheet) {
                if (!this.radioFormats) {
                    this.radioFormats = new RadioFormats();
                }
                
                const formats = {};
                
                // Generate press release with AI enhancement
                if (this.contentAI) {
                    formats['press_release.txt'] = await this.radioFormats.generatePressRelease(metadata, enhancedBio, this.contentAI);
                } else {
                    formats['press_release.txt'] = this.radioFormats.generateFallbackPressRelease(metadata, enhancedBio);
                }
                
                // Generate submission letter
                formats['submission_letter.txt'] = this.radioFormats.generateSubmissionLetter(metadata, enhancedBio);
                
                // Generate SAMRO documentation
                if (splitSheet) {
                    formats['samro_submission.txt'] = this.radioFormats.generateSAMROSubmission(metadata, splitSheet);
                }
                
                // Generate all professional formats
                const professionalPackage = this.radioFormats.generateProfessionalPackage(metadata, enhancedBio, splitSheet);
                
                return { ...formats, ...professionalPackage };
            };
        }
    });
}