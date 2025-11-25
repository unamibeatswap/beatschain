/**
 * Test script to verify dynamic pages are working correctly
 * 
 * This script tests that all migrated pages can be accessed via the dynamic route
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fetch = require('node-fetch');

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3tpr4tci',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
});

// Base URL for testing
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testDynamicPages() {
  console.log('🧪 Testing dynamic pages...');
  
  try {
    // Get all pages from Sanity
    const pages = await client.fetch(`*[_type == "page"] { title, "slug": slug.current }`);
    
    console.log(`Found ${pages.length} pages in Sanity`);
    
    // Test each page
    for (const page of pages) {
      const url = `${baseUrl}/${page.slug}`;
      console.log(`Testing: ${page.title} (${url})`);
      
      try {
        const response = await fetch(url);
        
        if (response.ok) {
          console.log(`✅ ${page.title} - Status: ${response.status}`);
        } else {
          console.error(`❌ ${page.title} - Status: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ ${page.title} - Error: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Dynamic page testing complete!');
  } catch (error) {
    console.error('Error testing dynamic pages:', error);
  }
}

testDynamicPages();