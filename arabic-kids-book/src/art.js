// 3D "clay toy" style SVG illustration library.
// Every shape is shaded with radial / cylindrical gradients, glossy highlights
// and soft ground shadows so it looks like a soft 3D render.

let UID = 0;

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
}
const lighten = (c, t) => mix(c, '#ffffff', t);
const darken = (c, t) => mix(c, '#1a1030', t);

class Ctx {
  constructor() {
    this.id = 'a' + (UID++) + '_';
    this.defs = [];
    this.body = [];
    this.cache = {};
    this.defs.push(
      `<filter id="${this.id}blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`,
      `<filter id="${this.id}soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>`
    );
  }
  // radial "sphere" gradient
  rg(c) {
    const k = 'r' + c;
    if (this.cache[k]) return this.cache[k];
    const id = `${this.id}g${Object.keys(this.cache).length}`;
    this.defs.push(`<radialGradient id="${id}" cx=".4" cy=".34" r=".78" fx=".34" fy=".26">
      <stop offset="0" stop-color="${lighten(c, .62)}"/>
      <stop offset=".28" stop-color="${lighten(c, .22)}"/>
      <stop offset=".68" stop-color="${c}"/>
      <stop offset="1" stop-color="${darken(c, .38)}"/></radialGradient>`);
    return (this.cache[k] = `url(#${id})`);
  }
  // cylinder gradient (horizontal)
  lg(c) {
    const k = 'l' + c;
    if (this.cache[k]) return this.cache[k];
    const id = `${this.id}g${Object.keys(this.cache).length}`;
    this.defs.push(`<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${darken(c, .3)}"/>
      <stop offset=".25" stop-color="${lighten(c, .35)}"/>
      <stop offset=".55" stop-color="${c}"/>
      <stop offset="1" stop-color="${darken(c, .35)}"/></linearGradient>`);
    return (this.cache[k] = `url(#${id})`);
  }
  // vertical gradient (for flat-ish faces)
  vg(c) {
    const k = 'v' + c;
    if (this.cache[k]) return this.cache[k];
    const id = `${this.id}g${Object.keys(this.cache).length}`;
    this.defs.push(`<linearGradient id="${id}" x1="0" x2=".3" y1="0" y2="1">
      <stop offset="0" stop-color="${lighten(c, .35)}"/>
      <stop offset=".5" stop-color="${c}"/>
      <stop offset="1" stop-color="${darken(c, .3)}"/></linearGradient>`);
    return (this.cache[k] = `url(#${id})`);
  }
  edge(c) { return `stroke="${darken(c, .45)}" stroke-opacity=".35" stroke-width="1.3"`; }
  raw(s) { this.body.push(s); return this; }
  shadow(cx, cy, rx, ry = 9, op = .22) {
    return this.raw(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a1030" opacity="${op}" filter="url(#${this.id}blur)"/>`);
  }
  shine(x, y, rx, ry, rot = -30, op = .7) {
    return this.raw(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="#fff" opacity="${op}" filter="url(#${this.id}soft)"/>`);
  }
  ball(cx, cy, r, c, o = {}) {
    this.raw(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${this.rg(c)}" ${this.edge(c)}/>`);
    if (o.shine !== false) this.shine(cx - r * .38, cy - r * .42, r * .28, r * .15, -35, o.op ?? .75);
    return this;
  }
  ell(cx, cy, rx, ry, c, o = {}) {
    const rot = o.rot || 0;
    this.raw(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="${o.flat ? c : this.rg(c)}" ${o.noEdge ? '' : this.edge(c)} ${o.opacity ? `opacity="${o.opacity}"` : ''}/>`);
    if (o.shine) {
      const a = (rot - 90) * Math.PI / 180;
      const sx = cx - rx * .35 * Math.cos(rot * Math.PI / 180) + ry * .1 * Math.sin(rot * Math.PI / 180);
      const sy = cy - ry * .45;
      this.shine(sx, sy, Math.max(rx, ry) * .26, Math.min(rx, ry) * .14, rot - 30, .7);
    }
    return this;
  }
  path(d, c, o = {}) {
    const fill = o.flat ? c : o.cyl ? this.lg(c) : o.vert ? this.vg(c) : this.rg(c);
    this.raw(`<path d="${d}" fill="${fill}" ${o.noEdge ? '' : this.edge(c)} ${o.opacity ? `opacity="${o.opacity}"` : ''} stroke-linejoin="round"/>`);
    if (o.shine) this.shine(...o.shine);
    return this;
  }
  line(d, c, w = 4) {
    return this.raw(`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  cyl(x, y, w, h, c, ry = 8, o = {}) {
    const cx = x + w / 2;
    this.raw(`<ellipse cx="${cx}" cy="${y + h}" rx="${w / 2}" ry="${ry}" fill="${this.lg(c)}" ${this.edge(c)}/>`);
    this.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this.lg(c)}"/>`);
    this.raw(`<path d="M${x} ${y} V${y + h} M${x + w} ${y} V${y + h}" ${this.edge(c)}/>`);
    const top = o.top || lighten(c, .25);
    this.raw(`<ellipse cx="${cx}" cy="${y}" rx="${w / 2}" ry="${ry}" fill="${this.rg(top)}" ${this.edge(c)}/>`);
    this.shine(x + w * .22, y + h * .5, w * .05, h * .3, 0, .45);
    return this;
  }
  drop(x, y, s, c) {
    return this.path(`M${x} ${y - 12 * s} Q${x + 9 * s} ${y + 1 * s} ${x} ${y + 6 * s} Q${x - 9 * s} ${y + 1 * s} ${x} ${y - 12 * s} Z`, c,
      { shine: [x - 2.5 * s, y - 1 * s, 1.6 * s, 3 * s, 15, .8] });
  }
  heart(cx, cy, s, c) {
    const d = `M${cx} ${cy + s * .9} C${cx - s * 1.5} ${cy - s * .1} ${cx - s * .9} ${cy - s * 1.25} ${cx} ${cy - s * .4} C${cx + s * .9} ${cy - s * 1.25} ${cx + s * 1.5} ${cy - s * .1} ${cx} ${cy + s * .9} Z`;
    return this.path(d, c, { shine: [cx - s * .5, cy - s * .45, s * .22, s * .12, -35, .8] });
  }
  star(cx, cy, r, c = '#ffd23f', rot = 0) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2 + rot * Math.PI / 180;
      const rr = i % 2 ? r * .5 : r;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) + ' ';
    }
    return this.path(d + 'Z', c, { shine: [cx - r * .25, cy - r * .3, r * .2, r * .1, -30, .8] });
  }
  face(cx, cy, s = 1, o = {}) {
    // Ctx.faceMode ('sleep' | 'sad') lets a book re-use any character with another expression
    if (Ctx.faceMode && !o.keep) o = { ...o, mode: Ctx.faceMode };
    const ink = '#2b2340';
    const ex = 13 * s, ey = cy - 4 * s;
    if (o.mode === 'sad') {
      for (const sx of [-1, 1]) {
        const x = cx + sx * ex;
        this.raw(`<ellipse cx="${x}" cy="${ey + 1 * s}" rx="${4.6 * s}" ry="${5.6 * s}" fill="${ink}"/><circle cx="${x + 1.4 * s}" cy="${ey - 1.4 * s}" r="${1.8 * s}" fill="#fff"/>`);
        this.line(`M${x - 6 * s * sx} ${ey - 10 * s} L${x + 4 * s * sx} ${ey - 7 * s}`, ink, 2.2 * s);
      }
      const my = cy + 10 * s + (o.mouthDy || 0) * s;
      this.line(`M${cx - 6 * s} ${my} Q${cx} ${my - 6 * s} ${cx + 6 * s} ${my}`, ink, 2.5 * s);
      this.raw(`<path d="M${cx + ex + 2 * s} ${ey + 6 * s} q${3 * s} ${6 * s} 0 ${9 * s} q${-3 * s} ${-3 * s} 0 ${-9 * s} Z" fill="#6cc4ff"/>`);
      return this;
    }
    if (o.mode === 'sleep') {
      this.line(`M${cx - ex - 5 * s} ${ey} Q${cx - ex} ${ey + 5 * s} ${cx - ex + 5 * s} ${ey}`, ink, 2.6 * s);
      this.line(`M${cx + ex - 5 * s} ${ey} Q${cx + ex} ${ey + 5 * s} ${cx + ex + 5 * s} ${ey}`, ink, 2.6 * s);
    } else {
      for (const sx of [-1, 1]) {
        const x = cx + sx * ex;
        this.raw(`<ellipse cx="${x}" cy="${ey}" rx="${5 * s}" ry="${6.5 * s}" fill="${ink}"/>`);
        this.raw(`<circle cx="${x + 1.6 * s}" cy="${ey - 2.6 * s}" r="${2.1 * s}" fill="#fff"/>`);
        this.raw(`<circle cx="${x - 1.8 * s}" cy="${ey + 2.6 * s}" r="${.9 * s}" fill="#fff" opacity=".8"/>`);
      }
    }
    if (o.blush !== false) for (const sx of [-1, 1])
      this.raw(`<ellipse cx="${cx + sx * 22 * s}" cy="${cy + 6 * s}" rx="${6 * s}" ry="${3.4 * s}" fill="#ff6f91" opacity=".45" filter="url(#${this.id}soft)"/>`);
    const my = cy + 6 * s + (o.mouthDy || 0) * s;
    if (o.mouth === false) return this;
    if (o.mouth === 'open') {
      this.raw(`<path d="M${cx - 7 * s} ${my - 1 * s} Q${cx} ${my + 13 * s} ${cx + 7 * s} ${my - 1 * s} Z" fill="#c2364f" stroke="${ink}" stroke-width="${2 * s}" stroke-linejoin="round"/>`);
      this.raw(`<ellipse cx="${cx}" cy="${my + 5.5 * s}" rx="${3.2 * s}" ry="${2 * s}" fill="#ff8fa3"/>`);
    } else {
      this.line(`M${cx - 6 * s} ${my} Q${cx} ${my + 6.5 * s} ${cx + 6 * s} ${my}`, ink, 2.5 * s);
    }
    return this;
  }
  svg(vb = '0 0 200 200', cls = '') {
    return `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><defs>${this.defs.join('')}</defs>${this.body.join('')}</svg>`;
  }
}

