// BCA case study: the numbers count up (slow, fast, slow) the first time they come into view.
// Ported from the Case-BCA board on the Site Board.
(function () {
  const el = document.querySelector('[data-count-up]');
  if (!el || !window.IntersectionObserver) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = Array.from(el.querySelectorAll('b')).map((b) => {
    const m = b.textContent.match(/^([^0-9]*)([0-9,]*\.?[0-9]+)(.*)$/);
    if (!m) return null;
    const raw = m[2].replace(/,/g, ''), dec = (raw.split('.')[1] || '').length;
    return { b, pre: m[1], suf: m[3], to: parseFloat(raw), dec, comma: m[2].indexOf(',') > -1, text: b.textContent };
  }).filter(Boolean);
  const fmt = (it, v) => { let s = v.toFixed(it.dec); if (it.comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return it.pre + s + it.suf; };
  const ramp = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  items.forEach((it) => { it.b.style.minWidth = it.b.offsetWidth + 'px'; it.b.textContent = fmt(it, 0); });
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    const t0 = performance.now(), dur = 1400;
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      items.forEach((it, i) => {
        const q = Math.min(Math.max((p * dur - i * 90) / (dur - 450), 0), 1);
        it.b.textContent = q >= 1 ? it.text : fmt(it, it.to * ramp(q));
      });
      if (p < 1 || items.some((it) => it.b.textContent !== it.text)) requestAnimationFrame(tick);
    })(t0);
  }, { threshold: 0.35 });
  io.observe(el);
})();
