// 3D shapes, paint blobs and generic coloured objects for "ألواني وأشكالي".
const lib = require('../../animals-book/src/animals-art');
const { Ctx, darken, lighten } = lib;

function roundPoly(pts, r) {
  const n = pts.length, seg = [];
  for (let i = 0; i < n; i++) {
    const P = pts[i], A = pts[(i - 1 + n) % n], B = pts[(i + 1) % n];
    const toward = (Q) => { const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy); const t = Math.min(r / L, .45); return [P[0] + dx * t, P[1] + dy * t]; };
    seg.push([toward(A), P, toward(B)]);
  }
  const f = p => p.map(v => v.toFixed(1)).join(' ');
  let d = `M${f(seg[0][2])}`;
  for (let i = 1; i <= n; i++) { const [a, P, b] = seg[i % n]; d += ` L${f(a)} Q${f(P)} ${f(b)}`; }
  return d + ' Z';
}
const ring = (cx, cy, k, R, rot = -90, inner) => Array.from({ length: k }, (_, i) => {
  const a = (rot + i * 360 / k) * Math.PI / 180, r = inner && i % 2 ? inner : R;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});

function shapePath(t, cx, cy, s) {
  switch (t) {
    case 'circle': return `M${cx - s} ${cy} A${s} ${s} 0 1 0 ${cx + s} ${cy} A${s} ${s} 0 1 0 ${cx - s} ${cy} Z`;
    case 'square': return roundPoly([[cx - s, cy - s], [cx + s, cy - s], [cx + s, cy + s], [cx - s, cy + s]], s * .2);
    case 'rect': return roundPoly([[cx - 1.25 * s, cy - .75 * s], [cx + 1.25 * s, cy - .75 * s], [cx + 1.25 * s, cy + .75 * s], [cx - 1.25 * s, cy + .75 * s]], s * .18);
    case 'triangle': return roundPoly([[cx, cy - 1.1 * s], [cx + 1.18 * s, cy + .9 * s], [cx - 1.18 * s, cy + .9 * s]], s * .22);
    case 'star': return roundPoly(ring(cx, cy + .08 * s, 10, 1.15 * s, -90, .52 * s), s * .09);
    case 'heart': {
      const S = s * 1.15, y = cy + .05 * s;
      return `M${cx} ${y + S * .9} C${cx - S * 1.5} ${y - S * .1} ${cx - S * .9} ${y - S * 1.25} ${cx} ${y - S * .4} C${cx + S * .9} ${y - S * 1.25} ${cx + S * 1.5} ${y - S * .1} ${cx} ${y + S * .9} Z`;
    }
    case 'oval': return `M${cx - 1.25 * s} ${cy} A${1.25 * s} ${.85 * s} 0 1 0 ${cx + 1.25 * s} ${cy} A${1.25 * s} ${.85 * s} 0 1 0 ${cx - 1.25 * s} ${cy} Z`;
    case 'rhombus': return roundPoly([[cx, cy - 1.2 * s], [cx + .92 * s, cy], [cx, cy + 1.2 * s], [cx - .92 * s, cy]], s * .16);
    case 'hexagon': return roundPoly(ring(cx, cy, 6, 1.08 * s, -90), s * .14);
    case 'crescent': {
      const p1 = [cx + .5 * s, cy - .866 * s], p2 = [cx + .5 * s, cy + .866 * s];
      return `M${p1[0]} ${p1[1]} A${s} ${s} 0 1 0 ${p2[0]} ${p2[1]} A${s * .95} ${s * .95} 0 0 1 ${p1[0]} ${p1[1]} Z`;
    }
  }
}
const FACE_AT = { triangle: [0, .3, .8], star: [0, .12, .8], heart: [0, -.05, .9], crescent: [-.55, 0, .62], rect: [0, 0, .9], hexagon: [0, .02, .95] };