const A = {};

A.rabbit = c => {
  c.shadow(100, 186, 58);
  for (const sx of [-1, 1]) {
    c.ell(100 + sx * 20, 46, 12, 32, '#f1ebf8', { rot: sx * 12 });
    c.ell(100 + sx * 20, 49, 6, 21, '#ffb0c8', { rot: sx * 12, noEdge: true });
  }
  c.ell(100, 148, 48, 38, '#efe8f7');
  c.ell(100, 155, 26, 22, '#ffffff');
  c.ell(64, 145, 11, 16, '#e9e0f4', { rot: 25 }).ell(136, 145, 11, 16, '#e9e0f4', { rot: -25 });
  c.ell(76, 182, 17, 9, '#e6ddf1').ell(124, 182, 17, 9, '#e6ddf1');
  c.ball(100, 95, 39, '#f5f0fb');
  c.face(100, 98, 1.05, { mouthDy: 3 });
  c.ell(100, 101, 4.5, 3.2, '#ff7fa5', { noEdge: true });
};

A.duck = c => {
  c.ell(105, 182, 82, 13, '#6fd0ff', { shine: true });
  c.ell(110, 138, 58, 40, '#ffd23f', { shine: true });
  c.ell(130, 130, 27, 17, '#ffbf1f', { rot: -15 });
  c.ell(160, 118, 12, 8, '#ffd23f', { rot: -40 });
  c.ball(78, 84, 33, '#ffdb4d');
  c.ell(46, 94, 17, 8, '#ff8a1a');
  c.ell(46, 100, 13, 5, '#f07610', { noEdge: true });
  c.face(82, 82, .85, { mouth: false });
  c.ball(78, 50, 6, '#ffdb4d', { shine: false });
};

