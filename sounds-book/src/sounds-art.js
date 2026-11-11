// Extra 3D animals for "أصوات الحيوانات": horse, donkey, dog, rooster.
const lib = require('../../jobs-book/src/jobs-art');
const { A } = lib;

function quad(c, col, dark, o = {}) {
  c.shadow(100, 190, 70, 7);
  if (o.tail) o.tail();
  for (const x of [58, 78, 122, 140]) c.raw(`<rect x="${x - 7}" y="118" width="14" height="66" rx="7" fill="${c.lg(x % 2 ? dark : col)}"/><rect x="${x - 8}" y="176" width="16" height="10" rx="4" fill="#3d3d5c"/>`);
  c.ell(98, 118, 58, 34, col, { shine: true });
  c.path('M124 104 Q132 60 146 46 L170 60 Q158 84 150 120 Z', col, { vert: true });
  c.ell(166, 60, 22, 18, col, { rot: 20 });
  c.ell(182, 70, 12, 10, o.muzzle || dark, { noEdge: true });
  if (o.ears) o.ears(); else { c.path('M150 42 L156 22 L164 42 Z', col); }
  if (o.mane) o.mane();
  c.raw('<circle cx="166" cy="52" r="5" fill="#2b2340"/><circle cx="168" cy="50" r="2" fill="#fff"/><circle cx="186" cy="68" r="2.2" fill="#2b2340"/>');
  c.raw('<ellipse cx="158" cy="64" rx="5" ry="3" fill="#ff8fa3" opacity=".6"/>');
  c.line('M176 78 Q182 82 188 78', '#2b2340', 2);
}
A.horse = c => quad(c, '#c98a4e', '#a8693a', {
  tail: () => c.path('M44 104 Q16 120 22 170 Q36 140 50 124 Z', '#5a3a22'),
  mane: () => c.path('M146 40 Q132 54 128 82 Q124 100 122 110 L134 104 Q140 80 154 52 Z', '#5a3a22') });
A.donkey = c => quad(c, '#9aa3b5', '#7d8aa8', { muzzle: '#e6ebf3',
  tail: () => c.line('M44 108 Q30 130 34 150', '#5a5a6e', 5),
  ears: () => { c.ell(150, 26, 7, 22, '#9aa3b5', { rot: -15 }); c.ell(162, 24, 7, 22, '#9aa3b5', { rot: 10 }); c.ell(162, 26, 3, 14, '#ffb3c7', { rot: 10, noEdge: true }); },
  mane: () => c.path('M148 44 Q136 60 130 90 L136 88 Q142 64 154 50 Z', '#5a5a6e') });
A.dog = c => {
  c.shadow(100, 188, 56, 7);
  c.line('M140 150 Q172 140 168 112', '#c98a4e', 10);
  c.ell(100, 150, 44, 32, '#d9a066');
  c.ell(100, 156, 24, 22, '#fff1df', { noEdge: true });
  c.ell(80, 184, 14, 7, '#d9a066').ell(120, 184, 14, 7, '#d9a066');
  c.ell(56, 84, 16, 34, '#8b5a2b', { rot: 15 }).ell(144, 84, 16, 34, '#8b5a2b', { rot: -15 });
  c.ball(100, 86, 40, '#e0aa70');
  c.ell(114, 72, 14, 12, '#8b5a2b', { noEdge: true });
  c.ell(100, 104, 20, 14, '#fff1df', { noEdge: true });
  c.ell(100, 98, 8, 6, '#3b2414');
  c.face(100, 84, .9, { mouthDy: 14 });
  c.ell(100, 124, 7, 9, '#ff6b7a', { noEdge: true });
};
A.rooster = c => {
  c.shadow(100, 188, 55, 7);
  for (const [r, col] of [[-40, '#2f6fe0'], [-20, '#36c45d'], [0, '#ff4757'], [20, '#ff8a1f']]) c.ell(46, 90, 12, 40, col, { rot: r - 30 });
  c.line('M86 168 L84 186 M80 186 L90 186 M114 168 L116 186 M110 186 L120 186', '#ff8a1f', 4);
  c.ball(100, 124, 46, '#fff6e6');
  c.ell(82, 126, 22, 16, '#f2d2a8', { rot: 20 });
  c.ball(118, 70, 26, '#fff6e6');
  c.ball(108, 42, 9, '#ff3b4f').ball(120, 38, 10, '#ff3b4f').ball(132, 44, 9, '#ff3b4f');
  c.path('M138 70 L156 76 L138 82 Z', '#ff9f1c');
  c.ell(136, 92, 6, 9, '#ff3b4f');
  c.face(120, 72, .65, { mouth: false });
};
module.exports = lib;
