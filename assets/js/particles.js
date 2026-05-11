(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');

  const COLORS     = ['#38bdf8', '#60a5fa', '#94a3b8', '#ff6b6b'];
  const SHAPES     = ['diamond', 'ring', 'plus'];
  const DOT_COUNT  = 22;
  const MIN_MARGIN = 80;
  const SWEEP_SPEED = 0.18;  // radians/s — full 360° ~35s

  let W, H, marginLeft, active, dots = [], startTime = null;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const contentRight = Math.min(W, W / 2 + 500);
    const margin = W - contentRight;
    active     = margin >= MIN_MARGIN;
    marginLeft = contentRight;
    placeDots();
  }

  function placeDots() {
    dots = [];
    if (!active) return;
    const usableW = W - marginLeft - 16;
    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x:     marginLeft + rand(12, usableW),
        y:     rand(0.04, 0.96) * H,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size:  rand(2.5, 4.2),
        base:  rand(0.10, 0.22),   // resting alpha
      });
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

    if (!active) { requestAnimationFrame(loop); return; }

    // Sweep line: angle rotates continuously, mapped to a Y position
    const sweepAngle = (elapsed * SWEEP_SPEED) % (Math.PI * 2);
    // Convert to a Y coordinate (0 = top, H = bottom) via sine
    const sweepY = (0.5 + 0.5 * Math.sin(sweepAngle)) * H;

    // Draw faint sweep line across the margin
    const grad = ctx.createLinearGradient(marginLeft, 0, W, 0);
    grad.addColorStop(0,   'rgba(56,189,248,0.0)');
    grad.addColorStop(0.3, 'rgba(56,189,248,0.08)');
    grad.addColorStop(1,   'rgba(56,189,248,0.0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(marginLeft, sweepY);
    ctx.lineTo(W,          sweepY);
    ctx.stroke();

    // Draw dots, brighten when near sweep line
    for (const d of dots) {
      const dist    = Math.abs(d.y - sweepY);
      const pulse   = Math.max(0, 1 - dist / 60);        // 60px activation band
      const alpha   = d.base + 0.55 * pulse * pulse;     // ease the spike

      ctx.globalAlpha = Math.min(1, alpha);
      ctx.fillStyle   = d.color;
      ctx.strokeStyle = d.color;
      ctx.lineWidth   = 1.5;
      drawShape(d.shape, d.x, d.y, d.size + pulse * 1.2);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  requestAnimationFrame(loop);
})();
