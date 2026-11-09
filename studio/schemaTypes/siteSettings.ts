import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({ name: 'email', title: 'Contact email', type: 'string', validation: (r) => r.required().email() }),
    defineField({ name: 'areas', title: 'Areas we work in', type: 'array', of: [{ type: 'string' }], description: 'Shown under the headline and in the footer, in this order.', validation: (r) => r.required().min(1) }),
    defineField({ name: 'instagram', title: 'Instagram link', type: 'url', description: 'Full link, e.g. https://www.instagram.com/houseofdimah. Leave empty to hide it.' }),
    defineField({ name: 'linkedin', title: 'LinkedIn link', type: 'url', description: 'Leave empty to hide it.' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
