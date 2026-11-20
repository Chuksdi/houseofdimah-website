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

// reels (matches V9): the rail drifts right to left on its own. Any touch, swipe, trackpad, wheel or drag hands control
// to the visitor instantly (snapping back on, no tug of war); a few seconds after they stop, the drift eases back in.
// The drift moves whole pixels by scrolling and the leftover fraction by transform, so it glides evenly.
const rail = $('#reelrail');
if (rail && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const SPEED = 38;   // px per second
  const IDLE = 3500;  // ms after the last interaction before the drift resumes
  let hover = false, seen = true, last = 0, speed = 0, pos = rail.scrollLeft, userUntil = 0, auto = false;
  let settleT: ReturnType<typeof setTimeout> | undefined;
  const loopW = () => { const a = $('.rc', rail), c = $('.rc.clone', rail); return a && c ? c.offsetLeft - a.offsetLeft : 0; };
  const setAuto = (on: boolean) => {
    if (on === auto) return;
    auto = on;
    rail.classList.toggle('auto', on);
    if (!on) rail.style.setProperty('--sub', '0px');
  };
  const jumpTo = (x: number) => { // instant, never animated
    const prev = rail.style.scrollBehavior; rail.style.scrollBehavior = 'auto';
    rail.scrollLeft = x; rail.style.scrollBehavior = prev; pos = rail.scrollLeft;
  };
  const takeOver = () => { userUntil = Date.now() + IDLE; speed = 0; setAuto(false); };
  ['wheel', 'touchstart', 'pointerdown'].forEach((ev) => rail.addEventListener(ev, takeOver, { passive: true }));
  rail.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') hover = true; });
  rail.addEventListener('pointerleave', (e) => { if ((e as PointerEvent).pointerType === 'mouse') hover = false; });
  rail.addEventListener('scroll', () => {
    if (auto) return;
    userUntil = Math.max(userUntil, Date.now() + 1500); // still coasting from a swipe: keep waiting
    // once the visitor's scroll settles, wrap round seamlessly so there's no dead end in either direction
    clearTimeout(settleT);
    settleT = setTimeout(() => {
      const w = loopW(); if (!w) return;
      const x = rail.scrollLeft;
      if (x >= w) jumpTo(x - w); else if (x <= 1) jumpTo(x + w);
    }, 180);
  }, { passive: true });
  const step = (t: number) => {
    const dt = last ? Math.min(t - last, 64) / 1000 : 0; last = t;
    if (Date.now() < userUntil) speed = 0;
    else speed += ((seen && !hover ? SPEED : 0) - speed) * Math.min(1, dt * 1.5); // eases in and out gently
    if (speed > 0.5) {
      if (!auto) { pos = rail.scrollLeft; setAuto(true); }
      pos += speed * dt;
      const w = loopW(); if (w && pos >= w) pos -= w;
      const whole = Math.floor(pos);
      if (rail.scrollLeft !== whole) rail.scrollLeft = whole;
      rail.style.setProperty('--sub', (whole - pos).toFixed(3) + 'px');
    } else if (!auto) pos = rail.scrollLeft; // visitor in control: follow wherever they scrolled to
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => es.forEach((e) => { seen = e.isIntersecting; })).observe(rail);
  requestAnimationFrame(step);
}
// hero logo: make sure the visible version plays (autoplay alone can be skipped)
$$<HTMLVideoElement>('.hero .mark video').forEach((v) => { if (v.offsetParent) { v.muted = true; v.play().catch(() => {}); } });
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
  const loadedAt = Date.now();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // bot check: nobody fills three steps within seconds of the page opening. Show the thank-you, send nothing.
    if (Date.now() - loadedAt < 5000) { form.hidden = true; show(4); return; }
    // email subject for the Netlify notification: Form submission: ENQUIRY [business], or their name if no business given
    const subj = $<HTMLInputElement>('input[name="subject"]', form);
    const who = ($<HTMLInputElement>('#biz', form)?.value || $<HTMLInputElement>('#nm', form)?.value || '').trim();
    if (subj) subj.value = `Form submission: ENQUIRY ${who}`.trim();
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

// Client stories: the spinning badge follows the mouse, eased in and out (slow, fast, slow).
// Mouse and trackpad only; touch screens keep the still badge.
{
  const zone = document.querySelector<HTMLElement>('.hod-cursor-zone');
  const box = zone?.querySelector<HTMLElement>('.tiles');
  const badge = box?.querySelector<HTMLElement>('.badge');
  if (zone && box && badge && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    zone.classList.add('cursor-on');
    let x = 0, y = 0, tx = 0, ty = 0, vx = 0, vy = 0, inside = false, raf = 0;
    let last: { x: number; y: number } | null = null;
    const tick = () => {
      vx = (vx + (tx - x) * 0.08) * 0.74; vy = (vy + (ty - y) * 0.08) * 0.74;
      x += vx; y += vy;
      badge.style.setProperty('--cx', x + 'px'); badge.style.setProperty('--cy', y + 'px');
      raf = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const update = (target: EventTarget | null) => {
      if (!last) return;
      const z = zone.getBoundingClientRect(), b = box.getBoundingClientRect();
      const now = last.x >= z.left && last.x <= z.right && last.y >= z.top && last.y <= z.bottom;
      tx = last.x - b.left; ty = last.y - b.top;
      if (now && !inside) { x = tx; y = ty; vx = vy = 0; }
      if (now !== inside) { inside = now; zone.classList.toggle('cursor-in', now); }
      const el = (target as Element | null) ?? document.elementFromPoint(last.x, last.y);
      zone.classList.toggle('cursor-tile', now && !!el?.closest?.('.hod-cursor-zone .tile'));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      last = { x: e.clientX, y: e.clientY }; update(e.target);
    }, { passive: true });
    window.addEventListener('scroll', () => update(null), { passive: true });
  }
}
