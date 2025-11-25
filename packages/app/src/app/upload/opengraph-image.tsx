import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Beat Upload'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  let featuredImage: string | null = null
  
  try {
    const { createClient } = await import('@sanity/client')
    
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'i01qs9p6',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      useCdn: true
    })
    
    const page = await client.fetch(`*[_type == "page" && slug.current == "upload"][0] {
      seo
    }`)
    
    if (page?.seo?.ogImage?.asset?._ref) {
      const ref = page.seo.ogImage.asset._ref
      const match = ref.match(/image-([a-f\d]+)-(\d+x\d+)-(\w+)$/)
      if (match) {
        const [, id, dimensions, extension] = match
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'i01qs9p6'
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
        featuredImage = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}?w=1200&h=630&fit=crop&auto=format`
      }
    }
  } catch (error) {
    console.warn('Failed to fetch upload page image:', error)
  }
  
  // Convert to base64
  let imageBase64: string | null = null
  if (featuredImage) {
    try {
      const response = await fetch(featuredImage)
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer())
        imageBase64 = `data:image/jpeg;base64,${buffer.toString("base64")}`
      }
    } catch (error) {
      console.warn("Failed to convert image:", error)
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        {!featuredImage && (
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
            <div style={{ fontSize: '120px', marginBottom: '20px' }}>🎵</div>
            <h1 style={{ fontSize: '64px', fontWeight: 'bold', margin: '0 0 20px 0' }}>
              Upload Your Beat
            </h1>
            <p style={{ fontSize: '28px', margin: '0', opacity: 0.9 }}>
              Turn Your Music Into Web3 Assets
            </p>
            <p style={{ fontSize: '24px', margin: '20px 0 0 0', opacity: 0.8 }}>
              🎧 Upload • 🎫 Mint NFT • 💰 Earn Royalties
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