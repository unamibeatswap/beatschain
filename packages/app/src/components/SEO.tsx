'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { urlFor } from '@/lib/sanity'

interface SEOProps {
  title?: string
  description?: string
  ogImage?: any
  noIndex?: boolean
  canonicalUrl?: string
  structuredData?: any
  siteSettings?: any
  keywords?: string[]
  ogType?: string
  twitterCard?: string
}

export default function SEO({
  title,
  description,
  ogImage,
  noIndex = false,
  canonicalUrl,
  structuredData,
  siteSettings,
  keywords = [],
  ogType = 'website',
  twitterCard = 'summary_large_image'
}: SEOProps) {
  // Use site settings as fallback
  const metaTitle = title || siteSettings?.seo?.metaTitle || 'BeatsChain'
  const metaDescription = description || siteSettings?.seo?.metaDescription || 'Web3 beat marketplace connecting SA producers with global artists'
  const metaImage = ogImage || siteSettings?.seo?.ogImage
  
  // Ensure image URL is absolute
  const [imageUrl, setImageUrl] = useState('/og-image.jpg')
  
  useEffect(() => {
    if (metaImage) {
      // Use Sanity image URL builder for Sanity images
      setImageUrl(urlFor(metaImage).width(1200).height(630).url())
    } else if (typeof window !== 'undefined') {
      // Ensure absolute URL for default image
      const baseUrl = window.location.origin
      setImageUrl(`${baseUrl}/og-image.jpg`)
    }
  }, [metaImage])
  
  // Only use window.location in useEffect to avoid SSR issues
  const [currentUrl, setCurrentUrl] = useState('')
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])
  
  const canonical = canonicalUrl || 
    (siteSettings?.seo?.canonicalUrlBase && currentUrl ? 
      `${siteSettings.seo.canonicalUrlBase}${window.location.pathname}` : 
      currentUrl)
  
  // Structured data
  const pageStructuredData = structuredData || siteSettings?.seo?.structuredData
  
  // Keywords
  const metaKeywords = [...keywords, ...(siteSettings?.seo?.keywords || [])]
  
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Keywords */}
      {metaKeywords.length > 0 && (
        <meta name="keywords" content={metaKeywords.join(', ')} />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="BeatsChain" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@BeatsChain" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* No index if specified */}
      {noIndex && <meta name="robots" content="noindex" />}
      
      {/* Structured data */}
      {pageStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: typeof pageStructuredData === 'string' 
            ? pageStructuredData 
            : JSON.stringify(pageStructuredData) 
          }}
        />
      )}
    </Head>
  )
}