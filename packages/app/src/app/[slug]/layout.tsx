import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let title = 'BeatsChain'
  let description = 'Web3 beat marketplace'
  
  try {
    const { client } = require('@/lib/sanity-client')
    const page = await client.fetch(`*[_type == "page" && slug.current == $slug][0]{title, seo}`, { slug: params.slug })
    
    if (page) {
      title = page.seo?.metaTitle || page.title || title
      description = page.seo?.metaDescription || description
    }
  } catch (error) {
    // Fallback to defaults on error
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://beatschain.app/${params.slug}`,
      type: 'website',
      siteName: 'BeatsChain',
      images: [{
        url: `https://beatschain.app/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://beatschain.app/opengraph-image`],
    },
  }
}

export default function DynamicPageLayout({ children }: { children: React.ReactNode }) {
  return children
}