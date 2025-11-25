const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '3tpr4tci',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const homepageData = {
  _type: 'page',
  title: 'Homepage',
  slug: {
    _type: 'slug',
    current: 'homepage'
  },
  heroSection: {
    _type: 'heroSection',
    headline: 'The Future of Music\nBeats NFTs',
    subheadline: 'Discover, buy, and sell beats as NFTs. Own your beats, earn royalties forever.',
    style: 'gradient',
    ctaButtons: [
      {
        text: '🎵 Explore Beats',
        url: '/marketplace',
        style: 'primary'
      },
      {
        text: '🚀 Start Selling',
        url: '/dashboard',
        style: 'secondary'
      }
    ],
    badges: [
      '🚀 24/7 Support',
      '🌍 Global Platform',
      '🔒 Secure Blockchain'
    ]
  },
  contentBlocks: [
    {
      _type: 'contentBlock',
      type: 'features',
      title: 'Why Choose BeatsChain?',
      backgroundColor: 'white',
      items: [
        {
          title: 'True Ownership',
          description: 'Own your beats as NFTs with blockchain-verified ownership and provenance',
          icon: '🔒'
        },
        {
          title: 'Automatic Royalties',
          description: 'Earn royalties forever with smart contracts that pay you on every resale',
          icon: '💰'
        },
        {
          title: 'Instant Payments',
          description: 'Get paid instantly with cryptocurrency - no waiting for payment processors',
          icon: '⚡'
        }
      ]
    },
    {
      _type: 'contentBlock',
      type: 'cta',
      title: 'Ready to Revolutionize Your Beats?',
      backgroundColor: 'yellow',
      items: [
        {
          title: '🎵 Explore Marketplace',
          value: '/marketplace'
        },
        {
          title: '🚀 Start Creating',
          value: '/dashboard'
        }
      ]
    }
  ],
  seo: {
    metaTitle: 'BeatsChain - Blockchain Beat Marketplace',
    metaDescription: 'Where South African beats meet global blockchain - connecting SA producers with international artists through crypto-powered music ownership.',
  }
}

const guidePageData = {
  _type: 'page',
  title: 'Guide',
  slug: {
    _type: 'slug',
    current: 'guide'
  },
  heroSection: {
    _type: 'heroSection',
    headline: '📚 BeatsChain Guide',
    subheadline: 'Everything you need to know about Web3 beat ownership and trading',
    style: 'gradient',
    ctaButtons: [
      {
        text: '🎵 Upload Beat',
        url: '/upload',
        style: 'primary'
      },
      {
        text: '🎧 Browse Beats',
        url: '/beatnfts',
        style: 'secondary'
      }
    ]
  },
  seo: {
    metaTitle: 'BeatsChain Guide - Web3 Beat Trading',
    metaDescription: 'Complete guide to using BeatsChain for beat producers and buyers. Learn about NFT ownership, credits, and Web3 music trading.',
  }
}

const contactPageData = {
  _type: 'page',
  title: 'Contact',
  slug: {
    _type: 'slug',
    current: 'contact'
  },
  heroSection: {
    _type: 'heroSection',
    headline: '📞 Contact BeatsChain',
    subheadline: 'Get in touch with our team for support, partnerships, or general inquiries',
    style: 'gradient',
    badges: [
      '🚀 24/7 Support',
      '🌍 Global Team',
      '🔒 Secure Platform'
    ]
  },
  seo: {
    metaTitle: 'Contact BeatsChain - Support & Partnerships',
    metaDescription: 'Get in touch with BeatsChain for support, partnerships, or general inquiries. 24/7 support available.',
  }
}

async function seedSanity() {
  try {
    console.log('Seeding Sanity with initial page content...')
    
    // Create homepage
    const homepage = await client.create(homepageData)
    console.log('✅ Homepage created:', homepage._id)
    
    // Create guide page
    const guidePage = await client.create(guidePageData)
    console.log('✅ Guide page created:', guidePage._id)
    
    // Create contact page
    const contactPage = await client.create(contactPageData)
    console.log('✅ Contact page created:', contactPage._id)
    
    console.log('🎉 Sanity seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding Sanity:', error)
  }
}

seedSanity()