A.apple = c => {
  c.shadow(100, 186, 55);
  c.ell(103, 45, 4.5, 17, '#8b5a2b', { rot: 12 });
  c.path('M100 62 C70 40 28 60 34 110 C40 160 75 186 100 172 C125 186 162 160 166 110 C172 60 130 40 100 62 Z', '#ff3b4f',
    { shine: [66, 82, 14, 7, -40, .75] });
  c.ell(126, 40, 19, 9, '#45d36a', { rot: -25 });
  c.face(100, 116, 1.15);
};

A.snowman = c => {
  for (const [x, y, r] of [[30, 40, 5], [170, 55, 6], [40, 120, 4], [165, 140, 5], [150, 25, 3], [25, 85, 3]]) c.ball(x, y, r, '#e3f1ff');
  c.shadow(100, 188, 55);
  c.line('M60 138 L32 118 M42 125 L36 112', '#8b5a2b', 4).line('M140 138 L168 118 M158 125 L164 112', '#8b5a2b', 4);
  c.ball(100, 146, 44, '#eaf4ff');
  c.ball(100, 132, 5, '#3d3d5c', { shine: false }).ball(100, 152, 5, '#3d3d5c', { shine: false });
  c.ball(100, 80, 32, '#f3f8ff');
  c.ell(100, 107, 31, 9, '#ff4757');
  c.ell(118, 124, 8, 16, '#ff4757', { rot: -15 });
  c.cyl(80, 26, 40, 26, '#3d3d5c', 6);
  c.raw('<rect x="80" y="42" width="40" height="7" fill="#ff4757"/>');
  c.ell(100, 52, 34, 7, '#3d3d5c');
  c.face(100, 78, .95, { mouthDy: 3 });
  c.path('M100 80 L126 86 L100 91 Z', '#ff8a1f', { noEdge: true });
};

