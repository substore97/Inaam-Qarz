// 3D toys for "ألعابي الجميلة". Extends the shared art library.
const lib = require('../../sea-book/src/sea-art');
const { A } = lib;

const box = (c, x, y, w, h, col, r = 8) => c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c.vg(col)}" ${c.edge(col)}/>`);
const cube = (c, x, y, s, col, letter) => {
  const d = s * .3;
  c.path(`M${x} ${y} L${x + d} ${y - d} L${x + s + d} ${y - d} L${x + s} ${y} Z`, col, { vert: true, noEdge: true });
  c.path(`M${x + s} ${y} L${x + s + d} ${y - d} L${x + s + d} ${y + s - d} L${x + s} ${y + s} Z`, col, { flat: true });
  c.raw(`<path d="M${x + s} ${y} L${x + s + d} ${y - d} L${x + s + d} ${y + s - d} L${x + s} ${y + s} Z" fill="#000" opacity=".2"/>`);
  box(c, x, y, s, s, col, 6);
  if (letter) c.raw(`<text x="${x + s / 2}" y="${y + s * .72}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="${s * .62}" fill="#fff" stroke="#2b2340" stroke-width="2" paint-order="stroke">${letter}</text>`);
};

A.beachball = c => {
  c.shadow(100, 186, 60, 8);
  c.raw(`<clipPath id="${c.id}bb"><circle cx="100" cy="106" r="66"/></clipPath>`);
  c.ball(100, 106, 66, '#ffffff', { shine: false });
  const cols = ['#ff4757', '#ffd23f', '#2f7de8', '#36c45d', '#ff8a1f', '#9b59d6'];
  c.raw(`<g clip-path="url(#${c.id}bb)">${cols.map((col, i) => { const a1 = i * Math.PI / 3, a2 = a1 + Math.PI / 6; return `<path d="M100 106 L${100 + 90 * Math.cos(a1)} ${106 + 90 * Math.sin(a1)} L${100 + 90 * Math.cos(a2)} ${106 + 90 * Math.sin(a2)} Z" fill="${col}"/>`; }).join('')}</g>`);
  c.raw(`<circle cx="100" cy="106" r="66" fill="${c.rg('#ffffff')}" opacity=".18"/>`);
  c.ball(100, 106, 16, '#ffffff');
  c.shine(70, 70, 16, 7, -35, .8);
  c.face(100, 112, .8, { blush: false });
};
A.robot = c => {
  c.shadow(100, 190, 56, 7);
  c.line('M100 30 V14', '#9aa3b5', 4); c.ball(100, 12, 7, '#ff4757');
  box(c, 60, 28, 80, 60, '#bfe0ff', 16);
  c.raw(`<rect x="68" y="40" width="64" height="40" rx="12" fill="#2f4f8f"/>`);
  c.raw('<circle cx="86" cy="58" r="8" fill="#7ff3ff"/><circle cx="114" cy="58" r="8" fill="#7ff3ff"/><circle cx="88" cy="55" r="3" fill="#fff"/><circle cx="116" cy="55" r="3" fill="#fff"/>');
  c.line('M90 70 Q100 76 110 70', '#7ff3ff', 3);
  c.raw('<rect x="52" y="48" width="8" height="20" rx="3" fill="#9aa3b5"/><rect x="140" y="48" width="8" height="20" rx="3" fill="#9aa3b5"/>');
  box(c, 56, 92, 88, 64, '#4fa8ff', 14);
  c.raw('<circle cx="80" cy="114" r="7" fill="#ffd23f"/><circle cx="100" cy="114" r="7" fill="#ff4757"/><circle cx="120" cy="114" r="7" fill="#36c45d"/><rect x="74" y="132" width="52" height="10" rx="5" fill="#bfe0ff"/>');
  c.raw(`<rect x="30" y="98" width="22" height="46" rx="11" fill="${c.lg('#9aa3b5')}"/><rect x="148" y="98" width="22" height="46" rx="11" fill="${c.lg('#9aa3b5')}"/>`);
  c.ball(41, 150, 11, '#ff8a1f').ball(159, 150, 11, '#ff8a1f');
  box(c, 70, 156, 22, 30, '#9aa3b5', 6); box(c, 108, 156, 22, 30, '#9aa3b5', 6);
};
A.blocks = c => {
  c.shadow(100, 190, 76, 8);
  cube(c, 30, 130, 52, '#ff4757', 'أ');
  cube(c, 90, 130, 52, '#2f7de8', 'ب');
  cube(c, 60, 72, 52, '#ffd23f', 'ت');
  cube(c, 140, 152, 32, '#36c45d');
};
A.top = c => {
  c.shadow(100, 186, 46, 7);
  c.line('M30 150 Q20 170 40 180 M168 150 Q180 170 160 180', '#c5ccd8', 3);
  c.line('M100 60 V26', '#8b5a2b', 9);
  c.path('M40 70 Q100 40 160 70 Q160 110 100 178 Q40 110 40 70 Z', '#ff6fae', { shine: [70, 70, 16, 6, -15, .7] });
  c.raw(`<clipPath id="${c.id}tp"><path d="M40 70 Q100 40 160 70 Q160 110 100 178 Q40 110 40 70 Z"/></clipPath><g clip-path="url(#${c.id}tp)"><rect x="30" y="90" width="140" height="14" fill="#ffd23f"/><rect x="30" y="118" width="140" height="12" fill="#4fa8ff"/></g>`);
  c.ell(100, 64, 58, 14, '#ff8fc0', { noEdge: true });
  c.face(100, 84, .8, { blush: false });
};
A.yoyo = c => {
  c.line('M100 14 V60', '#8a93a8', 3); c.raw('<circle cx="100" cy="12" r="7" fill="none" stroke="#8a93a8" stroke-width="3"/>');
  c.shadow(100, 186, 50, 7);
  c.ball(100, 116, 62, '#36c45d');
  c.raw(`<circle cx="100" cy="116" r="44" fill="none" stroke="#2e9e45" stroke-width="5"/>`);
  c.ball(100, 116, 14, '#ffd23f');
  c.face(100, 120, .9, { mouthDy: 6 });
};
A.drum = c => {
  c.shadow(100, 190, 70, 8);
  c.line('M150 30 L110 76 M178 46 L126 84', '#c98a4e', 6); c.ball(150, 28, 8, '#ff4757').ball(180, 44, 8, '#ff4757');
  c.cyl(32, 84, 136, 86, '#ff4757', 22, { top: '#fff6e6' });
  c.raw('<path d="M34 96 L60 160 L86 100 L112 160 L138 100 L166 160" stroke="#ffd23f" stroke-width="5" fill="none"/>');
  c.raw(`<rect x="30" y="80" width="140" height="10" rx="5" fill="${c.vg('#ffd23f')}"/><rect x="30" y="162" width="140" height="10" rx="5" fill="${c.vg('#ffd23f')}"/>`);
  c.face(100, 136, .85);
};
A.piano = c => {
  c.shadow(100, 190, 80, 8);
  c.raw(`<rect x="34" y="150" width="12" height="36" rx="4" fill="${c.lg('#c22a3f')}"/><rect x="154" y="150" width="12" height="36" rx="4" fill="${c.lg('#c22a3f')}"/>`);
  box(c, 20, 50, 160, 104, '#ff4757', 16);
  c.raw('<rect x="30" y="100" width="140" height="46" rx="4" fill="#ffffff"/>');
  for (let k = 1; k < 8; k++) c.raw(`<path d="M${30 + k * 17.5} 100 V146" stroke="#c5ccd8" stroke-width="2"/>`);
  for (const k of [1, 2, 4, 5, 6]) c.raw(`<rect x="${30 + k * 17.5 - 5}" y="100" width="10" height="26" rx="2" fill="#2b2340"/>`);
  c.face(100, 74, .85);
};
A.puzzle = c => {
  c.shadow(100, 184, 70, 8);
  const P = (x, y, col, d) => c.path(d.replace(/X/g, x).replace(/Y/g, y), col, { vert: true });
  c.path('M30 40 H96 V60 A12 12 0 1 1 96 84 V100 H76 A12 12 0 1 0 52 100 H30 Z', '#ff4757');
  c.path('M104 40 H170 V100 H150 A12 12 0 1 0 126 100 H104 V84 A12 12 0 1 0 104 60 Z', '#2f7de8');
  c.path('M30 108 H52 A12 12 0 1 0 76 108 H96 V124 A12 12 0 1 1 96 148 V168 H30 Z', '#ffd23f');
  c.raw('<g transform="translate(10 8)">'); c.path('M104 108 H126 A12 12 0 1 0 150 108 H170 V168 H104 V148 A12 12 0 1 0 104 124 Z', '#36c45d'); c.raw('</g>');
  c.face(64, 72, .75);
};
A.jumprope = c => {
  c.shadow(100, 186, 70, 7);
  c.line('M44 60 Q30 180 100 176 Q170 180 156 60', '#ff6fae', 6);
  for (const [x, col] of [[44, '#4fa8ff'], [156, '#ffd23f']]) { c.raw(`<rect x="${x - 10}" y="22" width="20" height="44" rx="10" fill="${c.lg(col)}" ${c.edge(col)}/>`); c.ball(x, 22, 8, col); }
  c.face(100, 120, .9);
};
A.rockinghorse = c => {
  c.shadow(100, 192, 80, 7);
  c.path('M14 166 Q100 206 186 166 L182 176 Q100 214 18 176 Z', '#b5733f');
  c.line('M62 136 L52 172 M84 140 L80 178 M120 140 L124 178 M140 136 L150 172', '#c98a4e', 8);
  c.ell(100, 120, 52, 30, '#ffffff');
  c.path('M140 110 Q150 60 164 44 Q182 40 186 58 Q186 70 172 72 L162 84 Q156 104 150 116 Z', '#ffffff', { vert: true });
  c.path('M144 64 Q150 44 166 40 Q156 52 156 70 Q150 86 146 96 Z', '#ff8a1f', { flat: true });
  c.path('M48 112 Q20 112 22 146 Q34 128 52 126 Z', '#ff8a1f');
  c.ell(96, 98, 26, 10, '#ff4757');
  c.ball(176, 54, 3.5, '#2b2340');
  c.face(100, 124, .7);
};
A.bucket = c => {
  c.ell(100, 182, 84, 14, '#f2d9a8', { shine: true });
  c.path('M118 180 Q150 140 160 120 L170 126 Q156 152 128 186 Z', '#ffd23f');
  c.path('M160 92 L184 108 L170 128 L150 116 Z', '#ffd23f');
  c.line('M50 86 Q100 30 150 86', '#36c45d', 6);
  c.path('M40 86 L160 86 L146 180 L54 180 Z', '#4fa8ff', { vert: true, shine: [62, 110, 6, 24, 6, .6] });
  c.ell(100, 86, 60, 10, '#2f7de8');
  c.face(100, 134, .95);
};
A.crayons = c => {
  c.shadow(100, 188, 64, 7);
  [['#ff4757', -24], ['#ffd23f', -8], ['#36c45d', 8], ['#2f7de8', 24]].forEach(([col, r]) => {
    c.raw(`<g transform="rotate(${r} 100 180)"><rect x="88" y="56" width="24" height="120" rx="6" fill="${c.lg(col)}" ${c.edge(col)}/>
      <path d="M88 58 L100 22 L112 58 Z" fill="${c.vg(col)}"/><rect x="88" y="80" width="24" height="10" fill="#fff" opacity=".6"/><rect x="88" y="150" width="24" height="10" fill="#fff" opacity=".6"/></g>`);
  });
  c.face(100, 128, .7, { blush: false });
};
A.toytrain = c => A.train(c);
module.exports = lib;
