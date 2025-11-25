/**
 * Seed Sanity with initial navigation data
 * 
 * Usage:
 * node scripts/seed-sanity-navigation.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

// Initialize Sanity client
const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
console.log('Token available:', !!token);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3tpr4tci',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: token, // Using token from .env.local
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
})

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
      requiresAuth: false,
      children: [
        {
          label: 'Latest Articles',
          link: '/blog',
          isExternal: false,
          requiresAuth: false
        },
        {
          label: 'What is BeatNFT?',
          link: '/blog/what-is-beatnft',
          isExternal: false,
          requiresAuth: false
        }
      ]
    },
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: '📊',
      isExternal: false,
      requiresAuth: true
    },
    {
      label: 'Creator Dashboard',
      link: '/creator-dashboard',
      icon: '🎨',
      isExternal: false,
      requiresAuth: true
    }
  ]
}

const footerNavigation = {
  _type: 'navigation',
  title: 'Footer Navigation',
  isMain: false,
  items: [
    {
      label: 'About',
      link: '/about',
      isExternal: false,
      requiresAuth: false
    },
    {
      label: 'Contact',
      link: '/contact',
      isExternal: false,
      requiresAuth: false
    },
    {
      label: 'Terms',
      link: '/terms',
      isExternal: false,
      requiresAuth: false
    },
    {
      label: 'Privacy',
      link: '/privacy',
      isExternal: false,
      requiresAuth: false
    },
    {
      label: 'FAQ',
      link: '/faq',
      isExternal: false,
      requiresAuth: false
    }
  ]
}

async function seedNavigation() {
  console.log('🧭 Seeding Sanity with initial navigation data...')
  try {
    // Check if main navigation already exists
    const existingMainNav = await client.fetch('*[_type == "navigation" && isMain == true][0]')
    
    if (!existingMainNav) {
      console.log('Creating main navigation...')
      await client.create(mainNavigation)
      console.log('Main navigation created successfully')
    } else {
      console.log('Main navigation already exists, skipping creation')
    }
    
    // Check if footer navigation already exists
    const existingFooterNav = await client.fetch('*[_type == "navigation" && title == "Footer Navigation"][0]')
    
    if (!existingFooterNav) {
      console.log('Creating footer navigation...')
      await client.create(footerNavigation)
      console.log('Footer navigation created successfully')
    } else {
      console.log('Footer navigation already exists, skipping creation')
    }
    
    console.log('✅ Navigation seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding navigation:', error)
  }
}

seedNavigation()