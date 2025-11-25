import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  let title = 'BeatsChain'
  let description = 'Web3 beat marketplace'
  
  try {
    const { client } = require('@/lib/sanity-client')
    const page = await client.fetch(`*[_type == "page" && slug.current == "guide"][0]{seo}`)
    if (page?.seo?.metaTitle) title = page.seo.metaTitle
    if (page?.seo?.metaDescription) description = page.seo.metaDescription
  } catch (error) {
    // Fallback to defaults on error
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://beatschain.app/guide`,
      type: 'website',
      siteName: 'BeatsChain',
      images: [{
        url: `https://beatschain.app/guide/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://beatschain.app/guide/opengraph-image`],
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
