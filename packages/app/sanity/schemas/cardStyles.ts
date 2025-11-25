import { defineField, defineType } from 'sanity'

export const beatCardStyle = defineType({
  name: 'beatCardStyle',
  title: 'Beat Card Style',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Style Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Style',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'cardBackground',
      title: 'Card Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Light Gray', value: 'gray-50' },
          { title: 'Dark', value: 'gray-900' }
        ]
      },
      initialValue: 'white'
    }),
    defineField({
      name: 'borderRadius',
      title: 'Border Radius',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: '0' },
          { title: 'Small', value: '0.375rem' },
          { title: 'Medium', value: '0.5rem' },
          { title: 'Large', value: '0.75rem' },
          { title: 'Extra Large', value: '1rem' }
        ]
      },
      initialValue: '0.5rem'
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'string',
      initialValue: '#e5e7eb'
    }),
    defineField({
      name: 'shadowSize',
      title: 'Shadow Size',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' }
        ]
      },
      initialValue: 'sm'
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      initialValue: '#3b82f6'
    }),
    defineField({
      name: 'defaultCoverGradient',
      title: 'Default Cover Gradient',
      description: 'Gradient for beats without cover images',
      type: 'string',
      initialValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }),
    defineField({
      name: 'coverImageHeight',
      title: 'Cover Image Height',
      type: 'string',
      initialValue: '200px'
    })
  ]
})

export const producerCardStyle = defineType({
  name: 'producerCardStyle',
  title: 'Producer Card Style',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Style Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Style',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'cardBackground',
      title: 'Card Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Light Gray', value: 'gray-50' },
          { title: 'Dark', value: 'gray-900' }
        ]
      },
      initialValue: 'white'
    }),
    defineField({
      name: 'borderRadius',
      title: 'Border Radius',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: '0' },
          { title: 'Small', value: '0.375rem' },
          { title: 'Medium', value: '0.5rem' },
          { title: 'Large', value: '0.75rem' },
          { title: 'Extra Large', value: '1rem' }
        ]
      },
      initialValue: '0.5rem'
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'string',
      initialValue: '#e5e7eb'
    }),
    defineField({
      name: 'shadowSize',
      title: 'Shadow Size',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' }
        ]
      },
      initialValue: 'sm'
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      initialValue: '#3b82f6'
    }),
    defineField({
      name: 'defaultCoverGradient',
      title: 'Default Cover Gradient',
      description: 'Gradient for producers without profile images',
      type: 'string',
      initialValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }),
    defineField({
      name: 'profileImageSize',
      title: 'Profile Image Size',
      type: 'string',
      initialValue: '60px'
    }),
    defineField({
      name: 'verifiedBadgeColor',
      title: 'Verified Badge Color',
      type: 'string',
      initialValue: '#059669'
    })
  ]
})