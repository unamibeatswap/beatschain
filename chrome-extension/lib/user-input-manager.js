// User Input Manager - Ensures User Inputs Take Priority Over AI Analysis
class UserInputManager {
    constructor() {
        this.userInputs = new Map();
    }
    
    // Store user input with priority flag
    setUserInput(key, value, isUserSelected = true) {
        this.userInputs.set(key, {
            value: this.sanitizeInput(value),
            isUserSelected,
            timestamp: Date.now()
        });
    }
    
    // Get value with STRICT user priority over AI analysis
    getValue(key, aiSuggestion = null, fallback = null) {
        const userInput = this.userInputs.get(key);
        
        // ABSOLUTE PRIORITY: User Input ALWAYS wins if it exists
        if (userInput && userInput.isUserSelected && userInput.value) {
            return userInput.value;
        }
        
        // Only use AI suggestion if no user input exists
        return aiSuggestion || fallback;
    }
    
    // Merge metadata with ABSOLUTE user input priority
    mergeWithUserInputs(metadata, userInputs) {
        const result = {
            ...metadata,
            // USER INPUTS ALWAYS OVERRIDE AI ANALYSIS - NO EXCEPTIONS
            title: this.getValue('title', userInputs.beatTitle, metadata.title),
            artist: this.getValue('artist', userInputs.artistName, metadata.artist),
            stageName: this.getValue('stageName', userInputs.stageName, metadata.stageName),
            genre: this.getValue('genre', userInputs.genre, metadata.suggestedGenre),
            contentType: this.getValue('content-type', userInputs.contentType, 'instrumental'),
            // Profile information
            legalName: this.getValue('legal-name', userInputs.legalName, metadata.legalName),
            displayName: this.getValue('display-name', userInputs.displayName, metadata.displayName),
            role: this.getValue('role', userInputs.role, metadata.role),
            // Keep original AI analysis as backup only
            aiSuggestedGenre: metadata.suggestedGenre,
            // Mark as user-controlled
            userControlled: true,
            userInputPriority: true
        };
        
        // Ensure user genre selection is preserved
        if (this.userInputs.has('genre') && this.userInputs.get('genre').isUserSelected) {
            result.suggestedGenre = result.genre;
        }
        
        return result;
    }
    
    // Validate user input
    validateUserInput(input, type = 'text') {
        if (!input || typeof input !== 'string') return false;
        
        switch (type) {
            case 'genre':
                const validGenres = ['Hip-Hop', 'House', 'Techno', 'Electronic', 'Pop', 'Rock', 'Jazz', 'Trap', 'Drum & Bass'];
                return validGenres.includes(input) || input.length <= 50;
            case 'title':
                return /^[a-zA-Z0-9\s\-_.,!?]{1,100}$/.test(input.trim());
            case 'name':
            case 'legal-name':
            case 'display-name':
                return /^[a-zA-Z0-9\s\-_.']{1,100}$/.test(input.trim());
            case 'role':
                const validRoles = ['artist', 'producer', 'both'];
                return validRoles.includes(input);
            case 'content-type':
                const validTypes = ['instrumental', 'vocal', 'mixed'];
                return validTypes.includes(input);
            default:
                return input.trim().length > 0 && input.length <= 200;
        }
    }
    
    // Secure input sanitization
    sanitizeInput(input) {
        if (!input) return '';
        return String(input)
            .replace(/[<>\"'&]/g, (match) => {
                const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
                return map[match];
            })
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
            .trim()
            .substring(0, 200);
    }
    
    // Clear all user inputs
    clear() {
        this.userInputs.clear();
    }
    
    // Get all user inputs for debugging
    getAllInputs() {
        return Object.fromEntries(this.userInputs);
    }
}

// Export for Chrome extension compatibility
window.UserInputManager = UserInputManager;