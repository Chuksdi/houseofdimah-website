import { defineField, defineType } from 'sanity';
import { orderField, byOrder } from './order';

export const reel = defineType({
  name: 'reel', title: 'Reel', type: 'document',
  fields: [
    defineField({ name: 'label', title: 'What it is', type: 'string', description: 'e.g. "Moka Pot: from the oven". Read out by screen readers.', validation: (r) => r.required() }),
    defineField({ name: 'video', title: 'Video (MP4, vertical 9:16)', type: 'file', options: { accept: 'video/mp4' }, description: 'Keep it short and under about 3 MB so the page stays fast.', validation: (r) => r.required() }),
    defineField({ name: 'poster', title: 'Cover image', type: 'image', description: 'The still shown before the video plays.', validation: (r) => r.required() }),
    defineField({ name: 'hidden', title: 'Hide from website', type: 'boolean', initialValue: false, description: 'Switch on to take this reel off the website without deleting it.' }),
    orderField,
  ],
  orderings: byOrder,
  preview: { select: { title: 'label', media: 'poster', order: 'order', hidden: 'hidden' }, prepare: ({ title, media, order, hidden }) => ({ title, media, subtitle: hidden ? 'Hidden from website' : `Position ${order ?? '?'}` }) },
});
