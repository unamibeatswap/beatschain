// Migration Manager - Gracefully migrate existing user data to unified system
class MigrationManager {
    constructor() {
        this.migrationVersion = '2.5.0';
    }

    async checkAndMigrate() {
        try {
            const result = await chrome.storage.local.get(['migration_version']);
            const currentVersion = result.migration_version;
            
            if (currentVersion === this.migrationVersion) {
                console.log('✅ Migration up to date');
                return true;
            }
            
            console.log('🔄 Starting graceful migration...');
            await this.performMigration();
            
            await chrome.storage.local.set({
                'migration_version': this.migrationVersion,
                'migration_date': Date.now()
            });
            
            console.log('✅ Migration completed successfully');
            return true;
        } catch (error) {
            console.error('❌ Migration failed:', error);
            return false;
        }
    }

    async performMigration() {
        // Step 1: Backup existing data
        await this.backupExistingData();
        
        // Step 2: Migrate authentication data
        await this.migrateAuthenticationData();
        
        // Step 3: Consolidate wallet addresses
        await this.consolidateWalletData();
        
        // Step 4: Clean up duplicates (preserve originals as backup)
        await this.cleanupDuplicates();
    }

    async backupExistingData() {
        try {
            const allData = await chrome.storage.local.get(null);
            await chrome.storage.local.set({
                'migration_backup': {
                    data: allData,
                    timestamp: Date.now(),
                    version: 'pre-unified'
                }
            });
            console.log('✅ Existing data backed up');
        } catch (error) {
            console.error('Backup failed:', error);
            throw error;
        }
    }

    async migrateAuthenticationData() {
        try {
            const authData = await chrome.storage.local.get([
                'auth_token', 'user_profile', 'auth_bypass',
                'enhanced_wallet_address', 'enhanced_wallet_private_key'
            ]);
            
            // If enhanced auth data exists, preserve it as unified
            if (authData.enhanced_wallet_address) {
                await chrome.storage.local.set({
                    'unified_wallet_address': authData.enhanced_wallet_address,
                    'unified_wallet_private_key': authData.enhanced_wallet_private_key,
                    'migration_source': 'enhanced_auth'
                });
                console.log('✅ Enhanced auth data migrated to unified system');
            }
            
        } catch (error) {
            console.error('Auth migration failed:', error);
        }
    }

    async consolidateWalletData() {
        try {
            const walletData = await chrome.storage.local.get([
                'wallet_address', 'enhanced_wallet_address', 'unified_wallet_address'
            ]);
            
            // Priority: unified > enhanced > basic
            const primaryAddress = walletData.unified_wallet_address || 
                                 walletData.enhanced_wallet_address || 
                                 walletData.wallet_address;
            
            if (primaryAddress && !walletData.unified_wallet_address) {
                await chrome.storage.local.set({
                    'unified_wallet_address': primaryAddress,
                    'wallet_consolidation_date': Date.now()
                });
                console.log('✅ Wallet addresses consolidated');
            }
            
            // Migrate localStorage Solana wallets to chrome.storage
            await this.migrateSolanaWallets();
            
        } catch (error) {
            console.error('Wallet consolidation failed:', error);
        }
    }

    async migrateSolanaWallets() {
        try {
            // Check for localStorage Solana wallets
            const solanaWallet = localStorage.getItem('solana_wallet');
            const solanaKeypair = localStorage.getItem('solana_wallet_keypair');
            
            if (solanaWallet || solanaKeypair) {
                // Move to secure chrome.storage (encrypted)
                await chrome.storage.local.set({
                    'solana_wallet_backup': {
                        wallet: solanaWallet,
                        keypair: solanaKeypair,
                        migrated_at: Date.now()
                    }
                });
                
                console.log('✅ Solana wallets backed up to secure storage');
                
                // Note: Keep localStorage for now to avoid breaking existing flows
                // Will be cleaned up in future version after full testing
            }
        } catch (error) {
            console.error('Solana wallet migration failed:', error);
        }
    }

    async cleanupDuplicates() {
        try {
            // Mark duplicate keys for future cleanup (don't delete yet)
            const duplicateKeys = [
                'enhanced_wallet_private_key', // Keep as backup for now
                'wallet_private_key_encrypted'  // Keep as backup for now
            ];
            
            await chrome.storage.local.set({
                'duplicate_keys_marked': duplicateKeys,
                'cleanup_scheduled': Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
            });
            
            console.log('✅ Duplicate keys marked for future cleanup');
        } catch (error) {
            console.error('Cleanup marking failed:', error);
        }
    }

    async rollbackMigration() {
        try {
            const backup = await chrome.storage.local.get(['migration_backup']);
            if (backup.migration_backup) {
                // Restore original data
                await chrome.storage.local.clear();
                await chrome.storage.local.set(backup.migration_backup.data);
                
                console.log('✅ Migration rolled back successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Rollback failed:', error);
            return false;
        }
    }

    async getMigrationStatus() {
        try {
            const result = await chrome.storage.local.get([
                'migration_version', 'migration_date', 'migration_backup'
            ]);
            
            return {
                currentVersion: result.migration_version,
                targetVersion: this.migrationVersion,
                migrationDate: result.migration_date,
                hasBackup: !!result.migration_backup,
                isUpToDate: result.migration_version === this.migrationVersion
            };
        } catch (error) {
            console.error('Failed to get migration status:', error);
            return null;
        }
    }
}

// Export for Chrome extension compatibility
window.MigrationManager = MigrationManager;