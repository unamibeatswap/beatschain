# Comprehensive BeatsChain Fixes - July 23, 2025

## Issue Analysis

After a thorough review of the BeatsChain codebase, I've identified several issues that need to be addressed:

### 1. Wallet Connection Message

**Issue**: The message "Please connect your wallet and sign in to upload beats" appears even when the wallet is connected.

**Root Cause**: The issue is in the `ProtectedRoute` component where it checks for wallet connection but doesn't properly handle the case where the wallet is connected but not authenticated.

**Fix**: Update the `ProtectedRoute` component to show a more appropriate message when the wallet is connected but not authenticated.

```typescript
// In ProtectedRoute.tsx
if (requireWallet && !wallet.isConnected) {
  // Show wallet connection UI
} else if (requireWallet && wallet.isConnected && !isAuthenticated) {
  // Show sign-in UI with appropriate message
  return fallback || (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✍️</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Sign In to Continue
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>
            Your wallet is connected. Please sign in to access this feature.
          </p>
          <button
            onClick={signIn}
            style={{
              background: 'white',
              color: '#1d4ed8',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 2. Audio Player Issues

**Issue**: Audio previews not working on producer pages.

**Root Cause**: The audio player doesn't properly handle CORS issues, IPFS gateway timeouts, or Sanity CMS audio URL formats.

**Fix**: Enhance the audio player with better error handling, retry logic, and format detection:

```typescript
// In producer/[id]/page.tsx
<audio
  controls
  src={beat.audioUrl}
  className="w-full"
  preload="metadata"
  onError={(e) => {
    console.warn('Audio failed to load:', beat.audioUrl);
    
    // Try to reload with cache-busting parameter
    const audioElement = e.target as HTMLAudioElement;
    if (audioElement && beat.audioUrl) {
      // First try: Add cache-busting parameter
      const cacheBuster = `?cb=${Date.now()}`;
      const newUrl = beat.audioUrl.includes('?') 
        ? `${beat.audioUrl}&cb=${Date.now()}` 
        : `${beat.audioUrl}${cacheBuster}`;
      
      console.log('Retrying with cache-busting URL:', newUrl);
      audioElement.src = newUrl;
      audioElement.load();
      
      // Add a second error handler for the retry attempt
      audioElement.onerror = () => {
        console.warn('Retry failed, checking for alternative sources');
        
        // Try alternative IPFS gateway if it's an IPFS URL
        if (beat.audioUrl?.includes('ipfs://')) {
          const alternativeGateway = 'https://gateway.pinata.cloud/ipfs/';
          const ipfsHash = beat.audioUrl.replace('ipfs://', '').split('?')[0];
          const alternativeUrl = `${alternativeGateway}${ipfsHash}`;
          
          console.log('Trying alternative IPFS gateway:', alternativeUrl);
          audioElement.src = alternativeUrl;
          audioElement.load();
        }
      };
    }
  }}
/>
```

### 3. Social Preview/Metadata Issues

**Issue**: OpenGraph images and metadata not displaying correctly.

**Root Cause**: The metadata generation has client-side code and doesn't properly handle dynamic parameters.

**Fix**: Update the metadata generation to be fully server-side and handle all edge cases:

```typescript
// In generateMetadata.ts
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Get producer from Sanity
    const producer = await sanityAdapter.getProducer(params.id);
    
    // Prepare image URL for OpenGraph
    let imageUrl = producer?.profileImageUrl || producer?.coverImageUrl;
    
    // If no image is available, use dynamic OG image API
    if (!imageUrl) {
      const title = encodeURIComponent(producer?.name || 'Producer Profile');
      const subtitle = encodeURIComponent(producer?.bio?.substring(0, 100) || 'Beat creator on BeatsChain');
      imageUrl = `${SITE_URL}/api/og?title=${title}&subtitle=${subtitle}&type=profile`;
    }
    
    // Ensure image URL is absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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
    console.error('Error generating producer metadata:', error);
    
    // Fallback metadata with dynamic OG image
    const title = encodeURIComponent('BeatsChain Producer');
    const subtitle = encodeURIComponent('Web3 Beat Marketplace');
    const fallbackImage = `${SITE_URL}/api/og?title=${title}&subtitle=${subtitle}&type=profile`;
    
    return {
      title: 'BeatsChain Producer',
      description: 'Producer profile on BeatsChain - Web3 Beat Marketplace',
      openGraph: {
        title: 'BeatsChain Producer',
        description: 'Producer profile on BeatsChain - Web3 Beat Marketplace',
        url: `${SITE_URL}/producer/${params.id}`,
        siteName: 'BeatsChain',
        images: [{ url: fallbackImage, width: 1200, height: 630 }],
        locale: 'en_US',
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'BeatsChain Producer',
        description: 'Producer profile on BeatsChain - Web3 Beat Marketplace',
        images: [fallbackImage],
      },
    };
  }
}
```

### 4. Upload Progress Tracking

**Issue**: Upload forms need progress tracking.

**Root Cause**: The upload forms don't consistently show progress or have proper error handling.

**Fix**: Enhance the upload component with better progress tracking and error handling:

```typescript
// In BeatUpload.tsx
{uploading && (
  <div className="bg-blue-50 p-4 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-blue-700">Uploading {audioFile?.name}...</span>
      <span className="text-blue-700">{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-blue-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-blue-600 mt-2">
      {progress < 100 ? 'Please wait while your beat is being uploaded...' : 'Processing your beat...'}
    </p>
  </div>
)}
```

## Implementation Plan

### 1. Fix Wallet Connection Message

1. Update the `ProtectedRoute` component to handle the case where the wallet is connected but not authenticated
2. Add a sign-in button when the wallet is connected but not authenticated
3. Improve the error messages to be more specific about what action is needed

### 2. Fix Audio Player

1. Enhance the audio player with better error handling
2. Add retry logic with cache-busting
3. Add support for alternative IPFS gateways
4. Implement proper fallbacks for when audio is unavailable

### 3. Fix Social Preview/Metadata

1. Ensure metadata generation is fully server-side
2. Add proper fallbacks for all metadata fields
3. Ensure all image URLs are absolute
4. Add proper cache control headers to prevent stale images

### 4. Enhance Upload Progress Tracking

1. Add detailed progress tracking to all upload forms
2. Improve error handling and user feedback
3. Add retry mechanisms for failed uploads

## Testing Plan

1. Test wallet connection and authentication flow
2. Test audio playback with various audio sources (Sanity, IPFS, etc.)
3. Test social preview generation with various metadata scenarios
4. Test upload progress tracking with various file sizes and types

## Conclusion

By implementing these comprehensive fixes, we can address the issues with the BeatsChain application without making breaking changes. The focus is on enhancing the existing functionality with better error handling, fallbacks, and user feedback.