A.carrot = c => {
  c.shadow(100, 186, 40);
  c.ell(86, 44, 9, 24, '#36c45d', { rot: -25 }).ell(114, 44, 9, 24, '#36c45d', { rot: 25 }).ell(100, 38, 9, 28, '#4cd964');
  c.path('M66 72 Q100 54 134 72 Q144 84 132 100 L108 176 Q100 190 92 176 L68 100 Q56 84 66 72 Z', '#ff8a1f', { shine: [80, 86, 10, 5, -50, .7] });
  c.line('M80 130 L90 128 M112 145 L120 143 M88 158 L95 157', '#d96a0c', 2.5);
  c.face(100, 96, .95);
};

A.whale = c => {
  c.ell(100, 178, 92, 14, '#4fc3f7', { shine: true });
  c.drop(80, 40, 1, '#8fd6ff').drop(96, 28, 1.2, '#8fd6ff').drop(112, 40, 1, '#8fd6ff');
  c.path('M150 112 C165 98 175 78 192 72 C186 94 190 108 196 122 C180 120 166 126 156 132 Z', '#2f7de8');
  c.path('M28 120 C28 70 92 52 132 68 C162 80 168 110 162 130 C150 162 58 166 28 120 Z', '#3a8dff', { shine: [62, 78, 18, 8, -20, .7] });
  c.path('M44 134 C70 160 130 160 154 134 C130 150 70 150 44 134 Z', '#cfeaff', { noEdge: true });
  c.ell(104, 140, 15, 8, '#2f7de8', { rot: 30 });
  c.face(78, 110, 1.05);
};

A.sheep = c => {
  c.shadow(100, 188, 55);
  c.cyl(72, 150, 13, 30, '#4a4458', 4).cyl(115, 150, 13, 30, '#4a4458', 4);
  for (const [x, y, r] of [[68, 100, 24], [96, 82, 27], [128, 90, 25], [142, 118, 23], [122, 142, 25], [86, 144, 25], [60, 128, 23], [100, 116, 32]])
    c.ball(x, y, r, '#f7f4ec');
  c.ell(72, 104, 13, 7, '#e8c7a8', { rot: -25 }).ell(128, 104, 13, 7, '#e8c7a8', { rot: 25 });
  c.ell(100, 116, 24, 27, '#ffe2c6');
  for (const [x, y, r] of [[89, 90, 10], [100, 85, 11], [111, 90, 10]]) c.ball(x, y, r, '#ffffff');
  c.face(100, 118, .85);
};

A.bear = c => {
  c.shadow(100, 188, 58);
  c.ball(66, 58, 17, '#b5733f').ball(134, 58, 17, '#b5733f');
  c.ball(66, 58, 8, '#eab98f', { shine: false }).ball(134, 58, 8, '#eab98f', { shine: false });
  c.ell(100, 152, 46, 34, '#a8693a');
  c.ell(100, 157, 26, 21, '#eab98f');
  c.ell(58, 148, 12, 18, '#a8693a', { rot: 25 }).ell(142, 148, 12, 18, '#a8693a', { rot: -25 });
  c.ell(76, 182, 16, 9, '#9a5f33').ell(124, 182, 16, 9, '#9a5f33');
  c.ball(100, 96, 42, '#b5733f');
  c.ell(100, 112, 19, 14, '#f2cba3');
  c.ell(100, 106, 7, 5, '#3b2414');
  c.face(100, 96, 1, { mouthDy: 12 });
};

