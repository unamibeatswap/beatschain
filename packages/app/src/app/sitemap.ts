import { SITE_URL } from '@/utils/site'
import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts from Sanity
  const posts = client ? await client.fetch(`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) { slug, publishedAt }`) : []
  
  // Get all pages from Sanity
  const pages = client ? await client.fetch(`*[_type == "page" && defined(slug.current)] { slug, _updatedAt }`) : []
  
  // Create sitemap entries for blog posts
  const blogEntries = posts.map((post: any) => ({
    url: `${SITE_URL}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  // Create sitemap entries for pages
  const pageEntries = pages.map((page: any) => ({
    url: `${SITE_URL}/${page.slug.current === 'homepage' ? '' : page.slug.current}`,
    lastModified: new Date(page._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: page.slug.current === 'homepage' ? 1.0 : 0.5,
  }))
  
  // Combine with static routes
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/producers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/upload`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Add dynamic entries
    ...blogEntries,
    ...pageEntries,
  ]
}
