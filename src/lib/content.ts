// All editable content comes from Sanity, fetched ONCE AT BUILD TIME (never in the browser),
// so every page is finished HTML that crawlers can read. Publishing in Sanity triggers a rebuild.
import { createClient } from '@sanity/client';
import { SITE } from '../data/site';

const client = createClient({
  projectId: 'z8yud8k3',
  dataset: 'production',
  apiVersion: '2026-11-01',
  useCdn: false, // builds always read the latest published content
  perspective: 'published',
});

export type Service = { slug: string; name: string; body: string; tags: string[] };
export type Case = { slug: string; name: string; tags: string[]; img: string; alt: string; fit: boolean; colour?: string; summary?: string };
export type Reel = { label: string; video: string; poster: string };
export type Quote = { quote: string; name: string; org: string };
export type Settings = { email: string; areas: string[]; instagram?: string; linkedin?: string };

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]{ email, areas, instagram, linkedin },
  "services": *[_type == "service"] | order(order asc){ "slug": slug.current, name, body, tags },
  "cases": *[_type == "caseStudy"] | order(order asc){ "slug": slug.current, name, tags, "img": image.asset->url, "alt": image.alt, "fit": coalesce(logoOnColour, false), "colour": tileColour, summary },
  "reels": *[_type == "reel"] | order(order asc){ label, "video": video.asset->url, "poster": poster.asset->url },
  "quotes": *[_type == "testimonial"] | order(order asc){ quote, name, org }
}`;

let cached: Promise<{ settings: Settings; services: Service[]; cases: Case[]; reels: Reel[]; quotes: Quote[] }> | undefined;

export function getContent() {
  cached ??= client.fetch(QUERY).then((d) => {
    // fail the build loudly rather than ship an empty site
    if (!d?.settings || !d.services?.length) throw new Error('Sanity returned no content: check the project and dataset.');
    return {
      settings: { ...d.settings, areas: d.settings.areas ?? SITE.areas },
      services: d.services,
      cases: d.cases.map((c: Case) => ({ ...c, img: c.img ? `${c.img}?w=1400&auto=format` : '' })),
      reels: d.reels,
      quotes: d.quotes,
    };
  });
  return cached;
}

// image tile layout from V9, applied in order and repeated if more stories are added
export const TILE_CLASSES = ['ta', 'tb', 'td', 'tc'];
