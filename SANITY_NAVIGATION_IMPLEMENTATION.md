# BeatsChain Sanity Navigation Implementation

This document outlines the implementation of the Sanity-powered navigation system for BeatsChain.

## Implementation Overview

The navigation system allows for dynamic management of navigation items through Sanity CMS, including:

- Main navigation with dropdown support
- Authentication-aware navigation items (showing/hiding based on auth status)
- Mobile-responsive design
- External link support

## Components Created

1. **Navigation Schema** (`/packages/app/sanity/schemas/navigation.ts`)
   - Defines the structure for navigation items in Sanity
   - Supports nested navigation (dropdowns)
   - Includes authentication requirements and external link flags

2. **Navigation Hook** (`/packages/app/src/hooks/useNavigation.ts`)
   - Fetches navigation data from Sanity
   - Filters items based on authentication status
   - Provides loading state for smooth UI transitions

3. **SanityNavigation Component** (`/packages/app/src/components/SanityNavigation.tsx`)
   - Renders navigation items from Sanity
   - Handles both desktop and mobile views
   - Provides fallback navigation if Sanity data isn't available

4. **Dynamic Page Component** (`/packages/app/src/app/[slug]/page.tsx`)
   - Handles routes for pages created in Sanity
   - Resolves 404 issues for new pages
   - Renders content blocks from Sanity

5. **Updated SEO Component** (`/packages/app/src/components/SEO.tsx`)
   - Fixes social sharing preview issues
   - Ensures proper Open Graph and Twitter card metadata
   - Handles canonical URLs correctly

6. **Seeding Script** (`/packages/app/scripts/seed-sanity-navigation.js`)
   - Seeds initial navigation data in Sanity
   - Creates main and footer navigation structures

## How to Use

### Managing Navigation in Sanity

1. Go to the Sanity Studio
2. Navigate to the "Navigation" section
3. Edit the "Main Navigation" document to update the main navigation
4. Add/edit/remove navigation items as needed
5. Set authentication requirements for items that should only be visible to logged-in users

### Adding New Pages

1. Create a new page in Sanity with the appropriate slug
2. The dynamic page component will automatically render the page at the corresponding route

### Running the Seeding Script

To seed initial navigation data:

```bash
cd packages/app
node scripts/seed-sanity-navigation.js
```

## Technical Details

### Authentication-Aware Navigation

Navigation items with `requiresAuth: true` will only be shown to authenticated users. This is handled by the `useNavigation` hook which filters items based on the current authentication status.

### Dropdown Menus

Navigation items with `children` will render as dropdown menus on desktop and expandable sections on mobile.

### Fallback Navigation

If Sanity data isn't available, the navigation component will fall back to a predefined set of navigation items to ensure the site remains functional.

## Next Steps

1. Implement footer navigation using the same pattern
2. Add role-based navigation filtering (admin, producer, etc.)
3. Add analytics tracking for navigation item clicks
4. Implement navigation ordering in Sanity