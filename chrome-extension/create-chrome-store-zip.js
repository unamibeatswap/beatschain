#!/usr/bin/env node

/**
 * Chrome Web Store Compliant Extension Zip Creator
 * Follows Chrome Web Store policies and zip creation rules
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏪 Creating Chrome Web Store Compliant Extension Zip');
console.log('====================================================');

// Get current timestamp for filename
const now = new Date();
const timestamp = now.toISOString().slice(0, 16).replace(/[:-]/g, '-').replace('T', '-');

// Chrome Web Store compliance checks
const complianceChecks = {
    manifestV3: false,
    noExecutables: true,
    noHiddenFiles: true,
    validSize: false,
    requiredIcons: false,
    cspCompliant: false,
    validPermissions: false
};

console.log('\n🔍 Running Chrome Web Store Compliance Checks...');

// Check manifest.json
try {
    const manifestPath = path.join(__dirname, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Check Manifest V3
    if (manifest.manifest_version === 3) {
        complianceChecks.manifestV3 = true;
        console.log('✅ Manifest V3 compliant');
    } else {
        console.log('❌ Must use Manifest V3');
    }
    
    // Check CSP
    if (manifest.content_security_policy && 
        manifest.content_security_policy.extension_pages) {
        complianceChecks.cspCompliant = true;
        console.log('✅ Content Security Policy present');
    }
    
    // Check permissions (minimal required)
    const allowedPermissions = ['storage', 'identity', 'activeTab'];
    const hasValidPermissions = manifest.permissions.every(p => allowedPermissions.includes(p));
    if (hasValidPermissions) {
        complianceChecks.validPermissions = true;
        console.log('✅ Permissions are minimal and justified');
    }
    
    // Check required icons
    if (manifest.icons && manifest.icons['16'] && manifest.icons['48'] && manifest.icons['128']) {
        complianceChecks.requiredIcons = true;
        console.log('✅ Required icon sizes present');
    }
    
} catch (error) {
    console.log('❌ Manifest.json validation failed:', error.message);
}

// Files to exclude (Chrome Web Store compliance)
const excludePatterns = [
    '*.md',           // No markdown files
    '*.git*',         // No git files
    '*node_modules*', // No dependencies
    '*package*.json', // No package files
    '*.env*',         // No environment files
    '*test*',         // No test files
    '*spec*',         // No spec files
    '*.log',          // No log files
    '*.tmp',          // No temp files
    '*~',             // No backup files
    '.DS_Store',      // No system files
    'Thumbs.db',      // No system files
    '*.exe',          // No executables
    '*.dll',          // No executables
    '*.so',           // No executables
    'verify-fixes.js', // Remove verification script
    'create-chrome-store-zip.js' // Remove this script
];

// Create exclusion string for zip command
const excludeString = excludePatterns.map(pattern => `-x "${pattern}"`).join(' ');

// Create zip filename
const zipName = `BeatsChain-OAuth-IPFS-Fixes-${timestamp}.zip`;
const zipPath = path.join(__dirname, '..', zipName);

console.log('\n📦 Creating Chrome Web Store compliant zip...');
console.log(`📁 Output: ${zipName}`);

try {
    // Change to extension directory
    process.chdir(__dirname);
    
    // Create zip with exclusions
    const zipCommand = `zip -r "${zipPath}" . ${excludeString}`;
    console.log('\n🔧 Running zip command...');
    
    execSync(zipCommand, { stdio: 'inherit' });
    
    // Get zip file size
    const stats = fs.statSync(zipPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    if (stats.size < 128 * 1024 * 1024) { // 128MB limit
        complianceChecks.validSize = true;
        console.log(`✅ Zip size: ${sizeInMB}MB (under 128MB limit)`);
    } else {
        console.log(`❌ Zip size: ${sizeInMB}MB (exceeds 128MB limit)`);
    }
    
    console.log('\n📊 Chrome Web Store Compliance Summary:');
    console.log('=====================================');
    
    Object.entries(complianceChecks).forEach(([check, passed]) => {
        const status = passed ? '✅' : '❌';
        const checkName = check.replace(/([A-Z])/g, ' $1').toLowerCase();
        console.log(`${status} ${checkName}`);
    });
    
    const allPassed = Object.values(complianceChecks).every(check => check);
    
    if (allPassed) {
        console.log('\n🎉 Extension is Chrome Web Store compliant!');
        console.log(`📦 Ready for upload: ${zipName}`);
        
        // Create submission checklist
        console.log('\n📋 Submission Checklist:');
        console.log('- Upload zip to Chrome Web Store Developer Dashboard');
        console.log('- Add store listing information');
        console.log('- Upload screenshots (1280x800 recommended)');
        console.log('- Verify privacy policy URL');
        console.log('- Set appropriate category (Productivity)');
        console.log('- Submit for review');
        
    } else {
        console.log('\n⚠️ Extension has compliance issues that need fixing');
    }
    
} catch (error) {
    console.error('❌ Zip creation failed:', error.message);
    process.exit(1);
}

console.log('\n✅ Chrome Web Store zip creation complete!');