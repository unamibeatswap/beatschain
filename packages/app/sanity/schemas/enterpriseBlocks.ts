import { defineField, defineType } from 'sanity'

// Tabs Block
export const tabsBlock = defineType({
  name: 'tabsBlock',
  title: 'Tabs',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
    }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Tab Title',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'content',
              title: 'Tab Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image' }
              ],
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'icon',
              title: 'Tab Icon',
              type: 'string',
              description: 'Optional emoji or icon'
            })
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon'
            },
            prepare({ title, icon }) {
              return {
                title: title,
                subtitle: 'Tab',
                media: icon ? icon : null
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'style',
      title: 'Tab Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Pills', value: 'pills' },
          { title: 'Underline', value: 'underline' },
          { title: 'Boxed', value: 'boxed' }
        ]
      },
      initialValue: 'default'
    }),
    defineField({
      name: 'colorScheme',
      title: 'Color Scheme',
      type: 'string',
      options: {
        list: [
          { title: 'Default (Blue)', value: 'default' },
          { title: 'Purple', value: 'purple' },
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
          { title: 'Gray', value: 'gray' }
        ]
      },
      initialValue: 'default'
    }),
    defineField({
      name: 'customClass',
      title: 'Custom CSS Class',
      type: 'string',
      description: 'Add custom CSS class for additional styling'
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade In', value: 'fadeIn' },
              { title: 'Slide Up', value: 'slideUp' },
              { title: 'Slide In', value: 'slideIn' },
              { title: 'Zoom In', value: 'zoomIn' },
              { title: 'Bounce', value: 'bounce' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'delay',
          title: 'Delay (ms)',
          type: 'number',
          initialValue: 0
        }),
        defineField({
          name: 'duration',
          title: 'Duration (ms)',
          type: 'number',
          initialValue: 500
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      tabs: 'tabs'
    },
    prepare({ title, tabs = [] }) {
      return {
        title: title || 'Tabs Block',
        subtitle: `${tabs.length} tab${tabs.length === 1 ? '' : 's'}`
      }
    }
  }
})

// Accordion Block
export const accordionBlock = defineType({
  name: 'accordionBlock',
  title: 'Accordion',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Accordion Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Item Title',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'content',
              title: 'Item Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image' }
              ],
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'isOpen',
              title: 'Open by Default',
              type: 'boolean',
              initialValue: false
            })
          ],
          preview: {
            select: {
              title: 'title',
              isOpen: 'isOpen'
            },
            prepare({ title, isOpen }) {
              return {
                title: title,
                subtitle: isOpen ? 'Open by default' : 'Closed by default'
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'allowMultiple',
      title: 'Allow Multiple Open',
      description: 'Allow multiple accordion items to be open simultaneously',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'colorScheme',
      title: 'Color Scheme',
      type: 'string',
      options: {
        list: [
          { title: 'Default (Blue)', value: 'default' },
          { title: 'Purple', value: 'purple' },
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
          { title: 'Gray', value: 'gray' }
        ]
      },
      initialValue: 'default'
    }),
    defineField({
      name: 'customClass',
      title: 'Custom CSS Class',
      type: 'string',
      description: 'Add custom CSS class for additional styling'
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade In', value: 'fadeIn' },
              { title: 'Slide Up', value: 'slideUp' },
              { title: 'Slide In', value: 'slideIn' },
              { title: 'Zoom In', value: 'zoomIn' },
              { title: 'Bounce', value: 'bounce' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'delay',
          title: 'Delay (ms)',
          type: 'number',
          initialValue: 0
        }),
        defineField({
          name: 'duration',
          title: 'Duration (ms)',
          type: 'number',
          initialValue: 500
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items'
    },
    prepare({ title, items = [] }) {
      return {
        title: title || 'Accordion Block',
        subtitle: `${items.length} item${items.length === 1 ? '' : 's'}`
      }
    }
  }
})

// Feature Cards Block
export const featureCardsBlock = defineType({
  name: 'featureCardsBlock',
  title: 'Feature Cards',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Block Subtitle',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'cards',
      title: 'Feature Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Card Title',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'description',
              title: 'Card Description',
              type: 'text',
              rows: 3,
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'icon',
              title: 'Card Icon',
              type: 'string',
              description: 'Emoji or icon'
            }),
            defineField({
              name: 'image',
              title: 'Card Image',
              type: 'image',
              options: {
                hotspot: true
              }
            }),
            defineField({
              name: 'link',
              title: 'Card Link',
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Link Text',
                  type: 'string'
                }),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'string'
                }),
                defineField({
                  name: 'isExternal',
                  title: 'Is External Link',
                  type: 'boolean',
                  initialValue: false
                })
              ]
            })
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
              image: 'image'
            },
            prepare({ title, icon, image }) {
              return {
                title: title,
                subtitle: 'Feature Card',
                media: image || icon || null
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          { title: '1 Column', value: 1 },
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
          { title: '4 Columns', value: 4 }
        ]
      },
      initialValue: 3
    }),
    defineField({
      name: 'style',
      title: 'Card Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Bordered', value: 'bordered' },
          { title: 'Shadowed', value: 'shadowed' },
          { title: 'Minimal', value: 'minimal' }
        ]
      },
      initialValue: 'default'
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade In', value: 'fadeIn' },
              { title: 'Slide Up', value: 'slideUp' },
              { title: 'Slide In', value: 'slideIn' },
              { title: 'Zoom In', value: 'zoomIn' },
              { title: 'Bounce', value: 'bounce' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'delay',
          title: 'Delay (ms)',
          type: 'number',
          initialValue: 0
        }),
        defineField({
          name: 'duration',
          title: 'Duration (ms)',
          type: 'number',
          initialValue: 500
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      cards: 'cards'
    },
    prepare({ title, cards = [] }) {
      return {
        title: title || 'Feature Cards Block',
        subtitle: `${cards.length} card${cards.length === 1 ? '' : 's'}`
      }
    }
  }
})

