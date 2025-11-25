import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Blog - Web3 Beat Industry Insights'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params, searchParams }: { params: { slug: string }, searchParams: { dynamic?: string } }) {
  let title = 'BeatsChain Blog Post'
  let description = 'Web3 Beat Industry Insights'
  let mainImageUrl = null
  
  // Always fetch Sanity data for social platforms
  try {
    const { createClient } = await import('@sanity/client')
    
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'i01qs9p6',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      useCdn: true
    })
    
    const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
      title, excerpt, mainImage
    }`, { slug: params.slug })
    
    if (post) {
      title = post.title || title
      description = post.excerpt || description
      
      if (post.mainImage?.asset?._ref) {
        const ref = post.mainImage.asset._ref
        const match = ref.match(/image-([a-f\d]+)-(\d+x\d+)-(\w+)$/)
        if (match) {
          const [, id, dimensions, extension] = match
          const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'i01qs9p6'
          const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
          mainImageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}?w=1200&h=630&fit=crop&auto=format`
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch blog post for OG image:', error)
  }
  
  // Fallback for specific posts
  if (!mainImageUrl && params.slug === 'what-is-a-beatnft') {
    title = '🎫 What Is a BeatNFT?'
    description = 'A BeatNFT is a smart, digital way to turn your beats into money — not just once, but again and again.'
  }
  


  return new ImageResponse(
    (
      <div
        style={{
          background: mainImageUrl 
            ? `linear-gradient(rgba(99,102,241,0.8), rgba(139,92,246,0.9)), url(${mainImageUrl})`
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '40px',
            position: 'relative'
          }}
        >
          <div style={{ fontSize: '100px', marginBottom: '20px' }}>
            {params.slug === 'what-is-a-beatnft' ? '🎫' : '📝'}
          </div>
          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: 'bold', 
            margin: '0 0 20px 0',
            lineHeight: '1.1',
            maxWidth: '900px'
          }}>
            {title}
          </h1>
          <p style={{ 
            fontSize: '24px', 
            margin: '0', 
            opacity: 0.9,
            maxWidth: '800px',
            lineHeight: '1.3'
          }}>
            {description}
          </p>
          <div style={{
            fontSize: '18px',
            margin: '30px 0 0 0',
            opacity: 0.8,
            background: 'rgba(255,255,255,0.1)',
            padding: '10px 20px',
            borderRadius: '20px'
          }}>
            BeatsChain Blog
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    }
  )
}