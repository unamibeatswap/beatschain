import { Metadata } from 'next'
import { generateSocialMetadata } from '@/lib/socialShare.enhanced'
import { SanityAdapter } from '@/adapters/sanityAdapter'

// Use only Sanity adapter for metadata to avoid client-side code
const sanityAdapter = new SanityAdapter()

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Get beat from Sanity
    const beat = await sanityAdapter.getBeat(params.id)
    
    // Generate metadata with proper social sharing
    return generateSocialMetadata({
      title: beat?.title ? `${beat.title} | BeatsChain` : `Beat #${params.id} | BeatsChain`,
      description: beat?.description || 'Listen to this beat on BeatsChain',
      imageUrl: beat?.coverImageUrl,
      type: 'music',
      path: `/beat/${params.id}`
    })
  } catch (error) {
    console.error('Error generating beat metadata:', error)
    
    // Fallback metadata
    return {
      title: `Beat #${params.id} | BeatsChain`,
      description: 'Web3 beat on BeatsChain - Blockchain Beat Marketplace'
    }
  }
}