# BeatsChain Content Migration

This document provides instructions for migrating hardcoded content from the frontend to Sanity CMS.

## Overview

The content migration process involves:

1. Extracting content from hardcoded pages
2. Transforming it to Sanity format
3. Seeding it into Sanity CMS
4. Implementing a fallback system to ensure no breaking changes

## Quick Start

Run the migration script:

```bash
cd packages/app
./migrate-content.sh
```

This will automatically:
- Extract content from hardcoded pages
- Transform it to Sanity format
- Seed it into Sanity CMS
- Seed navigation structure

## Manual Process

If you prefer to run each step manually:

```bash
# 1. Extract content
node scripts/migration/extract-content.js

# 2. Transform content
node scripts/migration/transform-to-sanity.js

# 3. Seed pages
node scripts/migration/seed-pages.js

# 4. Seed navigation
node scripts/seed-sanity-navigation.js
```

## Fallback System

The migration includes a fallback system that ensures no breaking changes:

- If Sanity content is available, it will be used
- If Sanity content is not available, fallback content will be used
- This allows for a gradual migration without breaking the site

## Adding New Pages

To add new pages to the migration:

1. Edit `scripts/migration/extract-content.js` and add the page to `pagesToExtract`
2. Add fallback content in `src/utils/fallbackContent.js`
3. Run the migration script again

## Testing

After migration, test the site to ensure:

1. All pages are accessible
2. Content is displayed correctly
3. Navigation works properly

## Troubleshooting

If you encounter issues:

- Check that your Sanity API token has write permissions
- Verify that the Sanity project ID and dataset are correct
- Check the console for error messages

## Next Steps

After migration:

1. Update the dynamic page component to use Sanity content
2. Implement a proper Portable Text renderer for Sanity content
3. Add more content types to the migration process