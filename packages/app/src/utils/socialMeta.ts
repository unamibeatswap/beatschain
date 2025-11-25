/**
 * Social Media Meta Tag Utilities
 * Generates dynamic meta tags for beats and platform pages
 */

import { Beat } from '@/types/data'

interface SocialMetaConfig {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'music.song' | 'article'
  audio?: string
  beatData?: Beat
}

export function generateSocialMeta(config: SocialMetaConfig) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
  const defaultImage = `${baseUrl}/images/og-image.png`
  
  const meta = {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.url || baseUrl,
      siteName: 'BeatsChain',
      images: [
        {
          url: config.image || defaultImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'en_US',
      type: config.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.image || defaultImage],
      creator: '@BeatsChain',
      site: '@BeatsChain',
    },
  }

  // Add music-specific meta for beats
  if (config.beatData) {
    const beat = config.beatData
    meta.openGraph = {
      ...meta.openGraph,
      type: 'music.song',
      // @ts-ignore - OpenGraph music properties
      'music:duration': 180, // Default 3 minutes
      'music:musician': beat.producerName || 'Unknown Artist',
      'music:album': 'BeatsChain Collection',
    }
    
    if (config.audio) {
      // @ts-ignore - OpenGraph audio property
      meta.openGraph['og:audio'] = config.audio
    }
  }

  return meta
}

export function generateBeatMeta(beat: Beat, baseUrl?: string) {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
  
  return generateSocialMeta({
    title: `${beat.title} - ${beat.producerName || 'BeatsChain'}`,
    description: `${beat.description || `${beat.genre} beat by ${beat.producerName}`} • ${beat.bpm} BPM • ${beat.key} • ${beat.price} ETH`,
    image: beat.coverImageUrl || `${url}/images/og-image.png`,
    url: `${url}/beats/${beat.id}`,
    type: 'music.song',
    audio: beat.audioUrl,
    beatData: beat
  })
}

export function generateProducerMeta(producer: any, baseUrl?: string) {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
  
  return generateSocialMeta({
    title: `${producer.name || producer.displayName} - BeatsChain Producer`,
    description: `${producer.bio || `Music producer on BeatsChain`} • ${producer.totalBeats || 0} beats • ${producer.location || 'Web3'}`,
    image: producer.avatar || producer.profileImage || `${url}/images/og-image.png`,
    url: `${url}/producers/${producer.id}`,
    type: 'website'
  })
}