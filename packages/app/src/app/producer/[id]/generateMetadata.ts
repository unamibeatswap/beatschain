import { Metadata } from 'next'
import { generateSocialMetadata } from '@/lib/socialShare.enhanced'
import { SanityAdapter } from '@/adapters/sanityAdapter'
import { SITE_URL } from '@/utils/site'

// Use only Sanity adapter for metadata to avoid client-side code
const sanityAdapter = new SanityAdapter()

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Get producer from Sanity
    const producer = await sanityAdapter.getProducer(params.id)
    
    // Prepare image URL for OpenGraph
    let imageUrl = producer?.profileImageUrl || producer?.coverImageUrl
    
    // If no image is available, use dynamic OG image API
    if (!imageUrl) {
      const title = encodeURIComponent(producer?.name || 'Producer Profile')
      const subtitle = encodeURIComponent(producer?.bio?.substring(0, 100) || 'Beat creator on BeatsChain')
      imageUrl = `${SITE_URL}/api/og?title=${title}&subtitle=${subtitle}&type=profile`
    }
    
    // Ensure image URL is absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    }
    
    // Generate metadata with proper social sharing
    return generateSocialMetadata({
      title: producer?.name ? `${producer.name} | BeatsChain Producer` : 'BeatsChain Producer',
      description: producer?.bio || 'Beat creator on BeatsChain platform.',
      imageUrl: imageUrl,
      type: 'profile',
      path: `/producer/${params.id}`
    })
  } catch (error) {
    console.error('Error generating producer metadata:', error)
    
    // Fallback metadata with dynamic OG image
    const title = encodeURIComponent('BeatsChain Producer')
    const subtitle = encodeURIComponent('Web3 Beat Marketplace')
    const fallbackImage = `${SITE_URL}/api/og?title=${title}&subtitle=${subtitle}&type=profile`
    
    return {
      title: 'BeatsChain Producer',
      description: 'Producer profile on BeatsChain - Web3 Beat Marketplace',
      openGraph: {
        images: [{ url: fallbackImage }]
      },
      twitter: {
        card: 'summary_large_image',
        images: [fallbackImage]
      }
    }
  }
}