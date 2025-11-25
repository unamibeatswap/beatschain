# BeatsChain Sanity CMS and Web3 Integration Plan - July 22, 2025

## Current State Analysis

### 1. Client-Side Exception on Producer Page

The client-side exception on the producer page (`/producer/default-1`) is occurring due to several issues:

1. **Server-Side vs. Client-Side Rendering Mismatch**: The `generateMetadata.ts` file attempts to access `localStorage` during server-side rendering, which is not available in that context.

2. **React Error Boundary Issues**: While we've added the `react-error-boundary` package, there might be issues with how it's being used in the producer page component.

3. **Web3 Data Fetching Timing**: The `Web3ProducerData` component is attempting to fetch data too early in the component lifecycle.

### 2. Data Sources Analysis

#### Sanity CMS Data (3 Beats, 1 Producer)

The application currently has limited data in Sanity CMS:
- 1 Producer document with basic information
- 3 Beat documents with audio files and metadata

#### Web3 Data (Primary Source)

The application is designed to use Web3 as the primary data source:
- BeatNFT contract for beat ownership and metadata
- Producer wallet addresses for linking producers to their beats
- IPFS for storing beat audio files and metadata

### 3. Social Preview Issues

The social preview images are not showing up due to:
1. **Dynamic Route Handling**: The OpenGraph image generation routes are not properly handling dynamic parameters
2. **Server-Side Rendering Limitations**: The current implementation tries to access client-side APIs during server rendering
3. **Missing Fallback Mechanisms**: When Sanity data is unavailable, there's no proper fallback for generating preview images

## Integration Plan

### 1. Fix Client-Side Exception on Producer Page

