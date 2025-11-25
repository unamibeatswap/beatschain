import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  let title = 'BeatsChain Blog | Web3 Music & Beat Production Insights'
  let description = 'Latest insights on Web3 music, beat production, and the future of decentralized music ownership. Learn about BeatNFTs and blockchain music.'
  
  // Get SEO data from Sanity
  try {
    const { client } = require('@/lib/sanity-client')
    const page = await client.fetch(`*[_type == "page" && slug.current == "blog"][0]{seo}`)
    if (page?.seo?.metaTitle) title = page.seo.metaTitle
    if (page?.seo?.metaDescription) description = page.seo.metaDescription
  } catch (error) {
    // Fallback to defaults on error
  }
  
  return {
    title,
    description,
    keywords: ['Web3 music', 'beat production', 'BeatNFTs', 'blockchain music', 'music NFTs', 'producer tips'],
    openGraph: {
      title,
      description,
      url: 'https://beatschain.app/blog',
      type: 'website',
      siteName: 'BeatsChain',
      images: [
        {
          url: 'https://beatschain.app/blog/opengraph-image',
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://beatschain.app/blog/opengraph-image'],
      creator: '@BeatsChain',
      site: '@BeatsChain',
    },
    alternates: {
      canonical: 'https://beatschain.app/blog',
    },
    other: {
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1234567890123456',
    },
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}