// 3D family members for "أسرتي الجميلة". Extends the shared art library.
const lib = require('../../city-book/src/city-art');
const { A } = lib;
const SKIN = '#ffcfa8';
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };

function person(c, o) {
  const top = o.shirt, pants = o.pants || '#3d4f7a', hy = 52, r = 32;
  c.shadow(100, 192, 48, 6);
  if (o.dress) c.path('M66 96 Q100 88 134 96 L146 184 Q100 192 54 184 Z', top, { vert: true });
  else c.raw(`<rect x="74" y="140" width="22" height="46" rx="8" fill="${c.lg(pants)}"/><rect x="104" y="140" width="22" height="46" rx="8" fill="${c.lg(pants)}"/>`);
  c.ell(84, 188, 14, 6, '#3d3d5c').ell(116, 188, 14, 6, '#3d3d5c');
  c.ell(58, 120, 11, 28, top, { rot: 14 }).ell(142, 120, 11, 28, top, { rot: -14 });
  c.ball(54, 148, 9, SKIN).ball(146, 148, 9, SKIN);
  if (!o.dress) c.raw(`<rect x="66" y="88" width="68" height="62" rx="20" fill="${c.vg(top)}" ${c.edge(top)}/>`);
  if (o.hijab) { c.ball(100, hy + 4, r + 12, o.hijab); c.path(`M60 ${hy + 20} Q100 ${hy + 66} 140 ${hy + 20} L144 ${hy + 46} Q100 ${hy + 70} 56 ${hy + 46} Z`, o.hijab, { vert: true }); }
  else { c.ball(100 - r, hy + 2, 8, SKIN).ball(100 + r, hy + 2, 8, SKIN); }
  c.ball(100, hy, r, SKIN);
  if (!o.hijab) c.path(`M${100 - r} ${hy - 4} Q${100 - r - 2} ${hy - r - 6} 100 ${hy - r - 6} Q${100 + r + 2} ${hy - r - 6} ${100 + r} ${hy - 4} Q${100 + r - 10} ${hy - 20} 100 ${hy - 20} Q${100 - r + 10} ${hy - 20} ${100 - r} ${hy - 4} Z`, o.hair || '#3a2a1e');
  if (o.cap) { c.path(`M${100 - r + 2} ${hy - 12} Q100 ${hy - r - 18} ${100 + r - 2} ${hy - 12} Z`, o.cap, { vert: true }); }
  if (o.beard) c.path(`M${100 - r + 4} ${hy + 4} Q100 ${hy + r + 28} ${100 + r - 4} ${hy + 4} Q${100 + r - 6} ${hy + 30} 100 ${hy + 28} Q${100 - r + 6} ${hy + 30} ${100 - r + 4} ${hy + 4} Z`, o.beard);
  c.face(100, hy + 8, .66);
  if (o.glasses) c.raw(`<g fill="none" stroke="#5a4a3a" stroke-width="2.5"><circle cx="88" cy="${hy + 2}" r="9"/><circle cx="112" cy="${hy + 2}" r="9"/><path d="M97 ${hy + 2} h6"/></g>`);
  if (o.cane) c.raw(`<path d="M152 150 V188 M152 150 q0 -12 -10 -12" stroke="#8b5a2b" stroke-width="6" fill="none" stroke-linecap="round"/>`);
}
A.father = c => person(c, { shirt: '#2f7de8', beard: '#3a2a1e' });
A.mother = c => person(c, { shirt: '#c25bd6', dress: true, hijab: '#ff7eb3' });
A.grandpa = c => person(c, { shirt: '#f2f2f2', pants: '#8a8fa0', hair: '#e8e8ee', beard: '#f4f4f8', cap: '#ffffff', glasses: true, cane: true });
A.grandma = c => person(c, { shirt: '#8a6fd6', dress: true, hijab: '#f4f4fa', glasses: true });
A.uncle = c => person(c, { shirt: '#36c45d', beard: '#2a1a10', hair: '#2a1a10' });
A.uncle2 = c => person(c, { shirt: '#ff8a1f', pants: '#5a4a3a', hair: '#5a3a22' });
A.aunt = c => person(c, { shirt: '#2ec4b6', dress: true, hijab: '#ffd23f' });
A.aunt2 = c => person(c, { shirt: '#ff4757', dress: true, hijab: '#4fa8ff' });
A.baby = c => {
  c.shadow(100, 188, 56, 6);
  c.ell(100, 150, 56, 36, '#bfe6ff', { shine: true });
  c.ball(100, 96, 44, SKIN);
  c.path('M80 58 Q100 40 108 56', '#c98a4e');
  c.face(100, 104, .8);
  c.ball(100, 126, 9, '#ff6fae'); c.raw('<circle cx="100" cy="126" r="4" fill="#fff"/>');
};
A.brother = c => A.kidc(c, '#ffb627');
A.sister = c => A.girlc(c, '#ff6fae');
A.family = c => { put(c, 'father', -10, 20, .7); put(c, 'mother', 64, 20, .7); put(c, 'brother', 6, 104, .46); put(c, 'sister', 104, 104, .46); put(c, 'baby', 72, 128, .34); };
A.grandparents = c => { put(c, "grandpa", -2, 30, .76); put(c, "grandma", 50, 30, .76); };
module.exports = lib;
