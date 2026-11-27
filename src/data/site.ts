// All site copy that repeats across pages lives here, so it's written once.
// Fixed facts about the site. Editable content (services, stories, reels, quotes, contact) lives in Sanity: see src/lib/content.ts.

export const SITE = {
  name: 'House of Dimah',
  url: 'https://houseofdimah.co.uk',
  email: 'hello@houseofdimah.co.uk',
  // shown in the footer and given to Google; must match the Google Business Profile
  phone: '07508 811162',
  phoneIntl: '+447508811162',
  // Google Calendar booking page: every Book a call goes here
  bookingUrl: 'https://calendar.app.google/6iVbPHGabS9bqjmo8',
  // Legal details shown on /privacy/ and /terms/. Leave a field empty and the sentence that uses it is left out.
  // the page links in both footers (main site and client stories)
  footerLinks: [
    { href: '/#services', label: 'Services' },
    { href: '/#method', label: 'How we work' },
    { href: '/#work', label: 'Client stories' },
    { href: '/#prices', label: 'Prices' },
    { href: '/brand-check/', label: 'Dimah Brand Check' },
    { href: '/#start', label: 'Work with us' },
  ],
  legal: {
    company: 'House of Dimah Ltd',
    companyNumber: '17578625', // Companies House, incorporated 12 Nov 2026 (England and Wales)
    registeredOffice: '', // kept off the site on purpose (2026-11-21)
    icoNumber: 'ZC303084', // ICO registration number (application C2087679, paid 14 Nov 2026)
    updated: '26 November 2026',
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
