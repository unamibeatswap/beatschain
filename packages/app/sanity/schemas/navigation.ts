import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'link',
            title: 'Link',
            type: 'string',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'isExternal',
            title: 'Is External Link',
            type: 'boolean',
            initialValue: false
          }),
          defineField({
            name: 'requiresAuth',
            title: 'Requires Authentication',
            type: 'boolean',
            initialValue: false
          }),
          defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string'
          }),
          defineField({
            name: 'children',
            title: 'Child Items',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'link',
                  title: 'Link',
                  type: 'string',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'isExternal',
                  title: 'Is External Link',
                  type: 'boolean',
                  initialValue: false
                }),
                defineField({
                  name: 'requiresAuth',
                  title: 'Requires Authentication',
                  type: 'boolean',
                  initialValue: false
                })
              ]
            }]
          })
        ]
      }]
    }),
    defineField({
      name: 'isMain',
      title: 'Is Main Navigation',
      type: 'boolean',
      initialValue: false
    })
  ]
})