function shape3d(t, col, o = {}) {
  const c = new Ctx(), cx = 100, cy = 98, s = 62;
  const d = shapePath(t, cx, cy, s);
  c.shadow(cx, 190, 66, 8);
  c.raw(`<path d="${d}" transform="translate(0 ${s * .16})" fill="${darken(col, .32)}"/>`);
  c.path(d, col);
  c.shine(cx - s * .5 + (FACE_AT[t]?.[0] || 0) * s * .5, cy - s * .55 + (t === 'triangle' ? s * .45 : 0), s * .2, s * .1, -35, .75);
  if (o.face !== false) {
    const [fx, fy, fs] = FACE_AT[t] || [0, 0, 1];
    const dark = ['#3d3d5c', '#2e2e44'].includes(col);
    if (dark) for (const sx of [-1, 1]) c.raw(`<ellipse cx="${cx + fx * s + sx * 13 * fs * s / 42}" cy="${cy + fy * s - 4 * fs * s / 42}" rx="${8 * fs * s / 42}" ry="${9 * fs * s / 42}" fill="#fff"/>`);
    c.face(cx + fx * s, cy + fy * s, fs * s / 42, { mouth: dark ? false : undefined });
    if (dark) c.line(`M${cx - 6} ${cy + 8} Q${cx} ${cy + 15} ${cx + 6} ${cy + 8}`, '#fff', 2.8);
  }
  return c.svg('0 0 200 210', o.cls || '');
}
// flat outline icon (for activities / tracing)
function shapeIcon(t, o = {}) {
  const d = shapePath(t, 50, 52, 34);
  const style = o.dash ? `fill="none" stroke="#b7aecb" stroke-width="2.6" stroke-dasharray="4 5" stroke-linecap="round"`
    : o.fill ? `fill="${o.fill}" stroke="${darken(o.fill, .35)}" stroke-width="2.5"`
      : `fill="#fff" stroke="#2b2340" stroke-width="3"`;
  return `<svg viewBox="0 0 100 100" class="${o.cls || ''}"><path d="${d}" ${style} stroke-linejoin="round"/></svg>`;
}

function blobPath(cx, cy, r, seed = 1) {
  const k = 9, pts = [];
  for (let i = 0; i < k; i++) {
    const a = i * Math.PI * 2 / k, rr = r * (1 + .1 * Math.sin(i * 2.3 + seed) + .06 * Math.cos(i * 3.1 + seed * 2));
    pts.push([cx + rr * Math.cos(a), cy + rr * .9 * Math.sin(a)]);
  }
  let d = '';
  for (let i = 0; i < k; i++) {
    const p0 = pts[(i - 1 + k) % k], p1 = pts[i], p2 = pts[(i + 1) % k], p3 = pts[(i + 2) % k];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    if (!i) d = `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
    d += ` C${c1.map(v => v.toFixed(1)).join(' ')} ${c2.map(v => v.toFixed(1)).join(' ')} ${p2.map(v => v.toFixed(1)).join(' ')}`;
  }
  return d + ' Z';
}
function blob(col, o = {}) {
  const c = new Ctx();
  c.shadow(100, 192, 62, 8);
  for (const [x, len] of [[70, 40], [104, 56], [134, 34]]) {
    c.raw(`<rect x="${x - 7}" y="120" width="14" height="${len + 30}" rx="7" fill="${c.lg(col)}"/>`);
    c.ball(x, 150 + len, 10, col);
  }
  c.path(blobPath(100, 98, 66, o.seed || 1), col, { shine: [70, 62, 16, 8, -35, .75] });
  for (const [x, y, r] of [[160, 50, 9], [38, 140, 7], [168, 140, 6]]) c.ball(x, y, r, col);
  if (o.face !== false) {
    const dark = ['#3d3d5c', '#2e2e44', '#9a5f33'].includes(col);
    if (dark) for (const sx of [-1, 1]) c.raw(`<ellipse cx="${100 + sx * 15}" cy="${93}" rx="9" ry="10" fill="#fff"/>`);
    c.face(100, 98, 1.15, { mouth: dark ? false : undefined });
    if (dark) c.line('M93 106 Q100 114 107 106', '#fff', 3);
  }
  return c.svg('0 0 200 210', o.cls || '');
}
// generic coloured objects
function thing(kind, col, cls = '') {
  const c = new Ctx();
  if (kind === 'ball') { c.shadow(100, 186, 55); c.ball(100, 106, 66, col); c.line('M40 90 Q100 130 160 90', lighten(col, .35), 4); }
  if (kind === 'star') { c.shadow(100, 186, 55); c.star(100, 104, 82, col); c.face(100, 112, 1, {}); }
  if (kind === 'heart') { c.shadow(100, 186, 55); c.heart(100, 108, 62, col); c.face(100, 100, 1); }
  return c.svg('0 0 200 200', cls);
}

module.exports = { ...lib, shape3d, shapeIcon, shapePath, blob, thing };
