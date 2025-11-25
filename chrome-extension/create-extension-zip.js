#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Chrome Web Store ZIP Rules:
// 1. Max 128MB uncompressed
// 2. No executable files (.exe, .dll, .so, .dylib)
// 3. No hidden files starting with . (except .well-known)
// 4. No development files (node_modules, .git, etc.)
// 5. Must include manifest.json at root
// 6. All referenced files must be included

const EXCLUDED_PATTERNS = [
    // Development files
    'node_modules',
    '.git',
    '.env*',
    '*.log',
    '*.tmp',
    
    // Documentation and markdown files
    '*.md',
    'README*',
    'CHANGELOG*',
    'LICENSE*',
    
    // Test files
    'test-*',
    '*-test.*',
    'verify-*',
    'browser-integration-tests.js',
    'clear-demo-data.js',
    
    // Build and config files
    'package*.json',
    'hardhat.config.js',
    'Anchor.toml',
    'Cargo.toml',
    'setup-config.js',
    'init-production.js',
    'create-*',
    'deploy.js',
    
    // Hidden files (except .well-known)
    '.*',
    
    // Executable files
    '*.exe',
    '*.dll',
    '*.so',
    '*.dylib',
    
    // Large media files not referenced in manifest
    '*.png.backup',
    '*.jpg.backup',
    
    // Contracts and programs (not needed for extension)
    'contracts/',
    'programs/',
    
    // Scripts directory
    'scripts/'
];

function shouldExclude(filePath) {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    
    return EXCLUDED_PATTERNS.some(pattern => {
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

function createExtensionZip() {
    console.log('🔍 Analyzing extension files...');
    
    // Verify manifest exists
    if (!fs.existsSync('manifest.json')) {
        throw new Error('manifest.json not found in current directory');
    }
    
    // Get all files to include
    const allFiles = getFilesRecursively('.');
    const totalSize = allFiles.reduce((size, file) => {
        return size + fs.statSync(file).size;
    }, 0);
    
    console.log(`📊 Extension Statistics:`);
    console.log(`   Files: ${allFiles.length}`);
    console.log(`   Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    if (totalSize > 128 * 1024 * 1024) {
        throw new Error('Extension exceeds 128MB limit');
    }
    
    // Create zip file
    const zipName = `BeatsChain-Extension-v2.7.0-${Date.now()}.zip`;
    console.log(`📦 Creating ${zipName}...`);
    
    // Use zip command to create archive
    const fileList = allFiles.map(f => `"${f}"`).join(' ');
    execSync(`zip -r "${zipName}" ${fileList}`, { stdio: 'inherit' });
    
    // Verify zip contents
    const zipStat = fs.statSync(zipName);
    console.log(`✅ ZIP created successfully:`);
    console.log(`   File: ${zipName}`);
    console.log(`   Size: ${(zipStat.size / 1024 / 1024).toFixed(2)} MB`);
    
    // List key files included
    console.log(`\n📋 Key files included:`);
    const keyFiles = allFiles.filter(f => 
        f.includes('manifest.json') || 
        f.includes('popup/') || 
        f.includes('background/') ||
        f.includes('lib/') ||
        f.includes('assets/')
    ).slice(0, 10);
    
    keyFiles.forEach(file => console.log(`   ✓ ${file}`));
    if (allFiles.length > 10) {
        console.log(`   ... and ${allFiles.length - 10} more files`);
    }
    
    return zipName;
}

// Run if called directly
if (require.main === module) {
    try {
        const zipFile = createExtensionZip();
        console.log(`\n🎉 Extension ZIP ready for Chrome Web Store submission!`);
        console.log(`📁 File: ${zipFile}`);
    } catch (error) {
        console.error('❌ Error creating extension ZIP:', error.message);
        process.exit(1);
    }
}

module.exports = { createExtensionZip };