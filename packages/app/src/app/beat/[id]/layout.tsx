import { Metadata } from 'next'
import { dataProvider } from '@/adapters/unifiedDataProvider'

interface BeatLayoutProps {
  children: React.ReactNode
  params: { id: string }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
  const beatUrl = `${baseUrl}/beat/${params.id}`
  const ogImageUrl = `${baseUrl}/beat/${params.id}/opengraph-image`
  
  try {
    // Direct API cache fetch for server-side metadata generation
    let beat = null
    
    // Try API cache first for localStorage beats
    if (/^\d+$/.test(params.id) && params.id.length > 10) {
      try {
        const response = await fetch(`https://beatschain.app/api/beat-metadata/${params.id}`)
        if (response.ok) {
          const cachedBeat = await response.json()
          beat = {
            id: cachedBeat.id,
            title: cachedBeat.title,
            description: cachedBeat.description,
            genre: cachedBeat.genre,
            bpm: cachedBeat.bpm,
            key: cachedBeat.key,
            price: cachedBeat.price,
            producerName: cachedBeat.stageName || 'Web3 Producer',
            stageName: cachedBeat.stageName,
            coverImageUrl: cachedBeat.coverImageUrl,
            source: 'api-cache'
          }
        }
      } catch (error) {
        console.warn('Direct API cache fetch failed:', error)
      }
    }
    
    // Fallback to UnifiedDataProvider
    if (!beat) {
      beat = await dataProvider.getBeat(params.id)
    }
    
    if (beat) {
      const producerName = beat.producerName || beat.stageName || 'Web3 Producer'
      
      return {
        title: `${beat.title} by ${producerName} - ${beat.genre} Beat | BeatsChain`,
        description: `🎵 ${beat.title} - ${beat.genre} beat by ${producerName}. ${beat.bpm} BPM • ${beat.key || 'C'} • ${beat.price} ETH. Buy this beat as NFT on BeatsChain.`,
        keywords: [beat.title, producerName, beat.genre, 'beat', 'NFT', 'Web3', 'blockchain music'],
        openGraph: {
          title: `${beat.title} by ${producerName} - ${beat.genre} Beat | BeatsChain`,
          description: `🎵 ${beat.genre} beat • ${beat.bpm} BPM • ${beat.price} ETH • Available as NFT on BeatsChain`,
          url: beatUrl,
          type: 'music.song',
          images: [{
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${beat.title} by ${producerName} - BeatsChain`,
            type: 'image/png'
          }],
          siteName: 'BeatsChain',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${beat.title} by ${producerName} - ${beat.genre} Beat`,
          description: `🎵 ${beat.genre} beat • ${beat.bpm} BPM • ${beat.price} ETH • Buy as NFT on BeatsChain`,
          images: [ogImageUrl],
          creator: '@BeatsChain',
          site: '@BeatsChain',
        },
        alternates: {
          canonical: beatUrl,
        },
        other: {
          'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1234567890123456',
          'music:duration': '180',
          'music:album': 'BeatsChain Collection',
          'music:musician': producerName,
          'article:author': producerName,
          'article:section': 'Music',
          'article:tag': beat.genre,
        },
      }
    }
    
    // Fallback metadata
    const isTokenId = /^\d+$/.test(params.id)
    const title = isTokenId ? `Beat #${params.id} | BeatsChain` : `${params.id.charAt(0).toUpperCase() + params.id.slice(1).replace('-', ' ')} | BeatsChain`
    const description = isTokenId ? 'Web3 beat on BeatsChain' : 'Beat on BeatsChain - Web3 Beat Marketplace'
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: beatUrl,
        images: [{ url: ogImageUrl, width: 1200, height: 630, type: 'image/png' }],
        type: 'music.song'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl]
      }
    }

  } catch (error) {
    console.error('Error generating beat metadata:', error)
    
    return {
      title: `Beat #${params.id} | BeatsChain`,
      description: 'Web3 beat on BeatsChain - Blockchain Beat Marketplace'
    }
  }
}

export default function BeatLayout({ children }: BeatLayoutProps) {
  return <>{children}</>
}