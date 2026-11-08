// Small enhancements on top of a page that is already complete in the HTML.
// Nothing here fetches content: crawlers see everything without running it.

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const root = document.documentElement;

// light / dark
const modeLabel = () => $$('[data-mode-label]').forEach((el) => (el.textContent = root.dataset.mode === 'light' ? 'Dark' : 'Light'));
modeLabel();
$$('[data-mode-toggle]').forEach((b) => b.addEventListener('click', () => {
  if (root.dataset.mode === 'light') delete root.dataset.mode; else root.dataset.mode = 'light';
  try { localStorage.setItem('hod-mode', root.dataset.mode === 'light' ? 'light' : 'dark'); } catch (e) {}
  modeLabel();
}));

// menu overlay
const menu = $('#menu');
const setMenu = (open: boolean) => {
  if (!menu) return;
  menu.hidden = !open;
  $$('[data-menu-toggle][aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) $<HTMLElement>('a', menu)?.focus();
};
$$('[data-menu-toggle]').forEach((b) => b.addEventListener('click', () => setMenu(!!menu?.hidden)));
$$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); });

// nav tucks away scrolling down past the hero, comes back scrolling up
const nav = $('#nav');
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY, d = y - lastY;
  if (Math.abs(d) < 6) return;
  nav?.classList.toggle('tucked', y > 900 && d > 0 && !!menu?.hidden);
  lastY = y;
}, { passive: true });

// services: tap a tile to open what it covers
const tiles = $$<HTMLButtonElement>('[data-svc]');
const closeAll = () => tiles.forEach((t) => {
  t.setAttribute('aria-expanded', 'false');
  const cta = $('[data-cta]', t); if (cta) cta.textContent = 'What it covers';
  const pop = document.getElementById(t.getAttribute('aria-controls') || ''); if (pop) pop.hidden = true;
});
tiles.forEach((t) => t.addEventListener('click', () => {
  const open = t.getAttribute('aria-expanded') === 'true';
  closeAll();
  if (open) return;
  t.setAttribute('aria-expanded', 'true');
  const cta = $('[data-cta]', t); if (cta) cta.textContent = 'Open';
  const pop = document.getElementById(t.getAttribute('aria-controls') || ''); if (pop) pop.hidden = false;
}));
$$('[data-svc-close]').forEach((b) => b.addEventListener('click', closeAll));

// reels: arrows, and only play the later ones once they're on screen
const rail = $('#reelrail');
$$('[data-reel]').forEach((b) => b.addEventListener('click', () => {
  if (rail) rail.scrollBy({ left: Number(b.dataset.reel) * Math.max(rail.clientWidth * 0.8, 260), behavior: 'smooth' });
}));
const lazy = $$<HTMLVideoElement>('video[data-lazy-play]');
if ('IntersectionObserver' in window && lazy.length) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target as HTMLVideoElement;
    if (e.isIntersecting) { v.preload = 'metadata'; v.play().catch(() => {}); } else v.pause();
  }), { root: rail, rootMargin: '0px 300px' });
  lazy.forEach((v) => io.observe(v));
}

// Start here: one step at a time, submitted to Netlify Forms without leaving the page
const form = $<HTMLFormElement>('#intake');
if (form) {
  const steps = $$('[data-step]');
  const bars = $$('.isteps span');
  let step = 1;
  const show = (n: number) => {
    step = n;
    steps.forEach((s) => s.classList.toggle('cur', Number(s.dataset.step) === n));
    bars.forEach((b, i) => b.classList.toggle('on', i < Math.min(n, 3)));
  };
  const valid = () => {
    const cur = $(`[data-step="${step}"]`, form);
    const bad = cur ? $$<HTMLInputElement>('input[required]', cur).find((i) => !i.checkValidity()) : undefined;
    if (bad) { bad.reportValidity(); return false; }
    return true;
  };
  $$('[data-next]', form).forEach((b) => b.addEventListener('click', () => { if (valid()) show(step + 1); }));
  $$('[data-back]', form).forEach((b) => b.addEventListener('click', () => show(Math.max(1, step - 1))));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!r.ok) throw new Error(String(r.status));
      form.hidden = true;
      show(4);
    } catch (err) {
      form.submit(); // fall back to a normal post to /thanks/
    }
  });
}
