import { Metadata } from 'next'
import { SanityAdapter } from '@/adapters/sanityAdapter.enhanced'

const sanityAdapter = new SanityAdapter()

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let producerName = 'Producer Name'
  let description = 'Beat creator on BeatsChain platform'
  
  // Handle different producer types
  const isWalletAddress = params.id.startsWith('0x') && params.id.length === 42
  
  // Try to fetch producer data from Sanity
  try {
    const producer = await sanityAdapter.getProducer(params.id)
    if (producer) {
      producerName = producer.name
      description = producer.bio || `Discover beats by ${producer.name} on BeatsChain`
    } else if (isWalletAddress) {
      producerName = `Web3 Producer ${params.id.slice(0, 6)}...${params.id.slice(-4)}`
      description = 'Web3 beat producer on BeatsChain blockchain platform'
    }
  } catch (error) {
    console.warn('Failed to fetch producer for metadata:', error)
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
  const canonicalUrl = `${baseUrl}/producer/${params.id}` // Canonical should be singular
  const ogImageUrl = `${baseUrl}/producer/${params.id}/opengraph-image`
  
  return {
    title: `${producerName} | BeatsChain Producer`,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `${producerName} - ${isWalletAddress ? 'Web3' : 'SA'} Beat Producer`,
      description,
      type: 'profile',
      url: canonicalUrl,
      siteName: 'BeatsChain',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${producerName} - Beat Producer`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${producerName} - ${isWalletAddress ? 'Web3' : 'SA'} Beat Producer`,
      description,
      images: [ogImageUrl],
    },
  }
}

export default function ProducersLayout({ children }: { children: React.ReactNode }) {
  return children
}