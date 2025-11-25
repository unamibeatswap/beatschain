# BeatsChain Content Migration Plan

This document outlines a comprehensive strategy for migrating all hardcoded content from the frontend to Sanity CMS, ensuring a robust, holistic approach with no breaking changes.

## 1. Content Audit & Schema Design

### 1.1 Content Audit
First, we'll identify all hardcoded content across the application:

```javascript
// Script to identify hardcoded content
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const contentMap = {};

// Find all pages with hardcoded content
glob.sync('src/app/**/page.tsx', { cwd: '/workspaces/BeatsChain-Web3/packages/app' }).forEach(file => {
  const content = fs.readFileSync(path.join('/workspaces/BeatsChain-Web3/packages/app', file), 'utf8');
  const pagePath = file.replace('src/app', '').replace('/page.tsx', '');
  
  contentMap[pagePath || '/'] = {
    path: pagePath || '/',
    file,
    hasHardcodedContent: /[<][^>]*>[A-Za-z0-9\s]{20,}/g.test(content)
  };
});

fs.writeFileSync('content-audit.json', JSON.stringify(contentMap, null, 2));
```

### 1.2 Schema Design
Create comprehensive Sanity schemas for all content types:

```javascript
// pages.js - Base schema for all pages
export const page = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
        { type: 'contentBlock' },
        { type: 'heroSection' }
      ]
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string' },
        { name: 'metaDescription', type: 'text' },
        { name: 'ogImage', type: 'image' }
      ]
    }
  ]
}
```

## 2. Content Extraction & Transformation

### 2.1 Automated Content Extraction
Create a script to extract content from existing pages:

```javascript
// extract-content.js
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const glob = require('glob');

const pages = [
  { path: '/contact', file: 'src/app/contact/page.tsx' },
  { path: '/faq', file: 'src/app/faq/page.tsx' },
  { path: '/terms', file: 'src/app/terms/page.tsx' },
  { path: '/privacy', file: 'src/app/privacy/page.tsx' },
  { path: '/guide', file: 'src/app/guide/page.tsx' },
  // Add all pages from content audit
];

pages.forEach(page => {
  const filePath = path.join('/workspaces/BeatsChain-Web3/packages/app', page.file);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  // Extract JSX content and convert to structured data
  // This is a simplified example - actual implementation would be more complex
  const extracted = extractContentFromJSX(content);
  
  fs.writeFileSync(
    `extracted-content/${page.path.replace(/^\//, '')}.json`, 
    JSON.stringify(extracted, null, 2)
  );
});

function extractContentFromJSX(content) {
  // Implementation would extract text, images, and structure from JSX
  // This is a placeholder for the actual implementation
}
```

### 2.2 Content Transformation
Transform extracted content to Sanity format:

```javascript
// transform-to-sanity.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const extractedFiles = glob.sync('extracted-content/*.json');

const sanityDocuments = extractedFiles.map(file => {
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));
  const pageName = path.basename(file, '.json');
  
  return {
    _type: 'page',
    title: content.title || toTitleCase(pageName),
    slug: { _type: 'slug', current: pageName },
    content: transformToPortableText(content.content),
    seo: {
      metaTitle: content.title,
      metaDescription: content.description || extractDescription(content.content)
    }
  };
});

fs.writeFileSync('sanity-documents.json', JSON.stringify(sanityDocuments, null, 2));

function transformToPortableText(content) {
  // Transform HTML/JSX content to Portable Text format
  // This is a placeholder for the actual implementation
}
```

## 3. Seeding Strategy

### 3.1 Master Seeding Script
Create a comprehensive seeding script:

```javascript
// seed-all-content.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

// Load all content
const pages = require('./sanity-documents.json');
const navigation = require('./navigation-data.json');
const siteSettings = require('./site-settings.json');

async function seedAllContent() {
  console.log('🌱 Starting comprehensive content seeding...');
  
  try {
    // 1. Seed site settings first
    await seedSiteSettings();
    
    // 2. Seed all pages
    await seedPages();
    
    // 3. Seed navigation last (depends on pages)
    await seedNavigation();
    
    console.log('✅ All content seeded successfully!');
  } catch (error) {
    console.error('Error seeding content:', error);
  }
}

async function seedSiteSettings() {
  const existingSettings = await client.fetch('*[_type == "siteSettings"][0]');
  
  if (!existingSettings) {
    console.log('Creating site settings...');
    await client.create(siteSettings);
  } else {
    console.log('Updating site settings...');
    await client.patch(existingSettings._id).set(siteSettings).commit();
  }
}

async function seedPages() {
  console.log(`Seeding ${pages.length} pages...`);
  
  for (const page of pages) {
    const existingPage = await client.fetch(
      '*[_type == "page" && slug.current == $slug][0]',
      { slug: page.slug.current }
    );
    
    if (!existingPage) {
      console.log(`Creating page: ${page.title}`);
      await client.create(page);
    } else {
      console.log(`Updating page: ${page.title}`);
      await client.patch(existingPage._id).set(page).commit();
    }
  }
}

