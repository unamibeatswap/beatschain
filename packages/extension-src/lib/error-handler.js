/**
 * Comprehensive Error Handler Utility
 * Provides safe error message extraction and logging
 */

class ErrorHandler {
    /**
     * Safely extract error message from any error object
     * @param {any} error - The error object (can be undefined, null, string, Error, etc.)
     * @param {string} fallbackMessage - Default message if error extraction fails
     * @returns {string} Safe error message
     */
    static safeErrorMessage(error, fallbackMessage = 'Unknown error') {
        try {
            // Handle null/undefined
            if (error === null || error === undefined) {
                return fallbackMessage;
            }
            
            // Handle Error objects
            if (error instanceof Error && error.message) {
                return String(error.message);
            }
            
            // Handle objects with message property
            if (error && typeof error === 'object' && error.message) {
                return String(error.message);
            }
            
            // Handle strings
            if (typeof error === 'string') {
                return error.trim() || fallbackMessage;
            }
            
            // Handle numbers
            if (typeof error === 'number') {
                return `Error code: ${error}`;
            }
            
            // Handle boolean
            if (typeof error === 'boolean') {
                return error ? 'Operation failed' : 'Operation returned false';
            }
            
            // Try to stringify other objects
            if (typeof error === 'object') {
                try {
                    const stringified = JSON.stringify(error);
                    return stringified !== '{}' ? stringified : fallbackMessage;
                } catch (stringifyError) {
                    return fallbackMessage;
                }
            }
            
            // Last resort - convert to string
            return String(error) || fallbackMessage;
            
        } catch (extractionError) {
            // If even error extraction fails, return fallback
            return fallbackMessage;
        }
    }

    /**
     * Safe console logging with error message extraction
     * @param {string} level - Log level (log, warn, error, info)
     * @param {string} context - Context description
     * @param {any} error - Error to log
     * @param {string} fallbackMessage - Fallback message
     */
    static safeLog(level, context, error, fallbackMessage = 'Unknown error') {
        const safeMessage = this.safeErrorMessage(error, fallbackMessage);
        const logMessage = `${context}: ${safeMessage}`;
        
        try {
            switch (level) {
                case 'error':
                    console.error(logMessage);
                    break;
                case 'warn':
                    console.warn(logMessage);
                    break;
                case 'info':
                    console.info(logMessage);
                    break;
                default:
                    console.log(logMessage);
            }
        } catch (logError) {
            // If console logging fails, try basic console.log
            try {
                console.log(`Logging failed - ${context}: ${safeMessage}`);
            } catch (finalError) {
                // Silent failure - can't even log
            }
        }
    }

    /**
     * Wrap async function with safe error handling
     * @param {Function} asyncFn - Async function to wrap
     * @param {string} context - Context for error logging
     * @param {any} fallbackReturn - Value to return on error
     * @returns {Function} Wrapped function
     */
    static wrapAsync(asyncFn, context, fallbackReturn = null) {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                this.safeLog('error', `${context} failed`, error);
                return fallbackReturn;
            }
        };
    }

    /**
     * Wrap sync function with safe error handling
     * @param {Function} syncFn - Sync function to wrap
     * @param {string} context - Context for error logging
     * @param {any} fallbackReturn - Value to return on error
     * @returns {Function} Wrapped function
     */
    static wrapSync(syncFn, context, fallbackReturn = null) {
        return (...args) => {
            try {
                return syncFn(...args);
            } catch (error) {
                this.safeLog('error', `${context} failed`, error);
                return fallbackReturn;
            }
        };
    }

    /**
     * Safe JSON parsing with error handling
     * @param {string} jsonString - JSON string to parse
     * @param {any} fallback - Fallback value if parsing fails
     * @returns {any} Parsed object or fallback
     */
    static safeJsonParse(jsonString, fallback = null) {
        try {
            if (typeof jsonString !== 'string') {
                return fallback;
            }
            return JSON.parse(jsonString);
        } catch (error) {
            this.safeLog('warn', 'JSON parsing failed', error);
            return fallback;
        }
    }

    /**
     * Safe JSON stringification with error handling
     * @param {any} obj - Object to stringify
     * @param {string} fallback - Fallback string if stringification fails
     * @returns {string} JSON string or fallback
     */
    static safeJsonStringify(obj, fallback = '{}') {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            this.safeLog('warn', 'JSON stringification failed', error);
            return fallback;
        }
    }

    /**
     * Safe property access with error handling
     * @param {any} obj - Object to access
     * @param {string} path - Property path (e.g., 'user.profile.name')
     * @param {any} fallback - Fallback value
     * @returns {any} Property value or fallback
     */
    static safeGet(obj, path, fallback = null) {
        try {
            if (!obj || typeof obj !== 'object') {
                return fallback;
            }
            
            const keys = path.split('.');
            let current = obj;
            
            for (const key of keys) {
                if (current === null || current === undefined || !(key in current)) {
                    return fallback;
                }
                current = current[key];
            }
            
            return current;
        } catch (error) {
            return fallback;
        }
    }

    /**
     * Create a safe error object with consistent structure
     * @param {string} message - Error message
     * @param {string} code - Error code
     * @param {any} originalError - Original error object
     * @returns {Object} Safe error object
     */
    static createSafeError(message, code = 'UNKNOWN_ERROR', originalError = null) {
        return {
            message: String(message || 'Unknown error'),
            code: String(code),
            timestamp: Date.now(),
            originalError: originalError ? this.safeErrorMessage(originalError) : null
        };
    }

    /**
     * Validate and sanitize user input
     * @param {any} input - User input to validate
     * @param {string} type - Expected type ('string', 'number', 'email', etc.)
     * @param {any} fallback - Fallback value
     * @returns {any} Validated input or fallback
     */
    static validateInput(input, type, fallback = null) {
        try {
            switch (type) {
                case 'string':
                    return typeof input === 'string' ? input.trim() : String(fallback || '');
                case 'number':
                    const num = Number(input);
                    return !isNaN(num) ? num : Number(fallback || 0);
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return typeof input === 'string' && emailRegex.test(input.trim()) ? 
                           input.trim() : String(fallback || '');
                case 'boolean':
                    return Boolean(input);
                case 'array':
                    return Array.isArray(input) ? input : (Array.isArray(fallback) ? fallback : []);
                case 'object':
                    return (input && typeof input === 'object' && !Array.isArray(input)) ? 
                           input : (fallback || {});
                default:
                    return input !== null && input !== undefined ? input : fallback;
            }
        } catch (error) {
            return fallback;
        }
    }
}

// Export for Chrome extension compatibility
if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}