#!/usr/bin/env node

/**
 * Clean Chrome Web Store Extension Zip Creator
 * Removes duplicates and creates a compliant submission package
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 BeatsChain Chrome Extension - Clean ZIP Creator');
console.log('================================================');

// Get current timestamp for filename
const now = new Date();
const timestamp = now.toISOString().slice(0, 16).replace(/[:-]/g, '-').replace('T', '-');

// Define source and output paths
const sourceDir = path.join(__dirname, 'chrome-extension');
const outputDir = __dirname;
const zipName = `BeatsChain-Chrome-Extension-v3.0.0-${timestamp}.zip`;
const zipPath = path.join(outputDir, zipName);

console.log(`📂 Source: ${sourceDir}`);
console.log(`📦 Output: ${zipName}`);

// Chrome Web Store compliance requirements
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

// Files and patterns to exclude from ZIP
const excludePatterns = [
    // Documentation and development files
    '*.md',
    '*.txt',
    'README*',
    'CHANGELOG*',
    'LICENSE*',
    
    // Development and build files
    '*.log',
    '*.tmp',
    '*~',
    '.DS_Store',
    'Thumbs.db',
    'desktop.ini',
    
    // Git and version control
    '.git*',
    '.svn*',
    
    // Node.js and package files
    'node_modules/',
    'package*.json',
    'yarn.lock',
    'npm-debug.log*',
    
    // Environment and config files
    '.env*',
    '*.config.js',
    'hardhat.config.js',
    
    // Test files
    '*test*',
    '*spec*',
    'test-*',
    'verify-*',
    'validate-*',
    
    // Build and deployment scripts
    'create-*',
    'deploy*',
    'build*',
    'setup*',
    'init-*',
    
    // Documentation files in root
    '2025-*',
    'AMOY_*',
    'CAMPAIGN-*',
    'CHROME-*',
    'COMPREHENSIVE-*',
    'CONTRACT-*',
    'CURRENT-*',
    'DEPLOYMENT-*',
    'FINAL*',
    'FIXES-*',
    'History_*',
    'INSTALLATION*',
    'ISRC-*',
    'MAINNET_*',
    'METHOD-*',
    'NEW-CHAT-*',
    'OAUTH*',
    'PRODUCTION-*',
    'RADIO-*',
    'SECURITY-*',
    'SOLANA-*',
    'STORE_*',
    'TESTING-*',
    'USER-*',
    'VERIFICATION-*',
    'WEB3_*',
    
    // Server and backend files
    'server/',
    'scripts/',
    'tools/',
    'programs/',
    'contracts/',
    
    // Executables and binaries
    '*.exe',
    '*.dll',
    '*.so',
    '*.dylib',
    
    // Archive files
    '*.zip',
    '*.tar.gz',
    '*.rar',
    
    // IDE and editor files
    '.vscode/',
    '.idea/',
    '*.swp',
    '*.swo',
    
    // Backup files
    '*.bak',
    '*.backup',
    
    // Release and documentation folders
    'release/',
    'docs/',
    
    // This script itself
    'create-clean-chrome-store-zip.js'
];

function checkCompliance() {
    console.log('\n🔍 Running Chrome Web Store Compliance Checks...');
    
    const complianceChecks = {
        manifestExists: false,
        manifestV3: false,
        requiredIcons: false,
        validSize: false,
        noExecutables: true,
        cspCompliant: false
    };
    
    try {
        // Check manifest.json
        const manifestPath = path.join(sourceDir, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
            complianceChecks.manifestExists = true;
            console.log('✅ Manifest.json exists');
            
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            // Check Manifest V3
            if (manifest.manifest_version === 3) {
                complianceChecks.manifestV3 = true;
                console.log('✅ Manifest V3 compliant');
            }
            
            // Check CSP
            if (manifest.content_security_policy?.extension_pages) {
                complianceChecks.cspCompliant = true;
                console.log('✅ Content Security Policy present');
            }
            
            // Check required icons
            if (manifest.icons?.['16'] && manifest.icons?.['48'] && manifest.icons?.['128']) {
                complianceChecks.requiredIcons = true;
                console.log('✅ Required icon sizes present');
            }
        }
        
        // Check required files exist
        const missingFiles = requiredFiles.filter(file => 
            !fs.existsSync(path.join(sourceDir, file))
        );
        
        if (missingFiles.length === 0) {
            console.log('✅ All required files present');
        } else {
            console.log('❌ Missing required files:', missingFiles);
        }
        
    } catch (error) {
        console.log('❌ Compliance check failed:', error.message);
    }
    
    return complianceChecks;
}

function createCleanZip() {
    console.log('\n📦 Creating clean Chrome Web Store ZIP...');
    
    // Verify source directory exists
    if (!fs.existsSync(sourceDir)) {
        throw new Error(`Source directory not found: ${sourceDir}`);
    }
    
    // Create temporary directory for clean files
    const tempDir = path.join(__dirname, 'temp-extension-clean');
    
    try {
        // Remove temp directory if it exists
        if (fs.existsSync(tempDir)) {
            execSync(`rm -rf "${tempDir}"`, { stdio: 'pipe' });
        }
        
        // Create temp directory
        fs.mkdirSync(tempDir, { recursive: true });
        
        // Copy source to temp with exclusions
        console.log('📋 Copying files with exclusions...');
        
        // Use rsync for better control over exclusions
        const excludeArgs = excludePatterns.map(pattern => `--exclude='${pattern}'`).join(' ');
        const rsyncCommand = `rsync -av ${excludeArgs} "${sourceDir}/" "${tempDir}/"`;
        
        execSync(rsyncCommand, { stdio: 'pipe' });
        
        // Create ZIP from clean temp directory
        console.log('🗜️ Creating ZIP archive...');
        
        process.chdir(tempDir);
        const zipCommand = `zip -r "${zipPath}" .`;
        execSync(zipCommand, { stdio: 'pipe' });
        
        // Get zip file size
        const stats = fs.statSync(zipPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log(`✅ ZIP created: ${sizeInMB}MB`);
        
        // Clean up temp directory
        process.chdir(__dirname);
        execSync(`rm -rf "${tempDir}"`, { stdio: 'pipe' });
        
        return { size: stats.size, sizeInMB };
        
    } catch (error) {
        // Clean up on error
        if (fs.existsSync(tempDir)) {
            execSync(`rm -rf "${tempDir}"`, { stdio: 'pipe' });
        }
        throw error;
    }
}

function main() {
    try {
        // Run compliance checks
        const compliance = checkCompliance();
        
        // Create clean ZIP
        const zipInfo = createCleanZip();
        
        // Final compliance check on size
        const validSize = zipInfo.size < 128 * 1024 * 1024; // 128MB limit
        
        console.log('\n📊 Final Compliance Summary:');
        console.log('============================');
        console.log(`✅ ZIP Size: ${zipInfo.sizeInMB}MB ${validSize ? '(✅ Under 128MB limit)' : '(❌ Exceeds limit)'}`);
        console.log(`✅ Manifest V3: ${compliance.manifestV3 ? '✅' : '❌'}`);
        console.log(`✅ Required Icons: ${compliance.requiredIcons ? '✅' : '❌'}`);
        console.log(`✅ CSP Compliant: ${compliance.cspCompliant ? '✅' : '❌'}`);
        
        if (validSize && compliance.manifestV3 && compliance.requiredIcons) {
            console.log('\\n🎉 SUCCESS: Chrome Web Store ready ZIP created!');
            console.log(`📦 File: ${zipName}`);
            console.log('\\n📋 Next Steps:');
            console.log('1. Go to Chrome Web Store Developer Dashboard');
            console.log('2. Upload the ZIP file');
            console.log('3. Fill in store listing details');
            console.log('4. Add screenshots (1280x800 recommended)');
            console.log('5. Submit for review');
        } else {
            console.log('\\n⚠️ ZIP created but has compliance issues to fix');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
main();