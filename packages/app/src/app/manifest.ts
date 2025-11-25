import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/site'
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BeatsChain - Web3 Beat Marketplace',
    short_name: 'BeatsChain',
    description: 'Web3 beat marketplace - Buy beats as NFTs with crypto. BeatNFT credits, automatic royalties, true beat ownership.',
    lang: 'en',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#1f2937',
    theme_color: '#3b82f6',
    scope: '/',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],
    categories: ['music', 'entertainment', 'marketplace', 'nft', 'blockchain'],
    shortcuts: [
      {
        name: 'Browse Beats',
        short_name: 'Browse',
        description: 'Discover new beats',
        url: '/browse',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }]
      },
      {
        name: 'Upload Beat',
        short_name: 'Upload',
        description: 'Upload your beats',
        url: '/upload',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }]
      },
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Producer dashboard',
        url: '/dashboard',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }]
      }
    ],
    prefer_related_applications: false
  }
}
