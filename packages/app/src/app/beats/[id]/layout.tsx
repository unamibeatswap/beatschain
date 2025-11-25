import { Metadata } from 'next'
import { dataProvider } from '@/adapters/unifiedDataProvider'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Use UnifiedDataProvider for all beat data - it handles Web3DataContext properly
  const beat = await dataProvider.getBeat(params.id)
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
  const canonicalUrl = `${baseUrl}/beat/${params.id}`
  const ogImageUrl = `${baseUrl}/beat/${params.id}/opengraph-image`
  
  if (!beat) {
    const isTokenId = /^\d+$/.test(params.id)
    const title = isTokenId ? `Beat #${params.id} | BeatsChain` : `${params.id.charAt(0).toUpperCase() + params.id.slice(1).replace('-', ' ')} | BeatsChain`
    const description = isTokenId ? 'Web3 beat on BeatsChain' : 'Beat on BeatsChain - Web3 Beat Marketplace'
    
    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        type: 'music.song'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl]
      }
    }
  }

  return {
    title: `${beat.title} by ${beat.producerName} - ${beat.genre} Beat | BeatsChain`,
    description: `🎵 ${beat.title} - ${beat.genre} beat by ${beat.producerName}. ${beat.bpm} BPM • ${beat.key || 'C'} • ${beat.price} ETH. Buy this beat as NFT on BeatsChain.`,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `${beat.title} by ${beat.producerName} - ${beat.genre} Beat | BeatsChain`,
      description: `🎵 ${beat.genre} beat • ${beat.bpm} BPM • ${beat.price} ETH • Available as NFT on BeatsChain`,
      url: canonicalUrl,
      type: 'music.song',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      siteName: 'BeatsChain',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${beat.title} by ${beat.producerName} - ${beat.genre} Beat`,
      description: `🎵 ${beat.genre} beat • ${beat.bpm} BPM • ${beat.price} ETH • Buy as NFT on BeatsChain`,
      images: [ogImageUrl],
      creator: '@BeatsChain',
      site: '@BeatsChain',
    },
    other: {
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1234567890123456',
      'music:duration': '180',
      'music:album': 'BeatsChain Collection',
      'music:musician': beat.producerName,
      'article:author': beat.producerName,
      'article:section': 'Music',
      'article:tag': beat.genre,
    },
  }
}

export default function BeatsLayout({ children }: { children: React.ReactNode }) {
  return children
}