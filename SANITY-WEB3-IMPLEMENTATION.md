# SANITY-WEB3 IMPLEMENTATION PLAN

## Core Principles

1. **Clear Separation of Concerns**:
   - **Sanity CMS**: Static content, SEO metadata, marketing pages, blog posts, images
   - **Web3/Firebase**: Dynamic data, user accounts, transactions, beat NFTs, analytics

2. **Zero Breaking Changes**:
   - All Web3 functionality remains intact
   - Sanity enhances without replacing core functionality

## Enterprise SEO Implementation

### 1. Enhanced SEO Schema in Sanity

```typescript
// Update sanity/schemas/siteSettings.ts
export const siteSettings = defineType({
  // Existing fields...
  fields: [
    // Existing fields...
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60).warning('Optimal length is under 60 characters')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160).warning('Optimal length is under 160 characters')
        }),
        defineField({
          name: 'ogImage',
          title: 'Default Open Graph Image',
          description: 'Used for social sharing (1200×630px recommended)',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            }
          ]
        }),
        defineField({
          name: 'favicon',
          title: 'Favicon',
          description: 'Square image (512×512px recommended)',
          type: 'image'
        }),
        defineField({
          name: 'touchIcon',
          title: 'Apple Touch Icon',
          description: 'Square image (180×180px recommended)',
          type: 'image'
        }),
        defineField({
          name: 'structuredData',
          title: 'Global Structured Data',
          description: 'JSON-LD for organization/website',
          type: 'code',
          options: {
            language: 'json'
          }
        }),
        defineField({
          name: 'canonicalUrlBase',
          title: 'Canonical URL Base',
          description: 'e.g., https://www.beatschain.app',
          type: 'url'
        }),
        defineField({
          name: 'robotsTxt',
          title: 'Robots.txt Content',
          type: 'text',
          rows: 5
        })
      ]
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      description: 'Primary logo (SVG or PNG, 240×80px recommended)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        }
      ]
    }),
    defineField({
      name: 'logoMobile',
      title: 'Mobile Logo',
      description: 'Compact logo for mobile (SVG or PNG, 40×40px recommended)',
      type: 'image',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'logoDark',
      title: 'Dark Mode Logo',
      description: 'Logo for dark backgrounds (SVG or PNG, 240×80px recommended)',
      type: 'image',
      options: {
        hotspot: true,
      }
    })
  ]
})

// Update sanity/schemas/page.ts
export const page = defineType({
  // Existing fields...
  fields: [
    // Existing fields...
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60).warning('Optimal length is under 60 characters')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160).warning('Optimal length is under 160 characters')
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          description: 'Used for social sharing (1200×630px recommended)',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }
          ]
        }),
        defineField({
          name: 'noIndex',
          title: 'No Index',
          description: 'Hide this page from search engines',
          type: 'boolean',
          initialValue: false
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          description: 'Set a specific canonical URL if different from the page URL',
          type: 'url'
        }),
        defineField({
          name: 'structuredData',
          title: 'Structured Data',
          description: 'Page-specific JSON-LD',
          type: 'code',
          options: {
            language: 'json'
          }
        })
      ]
    })
  ]
})

// Update sanity/schemas/post.ts
export const post = defineType({
  // Existing fields...
  fields: [
    // Existing fields...
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60).warning('Optimal length is under 60 characters')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160).warning('Optimal length is under 160 characters')
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          description: 'Used for social sharing (1200×630px recommended)',
          type: 'image',
          options: {
            hotspot: true,
          }
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          }
        })
      ]
    })
  ]
})
```

### 2. SEO Component Implementation

```typescript
// Create src/components/SEO.tsx
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
}

export default function SEO({
  title,
  description,
  ogImage,
  noIndex = false,
  canonicalUrl,
  structuredData,
  siteSettings
}: SEOProps) {
  // Use site settings as fallback
  const metaTitle = title || siteSettings?.seo?.metaTitle || 'BeatsChain'
  const metaDescription = description || siteSettings?.seo?.metaDescription || 'Web3 beat marketplace connecting SA producers with global artists'
  const metaImage = ogImage || siteSettings?.seo?.ogImage
  const imageUrl = metaImage ? urlFor(metaImage).width(1200).height(630).url() : '/og-image.jpg'
  const canonical = canonicalUrl || (siteSettings?.seo?.canonicalUrlBase ? `${siteSettings.seo.canonicalUrlBase}${window.location.pathname}` : null)
  
  // Structured data
  const pageStructuredData = structuredData || siteSettings?.seo?.structuredData
  
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* No index if specified */}
      {noIndex && <meta name="robots" content="noindex" />}
      
      {/* Structured data */}
      {pageStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
        />
      )}
    </Head>
  )
}
```

### 3. Logo & Favicon Implementation