A.corn = c => {
  c.shadow(100, 188, 45);
  c.ell(100, 98, 30, 70, '#ffc93b');
  for (let y = 38; y <= 165; y += 10.5)
    for (let x = 74; x <= 126; x += 10.5) {
      const xx = x + ((Math.round((y - 38) / 10.5) % 2) ? 5 : 0);
      if (((xx - 100) / 26) ** 2 + ((y - 98) / 64) ** 2 < 1) c.ball(xx, y, 5, '#ffd84d', { op: .6 });
    }
  c.path('M100 182 C58 172 42 120 58 76 C70 120 84 150 102 170 Z', '#4cd964', { shine: [62, 120, 4, 14, 10, .5] });
  c.path('M100 182 C142 172 158 120 142 76 C130 120 116 150 98 170 Z', '#36c45d');
  c.face(100, 104, .95);
};

A.pomegranate = c => {
  c.shadow(100, 188, 55);
  c.path('M84 58 L86 36 L94 48 L100 30 L106 48 L114 36 L116 58 Z', '#c41e3a');
  c.ball(100, 112, 60, '#e8264d', { op: .7 });
  c.ell(140, 48, 18, 8, '#45d36a', { rot: -30 });
  c.face(100, 116, 1.2);
};

A.flower = c => {
  c.ell(100, 184, 70, 12, '#7ee081', { shine: true });
  c.line('M100 110 Q94 150 100 182', '#3cb95a', 8);
  c.ell(78, 158, 20, 9, '#4cd964', { rot: 30 }).ell(122, 148, 20, 9, '#4cd964', { rot: -30 });
  for (let i = 0; i < 7; i++) {
    const a = i * Math.PI * 2 / 7 - Math.PI / 2;
    const x = 100 + 36 * Math.cos(a), y = 82 + 36 * Math.sin(a);
    c.ell(x.toFixed(1), y.toFixed(1), 18, 25, '#ff6fae', { rot: (a * 180 / Math.PI + 90).toFixed(1) });
  }
  c.ball(100, 82, 26, '#ffd23f');
  c.face(100, 84, .85);
};

