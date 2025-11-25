# BeatsChain Implementation Plan - July 21, 2025

## 1. Fix Client-Side Exception on Producer Pages

### Issue
The producer page throws a client-side exception when loading `/producer/default-1` or `/producer/sample-producer`.

### Root Cause
- `useReadContract` hook executing before producer data is available
- Unsafe data access without proper checks
- Dynamic imports of wagmi actions causing potential timing issues

### Solution
1. Refactor producer page component to use safer data fetching:
   - Move Web3 hooks inside conditional rendering blocks
   - Add proper error boundaries
   - Implement robust loading states
   - Use optional chaining throughout

2. Specific changes:
   - Wrap `useReadContract` hooks in a conditional that checks for valid producer address
   - Add error handling for contract interactions
   - Create fallback UI for when Web3 data is unavailable

## 2. Fix Sanity Schema Issues

### Issue
Unknown field error: `heroSection{"_type":"blogHero",...}` in Sanity Studio.

### Root Cause
- `blogHero` schema type is not defined but is being used in content
- Mismatch between content structure and schema definitions

### Solution
1. Define proper `blogHero` schema type:
   - Create new schema file or extend existing heroSection schema
   - Ensure it matches the structure being used in content

2. Update related schemas:
   - Modify post schema to properly reference the blogHero type
   - Validate schema changes against existing content

## 3. Fix Blog Hero Image Display

### Issue
Blog article hero image is not displayed despite being available in Sanity.

### Root Cause
- Blog post page not using mainImage for hero background
- Inconsistent image URL handling

### Solution
1. Update blog post page component:
   - Modify hero section to check for and use post.mainImage
   - Add proper image URL construction with urlFor utility
   - Implement fallback for when image is unavailable

2. Ensure consistent image handling:
   - Use same pattern across all blog components
   - Add proper error handling for image loading

## 4. Create Grid Components

### Issue
Inconsistent grid components across content types (beats, producers, blog).

### Root Cause
- Only EnhancedBlogGrid exists, no equivalent for beats and producers
- Inconsistent UI patterns across content types

### Solution
1. Create BeatGrid component:
   - Base on EnhancedBlogGrid pattern
   - Adapt for beat-specific data structure
   - Include filtering, pagination, and featured items

2. Create ProducerGrid component:
   - Similar functionality to other grids
   - Adapt for producer-specific data
   - Ensure consistent UI patterns

3. Ensure all grids have:
   - Consistent filtering capabilities
   - Pagination
   - Featured item handling
   - Responsive layouts

## 5. Improve Social Preview & Metadata

### Issue
Inconsistent metadata and social preview images across different page types.

### Root Cause
- Inconsistent handling of images from different sources
- Incomplete metadata generation

### Solution
1. Enhance metadata generation:
   - Update generateSocialMetadata to handle both Sanity and Web3 images
   - Implement consistent OpenGraph data across all pages
   - Add proper fallbacks for missing images

2. Specific improvements:
   - Ensure all pages have proper title, description, and image
   - Handle both relative and absolute image URLs
   - Add proper image dimensions for OpenGraph

## Implementation Guidelines

- **No Breaking Changes**: All changes must be additive or corrective
- **Backward Compatibility**: Maintain support for existing data structures
- **Progressive Enhancement**: Enhance existing components rather than replacing
- **Comprehensive Testing**: Test all changes across different environments

## Priority Order

1. Fix client-side exceptions (Critical)
2. Fix Sanity schema issues (Critical)
3. Fix blog hero image display (High)
4. Create grid components (Medium)
5. Improve social preview & metadata (Medium)