# OpenGraph Dynamic Image Test Guide

## Test URLs to Verify

### 1. Blog Post OpenGraph Images
- **Static**: https://beatschain.app/blog/what-is-a-beatnft/opengraph-image
- **Dynamic**: https://beatschain.app/blog/what-is-a-beatnft/opengraph-image?dynamic=true

### 2. Producer OpenGraph Images  
- **Static**: https://beatschain.app/producer/default-1/opengraph-image
- **Dynamic**: https://beatschain.app/producer/default-1/opengraph-image?dynamic=true

### 3. Beat OpenGraph Images
- **Static**: https://beatschain.app/beat/summer-vibes/opengraph-image  
- **Dynamic**: https://beatschain.app/beat/summer-vibes/opengraph-image?dynamic=true

### 4. Fallback API Route
- **Generic**: https://beatschain.app/api/og?title=Test&subtitle=Description&type=music

## Expected Behavior

### With `?dynamic=true`:
- Blog posts should show Sanity CMS featured images as backgrounds
- Producer pages should show real Sanity profile data and images
- Beat pages should show real Sanity beat data and cover art
- Fallback to branded gradients when no CMS data available

### Without `?dynamic=true`:
- All pages should show static branded gradients
- Generic titles and descriptions
- No external data fetching

## Social Platform Testing

### Facebook Debugger
1. Go to https://developers.facebook.com/tools/debug/
2. Test URLs:
   - https://beatschain.app/blog/what-is-a-beatnft
   - https://beatschain.app/producer/default-1
   - https://beatschain.app/beat/summer-vibes

### Twitter Card Validator
1. Go to https://cards-dev.twitter.com/validator
2. Test the same URLs as above

### LinkedIn Post Inspector
1. Go to https://www.linkedin.com/post-inspector/
2. Test the same URLs as above

## Debugging Steps

1. **Direct Image Access**: Visit OpenGraph image URLs directly
2. **Check Network Tab**: Verify images load without errors
3. **Inspect HTML**: Check meta tags in page source
4. **Clear Cache**: Force social platforms to re-scrape

## Success Criteria

✅ **Blog Posts**: Show Sanity featured images with real titles
✅ **Producer Pages**: Show profile images with real producer data  
✅ **Beat Pages**: Show cover art with real beat information
✅ **Social Previews**: Display correctly on Facebook, Twitter, LinkedIn
✅ **Fallback System**: Graceful degradation when data unavailable