import { defineField, defineType } from 'sanity';
import { orderField, byOrder } from './order';

export const testimonial = defineType({
  name: 'testimonial', title: 'Testimonial', type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 5, description: 'Word for word, and only with the person\'s permission.', validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Name and role', type: 'string', description: 'e.g. "Cait Allen, CEO"', validation: (r) => r.required() }),
    defineField({ name: 'org', title: 'Organisation line', type: 'string', description: 'e.g. "British Chiropractic Association, on Kat"', validation: (r) => r.required() }),
    defineField({ name: 'permission', title: 'They said we can publish this', type: 'boolean', initialValue: false, description: 'A reminder for us: tick once they have confirmed we can publish it. Check every quote is ticked before launch.' }),
    orderField,
  ],
  orderings: byOrder,
  preview: { select: { title: 'name', subtitle: 'org' } },
});
