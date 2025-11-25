/**
 * Enhanced Sanity client with error handling
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Initialize the client with project details
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'i01qs9p6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN,
  useCdn: true, // Set to `false` for fresher data, `true` for better performance
})

// Initialize image URL builder
const builder = imageUrlBuilder(client)

/**
 * Helper function to generate image URLs
 */
export function urlFor(source: any) {
  return builder.image(source)
}

/**
 * Enhanced fetch function with error handling
 */
export async function fetchSanity(query: string, params = {}) {
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return null
  }
}

/**
 * Get site settings with error handling
 */
export async function getSiteSettings() {
  try {
    return await client.fetch(`*[_type == "siteSettings"][0]`)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Get navigation with error handling
 */
export async function getNavigation(isMain = true) {
  try {
    return await client.fetch(`
      *[_type == "navigation" && isMain == ${isMain}][0] {
        items[] {
          label,
          link,
          isExternal,
          requiresAuth,
          icon,
          children[] {
            label,
            link,
            isExternal,
            requiresAuth
          }
        }
      }
    `)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return { items: [] }
  }
}

/**
 * Get page by slug with error handling
 */
export async function getPageBySlug(slug: string) {
  try {
    return await client.fetch(`
      *[_type == "page" && slug.current == $slug][0]
    `, { slug })
  } catch (error) {
    console.error(`Error fetching page with slug "${slug}":`, error)
    return null
  }
}