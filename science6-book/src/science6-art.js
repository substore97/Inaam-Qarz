// Art for "علومي ٦": fern, crystal, atom, refraction, food chain. Extends the shared chain.
const lib = require('../../math6-book/src/math6-art');
const { A } = lib;
A.fern = c => { c.shadow(100, 188, 60, 7); c.ell(100, 180, 40, 10, '#8b5a2b');
  for (const [a, l] of [[-50, 120], [-25, 140], [0, 150], [25, 140], [50, 120]]) {
    c.raw(`<g transform="translate(100 178) rotate(${a})">`); c.line(`M0 0 V-${l}`, '#2e8b3e', 4);
    for (let y = 18; y < l; y += 13) { const w = 26 * (1 - y / l) + 6; c.raw(`<path d="M0 -${y} q-${w} -4 -${w} -12 q${w * .6} 2 ${w} 10 Z M0 -${y} q${w} -4 ${w} -12 q-${w * .6} 2 -${w} 10 Z" fill="${c.vg('#4fc25a')}"/>`); }
    c.raw('</g>'); } };
A.crystal = c => { c.shadow(100, 186, 64, 7); c.path('M30 170 Q100 150 170 170 L170 180 Q100 190 30 180 Z', '#9a8f86', { vert: true });
  for (const [x, h, w, col] of [[70, 90, 26, '#b58cff'], [100, 130, 30, '#9b6bff'], [132, 80, 24, '#c9a8ff']]) {
    c.path(`M${x - w / 2} 172 L${x - w / 2} ${172 - h + 20} L${x} ${172 - h} L${x + w / 2} ${172 - h + 20} L${x + w / 2} 172 Z`, col, { vert: true });
    c.raw(`<path d="M${x} ${172 - h} V172" stroke="#ffffff" stroke-opacity=".5" stroke-width="3"/>`); } };
A.atom = c => { c.shadow(100, 188, 50, 6);
  for (const r of [0, 60, 120]) c.raw(`<ellipse cx="100" cy="100" rx="80" ry="28" fill="none" stroke="#4fa8ff" stroke-width="5" transform="rotate(${r} 100 100)"/>`);
  c.ball(100, 100, 20, '#ff6b4a'); c.ball(180, 100, 9, '#36c45d'); c.ball(60, 31, 9, '#36c45d'); c.ball(60, 169, 9, '#36c45d'); };
A.refract = c => { c.shadow(100, 190, 52, 7);
  c.raw('<path d="M56 40 L64 182 Q100 192 136 182 L144 40" fill="#e9f6ff" stroke="#9fc9e8" stroke-width="5"/><path d="M59 90 L64 182 Q100 192 136 182 L141 90 Z" fill="#7cc8ff" fill-opacity=".6"/><path d="M59 90 H141" stroke="#3d9be0" stroke-width="3"/>');
  c.raw('<path d="M70 14 L100 90" stroke="#ffb020" stroke-width="12" stroke-linecap="round"/><path d="M106 92 L122 170" stroke="#e8a018" stroke-width="12" stroke-linecap="round"/><path d="M118 152 L122 170 L128 150 Z" fill="#2b2340"/>'); };
const put = (c, name, x, y, s) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c); c.raw('</g>'); };
A.chain = c => { put(c, 'grass', 0, 112, .44); put(c, 'grasshopper', 56, 58, .44); put(c, 'sparrow', 112, 4, .44);
  for (const [x, y] of [[66, 132], [122, 78]]) c.raw(`<path d="M${x} ${y} l14 -14" stroke="#e8392b" stroke-width="6" stroke-linecap="round"/><path d="M${x + 20} ${y - 20} l-3 13 l-10 -10 Z" fill="#e8392b"/>`); };
module.exports = lib;
