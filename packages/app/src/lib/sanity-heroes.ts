/**
 * Sanity Hero Section Helper
 * Fetch hero sections for dashboard pages
 */

import { client, urlFor } from './sanity-client'

export interface HeroData {
  headline: string
  subheadline?: string
  backgroundImage?: any
  style: 'gradient' | 'image' | 'video' | 'split' | 'minimal'
  ctaButtons?: Array<{
    text: string
    url: string
    style: 'primary' | 'secondary'
  }>
  badges?: string[]
}

/**
 * Get hero section for a specific page
 */
export async function getHeroSection(pageSlug: string): Promise<HeroData | null> {
  try {
    const page = await client.fetch(`
      *[_type == "page" && slug.current == $slug][0] {
        heroSection
      }
    `, { slug: pageSlug })
    
    return page?.heroSection || null
  } catch (error) {
    console.warn(`Failed to fetch hero for ${pageSlug}:`, error)
    return null
  }
}

/**
 * Default hero sections for dashboard pages
 */
export const DEFAULT_HEROES: Record<string, HeroData> = {
  dashboard: {
    headline: '🎤 Producer Dashboard',
    subheadline: 'Manage your beats, track earnings, and grow your music business with Web3 technology',
    style: 'gradient',
    badges: ['Upload Beats', 'Track Analytics', 'Earn Royalties']
  },
  'creator-dashboard': {
    headline: '🎨 Creator Dashboard', 
    subheadline: 'License beats for your content, collaborate with producers, and manage your creative projects',
    style: 'gradient',
    badges: ['License Beats', 'Content Creation', 'Collaboration Tools']
  },
  'collector-dashboard': {
    headline: '🖼️ NFT Collector Dashboard',
    subheadline: 'Manage your BeatNFT collection, track portfolio performance, and discover rare beats',
    style: 'gradient', 
    badges: ['NFT Collection', 'Portfolio Tracking', 'Rare Discoveries']
  },
  'music-dashboard': {
    headline: '🎧 Music Dashboard',
    subheadline: 'Discover amazing beats, manage your favorites, and connect with talented SA producers',
    style: 'gradient',
    badges: ['Discover Beats', 'Curated Playlists', 'Producer Network']
  }
}