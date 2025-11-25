import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Producer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params, searchParams }: { params: { id: string }, searchParams: { dynamic?: string } }) {
  let producerName = 'Producer Name'
  let totalBeats = '12'
  let totalSales = '8'
  let profileImage: string | null = null
  
  // Use UnifiedDataProvider for proper separation of concerns
  try {
    const { dataProvider } = await import('@/adapters/unifiedDataProvider')
    const producer = await dataProvider.getProducer(params.id)
    
    if (producer) {
      producerName = producer.name
      totalBeats = producer.totalBeats.toString()
      totalSales = producer.totalSales.toString()
      
      // Use producer profile image if available
      if (producer.profileImageUrl) {
        profileImage = producer.profileImageUrl
      } else if (producer.coverImageUrl) {
        profileImage = producer.coverImageUrl
      }
    } else {
      // Fallback for unrecognized producer IDs
      if (params.id.startsWith('0x') && params.id.length === 42) {
        producerName = `Web3 Producer ${params.id.slice(0, 6)}...${params.id.slice(-4)}`
        totalBeats = '3'
        totalSales = '1'
      } else {
        producerName = params.id.charAt(0).toUpperCase() + params.id.slice(1).replace('-', ' ')
        totalBeats = '0'
        totalSales = '0'
      }
    }
  } catch (error) {
    console.warn('Failed to fetch producer data for OG image:', error)
    // Final fallback
    producerName = 'Producer'
    totalBeats = '0'
    totalSales = '0'
  }
  
  // If we have a profile image, fetch and embed it
  if (profileImage) {
    try {
      const imageResponse = await fetch(profileImage)
      if (imageResponse.ok) {
        const arrayBuffer = await imageResponse.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'
        
        return new ImageResponse(
          (
            <div tw='w-full h-full flex'>
              <img 
                src={`data:${mimeType};base64,${base64}`}
                tw='w-full h-full object-cover'
              />
            </div>
          ),
          {
            width: 1200,
            height: 630,
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=3600'
            }
          }
        )
      }
    } catch (error) {
      console.log('Failed to fetch profile image')
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
          <div tw='text-8xl mb-4'>👤</div>
          <h1 tw='text-4xl font-bold'>{producerName}</h1>
          <p tw='text-2xl'>{totalBeats} Beats • {totalSales} Sales</p>
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