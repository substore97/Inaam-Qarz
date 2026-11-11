// 3D hygiene scenes for "نظافتي". Extends the shared art library.
const lib = require('../../family-book/src/family-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const scene = (col, prop, s = .55, px = 96, py = 84, param, who = 'kidc') => c => { put(c, who, -4, 6, .92, col); put(c, prop, px, py, s, param); };

A.miswak = c => {
  c.shadow(100, 186, 60, 6);
  c.raw(`<g transform="rotate(-35 100 100)"><rect x="90" y="20" width="22" height="160" rx="10" fill="${c.lg('#c98a4e')}" stroke="#8b5a2b" stroke-width="2"/>
  <path d="M92 24 v-14 M96 24 v-18 M100 24 v-20 M104 24 v-18 M108 24 v-16 M110 24 v-12" stroke="#f2e2c0" stroke-width="3" stroke-linecap="round"/>
  <path d="M90 60 h22 M90 100 h22 M90 140 h22" stroke="#a8693a" stroke-width="2"/></g>`);
  c.face(100, 120, .5, { blush: false });
};
A.comb = c => {
  c.shadow(100, 180, 70, 6);
  c.raw(`<rect x="26" y="70" width="148" height="34" rx="12" fill="${c.vg('#ff6fae')}" ${c.edge('#ff6fae')}/>`);
  for (let i = 0; i < 16; i++) c.raw(`<rect x="${32 + i * 8.6}" y="100" width="5" height="${i % 2 ? 44 : 52}" rx="2.5" fill="${c.lg('#ff8fc0')}"/>`);
  c.face(100, 86, .5, { blush: false });
};
A.clipper = c => {
  c.shadow(100, 180, 60, 6);
  c.raw(`<rect x="40" y="100" width="120" height="26" rx="12" fill="${c.vg('#c5ccd8')}" ${c.edge('#c5ccd8')}/><path d="M40 100 Q60 70 160 84 L160 96 Q70 86 48 104 Z" fill="${c.vg('#e6ebf3')}" stroke="#9aa3b5" stroke-width="2"/>`);
  c.ball(150, 92, 7, '#9aa3b5'); c.raw('<path d="M40 112 h-8" stroke="#9aa3b5" stroke-width="6" stroke-linecap="round"/>');
  c.face(96, 114, .45, { blush: false });
};
A.trashbin = c => {
  c.shadow(100, 188, 54, 7);
  c.path('M52 66 L148 66 L136 184 L64 184 Z', '#36c45d', { vert: true });
  c.raw(`<rect x="44" y="52" width="112" height="18" rx="8" fill="${c.vg('#2aa84c')}"/><rect x="86" y="40" width="28" height="14" rx="6" fill="${c.vg('#2aa84c')}"/>`);
  c.raw('<path d="M80 90 l6 80 M100 90 v80 M120 90 l-6 80" stroke="#1f8f3f" stroke-width="4" opacity=".6"/>');
  c.face(100, 118, .6);
};
A.washfruit = c => { put(c, 'tap', 0, -10, .8); put(c, 'apple', 80, 104, .42); for (const [x, y] of [[70, 120], [150, 130], [120, 96]]) c.drop(x, y, .5, '#4fb3ff'); };
A.h_hands = scene('#4fa8ff', 'soap', .5, 100, 100);
A.h_teeth = scene('#36c45d', 'toothbrush', .55, 96, 80, undefined, 'girlc');
A.h_miswak = scene('#f2f2f2', 'miswak', .55, 96, 84);
A.h_bath = c => { put(c, 'bathtub', 0, 10, 1); };
A.h_nails = scene('#ff8a1f', 'clipper', .62, 90, 90, undefined, 'girlc');
A.h_comb = scene('#b05cff', 'comb', .5, 100, 80, undefined, 'girlc');
A.h_clothes = scene('#2ec4b6', 'shirt', .5, 100, 84);
A.h_fruit = c => A.washfruit(c);
A.h_sneeze = scene('#ffb627', 'tissue', .5, 100, 84);
A.h_trash = scene('#ff4757', 'trashbin', .5, 100, 90);
A.h_room = c => { put(c, 'bed', 0, 20, .8); put(c, 'kidc', 104, 44, .6, '#9b59d6'); put(c, 'teddy', 30, 112, .36); };
A.h_face = scene('#ff6fae', 'towel', .5, 100, 84);
module.exports = lib;