async function seedNavigation() {
  // Similar implementation to seedPages
}

seedAllContent();
```

### 3.2 Incremental Seeding
Create specialized scripts for different content types:

```bash
# seed-pages.sh
#!/bin/bash
echo "🌱 Seeding pages from frontend to Sanity"
node scripts/extract-content.js
node scripts/transform-to-sanity.js
node scripts/seed-pages.js

# seed-navigation.sh
#!/bin/bash
echo "🌱 Seeding navigation structure"
node scripts/seed-navigation.js
```

## 4. Hybrid Rendering Strategy

To ensure no breaking changes, implement a hybrid rendering approach:

```javascript
// src/app/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import HeroSection from '@/components/HeroSection'
import ContentBlocks from '@/components/ContentBlocks'

// Import fallback content for each page
import fallbackContent from '@/utils/fallbackContent'

export default function DynamicPage() {
  const params = useParams()
  const slug = params.slug as string
  const [pageData, setPageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    async function fetchPage() {
      try {
        const data = await client.fetch(`
          *[_type == "page" && slug.current == $slug][0]
        `, { slug })

        if (data) {
          setPageData(data)
        } else {
          // If no Sanity data, check for fallback
          if (fallbackContent[slug]) {
            setPageData(fallbackContent[slug])
            setUseFallback(true)
          } else {
            notFound()
          }
        }
      } catch (error) {
        console.error('Error fetching page:', error)
        // On error, use fallback if available
        if (fallbackContent[slug]) {
          setPageData(fallbackContent[slug])
          setUseFallback(true)
        } else {
          notFound()
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!pageData) {
    return notFound()
  }

  return (
    <div>
      {pageData.heroSection && <HeroSection data={pageData.heroSection} />}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{pageData.title}</h1>
        
        {useFallback ? (
          // Render fallback content
          <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
        ) : (
          // Render Sanity content blocks
          <ContentBlocks blocks={pageData.content} />
        )}
      </div>
    </div>
  )
}
```

## 5. Deployment Strategy

### 5.1 Phased Deployment
Deploy in phases to minimize risk:

1. **Phase 1**: Deploy Sanity schemas and studio configuration
2. **Phase 2**: Seed core content (site settings, navigation)
3. **Phase 3**: Seed static pages (terms, privacy, contact, etc.)
4. **Phase 4**: Seed dynamic content (blog posts, guides)
5. **Phase 5**: Switch to Sanity-first rendering with fallbacks

### 5.2 Validation & Testing
Implement automated testing:

```javascript
// test-content-migration.js
const assert = require('assert');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function testMigration() {
  // Test that all pages exist in Sanity
  const pages = ['contact', 'terms', 'privacy', 'faq', 'guide'];
  
  for (const slug of pages) {
    const page = await client.fetch('*[_type == "page" && slug.current == $slug][0]', { slug });
    assert(page, `Page ${slug} should exist in Sanity`);
    console.log(`✅ Page ${slug} exists`);
  }
  
  // Test navigation
  const mainNav = await client.fetch('*[_type == "navigation" && isMain == true][0]');
  assert(mainNav, 'Main navigation should exist');
  assert(mainNav.items.length > 0, 'Navigation should have items');
  console.log('✅ Navigation exists with items');
  
  console.log('All tests passed!');
}

testMigration().catch(console.error);
```

## 6. Implementation Plan

### 6.1 Create Extraction Script
```bash
# Step 1: Create content extraction script
mkdir -p scripts/migration
touch scripts/migration/extract-content.js
touch scripts/migration/transform-to-sanity.js
```

### 6.2 Create Seeding Scripts
```bash
# Step 2: Create seeding scripts
touch scripts/migration/seed-all-content.js
touch scripts/migration/seed-pages.js
touch scripts/migration/seed-navigation.js
```

### 6.3 Create Fallback System
```bash
# Step 3: Create fallback content system
mkdir -p src/utils
touch src/utils/fallbackContent.js
```

### 6.4 Update Dynamic Page Component
```bash
# Step 4: Update dynamic page component
touch src/app/[slug]/page.tsx
```

### 6.5 Run Migration
```bash
# Step 5: Run the migration
node scripts/migration/extract-content.js
node scripts/migration/transform-to-sanity.js
node scripts/migration/seed-all-content.js
```

## 7. Monitoring & Maintenance

### 7.1 Content Sync Script
Create a script to keep content in sync:

```javascript
// sync-content.js
// This script would run periodically to ensure content stays in sync
// between Sanity and any remaining hardcoded content
```

### 7.2 Content Dashboard
Create an admin dashboard to monitor content status:

```javascript
// src/app/admin/content/page.tsx
// This would show which pages are using Sanity vs. fallback content
```

## Conclusion

This comprehensive migration plan ensures:

1. **No Breaking Changes**: Fallback system guarantees content availability
2. **Robustness**: Automated extraction and transformation minimizes manual work
3. **Holistic Approach**: All content types are considered and migrated
4. **Maintainability**: Clear separation between content and presentation
5. **Scalability**: Easy to add new content types and pages in the future