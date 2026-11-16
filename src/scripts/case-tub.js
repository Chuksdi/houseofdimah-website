// Mr Strongmans case study: the 3D tub. Ported from the Case-MrStrongmans board on the Site Board.
// Needs window.THREE, THREE.GLTFLoader and THREE.RoomEnvironment (loaded from /vendor/three/ on that page only).
(function () {
  const canvas = document.getElementById('ms-canvas');
  if (!canvas) return;
  const loadingEl = document.getElementById('ms-loading');
  const buttons = Array.from(document.querySelectorAll('.switch [data-label]'));
  const files = {
    final: '/media/work/mr-strongmans/e75989fc69a01108f76f25f6eb85f29c.gltf',
    lime: '/media/work/mr-strongmans/38b757ab51f74b5bbcae55878cf3eacc.gltf',
    black: '/media/work/mr-strongmans/cd4708a08348a76585966a0b938cea2c.gltf',
  };
  let tries = 0;
  (function wait() {
    if (window.THREE && THREE.GLTFLoader && THREE.RoomEnvironment) { start(); return; }
    if (++tries < 200) setTimeout(wait, 50);
  })();

  function start() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    // ink backdrop, so the white-and-lime tub stays legible
    const bgc = document.createElement('canvas'); bgc.width = 640; bgc.height = 400;
    const bx = bgc.getContext('2d'), bg = bx.createRadialGradient(320, 152, 0, 320, 152, 460);
    bg.addColorStop(0, '#232323'); bg.addColorStop(0.6, '#121212'); bg.addColorStop(1, '#0B0B0B');
    bx.fillStyle = bg; bx.fillRect(0, 0, 640, 400);
    const bgt = new THREE.CanvasTexture(bgc); bgt.encoding = THREE.sRGBEncoding; scene.background = bgt;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    const camera = new THREE.PerspectiveCamera(24, 1, 0.01, 10);
    const target = new THREE.Vector3(0, 0.092, 0);
    const key = new THREE.DirectionalLight(0xffffff, 1.25); key.position.set(-0.6, 0.6, 0.7); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8); rim.position.set(0.5, 0.3, -0.6); scene.add(rim);
    const stage = new THREE.Group(); scene.add(stage);
    const sc = document.createElement('canvas'); sc.width = sc.height = 256;
    const sx = sc.getContext('2d'), grd = sx.createRadialGradient(128, 128, 8, 128, 128, 128);
    grd.addColorStop(0, 'rgba(0,0,0,0.85)'); grd.addColorStop(0.42, 'rgba(0,0,0,0.4)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    sx.fillStyle = grd; sx.fillRect(0, 0, 256, 256);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.0005; scene.add(shadow);

    const loader = new THREE.GLTFLoader(), models = {};
    const load = (name) => models[name] ? Promise.resolve(models[name]) : new Promise((res, rej) => {
      loader.load(files[name], (g) => { const m = g.scene; m.visible = false; stage.add(m); models[name] = m; res(m); }, undefined, rej);
    });
    const show = (name) => Object.keys(models).forEach((k) => { models[k].visible = (k === name); });

    const FRONT = -0.2;
    let angle = FRONT, vel = 0, dragging = false, lastX = 0, lastT = 0, lastTouch = -1e9, whip = null;
    const idle = reduce ? 0 : 0.35;
    canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now(), d = (e.clientX - lastX) / Math.max(canvas.clientWidth, 1) * Math.PI * 2.2;
      angle += d; vel = d / Math.max((now - lastT) / 1000, 0.008); lastX = e.clientX; lastT = now; lastTouch = now;
    });
    const end = () => { dragging = false; canvas.style.cursor = ''; lastTouch = performance.now(); };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { angle -= Math.PI / 12; lastTouch = performance.now(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { angle += Math.PI / 12; lastTouch = performance.now(); e.preventDefault(); }
    });
    const ramp = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const switchTo = (name) => load(name).then(() => {
      if (reduce) { show(name); return; }
      const base = Math.round((angle - FRONT) / (Math.PI * 2)) * Math.PI * 2 + FRONT;
      whip = { from: angle, to: base + Math.PI * 2, t0: performance.now(), dur: 1100, swap: name, swapped: false }; vel = 0;
    });
    buttons.forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      switchTo(b.dataset.label);
    }));

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      const dist = w / h < 0.8 ? 1.05 : 0.78;
      camera.position.set(0, 0.15, dist); camera.lookAt(target); camera.updateProjectionMatrix();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    let prev = performance.now(), onScreen = true;
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; }).observe(canvas);
    function frame(now) {
      const dt = Math.min((now - prev) / 1000, 0.05); prev = now;
      if (whip) {
        const p = Math.min((now - whip.t0) / whip.dur, 1); angle = whip.from + (whip.to - whip.from) * ramp(p);
        if (!whip.swapped && p >= 0.5) { show(whip.swap); whip.swapped = true; }
        if (p >= 1) { whip = null; lastTouch = now; }
      } else if (!dragging) {
        angle += vel * dt; vel *= Math.pow(0.04, dt);
        if (Math.abs(vel) < 0.05 && now - lastTouch > 2500) angle += idle * dt;
      }
      stage.rotation.y = angle;
      if (onScreen) renderer.render(scene, camera); // only draw while the viewer is on screen
      requestAnimationFrame(frame);
    }
    load('final').then(() => {
      show('final'); resize(); if (loadingEl) loadingEl.remove(); requestAnimationFrame(frame);
      load('lime'); load('black');
    }).catch(() => { if (loadingEl) loadingEl.textContent = 'The 3D tub could not load.'; });
  }
})();
