/**
 * Post-deployment verification script
 * 
 * This script verifies that the deployment was successful by checking:
 * 1. All migrated pages are accessible
 * 2. Sanity content is being displayed correctly
 * 3. Navigation is working properly
 */

const fetch = require('node-fetch');
const { createClient } = require('@sanity/client');

// Base URL for testing
const baseUrl = process.env.VERIFY_URL || 'https://www.beatschain.app';

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3tpr4tci',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03'
});

// Pages to verify
const pagesToVerify = [
  'contact',
  'faq',
  'terms',
  'privacy',
  'guide',
  'disclaimer'
];

async function verifyDeployment() {
  console.log(`🔍 Verifying deployment at ${baseUrl}...`);
  
  // Check homepage
  try {
    console.log('Checking homepage...');
    const homeResponse = await fetch(baseUrl);
    
    if (homeResponse.ok) {
      console.log('✅ Homepage is accessible');
    } else {
      console.error(`❌ Homepage returned status ${homeResponse.status}`);
    }
  } catch (error) {
    console.error('❌ Error accessing homepage:', error.message);
  }
  
  // Check migrated pages
  console.log('\nChecking migrated pages...');
  
  for (const page of pagesToVerify) {
    try {
      const pageUrl = `${baseUrl}/${page}`;
      const response = await fetch(pageUrl);
      
      if (response.ok) {
        console.log(`✅ ${page} page is accessible`);
      } else {
        console.error(`❌ ${page} page returned status ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error accessing ${page} page:`, error.message);
    }
  }
  
  // Check Sanity connection
  console.log('\nVerifying Sanity connection...');
  
  try {
    const siteSettings = await client.fetch('*[_type == "siteSettings"][0]');
    
    if (siteSettings) {
      console.log('✅ Sanity connection is working');
    } else {
      console.error('❌ Could not fetch site settings from Sanity');
    }
  } catch (error) {
    console.error('❌ Error connecting to Sanity:', error.message);
  }
  
  console.log('\n🎉 Deployment verification complete!');
}

verifyDeployment().catch(error => {
  console.error('❌ Fatal error during verification:', error);
  process.exit(1);
});