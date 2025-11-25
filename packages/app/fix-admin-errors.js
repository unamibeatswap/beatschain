#!/usr/bin/env node

/**
 * Fix Admin Client-Side Errors
 * Addresses Tailwind CDN and GTM issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Admin Client-Side Errors...');

// Find and fix Tailwind CDN usage
function fixTailwindCDN() {
  const layoutPath = path.join(__dirname, 'src/app/layout.tsx');
  
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    
    // Remove Tailwind CDN link
    content = content.replace(
      /<link[^>]*cdn\.tailwindcss\.com[^>]*>/g,
      '<!-- Tailwind CSS via PostCSS -->'
    );
    
    fs.writeFileSync(layoutPath, content);
    console.log('✅ Removed Tailwind CDN from layout');
  }
}

// Remove GTM if causing 404
function fixGTM() {
  const layoutPath = path.join(__dirname, 'src/app/layout.tsx');
  
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    
    // Comment out GTM script
    content = content.replace(
      /<!-- Google Tag Manager -->([\s\S]*?)<!-- End Google Tag Manager -->/g,
      '<!-- GTM Disabled - was causing 404 -->'
    );
    
    fs.writeFileSync(layoutPath, content);
    console.log('✅ Disabled GTM script');
  }
}

// Run fixes
try {
  fixTailwindCDN();
  fixGTM();
  console.log('🎉 Admin errors fixed!');
} catch (error) {
  console.error('❌ Fix failed:', error.message);
}