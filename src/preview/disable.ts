import type { APIRoute } from 'astro';
import { DRAFT_COOKIE } from '../lib/content';

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(null, {
    status: 307,
    headers: {
      Location: '/',
      'Set-Cookie': `${DRAFT_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
