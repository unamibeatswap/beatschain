/**
 * Extract content from hardcoded pages for Sanity migration
 * 
 * This script analyzes the app directory structure and identifies pages
 * with hardcoded content that should be migrated to Sanity CMS.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../../extracted-content');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Pages to extract (focus on static content pages first)
const pagesToExtract = [
  { path: '/contact', file: 'src/app/contact/page.tsx' },
  { path: '/faq', file: 'src/app/faq/page.tsx' },
  { path: '/terms', file: 'src/app/terms/page.tsx' },
  { path: '/privacy', file: 'src/app/privacy/page.tsx' },
  { path: '/guide', file: 'src/app/guide/page.tsx' },
  { path: '/disclaimer', file: 'src/app/disclaimer/page.tsx' }
];

// Extract content from each page
console.log('🔍 Extracting content from hardcoded pages...');

pagesToExtract.forEach(page => {
  const filePath = path.join(process.cwd(), page.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${page.file}`);
    return;
  }
  
  console.log(`Processing: ${page.path}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract title (simple regex approach)
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/s) || 
                    content.match(/<title[^>]*>(.*?)<\/title>/s) ||
                    content.match(/title=['"]([^'"]*)['"]/);
  
  const title = titleMatch ? titleMatch[1].trim() : toTitleCase(page.path.replace(/^\//, ''));
  
  // Extract main content (simplified approach)
  const mainContentMatch = content.match(/<main[^>]*>(.*?)<\/main>/s) ||
                          content.match(/<div[^>]*className=['"]content['"][^>]*>(.*?)<\/div>/s);
  
  const mainContent = mainContentMatch ? mainContentMatch[1].trim() : '';
  
  // Extract meta description
  const descriptionMatch = content.match(/description=['"]([^'"]*)['"]/);
  const description = descriptionMatch ? descriptionMatch[1].trim() : '';
  
  // Create structured data for Sanity
  const extractedData = {
    title,
    slug: page.path.replace(/^\//, ''),
    description,
    content: mainContent,
    rawContent: content
  };
  
  // Save extracted data
  const outputPath = path.join(outputDir, `${page.path.replace(/^\//, '')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
  
  console.log(`✅ Extracted: ${outputPath}`);
});

console.log('🎉 Content extraction complete!');

// Helper function to convert slug to title case
function toTitleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}