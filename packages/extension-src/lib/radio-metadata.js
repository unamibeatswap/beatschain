/**
 * Radio Metadata Manager
 * Separates track metadata from split sheets with comprehensive user inputs
 */

class RadioMetadataManager {
    constructor() {
        this.trackMetadata = {};
        this.initialized = false;
        // USER INPUT PRIORITY: Ensure radio system respects user choices
        this.userInputManager = new UserInputManager();
        this.isrcManager = null;
    }

    async initializeForm() {
        if (this.initialized) return;
        
        const radioSection = document.getElementById('radio-section');
        if (!radioSection) return;

        // Initialize ISRC Manager
        if (window.ISRCManager) {
            this.isrcManager = new ISRCManager();
            await this.isrcManager.initialize();
        }

        // Create comprehensive metadata form
        const metadataForm = this.createMetadataForm();
        
        // Insert before split sheets section
        const splitSheetsSection = document.getElementById('split-sheets');
        if (splitSheetsSection) {
            splitSheetsSection.parentNode.insertBefore(metadataForm, splitSheetsSection);
        }

        this.setupEventListeners();
        this.initialized = true;
    }

    createMetadataForm() {
        const form = document.createElement('div');
        form.id = 'radio-metadata-form';
        form.className = 'radio-metadata-form';
        form.style.display = 'none'; // Hidden until audio uploaded

        form.innerHTML = `
            <h4>🎵 Track Information</h4>
            <div class="metadata-grid">
                <div class="form-row">
                    <label for="radio-track-title">Track Title *</label>
                    <input type="text" id="radio-track-title" class="form-input" 
                           placeholder="Enter track title" maxlength="100" required>
                </div>
                
                <div class="form-row">
                    <label for="radio-artist-name">Legal Name *</label>
                    <input type="text" id="radio-artist-name" class="form-input" 
                           placeholder="Legal name (from profile)" maxlength="50" required>
                </div>
                
                <div class="form-row">
                    <label for="radio-stage-name">Display Name</label>
                    <input type="text" id="radio-stage-name" class="form-input" 
                           placeholder="Stage/display name (from profile)" maxlength="50">
                </div>
                
                <div class="form-row">
                    <label for="radio-genre-select">Genre *</label>
                    <select id="radio-genre-select" class="form-input" required>
                        <option value="">Select Genre</option>
                        <option value="Afrobeats">Afrobeats</option>
                        <option value="Amapiano">Amapiano</option>
                        <option value="Hip-Hop">Hip-Hop</option>
                        <option value="House">House</option>
                        <option value="Kwaito">Kwaito</option>
                        <option value="Gospel">Gospel</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Rock">Rock</option>
                        <option value="Pop">Pop</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <label for="radio-language">Language</label>
                    <select id="radio-language" class="form-input">
                        <option value="English">English</option>
                        <option value="Afrikaans">Afrikaans</option>
                        <option value="Zulu">Zulu</option>
                        <option value="Xhosa">Xhosa</option>
                        <option value="Sotho">Sotho</option>
                        <option value="Tswana">Tswana</option>
                        <option value="Venda">Venda</option>
                        <option value="Tsonga">Tsonga</option>
                        <option value="Ndebele">Ndebele</option>
                        <option value="Swati">Swati</option>
                        <option value="Pedi">Pedi</option>
                        <option value="Mixed">Mixed Languages</option>
                        <option value="Instrumental">Instrumental</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <label for="radio-record-label">Record Label</label>
                    <input type="text" id="radio-record-label" class="form-input" 
                           placeholder="Independent or label name" maxlength="50">
                </div>
                
                <div class="form-row">
                    <label for="radio-explicit">Content Rating</label>
                    <select id="radio-explicit" class="form-input">
                        <option value="clean">Clean</option>
                        <option value="explicit">Explicit</option>
                        <option value="edited">Edited Version</option>
                    </select>
                </div>
            </div>
            
            <h4>📝 Artist Biography</h4>
            <div class="biography-grid">
                <div class="form-row">
                    <label for="artist-bio">Biography:</label>
                    <textarea id="artist-bio" class="form-input" placeholder="Tell your story..." rows="3" maxlength="500"></textarea>
                </div>
                
                <div class="form-row">
                    <label for="influences">Musical Influences:</label>
                    <input type="text" id="influences" class="form-input" placeholder="Artists that inspire you" maxlength="200">
                </div>
            </div>
            
            <h4>🔗 Social Media</h4>
            <div class="social-grid">
                <div class="form-row">
                    <label for="instagram">Instagram:</label>
                    <input type="url" id="instagram" class="form-input" placeholder="https://instagram.com/username">
                </div>
                
                <div class="form-row">
                    <label for="twitter">Twitter:</label>
                    <input type="url" id="twitter" class="form-input" placeholder="https://twitter.com/username">
                </div>
            </div>
            
            <div class="validation-status" id="metadata-validation">
                <span class="validation-icon">⚠️</span>
                <span class="validation-text">Please complete required fields</span>
            </div>
        `;

        return form;
    }

