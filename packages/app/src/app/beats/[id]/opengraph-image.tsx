import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Beat'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  let beatTitle = 'Beat'
  let producerName = 'BeatsChain Producer'
  let genre = 'Hip Hop'
  let price = '0.05 ETH'
  let coverImageUrl: string | null = null
  
  // Direct API call for localStorage beats to get real cover image
  if (/^\d+$/.test(params.id) && params.id.length > 10) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/beat-metadata/${params.id}`)
      if (response.ok) {
        const beat = await response.json()
        beatTitle = beat.title
        producerName = beat.stageName || beat.producerName || 'Web3 Producer'
        genre = beat.genre
        price = `${beat.price} ETH`
        
        if (beat.coverImageUrl && !beat.coverImageUrl.includes('placeholder') && !beat.coverImageUrl.includes('via.placeholder')) {
          coverImageUrl = beat.coverImageUrl
        }
      }
    } catch (error) {
      console.warn('Failed to fetch beat for OG image:', error)
    }
  }
  
  // Fallback to UnifiedDataProvider for other beat types
  if (!beatTitle || beatTitle === 'Beat') {
    try {
      const { dataProvider } = await import('@/adapters/unifiedDataProvider')
      const beat = await dataProvider.getBeat(params.id)
      
      if (beat) {
        beatTitle = beat.title
        producerName = beat.producerName || beat.stageName || 'Web3 Producer'
        genre = beat.genre
        price = `${beat.price} ETH`
        
        if (beat.coverImageUrl && !beat.coverImageUrl.includes('placeholder') && !beat.coverImageUrl.includes('via.placeholder')) {
          coverImageUrl = beat.coverImageUrl
        }
      }
    } catch (error) {
      console.warn('UnifiedDataProvider failed:', error)
    }
  }

  return new ImageResponse(
    (
      <div 
        tw='w-full h-full'
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : undefined,
          backgroundSize: coverImageUrl ? 'contain' : 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    }
  )
}