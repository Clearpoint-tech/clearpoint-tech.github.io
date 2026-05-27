(function () {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const COLORS = {
    blue: '#38bdf8',
    softBlue: '#60a5fa',
    muted: '#94a3b8',
    coral: '#ff6b6b',
    text: '#cbd5f5'
  };

  const MIN_MARGIN = 110;
  const LINE_ALPHA = 0.26;
  const GRID_ALPHA = 0.04;
  const NODE_ALPHA = 0.52;
  const RISK_ALPHA = 0.22;

  let W = 0;
  let H = 0;
  let marginLeft = 0;
  let active = false;
  let startTime = null;
  let riskPoints = [];
  let pathNodes = [];

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const contentRight = Math.min(W, W / 2 + 420);
    marginLeft = contentRight;
    active = W - marginLeft >= MIN_MARGIN;

    layoutMotif();
  }

  function layoutMotif() {
    riskPoints = [];
    pathNodes = [];
    if (!active) return;

    const left = marginLeft + 28;
    const right = W - 42;
    const width = Math.max(160, right - left);
    const centerY = Math.min(Math.max(H * 0.32, 150), H - 210);
    const height = Math.min(360, Math.max(220, H * 0.42));

    // A deliberate "clear path" through complexity: three service pillars
    // becoming one prioritized route.
    pathNodes = [
      { x: left + width * 0.12, y: centerY + height * 0.28, label: 'risk', color: COLORS.coral },
      { x: left + width * 0.42, y: centerY + height * 0.04, label: 'secure', color: COLORS.blue },
      { x: left + width * 0.64, y: centerY + height * 0.35, label: 'automate', color: COLORS.softBlue },
      { x: left + width * 0.86, y: centerY + height * 0.10, label: 'deliver', color: COLORS.text }
    ];

    for (let i = 0; i < 18; i++) {
      riskPoints.push({
        x: left + rand(0, width),
        y: centerY - height * 0.12 + rand(0, height * 0.75),
        r: rand(1.2, 2.8),
        phase: rand(0, Math.PI * 2),
        color: i % 5 === 0 ? COLORS.coral : (i % 3 === 0 ? COLORS.muted : COLORS.blue)
      });
    }
  }

  function lineGradient(x1, y1, x2, y2, alpha) {
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, `rgba(255,107,107,${alpha * 0.85})`);
    g.addColorStop(0.45, `rgba(56,189,248,${alpha})`);
    g.addColorStop(1, `rgba(203,213,245,${alpha * 0.7})`);
    return g;
  }

  function drawGrid() {
    const left = marginLeft + 18;
    const right = W - 22;
    const top = 92;
    const bottom = Math.min(H - 56, 620);
    const step = 42;

    ctx.save();
    ctx.strokeStyle = `rgba(203,213,245,${GRID_ALPHA})`;
    ctx.lineWidth = 1;
    for (let x = left; x <= right; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    }
    for (let y = top; y <= bottom; y += step) {
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawClearpointMark(x, y, radius, pulse) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(56,189,248,${0.20 + pulse * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * 0.18, Math.PI * 1.82);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255,107,107,${0.16 + pulse * 0.06})`;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.62, Math.PI * 1.22, Math.PI * 0.10, true);
    ctx.stroke();

    ctx.fillStyle = `rgba(203,213,245,${0.15 + pulse * 0.05})`;
    ctx.beginPath();
    ctx.arc(x + radius * 0.48, y - radius * 0.06, radius * 0.10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawNodes(elapsed) {
    if (!pathNodes.length) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Route underlay
    ctx.lineWidth = 4;
    ctx.strokeStyle = lineGradient(pathNodes[0].x, pathNodes[0].y, pathNodes[pathNodes.length - 1].x, pathNodes[pathNodes.length - 1].y, 0.08);
    ctx.beginPath();
    ctx.moveTo(pathNodes[0].x, pathNodes[0].y);
    for (let i = 1; i < pathNodes.length; i++) {
      const a = pathNodes[i - 1];
      const b = pathNodes[i];
      const midX = (a.x + b.x) / 2;
      ctx.quadraticCurveTo(midX, a.y, b.x, b.y);
    }
    ctx.stroke();

    // Animated route highlight, intentionally slow.
    const t = reduceMotion ? 0.72 : (0.18 + 0.64 * (0.5 + 0.5 * Math.sin(elapsed * 0.18)));
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = lineGradient(pathNodes[0].x, pathNodes[0].y, pathNodes[pathNodes.length - 1].x, pathNodes[pathNodes.length - 1].y, LINE_ALPHA);
    ctx.setLineDash([90 * t, 420]);
    ctx.lineDashOffset = reduceMotion ? 0 : -elapsed * 14;
    ctx.beginPath();
    ctx.moveTo(pathNodes[0].x, pathNodes[0].y);
    for (let i = 1; i < pathNodes.length; i++) {
      const a = pathNodes[i - 1];
      const b = pathNodes[i];
      const midX = (a.x + b.x) / 2;
      ctx.quadraticCurveTo(midX, a.y, b.x, b.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < pathNodes.length; i++) {
      const n = pathNodes[i];
      const pulse = reduceMotion ? 0.5 : 0.5 + 0.5 * Math.sin(elapsed * 0.7 + i * 0.9);
      const outer = 14 + pulse * 2;

      ctx.fillStyle = `rgba(15,23,42,0.90)`;
      ctx.strokeStyle = n.color;
      ctx.globalAlpha = NODE_ALPHA + pulse * 0.16;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, outer, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.globalAlpha = 0.85;
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const mark = pathNodes[pathNodes.length - 1];
    drawClearpointMark(mark.x + 42, mark.y - 46, 28, reduceMotion ? 0.4 : 0.5 + 0.5 * Math.sin(elapsed * 0.35));
    ctx.restore();
  }

  function drawRiskPoints(elapsed) {
    ctx.save();
    for (const p of riskPoints) {
      const pulse = reduceMotion ? 0.35 : 0.5 + 0.5 * Math.sin(elapsed * 0.35 + p.phase);
      ctx.globalAlpha = RISK_ALPHA + pulse * 0.08;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + pulse * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSoftMask() {
    const g = ctx.createLinearGradient(marginLeft - 18, 0, W, 0);
    g.addColorStop(0, 'rgba(15,23,42,0.0)');
    g.addColorStop(0.18, 'rgba(15,23,42,0.10)');
    g.addColorStop(1, 'rgba(15,23,42,0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(marginLeft - 18, 0, W - marginLeft + 18, H);
  }

  function loop(ts) {
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime) / 1000;

    ctx.clearRect(0, 0, W, H);
    if (active) {
      drawSoftMask();
      drawGrid();
      drawRiskPoints(elapsed);
      drawNodes(elapsed);
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
})();
