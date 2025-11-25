# BeatsChain Sanity Auto-Seeding

This document explains how to use the auto-seeding functionality to populate your Sanity CMS with initial data for BeatsChain.

## What Gets Seeded

The auto-seeding script creates the following data in Sanity:

1. **Navigation**
   - Main navigation with default links

2. **Styles**
   - Beat card styles
   - Producer card styles
   - Pagination styles
   - Contact form styles

3. **Site Settings**
   - Basic site information
   - Platform settings
   - SEO metadata

4. **Demo Page**
   - A sample page to test dynamic routing

## How to Run

### Option 1: Using the Shell Script (Recommended)

```bash
cd packages/app
./seed-sanity.sh
```

### Option 2: Running the Node Script Directly

```bash
cd packages/app
node scripts/seed-sanity-auto.js
```

## Requirements

- Node.js installed
- Valid Sanity API token in `.env.local` file
- Sanity project ID configured

## Troubleshooting

If you encounter errors:

1. Check that your `.env.local` file contains:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_TOKEN=your_token
   ```

2. Ensure your Sanity token has write permissions

3. Verify that your Sanity project is accessible

## Customizing Seeded Data

To customize the seeded data, edit the `scripts/seed-sanity-auto.js` file and modify the data objects as needed.