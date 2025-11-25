/**
 * Verification Script for BeatsChain Extension Fixes
 * Tests the actual issues identified and their solutions
 */

console.log('🔍 BeatsChain Extension Fix Verification');
console.log('==========================================');

// Test 1: SecurityValidator Methods
console.log('\n1. Testing SecurityValidator Methods...');
try {
    if (window.SecurityValidator) {
        const validator = new SecurityValidator();
        
        // Test validateAudioFile method exists
        if (typeof validator.validateAudioFile === 'function') {
            console.log('✅ validateAudioFile method exists');
        } else {
            console.log('❌ validateAudioFile method missing');
        }
        
        // Test validateImageFile method exists
        if (typeof validator.validateImageFile === 'function') {
            console.log('✅ validateImageFile method exists');
        } else {
            console.log('❌ validateImageFile method missing');
        }
        
        // Test with mock file
        const mockFile = {
            name: 'test.mp3',
            size: 1024 * 1024, // 1MB
            type: 'audio/mpeg'
        };
        
        validator.validateAudioFile(mockFile).then(result => {
            console.log('✅ validateAudioFile works:', result.isValid);
        }).catch(error => {
            console.log('❌ validateAudioFile error:', error.message);
        });
        
    } else {
        console.log('❌ SecurityValidator not available');
    }
} catch (error) {
    console.log('❌ SecurityValidator test failed:', error.message);
}

// Test 2: IPFS Asset Manager Production Mode
console.log('\n2. Testing IPFS Asset Manager...');
try {
    if (window.IPFSAssetManager) {
        const ipfsManager = new IPFSAssetManager();
        
        console.log('✅ IPFSAssetManager available');
        console.log('📦 Production mode:', ipfsManager.isProduction);
        console.log('🔗 Production manifest hash:', ipfsManager.productionManifestHash);
        
        // Test manifest fetching
        ipfsManager.fetchSponsorManifest().then(manifest => {
            console.log('✅ Manifest loaded:', manifest ? 'Success' : 'Failed');
            console.log('📊 Sponsors count:', manifest?.sponsors?.length || 0);
        }).catch(error => {
            console.log('⚠️ Manifest fetch error (expected in dev):', error.message);
        });
        
    } else {
        console.log('❌ IPFSAssetManager not available');
    }
} catch (error) {
    console.log('❌ IPFS test failed:', error.message);
}

// Test 3: OAuth Error Handling
console.log('\n3. Testing OAuth Error Handling...');
try {
    if (window.UnifiedAuthenticationManager) {
        const auth = new UnifiedAuthenticationManager();
        
        console.log('✅ UnifiedAuthenticationManager available');
        console.log('🔐 Guest mode method:', typeof auth.enableGuestMode === 'function' ? 'Available' : 'Missing');
        
        // Test guest mode
        auth.enableGuestMode();
        const profile = auth.getUserProfile();
        console.log('👤 Guest mode profile:', profile?.guestMode ? 'Working' : 'Failed');
        
    } else {
        console.log('❌ UnifiedAuthenticationManager not available');
    }
} catch (error) {
    console.log('❌ OAuth test failed:', error.message);
}

// Test 4: CSS Files
console.log('\n4. Testing CSS Files...');
const cssFiles = [
    'enhanced-campaign-styles.css',
    'admin-dashboard-styles.css'
];

cssFiles.forEach(file => {
    const link = document.querySelector(`link[href*="${file}"]`);
    if (link) {
        console.log(`✅ ${file} loaded`);
    } else {
        console.log(`❌ ${file} missing`);
    }
});

// Test 5: Script Loading Order
console.log('\n5. Testing Script Loading Order...');
const requiredScripts = [
    'security-validator.js',
    'audio-manager.js',
    'ipfs-asset-manager.js',
    'unified-auth.js'
];

requiredScripts.forEach(script => {
    const scriptElement = document.querySelector(`script[src*="${script}"]`);
    if (scriptElement) {
        console.log(`✅ ${script} loaded`);
    } else {
        console.log(`❌ ${script} missing`);
    }
});

console.log('\n🎯 Verification Complete');
console.log('Check console for detailed results');