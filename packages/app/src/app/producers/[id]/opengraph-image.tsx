import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Producer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
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
  
  return new ImageResponse(
    (
      <div 
        tw='w-full h-full'
        style={{
          backgroundImage: profileImage ? `url(${profileImage})` : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    ),
    {
      width: 1200,
      height: 630
    }
  )
}