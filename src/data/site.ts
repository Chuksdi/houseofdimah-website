// All site copy that repeats across pages lives here, so it's written once.
// Fixed facts about the site. Editable content (services, stories, reels, quotes, contact) lives in Sanity: see src/lib/content.ts.

export const SITE = {
  name: 'House of Dimah',
  url: 'https://houseofdimah.co.uk',
  email: 'hello@houseofdimah.co.uk',
  // Google Calendar booking page: every Book a call goes here
  bookingUrl: 'https://calendar.app.google/6iVbPHGabS9bqjmo8',
  // Legal details shown on /privacy/ and /terms/. Leave a field empty and the sentence that uses it is left out.
  legal: {
    company: 'House of Dimah Ltd',
    companyNumber: '', // TODO: Companies House number
    registeredOffice: '', // TODO: registered office address
    icoNumber: 'ZC303084', // ICO registration number (application C2087679, paid 14 Nov 2026)
    updated: '16 November 2026',
  },
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
