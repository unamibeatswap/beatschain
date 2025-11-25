'use client'

import { useState } from 'react'

interface InteractiveFormProps {
  data: {
    formType: 'contact' | 'newsletter' | 'upload'
    fields: Array<{
      name: string
      type: string
      required: boolean
    }>
  }
}

export default function InteractiveForm({ data }: InteractiveFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch(`/api/forms/${data.formType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Form submitted successfully!')
        setFormData({})
      }
    } catch (error) {
      alert('Error submitting form')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        {data.fields.map((field) => (
          <div key={field.name}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }}>
              {field.name} {field.required && '*'}
            </label>
            <input
              type={field.type}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
            />
          </div>
        ))}
        
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: submitting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: '600',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}