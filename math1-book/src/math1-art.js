// Art for "رياضياتي" (first-grade math): shapes, picture sums. Extends the shared art library.
const lib = require('../../lughati-book/src/lughati-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
A.sh_circle = c => { c.shadow(100, 186, 60, 6); c.ball(100, 100, 74, '#ff4757'); c.face(100, 110, .6); };
A.sh_square = c => { c.shadow(100, 186, 60, 6); c.raw(`<rect x="34" y="34" width="132" height="132" rx="12" fill="${c.vg('#2f7de8')}" ${c.edge('#2f7de8')}/>`); c.face(100, 110, .6); };
A.sh_triangle = c => { c.shadow(100, 186, 60, 6); c.path('M100 22 L182 170 L18 170 Z', '#36c45d', { vert: true }); c.face(100, 130, .6); };
A.sh_rect = c => { c.shadow(100, 176, 80, 6); c.raw(`<rect x="14" y="60" width="172" height="100" rx="12" fill="${c.vg('#ffb627')}" ${c.edge('#ffb627')}/>`); c.face(100, 116, .6); };
A.sh_sphere = c => { c.shadow(100, 186, 64, 8); c.ball(100, 100, 76, '#b05cff'); c.shine(70, 64, 14, 22, -30, .5); };
A.sh_cube = c => { c.shadow(100, 188, 70, 8); c.path('M40 70 L100 40 L160 70 L100 100 Z', '#ffd84d', { flat: true }); c.path('M40 70 L100 100 L100 176 L40 146 Z', '#ff9f1a', { vert: true }); c.path('M100 100 L160 70 L160 146 L100 176 Z', '#e8820a', { vert: true }); };
A.sh_cylinder = c => { c.shadow(100, 186, 60, 7); c.raw(`<rect x="50" y="46" width="100" height="126" fill="${c.lg('#2ec4b6')}"/>`); c.ell(100, 172, 50, 16, '#1fa89b', { noEdge: true }); c.ell(100, 46, 50, 16, '#7fe8de', { noEdge: true }); };
A.sh_cone = c => { c.shadow(100, 186, 60, 7); c.path('M100 20 L156 166 Q100 196 44 166 Z', '#ff6fae', { vert: true }); c.ell(100, 166, 56, 14, '#e8508f', { noEdge: true }); };
// param "item,a,b,op": a items op b items
A.sumpic = (c, p = 'apple,2,3,+') => {
  const [it, a, b, op] = p.split(','); const pos = n => [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]].slice(0, n);
  c.raw('<rect x="2" y="30" width="84" height="150" rx="18" fill="#ffffff" stroke="#ffb3c7" stroke-width="5"/><rect x="114" y="30" width="84" height="150" rx="18" fill="#ffffff" stroke="#a8d4ff" stroke-width="5"/>');
  pos(+a).forEach(([x, y]) => put(c, it, 6 + x * 40, 40 + y * 46, .19));
  pos(+b).forEach(([x, y]) => put(c, it, 118 + x * 40, 40 + y * 46, .19));
  c.raw(`<circle cx="100" cy="105" r="17" fill="#ffd23f" stroke="#c46a00" stroke-width="3"/><text x="100" y="117" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="32" fill="#7a3a00">${op === '-' ? '−' : '+'}</text>`);
  if (op === '-') pos(+b).forEach(([x, y]) => c.raw(`<path d="${`M${118 + x * 40 + 4} ${40 + y * 46 + 4} l30 30`}" stroke="#ff2d3a" stroke-width="5" stroke-linecap="round"/>`));
};
A.clockempty = c => A.clockt(c, '');
module.exports = lib;
