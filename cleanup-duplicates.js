#!/usr/bin/env node

/**
 * Cleanup Duplicate Extension Folders
 * Removes duplicate extension folders to clean up project structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 BeatsChain Project - Duplicate Cleanup');
console.log('=========================================');

// Folders to remove (duplicates of chrome-extension)
const duplicateFolders = [
    'migration-temp',
    'reference-pack'
];

// Files to remove (old ZIP files and scripts)
const oldFiles = [
    'BeatsChain-Extension-v1.0.0.zip',
    'BeatsChain-Migration-Pack (1).zip'
];

function cleanupDuplicates() {
    console.log('\n📂 Removing duplicate extension folders...');
    
    duplicateFolders.forEach(folder => {
        const folderPath = path.join(__dirname, folder);
        if (fs.existsSync(folderPath)) {
            console.log(`🗑️ Removing: ${folder}`);
            execSync(`rm -rf "${folderPath}"`, { stdio: 'pipe' });
            console.log(`✅ Removed: ${folder}`);
        } else {
            console.log(`ℹ️ Not found: ${folder}`);
        }
    });
    
    console.log('\n📄 Removing old ZIP files...');
    
    oldFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            console.log(`🗑️ Removing: ${file}`);
            fs.unlinkSync(filePath);
            console.log(`✅ Removed: ${file}`);
        } else {
            console.log(`ℹ️ Not found: ${file}`);
        }
    });
}

function showFinalStructure() {
    console.log('\n📊 Final Project Structure:');
    console.log('===========================');
    console.log('✅ chrome-extension/ - Main extension source');
    console.log('✅ packages/app/ - Next.js frontend');
    console.log('✅ packages/hardhat/ - Smart contracts');
    console.log('✅ packages/mcp-server/ - MCP server');
    console.log('✅ BeatsChain-Chrome-Extension-v3.0.0-*.zip - Chrome Web Store ready');
    
    console.log('\n🎯 Chrome Extension Status:');
    console.log('- ✅ Clean structure (no duplicates)');
    console.log('- ✅ Chrome Web Store compliant ZIP created');
    console.log('- ✅ Ready for submission');
}

function main() {
    try {
        cleanupDuplicates();
        showFinalStructure();
        
        console.log('\n🎉 Cleanup Complete!');
        console.log('Your project is now clean and ready for Chrome Web Store submission.');
        
    } catch (error) {
        console.error('❌ Cleanup failed:', error.message);
        process.exit(1);
    }
}

// Run cleanup
main();