```typescript
// Updated producer/[id]/generateMetadata.ts
import { Metadata } from 'next'
import { generateSocialMetadata } from '@/lib/socialShare'
import { client } from '@/lib/sanity-client'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Try to fetch producer data from Sanity
    let producer = null
    
    if (client) {
      try {
        producer = await client.fetch(`
          *[_type == "producer" && slug.current == $slug][0] {
            name,
            bio,
            profileImage,
            coverImage,
            verified
          }
        `, { slug: params.id })
      } catch (error) {
        console.warn('Failed to fetch producer from Sanity:', error)
      }
    }
    
    // REMOVE localStorage check - it's not available during SSR
    
    // If no producer found, create a fallback
    if (!producer) {
      producer = {
        name: 'Beat Creator',
        bio: 'Beat creator on BeatsChain platform.',
        profileImage: null,
        coverImage: null
      }
    }
    
    // Generate metadata with proper social sharing
    return generateSocialMetadata({
      title: `${producer.name} | BeatsChain Producer`,
      description: producer.bio || `Check out ${producer.name}'s beats on BeatsChain`,
      imageUrl: producer.profileImage || producer.coverImage,
      type: 'profile',
      path: `/producer/${params.id}`
    })
  } catch (error) {
    console.error('Error generating producer metadata:', error)
    
    // Fallback metadata
    return {
      title: 'BeatsChain Producer',
      description: 'Producer profile on BeatsChain - Web3 Beat Marketplace'
    }
  }
}
```

### 2. Hybrid Data Strategy

#### 2.1 Data Source Prioritization

Implement a clear data source prioritization strategy:

1. **Sanity CMS First**: For static content, marketing pages, and blog posts
2. **Web3 Primary**: For dynamic content like beats, producers, and transactions
3. **Fallback Mechanism**: When Web3 data is unavailable, fall back to Sanity data

#### 2.2 Data Synchronization

Create a synchronization mechanism between Web3 and Sanity:

```typescript
// Example synchronization utility
export async function syncWeb3ToSanity(beatNftId: string) {
  try {
    // 1. Fetch metadata from Web3
    const { readContract } = await import('wagmi/actions')
    const { config } = await import('@/lib/wagmi')
    const { beatNFTABI } = await import('@/abis')
    
    const tokenURI = await readContract(config, {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: beatNFTABI,
      functionName: 'tokenURI',
      args: [BigInt(beatNftId)]
    })
    
    // 2. Fetch IPFS metadata
    const ipfsUrl = tokenURI.replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY)
    const response = await fetch(ipfsUrl)
    const metadata = await response.json()
    
    // 3. Check if beat exists in Sanity
    const existingBeat = await client.fetch(`*[_type == "beat" && beatNftId == $beatNftId][0]`, {
      beatNftId
    })
    
    // 4. Create or update Sanity document
    if (!existingBeat) {
      // Create new beat document
      await client.create({
        _type: 'beat',
        title: metadata.name,
        description: metadata.description,
        beatNftId: beatNftId,
        // Map other fields...
      })
    } else {
      // Update existing document
      await client.patch(existingBeat._id)
        .set({
          title: metadata.name,
          description: metadata.description,
          // Update other fields...
        })
        .commit()
    }
    
    return true
  } catch (error) {
    console.error('Error syncing Web3 to Sanity:', error)
    return false
  }
}
```

### 3. Enhanced Producer Page

Update the producer page to better handle the hybrid data model:

```tsx
// Simplified producer page component
export default function ProducerPage() {
  const params = useParams()
  const producerId = params.id as string
  const [producer, setProducer] = useState(null)
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Fetch producer data with proper error handling
  useEffect(() => {
    async function fetchProducer() {
      try {
        // Try Sanity first
        const sanityProducer = await client?.fetch(`
          *[_type == "producer" && slug.current == $slug][0] {
            name, bio, location, genres, profileImage, coverImage, verified, walletAddress
          }
        `, { slug: producerId }).catch(() => null)
        
        if (sanityProducer) {
          setProducer({
            id: producerId,
            name: sanityProducer.name,
            bio: sanityProducer.bio,
            // Map other fields...
            walletAddress: sanityProducer.walletAddress
          })
          
          // If producer has wallet address, fetch Web3 data
          if (sanityProducer.walletAddress?.startsWith('0x')) {
            fetchWeb3Beats(sanityProducer.walletAddress)
          } else {
            // Otherwise, fetch beats from Sanity
            fetchSanityBeats(producerId)
          }
          
          setLoading(false)
          return
        }
        
        // Fallback to default
        setProducer({
          id: producerId,
          name: 'Beat Creator',
          bio: 'Beat creator on BeatsChain platform.',
          // Set default values...
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching producer:', error)
        // Set fallback data
        setProducer({
          id: producerId,
          name: 'Beat Creator',
          bio: 'Beat creator on BeatsChain platform.',
          // Set default values...
        })
        setLoading(false)
      }
    }
    
    fetchProducer()
  }, [producerId])
  
  // Fetch beats from Sanity
  async function fetchSanityBeats(producerId) {
    try {
      const sanityBeats = await client?.fetch(`
        *[_type == "beat" && producer->slug.current == $producerId] {
          title, slug, description, genre, bpm, key, price, audioFile, coverImage
        }
      `, { producerId }).catch(() => [])
      
      if (sanityBeats?.length > 0) {
        setBeats(sanityBeats.map(beat => ({
          id: beat.slug.current,
          title: beat.title,
          // Map other fields...
          audioUrl: beat.audioFile?.asset?.url,
          coverImageUrl: beat.coverImage ? urlFor(beat.coverImage).url() : null
        })))
      }
    } catch (error) {
      console.error('Error fetching Sanity beats:', error)
    }
  }
  
  // Fetch beats from Web3
  async function fetchWeb3Beats(walletAddress) {
    try {
      // Web3 data fetching logic...
    } catch (error) {
      console.error('Error fetching Web3 beats:', error)
      // Fallback to Sanity beats
      fetchSanityBeats(producerId)
    }
  }
  
  // Rest of the component...
}
```

### 4. Fix Social Preview Images

#### 4.1 Update OpenGraph API Routes

```tsx
// Updated api/og/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Get parameters from query
    const title = searchParams.get('title') || 'BeatsChain'
    const subtitle = searchParams.get('subtitle') || 'Web3 Beat Marketplace'
    const type = searchParams.get('type') || 'default'
    
    // Choose background color based on content type
    let bgGradient = 'linear-gradient(to bottom right, #667eea, #764ba2)'
    
    if (type === 'beat') {
      bgGradient = 'linear-gradient(to bottom right, #3b82f6, #2dd4bf)'
    } else if (type === 'producer') {
      bgGradient = 'linear-gradient(to bottom right, #8b5cf6, #ec4899)'
    } else if (type === 'blog') {
      bgGradient = 'linear-gradient(to bottom right, #f43f5e, #f97316)'
    }
    
    // Generate image response
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: bgGradient,
            fontSize: 60,
            fontWeight: 800,
            color: 'white',
            padding: '0 120px',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          {/* Image content */}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #667eea, #764ba2)',
            color: 'white',
            fontSize: 60,
            fontWeight: 800,
          }}
        >
          BeatsChain
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}
```

#### 4.2 Update Social Share Utility

```typescript
// Updated socialShare.ts
export function generateSocialMetadata({
  title,
  description,
  imageUrl,
  type = 'website',
  path = '',
}: {
  title: string
  description: string
  imageUrl?: string | any
  type?: 'website' | 'article' | 'music' | 'profile'
  path?: string
}): Metadata {
  const url = `${SITE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  
  // Ensure image URL is absolute
  let ogImage: string | undefined
  
  if (imageUrl) {
    try {
      // Handle Sanity image references
      if (typeof imageUrl === 'object' && imageUrl.asset) {
        ogImage = urlFor(imageUrl).width(1200).height(630).url()
      } 
      // Handle IPFS URLs (Web3)
      else if (typeof imageUrl === 'string' && imageUrl.includes('ipfs://')) {
        const ipfsGateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'
        ogImage = imageUrl.replace('ipfs://', ipfsGateway)
      }
      // Handle absolute URLs
      else if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        ogImage = imageUrl
      } 
      // Handle relative URLs
      else if (typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
        ogImage = `${SITE_URL}${imageUrl}`
      }
    } catch (error) {
      console.warn('Error processing image URL for social metadata:', error)
    }
  }
  
  // Generate dynamic OG image URL with proper encoding
  if (!ogImage) {
    const encodedTitle = encodeURIComponent(title)
    const encodedSubtitle = encodeURIComponent(description.substring(0, 100))
    ogImage = `${SITE_URL}/api/og?title=${encodedTitle}&subtitle=${encodedSubtitle}&type=${type}`
  }

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  }
}
```

### 5. Leveraging Available Sanity CMS Data

#### 5.1 Create a Data Bridge Utility

```typescript
// dataBridge.ts - Bridge between Sanity and Web3 data
import { client, urlFor } from '@/lib/sanity-client'

// Fetch all available producers from Sanity
export async function getAllProducers() {
  try {
    const producers = await client.fetch(`
      *[_type == "producer"] {
        _id,
        name,
        slug,
        bio,
        location,
        genres,
        profileImage,
        coverImage,
        verified,
        walletAddress,
        stats
      }
    `)
    
    return producers.map(p => ({
      id: p.slug?.current || p._id,
      name: p.name || 'Beat Creator',
      bio: p.bio || 'Beat creator on BeatsChain platform.',
      location: p.location || 'South Africa',
      genres: p.genres || ['Hip Hop'],
      totalBeats: p.stats?.totalBeats || 0,
      totalSales: p.stats?.totalSales || 0,
      verified: p.verified || false,
      profileImage: p.profileImage ? urlFor(p.profileImage).url() : null,
      coverImage: p.coverImage ? urlFor(p.coverImage).url() : null,
      walletAddress: p.walletAddress || null
    }))
  } catch (error) {
    console.error('Error fetching producers from Sanity:', error)
    return []
  }
}

// Fetch all available beats from Sanity
export async function getAllBeats() {
  try {
    const beats = await client.fetch(`
      *[_type == "beat"] {
        _id,
        title,
        slug,
        description,
        producer->{name, slug},
        stageName,
        genre,
        bpm,
        key,
        tags,
        price,
        audioFile,
        coverImage,
        status,
        featured
      }
    `)
    
    return beats.map(b => ({
      id: b.slug?.current || b._id,
      title: b.title || 'Untitled Beat',
      description: b.description || '',
      producerId: b.producer?.slug?.current || '',
      stageName: b.stageName || b.producer?.name || '',
      genre: b.genre || 'Hip Hop',
      bpm: b.bpm || 120,
      key: b.key || 'C',
      tags: b.tags || [],
      price: b.price || 0.05,
      audioUrl: b.audioFile?.asset?.url || '',
      coverImageUrl: b.coverImage ? urlFor(b.coverImage).url() : null,
      status: b.status || 'draft',
      featured: b.featured || false
    }))
  } catch (error) {
    console.error('Error fetching beats from Sanity:', error)
    return []
  }
}

// Get producer by ID (slug)
export async function getProducerById(id: string) {
  try {
    const producer = await client.fetch(`
      *[_type == "producer" && slug.current == $id][0] {
        _id,
        name,
        slug,
        bio,
        location,
        genres,
        profileImage,
        coverImage,
        verified,
        walletAddress,
        stats
      }
    `, { id })
    
    if (!producer) return null
    
    return {
      id: producer.slug?.current || producer._id,
      name: producer.name || 'Beat Creator',
      bio: producer.bio || 'Beat creator on BeatsChain platform.',
      location: producer.location || 'South Africa',
      genres: producer.genres || ['Hip Hop'],
      totalBeats: producer.stats?.totalBeats || 0,
      totalSales: producer.stats?.totalSales || 0,
      verified: producer.verified || false,
      profileImage: producer.profileImage ? urlFor(producer.profileImage).url() : null,
      coverImage: producer.coverImage ? urlFor(producer.coverImage).url() : null,
      walletAddress: producer.walletAddress || null
    }
  } catch (error) {
    console.error('Error fetching producer from Sanity:', error)
    return null
  }
}

// Get beats by producer ID (slug)
export async function getBeatsByProducerId(producerId: string) {
  try {
    const beats = await client.fetch(`
      *[_type == "beat" && producer->slug.current == $producerId] {
        _id,
        title,
        slug,
        description,
        producer->{name, slug},
        stageName,
        genre,
        bpm,
        key,
        tags,
        price,
        audioFile,
        coverImage,
        status,
        featured
      }
    `, { producerId })
    
    return beats.map(b => ({
      id: b.slug?.current || b._id,
      title: b.title || 'Untitled Beat',
      description: b.description || '',
      producerId: b.producer?.slug?.current || '',
      stageName: b.stageName || b.producer?.name || '',
      genre: b.genre || 'Hip Hop',
      bpm: b.bpm || 120,
      key: b.key || 'C',
      tags: b.tags || [],
      price: b.price || 0.05,
      audioUrl: b.audioFile?.asset?.url || '',
      coverImageUrl: b.coverImage ? urlFor(b.coverImage).url() : null,
      status: b.status || 'draft',
      featured: b.featured || false
    }))
  } catch (error) {
    console.error('Error fetching beats from Sanity:', error)
    return []
  }
}
```

#### 5.2 Update Producer Page to Use Data Bridge

```tsx
// Updated producer page component
export default function ProducerPage() {
  const params = useParams()
  const producerId = params.id as string
  const [producer, setProducer] = useState(null)
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [web3Enabled, setWeb3Enabled] = useState(false)
  
  useEffect(() => {
    async function loadData() {
      try {
        // Import data bridge dynamically to avoid SSR issues
        const { getProducerById, getBeatsByProducerId } = await import('@/utils/dataBridge')
        
        // Get producer from Sanity
        const producerData = await getProducerById(producerId)
        
        if (producerData) {
          setProducer(producerData)
          
          // Check if producer has wallet address for Web3 data
          setWeb3Enabled(!!producerData.walletAddress && producerData.walletAddress.startsWith('0x'))
          
          // Get beats from Sanity
          const beatsData = await getBeatsByProducerId(producerId)
          setBeats(beatsData)
        } else {
          // Set default producer data
          setProducer({
            id: producerId,
            name: 'Beat Creator',
            bio: 'Beat creator on BeatsChain platform.',
            location: 'Unknown',
            genres: ['Hip Hop'],
            totalBeats: 0,
            totalSales: 0,
            verified: false,
            profileImage: null,
            coverImage: null,
            walletAddress: null
          })
        }
      } catch (error) {
        console.error('Error loading producer data:', error)
        // Set fallback data
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [producerId])
  
  // Rest of the component...
}
```

## Implementation Recommendations

### 1. Prioritize Fixes

1. **Fix Client-Side Exception**: Update the producer page to handle data fetching safely
2. **Fix Social Preview Images**: Update the OpenGraph API routes to handle dynamic content
3. **Create Data Bridge**: Implement the data bridge utility to leverage available Sanity data

### 2. Maintain Separation of Concerns

- **Sanity CMS**: Use for static content, marketing pages, and blog posts
- **Web3/Blockchain**: Use for dynamic content, ownership, and transactions
- **Hybrid Components**: Create components that can handle both data sources

### 3. Implement Progressive Enhancement

- Start with Sanity data as the baseline
- Enhance with Web3 data when available
- Provide fallbacks when either data source is unavailable

### 4. Ensure Consistent User Experience

- Use the same UI components regardless of data source
- Provide clear loading states during data fetching
- Handle errors gracefully with informative messages

## Conclusion

By implementing this integration plan, BeatsChain can effectively leverage both Sanity CMS and Web3 data sources while maintaining a consistent user experience. The plan focuses on fixing immediate issues while establishing a robust foundation for future development.

The key to success is maintaining clear separation of concerns between data sources while providing seamless integration from the user's perspective. By prioritizing fixes and implementing progressive enhancement, BeatsChain can deliver a reliable and engaging experience for both producers and artists.