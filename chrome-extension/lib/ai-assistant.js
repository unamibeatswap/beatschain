/**
 * AI Assistant Manager - Smart Form Auto-fill and Suggestions
 * Uses Chrome AI APIs for intelligent form completion and validation
 */

class AIAssistantManager {
    constructor() {
        this.chromeAI = null;
        this.userInputManager = null;
        this.isInitialized = false;
        this.suggestions = {};
    }

    async initialize(chromeAI, userInputManager) {
        this.chromeAI = chromeAI;
        this.userInputManager = userInputManager;
        
        if (this.chromeAI && this.chromeAI.apis) {
            this.isInitialized = true;
            this.setupSmartFormFeatures();
            console.log('✅ AI Assistant initialized with Chrome AI APIs');
        } else {
            console.log('ℹ️ AI Assistant using fallback templates');
        }
    }

    setupSmartFormFeatures() {
        // Add AI assistance to text areas and inputs
        this.enhanceTextInputs();
        this.addSmartSuggestions();
        this.setupPasteEnhancement();
    }

    enhanceTextInputs() {
        const textInputs = document.querySelectorAll('textarea, input[type="text"]');
        
        textInputs.forEach(input => {
            if (input.hasAttribute('data-ai-enhanced')) return;
            
            input.setAttribute('data-ai-enhanced', 'true');
            this.addAIAssistanceToInput(input);
        });
    }

    addAIAssistanceToInput(input) {
        const container = input.parentElement;
        if (!container || container.querySelector('.ai-assistance')) return;

        const assistanceDiv = document.createElement('div');
        assistanceDiv.className = 'ai-assistance';
        assistanceDiv.innerHTML = `
            <div class="ai-controls">
                <button type="button" class="ai-suggest-btn" title="Get AI suggestions">
                    🤖 AI Suggest
                </button>
                <button type="button" class="ai-improve-btn" title="Improve with AI" style="display: none;">
                    ✨ Improve
                </button>
            </div>
            <div class="ai-suggestions" style="display: none;"></div>
        `;

        container.appendChild(assistanceDiv);

        // Event listeners
        const suggestBtn = assistanceDiv.querySelector('.ai-suggest-btn');
        const improveBtn = assistanceDiv.querySelector('.ai-improve-btn');

        suggestBtn.addEventListener('click', () => {
            this.generateSuggestions(input);
        });

        improveBtn.addEventListener('click', () => {
            this.improveContent(input);
        });

        // Show improve button when there's content
        input.addEventListener('input', () => {
            const hasContent = input.value.trim().length > 10;
            improveBtn.style.display = hasContent ? 'inline-block' : 'none';
        });
    }

    async generateSuggestions(input) {
        const suggestBtn = input.parentElement.querySelector('.ai-suggest-btn');
        const suggestionsDiv = input.parentElement.querySelector('.ai-suggestions');
        
        if (!suggestBtn || !suggestionsDiv) return;

        const originalText = suggestBtn.textContent;
        suggestBtn.textContent = '🤖 Thinking...';
        suggestBtn.disabled = true;

        try {
            const fieldType = this.identifyFieldType(input);
            const context = this.gatherFormContext(input);
            const suggestions = await this.generateFieldSuggestions(fieldType, context);

            if (suggestions && suggestions.length > 0) {
                this.displaySuggestions(suggestionsDiv, suggestions, input);
                suggestionsDiv.style.display = 'block';
            } else {
                suggestionsDiv.innerHTML = '<div class="ai-message">No suggestions available for this field</div>';
                suggestionsDiv.style.display = 'block';
            }

        } catch (error) {
            console.error('AI suggestions failed:', error);
            suggestionsDiv.innerHTML = '<div class="ai-message ai-error">AI suggestions unavailable</div>';
            suggestionsDiv.style.display = 'block';
        } finally {
            suggestBtn.textContent = originalText;
            suggestBtn.disabled = false;
        }
    }

    async improveContent(input) {
        const improveBtn = input.parentElement.querySelector('.ai-improve-btn');
        if (!improveBtn) return;

        const originalText = improveBtn.textContent;
        const currentContent = input.value.trim();
        
        if (!currentContent) return;

        improveBtn.textContent = '✨ Improving...';
        improveBtn.disabled = true;

        try {
            const fieldType = this.identifyFieldType(input);
            const improved = await this.improveFieldContent(currentContent, fieldType);

            if (improved && improved !== currentContent) {
                this.showImprovementComparison(input, currentContent, improved);
            } else {
                this.showTemporaryMessage(improveBtn, 'Content looks good!', 2000);
            }

        } catch (error) {
            console.error('Content improvement failed:', error);
            this.showTemporaryMessage(improveBtn, 'Improvement failed', 2000);
        } finally {
            improveBtn.textContent = originalText;
            improveBtn.disabled = false;
        }
    }

