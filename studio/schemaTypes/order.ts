import { defineField } from 'sanity';

// lower numbers show first on the website
export const orderField = defineField({
  name: 'order', title: 'Order on the page', type: 'number',
  description: 'Lower numbers show first (1, 2, 3...).',
  validation: (r) => r.required().integer().min(0),
});
export const byOrder = [{ title: 'Order on the page', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' as const }] }];