```typescript
// Update src/app/layout.tsx
import { getSiteSettings, urlFor } from '@/lib/sanity'

export default async function RootLayout(props: PropsWithChildren) {
  // Get site settings from Sanity
  const siteSettings = await getSiteSettings()
  
  // Get favicon and touch icon URLs
  const faviconUrl = siteSettings?.seo?.favicon 
    ? urlFor(siteSettings.seo.favicon).width(32).height(32).url() 
    : '/favicon.ico'
  
  const touchIconUrl = siteSettings?.seo?.touchIcon 
    ? urlFor(siteSettings.seo.touchIcon).width(180).height(180).url() 
    : '/favicon.svg'

  return (
    <html lang='en'>
      <head>
        <link rel='icon' href={faviconUrl} type='image/x-icon' />
        <link rel='apple-touch-icon' sizes='180x180' href={touchIconUrl} />
        {/* Rest of head content */}
      </head>
      <body>
        {/* Body content */}
      </body>
    </html>
  )
}

// Update src/components/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import { getSiteSettings, urlFor } from '@/lib/sanity'
import { LinkComponent } from './LinkComponent'

export function Header() {
  const [logo, setLogo] = useState<any>(null)
  const [logoMobile, setLogoMobile] = useState<any>(null)
  
  useEffect(() => {
    async function loadLogo() {
      const settings = await getSiteSettings()
      if (settings?.logo) setLogo(settings.logo)
      if (settings?.logoMobile) setLogoMobile(settings.logoMobile)
    }
    loadLogo()
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <LinkComponent href="/">
          {logo ? (
            <>
              <img 
                src={urlFor(logo).width(240).height(80).url()} 
                alt={logo.alt || "BeatsChain"} 
                className="h-8 hidden sm:block" 
              />
              <img 
                src={logoMobile ? urlFor(logoMobile).width(40).height(40).url() : urlFor(logo).width(40).height(40).url()} 
                alt={logo.alt || "BeatsChain"} 
                className="h-8 sm:hidden" 
              />
            </>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">BeatsChain</h1>
          )}
        </LinkComponent>
        
        {/* Rest of header */}
      </div>
    </header>
  )
}
```

### 4. Dynamic Metadata for Pages and Blog Posts

```typescript
// Update src/app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { client, urlFor } from '@/lib/sanity'
import { getSiteSettings } from '@/lib/sanity'

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: params.slug })
  const siteSettings = await getSiteSettings()
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }
  
  // Use post SEO fields or fallback to post content
  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || `Read ${post.title} on BeatsChain`
  
  // Get image URL
  const imageUrl = post.seo?.ogImage 
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post.mainImage 
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : siteSettings?.seo?.ogImage 
        ? urlFor(siteSettings.seo.ogImage).width(1200).height(630).url()
        : '/og-image.jpg'
  
  return {
    title: `${title} | BeatsChain Blog`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: imageUrl }]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl]
    },
    keywords: post.seo?.keywords || []
  }
}

// Rest of the page component
```

### 5. Robots.txt and Sitemap Integration

```typescript
// Update src/app/robots.ts
import { getSiteSettings } from '@/lib/sanity'

export async function GET(request: Request) {
  const siteSettings = await getSiteSettings()
  
  // Use custom robots.txt content from Sanity if available
  const customRobotsTxt = siteSettings?.seo?.robotsTxt
  
  const content = customRobotsTxt || `
User-agent: *
Allow: /

# Disallow admin and studio routes
Disallow: /admin/
Disallow: /studio/

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.beatschain.app'}/sitemap.xml
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

// Update src/app/sitemap.ts
import { client } from '@/lib/sanity'

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.beatschain.app'
  
  // Get all blog posts
  const posts = await client.fetch(`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) { slug }`);
  
  // Get all pages
  const pages = await client.fetch(`*[_type == "page" && defined(slug.current)] { slug }`);
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/browse</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug.current}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  `).join('')}
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}/${page.slug.current}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  `).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
```

## Web3 Stats Integration

### 1. Keep Web3 Stats Separate from Sanity

```typescript
// Create src/components/StatsDisplay.tsx
'use client'

import { usePlatformStats } from '@/hooks/usePlatformStats'

interface StatsDisplayProps {
  layout?: 'grid' | 'row'
  showLabels?: boolean
  theme?: 'light' | 'dark'
}

export default function StatsDisplay({ 
  layout = 'grid', 
  showLabels = true,
  theme = 'light' 
}: StatsDisplayProps) {
  const { totalBeats, totalUsers, totalRevenue, isLoading } = usePlatformStats()
  
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const accentColor = theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'
  
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-sm`}>
      <div className={`${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'flex flex-wrap justify-around'}`}>
        <div className="text-center">
          <div className={`text-3xl font-bold ${accentColor}`}>
            {isLoading ? '...' : totalBeats}
          </div>
          {showLabels && <div className={`text-sm ${textColor} opacity-80`}>Beats Available</div>}
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${accentColor}`}>
            {isLoading ? '...' : totalUsers}
          </div>
          {showLabels && <div className={`text-sm ${textColor} opacity-80`}>Registered Users</div>}
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${accentColor}`}>
            R{isLoading ? '...' : totalRevenue.toFixed(0)}
          </div>
          {showLabels && <div className={`text-sm ${textColor} opacity-80`}>Total Revenue</div>}
        </div>
      </div>
    </div>
  )
}
```

