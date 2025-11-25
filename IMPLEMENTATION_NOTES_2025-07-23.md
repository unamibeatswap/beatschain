# BeatsChain Implementation Notes - July 23, 2025

## Issues Analysis

After reviewing the BeatsChain codebase, I've identified the following issues that need to be addressed:

1. **Wallet Connection Message**: Users are seeing "Please connect your wallet and sign in" message even when already connected
2. **Audio Player Issues**: Audio previews not working on producer pages
3. **Social Preview/Metadata Issues**: OpenGraph images and metadata not displaying correctly
4. **Toast Message Inconsistency**: Toast messages need to match the style of /beatnft page
5. **Upload Progress Tracking**: Need progress bars in all upload forms

## Implementation Plan

### 1. Fix Wallet Connection Message

The issue is in `BeatUpload.tsx` where the validation message doesn't check if the wallet is already connected. We'll modify the condition to only show the message when truly needed.

```typescript
// BeatUpload.tsx - Update validation logic
// Change from:
if (!isAuthenticated || !user) {
  toast.error('Please connect your wallet and sign in to upload beats')
  return
}

// To:
if (!isAuthenticated || !user) {
  toast.error('Please sign in to upload beats')
  return
}
```

### 2. Fix Audio Player

The audio player needs to handle both IPFS and Sanity CMS audio sources with proper error handling:

```typescript
// Producer page - Update audio player with error handling
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

### 3. Fix Social Preview/Metadata

Update the metadata generation to avoid client-side code:

```typescript
// generateMetadata.ts - Remove client-side code
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Get producer from Sanity adapter only (server-safe)
    const sanityAdapter = new SanityAdapter();
    const producer = await sanityAdapter.getProducer(params.id);
    
    // Generate metadata with proper social sharing
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

### 4. Standardize Toast Messages

Update the toast styling to match the /beatnft page:

```typescript
// ToastProvider.tsx - Update toast styles
const toastStyles = `
  .Toastify__toast {
    background: white !important;
    color: #1f2937 !important;
    font-weight: 600 !important;
    border-radius: 12px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
    border: 2px solid #e5e7eb !important;
    font-size: 14px !important;
    min-height: 70px !important;
    padding: 16px !important;
  }
  .Toastify__toast--success {
    border-left: 6px solid #10b981 !important;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  }
  .Toastify__toast--error {
    border-left: 6px solid #ef4444 !important;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
  }
  // Additional styles...
`;
```

### 5. Add Progress Tracking to Upload Forms

Ensure all upload forms have progress tracking:

```typescript
// BeatUploadForm.tsx - Add progress tracking
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

## Implementation Constraints

- **Contract Status**: One contract pending deployment to mainnet (not part of current fixes)
- **Data Strategy**: Sanity CMS has all fallback data, no mock data needed
- **Config Sensitivity**: Next.js config should remain untouched to avoid breaking the app

## Next Steps

1. Fix the wallet connection message in BeatUpload.tsx
2. Update the audio player on the producer page
3. Fix the metadata generation for social previews
4. Standardize toast messages across the app
5. Ensure all upload forms have progress tracking