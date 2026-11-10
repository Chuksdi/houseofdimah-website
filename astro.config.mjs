// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// LIVE SITE (main branch): fully static. Canonical host https://houseofdimah.co.uk (non-www, trailing slash);
// www and http are 301'd to it in public/_redirects; sitemap.xml comes from src/pages/sitemap.xml.ts.
// PREVIEW SITE (studio-preview branch, PREVIEW_MODE=true in netlify.toml): rendered per request on Netlify
// so the Studio's Presentation tab can show drafts. Never indexed.
const PREVIEW = process.env.PREVIEW_MODE === 'true';

export default defineConfig({
  site: 'https://houseofdimah.co.uk',
  trailingSlash: 'always',
  output: PREVIEW ? 'server' : 'static',
  adapter: PREVIEW ? netlify() : undefined,
  build: { format: 'directory' },
  vite: { define: { 'import.meta.env.HOD_PREVIEW': JSON.stringify(PREVIEW) } },
  integrations: PREVIEW
    ? [{
        name: 'hod-preview-routes',
        hooks: {
          'astro:config:setup': ({ injectRoute }) => {
            injectRoute({ pattern: '/api/draft-mode/enable', entrypoint: './src/preview/enable.ts', prerender: false });
            injectRoute({ pattern: '/api/draft-mode/disable', entrypoint: './src/preview/disable.ts', prerender: false });
          },
        },
      }]
    : [],
});
