/**
 * Seed Sanity with initial styles for cards, pagination, and contact form
 * 
 * Usage:
 * node scripts/seed-sanity-styles.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

// Initialize Sanity client
const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
console.log('Token available:', !!token);
console.log('Token length:', token?.length);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3tpr4tci',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: token, // Using token from .env.local
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
})

async function seedStyles() {
  console.log('🎨 Seeding Sanity with initial styles...')
  
  try {
    // Create default beat card style
    const existingBeatCardStyle = await client.fetch('*[_type == "beatCardStyle" && isDefault == true][0]')
    
    if (!existingBeatCardStyle) {
      console.log('Creating default beat card style...')
      await client.create({
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
      })
    }
    
    // Create default producer card style
    const existingProducerCardStyle = await client.fetch('*[_type == "producerCardStyle" && isDefault == true][0]')
    
    if (!existingProducerCardStyle) {
      console.log('Creating default producer card style...')
      await client.create({
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
      })
    }
    
    // Create default pagination style
    const existingPaginationStyle = await client.fetch('*[_type == "paginationStyle" && isDefault == true][0]')
    
    if (!existingPaginationStyle) {
      console.log('Creating default pagination style...')
      await client.create({
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
      })
    }
    
    // Create default contact form style
    const existingContactFormStyle = await client.fetch('*[_type == "contactFormStyle" && isDefault == true][0]')
    
    if (!existingContactFormStyle) {
      console.log('Creating default contact form style...')
      await client.create({
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
      })
    }
    
    console.log('✅ Styles seeded successfully!')
  } catch (error) {
    console.error('Error seeding styles:', error)
  }
}

seedStyles()