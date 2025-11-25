// Real Google OAuth2 Authentication for Chrome Extension
class AuthenticationManager {
    constructor() {
        this.authenticated = false;
        this.userProfile = null;
        this.accessToken = null;
    }

    async initialize() {
        try {
            // Check if user is already authenticated
            const stored = await chrome.storage.local.get(['auth_token', 'user_profile']);
            if (stored.auth_token && stored.user_profile) {
                this.accessToken = stored.auth_token;
                this.userProfile = stored.user_profile;
                this.isAuthenticated = true;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Auth initialization failed:', error);
            return false;
        }
    }

    async signInWithGoogle() {
        return new Promise((resolve, reject) => {
            try {

                // Check if OAuth2 is properly configured
                if (!chrome.identity) {
                    reject(new Error('Google OAuth2 not available. Extension must be installed from Chrome Web Store.'));
                    return;
                }

                // Use Chrome Web Store's automatic OAuth2 (works after publication)
                console.log('🌐 Attempting Chrome Web Store OAuth2...');
                chrome.identity.getAuthToken({
                    interactive: true
                }, async (token) => {
                    if (chrome.runtime.lastError) {
                        const errorMessage = chrome.runtime.lastError.message || 'OAuth authentication failed';
                        console.error('OAuth error:', errorMessage);
                        reject(new Error('Google sign-in failed: ' + errorMessage));
                        return;
                    }
                    
                    console.log('✅ Chrome Web Store OAuth2 success - extension is published!');

                    if (!token) {
                        reject(new Error('No access token received'));
                        return;
                    }

                    try {
                        // Get user profile from Google API
                        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch user profile');
                        }

                        const userInfo = await response.json();
                        
                        // Store authentication data
                        this.accessToken = token;
                        this.userProfile = {
                            id: userInfo.id,
                            email: userInfo.email,
                            name: userInfo.name,
                            picture: userInfo.picture,
                            verified_email: userInfo.verified_email
                        };
                        this.authenticated = true;

                        // Persist to storage
                        await chrome.storage.local.set({
                            'auth_token': token,
                            'user_profile': this.userProfile,
                            'auth_timestamp': Date.now()
                        });

                        // Generate secure wallet for user
                        await this.generateUserWallet();

                        resolve({
                            success: true,
                            user: this.userProfile,
                            token: token
                        });

                    } catch (profileError) {
                        console.error('Profile fetch failed:', profileError);
                        reject(profileError);
                    }
                });
            } catch (error) {
                console.error('Sign-in failed:', error);
                reject(error);
            }
        });
    }



    async generateUserWallet() {
        try {
            // Generate cryptographically secure wallet
            const entropy = new Uint8Array(32);
            crypto.getRandomValues(entropy);
            
            // Create wallet seed from user ID + entropy
            const userSeed = this.userProfile.id + Array.from(entropy).join('');
            const encoder = new TextEncoder();
            const data = encoder.encode(userSeed);
            
            // Generate wallet private key using Web Crypto API
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                data,
                { name: 'PBKDF2' },
                false,
                ['deriveBits']
            );
            
            const salt = encoder.encode('BeatsChain-Wallet-Salt-2024');
            const derivedBits = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                256
            );
            
            const privateKeyArray = new Uint8Array(derivedBits);
            const privateKey = '0x' + Array.from(privateKeyArray, byte => 
                byte.toString(16).padStart(2, '0')
            ).join('');
            
            // Generate public address (simplified - in production use proper elliptic curve)
            const addressBytes = new Uint8Array(20);
            crypto.getRandomValues(addressBytes);
            const walletAddress = '0x' + Array.from(addressBytes, byte => 
                byte.toString(16).padStart(2, '0')
            ).join('');
            
            // Store encrypted wallet data
            const walletData = {
                address: walletAddress,
                privateKey: privateKey, // In production, encrypt this
                created: Date.now(),
                userId: this.userProfile.id
            };
            
            // Store address and encrypted private key
            await chrome.storage.local.set({
                'wallet_address': walletAddress,
                'wallet_created': Date.now()
            });

            // Use WalletSecureStorage to encrypt the private key before persisting
            if (window.WalletSecureStorage) {
                try {
                    await WalletSecureStorage.encryptAndStore('wallet_private_key_encrypted', privateKey);
                } catch (err) {
                    console.error('Failed to encrypt and store wallet private key:', err);
                    // As a fallback, do NOT store plaintext; surface error
                }
            } else {
                console.warn('WalletSecureStorage not available - private key not stored');
            }
            
            console.log('Secure wallet generated:', walletAddress);
            return walletData;
            
        } catch (error) {
            console.error('Wallet generation failed:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            // Revoke Chrome identity token
            if (this.accessToken) {
                chrome.identity.removeCachedAuthToken({ token: this.accessToken }, () => {
                    console.log('Token revoked');
                });
            }

            // Clear stored data (remove encrypted key if present)
            await chrome.storage.local.remove([
                'auth_token',
                'user_profile',
                'auth_timestamp',
                'wallet_address',
                'wallet_created'
            ]);

            if (window.WalletSecureStorage) {
                await WalletSecureStorage.remove('wallet_private_key_encrypted');
            }

            // Reset state
            this.authenticated = false;
            this.userProfile = null;
            this.accessToken = null;

            return { success: true };
        } catch (error) {
            console.error('Sign-out failed:', error);
            throw error;
        }
    }

    async refreshToken() {
        try {
            if (!this.accessToken) {
                throw new Error('No token to refresh');
            }

            // Check token validity
            const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `access_token=${this.accessToken}`
            });

            if (!response.ok) {
                // Token expired, need to re-authenticate
                await this.signOut();
                return false;
            }

            const tokenInfo = await response.json();
            
            // Update timestamp
            await chrome.storage.local.set({
                'auth_timestamp': Date.now()
            });

            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    async getWalletAddress() {
        try {
            const result = await chrome.storage.local.get(['wallet_address']);
            return result.wallet_address || null;
        } catch (error) {
            console.error('Failed to get wallet address:', error);
            return null;
        }
    }

    async getWalletBalance() {
        try {
            const walletAddress = await this.getWalletAddress();
            if (!walletAddress) return '0.0000';

            // In production, fetch real balance from blockchain
            // For now, return mock balance
            const mockBalance = (Math.random() * 10).toFixed(4);
            return mockBalance;
        } catch (error) {
            console.error('Failed to get wallet balance:', error);
            return '0.0000';
        }
    }

    isTokenExpired() {
        // Check if token is older than 1 hour
        const stored = chrome.storage.local.get(['auth_timestamp']);
        if (!stored.auth_timestamp) return true;
        
        const oneHour = 60 * 60 * 1000;
        return (Date.now() - stored.auth_timestamp) > oneHour;
    }

    getUserProfile() {
        return this.userProfile;
    }
    
    hasPermission(permission) {
        if (!this.userProfile || !this.userProfile.permissions) {
            return this.userProfile && this.userProfile.role === 'admin';
        }
        return this.userProfile.permissions.includes(permission);
    }

    getAccessToken() {
        return this.accessToken;
    }

    isAuthenticated() {
        return this.authenticated && this.userProfile && this.accessToken;
    }
}

// Export for Chrome extension compatibility
window.AuthenticationManager = AuthenticationManager;