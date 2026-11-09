import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website')
    .items([
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('caseStudy').title('Client stories'),
      S.documentTypeListItem('reel').title('Reels'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
    ]);