A.fish = c => {
  for (const [x, y, r] of [[40, 50, 7], [30, 30, 5], [52, 22, 4]])
    c.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="#bfe9ff" opacity=".7" stroke="#7fcff5"/>`).shine(x - r * .35, y - r * .4, r * .3, r * .15, -30, .9);
  c.path('M84 66 Q106 36 128 68 Z', '#ff7a3d');
  c.path('M142 100 L188 68 Q176 100 188 132 Z', '#ff7a3d');
  c.ell(100, 102, 56, 42, '#ff9f43', { shine: true });
  c.ell(122, 102, 6, 33, '#fff1df', { noEdge: true, opacity: .85 });
  c.ell(140, 102, 5, 24, '#fff1df', { noEdge: true, opacity: .85 });
  c.ell(108, 128, 13, 7, '#ff7a3d', { rot: 30 });
  c.face(78, 98, .95, { mouth: 'open' });
  c.shadow(100, 186, 45, 7, .15);
};

A.sun = c => {
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    const p = (r, d) => [100 + r * Math.cos(a + d), 100 + r * Math.sin(a + d)].map(v => v.toFixed(1)).join(' ');
    c.path(`M${p(58, -.17)} L${p(92, 0)} L${p(58, .17)} Z`, '#ff9f1c');
  }
  c.ball(100, 100, 58, '#ffd23f');
  c.face(100, 104, 1.35, { mouth: 'open' });
};

A.rocket = c => {
  for (const [x, y, r] of [[30, 40, 8], [170, 150, 7], [160, 30, 6], [35, 160, 5]]) c.star(x, y, r);
  c.raw('<g transform="rotate(30 100 100)">');
  c.path('M84 148 Q100 205 116 148 Z', '#ff9f1c', { noEdge: true });
  c.path('M90 148 Q100 185 110 148 Z', '#ffe14d', { noEdge: true });
  c.path('M76 112 L50 158 L80 148 Z', '#ff4757').path('M124 112 L150 158 L120 148 Z', '#ff4757');
  c.path('M100 18 C132 44 132 120 122 150 L78 150 C68 120 68 44 100 18 Z', '#f1f2f6', { cyl: true });
  c.path('M100 18 C114 30 121 42 124 54 L76 54 C79 42 86 30 100 18 Z', '#ff4757', { cyl: true });
  c.raw('<circle cx="100" cy="90" r="19" fill="#a4b0be"/>');
  c.ball(100, 90, 14, '#4fc3f7');
  c.ell(100, 146, 5, 15, '#ff4757');
  c.raw('</g>');
};

A.frog = c => {
  c.ell(100, 180, 84, 15, '#2ecc71', { shine: true });
  c.ell(52, 160, 23, 12, '#3ccf63').ell(148, 160, 23, 12, '#3ccf63');
  c.ell(100, 134, 56, 42, '#4cd964', { shine: true });
  c.ell(100, 146, 32, 24, '#c9f7a6', { noEdge: true });
  c.ball(70, 82, 21, '#4cd964').ball(130, 82, 21, '#4cd964');
  for (const x of [70, 130]) {
    c.ball(x, 82, 13, '#ffffff', { shine: false });
    c.raw(`<circle cx="${x + 1}" cy="84" r="7" fill="#2b2340"/><circle cx="${x + 3.5}" cy="80.5" r="2.6" fill="#fff"/>`);
  }
  c.line('M66 116 Q100 142 134 116', '#2b2340', 3.4);
  c.raw(`<ellipse cx="60" cy="112" rx="8" ry="4.5" fill="#ff6f91" opacity=".5"/><ellipse cx="140" cy="112" rx="8" ry="4.5" fill="#ff6f91" opacity=".5"/>`);
  c.ell(76, 172, 14, 7, '#3ccf63').ell(124, 172, 14, 7, '#3ccf63');
};

A.plane = c => {
  for (const [x, y, s] of [[40, 160, 1], [160, 40, .8]]) {
    c.ball(x - 12 * s, y, 11 * s, '#ffffff').ball(x + 2 * s, y - 6 * s, 14 * s, '#ffffff').ball(x + 16 * s, y + 1 * s, 10 * s, '#ffffff');
  }
  c.path('M100 92 L84 52 L106 52 L128 90 Z', '#2563d6');
  c.path('M40 92 L28 56 L50 56 L66 88 Z', '#ff4757');
  c.path('M26 102 C26 86 46 80 70 80 L148 82 C176 84 188 94 188 102 C188 112 172 118 148 120 L62 122 C40 122 26 116 26 102 Z', '#4a90ff',
    { vert: true, shine: [80, 88, 34, 4, 0, .6] });
  c.path('M156 86 C172 88 182 94 184 100 L160 100 Z', '#bde6ff', { noEdge: true });
  for (let x = 72; x <= 132; x += 15) c.ball(x, 100, 5.5, '#dff3ff', { op: .6 });
  c.path('M98 106 L72 152 L98 152 L130 110 Z', '#2f6fe0');
  c.shadow(105, 186, 60, 7, .15);
};

A.envelope = c => {
  c.heart(40, 45, 10, '#ff6f91').heart(165, 38, 8, '#ff8fab').heart(160, 160, 7, '#ff6f91');
  c.shadow(100, 175, 66, 8);
  c.raw(`<rect x="34" y="62" width="132" height="100" rx="12" fill="${c.vg('#ffd99a')}" ${c.edge('#ffd99a')}/>`);
  c.line('M40 156 L90 116 M160 156 L110 116', '#e8b56a', 2.5);
  c.path('M38 68 L100 122 L162 68 Z', '#ffe7bd', { vert: true });
  c.heart(100, 118, 15, '#ff3b5c');
  c.face(100, 145, .7, { blush: false });
};

A.grapes = c => {
  c.shadow(100, 192, 40);
  c.line('M100 52 Q102 36 112 28', '#7b4a24', 5);
  c.path('M112 34 C130 18 158 26 160 44 C144 42 128 50 112 34 Z', '#45d36a');
  const rows = [[[72, 100, 128], 66], [[58, 86, 114, 142], 92], [[72, 100, 128], 118], [[86, 114], 144], [[100], 168]];
  for (const [xs, y] of rows) for (const x of xs) c.ball(x, y, 16, '#9b59d6');
  c.face(100, 120, .7);
};

A.cloud = c => {
  const cols = ['#ff5e5e', '#ffa63d', '#ffe14d', '#4cd964', '#4fa8ff', '#9b6bff'];
  cols.forEach((col, i) => c.raw(`<path d="M${20 + i * 8} 150 A${80 - i * 8} ${80 - i * 8} 0 0 1 ${180 - i * 8} 150" fill="none" stroke="${col}" stroke-width="8"/>`));
  c.ell(100, 122, 64, 24, '#f2f8ff');
  for (const [x, y, r] of [[64, 106, 30], [100, 86, 38], [138, 100, 32], [80, 124, 26], [122, 124, 28]]) c.ball(x, y, r, '#f4f9ff');
  c.face(100, 110, 1.05);
  c.drop(70, 170, 1, '#4fb3ff').drop(100, 182, 1, '#4fb3ff').drop(130, 170, 1, '#4fb3ff');
};

A.strawberry = c => {
  c.shadow(100, 188, 45);
  c.path('M100 184 C54 162 34 102 54 76 C70 58 130 58 146 76 C166 102 146 162 100 184 Z', '#ff3b5c', { shine: [68, 92, 12, 6, -55, .75] });
  for (const [x, y] of [[72, 100], [128, 100], [80, 140], [120, 140], [100, 160], [62, 125], [138, 125], [100, 78]])
    c.ell(x, y, 2.4, 3.6, '#ffe066', { flat: true, noEdge: true });
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * .55;
    c.ell((100 + 18 * Math.cos(a + Math.PI)).toFixed(1), (66 - 6 * Math.sin(a)).toFixed(1), 16, 7, '#3ccf63', { rot: ((a + Math.PI) * 180 / Math.PI).toFixed(0) });
  }
  c.ell(100, 50, 4, 12, '#2fae52');
  c.face(100, 118, 1.05);
};

A.moon = c => {
  c.star(160, 50, 12).star(150, 140, 9, '#ffe066', 20).star(40, 40, 7);
  c.raw(`<mask id="${c.id}m"><rect width="200" height="200" fill="#fff"/><circle cx="128" cy="78" r="56" fill="#000"/></mask>`);
  c.shadow(90, 186, 45, 7, .15);
  c.raw(`<g mask="url(#${c.id}m)"><circle cx="92" cy="104" r="66" fill="${c.rg('#ffd84d')}" ${c.edge('#ffd84d')}/></g>`);
  c.shine(58, 70, 12, 6, -50, .7);
  c.face(62, 118, .85, { mode: 'sleep' });
};

A.cake = c => {
  c.ell(100, 176, 78, 13, '#e4ebf3');
  c.cyl(38, 124, 124, 48, '#ff8fb1', 13);
  c.path('M38 124 Q38 142 48 140 Q54 150 60 137 Q70 146 80 136 Q92 150 100 137 Q110 148 120 136 Q132 148 140 137 Q150 146 156 137 Q162 140 162 124 Z', '#fff4f8', { noEdge: true });
  c.cyl(58, 88, 84, 40, '#ffe7c4', 10);
  for (const [x, y, col] of [[72, 108, '#4fc3f7'], [95, 116, '#ff4757'], [118, 106, '#4cd964'], [130, 118, '#9b59d6'], [84, 120, '#ffd23f']])
    c.raw(`<rect x="${x}" y="${y}" width="8" height="3" rx="1.5" fill="${col}" transform="rotate(${x % 50 - 25} ${x} ${y})"/>`);
  c.cyl(84, 56, 9, 32, '#4fc3f7', 3).cyl(107, 56, 9, 32, '#ffd23f', 3);
  c.drop(88.5, 46, .9, '#ff9f1c').drop(111.5, 46, .9, '#ff9f1c');
  c.face(100, 152, .9);
};

A.lemon = c => {
  c.shadow(100, 180, 55);
  c.raw('<g transform="rotate(-15 100 105)">');
  c.ell(40, 105, 9, 7, '#ffe14d').ell(160, 105, 9, 7, '#ffe14d');
  c.ell(100, 105, 62, 48, '#ffe14d', { shine: true });
  c.raw('</g>');
  c.ell(134, 52, 22, 10, '#45d36a', { rot: -35 });
  c.face(100, 110, 1.15);
};

A.banana = c => {
  c.shadow(105, 180, 60);
  c.path('M44 62 C44 142 122 182 172 118 C178 110 172 102 162 108 C124 142 70 126 62 62 Z', '#ffd93b', { shine: [58, 110, 5, 18, -30, .6] });
  c.line('M60 70 C66 120 110 140 150 120', '#f0b90b', 2);
  c.ell(53, 58, 8, 7, '#6b4423').ell(170, 112, 5, 5, '#6b4423');
  c.face(108, 136, .75);
};

A.bee = c => {
  c.ell(76, 58, 20, 30, '#e3f5ff', { rot: -30, opacity: .9, shine: true }).ell(124, 58, 20, 30, '#e3f5ff', { rot: 30, opacity: .9, shine: true });
  c.line('M88 72 Q80 40 70 34 M112 72 Q120 40 130 34', '#2d2a3e', 3);
  c.ball(70, 33, 6, '#2d2a3e').ball(130, 33, 6, '#2d2a3e');
  c.shadow(100, 186, 45);
  c.raw(`<clipPath id="${c.id}bc"><circle cx="100" cy="116" r="54"/></clipPath>`);
  c.ball(100, 116, 54, '#ffd23f', { shine: false });
  c.raw(`<g clip-path="url(#${c.id}bc)" opacity=".92"><rect x="40" y="128" width="120" height="13" fill="#2d2a3e"/><rect x="40" y="152" width="120" height="13" fill="#2d2a3e"/></g>`);
  c.shine(78, 84, 15, 8, -35, .7);
  c.face(100, 104, 1.05);
};

A.gift = c => {
  for (const [x, y, col, r] of [[30, 40, '#ff6f91', 20], [170, 50, '#4fc3f7', -15], [165, 160, '#4cd964', 30], [35, 150, '#9b59d6', 10]])
    c.raw(`<rect x="${x}" y="${y}" width="10" height="5" rx="2" fill="${col}" transform="rotate(${r} ${x} ${y})"/>`);
  c.shadow(102, 182, 62);
  c.path('M45 96 L75 80 L157 80 L127 96 Z', '#ff6b78', { vert: true, noEdge: true });
  c.path('M127 96 L157 80 L157 160 L127 176 Z', '#d93445', { flat: true });
  c.path('M45 96 L127 96 L127 176 L45 176 Z', '#ff4757', { vert: true });
  c.raw('<path d="M80 96 L110 80 L122 80 L92 96 Z M127 130 L157 114 L157 126 L127 142 Z" fill="#ffd23f"/>');
  c.raw(`<rect x="79" y="96" width="14" height="80" fill="${c.lg('#ffd23f')}"/><rect x="45" y="130" width="82" height="12" fill="${c.vg('#ffd23f')}"/>`);
  c.ell(88, 70, 17, 10, '#ffd23f', { rot: -25 }).ell(118, 70, 17, 10, '#ffd23f', { rot: 25 });
  c.ball(103, 78, 8, '#ffc107');
  c.face(86, 160, .75);
};

A.rose = c => {
  c.line('M100 96 Q96 120 100 145', '#3cb95a', 6);
  c.ell(84, 124, 14, 6, '#4cd964', { rot: 30 }).ell(116, 118, 14, 6, '#4cd964', { rot: -30 });
  c.ell(68, 76, 18, 26, '#e0194f', { rot: -30 }).ell(132, 76, 18, 26, '#e0194f', { rot: 30 });
  c.ball(100, 70, 36, '#ff2e63');
  c.line('M100 58 C116 58 116 80 100 82 C84 82 84 64 99 64 C108 64 108 74 100 74', '#b8123f', 3);
  c.line('M76 76 C80 98 120 98 124 76', '#b8123f', 2.5);
  c.shadow(100, 190, 45);
  c.path('M62 140 L138 140 L126 186 L74 186 Z', '#e67e22', { cyl: true });
  c.cyl(56, 136, 88, 10, '#f39c4a', 5);
  c.face(100, 166, .8);
};

A.pumpkin = c => {
  c.shadow(100, 186, 62);
  c.path('M98 72 Q96 52 106 40 L114 44 Q106 56 108 72 Z', '#6b8e23');
  c.line('M112 46 Q128 30 140 42 Q148 52 136 54', '#4cae4c', 3);
  c.ell(64, 124, 32, 46, '#ff8114').ell(136, 124, 32, 46, '#ff8114');
  c.ell(82, 122, 32, 52, '#ff9226').ell(118, 122, 32, 52, '#ff9226');
  c.ell(100, 122, 30, 54, '#ffa23a', { shine: true });
  c.face(100, 126, 1.15);
};

A.balloon = (c, col) => {
  c.line('M100 160 Q90 178 102 192 Q110 202 100 210', '#8a93a8', 2.5);
  c.path('M93 164 L107 164 L100 152 Z', darken(col, .15), { flat: true });
  c.ell(100, 84, 64, 74, col, { shine: true });
};

A.medal = c => {
  c.path('M70 20 L96 20 L110 90 L84 90 Z', '#4fa8ff', { vert: true });
  c.path('M130 20 L104 20 L90 90 L116 90 Z', '#ff4757', { vert: true });
  c.ball(100, 120, 52, '#ffc93b');
  c.ball(100, 120, 38, '#ffd84d', { shine: false });
  c.star(100, 120, 24, '#ffe680');
};

function art(name, opts = {}) {
  const c = new Ctx();
  A[name](c, opts.color);
  return c.svg(opts.vb || '0 0 200 200', opts.cls || '');
}

module.exports = { art, mix, lighten, darken, Ctx, A };