    identifyFieldType(input) {
        const id = input.id.toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        const label = this.getFieldLabel(input);

        if (id.includes('bio') || id.includes('description') || placeholder.includes('bio')) {
            return 'biography';
        } else if (id.includes('title') || id.includes('name') || placeholder.includes('title')) {
            return 'title';
        } else if (id.includes('genre') || placeholder.includes('genre')) {
            return 'genre';
        } else if (id.includes('influence') || placeholder.includes('influence')) {
            return 'influences';
        } else if (id.includes('email') || placeholder.includes('email')) {
            return 'email';
        } else if (id.includes('phone') || placeholder.includes('phone')) {
            return 'phone';
        } else if (id.includes('website') || placeholder.includes('website')) {
            return 'website';
        }

        return 'general';
    }

    getFieldLabel(input) {
        const labels = input.parentElement.querySelectorAll('label');
        for (const label of labels) {
            if (label.getAttribute('for') === input.id) {
                return label.textContent.toLowerCase();
            }
        }
        return '';
    }

    gatherFormContext(input) {
        const form = input.closest('form') || input.closest('.section');
        const context = {
            section: 'unknown',
            existingData: {}
        };

        // Identify section
        if (form) {
            if (form.id.includes('profile') || form.closest('#profile-section')) {
                context.section = 'profile';
            } else if (form.id.includes('radio') || form.closest('#radio-section')) {
                context.section = 'radio';
            } else if (form.closest('#upload-section')) {
                context.section = 'nft';
            }
        }

        // Gather existing form data
        const inputs = form ? form.querySelectorAll('input, textarea, select') : [];
        inputs.forEach(inp => {
            if (inp.value && inp.id) {
                context.existingData[inp.id] = inp.value;
            }
        });

        return context;
    }

    async generateFieldSuggestions(fieldType, context) {
        if (!this.chromeAI || !this.chromeAI.apis.languageModel) {
            return this.getFallbackSuggestions(fieldType);
        }

        try {
            const prompt = this.buildSuggestionPrompt(fieldType, context);
            const response = await this.chromeAI.apis.languageModel.prompt(prompt);
            
            return this.parseSuggestions(response, fieldType);
        } catch (error) {
            console.error('AI suggestion generation failed:', error);
            return this.getFallbackSuggestions(fieldType);
        }
    }

    buildSuggestionPrompt(fieldType, context) {
        const basePrompt = `Generate 3 professional suggestions for a ${fieldType} field in a music industry context.`;
        
        let contextInfo = '';
        if (context.existingData.artistName || context.existingData['radio-artist-name']) {
            contextInfo += `Artist: ${context.existingData.artistName || context.existingData['radio-artist-name']}. `;
        }
        if (context.existingData.genre || context.existingData['radio-genre']) {
            contextInfo += `Genre: ${context.existingData.genre || context.existingData['radio-genre']}. `;
        }

        const specificPrompts = {
            biography: `${basePrompt} Create engaging artist biographies that highlight musical journey, achievements, and style. ${contextInfo}Format as JSON array: ["suggestion1", "suggestion2", "suggestion3"]`,
            title: `${basePrompt} Suggest creative track titles that fit the genre and style. ${contextInfo}Format as JSON array: ["title1", "title2", "title3"]`,
            influences: `${basePrompt} Suggest musical influences that would fit this artist's style. ${contextInfo}Format as JSON array: ["influence1", "influence2", "influence3"]`,
            general: `${basePrompt} Provide helpful content suggestions. ${contextInfo}Format as JSON array: ["suggestion1", "suggestion2", "suggestion3"]`
        };

        return specificPrompts[fieldType] || specificPrompts.general;
    }

    parseSuggestions(response, fieldType) {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(response);
            if (Array.isArray(parsed)) {
                return parsed.slice(0, 3);
            }
        } catch (error) {
            // Fallback: extract suggestions from text
            const lines = response.split('\n').filter(line => line.trim());
            return lines.slice(0, 3).map(line => line.replace(/^\d+\.?\s*/, '').trim());
        }
        
