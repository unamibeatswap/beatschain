import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'BeatsChain',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      initialValue: 'Decentralized marketplace for beat creators and artists',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      description: 'Primary logo (SVG or PNG, 240×80px recommended)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        }
      ]
    }),
    defineField({
      name: 'logoMobile',
      title: 'Mobile Logo',
      description: 'Compact logo for mobile (SVG or PNG, 40×40px recommended)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }
      ]
    }),
    defineField({
      name: 'logoDark',
      title: 'Dark Mode Logo',
      description: 'Logo for dark backgrounds (SVG or PNG, 240×80px recommended)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }
      ]
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      description: 'Square image (512×512px recommended)',
      type: 'image',
    }),
    defineField({
      name: 'touchIcon',
      title: 'Apple Touch Icon',
      description: 'Square image (180×180px recommended)',
      type: 'image',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'discord',
          title: 'Discord',
          type: 'url',
        }),
        defineField({
          name: 'telegram',
          title: 'Telegram',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'platformSettings',
      title: 'Platform Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'platformFee',
          title: 'Platform Fee (%)',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(15),
          initialValue: 15,
          description: 'Smart contract is set to 15% - changing this value will only affect the display',
        }),
        defineField({
          name: 'maxUploadSize',
          title: 'Max Upload Size (MB)',
          type: 'number',
          validation: (Rule) => Rule.min(1).max(100),
          initialValue: 50,
        }),
        defineField({
          name: 'allowedFileTypes',
          title: 'Allowed File Types',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: ['mp3', 'wav', 'flac'],
        }),
        defineField({
          name: 'featuredGenres',
          title: 'Featured Genres',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: ['Hip Hop', 'Trap', 'Amapiano', 'Afrobeats', 'House'],
        }),
        defineField({
          name: 'minimumPrice',
          title: 'Minimum Beat Price (ETH)',
          type: 'number',
          validation: (Rule) => Rule.min(0.001),
          initialValue: 0.001,
        }),
        defineField({
          name: 'maximumPrice',
          title: 'Maximum Beat Price (ETH)',
          type: 'number',
          validation: (Rule) => Rule.min(0.001),
          initialValue: 10.0,
        }),
        defineField({
          name: 'defaultRoyalty',
          title: 'Default Royalty (%)',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(50),
          initialValue: 5,
        }),
      ],
    }),
    defineField({
      name: 'maintenanceMode',
      title: 'Maintenance Mode',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'registrationOpen',
      title: 'Registration Open',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60).warning('Optimal length is under 60 characters')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160).warning('Optimal length is under 160 characters')
        }),
        defineField({
          name: 'ogImage',
          title: 'Default Open Graph Image',
          description: 'Used for social sharing (1200×630px recommended)',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            }
          ]
        }),
        defineField({
          name: 'structuredData',
          title: 'Global Structured Data',
          description: 'JSON-LD for organization/website (paste as text)',
          type: 'text',
          rows: 10
        }),
        defineField({
          name: 'canonicalUrlBase',
          title: 'Canonical URL Base',
          description: 'e.g., https://www.beatschain.app',
          type: 'url'
        }),
        defineField({
          name: 'robotsTxt',
          title: 'Robots.txt Content',
          type: 'text',
          rows: 5
        }),
        defineField({
          name: 'keywords',
          title: 'Global Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          }
        })
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
        }),
        defineField({
          name: 'facebookPixelId',
          title: 'Facebook Pixel ID',
          type: 'string',
        }),
        defineField({
          name: 'gtmId',
          title: 'Google Tag Manager ID',
          type: 'string',
          placeholder: 'GTM-XXXXXXX',
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer Settings',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'companyInfo',
          title: 'Company Information',
          type: 'text',
          rows: 3
        }),
        defineField({
          name: 'address',
          title: 'Company Address',
          type: 'text',
          rows: 2
        }),
        defineField({
          name: 'navigationGroups',
          title: 'Navigation Groups',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Group Title',
                type: 'string'
              },
              {
                name: 'links',
                title: 'Links',
                type: 'array',
                of: [{
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
                      type: 'string'
                    },
                    {
                      name: 'url',
                      title: 'URL',
                      type: 'string'
                    }
                  ]
                }]
              }
            ]
          }]
        }),
        defineField({
          name: 'legalText',
          title: 'Legal Text',
          type: 'text'
        }),
        defineField({
          name: 'socialLinks',
          title: 'Social Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'platform',
                title: 'Platform',
                type: 'string',
                options: {
                  list: [
                    {title: 'Facebook', value: 'facebook'},
                    {title: 'Twitter', value: 'twitter'},
                    {title: 'Instagram', value: 'instagram'},
                    {title: 'LinkedIn', value: 'linkedin'},
                    {title: 'Discord', value: 'discord'}
                  ]
                }
              },
              {
                name: 'url',
                title: 'URL',
                type: 'url'
              }
            ]
          }]
        })
      ]
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration',
      }
    },
  },
})