import { defineField, defineType } from 'sanity'

export const walletConnect = defineType({
  name: 'walletConnect',
  title: 'Wallet Connect',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title for the wallet connect button',
      initialValue: 'Connect Wallet'
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the button',
      initialValue: 'Connect'
    }),
    defineField({
      name: 'buttonStyle',
      title: 'Button Style',
      type: 'object',
      fields: [
        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          description: 'HEX color code for button background',
          initialValue: '#4F46E5'
        }),
        defineField({
          name: 'textColor',
          title: 'Text Color',
          type: 'string',
          description: 'HEX color code for button text',
          initialValue: '#FFFFFF'
        }),
        defineField({
          name: 'borderRadius',
          title: 'Border Radius',
          type: 'string',
          description: 'Border radius in pixels',
          initialValue: '8px'
        }),
        defineField({
          name: 'padding',
          title: 'Padding',
          type: 'string',
          description: 'Button padding',
          initialValue: '10px 20px'
        }),
        defineField({
          name: 'fontSize',
          title: 'Font Size',
          type: 'string',
          description: 'Font size in pixels',
          initialValue: '16px'
        }),
        defineField({
          name: 'fontWeight',
          title: 'Font Weight',
          type: 'string',
          description: 'Font weight',
          initialValue: '600'
        }),
        defineField({
          name: 'customClass',
          title: 'Custom CSS Class',
          type: 'string',
          description: 'Additional CSS classes'
        })
      ]
    }),
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string',
      options: {
        list: [
          { title: 'Header', value: 'header' },
          { title: 'Hero Section', value: 'hero' },
          { title: 'Sidebar', value: 'sidebar' },
          { title: 'Footer', value: 'footer' }
        ]
      },
      initialValue: 'header'
    }),
    defineField({
      name: 'showIcon',
      title: 'Show Icon',
      type: 'boolean',
      description: 'Display wallet icon next to text',
      initialValue: true
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon to display',
      initialValue: '🔗'
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable or disable this wallet connect button',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      placement: 'placement',
      isActive: 'isActive'
    },
    prepare({ title, placement, isActive }) {
      return {
        title: title || 'Wallet Connect',
        subtitle: `${placement} ${isActive ? '(Active)' : '(Inactive)'}`
      }
    }
  }
})