import { defineField, defineType } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'style',
      title: 'Hero Style',
      type: 'string',
      options: {
        list: [
          { title: 'Gradient', value: 'gradient' },
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Split', value: 'split' },
          { title: 'Minimal', value: 'minimal' },
        ],
      },
      initialValue: 'gradient',
    }),
    defineField({
      name: 'ctaButtons',
      title: 'Call-to-Action Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'Button URL',
              type: 'string',
            }),
            defineField({
              name: 'style',
              title: 'Button Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                ],
              },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'badges',
      title: 'Feature Badges',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})