// Steps Block
export const stepsBlock = defineType({
  name: 'stepsBlock',
  title: 'Steps',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Block Subtitle',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'array',
              of: [{ type: 'block' }],
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'image',
              title: 'Step Image',
              type: 'image',
              options: {
                hotspot: true
              }
            })
          ],
          preview: {
            select: {
              title: 'title',
              image: 'image'
            },
            prepare({ title, image }) {
              return {
                title: title,
                subtitle: 'Step',
                media: image
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Vertical', value: 'vertical' },
          { title: 'Horizontal', value: 'horizontal' }
        ]
      },
      initialValue: 'vertical'
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade In', value: 'fadeIn' },
              { title: 'Slide Up', value: 'slideUp' },
              { title: 'Slide In', value: 'slideIn' },
              { title: 'Zoom In', value: 'zoomIn' },
              { title: 'Bounce', value: 'bounce' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'delay',
          title: 'Delay (ms)',
          type: 'number',
          initialValue: 0
        }),
        defineField({
          name: 'duration',
          title: 'Duration (ms)',
          type: 'number',
          initialValue: 500
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      steps: 'steps'
    },
    prepare({ title, steps = [] }) {
      return {
        title: title || 'Steps Block',
        subtitle: `${steps.length} step${steps.length === 1 ? '' : 's'}`
      }
    }
  }
})

// Testimonials Block
export const testimonialsBlock = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'author',
              title: 'Author',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'role',
              title: 'Role/Company',
              type: 'string'
            }),
            defineField({
              name: 'avatar',
              title: 'Author Avatar',
              type: 'image',
              options: {
                hotspot: true
              }
            }),
            defineField({
              name: 'rating',
              title: 'Rating',
              type: 'number',
              options: {
                list: [1, 2, 3, 4, 5]
              }
            })
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'quote',
              media: 'avatar'
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'display',
      title: 'Display Style',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'List', value: 'list' }
        ]
      },
      initialValue: 'grid'
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade In', value: 'fadeIn' },
              { title: 'Slide Up', value: 'slideUp' },
              { title: 'Slide In', value: 'slideIn' },
              { title: 'Zoom In', value: 'zoomIn' },
              { title: 'Bounce', value: 'bounce' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'delay',
          title: 'Delay (ms)',
          type: 'number',
          initialValue: 0
        }),
        defineField({
          name: 'duration',
          title: 'Duration (ms)',
          type: 'number',
          initialValue: 500
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      testimonials: 'testimonials'
    },
    prepare({ title, testimonials = [] }) {
      return {
        title: title || 'Testimonials Block',
        subtitle: `${testimonials.length} testimonial${testimonials.length === 1 ? '' : 's'}`
      }
    }
  }
})

// Pricing Table Block
export const pricingTableBlock = defineType({
  name: 'pricingTableBlock',
  title: 'Pricing Table',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Block Subtitle',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'plans',
      title: 'Pricing Plans',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Plan Name',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'interval',
              title: 'Billing Interval',
              type: 'string',
              description: 'e.g., "per month", "per year"'
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }],
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'cta',
              title: 'Call to Action',
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Button Text',
                  type: 'string',
                  initialValue: 'Get Started'
                }),
                defineField({
                  name: 'url',
                  title: 'Button URL',
                  type: 'string'
                })
              ]
            }),
            defineField({
              name: 'highlighted',
              title: 'Highlight This Plan',
              type: 'boolean',
              initialValue: false
            })
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
              highlighted: 'highlighted'
            },
            prepare({ title, subtitle, highlighted }) {
              return {
                title: title,
                subtitle: `${subtitle}${highlighted ? ' (Highlighted)' : ''}`,
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Animation Type',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade In', value: 'fadeIn' },
              { title: 'Slide Up', value: 'slideUp' },
              { title: 'Slide In', value: 'slideIn' },
              { title: 'Zoom In', value: 'zoomIn' },
              { title: 'Bounce', value: 'bounce' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'delay',
          title: 'Delay (ms)',
          type: 'number',
          initialValue: 0
        }),
        defineField({
          name: 'duration',
          title: 'Duration (ms)',
          type: 'number',
          initialValue: 500
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      plans: 'plans'
    },
    prepare({ title, plans = [] }) {
      return {
        title: title || 'Pricing Table',
        subtitle: `${plans.length} plan${plans.length === 1 ? '' : 's'}`
      }
    }
  }
})