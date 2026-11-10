// sitemap.xml, regenerated on every build from the same data the pages use.
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { getContent } from '../lib/content';

export const GET: APIRoute = async ({ locals }) => {
  const { services: SERVICES, cases: CASES } = await getContent(locals);
  const paths = ['/', ...SERVICES.map((s) => `/services/${s.slug}/`), ...CASES.map((c) => `/work/${c.slug}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${SITE.url}${p}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
