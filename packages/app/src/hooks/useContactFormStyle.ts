'use client'

import { useState, useEffect } from 'react'
import { client } from '@/lib/sanity'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface ContactFormStyle {
  backgroundColor: string
  accentColor: string
  borderRadius: string
  submitButtonText: string
  successMessage: string
  errorMessage: string
  fields: FormField[]
}

const DEFAULT_STYLE: ContactFormStyle = {
  backgroundColor: 'white',
  accentColor: '#3b82f6',
  borderRadius: '0.5rem',
  submitButtonText: 'Send Message',
  successMessage: 'Thank you! Your message has been sent successfully.',
  errorMessage: 'Sorry, there was an error sending your message. Please try again.',
  fields: [
    { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Enter your name' },
    { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
    { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Enter your message' }
  ]
}

export function useContactFormStyle() {
  const [style, setStyle] = useState<ContactFormStyle>(DEFAULT_STYLE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStyle() {
      try {
        if (!client) return

        const formStyle = await client.fetch(`
          *[_type == "contactFormStyle" && isDefault == true][0]
        `)

        if (formStyle) {
          const fields = formStyle.fields?.map((field: any) => ({
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required ?? true,
            placeholder: field.placeholder || '',
            options: field.options || []
          })) || DEFAULT_STYLE.fields

          setStyle({
            backgroundColor: formStyle.backgroundColor || DEFAULT_STYLE.backgroundColor,
            accentColor: formStyle.accentColor || DEFAULT_STYLE.accentColor,
            borderRadius: formStyle.borderRadius || DEFAULT_STYLE.borderRadius,
            submitButtonText: formStyle.submitButtonText || DEFAULT_STYLE.submitButtonText,
            successMessage: formStyle.successMessage || DEFAULT_STYLE.successMessage,
            errorMessage: formStyle.errorMessage || DEFAULT_STYLE.errorMessage,
            fields
          })
        }
      } catch (error) {
        console.error('Error loading contact form style:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStyle()
  }, [])

  return {
    style,
    loading
  }
}