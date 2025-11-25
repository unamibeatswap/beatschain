# Web3 and Sanity Integration Strategy - July 23, 2025

## Current Architecture

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

## Audio Player Strategy

For handling audio files from both Web3 and Sanity sources:

1. **Progressive Enhancement**:
   - Try Web3 source first (IPFS)
   - Fall back to Sanity CMS if Web3 fails
   - Add cache-busting for problematic URLs

2. **Error Handling**:
   - Detect audio loading failures
   - Attempt reload with cache-busting parameters
   - Fall back to Sanity audio URL if available

3. **Implementation Example**:
```typescript
<audio
  controls
  src={beat.audioUrl}
  onError={(e) => {
    // Try to reload with cache-busting
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

## Metadata Generation Strategy

For generating social preview metadata:

1. **Server-Side Only**:
   - Use only server-safe code in metadata generation
   - Avoid any client-side APIs (localStorage, window, etc.)

2. **Prioritization**:
   - Try Web3 metadata if ID looks like a token ID
   - Fall back to Sanity metadata for all other cases
   - Provide default values when both sources fail

3. **Implementation Example**:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  try {
    // Server-safe data fetching from Sanity
    const producer = await sanityAdapter.getProducer(params.id);
    
    return generateSocialMetadata({
      title: producer?.name ? `${producer.name} | BeatsChain` : 'BeatsChain Producer',
      description: producer?.bio || 'Beat creator on BeatsChain platform.',
      imageUrl: producer?.profileImageUrl || producer?.coverImageUrl,
      type: 'profile',
      path: `/producer/${params.id}`
    });
  } catch (error) {
    // Fallback metadata
    return {
      title: 'BeatsChain Producer',
      description: 'Producer profile on BeatsChain - Web3 Beat Marketplace'
    };
  }
}
```

## Upload Progress Strategy

For tracking upload progress in forms:

1. **Progress Tracking**:
   - Show progress bar during uploads
   - Update progress percentage in real-time
   - Provide visual feedback on completion

2. **Implementation Example**:
```typescript
{uploading && (
  <div className="bg-blue-50 p-4 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-blue-700">Uploading...</span>
      <span className="text-blue-700">{progress}%</span>
    </div>
    <div className="w-full bg-blue-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
)}
```

## Toast Notification Strategy

For consistent toast notifications:

1. **Standardized Styling**:
   - Use consistent styling across all pages
   - Match the style of /beatnft page
   - Ensure proper visibility and readability

2. **Implementation Example**:
```typescript
const toastStyles = `
  .Toastify__toast {
    background: white !important;
    color: #1f2937 !important;
    font-weight: 600 !important;
    border-radius: 12px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
    border: 2px solid #e5e7eb !important;
  }
  .Toastify__toast--success {
    border-left: 6px solid #10b981 !important;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  }
`;
```

## Conclusion

This integration strategy ensures that BeatsChain can leverage both Web3 and Sanity CMS data sources while providing a seamless user experience. By implementing proper fallback mechanisms and error handling, we can ensure that content is always available to users regardless of the state of the blockchain or IPFS network.