### 2. Integrate Web3 Stats with Sanity Content

```typescript
// Update src/components/ContentBlocks.tsx
'use client'

import { urlFor } from '@/lib/sanity'
import type { CmsContentBlock } from '@/lib/sanity/types'
import StatsDisplay from './StatsDisplay'

interface ContentBlocksProps {
  blocks: CmsContentBlock[]
}

export default function CmsContentBlocks({ blocks }: ContentBlocksProps) {
  // Existing code...
  
  return (
    <div>
      {blocks.map((block, index) => {
        if (!block || !block.type) return null
        return (
          <div key={index} style={{ background: getBackgroundColor(block.backgroundColor), padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              
              {/* Existing blocks... */}
              
              {/* Web3 Stats Block */}
              {block.type === 'web3Stats' && (
                <div>
                  {block.title && (
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                        {block.title}
                      </h2>
                    </div>
                  )}
                  <StatsDisplay 
                    layout={block.layout || 'grid'} 
                    theme={block.backgroundColor === 'dark' ? 'dark' : 'light'}
                  />
                </div>
              )}
              
              {/* Rest of the blocks... */}
            </div>
          </div>
        )
      }).filter(Boolean)}
    </div>
  )
}

// Add to sanity/schemas/contentBlock.ts
defineField({
  name: 'type',
  title: 'Block Type',
  type: 'string',
  options: {
    list: [
      // Existing options...
      { title: 'Web3 Stats', value: 'web3Stats' }
    ]
  }
}),
defineField({
  name: 'layout',
  title: 'Layout',
  type: 'string',
  options: {
    list: [
      { title: 'Grid', value: 'grid' },
      { title: 'Row', value: 'row' }
    ]
  },
  hidden: ({ parent }) => parent?.type !== 'web3Stats'
})
```

## Platform Fee Consistency

```typescript
// Update useSiteSettings.ts
export function useSiteSettings() {
  // Existing code...
  
  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      // First try to load from Sanity
      const sanitySiteSettings = await getSiteSettings()
      
      // Then load from localStorage
      const stored = localStorage.getItem('site_settings')
      let localSettings = {}
      if (stored) {
        localSettings = JSON.parse(stored)
      }
      
      // Merge settings with priority to local settings
      // IMPORTANT: Always enforce 15% platform fee to match smart contract
      const mergedSettings = { 
        ...DEFAULT_SETTINGS, 
        ...sanitySiteSettings, 
        ...localSettings,
        platformFee: 15 // Always enforce 15% to match contract
      }
      
      setSettings(mergedSettings)
    } catch (err) {
      console.error('Failed to load site settings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Rest of the hook...
}
```

## Implementation Plan

### Phase 1: SEO Schema Enhancement (1-2 days)
1. Update Sanity schemas with enhanced SEO fields
2. Add image size recommendations to schemas
3. Create SEO component for consistent metadata

### Phase 2: Logo & Favicon Implementation (1 day)
1. Update Header component to use Sanity logo
2. Implement responsive logos (desktop/mobile)
3. Update layout to use Sanity favicon and touch icons

### Phase 3: Web3 Stats Integration (1 day)
1. Create StatsDisplay component for Web3 data
2. Add web3Stats content block type to Sanity
3. Ensure stats are always pulled from Web3/Firebase

### Phase 4: Platform Fee Consistency (0.5 day)
1. Update all references to platform fee to 15%
2. Enforce 15% in settings regardless of Sanity value

### Phase 5: Testing & Deployment (1-2 days)
1. Test all SEO features
2. Verify logo and favicon display
3. Confirm Web3 stats display correctly
4. Ensure platform fee is consistent

## Testing Checklist

- [ ] Upload logo in Sanity and verify display in header
- [ ] Test responsive logo on mobile devices
- [ ] Upload favicon and verify browser tab display
- [ ] Create page with SEO metadata and verify meta tags
- [ ] Test Open Graph tags with Facebook/Twitter debuggers
- [ ] Verify Web3 stats display correctly in content blocks
- [ ] Confirm platform fee shows as 15% throughout the app
- [ ] Test robots.txt and sitemap generation

## Conclusion

This implementation plan provides a focused approach to enhancing BeatsChain with enterprise SEO features while maintaining a clear separation between Sanity CMS (static content) and Web3 functionality (dynamic data). The plan addresses the specific issues with logo display and platform fee consistency while adding robust SEO capabilities that will improve search visibility and social sharing.

By implementing these changes, BeatsChain will benefit from:
- Professional SEO management with proper metadata
- Consistent branding with properly sized logos and favicons
- Clear separation between CMS content and Web3 functionality
- Accurate platform fee display matching the smart contract (15%)