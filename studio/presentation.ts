// Tells the Preview tab which page each drawer's items appear on.
import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

const home = { title: 'Homepage', href: '/' };

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/services/:slug/', filter: `_type == "service" && slug.current == $slug` },
    { route: '/work/:slug/', filter: `_type == "caseStudy" && slug.current == $slug` },
  ]),
  locations: {
    siteSettings: defineLocations({ message: 'Shown in the footer of every page', locations: [home] }),
    service: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: (d) => ({ locations: [{ title: d?.title || 'Service page', href: `/services/${d?.slug}/` }, home] }),
    }),
    caseStudy: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: (d) => ({ locations: [{ title: d?.title || 'Client story', href: `/work/${d?.slug}/` }, home] }),
    }),
    reel: defineLocations({ locations: [home] }),
    testimonial: defineLocations({ locations: [home] }),
  },
};
