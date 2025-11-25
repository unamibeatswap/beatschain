# BeatsChain Technical Notes - July 23, 2025

## Architecture Overview

BeatsChain uses a hybrid data architecture with:

1. **Web3 as Primary Data Source**:
   - BeatNFT smart contracts for ownership and transactions
   - IPFS for storing beat audio files and metadata
   - Wallet-based authentication and permissions

2. **Sanity CMS as Fallback and Static Content**:
   - Producer profiles and metadata
   - Beat information and audio files
   - Marketing content and site structure

3. **Adapter Pattern Implementation**:
   - `UnifiedDataProvider`: Coordinates between Web3 and Sanity data
   - `Web3Adapter`: Fetches blockchain/IPFS data
   - `SanityAdapter`: Fetches CMS data

## Implementation Details

### Audio Player Enhancement

The audio player was enhanced to handle both Web3 and Sanity CMS audio sources with proper error handling:

```typescript
<audio
  controls
  src={beat.audioUrl}
  className="w-full"
  preload="metadata"
  onError={(e) => {
    console.warn('Audio failed to load:', beat.audioUrl);
    // Try to reload with a cache-busting parameter
    const audioElement = e.target as HTMLAudioElement;
    if (audioElement && beat.audioUrl) {
      const cacheBuster = `?cb=${Date.now()}`;
      const newUrl = beat.audioUrl.includes('?') 
        ? `${beat.audioUrl}&cb=${Date.now()}` 
        : `${beat.audioUrl}${cacheBuster}`;
      audioElement.src = newUrl;
      audioElement.load();
    }
  }}
/>
```

This approach:
1. Detects audio loading failures
2. Attempts to reload with cache-busting parameters
3. Provides a graceful fallback when audio is unavailable

### Metadata Generation

The metadata generation was updated to avoid client-side code and provide better fallbacks:

```typescript
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Get producer from Sanity adapter only (server-safe)
    const producer = await sanityAdapter.getProducer(params.id);
    
    // Prepare image URL for OpenGraph
    let imageUrl = producer?.profileImageUrl || producer?.coverImageUrl;
    
    // If no image is available, use dynamic OG image API
    if (!imageUrl) {
      const title = encodeURIComponent(producer?.name || 'Producer Profile');
      const subtitle = encodeURIComponent(producer?.bio?.substring(0, 100) || 'Beat creator on BeatsChain');
      imageUrl = `${SITE_URL}/api/og?title=${title}&subtitle=${subtitle}&type=profile`;
    }
    
    // Generate metadata with proper social sharing
    return generateSocialMetadata({
      title: producer?.name ? `${producer.name} | BeatsChain Producer` : 'BeatsChain Producer',
      description: producer?.bio || 'Beat creator on BeatsChain platform.',
      imageUrl: imageUrl,
      type: 'profile',
      path: `/producer/${params.id}`
    });
  } catch (error) {
    // Fallback metadata with dynamic OG image
    // ...
  }
}
```

This approach:
1. Uses only server-safe code in metadata generation
2. Provides dynamic fallbacks for missing images
3. Ensures proper social sharing metadata is always available

### OpenGraph API Enhancement

The OpenGraph API route was enhanced to handle dynamic parameters correctly:

```typescript
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get parameters from query with proper decoding
    const title = decodeURIComponent(searchParams.get('title') || 'BeatsChain');
    const subtitle = decodeURIComponent(searchParams.get('subtitle') || 'Web3 Beat Marketplace');
    const type = searchParams.get('type') || 'default';
    
    // Choose background color based on content type
    let bgGradient = 'linear-gradient(to bottom right, #667eea, #764ba2)';
    let emoji = '\ud83c\udfb5';
    
    if (type === 'music') {
      bgGradient = 'linear-gradient(to bottom right, #3b82f6, #2dd4bf)';
      emoji = '\ud83c\udfa7';
    } else if (type === 'profile') {
      // ...
    }
    
    // Generate image response
    return new ImageResponse(
      // ...
      {
        width: 1200,
        height: 630,
        // Add cache control headers to prevent stale images
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
          'Content-Type': 'image/png'
        }
      }
    );
  } catch (error) {
    // Return a simple fallback image
    // ...
  }
}
```

This approach:
1. Properly decodes URL parameters
2. Adds cache control headers to prevent stale images
3. Provides type-specific styling for different content types
4. Includes a robust fallback for error cases

## Data Flow Strategy

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   Web3 Source   │     │  Sanity CMS     │
│   (Blockchain)  │     │  (Content)      │
│                 │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌────────┴────────┐     ┌────────┴────────┐
│                 │     │                 │
│   Web3 Adapter  │     │ Sanity Adapter  │
│                 │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │                       │
         │  Unified Data Provider│
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │                       │
         │    UI Components      │
         │                       │
         └───────────────────────┘
```

This data flow ensures:
1. Web3 data is prioritized when available
2. Sanity CMS provides fallback data when Web3 sources fail
3. UI components receive consistent data regardless of source
4. Error handling is centralized in the adapters

## Technical Considerations

1. **Server vs. Client Components**: Careful separation of server and client components to avoid hydration errors
2. **Error Boundaries**: Strategic placement of error boundaries to prevent cascading failures
3. **Progressive Enhancement**: Starting with Sanity data as baseline and enhancing with Web3 data when available
4. **Performance Optimization**: Proper caching and lazy loading to improve performance

## Future Improvements

1. **Caching Layer**: Add a caching layer to reduce redundant API calls
2. **Offline Support**: Implement service workers for offline access to content
3. **Analytics Integration**: Track data source usage and fallback frequency
4. **Performance Monitoring**: Measure and optimize data fetching performance