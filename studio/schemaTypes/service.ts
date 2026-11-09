import { defineField, defineType } from 'sanity';
import { orderField, byOrder } from './order';

export const service = defineType({
  name: 'service', title: 'Service', type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Service name', type: 'string', description: 'Use the words people search for, e.g. "Social Media Marketing".', validation: (r) => r.required().max(40) }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'name', maxLength: 60 }, description: 'Changing this breaks old links to the page. Avoid once live.', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'What it covers', type: 'text', rows: 4, description: 'Two or three sentences. Shown in the pop-up on the homepage and on the service page.', validation: (r) => r.required().min(60).max(400) }),
    defineField({ name: 'tags', title: 'Includes', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, validation: (r) => r.required().min(1).max(6) }),
    orderField,
  ],
  orderings: byOrder,
  preview: { select: { title: 'name', subtitle: 'body' } },
});
