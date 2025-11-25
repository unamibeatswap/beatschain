#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to exclude from test package
const EXCLUDE_PATTERNS = [
    '*.md',
    'README*',
    'CHANGELOG*',
    'LICENSE*',
    'test-*',
    '*-test.*',
    'verify-*',
    'browser-integration-tests.js',
    'clear-demo-data.js',
    'package*.json',
    'hardhat.config.js',
    'setup-config.js',
    'init-production.js',
    'create-*',
    'deploy.js',
    '.*',
    '*.exe',
    '*.dll',
    '*.so',
    '*.dylib',
    'contracts/',
    'programs/',
    'scripts/',
    'docs/',
    'tools/',
    'test-audio/'
];

function shouldExclude(filePath) {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    
    return EXCLUDE_PATTERNS.some(pattern => {
        if (pattern.includes('/')) {
            return relativePath.includes(pattern);
        }
        if (pattern.startsWith('*.')) {
            return fileName.endsWith(pattern.slice(1));
        }
        if (pattern.startsWith('.')) {
            return fileName.startsWith('.');
        }
        return fileName.includes(pattern) || relativePath.includes(pattern);
    });
}

function getFilesRecursively(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (!shouldExclude(filePath)) {
                getFilesRecursively(filePath, fileList);
            }
        } else {
            if (!shouldExclude(filePath)) {
                fileList.push(filePath);
            }
        }
    });
    
    return fileList;
}

function createTestExtensionZip() {
    console.log('🔍 Creating test Chrome extension package...');
    
    // Verify manifest exists
    if (!fs.existsSync('manifest.json')) {
        throw new Error('manifest.json not found');
    }
    
    // Get all files to include
    const allFiles = getFilesRecursively('.');
    const totalSize = allFiles.reduce((size, file) => {
        return size + fs.statSync(file).size;
    }, 0);
    
    console.log(`📊 Test Extension Statistics:`);
    console.log(`   Files: ${allFiles.length}`);
    console.log(`   Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    if (totalSize > 128 * 1024 * 1024) {
        throw new Error('Extension exceeds 128MB Chrome Web Store limit');
    }
    
    // Create zip file
    const zipName = `BeatsChain-Test-Extension-${Date.now()}.zip`;
    console.log(`📦 Creating ${zipName}...`);
    
    // Use zip command to create archive
    const fileList = allFiles.map(f => `"${f}"`).join(' ');
    
    try {
        execSync(`zip -r "${zipName}" ${fileList}`, { stdio: 'inherit' });
        
        // Verify zip contents
        const zipStat = fs.statSync(zipName);
        console.log(`✅ Test extension ZIP created:`);
        console.log(`   File: ${zipName}`);
        console.log(`   Size: ${(zipStat.size / 1024 / 1024).toFixed(2)} MB`);
        
        // List key directories included
        const keyDirs = ['popup/', 'lib/', 'assets/', 'background/', 'options/'];
        console.log(`\n📋 Key directories included:`);
        keyDirs.forEach(dir => {
            const dirFiles = allFiles.filter(f => f.startsWith(dir));
            if (dirFiles.length > 0) {
                console.log(`   ✓ ${dir} (${dirFiles.length} files)`);
            }
        });
        
        console.log(`\n🎯 Testing Instructions:`);
        console.log(`   1. Extract ${zipName} to a folder`);
        console.log(`   2. Open Chrome and go to chrome://extensions/`);
        console.log(`   3. Enable "Developer mode" (top right toggle)`);
        console.log(`   4. Click "Load unpacked" and select the extracted folder`);
        console.log(`   5. Enable Chrome AI flags for full functionality:`);
        console.log(`      - chrome://flags/#optimization-guide-on-device-model`);
        console.log(`      - chrome://flags/#prompt-api-for-gemini-nano`);
        console.log(`      - chrome://flags/#summarization-api-for-gemini-nano`);
        console.log(`   6. Test extension features`);
        
        return zipName;
        
    } catch (error) {
        console.error('❌ Error creating ZIP:', error.message);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    try {
        const zipFile = createTestExtensionZip();
        console.log(`\n🎉 Test extension package ready!`);
        console.log(`📁 File: ${zipFile}`);
        console.log(`\n💡 This package includes all functionality while excluding:`);
        console.log(`   - Documentation files (*.md)`);
        console.log(`   - Development tools and scripts`);
        console.log(`   - Test files and contracts`);
        console.log(`   - Build artifacts and logs`);
    } catch (error) {
        console.error('❌ Failed to create test extension:', error.message);
        process.exit(1);
    }
}

module.exports = { createTestExtensionZip };