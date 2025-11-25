import { defineField, defineType } from 'sanity'

export const contentBlock = defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Block Type',
      type: 'string',
      options: {
        list: [
          { title: 'Features', value: 'features' },
          { title: 'Stats', value: 'stats' },
          { title: 'Testimonials', value: 'testimonials' },
          { title: 'FAQ', value: 'faq' },
          { title: 'CTA', value: 'cta' },
          { title: 'Text', value: 'text' },
          { title: 'Paginated List', value: 'paginatedList' },
          { title: 'Interactive Form', value: 'interactiveForm' },
          { title: 'Media Gallery', value: 'mediaGallery' },
          { title: 'Dynamic Table', value: 'dynamicTable' },
          { title: 'Web3 Stats', value: 'web3Stats' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      title: 'Section Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Item Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Gray', value: 'gray' },
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Yellow', value: 'yellow' },
        ],
      },
    }),
  ],
})