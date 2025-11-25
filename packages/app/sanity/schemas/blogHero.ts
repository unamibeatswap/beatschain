import { defineField, defineType } from 'sanity'

export const blogHero = defineType({
  name: 'blogHero',
  title: 'Blog Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code for the background (e.g., #1f2937)',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color code for the text (e.g., #ffffff)',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Background image for the hero section',
    }),
    defineField({
      name: 'overlay',
      title: 'Overlay Opacity',
      type: 'number',
      description: 'Opacity of the dark overlay (0-1)',
      validation: Rule => Rule.min(0).max(1),
      initialValue: 0.5,
    }),
    defineField({
      name: 'height',
      title: 'Hero Height',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'alignment',
      title: 'Content Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'center',
    }),
  ],
})