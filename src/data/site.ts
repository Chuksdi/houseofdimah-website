// All site copy that repeats across pages lives here, so it's written once.
// Copy is from Site Board V9. Sanity replaces this file later (fetched at BUILD time).

export const SITE = {
  name: 'House of Dimah',
  url: 'https://houseofdimah.co.uk',
  email: 'hello@houseofdimah.co.uk',
  areas: ['London', 'Hampshire', 'Dorset'],
  // TODO: real profile links before launch (V9 still has them as "#")
  instagram: '',
  linkedin: '',
};

export type Service = { slug: string; name: string; body: string; tags: string[] };

export const SERVICES: Service[] = [
  { slug: 'branding-and-rebranding', name: 'Branding & Rebranding', body: 'A new identity, or a sharper version of the one you have. We work out what you stand for, then make the name, logo, colours and type that say it, with guidelines your team can actually use.', tags: ['Brand strategy', 'Naming', 'Logo & identity', 'Guidelines', 'Rebrands'] },
  { slug: 'social-media-marketing', name: 'Social Media Marketing', body: 'Strategy first: what to say, where, how often and why. Then we run the accounts day to day, so every post has a job and you can see what it did.', tags: ['Social strategy', 'Content calendar', 'Account management', 'Community', 'Reporting'] },
  { slug: 'content-creation', name: 'Content Creation', body: 'Photo, video and words, shot and written by us. Made for the platforms you use and the people you want to reach, not just to fill a grid.', tags: ['Photography', 'Video & reels', 'Copywriting', 'Editing'] },
  { slug: 'website-design-and-development', name: 'Website Design & Development', body: 'Sites that look right, load fast and get found. Designed, built, launched and kept running, so it never goes stale.', tags: ['Site map & wireframes', 'UI design', 'Build', 'SEO', 'Care & updates'] },
  { slug: 'communication-strategy', name: 'Communication Strategy', body: 'How you talk, to whom and through which channels. A clear plan your team can follow, not a deck that sits in a drawer.', tags: ['Audience & message', 'Tone of voice', 'Channel plan', 'Campaign planning'] },
  { slug: 'marketing-consulting', name: 'Marketing Consulting', body: 'An outside view when you need one. Sessions to test an idea, review work in progress or decide what to do next.', tags: ['Workshops', 'Work reviews', 'Direction'] },
];

export type Case = { slug: string; name: string; tags: string[]; img: string; alt: string; cls: string; imgCls?: string };

export const CASES: Case[] = [
  { slug: 'leftfield-learning', name: 'Leftfield Learning', tags: ['Brand', 'Execution'], img: '/media/work-leftfield.png', alt: 'Leftfield Learning logo, black chevron and wordmark on yellow', cls: 'ta', imgCls: 'fit' },
  { slug: 'genesis-ix', name: 'Genesis IX', tags: ['Brand', 'Execution'], img: '/media/work-genesis-ix.jpg', alt: 'Genesis IX logo, white symbol and wordmark on dark navy', cls: 'tb' },
  { slug: 'british-chiropractic-association', name: 'British Chiropractic Association', tags: ['Content', 'Execution'], img: '/media/work-bca.png', alt: 'British Chiropractic Association logo, white on navy', cls: 'td' },
  { slug: 'mr-strongmans', name: 'Mr Strongmans', tags: ['Brand', 'Execution'], img: '/media/work-mr-strongmans.webp', alt: 'Mr Strongmans Creatine tub turning a full circle, centred on a lime background', cls: 'tc' },
];

export const REELS: { file: string; label: string }[] = [
  { file: 'chirolive-what-to-expect', label: 'ChiroLive 2027: what you can expect' },
  { file: 'moka-pot-table-swipe', label: 'Moka Pot, pizzas spinning onto the table' },
  { file: 'chirolive-first-cut', label: 'ChiroLive 2027: what you can expect, first cut' },
  { file: 'chirolive-tell-everyone', label: 'ChiroLive 2027: I gotta tell everyone' },
  { file: 'moka-pot-menu', label: 'Moka Pot: the menu' },
  { file: 'teesside-meetup', label: 'Teesside meetup recap' },
  { file: 'moka-pot-full-house', label: 'Moka Pot: full house' },
  { file: 'ilksf-istanbul', label: 'ILKSF Istanbul 2024' },
  { file: 'gooderese-artwork', label: 'Gooderese artwork' },
  { file: 'ilksf-dubai-nima', label: 'Nima, ILKSF Dubai shout-out' },
  { file: 'chirolive-bournemouth', label: 'ChiroLive 2027: Bournemouth' },
  { file: 'moka-pot-from-the-oven', label: 'Moka Pot: from the oven' },
];

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
