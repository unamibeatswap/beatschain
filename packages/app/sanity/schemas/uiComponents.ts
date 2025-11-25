import { defineField, defineType } from 'sanity'

export const paginationStyle = defineType({
  name: 'paginationStyle',
  title: 'Pagination Style',
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
      name: 'buttonStyle',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Rounded', value: 'rounded' },
          { title: 'Square', value: 'square' },
          { title: 'Pill', value: 'pill' }
        ]
      },
      initialValue: 'rounded'
    }),
    defineField({
      name: 'activeColor',
      title: 'Active Button Color',
      type: 'string',
      initialValue: '#3b82f6'
    }),
    defineField({
      name: 'inactiveColor',
      title: 'Inactive Button Color',
      type: 'string',
      initialValue: 'white'
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      initialValue: '#374151'
    }),
    defineField({
      name: 'activeTextColor',
      title: 'Active Text Color',
      type: 'string',
      initialValue: 'white'
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'string',
      initialValue: '#d1d5db'
    }),
    defineField({
      name: 'showPageInfo',
      title: 'Show Page Info',
      description: 'Show "Page X of Y" text',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'showItemCount',
      title: 'Show Item Count',
      description: 'Show "Showing X to Y of Z items" text',
      type: 'boolean',
      initialValue: true
    })
  ]
})

export const contactFormStyle = defineType({
  name: 'contactFormStyle',
  title: 'Contact Form Style',
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
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: 'white'
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      initialValue: '#3b82f6'
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
          { title: 'Large', value: '0.75rem' }
        ]
      },
      initialValue: '0.5rem'
    }),
    defineField({
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'Send Message'
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      initialValue: 'Thank you! Your message has been sent successfully.'
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error Message',
      type: 'string',
      initialValue: 'Sorry, there was an error sending your message. Please try again.'
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'name',
            title: 'Field Name',
            type: 'string',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'label',
            title: 'Field Label',
            type: 'string',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'type',
            title: 'Field Type',
            type: 'string',
            options: {
              list: [
                { title: 'Text', value: 'text' },
                { title: 'Email', value: 'email' },
                { title: 'Textarea', value: 'textarea' },
                { title: 'Select', value: 'select' }
              ]
            },
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'required',
            title: 'Required',
            type: 'boolean',
            initialValue: true
          }),
          defineField({
            name: 'placeholder',
            title: 'Placeholder',
            type: 'string'
          }),
          defineField({
            name: 'options',
            title: 'Options (for select fields)',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ parent }) => parent?.type !== 'select'
          })
        ]
      }],
      initialValue: [
        { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Enter your name' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
        { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Enter your message' }
      ]
    })
  ]
})