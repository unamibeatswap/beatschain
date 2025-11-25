import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  let title = 'BeatsChain Producers | Meet Our Beat Makers'
  let description = 'Connect with South Africa\'s most talented beat creators and producers. Discover Web3 producers creating the future of music on BeatsChain.'
  
  // Get SEO data from Sanity
  try {
    const { client } = require('@/lib/sanity-client')
    const page = await client.fetch(`*[_type == "page" && slug.current == "producers"][0]{seo}`)
    if (page?.seo?.metaTitle) title = page.seo.metaTitle
    if (page?.seo?.metaDescription) description = page.seo.metaDescription
  } catch (error) {
    // Fallback to defaults on error
  }
  
  return {
    title,
    description,
    keywords: ['beat producers', 'South African producers', 'Web3 music creators', 'beat makers', 'music producers'],
    openGraph: {
      title,
      description,
      url: 'https://beatschain.app/producers',
      type: 'website',
      siteName: 'BeatsChain',
      images: [
        {
          url: 'https://beatschain.app/producers/opengraph-image',
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
      images: ['https://beatschain.app/producers/opengraph-image'],
      creator: '@BeatsChain',
      site: '@BeatsChain',
    },
    alternates: {
      canonical: 'https://beatschain.app/producers',
    },
    other: {
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1234567890123456',
    },
  }
}

export default function ProducersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}