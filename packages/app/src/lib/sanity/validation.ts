import { z } from 'zod'

export const heroSectionSchema = z.object({
  headline: z.string().min(1).max(100),
  subheadline: z.string().max(200).optional(),
  style: z.enum(['gradient', 'image', 'video', 'split', 'minimal']),
  ctaButtons: z.array(z.object({
    text: z.string().min(1).max(50),
    url: z.string().url(),
    style: z.enum(['primary', 'secondary'])
  })).max(3).optional(),
  badges: z.array(z.string().max(50)).max(5).optional()
})

export const contentBlockSchema = z.object({
  type: z.enum(['features', 'stats', 'testimonials', 'faq', 'cta', 'text']),
  title: z.string().max(100).optional(),
  items: z.array(z.object({
    title: z.string().max(100).optional(),
    description: z.string().max(500).optional(),
    icon: z.string().max(10).optional(),
    value: z.string().max(100).optional()
  })).optional(),
  backgroundColor: z.string().optional()
})

export const pageDataSchema = z.object({
  title: z.string().min(1).max(100),
  heroSection: heroSectionSchema.optional(),
  contentBlocks: z.array(contentBlockSchema).optional(),
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional()
  }).optional()
})

export function validatePageData(data: unknown) {
  try {
    return pageDataSchema.parse(data)
  } catch (error) {
    console.error('Content validation failed:', error)
    return null
  }
}