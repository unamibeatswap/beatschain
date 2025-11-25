#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Chrome Web Store ZIP Rules - STRICT COMPLIANCE
const REQUIRED_FILES = [
    'manifest.json',
    'popup/index.html',
    'popup/popup.js',
    'popup/popup.css',
    'background/service-worker.js'
];

const ALLOWED_DIRECTORIES = [
    'assets',
    'background', 
    'lib',
    'popup',
    'options'
];

const ALLOWED_EXTENSIONS = [
    '.js', '.html', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf'
];

function isAllowedFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    const relativePath = path.relative('.', filePath);
    
    // Skip hidden files
    if (fileName.startsWith('.')) return false;
    
    // Skip development files
    if (fileName.includes('test-') || fileName.includes('verify-') || 
        fileName.includes('create-') || fileName.includes('package') ||
        fileName.endsWith('.md') || fileName.includes('LICENSE') ||
        fileName.includes('README') || fileName.includes('CHANGELOG')) {
        return false;
    }
    
    // Skip config files (except essential ones)
    if (fileName.includes('config') && !['env-config.js', 'config.js', 'solana-config.js'].includes(fileName)) return false;
    
    // Skip contracts and programs
    if (relativePath.includes('contracts/') || relativePath.includes('programs/') || 
        relativePath.includes('scripts/') || relativePath.includes('dist/')) {
        return false;
    }
    
    // Only allow specific extensions
    if (!ALLOWED_EXTENSIONS.includes(ext) && fileName !== 'manifest.json') {
        return false;
    }
    
    return true;
}

function createCleanExtensionZip() {
    console.log('🔍 Creating Chrome Web Store compliant ZIP...');
    
    // Verify required files exist
    for (const file of REQUIRED_FILES) {
        if (!fs.existsSync(file)) {
            throw new Error(`Required file missing: ${file}`);
        }
    }
    
    // Collect only essential files
    const essentialFiles = [];
    
    function scanDirectory(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // Always include subdirectories of allowed directories
                scanDirectory(itemPath);
            } else {
                if (isAllowedFile(itemPath)) {
                    essentialFiles.push(itemPath);
                }
            }
        }
    }
    
    // Add root manifest.json
    essentialFiles.push('manifest.json');
    
    // Scan allowed directories
    for (const dir of ALLOWED_DIRECTORIES) {
        if (fs.existsSync(dir)) {
            scanDirectory(dir);
        }
    }
    
    // Remove duplicates
    const uniqueFiles = [...new Set(essentialFiles)];
    
    // Calculate size
    const totalSize = uniqueFiles.reduce((size, file) => {
        return size + fs.statSync(file).size;
    }, 0);
    
    console.log(`📊 Clean Extension Statistics:`);
    console.log(`   Files: ${uniqueFiles.length}`);
    console.log(`   Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    if (totalSize > 128 * 1024 * 1024) {
        throw new Error('Extension exceeds 128MB limit');
    }
    
    // Create clean zip
    const zipName = `BeatsChain-Extension-Clean-v2.7.0.zip`;
    console.log(`📦 Creating ${zipName}...`);
    
    // Remove existing zip if it exists
    if (fs.existsSync(zipName)) {
        fs.unlinkSync(zipName);
    }
    
    // Create zip with only essential files
    const fileList = uniqueFiles.map(f => `"${f}"`).join(' ');
    execSync(`zip -r "${zipName}" ${fileList}`, { stdio: 'inherit' });
    
    // Verify zip
    const zipStat = fs.statSync(zipName);
    console.log(`✅ Clean ZIP created successfully:`);
    console.log(`   File: ${zipName}`);
    console.log(`   Size: ${(zipStat.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Show included files by category
    console.log(`\n📋 Files included by category:`);
    
    const categories = {
        'Core': uniqueFiles.filter(f => f === 'manifest.json'),
        'Popup': uniqueFiles.filter(f => f.startsWith('popup/')),
        'Background': uniqueFiles.filter(f => f.startsWith('background/')),
        'Libraries': uniqueFiles.filter(f => f.startsWith('lib/')),
        'Assets': uniqueFiles.filter(f => f.startsWith('assets/')),
        'Options': uniqueFiles.filter(f => f.startsWith('options/'))
    };
    
    for (const [category, files] of Object.entries(categories)) {
        if (files.length > 0) {
            console.log(`   ${category}: ${files.length} files`);
            files.slice(0, 3).forEach(f => console.log(`     ✓ ${f}`));
            if (files.length > 3) {
                console.log(`     ... and ${files.length - 3} more`);
            }
        }
    }
    
    return zipName;
}

// Run if called directly
if (require.main === module) {
    try {
        const zipFile = createCleanExtensionZip();
        console.log(`\n🎉 Chrome Web Store ready ZIP created!`);
        console.log(`📁 File: ${zipFile}`);
        console.log(`\n📝 Next steps:`);
        console.log(`   1. Upload ${zipFile} to Chrome Web Store Developer Dashboard`);
        console.log(`   2. Fill out store listing details`);
        console.log(`   3. Submit for review`);
    } catch (error) {
        console.error('❌ Error creating clean ZIP:', error.message);
        process.exit(1);
    }
}

module.exports = { createCleanExtensionZip };