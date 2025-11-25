'use client'

import { client } from '@/lib/sanity'

export const defaultBeatCardStyle = {
  cardBackground: 'white',
  borderRadius: '0.5rem',
  borderColor: '#e5e7eb',
  shadowSize: 'sm',
  accentColor: '#3b82f6',
  defaultCoverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  coverImageHeight: '200px'
}

export const defaultProducerCardStyle = {
  cardBackground: 'white',
  borderRadius: '0.5rem',
  borderColor: '#e5e7eb',
  shadowSize: 'sm',
  accentColor: '#3b82f6',
  defaultCoverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  profileImageSize: '60px',
  verifiedBadgeColor: '#059669'
}

export const defaultPaginationStyle = {
  buttonStyle: 'rounded',
  activeColor: '#3b82f6',
  inactiveColor: 'white',
  textColor: '#374151',
  activeTextColor: 'white',
  borderColor: '#d1d5db',
  showPageInfo: true,
  showItemCount: true
}

export const defaultContactFormStyle = {
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

// Function to seed styles to Sanity when a valid token is available
export async function seedStylesToSanity() {
  if (!client) return false
  
  try {
    // Check if we have write access
    const canWrite = await client.fetch('*[_type == "sanity.imageAsset"][0]._id')
    if (!canWrite) return false
    
    // Create default beat card style
    const existingBeatCardStyle = await client.fetch('*[_type == "beatCardStyle" && isDefault == true][0]')
    
    if (!existingBeatCardStyle) {
      await client.create({
        _type: 'beatCardStyle',
        name: 'Default Beat Card',
        isDefault: true,
        ...defaultBeatCardStyle
      })
    }
    
    // Create default producer card style
    const existingProducerCardStyle = await client.fetch('*[_type == "producerCardStyle" && isDefault == true][0]')
    
    if (!existingProducerCardStyle) {
      await client.create({
        _type: 'producerCardStyle',
        name: 'Default Producer Card',
        isDefault: true,
        ...defaultProducerCardStyle
      })
    }
    
    // Create default pagination style
    const existingPaginationStyle = await client.fetch('*[_type == "paginationStyle" && isDefault == true][0]')
    
    if (!existingPaginationStyle) {
      await client.create({
        _type: 'paginationStyle',
        name: 'Default Pagination',
        isDefault: true,
        ...defaultPaginationStyle
      })
    }
    
    // Create default contact form style
    const existingContactFormStyle = await client.fetch('*[_type == "contactFormStyle" && isDefault == true][0]')
    
    if (!existingContactFormStyle) {
      await client.create({
        _type: 'contactFormStyle',
        name: 'Default Contact Form',
        isDefault: true,
        ...defaultContactFormStyle
      })
    }
    
    return true
  } catch (error) {
    console.error('Error seeding styles to Sanity:', error)
    return false
  }
}