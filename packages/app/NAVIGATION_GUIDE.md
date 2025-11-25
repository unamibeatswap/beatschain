# BeatsChain Navigation System Guide

This guide explains how to use and manage the Sanity-powered navigation system in BeatsChain.

## Setup

1. Ensure your Sanity Studio is running and accessible
2. Run the navigation seeding script to create initial navigation data:

```bash
cd packages/app
node scripts/seed-sanity-navigation.js
```

## Managing Navigation in Sanity

### Accessing Navigation

1. Open Sanity Studio
2. Navigate to the "Navigation" section in the sidebar
3. You'll see "Main Navigation" and "Footer Navigation" documents

### Editing Navigation Items

1. Click on "Main Navigation" to edit the main site navigation
2. Each navigation item has the following properties:
   - **Label**: The text displayed in the navigation
   - **Link**: The URL the item links to
   - **Icon**: Optional emoji or icon (e.g., 🎫)
   - **Is External Link**: Toggle for external links that open in a new tab
   - **Requires Authentication**: Toggle to show/hide based on user login status
   - **Children**: Nested navigation items for dropdowns

3. To add a new item, click the "Add Item" button
4. To create a dropdown, add child items to a navigation item

### Testing Navigation

After making changes in Sanity:
1. The changes will be reflected on the site after a short delay
2. Test both authenticated and unauthenticated views
3. Test on mobile devices to ensure responsive behavior

## Dynamic Pages

The navigation system works with dynamic pages created in Sanity:

1. Create a new page in Sanity with a unique slug
2. Add the page to navigation by creating a navigation item with the matching link
3. The page will be automatically accessible at the corresponding URL

## Troubleshooting

If navigation items aren't appearing:

1. Check that the navigation document in Sanity has `isMain: true` set
2. Verify that authentication-required items are only visible when logged in
3. Clear your browser cache or use incognito mode to test

## Technical Details

The navigation system consists of:

- **Sanity Schema**: Defines the structure of navigation items
- **useNavigation Hook**: Fetches and filters navigation data
- **SanityNavigation Component**: Renders the navigation UI
- **Dynamic Page Component**: Handles routes for Sanity-created pages

For developers who need to modify the navigation system, refer to these files:

- `/packages/app/sanity/schemas/navigation.ts`
- `/packages/app/src/hooks/useNavigation.ts`
- `/packages/app/src/components/SanityNavigation.tsx`
- `/packages/app/src/app/[slug]/page.tsx`