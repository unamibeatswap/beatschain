import { SITE_URL } from '@/utils/site'
import { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/sanity'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Get site settings from Sanity
  const siteSettings = await getSiteSettings()
  
  // Use custom robots.txt content from Sanity if available
  if (siteSettings?.seo?.robotsTxt) {
    // Parse the custom robots.txt content
    const customRules: MetadataRoute.Robots['rules'][] = []
    const lines = siteSettings.seo.robotsTxt.split('\n')
    
    let currentUserAgent = '*'
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine || trimmedLine.startsWith('#')) continue
      
      if (trimmedLine.toLowerCase().startsWith('user-agent:')) {
        currentUserAgent = trimmedLine.split(':')[1].trim()
        customRules.push({
          userAgent: currentUserAgent,
          allow: []
        })
      } else if (trimmedLine.toLowerCase().startsWith('allow:')) {
        const path = trimmedLine.split(':')[1].trim()
        const lastRule = customRules[customRules.length - 1]
        if (lastRule && lastRule.userAgent === currentUserAgent) {
          if (Array.isArray(lastRule.allow)) {
            lastRule.allow.push(path)
          } else {
            lastRule.allow = [lastRule.allow, path].filter(Boolean)
          }
        }
      } else if (trimmedLine.toLowerCase().startsWith('disallow:')) {
        const path = trimmedLine.split(':')[1].trim()
        const lastRule = customRules[customRules.length - 1]
        if (lastRule && lastRule.userAgent === currentUserAgent) {
          lastRule.disallow = lastRule.disallow || []
          if (Array.isArray(lastRule.disallow)) {
            lastRule.disallow.push(path)
          } else {
            lastRule.disallow = [lastRule.disallow, path].filter(Boolean)
          }
        }
      }
    }
    
    if (customRules.length > 0) {
      return {
        rules: customRules,
        sitemap: `${SITE_URL}/sitemap.xml`,
      }
    }
  }
  
  // Default robots.txt if no custom content
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/studio/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
