export const guide = {
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['extension','admin','artist','getting-started'] } },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'steps', title: 'Steps', type: 'array', of: [{ type: 'object', fields: [ { name: 'title', type: 'string' }, { name: 'description', type: 'text' } ] }] },
    { name: 'lastUpdated', title: 'Last Updated', type: 'datetime' }
  ]
}
