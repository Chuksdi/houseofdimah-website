import { defineField, defineType } from 'sanity';
import { orderField, byOrder } from './order';

export const caseStudy = defineType({
  name: 'caseStudy', title: 'Client story', type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'name', maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { list: ['Brand', 'Content', 'Execution'] }, validation: (r) => r.required().min(1) }),
    defineField({
      name: 'image', title: 'Tile image', type: 'image', options: { hotspot: true }, validation: (r) => r.required(),
      fields: [defineField({ name: 'alt', title: 'Describe the image', type: 'string', description: 'For people using screen readers, and for Google. Required.', validation: (r) => r.required() })],
    }),
    defineField({ name: 'logoOnColour', title: 'Logo on a colour background?', type: 'boolean', initialValue: false, description: 'Turn on if the image is a logo that should sit smaller on its brand colour.' }),
    defineField({ name: 'tileColour', title: 'Tile background colour', type: 'string', description: 'Hex code, e.g. #F0E040. Only used when the logo sits on a colour.', validation: (r) => r.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex colour' }) }),
    defineField({ name: 'summary', title: 'Short summary', type: 'text', rows: 3, description: 'One or two sentences for the client story page. (The full write-up comes later.)' }),
    orderField,
  ],
  orderings: byOrder,
  preview: { select: { title: 'name', media: 'image' } },
});
