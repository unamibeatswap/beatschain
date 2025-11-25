/**
 * Seed pages content to Sanity
 * 
 * This script takes the transformed content and seeds it into Sanity CMS.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// Initialize Sanity client
const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
console.log('Token available:', !!token);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3tpr4tci',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: token,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
});

// Load transformed content
const contentPath = path.join(__dirname, '../../sanity-content/pages.json');

if (!fs.existsSync(contentPath)) {
  console.error('❌ Transformed content not found. Run transform-to-sanity.js first.');
  process.exit(1);
}

const pages = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

async function seedPages() {
  console.log(`🌱 Seeding ${pages.length} pages to Sanity...`);
  
  let successCount = 0;
  let updateCount = 0;
  let errorCount = 0;
  
  for (const page of pages) {
    try {
      // Check if page already exists
      const existingPage = await client.fetch(
        '*[_type == "page" && slug.current == $slug][0]',
        { slug: page.slug.current }
      );
      
      if (!existingPage) {
        // Create new page
        console.log(`Creating page: ${page.title} (${page.slug.current})`);
        await client.create(page);
        successCount++;
      } else {
        // Update existing page
        console.log(`Updating page: ${page.title} (${page.slug.current})`);
        await client.patch(existingPage._id)
          .set({
            title: page.title,
            content: page.content,
            seo: page.seo
          })
          .commit();
        updateCount++;
      }
    } catch (error) {
      console.error(`❌ Error seeding page ${page.title}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Seeding Summary:');
  console.log(`✅ Created: ${successCount} pages`);
  console.log(`🔄 Updated: ${updateCount} pages`);
  console.log(`❌ Errors: ${errorCount} pages`);
  
  if (successCount + updateCount > 0) {
    console.log('\n🎉 Pages seeded successfully!');
  } else {
    console.log('\n⚠️ No pages were seeded.');
  }
}

seedPages().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});