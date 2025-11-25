import { defineField, defineType } from 'sanity'

export const paginatedList = defineType({
  name: 'paginatedList',
  title: 'Paginated List',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Beats', value: 'beats' },
          { title: 'Producers', value: 'producers' },
          { title: 'Blog Posts', value: 'posts' },
        ],
      },
    }),
    defineField({
      name: 'itemsPerPage',
      title: 'Items Per Page',
      type: 'number',
      initialValue: 12,
    }),
    defineField({
      name: 'filters',
      title: 'Available Filters',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})

export const interactiveForm = defineType({
  name: 'interactiveForm',
  title: 'Interactive Form',
  type: 'object',
  fields: [
    defineField({
      name: 'formType',
      title: 'Form Type',
      type: 'string',
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Upload', value: 'upload' },
        ],
      },
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'type', type: 'string' }),
            defineField({ name: 'required', type: 'boolean' }),
          ],
        },
      ],
    }),
  ],
})

export const mediaGallery = defineType({
  name: 'mediaGallery',
  title: 'Media Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'galleryType',
      title: 'Gallery Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image Grid', value: 'imageGrid' },
          { title: 'Video Playlist', value: 'videoPlaylist' },
          { title: 'Audio Player', value: 'audioPlayer' },
        ],
      },
    }),
    defineField({
      name: 'items',
      title: 'Media Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'media', type: 'file' }),
            defineField({ name: 'thumbnail', type: 'image' }),
          ],
        },
      ],
    }),
  ],
})

export const dynamicTable = defineType({
  name: 'dynamicTable',
  title: 'Dynamic Table',
  type: 'object',
  fields: [
    defineField({
      name: 'tableType',
      title: 'Table Type',
      type: 'string',
      options: {
        list: [
          { title: 'Pricing', value: 'pricing' },
          { title: 'Comparison', value: 'comparison' },
          { title: 'Data', value: 'data' },
        ],
      },
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'cells', type: 'array', of: [{ type: 'string' }] }),
          ],
        },
      ],
    }),
  ],
})