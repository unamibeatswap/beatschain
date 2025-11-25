#!/usr/bin/env node

/**
 * Chrome Web Store Submission Verification
 * Final verification that the extension is ready for submission
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 BeatsChain Chrome Extension - Final Verification');
console.log('==================================================');

function verifyZipContents() {
    console.log('\n📦 Verifying ZIP contents...');
    
    // Find the latest ZIP file
    const zipFiles = fs.readdirSync(__dirname).filter(file => 
        file.startsWith('BeatsChain-Chrome-Extension-v3.0.0-') && file.endsWith('.zip')
    );
    
    if (zipFiles.length === 0) {
        throw new Error('No Chrome extension ZIP file found');
    }
    
    const latestZip = zipFiles.sort().pop();
    console.log(`📁 Checking: ${latestZip}`);
    
    // List ZIP contents
    try {
        const zipContents = execSync(`unzip -l "${latestZip}"`, { encoding: 'utf8' });
        
        // Check for required files
        const requiredFiles = [
            'manifest.json',
            'background/service-worker.js',
            'popup/index.html',
            'popup/popup.js',
            'popup/popup.css',
            'assets/icons/icon16.png',
            'assets/icons/icon32.png',
            'assets/icons/icon48.png',
            'assets/icons/icon128.png'
        ];
        
        const missingFiles = requiredFiles.filter(file => 
            !zipContents.includes(file)
        );
        
        if (missingFiles.length === 0) {
            console.log('✅ All required files present in ZIP');
        } else {
            console.log('❌ Missing files in ZIP:', missingFiles);
            return false;
        }
        
        // Check for unwanted files
        const unwantedPatterns = [
            '.md',
            'test-',
            'verify-',
            'create-',
            'package.json',
            'node_modules',
            '.git'
        ];
        
        const hasUnwantedFiles = unwantedPatterns.some(pattern => 
            zipContents.includes(pattern)
        );
        
        if (!hasUnwantedFiles) {
            console.log('✅ No unwanted development files in ZIP');
        } else {
            console.log('⚠️ ZIP may contain development files');
        }
        
        return true;
        
    } catch (error) {
        console.log('❌ Could not verify ZIP contents:', error.message);
        return false;
    }
}

function verifyManifest() {
    console.log('\n📋 Verifying manifest.json...');
    
    try {
        const manifestPath = path.join(__dirname, 'chrome-extension', 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        const checks = {
            'Manifest Version 3': manifest.manifest_version === 3,
            'Valid Name': manifest.name && manifest.name.length > 0,
            'Valid Description': manifest.description && manifest.description.length > 0,
            'Version Present': manifest.version && manifest.version.length > 0,
            'Required Icons': manifest.icons && manifest.icons['16'] && manifest.icons['48'] && manifest.icons['128'],
            'Background Script': manifest.background && manifest.background.service_worker,
            'Popup Defined': manifest.action && manifest.action.default_popup,
            'CSP Defined': manifest.content_security_policy && manifest.content_security_policy.extension_pages,
            'OAuth2 Configured': manifest.oauth2 && manifest.oauth2.client_id,
            'Minimal Permissions': manifest.permissions && manifest.permissions.length <= 5
        };
        
        Object.entries(checks).forEach(([check, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${check}`);
        });
        
        const allPassed = Object.values(checks).every(check => check);
        return allPassed;
        
    } catch (error) {
        console.log('❌ Manifest verification failed:', error.message);
        return false;
    }
}

function generateSubmissionChecklist() {
    console.log('\n📋 Chrome Web Store Submission Checklist:');
    console.log('=========================================');
    
    const checklist = [
        '1. 🌐 Go to Chrome Web Store Developer Dashboard',
        '2. 📦 Upload the ZIP file (BeatsChain-Chrome-Extension-v3.0.0-*.zip)',
        '3. 📝 Fill in store listing details:',
        '   - App name: BeatsChain - Music NFT Minter',
        '   - Description: Professional music NFT minting for Solana',
        '   - Category: Productivity',
        '   - Language: English',
        '4. 🖼️ Upload screenshots (1280x800 recommended)',
        '5. 🔗 Verify privacy policy URL: https://www.unamifoundation.org/legal/beatschain-privacy-policy',
        '6. 🏷️ Add relevant tags: music, nft, solana, blockchain, minting',
        '7. 💰 Set pricing (Free)',
        '8. 🌍 Select regions for distribution',
        '9. 📧 Verify developer contact information',
        '10. 🚀 Submit for review'
    ];
    
    checklist.forEach(item => console.log(item));
}

function main() {
    try {
        console.log('Starting final verification...\n');
        
        const zipValid = verifyZipContents();
        const manifestValid = verifyManifest();
        
        console.log('\n📊 Final Status:');
        console.log('================');
        console.log(`ZIP File: ${zipValid ? '✅ Ready' : '❌ Issues'}`);
        console.log(`Manifest: ${manifestValid ? '✅ Valid' : '❌ Issues'}`);
        
        if (zipValid && manifestValid) {
            console.log('\n🎉 SUCCESS: Extension is ready for Chrome Web Store submission!');
            generateSubmissionChecklist();
        } else {
            console.log('\n⚠️ Issues found that need to be resolved before submission');
        }
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    }
}

// Run verification
main();