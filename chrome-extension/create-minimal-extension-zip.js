#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Minimal files needed for Chrome extension testing
const REQUIRED_FILES = [
    'manifest.json',
    'popup/index.html',
    'popup/popup.js',
    'popup/popup.css',
    'background/service-worker.js',
    'assets/icons/icon16.png',
    'assets/icons/icon32.png', 
    'assets/icons/icon48.png',
    'assets/icons/icon128.png'
];

// Core lib files for functionality
const CORE_LIB_FILES = [
    'lib/chrome-ai.js',
    'lib/chrome-ai-revenue-optimizer.js',
    'lib/auth.js',
    'lib/storage.js',
    'lib/config.js',
    'lib/error-handler.js'
];

// Essential assets
const ESSENTIAL_ASSETS = [
    'assets/fallback-sponsor-manifest.json'
];

function createMinimalExtensionZip() {
    console.log('🔍 Creating minimal Chrome extension for testing...');
    
    // Verify manifest exists
    if (!fs.existsSync('manifest.json')) {
        throw new Error('manifest.json not found');
    }
    
    // Check required files
    const missingFiles = [];
    const filesToInclude = [...REQUIRED_FILES, ...CORE_LIB_FILES, ...ESSENTIAL_ASSETS];
    
    filesToInclude.forEach(file => {
        if (!fs.existsSync(file)) {
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length > 0) {
        console.warn('⚠️  Missing files (will be skipped):', missingFiles);
    }
    
    // Get existing files only
    const existingFiles = filesToInclude.filter(file => fs.existsSync(file));
    
    // Calculate total size
    const totalSize = existingFiles.reduce((size, file) => {
        return size + fs.statSync(file).size;
    }, 0);
    
    console.log(`📊 Minimal Extension Statistics:`);
    console.log(`   Files: ${existingFiles.length}`);
    console.log(`   Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Create zip file
    const zipName = `BeatsChain-Minimal-Extension-${Date.now()}.zip`;
    console.log(`📦 Creating ${zipName}...`);
    
    // Create zip with only existing files
    const fileList = existingFiles.map(f => `"${f}"`).join(' ');
    
    try {
        execSync(`zip -r "${zipName}" ${fileList}`, { stdio: 'inherit' });
        
        // Verify zip
        const zipStat = fs.statSync(zipName);
        console.log(`✅ Minimal extension ZIP created:`);
        console.log(`   File: ${zipName}`);
        console.log(`   Size: ${(zipStat.size / 1024 / 1024).toFixed(2)} MB`);
        
        console.log(`\n📋 Files included:`);
        existingFiles.forEach(file => console.log(`   ✓ ${file}`));
        
        console.log(`\n🎯 Testing Instructions:`);
        console.log(`   1. Open Chrome and go to chrome://extensions/`);
        console.log(`   2. Enable "Developer mode"`);
        console.log(`   3. Click "Load unpacked"`);
        console.log(`   4. Extract ${zipName} and select the folder`);
        console.log(`   5. Test basic functionality`);
        
        return zipName;
        
    } catch (error) {
        console.error('❌ Error creating ZIP:', error.message);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    try {
        const zipFile = createMinimalExtensionZip();
        console.log(`\n🎉 Minimal extension ready for testing!`);
        console.log(`📁 File: ${zipFile}`);
    } catch (error) {
        console.error('❌ Failed to create minimal extension:', error.message);
        process.exit(1);
    }
}

module.exports = { createMinimalExtensionZip };