import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Beat'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params, searchParams }: { params: { id: string }, searchParams: { dynamic?: string } }) {
  let beatTitle = 'Beat'
  let producerName = 'BeatsChain Producer'
  let genre = 'Hip Hop'
  let price = '0.05 ETH'
  let coverImageUrl: string | null = null
  
  // Comprehensive data fetching with proper separation of concerns
  try {
    // First try UnifiedDataProvider (handles all data sources)
    const { dataProvider } = await import('@/adapters/unifiedDataProvider')
    const beat = await dataProvider.getBeat(params.id)
    
    if (beat) {
      beatTitle = beat.title || 'Beat'
      producerName = beat.producerName || beat.stageName || 'Web3 Producer'
      genre = beat.genre || 'Hip Hop'
      price = `${beat.price || '0.05'} ETH`
      if (beat.coverImageUrl && !beat.coverImageUrl.includes('placeholder')) {
        coverImageUrl = beat.coverImageUrl
      }
    } else {
      // Fallback based on ID pattern
      if (/^\d+$/.test(params.id)) {
        if (params.id.length > 10) {
          // localStorage timestamp ID
          beatTitle = `Beat #${params.id.slice(-4)}`
          producerName = 'Web3 Producer'
        } else {
          // Blockchain tokenId
          beatTitle = `Beat #${params.id}`
          producerName = 'Web3 Producer'
        }
      } else {
        // Sanity slug
        beatTitle = params.id.charAt(0).toUpperCase() + params.id.slice(1).replace('-', ' ')
        producerName = 'BeatsChain Producer'
      }
    }
  } catch (error) {
    // Final fallback
    beatTitle = `Beat #${params.id}`
    producerName = 'BeatsChain Producer'
  }

  // If we have a cover image, fetch and embed it reliably
  if (coverImageUrl) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // Increased timeout
      
      const imageResponse = await fetch(coverImageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'BeatsChain-OpenGraph/1.0'
        }
      })
      clearTimeout(timeoutId)
      
      if (imageResponse.ok && imageResponse.status === 200) {
        const arrayBuffer = await imageResponse.arrayBuffer()
        if (arrayBuffer.byteLength > 0 && arrayBuffer.byteLength < 10000000) { // Max 10MB
          const base64 = Buffer.from(arrayBuffer).toString('base64')
          const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'
          
          return new ImageResponse(
            (
              <div tw='w-full h-full flex'>
                <img 
                  src={`data:${mimeType};base64,${base64}`}
                  tw='w-full h-full object-cover'
                  alt={beatTitle}
                />
              </div>
            ),
            {
              width: 1200,
              height: 630,
              headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=3600, immutable'
              }
            }
          )
        }
      }
    } catch (error) {
      console.warn('IPFS image fetch failed:', error)
    }
  }

  // Fallback gradient
  return new ImageResponse(
    (
      <div 
        tw='w-full h-full flex items-center justify-center text-white'
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        }}>
        <div tw='text-center'>
          <div tw='text-8xl mb-4'>🎵</div>
          <h1 tw='text-4xl font-bold'>{beatTitle}</h1>
          <p tw='text-2xl'>by {producerName}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300'
      }
    }
  )
}