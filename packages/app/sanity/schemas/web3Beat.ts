import { defineField, defineType } from 'sanity'

export const web3Beat = defineType({
  name: 'web3Beat',
  title: 'Web3 Beat (User Generated)',
  type: 'document',
  icon: () => '⛓️',
  fields: [
    defineField({
      name: 'beatId',
      title: 'Beat ID (Timestamp)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Beat Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stageName',
      title: 'Producer Stage Name',
      type: 'string',
    }),
    defineField({
      name: 'producerAddress',
      title: 'Producer Wallet Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'string',
    }),
    defineField({
      name: 'bpm',
      title: 'BPM',
      type: 'number',
    }),
    defineField({
      name: 'key',
      title: 'Musical Key',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price (ETH)',
      type: 'number',
    }),
    defineField({
      name: 'coverImageUrl',
      title: 'Cover Image URL (IPFS)',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private (Server Access Only)',
      type: 'boolean',
      initialValue: true,
      description: 'Hidden from public Sanity queries, used only for social sharing'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'stageName',
      beatId: 'beatId'
    },
    prepare(selection) {
      const { title, subtitle, beatId } = selection
      return {
        title,
        subtitle: `${subtitle} • ${beatId}`,
      }
    },
  },
})