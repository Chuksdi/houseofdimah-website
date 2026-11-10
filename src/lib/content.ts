// All editable content comes from Sanity.
// LIVE SITE: fetched ONCE AT BUILD TIME (never in the browser), so every page is finished HTML
// that crawlers can read. Publishing in Sanity triggers a rebuild.
// PREVIEW SITE (the studio-preview branch, PREVIEW_MODE=true): pages are rendered on each request,
// and show unpublished drafts only to someone who came in through the Studio's Presentation tab.
import { createClient } from '@sanity/client';
import { SITE } from '../data/site';

export const PREVIEW = import.meta.env.HOD_PREVIEW === true;
export const STUDIO_URL = 'https://houseofdimah.sanity.studio';
export const DRAFT_COOKIE = 'hod-draft';

export const client = createClient({
  projectId: 'z8yud8k3',
  dataset: 'production',
  apiVersion: '2026-11-01',
  useCdn: false, // always read the latest content
  perspective: 'published',
});

// Fields that end up in links, colours or attributes: never hide edit markers inside them.
const NO_MARKERS = new Set(['tileColour', 'email', 'instagram', 'linkedin', 'slug', 'current']);

function draftClient() {
  return client.withConfig({
    token: process.env.SANITY_READ_TOKEN,
    perspective: 'drafts',
    stega: {
      enabled: true,
      studioUrl: STUDIO_URL,
      filter: (p) => !p.sourcePath.some((seg) => typeof seg === 'string' && NO_MARKERS.has(seg)) && p.filterDefault(p),
    },
  });
}

export type Service = { slug: string; name: string; body: string; tags: string[] };
export type Case = { slug: string; name: string; tags: string[]; img: string; alt: string; fit: boolean; colour?: string; summary?: string };
export type Reel = { label: string; video: string; poster: string };
export type Quote = { quote: string; name: string; org: string };
export type Settings = { email: string; areas: string[]; instagram?: string; linkedin?: string };
export type Content = { settings: Settings; services: Service[]; cases: Case[]; reels: Reel[]; quotes: Quote[] };

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]{ email, areas, instagram, linkedin },
  "services": *[_type == "service"] | order(order asc){ "slug": slug.current, name, body, tags },
  "cases": *[_type == "caseStudy"] | order(order asc){ "slug": slug.current, name, tags, "img": image.asset->url, "alt": image.alt, "fit": coalesce(logoOnColour, false), "colour": tileColour, summary },
  "reels": *[_type == "reel"] | order(order asc){ label, "video": video.asset->url, "poster": poster.asset->url },
  "quotes": *[_type == "testimonial"] | order(order asc){ quote, name, org }
}`;

function load(c: typeof client): Promise<Content> {
  return c.fetch(QUERY).then((d) => {
    // fail loudly rather than ship an empty site
    if (!d?.settings || !d.services?.length) throw new Error('Sanity returned no content: check the project and dataset.');
    return {
      settings: { ...d.settings, areas: d.settings.areas ?? SITE.areas },
      services: d.services,
      cases: d.cases.map((c: Case) => ({ ...c, img: c.img ? `${c.img}?w=1400&auto=format` : '' })),
      reels: d.reels,
      quotes: d.quotes,
    };
  });
}

let buildCache: Promise<Content> | undefined;
const requestCache = new WeakMap<object, Promise<Content>>();

/** Pass Astro.locals. Live site: one fetch per build. Preview site: one fetch per page view. */
export function getContent(locals?: App.Locals): Promise<Content> {
  if (!PREVIEW || !locals) return (buildCache ??= load(client));
  let p = requestCache.get(locals);
  if (!p) {
    p = load(locals.draft ? draftClient() : client);
    requestCache.set(locals, p);
  }
  return p;
}

// image tile layout from V9, applied in order and repeated if more stories are added
export const TILE_CLASSES = ['ta', 'tb', 'td', 'tc'];
