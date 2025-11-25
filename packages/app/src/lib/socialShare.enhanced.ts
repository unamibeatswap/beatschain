/**
 * Enhanced Social Share Utilities
 * 
 * This module provides robust utilities for generating social share metadata
 * with proper fallbacks and error handling.
 */

import { Metadata } from 'next'
import { urlFor } from './sanity-client'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/utils/site'

/**
 * Generate OpenGraph metadata for a page with robust fallbacks
 */
export function generateSocialMetadata({
  title,
  description,
  imageUrl,
  type = 'website',
  path = '',
}: {
  title: string
  description: string
  imageUrl?: string | any // Accept both string URLs and Sanity image references
  type?: 'website' | 'article' | 'music' | 'profile'
  path?: string
}): Metadata {
  // Ensure we have valid strings for title and description
  const safeTitle = title || SITE_NAME
  const safeDescription = description || SITE_DESCRIPTION
  
  // Ensure URL is absolute
  const url = path ? `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}` : SITE_URL
  
  // Create full title with site name if not already included
  const fullTitle = safeTitle.includes(SITE_NAME) ? safeTitle : `${safeTitle} | ${SITE_NAME}`
  
  // Process image URL with fallbacks
  let ogImage: string | undefined
  
  if (imageUrl) {
    try {
      // Handle Sanity image references
      if (typeof imageUrl === 'object' && imageUrl.asset) {
        ogImage = urlFor(imageUrl).width(1200).height(630).url()
      } 
      // Handle IPFS URLs (Web3)
      else if (typeof imageUrl === 'string' && imageUrl.includes('ipfs://')) {
        const ipfsGateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'
        ogImage = imageUrl.replace('ipfs://', ipfsGateway)
      }
      // Handle absolute URLs
      else if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        ogImage = imageUrl
      } 
      // Handle relative URLs
      else if (typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
        ogImage = `${SITE_URL}${imageUrl}`
      }
      
      // Validate the URL
      if (ogImage && !ogImage.startsWith('http')) {
        // If URL doesn't start with http, it's likely invalid
        console.warn('Invalid image URL for social metadata:', ogImage)
        ogImage = undefined
      }
    } catch (error) {
      console.warn('Error processing image URL for social metadata:', error)
      ogImage = undefined
    }
  }
  
  // Generate dynamic OG image URL with proper encoding if no valid image URL
  if (!ogImage) {
    try {
      const encodedTitle = encodeURIComponent(safeTitle)
      const encodedSubtitle = encodeURIComponent(safeDescription.substring(0, 100))
      ogImage = `${SITE_URL}/api/og?title=${encodedTitle}&subtitle=${encodedSubtitle}&type=${type}`
    } catch (error) {
      console.warn('Error generating dynamic OG image URL:', error)
      // Ultimate fallback - use our fallback OG image route
      ogImage = `${SITE_URL}/api/og/fallback`
    }
  }

  // Build metadata with proper fallbacks
  return {
    title: fullTitle,
    description: safeDescription,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: fullTitle,
      description: safeDescription,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: safeTitle,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: safeDescription,
      images: [ogImage],
    },
  }
}

/**
 * Generate OpenGraph metadata for a blog post with robust fallbacks
 */
export function generateBlogMetadata(post: any): Metadata {
  if (!post) {
    return generateSocialMetadata({
      title: 'Blog | BeatsChain',
      description: 'Read our latest blog posts on BeatsChain',
      type: 'article',
      path: '/blog'
    })
  }
  
  const title = post?.title || 'Blog Post'
  const description = post?.excerpt || 'Read our latest blog post on BeatsChain'
  const slug = post?.slug?.current || ''
  const path = `/blog/${slug}`
  
  // Get image from Sanity if available
  let imageUrl = undefined
  if (post?.mainImage?.asset) {
    imageUrl = post.mainImage
  }
  
  return generateSocialMetadata({
    title,
    description,
    imageUrl,
    type: 'article',
    path,
  })
}

/**
 * Generate OpenGraph metadata for a beat with robust fallbacks
 */
export function generateBeatMetadata(beat: any): Metadata {
  if (!beat) {
    return generateSocialMetadata({
      title: 'Beats | BeatsChain',
      description: 'Discover and purchase beats on BeatsChain',
      type: 'music',
      path: '/browse'
    })
  }
  
  const title = beat?.title || 'Beat'
  const description = beat?.description || `Listen to this beat on BeatsChain`
  const path = `/beat/${beat?.id || ''}`
  
  return generateSocialMetadata({
    title,
    description,
    imageUrl: beat?.coverImageUrl,
    type: 'music',
    path,
  })
}

/**
 * Generate OpenGraph metadata for a producer with robust fallbacks
 */
export function generateProducerMetadata(producer: any): Metadata {
  if (!producer) {
    return generateSocialMetadata({
      title: 'Producers | BeatsChain',
      description: 'Discover talented producers on BeatsChain',
      type: 'profile',
      path: '/producers'
    })
  }
  
  const title = producer?.name || 'Producer Profile'
  const description = producer?.bio || `Check out this producer's beats on BeatsChain`
  const path = `/producer/${producer?.id || ''}`
  
  // Use profile image if available, otherwise use cover image
  const imageUrl = producer?.profileImageUrl || producer?.coverImageUrl
  
  return generateSocialMetadata({
    title,
    description,
    imageUrl,
    type: 'profile',
    path,
  })
}