    setupEventListeners() {
        // USER INPUT PRIORITY: Track user inputs with priority
        const inputFields = {
            'radio-track-title': 'radio-title',
            'radio-artist-name': 'radio-artist', 
            'radio-stage-name': 'radio-stage',
            'radio-genre': 'radio-genre',
            'radio-language': 'radio-language',
            'radio-record-label': 'radio-label',
            'radio-isrc': 'radio-isrc',
            'radio-content-rating': 'radio-explicit',
            'artist-bio': 'artist-biography',
            'influences': 'artist-influences',
            'instagram': 'social-instagram',
            'twitter': 'social-twitter'
        };
        
        Object.entries(inputFields).forEach(([fieldId, key]) => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    // Store as user input when user types/selects
                    if (e.target.value && e.target.value.trim()) {
                        this.userInputManager.setUserInput(key, e.target.value, true);
                    }
                    this.validateMetadata();
                });
                field.addEventListener('blur', () => this.validateMetadata());
            }
        });

        // Auto-populate from audio metadata if available
        document.addEventListener('audioMetadataExtracted', (event) => {
            this.populateFromAudioMetadata(event.detail);
        });
    }

    populateFromAudioMetadata(audioMetadata) {
        // USER INPUT PRIORITY: Only suggest if user hasn't entered anything
        const titleField = document.getElementById('radio-track-title');
        if (titleField && !titleField.value && audioMetadata.title) {
            titleField.value = this.sanitizeInput(audioMetadata.title);
            // Mark as AI suggestion, not user input
            this.userInputManager.setUserInput('radio-title', audioMetadata.title, false);
        }
        
        // Suggest genre but don't override user selection
        const genreField = document.getElementById('radio-genre');
        if (genreField && !genreField.value && audioMetadata.suggestedGenre) {
            // Map AI genre to radio genres
            const genreMapping = {
                'Hip-Hop': 'Hip-Hop',
                'House': 'House', 
                'Electronic': 'Electronic',
                'Pop': 'Pop',
                'Rock': 'Rock',
                'Jazz': 'Jazz',
                'Trap': 'Hip-Hop'
            };
            const mappedGenre = genreMapping[audioMetadata.suggestedGenre];
            if (mappedGenre) {
                genreField.value = mappedGenre;
                // Mark as AI suggestion, not user input
                this.userInputManager.setUserInput('radio-genre', mappedGenre, false);
            }
        }

        // Show the form when audio is uploaded
        const form = document.getElementById('radio-metadata-form');
        if (form) {
            form.style.display = 'block';
        }
    }

    validateMetadata() {
        const validation = {
            isValid: true,
            errors: []
        };

        // Required field validation
        const title = this.getFieldValue('radio-track-title');
        const artist = this.getFieldValue('radio-artist-name');
        const genre = this.getFieldValue('radio-genre');

        if (!title || title.length < 2) {
            validation.isValid = false;
            validation.errors.push('Track title is required (min 2 characters)');
        }

        if (!artist || artist.length < 2) {
            validation.isValid = false;
            validation.errors.push('Artist name is required (min 2 characters)');
        }

        if (!genre) {
            validation.isValid = false;
            validation.errors.push('Genre selection is required');
        }

        // ISRC format validation
        const isrc = this.getFieldValue('radio-isrc');
        if (isrc && !this.validateISRC(isrc)) {
            validation.isValid = false;
            validation.errors.push('ISRC format should be: ZA-XXX-XX-XXXXX');
        }

        this.updateValidationUI(validation);
        return validation;
    }

    validateISRC(isrc) {
        // South African ISRC format: ZA-XXX-XX-XXXXX
        const isrcPattern = /^ZA-[A-Z0-9]{3}-\d{2}-\d{5}$/i;
        return isrcPattern.test(isrc.replace(/\s/g, ''));
    }

    updateValidationUI(validation) {
        const validationDiv = document.getElementById('metadata-validation');
        if (!validationDiv) return;

        const icon = validationDiv.querySelector('.validation-icon');
        const text = validationDiv.querySelector('.validation-text');

        if (validation.isValid) {
            icon.textContent = '✅';
            text.textContent = 'Track metadata complete';
            validationDiv.className = 'validation-status valid';
        } else {
            icon.textContent = '⚠️';
            text.textContent = validation.errors[0] || 'Please complete required fields';
            validationDiv.className = 'validation-status invalid';
        }

        // Enable/disable package generation
        const generateBtn = document.getElementById('generate-radio-package');
        if (generateBtn) {
            generateBtn.disabled = !validation.isValid;
        }
    }

    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? this.sanitizeInput(field.value) : '';
    }

    sanitizeInput(input) {
        if (!input) return '';
        return String(input)
            .replace(/[<>"'&]/g, (match) => {
                const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
                return map[match];
            })
            .trim()
            .substring(0, 200);
    }

    getTrackMetadata() {
        // USER INPUT PRIORITY: Use UserInputManager to get final values
        const metadata = {
            title: this.userInputManager.getValue('radio-title', this.getFieldValue('radio-track-title'), 'Untitled Track'),
            artistName: this.userInputManager.getValue('radio-artist', this.getFieldValue('radio-artist-name'), 'Unknown Artist'),
            stageName: this.userInputManager.getValue('radio-stage', this.getFieldValue('radio-stage-name'), ''),
            genre: this.userInputManager.getValue('radio-genre', this.getFieldValue('radio-genre'), 'Electronic'),
            language: this.userInputManager.getValue('radio-language', this.getFieldValue('radio-language'), 'English'),
            recordLabel: this.userInputManager.getValue('radio-label', this.getFieldValue('radio-record-label'), 'Independent'),
            isrc: this.userInputManager.getValue('radio-isrc', this.getFieldValue('radio-isrc'), ''),
            contentRating: this.userInputManager.getValue('radio-explicit', this.getFieldValue('radio-content-rating'), 'clean'),
            // Rich artist biography
            biography: this.userInputManager.getValue('artist-biography', this.getFieldValue('artist-bio'), ''),
            influences: this.userInputManager.getValue('artist-influences', this.getFieldValue('influences'), ''),
            social: {
                instagram: this.userInputManager.getValue('social-instagram', this.getFieldValue('instagram'), ''),
                twitter: this.userInputManager.getValue('social-twitter', this.getFieldValue('twitter'), '')
            },
            submissionDate: new Date().toISOString(),
            submissionType: 'radio_submission',
            userControlled: true // Mark as user-controlled metadata
        };

        // Enhance with ISRC manager if available
        if (this.isrcManager) {
            return this.isrcManager.enhanceMetadataWithISRC(metadata);
        }

        return metadata;
    }

    isValid() {
        return this.validateMetadata().isValid;
    }

    showForm() {
        const form = document.getElementById('radio-metadata-form');
        if (form) {
            form.style.display = 'block';
        }
    }

    hideForm() {
        const form = document.getElementById('radio-metadata-form');
        if (form) {
            form.style.display = 'none';
        }
    }

    reset() {
        const form = document.getElementById('radio-metadata-form');
        if (form) {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.value = '';
            });
            this.hideForm();
        }
    }
}

window.RadioMetadataManager = RadioMetadataManager;