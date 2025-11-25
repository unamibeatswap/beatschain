import { defineField, defineType } from 'sanity'

export const web3Stats = defineType({
  name: 'web3Stats',
  title: 'Web3 Stats',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Row', value: 'row' }
        ]
      },
      initialValue: 'grid'
    }),
    defineField({
      name: 'showLabels',
      title: 'Show Labels',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' }
        ]
      },
      initialValue: 'light'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2
    })
  ]
})