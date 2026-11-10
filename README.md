# houseofdimah.co.uk

House of Dimah's own website, built with our web build method (Studio playbook 19: Astro + CMS, SEO floor first). The homepage is ported from **Site Board V9**.

## Run it

```bash
npm install
npm run build        # static site into dist/
npx astro preview --port 4400 --host 127.0.0.1
python3 ~/.claude/skills/seo-floor/scripts/audit.py http://127.0.0.1:4400/
```

Locally the audit flags two items: "canonical points at this host" and "sitemap URLs match canonical host". Both fail only because the canonical and sitemap correctly point at https://houseofdimah.co.uk, so they pass once the site is live there. Every other item passes.

## Decisions

- Canonical host is `https://houseofdimah.co.uk`: non-www, with trailing slashes. The www and http versions are 301'd to it in `public/_redirects`.
- The site targets London, Hampshire and Dorset (Chuks, 8 Nov 2026).
- The homepage title is "Branding & Social Media Marketing | London, Hampshire, Dorset". The H1 stays as V9's display line, and the location comes from the line underneath.
- The Start here form posts to Netlify Forms (`name="start"`), with no JavaScript needed.
- Every page is static HTML. Nothing is fetched in the browser. The six service panels are all in the HTML, and JavaScript only shows one at a time.
- `sitemap.xml` is generated on every build by `src/pages/sitemap.xml.ts`.

## Changes from V9 (machine readability only, nothing looks different)

- The long statement block is now a paragraph, not a heading.
- The Start here step titles are no longer headings.
- The price tier names are h3, so the heading levels go in order.
- The Instagram and LinkedIn links are hidden until real URLs go in `src/data/site.ts`.
- On phones the light/dark button is icon-only, so the Menu button stays on screen. V9 has the same overflow at phone width.

## Still to do

- [ ] Sanity: create the project at sanity.io, then wire it in. Content must be fetched at BUILD time, and a webhook must trigger a rebuild on publish.
- [ ] Port the four case studies from the Case boards. `/work/*` pages are shells for now.
- [ ] Replace the striped House Method placeholders with real photos.
- [ ] Add the Instagram and LinkedIn URLs.
- [ ] Get Matt Dunphy's OK on his quote, and confirm the BCA figures.
- [ ] Deploy: GitHub, then Netlify, then the domain. Run the audit against the live URL, and again a month after launch.


## Side-by-side preview (Sanity Presentation tab)

- The Studio's **Preview** tab shows https://studio-preview--houseofdimah.netlify.app, a copy of the site built from the
  `studio-preview` branch with `PREVIEW_MODE=true`. It renders each page on request, so drafts show as you type.
- Drafts only show to a browser the Studio let in (`/api/draft-mode/enable/` checks Sanity's one-time secret, then sets a
  private cookie). Anyone else sees published content. The preview is always noindex.
- Netlify env (branch-deploy context, never in the repo): `SANITY_READ_TOKEN` (Sanity Viewer token "Website preview",
  saved with `scripts/save-preview-token.sh`) and `PREVIEW_COOKIE_SECRET` (random).
- `git push` in this repo pushes main to BOTH `main` and `studio-preview` (remote.origin.push), so the preview never drifts.
- The live site (main) is untouched: still fully static, built once per publish.
