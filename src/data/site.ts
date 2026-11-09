// All site copy that repeats across pages lives here, so it's written once.
// Fixed facts about the site. Editable content (services, stories, reels, quotes, contact) lives in Sanity: see src/lib/content.ts.

export const SITE = {
  name: 'House of Dimah',
  url: 'https://houseofdimah.co.uk',
  email: 'hello@houseofdimah.co.uk',
  areas: ['London', 'Hampshire', 'Dorset'],
  // TODO: real profile links before launch (V9 still has them as "#")
  instagram: '',
  linkedin: '',
};

export const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#org`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: `${SITE.url}/media/logo-black.png`,
  email: SITE.email,
  founder: [{ '@type': 'Person', name: 'Chuks' }, { '@type': 'Person', name: 'Kat' }],
};
