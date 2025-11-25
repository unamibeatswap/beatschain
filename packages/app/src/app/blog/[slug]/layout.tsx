import { Metadata } from 'next'
import { client } from '@/lib/sanity-client'

interface BlogPostLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let post = null
  
  // Try to fetch from Sanity
  if (client) {
    try {
      post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
        title, excerpt, publishedAt, author->{ name }
      }`, { slug: params.slug })
    } catch (error) {
      console.warn('Failed to fetch blog post for metadata:', error)
    }
  }
  
  // Fallback data for specific posts
  if (!post) {
    if (params.slug === 'what-is-a-beatnft') {
      post = {
        title: '🎫 What Is a BeatNFT?',
        excerpt: 'A BeatNFT is a smart, digital way to turn your beats into money — not just once, but again and again.',
        author: { name: 'BeatsChain Team' }
      }
    } else {
      post = {
        title: 'BeatsChain Blog Post',
        excerpt: 'Web3 beat industry insights and music production tips.',
        author: { name: 'BeatsChain Team' }
      }
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
  const postUrl = `${baseUrl}/blog/${params.slug}`
  const ogImageUrl = `${baseUrl}/blog/${params.slug}/opengraph-image`

  return {
    title: `${post.title} | BeatsChain Blog`,
    description: post.excerpt || 'Web3 beat industry insights and music production tips from BeatsChain.',
    keywords: ['BeatNFT', 'Web3 music', 'beat production', 'blockchain music', 'music NFTs', 'beat ownership'],
    
    openGraph: {
      title: post.title,
      description: post.excerpt || 'Web3 beat industry insights and music production tips from BeatsChain.',
      url: postUrl,
      type: 'article',
      siteName: 'BeatsChain',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} - BeatsChain Blog`,
        }
      ],
      authors: [post.author?.name || 'BeatsChain Team'],
      publishedTime: post.publishedAt,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || 'Web3 beat industry insights and music production tips from BeatsChain.',
      images: [ogImageUrl],
      creator: '@BeatsChain',
      site: '@BeatsChain',
    },
    
    alternates: {
      canonical: postUrl,
    },
    
    other: {
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1234567890123456',
    },
  }
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return <>{children}</>
}