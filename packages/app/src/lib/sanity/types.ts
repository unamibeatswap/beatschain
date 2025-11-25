export interface CmsHeroSection {
  headline: string
  subheadline?: string
  backgroundImage?: SanityImage
  style: 'gradient' | 'image' | 'video' | 'split' | 'minimal'
  ctaButtons?: CTAButton[]
  badges?: string[]
}

export interface CTAButton {
  text: string
  url: string
  style: 'primary' | 'secondary'
}

export interface CmsContentBlock {
  type: 'features' | 'stats' | 'testimonials' | 'faq' | 'cta' | 'text' | 'web3Stats' | 'paginatedList' | 'interactiveForm' | 'mediaGallery' | 'dynamicTable'
  title?: string
  items?: ContentItem[]
  backgroundColor?: string
  layout?: 'grid' | 'row'
}

export interface ContentItem {
  title?: string
  description?: string
  icon?: string
  value?: string
}

export interface CmsPageData {
  title: string
  heroSection?: CmsHeroSection
  contentBlocks?: CmsContentBlock[]
  seo?: SEOData
}

export interface SEOData {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  structuredData?: any
  canonicalUrl?: string
  noIndex?: boolean
  keywords?: string[]
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string }
  alt?: string
}

export interface FooterSettings {
  companyInfo?: string
  address?: string
  navigationGroups?: FooterNavigationGroup[]
  legalText?: string
  socialLinks?: SocialLink[]
}

export interface FooterNavigationGroup {
  title: string
  links: FooterLink[]
}

export interface FooterLink {
  label: string
  url: string
}

export interface SocialLink {
  platform: string
  url: string
}