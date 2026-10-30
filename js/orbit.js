/* ============================================================
   ORBIT — animated "solar system" of technologies (canvas).
   Only technologies from the skills list are shown.
   Edit the PLANETS array to add/remove a technology.
   Respects prefers-reduced-motion (draws one static frame) and
   pauses when off-screen or when the tab is hidden.
   ============================================================ */
(function () {
  'use strict';
  var cv = document.getElementById('orbit');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ring: 0 inner, 1 middle, 2 outer
  var PLANETS = [
    { n: 'JavaScript', a: 'JS',  c: '#f7df1e', ring: 0 },
    { n: 'Python',     a: 'Py',  c: '#4b8bbe', ring: 0 },
    { n: 'SQL',        a: 'SQL', c: '#f0a030', ring: 0 },
    { n: 'React',      a: 'Re',  c: '#61dafb', ring: 0 },
    { n: 'TypeScript', a: 'TS',  c: '#3b82f6', ring: 1 },
    { n: 'Node.js',    a: 'Nd',  c: '#5fa04e', ring: 1 },
    { n: 'Django',     a: 'Dj',  c: '#44b78b', ring: 1 },
    { n: 'PostgreSQL', a: 'Pg',  c: '#6a9fd8', ring: 1 },
    { n: 'HTML',       a: 'H5',  c: '#e34f26', ring: 1 },
    { n: 'CSS',        a: 'CSS', c: '#3d7bff', ring: 1 },
    { n: 'Express.js', a: 'Ex',  c: '#9aa4b2', ring: 2 },
    { n: 'Tailwind CSS', a: 'Tw', c: '#38bdf8', ring: 2 },
    { n: 'Bootstrap',  a: 'Bs',  c: '#8b6cf6', ring: 2 },
    { n: 'SQL Server', a: 'MS',  c: '#e0605e', ring: 2 },
    { n: 'Docker',     a: 'Dk',  c: '#2496ed', ring: 2 },
    { n: 'Git',        a: 'Git', c: '#f05032', ring: 2 },
    { n: 'GitHub',     a: 'GH',  c: '#c9d1d9', ring: 2 }
  ];
  var RING_F = [0.38, 0.68, 0.98];
  var RING_SPEED = [0.0125, -0.0085, 0.0058]; // radians per second *1/…; sign = direction

  var counts = [0, 0, 0];
  PLANETS.forEach(function (p) { counts[p.ring]++; });
  var seen = [0, 0, 0];
  PLANETS.forEach(function (p) {
    p.angle = (seen[p.ring]++ / counts[p.ring]) * Math.PI * 2 + p.ring * 0.7;
    p.scale = 1; p.x = 0; p.y = 0; p.depth = 0;
  });

  var W = 0, H = 0, dpr = 1, small = false, hover = null, visible = true, raf = 0, last = 0, started = false;
  var font = 'Inter, "IBM Plex Sans Arabic", system-ui, sans-serif';

  function size() {
    var r = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    small = W < 560;
    layout(); draw();
  }

  function layout() {
    var cx = W / 2, cy = H / 2, maxRx = W / 2 - (small ? 40 : 70);
    PLANETS.forEach(function (p) {
      var rx = maxRx * RING_F[p.ring];
      var ry = Math.min(rx * (small ? 0.85 : 0.4), H / 2 - (small ? 34 : 44));
      p.x = cx + Math.cos(p.angle) * rx;
      p.y = cy + Math.sin(p.angle) * ry;
      p.depth = Math.sin(p.angle); // -1 back … +1 front
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2, maxRx = W / 2 - (small ? 40 : 70);

    // orbit rings
    RING_F.forEach(function (f) {
      var rx = maxRx * f, ry = Math.min(rx * (small ? 0.85 : 0.4), H / 2 - (small ? 34 : 44));
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(140,160,255,0.14)'; ctx.lineWidth = 1; ctx.stroke();
    });

    // core
    var cr = small ? 26 : 36;
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 3.2);
    g.addColorStop(0, 'rgba(139,108,246,0.40)'); g.addColorStop(1, 'rgba(79,140,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, cr * 3.2, 0, Math.PI * 2); ctx.fill();
    var b = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, 2, cx, cy, cr);
    b.addColorStop(0, '#9db8ff'); b.addColorStop(1, '#5a3fd0');
    ctx.fillStyle = b; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 ' + (small ? 14 : 18) + 'px ' + font;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('</>', cx, cy + 1);

    // planets, back to front
    PLANETS.slice().sort(function (a, b2) { return a.y - b2.y; }).forEach(function (p) {
      var base = small ? 15 : 21;
      var ds = 0.82 + 0.18 * ((p.depth + 1) / 2);
      var r = base * ds * p.scale;
      var alpha = 0.7 + 0.3 * ((p.depth + 1) / 2);
      ctx.globalAlpha = alpha;
      var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.4);
      glow.addColorStop(0, p.c + (p === hover ? '70' : '38')); glow.addColorStop(1, p.c + '00');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.4, 0, Math.PI * 2); ctx.fill();
      var body = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, 1, p.x, p.y, r);
      body.addColorStop(0, 'rgba(255,255,255,0.55)'); body.addColorStop(0.35, p.c + 'cc'); body.addColorStop(1, p.c + '55');
      ctx.fillStyle = body; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = p.c + (p === hover ? 'ff' : '99'); ctx.lineWidth = p === hover ? 2 : 1; ctx.stroke();
      ctx.fillStyle = '#0a0f20'; ctx.font = '700 ' + Math.round(r * (p.a.length > 2 ? 0.58 : 0.72)) + 'px ' + font;
      ctx.fillText(p.a, p.x, p.y + 1);
      // name label
      ctx.fillStyle = p === hover ? '#ffffff' : 'rgba(205,215,240,0.82)';
      ctx.font = (p === hover ? '600 ' : '500 ') + (small ? 10 : 12) + 'px ' + font;
      ctx.textBaseline = 'top'; ctx.fillText(p.n, p.x, p.y + r + 4); ctx.textBaseline = 'middle';
      ctx.globalAlpha = 1;
    });
  }

  function frame(ts) {
    raf = 0;
    if (!visible || document.hidden) { last = 0; return; }
    var dt = last ? Math.min((ts - last) / 1000, 0.05) : 0; last = ts;
    PLANETS.forEach(function (p) {
      p.angle += RING_SPEED[p.ring] * 60 * dt * (p === hover ? 0.15 : 1) * 0.6;
      var target = p === hover ? 1.35 : 1;
      p.scale += (target - p.scale) * Math.min(1, dt * 10);
    });
    layout(); draw();
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!reduce && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }

  // hover (mouse / touch / pen)
  cv.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = null, bd = 1e9;
    PLANETS.forEach(function (p) {
      var d = Math.hypot(mx - p.x, my - p.y);
      if (d < (small ? 24 : 30) && d < bd) { bd = d; best = p; }
    });
    if (best !== hover) { hover = best; if (reduce) { PLANETS.forEach(function (p) { p.scale = p === hover ? 1.35 : 1; }); draw(); } }
  });
  cv.addEventListener('pointerleave', function () {
    hover = null; if (reduce) { PLANETS.forEach(function (p) { p.scale = 1; }); draw(); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }, { threshold: 0.05 }).observe(cv);
  }
  document.addEventListener('visibilitychange', start);
  window.addEventListener('resize', size);
  size(); start();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (reduce) draw(); });
})();