        return [];
    }

    getFallbackSuggestions(fieldType) {
        const fallbacks = {
            biography: [
                "Emerging artist with a passion for creating unique sounds that blend traditional and modern elements.",
                "Versatile musician known for innovative production techniques and compelling storytelling through music.",
                "Rising talent in the music scene, dedicated to pushing creative boundaries and connecting with audiences."
            ],
            title: [
                "Midnight Reflections",
                "Urban Dreams",
                "Echoes of Tomorrow"
            ],
            influences: [
                "J Dilla, Kanye West, Timbaland",
                "Quincy Jones, Dr. Dre, Metro Boomin",
                "Pharrell Williams, The Neptunes, 9th Wonder"
            ],
            general: [
                "Professional content suggestion 1",
                "Professional content suggestion 2", 
                "Professional content suggestion 3"
            ]
        };

        return fallbacks[fieldType] || fallbacks.general;
    }

    displaySuggestions(container, suggestions, input) {
        container.innerHTML = `
            <div class="ai-suggestions-header">
                <span class="ai-icon">🤖</span>
                <span class="ai-title">AI Suggestions</span>
                <button class="ai-close" title="Close suggestions">&times;</button>
            </div>
            <div class="suggestions-list">
                ${suggestions.map((suggestion, index) => `
                    <div class="suggestion-item" data-suggestion="${this.escapeHtml(suggestion)}">
                        <div class="suggestion-text">${this.escapeHtml(suggestion)}</div>
                        <button class="suggestion-use" title="Use this suggestion">Use</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Event listeners
        container.querySelector('.ai-close').addEventListener('click', () => {
            container.style.display = 'none';
        });

        container.querySelectorAll('.suggestion-use').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const suggestionItem = e.target.closest('.suggestion-item');
                const suggestion = suggestionItem.dataset.suggestion;
                input.value = suggestion;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                container.style.display = 'none';
                
                // Mark as user input
                if (this.userInputManager) {
                    this.userInputManager.setUserInput(input.id, suggestion, true);
                }
            });
        });
    }

    async improveFieldContent(content, fieldType) {
        if (!this.chromeAI || !this.chromeAI.apis.rewriter) {
            return this.getFallbackImprovement(content, fieldType);
        }

        try {
            const prompt = `Improve this ${fieldType} content for a professional music industry context: "${content}"`;
            const improved = await this.chromeAI.apis.rewriter.rewrite(content, { context: prompt });
            return improved;
        } catch (error) {
            console.error('Content improvement failed:', error);
            return this.getFallbackImprovement(content, fieldType);
        }
    }

    getFallbackImprovement(content, fieldType) {
        // Simple improvements for fallback
        let improved = content.trim();
        
        // Capitalize first letter
        improved = improved.charAt(0).toUpperCase() + improved.slice(1);
        
        // Ensure proper ending punctuation for biographies
        if (fieldType === 'biography' && !improved.match(/[.!?]$/)) {
            improved += '.';
        }
        
        return improved;
    }

    showImprovementComparison(input, original, improved) {
        const modal = document.createElement('div');
        modal.className = 'ai-improvement-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🤖 AI Content Improvement</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="comparison-section">
                            <h4>Original:</h4>
                            <div class="content-box original">${this.escapeHtml(original)}</div>
                        </div>
                        <div class="comparison-section">
                            <h4>AI Improved:</h4>
                            <div class="content-box improved">${this.escapeHtml(improved)}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary keep-original">Keep Original</button>
                        <button class="btn btn-primary use-improved">Use Improved</button>
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.keep-original').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.use-improved').addEventListener('click', () => {
            input.value = improved;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            if (this.userInputManager) {
                this.userInputManager.setUserInput(input.id, improved, true);
            }
            
            document.body.removeChild(modal);
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    }

    setupPasteEnhancement() {
        document.addEventListener('paste', async (e) => {
            const target = e.target;
            if (!target.matches('textarea, input[type="text"]')) return;
            
            // Wait for paste to complete
            setTimeout(async () => {
                const content = target.value;
                if (content.length > 50) {
                    await this.offerPasteEnhancement(target, content);
                }
            }, 100);
        });
    }

    async offerPasteEnhancement(input, content) {
        const container = input.parentElement;
        let enhanceOffer = container.querySelector('.paste-enhance-offer');
        
        if (enhanceOffer) {
            enhanceOffer.remove();
        }

        enhanceOffer = document.createElement('div');
        enhanceOffer.className = 'paste-enhance-offer';
        enhanceOffer.innerHTML = `
            <div class="enhance-message">
                <span class="enhance-icon">✨</span>
                <span class="enhance-text">Enhance pasted content with AI?</span>
                <button class="enhance-yes btn btn-sm">Yes</button>
                <button class="enhance-no btn btn-sm">No</button>
            </div>
        `;

        container.appendChild(enhanceOffer);

        enhanceOffer.querySelector('.enhance-yes').addEventListener('click', async () => {
            await this.improveContent(input);
            enhanceOffer.remove();
        });

        enhanceOffer.querySelector('.enhance-no').addEventListener('click', () => {
            enhanceOffer.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (enhanceOffer.parentNode) {
                enhanceOffer.remove();
            }
        }, 5000);
    }

    showTemporaryMessage(element, message, duration = 2000) {
        const originalText = element.textContent;
        element.textContent = message;
        
        setTimeout(() => {
            element.textContent = originalText;
        }, duration);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addSmartSuggestions() {
        // Add contextual suggestions based on form completion
        this.setupFormProgressTracking();
    }

    setupFormProgressTracking() {
        const forms = document.querySelectorAll('.section');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.checkFormCompletion(form);
                });
            });
        });
    }

    checkFormCompletion(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        const completed = Array.from(inputs).filter(input => input.value.trim()).length;
        const total = inputs.length;
        
        if (completed === total) {
            this.showCompletionSuggestion(form);
        }
    }

    showCompletionSuggestion(form) {
        // Show helpful next steps when form is complete
        const suggestion = document.createElement('div');
        suggestion.className = 'completion-suggestion';
        suggestion.innerHTML = `
            <div class="suggestion-content">
                <span class="suggestion-icon">🎉</span>
                <span class="suggestion-text">Form completed! Ready for the next step.</span>
            </div>
        `;
        
        form.appendChild(suggestion);
        
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.remove();
            }
        }, 3000);
    }
}

// Export for Chrome extension compatibility
window.AIAssistantManager = AIAssistantManager;