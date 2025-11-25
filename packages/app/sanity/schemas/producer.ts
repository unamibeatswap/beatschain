import { defineField, defineType } from 'sanity'

export const producer = defineType({
  name: 'producer',
  title: 'Beat Creator',
  type: 'document',
  icon: () => '🎤',
  fields: [
    defineField({
      name: 'name',
      title: 'Creator Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'stageName',
      title: 'Stage Name / Artist Name',
      type: 'string',
      description: 'Public artist/producer name (if different from creator name)',
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Hero background image for producer page',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'walletAddress',
      title: 'Wallet Address',
      type: 'string',
      validation: (Rule) => Rule.regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      placeholder: 'e.g., Cape Town, South Africa',
    }),
    defineField({
      name: 'genres',
      title: 'Specializes In',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Hip Hop', value: 'hip-hop' },
              { title: 'Trap', value: 'trap' },
              { title: 'Amapiano', value: 'amapiano' },
              { title: 'Afrobeats', value: 'afrobeats' },
              { title: 'House', value: 'house' },
              { title: 'Electronic', value: 'electronic' },
              { title: 'R&B', value: 'rnb' },
              { title: 'Pop', value: 'pop' },
              { title: 'Drill', value: 'drill' },
              { title: 'Gqom', value: 'gqom' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
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
          name: 'soundcloud',
          title: 'SoundCloud',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
        defineField({
          name: 'website',
          title: 'Website',
          type: 'url',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'verified',
      title: 'Verified Creator',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Creator',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'joinedAt',
      title: 'Joined Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'object',
      fields: [
        defineField({
          name: 'totalBeats',
          title: 'Total Beats',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'totalSales',
          title: 'Total Sales',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'totalEarnings',
          title: 'Total Earnings (ETH)',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'followers',
          title: 'Followers',
          type: 'number',
          initialValue: 0,
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          validation: (Rule) => Rule.max(160),
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      location: 'location',
      verified: 'verified',
      media: 'profileImage',
    },
    prepare(selection) {
      const { title, location, verified } = selection
      return {
        title,
        subtitle: `${location || 'Location not set'} ${verified ? '• ✓ Verified' : ''}`,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Joined Date, New',
      name: 'joinedAtDesc',
      by: [{ field: 'joinedAt', direction: 'desc' }],
    },
    {
      title: 'Verified First',
      name: 'verifiedFirst',
      by: [{ field: 'verified', direction: 'desc' }],
    },
  ],
})