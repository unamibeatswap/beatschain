import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Blog - Web3 Music & Beat Production Insights'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ searchParams }: { searchParams: { featured?: string } }) {
  let featuredImageUrl = null
  
  // Only fetch Sanity image if featured parameter is present
  if (searchParams.featured) {
    try {
      const { client } = await import('@/lib/sanity-client')
      
      if (client) {
        const featuredPost = await client.fetch(`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0] {
          mainImage
        }`)
        
        if (featuredPost?.mainImage?.asset?._ref) {
          // Construct image URL manually for edge runtime
          const ref = featuredPost.mainImage.asset._ref
          const [, id, extension] = ref.match(/image-([a-f\d]+)-(\w+)$/)
          featuredImageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${id}-${extension}?w=1200&h=630&fit=crop`
        }
      }
    } catch (error) {
      console.warn('Failed to fetch featured blog image:', error)
    }
  }
  
  // Convert to base64 if image exists
  let imageBase64: string | null = null
  if (featuredImageUrl) {
    try {
      const response = await fetch(featuredImageUrl)
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer())
        imageBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`
      }
    } catch (error) {
      console.warn('Failed to convert blog image:', error)
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        {imageBase64 ? (
          <img src={imageBase64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Blog" />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '120px', marginBottom: '20px' }}>📝</div>
            <h1 style={{ fontSize: '64px', fontWeight: 'bold', margin: '0 0 20px 0' }}>
              BeatsChain Blog
            </h1>
            <p style={{ fontSize: '28px', margin: '0', opacity: 0.9 }}>
              Web3 Music & Beat Production Insights
            </p>
            <p style={{ fontSize: '24px', margin: '20px 0 0 0', opacity: 0.8 }}>
              🎵 Music Insights • 🔗 Web3 Updates • 💡 Producer Tips
            </p>
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  )
}