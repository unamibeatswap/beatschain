/**
 * Environment Loader for Chrome Extension
 * Loads .env file and integrates with Chrome storage
 */

class EnvLoader {
    static async loadEnvToStorage() {
        try {
            // Fetch .env file content
            const response = await fetch(chrome.runtime.getURL('.env'));
            const envContent = await response.text();
            
            const envVars = this.parseEnvContent(envContent);
            
            // Store in Chrome storage
            await chrome.storage.local.set(envVars);
            console.log('✅ Environment variables loaded to Chrome storage');
            
            return envVars;
        } catch (error) {
            // Silently use defaults when .env file is not available
            const defaults = {
                'THIRDWEB_CLIENT_ID': 'default_client_id',
                'POLYGON_RPC_URL': 'https://polygon-rpc.com',
                'PINATA_JWT': 'default_jwt'
            };
            await chrome.storage.local.set(defaults);
            return defaults;
        }
    }
    
    static parseEnvContent(content) {
        const vars = {};
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    vars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
                }
            }
        }
        
        return vars;
    }
}

window.EnvLoader = EnvLoader;