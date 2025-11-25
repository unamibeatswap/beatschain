import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'i01qs9p6'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'

// Skip Sanity entirely if not configured
const isConfigured = projectId && projectId !== 'your-project-id'

export const client = isConfigured ? createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
}) : null

const builder = client ? imageUrlBuilder(client) : null

export const urlFor = (source: any) => {
  if (!builder || !source?.asset) {
    return { url: () => '', width: () => ({ url: () => '' }), height: () => ({ url: () => '' }) }
  }
  try {
    return builder.image(source)
  } catch {
    return { url: () => '', width: () => ({ url: () => '' }), height: () => ({ url: () => '' }) }
  }
}

export async function getPageBySlug(slug: string): Promise<any> {
  if (!client) return null
  try {
    const data = await client.fetch(`*[_type == "page" && slug.current == $slug][0]`, { slug })
    return data || null
  } catch {
    return null
  }
}

export async function getSiteSettings() {
  if (!client) return null
  try {
    const data = await client.fetch(`*[_type == "siteSettings"][0]`)
    return data || null
  } catch {
    return null
  }
}