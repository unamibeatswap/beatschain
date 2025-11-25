/**
 * Social Share Utilities
 * 
 * This module provides utilities for generating social share metadata
 * with proper separation of concerns between Web3 and Sanity CMS data.
 */

import { Metadata } from 'next'
import { urlFor } from './sanity-client'
import { SITE_NAME, SITE_URL } from '@/utils/site'

/**
 * Generate OpenGraph metadata for a page
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
  const url = `${SITE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  
  // Ensure image URL is absolute
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
    } catch (error) {
      console.warn('Error processing image URL for social metadata:', error)
    }
  }
  
  // Generate dynamic OG image URL with proper encoding
  if (!ogImage) {
    const encodedTitle = encodeURIComponent(title)
    const encodedSubtitle = encodeURIComponent(description.substring(0, 100))
    ogImage = `${SITE_URL}/api/og?title=${encodedTitle}&subtitle=${encodedSubtitle}&type=${type}`
  }

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  }
}

/**
 * Generate OpenGraph metadata for a blog post
 */
export function generateBlogMetadata(post: any): Metadata {
  const title = post?.title || 'Blog Post'
  const description = post?.excerpt || 'Read our latest blog post on BeatsChain'
  const slug = post?.slug?.current || ''
  const path = `/blog/${slug}`
  
  // Get image from Sanity if available
  let imageUrl = null
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
 * Generate OpenGraph metadata for a beat
 */
export function generateBeatMetadata(beat: any): Metadata {
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
 * Generate OpenGraph metadata for a producer
 */
export function generateProducerMetadata(producer: any): Metadata {
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