// Preview site only. The Studio's Presentation tab opens this with a one-time secret.
// If Sanity confirms the secret, this browser gets a private cookie and sees drafts.
import type { APIRoute } from 'astro';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { client, DRAFT_COOKIE } from '../lib/content';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const token = process.env.SANITY_READ_TOKEN;
  const secret = process.env.PREVIEW_COOKIE_SECRET;
  if (!token || !secret) return new Response('Preview is not set up yet.', { status: 500 });

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client.withConfig({ token }), request.url);
  if (!isValid) return new Response('This preview link is not valid. Open the preview from the Studio.', { status: 401 });

  // SameSite=None + Partitioned so it works inside the Studio's frame
  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectTo,
      'Set-Cookie': `${DRAFT_COOKIE}=${secret}; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=28800`,
      'Cache-Control': 'no-store',
    },
  });
};
