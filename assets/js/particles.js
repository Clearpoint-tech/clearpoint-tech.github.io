(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');

  const COLORS  = ['#38bdf8', '#60a5fa', '#94a3b8', '#ff6b6b'];
  const SHAPES  = ['diamond', 'ring', 'plus'];
  const PER_STRAND   = 20;
  const AMPLITUDE    = 22;   // px horizontal swing
  const WAVELENGTH   = 220;  // px per full sine cycle
  const SCROLL_SPEED = 28;   // px/s upward drift
  const MIN_MARGIN   = 80;   // px of clear right margin required

  let W, H, centerX, active, strand = [], startTime = null;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    // Right edge of the 960px centered content wrapper (+20px clearance)
    const contentRight = Math.min(W, W / 2 + 500);
    const margin = W - contentRight;
    active  = margin >= MIN_MARGIN;
    centerX = contentRight + margin / 2;
  }

  function initStrand() {
    strand = [];
    for (let s = 0; s < 2; s++) {
      for (let i = 0; i < PER_STRAND; i++) {
        strand.push({
          s,
          i,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size:  rand(2.5, 4.5),
        });
      }
    }
  }

  function drawShape(shape, x, y, size) {
    if (shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(x,        y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x,        y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'ring') {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const arm = size * 1.3, t = Math.max(1, size * 0.35);
      ctx.fillRect(x - arm, y - t,   arm * 2, t * 2);
      ctx.fillRect(x - t,   y - arm, t * 2,   arm * 2);
    }
  }

  function loop(ts) {
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime) / 1000;

    ctx.clearRect(0, 0, W, H);

    if (active) {
      for (const p of strand) {
        const baseY = (p.i / PER_STRAND) * H;
        const y     = ((baseY - elapsed * SCROLL_SPEED) % H + H) % H;
        const phase = (y / WAVELENGTH) * Math.PI * 2 + p.s * Math.PI;
        const x     = centerX + AMPLITUDE * Math.sin(phase);

        // Depth: front of helix (sin > 0 for strand 0) appears brighter
        const depth     = 0.5 + 0.5 * Math.sin(phase - p.s * Math.PI);
        // Fade near edges to hide the wrap seam
        const edgeFade  = Math.min(y / 80, 1) * Math.min((H - y) / 80, 1);
        const alpha     = (0.18 + 0.32 * depth) * edgeFade;

        ctx.globalAlpha  = Math.max(0, alpha);
        ctx.fillStyle    = p.color;
        ctx.strokeStyle  = p.color;
        ctx.lineWidth    = 1.5;
        drawShape(p.shape, x, y, p.size);
      }
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  initStrand();
  requestAnimationFrame(loop);
})();
