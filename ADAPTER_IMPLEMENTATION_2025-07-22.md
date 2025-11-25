# BeatsChain Adapter Implementation - July 22, 2025

## Overview

This document outlines the implementation of the adapter pattern for BeatsChain, which provides a unified interface for accessing data from both Sanity CMS and Web3 sources. This approach ensures seamless fallback from Web3 to Sanity data without breaking changes.

## Implementation Details

### 1. Core Data Interfaces

Created standardized interfaces for data entities:

```typescript
// /src/types/data.ts
export interface Beat {
  id: string;
  title: string;
  description?: string;
  producerId: string;
  producerName: string;
  genre: string;
  bpm: number;
  key: string;
  price: number;
  audioUrl: string;
  coverImageUrl?: string;
  tags?: string[];
  isNFT: boolean;
  tokenId?: string;
}

export interface Producer {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  genres: string[];
  totalBeats: number;
  totalSales: number;
  verified: boolean;
  profileImageUrl?: string;
  coverImageUrl?: string;
  walletAddress?: string;
}

export interface DataAdapter {
  getProducer(id: string): Promise<Producer | null>;
  getProducerBeats(producerId: string): Promise<Beat[]>;
  getAllProducers(): Promise<Producer[]>;
  getBeat(id: string): Promise<Beat | null>;
  getFeaturedBeats(limit?: number): Promise<Beat[]>;
}
```

### 2. Sanity Adapter

Implemented adapter for fetching and normalizing Sanity CMS data:

```typescript
// /src/adapters/sanityAdapter.ts
export class SanityAdapter implements DataAdapter {
  async getProducer(id: string): Promise<Producer | null> {
    // Implementation...
  }

  async getProducerBeats(producerId: string): Promise<Beat[]> {
    // Implementation...
  }

  // Other methods...
}
```

### 3. Web3 Adapter

Implemented adapter for fetching and normalizing Web3/blockchain data:

```typescript
// /src/adapters/web3Adapter.ts
export class Web3Adapter implements DataAdapter {
  async getProducer(walletAddress: string): Promise<Producer | null> {
    // Implementation with dynamic imports to prevent SSR issues
  }

  async getProducerBeats(walletAddress: string): Promise<Beat[]> {
    // Implementation with proper error handling
  }

  // Other methods...
}
```

### 4. Unified Data Provider

Created a provider that combines both adapters with prioritization logic:

```typescript
// /src/adapters/unifiedDataProvider.ts
export class UnifiedDataProvider implements DataAdapter {
  private sanityAdapter: SanityAdapter;
  private web3Adapter: Web3Adapter;
  
  constructor() {
    this.sanityAdapter = new SanityAdapter();
    this.web3Adapter = new Web3Adapter();
  }
  
  async getProducer(id: string): Promise<Producer | null> {
    // Try Web3 first if ID looks like a wallet address
    // Fall back to Sanity
    // Enhance Sanity data with Web3 data when possible
  }

  // Other methods with similar pattern...
}

// Export singleton instance
export const dataProvider = new UnifiedDataProvider();
```

### 5. Updated Producer Page

Refactored the producer page to use the unified data provider:

```typescript
// /src/app/producer/[id]/page.tsx
export default function ProducerPage() {
  // State...
  
  useEffect(() => {
    async function loadData() {
      try {
        // Get producer data from unified provider
        const producerData = await dataProvider.getProducer(producerId);
        
        if (producerData) {
          setProducer(producerData);
          
          // Get producer beats
          const beatsData = await dataProvider.getProducerBeats(producerId);
          setBeats(beatsData);
        } else {
          // Set default producer data if not found
        }
      } catch (error) {
        // Error handling with fallbacks
      }
    }
    
    loadData();
  }, [producerId]);
  
  // Rendering...
}
```

### 6. Updated Metadata Generation

Updated metadata generation to use the Sanity adapter for server-side rendering:

```typescript
// /src/app/producer/[id]/generateMetadata.ts
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Get producer from Sanity adapter
    const producer = await sanityAdapter.getProducer(params.id);
    
    // Generate metadata with proper social sharing
    return generateSocialMetadata({
      title: producer?.name ? `${producer.name} | BeatsChain Producer` : 'BeatsChain Producer',
      description: producer?.bio || 'Beat creator on BeatsChain platform.',
      imageUrl: producer?.profileImageUrl || producer?.coverImageUrl,
      type: 'profile',
      path: `/producer/${params.id}`
    });
  } catch (error) {
    // Fallback metadata
  }
}
```

### 7. Enhanced Social Sharing

Improved social sharing utilities to handle different image sources:

```typescript
// /src/lib/socialShare.ts
export function generateSocialMetadata({
  title,
  description,
  imageUrl,
  type = 'website',
  path = '',
}: {
  title: string;
  description: string;
  imageUrl?: string | any; // Accept both string URLs and Sanity image references
  type?: 'website' | 'article' | 'music' | 'profile';
  path?: string;
}): Metadata {
  // Handle different image sources
  // Generate dynamic OG image URL with proper encoding
  // Return consistent metadata
}
```

### 8. Updated OpenGraph API Routes

Enhanced OpenGraph image generation with better error handling:

```typescript
// /src/app/api/og/route.tsx
export async function GET(req: NextRequest) {
  try {
    // Get parameters from query
    // Generate image response based on content type
  } catch (error) {
    // Return a simple fallback image
  }
}
```

## Benefits

1. **Clear Separation of Concerns**: Each adapter handles its specific data source
2. **Unified Interface**: Components interact with a consistent interface regardless of data source
3. **Prioritization Logic**: Web3 data is prioritized with Sanity as fallback
4. **Error Resilience**: Proper error handling and fallbacks at every level
5. **No Breaking Changes**: Existing functionality is maintained while enhancing reliability

## Next Steps

1. **Extend Adapter Coverage**: Implement adapters for additional data types (blog posts, etc.)
2. **Caching Strategy**: Add caching to reduce redundant API calls
3. **Performance Monitoring**: Track data fetching performance across sources
4. **Enhanced Error Reporting**: Implement more detailed error tracking

## Conclusion

The adapter pattern implementation provides a robust foundation for BeatsChain's hybrid data architecture. By clearly separating concerns while providing a unified interface, we've improved reliability and maintainability without breaking existing functionality.