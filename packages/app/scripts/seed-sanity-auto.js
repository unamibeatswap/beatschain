/**
 * Automatically seed all Sanity data (navigation, styles, and site settings)
 * 
 * Usage:
 * node scripts/seed-sanity-auto.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

// Initialize Sanity client
const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN
console.log('Token available:', !!token)

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3tpr4tci',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: token,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
})

// Navigation data
const mainNavigation = {
  _type: 'navigation',
  title: 'Main Navigation',
  isMain: true,
  items: [
    {
      label: 'BeatNFTs',
      link: '/beatnfts',
      icon: '🎫',
      isExternal: false,
      requiresAuth: false
    },
    {
      label: 'Producers',
      link: '/producers',
      icon: '👨‍🎤',
      isExternal: false,
      requiresAuth: false
    },
    {
      label: 'Blog',
      link: '/blog',
      icon: '📝',
      isExternal: false,
      requiresAuth: false
    },
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: '📊',
      isExternal: false,
      requiresAuth: true
    }
  ]
}

// Style data
const beatCardStyle = {
  _type: 'beatCardStyle',
  name: 'Default Beat Card',
  isDefault: true,
  cardBackground: 'white',
  borderRadius: '0.5rem',
  borderColor: '#e5e7eb',
  shadowSize: 'sm',
  accentColor: '#3b82f6',
  defaultCoverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  coverImageHeight: '200px'
}

const producerCardStyle = {
  _type: 'producerCardStyle',
  name: 'Default Producer Card',
  isDefault: true,
  cardBackground: 'white',
  borderRadius: '0.5rem',
  borderColor: '#e5e7eb',
  shadowSize: 'sm',
  accentColor: '#3b82f6',
  defaultCoverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  profileImageSize: '60px',
  verifiedBadgeColor: '#059669'
}

const paginationStyle = {
  _type: 'paginationStyle',
  name: 'Default Pagination',
  isDefault: true,
  buttonStyle: 'rounded',
  activeColor: '#3b82f6',
  inactiveColor: 'white',
  textColor: '#374151',
  activeTextColor: 'white',
  borderColor: '#d1d5db',
  showPageInfo: true,
  showItemCount: true
}

const contactFormStyle = {
  _type: 'contactFormStyle',
  name: 'Default Contact Form',
  isDefault: true,
  backgroundColor: 'white',
  accentColor: '#3b82f6',
  borderRadius: '0.5rem',
  submitButtonText: 'Send Message',
  successMessage: 'Thank you! Your message has been sent successfully.',
  errorMessage: 'Sorry, there was an error sending your message. Please try again.',
  fields: [
    { 
      name: 'name', 
      label: 'Your Name', 
      type: 'text', 
      required: true, 
      placeholder: 'Enter your name' 
    },
    { 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      required: true, 
      placeholder: 'Enter your email' 
    },
    { 
      name: 'subject', 
      label: 'Subject', 
      type: 'select', 
      required: true,
      options: [
        'Producer Support',
        'Buyer Support',
        'Technical Issue',
        'Partnership Inquiry',
        'Media & Press',
        'General Inquiry'
      ]
    },
    { 
      name: 'message', 
      label: 'Message', 
      type: 'textarea', 
      required: true, 
      placeholder: 'Enter your message' 
    }
  ]
}

// Site settings
const siteSettings = {
  _type: 'siteSettings',
  title: 'BeatsChain',
  description: 'Web3 beat marketplace connecting SA producers with global artists',
  platformSettings: {
    platformFee: 15,
    maxUploadSize: 50,
    allowedFileTypes: ['mp3', 'wav', 'flac'],
    featuredGenres: ['Hip Hop', 'Trap', 'Amapiano', 'Afrobeats', 'House'],
    minimumPrice: 0.001,
    maximumPrice: 10.0,
    defaultRoyalty: 5
  },
  maintenanceMode: false,
  registrationOpen: true,
  seo: {
    metaTitle: 'BeatsChain - Web3 Beat Marketplace',
    metaDescription: 'Web3 beat marketplace where SA producers sell beats as NFTs. Buy beats with crypto, own them forever, earn automatic royalties.',
    keywords: ['beats', 'beatnft', 'web3 beats', 'nft beats', 'crypto beats', 'beat marketplace', 'south africa producers']
  }
}

// Demo page
const demoPage = {
  _type: 'page',
  title: 'Demo Page',
  slug: {
    _type: 'slug',
    current: 'demo'
  },
  content: [
    {
      _type: 'block',
      _key: 'intro',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'intro-span',
          text: 'This is a demo page created by the auto-seeding script.',
          marks: []
        }
      ]
    }
  ]
}

async function seedData() {
  console.log('🌱 Starting auto-seeding of Sanity data...')
  
  try {
    // Seed navigation
    const existingMainNav = await client.fetch('*[_type == "navigation" && isMain == true][0]')
    if (!existingMainNav) {
      console.log('Creating main navigation...')
      await client.create(mainNavigation)
      console.log('✅ Main navigation created')
    } else {
      console.log('⏩ Main navigation already exists, skipping')
    }
    
    // Seed styles
    const existingBeatCardStyle = await client.fetch('*[_type == "beatCardStyle" && isDefault == true][0]')
    if (!existingBeatCardStyle) {
      console.log('Creating beat card style...')
      await client.create(beatCardStyle)
      console.log('✅ Beat card style created')
    } else {
      console.log('⏩ Beat card style already exists, skipping')
    }
    
    const existingProducerCardStyle = await client.fetch('*[_type == "producerCardStyle" && isDefault == true][0]')
    if (!existingProducerCardStyle) {
      console.log('Creating producer card style...')
      await client.create(producerCardStyle)
      console.log('✅ Producer card style created')
    } else {
      console.log('⏩ Producer card style already exists, skipping')
    }
    
    const existingPaginationStyle = await client.fetch('*[_type == "paginationStyle" && isDefault == true][0]')
    if (!existingPaginationStyle) {
      console.log('Creating pagination style...')
      await client.create(paginationStyle)
      console.log('✅ Pagination style created')
    } else {
      console.log('⏩ Pagination style already exists, skipping')
    }
    
    const existingContactFormStyle = await client.fetch('*[_type == "contactFormStyle" && isDefault == true][0]')
    if (!existingContactFormStyle) {
      console.log('Creating contact form style...')
      await client.create(contactFormStyle)
      console.log('✅ Contact form style created')
    } else {
      console.log('⏩ Contact form style already exists, skipping')
    }
    
    // Seed site settings
    const existingSiteSettings = await client.fetch('*[_type == "siteSettings"][0]')
    if (!existingSiteSettings) {
      console.log('Creating site settings...')
      await client.create(siteSettings)
      console.log('✅ Site settings created')
    } else {
      console.log('⏩ Site settings already exist, skipping')
    }
    
    // Seed demo page
    const existingDemoPage = await client.fetch('*[_type == "page" && slug.current == "demo"][0]')
    if (!existingDemoPage) {
      console.log('Creating demo page...')
      await client.create(demoPage)
      console.log('✅ Demo page created')
    } else {
      console.log('⏩ Demo page already exists, skipping')
    }
    
    console.log('🎉 All Sanity data seeded successfully!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

seedData()