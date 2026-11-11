// Art for "علومي" (first-grade science). Extends the shared art library.
const lib = require('../../math1-book/src/math1-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
// whole plant; param = part to highlight: root | stem | leaf | flower | fruit
A.plant = (c, part = '') => {
  c.raw(`<rect x="0" y="140" width="200" height="60" rx="10" fill="${c.vg('#a8693a')}"/><path d="M0 142 H200" stroke="#6fcf5a" stroke-width="8"/>`);
  c.raw('<g stroke="#f2d09a" stroke-width="5" fill="none" stroke-linecap="round"><path d="M100 140 V186 M100 156 L76 180 M100 156 L124 182 M100 168 L86 194 M100 168 L114 194"/></g>');
  c.raw('<path d="M100 140 Q96 96 100 48" stroke="#2e9e4a" stroke-width="9" fill="none" stroke-linecap="round"/>');
  c.path('M98 104 Q60 84 44 104 Q66 122 98 108 Z', '#36c45d', { vert: true });
  c.path('M102 88 Q140 66 158 86 Q134 106 102 92 Z', '#36c45d', { vert: true });
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.ball(100 + 15 * Math.cos(a), 40 + 15 * Math.sin(a), 11, '#ff6fae', { shine: false }); }
  c.ball(100, 40, 9, '#ffd23f');
  c.line('M100 120 Q120 124 130 132', '#2e9e4a', 4); c.ball(136, 124, 12, '#ff4757');
  const H = { root: [100, 172, 34, 26], stem: [100, 112, 14, 40], leaf: [62, 102, 30, 20], flower: [100, 40, 32, 32], fruit: [136, 124, 20, 20] }[part];
  if (H) c.raw(`<ellipse cx="${H[0]}" cy="${H[1]}" rx="${H[2]}" ry="${H[3]}" fill="none" stroke="#ffd23f" stroke-width="6" stroke-dasharray="10 6"/><ellipse cx="${H[0]}" cy="${H[1]}" rx="${H[2] + 6}" ry="${H[3] + 6}" fill="none" stroke="#ff8a1f" stroke-width="2"/>`);
};
A.icecube = c => { c.shadow(100, 186, 64, 7); c.path('M44 76 L100 52 L156 76 L100 100 Z', '#e8fbff', { flat: true }); c.path('M44 76 L100 100 L100 170 L44 146 Z', '#bfeaff', { vert: true }); c.path('M100 100 L156 76 L156 146 L100 170 Z', '#9fdcff', { vert: true }); c.raw('<path d="M56 90 l14 6 M114 96 l18 -8" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>'); c.face(100, 130, .5, { blush: false }); };
A.waterglass = c => A.c_full ? (() => { c.shadow(100, 186, 46, 6); c.raw(`<path d="M60 40 L70 180 H130 L140 40 Z" fill="#e6f6ff" stroke="#9fd8ff" stroke-width="5"/><path d="M63 70 L72 178 H128 L137 70 Z" fill="${c.vg('#4fb3ff')}"/>`); c.face(100, 140, .5, { blush: false }); })() : 0;
A.steam = c => { put(c, 'kettle', 10, 40, .8); c.raw('<g stroke="#c5ccd8" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"><path d="M150 60 q-12 -14 0 -28 q12 -14 0 -28"/><path d="M172 70 q-10 -12 0 -24 q10 -12 0 -24"/></g>'); };
A.daynight = c => { c.raw(`<rect x="0" y="10" width="100" height="180" rx="20" fill="${c.vg('#8fd6ff')}"/><rect x="100" y="10" width="100" height="180" rx="20" fill="${c.vg('#1f2a6f')}"/>`); put(c, 'sun', 4, 40, .46); put(c, 'moon', 104, 40, .46); for (const [x, y] of [[170, 30], [120, 150], [180, 130]]) c.star(x, y, 6, '#ffe680'); };
module.exports = lib;
