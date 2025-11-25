/**
 * Master script to run the entire content migration process
 * 
 * This script orchestrates the extraction, transformation, and seeding
 * of content from hardcoded pages to Sanity CMS.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting BeatsChain content migration process...');
console.log('==================================================');

try {
  // Step 1: Extract content from hardcoded pages
  console.log('\n📥 STEP 1: Extracting content from hardcoded pages');
  execSync('node scripts/migration/extract-content.js', { stdio: 'inherit' });
  
  // Step 2: Transform content to Sanity format
  console.log('\n🔄 STEP 2: Transforming content to Sanity format');
  execSync('node scripts/migration/transform-to-sanity.js', { stdio: 'inherit' });
  
  // Step 3: Seed content to Sanity
  console.log('\n🌱 STEP 3: Seeding content to Sanity');
  execSync('node scripts/migration/seed-pages.js', { stdio: 'inherit' });
  
  // Step 4: Seed navigation (if available)
  console.log('\n🧭 STEP 4: Seeding navigation');
  try {
    execSync('node scripts/seed-sanity-navigation.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Navigation seeding skipped or encountered issues');
  }
  
  console.log('\n✅ Content migration completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Check your Sanity Studio to verify the migrated content');
  console.log('2. Update your dynamic page component to use Sanity content');
  console.log('3. Deploy your changes to production');
  
} catch (error) {
  console.error('\n❌ Migration process failed:', error.message);
  process.exit(1);
}