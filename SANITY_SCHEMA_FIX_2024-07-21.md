# Sanity Schema Fix - July 21, 2025

## Issue Analysis

The Sanity Studio error about an unknown field `heroSection{"_type":"blogHero",...}` indicates:

1. Content in Sanity is using a `blogHero` type that isn't defined in the schema
2. There's a mismatch between the content structure and schema definitions
3. The error appears when editing blog posts in Sanity Studio

## Solution Approach

1. Define the missing `blogHero` schema type
2. Update related schemas to properly reference this type
3. Ensure backward compatibility with existing content

## Implementation Steps

1. Create a new schema file for `blogHero` or extend the existing `heroSection` schema
2. Update the post schema to properly reference the blogHero type
3. Validate schema changes against existing content

## Code Changes Required

1. Create or update schema file in `/packages/app/sanity/schemas/`:
   - Define the `blogHero` type with appropriate fields
   - Ensure it matches the structure being used in content

2. Update the post schema to properly reference the new type:
   - Add proper field definition for heroSection
   - Ensure compatibility with existing content

3. Update any components that render this content type:
   - Ensure they can handle both old and new schema formats
   - Add proper fallbacks for missing fields