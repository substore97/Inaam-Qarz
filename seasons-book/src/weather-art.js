// 3D weather & season art for "فصولي الجميلة". Extends the shared art library.
const lib = require('../../opposites-book/src/opp-art');
const { A } = lib;

const cloudAt = (c, cx, cy, s, col, faceOpt) => {
  c.ell(cx, cy + 16 * s, 62 * s, 24 * s, col);
  for (const [x, y, r] of [[-36, 4, 30], [0, -16, 38], [38, 0, 32], [-20, 18, 26], [22, 18, 28]]) c.ball(cx + x * s, cy + y * s, r * s, col);
  if (faceOpt !== false) c.face(cx, cy + 6 * s, 1.05 * s, faceOpt || {});
};

A.cloud2 = c => { c.shadow(100, 186, 60, 7, .12); cloudAt(c, 100, 96, 1.15, '#f4f9ff'); };
A.raincloud = c => {
  for (const [x, y] of [[62, 150], [92, 168], [122, 150], [148, 170], [76, 184], [110, 190]]) c.drop(x, y, 1, '#4fb3ff');
  cloudAt(c, 100, 80, 1.1, '#c9d6e6');
};
A.storm = c => {
  c.path('M108 112 L84 152 L102 152 L88 190 L128 140 L108 140 L122 112 Z', '#ffd23f', { shine: [100, 130, 3, 10, 30, .8] });
  for (const [x, y] of [[54, 150], [150, 156], [66, 182]]) c.drop(x, y, .9, '#4fb3ff');
  cloudAt(c, 100, 76, 1.1, '#8794b3', { mouth: 'open' });
};
A.windy = c => {
  c.line('M86 92 Q130 80 150 96 Q166 112 150 120 Q138 124 136 112', '#8fd6ff', 6);
  c.line('M90 118 Q140 116 170 132 Q186 144 172 154 Q160 158 158 146', '#8fd6ff', 6);
  c.line('M84 140 Q120 150 140 170', '#8fd6ff', 5);
  for (const [x, y, r, col] of [[160, 70, -30, '#ff9a3c'], [182, 100, 20, '#ffc23d'], [130, 170, 50, '#ff6b3d']]) { c.ell(x, y, 12, 6, col, { rot: r }); }
  cloudAt(c, 58, 110, .8, '#f4f9ff', { mouth: 'open' });
};
A.snowflake = c => {
  const arm = a => { const r = Math.PI * a / 180, x = Math.cos(r), y = Math.sin(r); return `M100 100 L${100 + 70 * x} ${100 + 70 * y} M${100 + 40 * x} ${100 + 40 * y} L${100 + 40 * x + 18 * Math.cos(r + .7)} ${100 + 40 * y + 18 * Math.sin(r + .7)} M${100 + 40 * x} ${100 + 40 * y} L${100 + 40 * x + 18 * Math.cos(r - .7)} ${100 + 40 * y + 18 * Math.sin(r - .7)}`; };
  c.line([0, 60, 120, 180, 240, 300].map(arm).join(' '), '#8fd6ff', 9);
  c.line([0, 60, 120, 180, 240, 300].map(arm).join(' '), '#ffffff', 4);
  c.ball(100, 100, 24, '#e3f3ff');
  c.face(100, 102, .7);
};
A.snowy = c => {
  for (const [x, y, s] of [[30, 30, .22], [170, 40, .2], [40, 110, .16], [176, 120, .18], [110, 18, .14]]) { c.raw(`<g transform="translate(${x - 100 * s} ${y - 100 * s}) scale(${s})">`); A.snowflake(c); c.raw('</g>'); }
  c.raw('<g transform="translate(30 30) scale(.7)">'); A.snowman(c); c.raw('</g>');
};
A.rainbow = c => {
  const cols = ['#ff4d4d', '#ff9a3c', '#ffd23f', '#4cd964', '#4fa8ff', '#9b6bff'];
  cols.forEach((col, i) => {
    const R = 82 - i * 9, r = R - 9;
    c.path(`M${100 - R} 140 A${R} ${R} 0 0 1 ${100 + R} 140 L${100 + r} 140 A${r} ${r} 0 0 0 ${100 - r} 140 Z`, col, { noEdge: false });
  });
  cloudAt(c, 30, 136, .5, '#f4f9ff', false);
  cloudAt(c, 170, 136, .5, '#f4f9ff', false);
  c.face(100, 120, .9, { blush: true });
};
A.fog = c => {
  c.ball(130, 70, 36, '#ffe58a');
  for (const [y, x, w, o] of [[92, 20, 150, .9], [118, 40, 150, .95], [144, 14, 160, .9], [170, 36, 140, .85]])
    c.raw(`<rect x="${x}" y="${y}" width="${w}" height="20" rx="10" fill="#eef2f7" opacity="${o}" stroke="#c9d3df"/>`);
  c.face(100, 128, .9, { mouth: false });
};
A.umbrella = c => {
  for (const [x, y] of [[30, 40], [170, 50], [40, 150], [168, 140]]) c.drop(x, y, .8, '#4fb3ff');
  c.line('M100 70 V160 Q100 176 86 176 Q74 176 74 164', '#7b4a24', 6);
  c.path('M24 96 Q30 34 100 30 Q170 34 176 96 Q160 84 144 96 Q128 84 112 96 Q100 86 88 96 Q72 84 56 96 Q40 84 24 96 Z', '#ff4757', { shine: [64, 52, 16, 6, -25, .7] });
  c.line('M100 30 Q78 60 56 96 M100 30 Q122 60 144 96', '#d9324a', 2.5);
  c.face(100, 66, .8);
};
A.kite = c => {
  c.line('M100 160 Q80 176 96 186 Q112 194 92 200', '#8a93a8', 2);
  for (const [x, y, col] of [[96, 172, '#ff4757'], [100, 188, '#ffd23f']]) c.path(`M${x - 8} ${y - 5} L${x + 8} ${y + 5} L${x + 8} ${y - 5} L${x - 8} ${y + 5} Z`, col, { flat: true });
  c.path('M100 20 L100 160 L40 76 Z', '#4fa8ff', { vert: true });
  c.path('M100 20 L160 76 L100 160 Z', '#ffd23f', { vert: true });
  c.path('M40 76 L160 76 L100 160 Z', '#ff4757', { flat: true, opacity: .25, noEdge: true });
  c.line('M100 20 V160 M40 76 H160', '#ffffff', 2.5);
  c.face(100, 84, .9);
};
A.sunhat = c => {
  c.shadow(100, 170, 80, 8);
  c.ell(100, 128, 88, 30, '#f2c46d', { shine: true });
  c.path('M52 126 Q52 60 100 58 Q148 60 148 126 Z', '#f5cf80', { vert: true });
  c.raw('<path d="M53 112 Q100 124 147 112 L148 124 Q100 136 52 124 Z" fill="#ff6fae"/>');
  c.ball(132, 116, 10, '#ff4757');
  c.face(100, 90, .85);
};
A.beanie = c => {
  c.shadow(100, 176, 66, 7);
  c.ball(100, 34, 18, '#ffffff');
  c.path('M38 150 Q38 52 100 48 Q162 52 162 150 Z', '#4fa8ff', { vert: true, shine: [70, 80, 10, 18, -20, .6] });
  c.raw('<path d="M42 104 H158 M40 122 H160" stroke="#ffffff" stroke-width="8" opacity=".85"/>');
  c.raw(`<rect x="32" y="140" width="136" height="30" rx="14" fill="${c.vg('#2f7de8')}"/>`);
  c.face(100, 82, .85);
};
A.leaf = c => {
  c.shadow(100, 182, 50, 6, .15);
  c.line('M100 176 Q102 166 106 158', '#8b5a2b', 5);
  c.path('M100 160 C40 140 40 60 100 24 C160 60 160 140 100 160 Z', '#ff8a2a', { shine: [76, 70, 8, 20, 20, .6] });
  c.line('M100 158 V40 M100 120 L70 96 M100 120 L130 96 M100 88 L76 68 M100 88 L124 68', '#d9661a', 2.5);
  c.face(100, 108, .9);
};
A.tree = (c, season = 'summer') => {
  c.shadow(100, 188, 66, 8);
  if (season === 'winter') c.ell(100, 184, 80, 12, '#ffffff', { shine: true });
  c.path('M88 186 L92 112 L108 112 L112 186 Z', '#9a6234', { cyl: true });
  if (season === 'winter') {
    c.line('M100 120 L100 40 M100 90 L64 56 M100 80 L140 48 M100 104 L58 92 M100 100 L146 84 M78 70 L70 44 M126 60 L136 34', '#8a5530', 7);
    for (const [x, y] of [[100, 38], [64, 54], [140, 46], [58, 90], [146, 82], [70, 42], [136, 32]]) c.ell(x, y - 2, 9, 4.5, '#ffffff', { noEdge: true });
    c.face(100, 150, .7);
    return;
  }
  const cols = season === 'autumn' ? ['#ff9a3c', '#ff6b3d', '#ffc23d', '#ff8a2a', '#e8573a', '#ffb13d'] : season === 'spring' ? Array(6).fill('#6fd67a') : Array(6).fill('#36b14f');
  [[70, 88, 30], [130, 88, 30], [100, 56, 34], [82, 108, 28], [118, 108, 28], [100, 88, 38]].forEach(([x, y, r], i) => c.ball(x, y, r, cols[i]));
  if (season === 'spring') for (const [x, y] of [[66, 72], [128, 70], [96, 40], [120, 110], [78, 112], [146, 96], [56, 98], [112, 50]]) c.ball(x, y, 6, '#ffa6c9', { shine: false });
  if (season === 'summer') for (const [x, y] of [[68, 80], [132, 76], [114, 104], [80, 110], [146, 100]]) c.ball(x, y, 8, '#ff3b4f');
  if (season === 'autumn') for (const [x, y, r] of [[40, 140, 30], [160, 150, -40], [140, 176, 10], [56, 172, 60]]) c.ell(x, y, 10, 5, '#ff8a2a', { rot: r });
  c.face(100, 90, .95);
};

module.exports = lib;
