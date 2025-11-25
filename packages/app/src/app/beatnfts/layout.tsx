import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BeatNFTs Marketplace | Own Premium Beats as NFTs',
  description: 'Discover and own premium beats as NFTs from talented South African producers. Buy beats with crypto, get automatic royalties, true blockchain ownership.',
  keywords: ['BeatNFTs', 'NFT beats', 'beat marketplace', 'crypto beats', 'blockchain music', 'Web3 beats'],
  openGraph: {
    title: 'BeatNFTs Marketplace | Own Premium Beats as NFTs',
    description: 'Discover and own premium beats as NFTs from talented South African producers. Buy beats with crypto, get automatic royalties, true blockchain ownership.',
    url: 'https://beatschain.app/beatnfts',
    type: 'website',
    siteName: 'BeatsChain',
    images: [
      {
        url: 'https://beatschain.app/beatnfts/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'BeatNFTs Marketplace | Own Premium Beats as NFTs',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeatNFTs Marketplace | Own Premium Beats as NFTs',
    description: 'Discover and own premium beats as NFTs from talented South African producers. Buy beats with crypto, get automatic royalties, true blockchain ownership.',
    images: ['https://beatschain.app/beatnfts/opengraph-image'],
    creator: '@BeatsChain',
    site: '@BeatsChain',
  },
  alternates: {
    canonical: 'https://beatschain.app/beatnfts',
  },
  other: {
    'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1234567890123456',
  },
}

export default function BeatNFTsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}