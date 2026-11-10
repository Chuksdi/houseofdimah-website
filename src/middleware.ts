import { defineMiddleware } from 'astro:middleware';
import { PREVIEW, DRAFT_COOKIE } from './lib/content';

// Preview site only: a browser sees drafts if it carries the cookie set by /api/draft-mode/enable/.
export const onRequest = defineMiddleware((ctx, next) => {
  if (PREVIEW) {
    const secret = process.env.PREVIEW_COOKIE_SECRET;
    ctx.locals.draft = !!secret && ctx.cookies.get(DRAFT_COOKIE)?.value === secret;
  }
  return next();
});
