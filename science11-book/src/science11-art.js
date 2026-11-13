// Art for "علومي ١١": piston (gas), beaker solution, thermometer reaction, convex lens, coil magnet, leaf+mitochondrion, gland (thyroid-style).
const lib = require('../../math11-book/src/math11-art');
const { A } = lib;
const put = (c, name, x, y, s) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c); c.raw('</g>'); };
A.piston = c => { c.shadow(100, 190, 60, 6); c.raw('<rect x="56" y="40" width="88" height="140" rx="8" fill="#e9f6ff" stroke="#7fb3dd" stroke-width="5"/><rect x="60" y="80" width="80" height="16" rx="4" fill="#5a6478"/><path d="M100 80 V20" stroke="#5a6478" stroke-width="10"/><path d="M76 20 H124" stroke="#5a6478" stroke-width="10" stroke-linecap="round"/>');
  for (const [x, y] of [[74, 120], [100, 140], [124, 116], [86, 160], [118, 158], [104, 112]]) c.ball(x, y, 7, '#ff8a1f'); };
A.beaker = c => { c.shadow(100, 188, 60, 6); c.raw('<path d="M50 30 V170 Q50 182 62 182 H138 Q150 182 150 170 V30" fill="#f0f8ff" stroke="#9fc9e8" stroke-width="5"/><path d="M53 90 H147 V170 Q147 179 138 179 H62 Q53 179 53 170 Z" fill="#7cc8ff"/><path d="M66 110 h20 M66 130 h30 M66 150 h20" stroke="#ffffff" stroke-width="4"/>');
  for (const [x, y] of [[110, 120], [126, 146], [100, 160], [120, 106]]) c.ball(x, y, 5, '#ffffff', { shine: false }); };
A.lens = c => { c.raw('<path d="M100 30 Q130 100 100 170 Q70 100 100 30 Z" fill="#bfe6ff" stroke="#4fa8ff" stroke-width="4"/>');
  for (const y of [70, 100, 130]) c.raw(`<path d="M14 ${y} H100 L178 100" stroke="#ffb020" stroke-width="4" fill="none"/>`); c.ball(178, 100, 7, '#e8392b'); };
A.coil = c => { c.shadow(100, 186, 80, 6); c.raw('<rect x="40" y="86" width="120" height="30" rx="8" fill="#9aa3b5"/>'); for (let x = 48; x <= 150; x += 12) c.raw(`<ellipse cx="${x}" cy="101" rx="6" ry="24" fill="none" stroke="#ff8a1f" stroke-width="5"/>`);
  c.raw('<path d="M48 125 V160 H20 M150 125 V160 H178" stroke="#e8392b" stroke-width="4" fill="none"/>'); put(c, 'magnet', 70, 0, .3); };
A.mito = c => { c.shadow(100, 186, 76, 6); c.ell(100, 100, 82, 50, '#ff9a6b'); c.raw('<ellipse cx="100" cy="100" rx="70" ry="38" fill="#ffd0b8"/><path d="M40 100 q12 -30 24 0 t24 0 t24 0 t24 0 t24 0" stroke="#e8653b" stroke-width="5" fill="none"/>'); };
A.gland = c => { c.shadow(100, 186, 70, 6); c.raw('<path d="M100 60 C60 40 40 70 50 110 C58 140 90 140 100 120 C110 140 142 140 150 110 C160 70 140 40 100 60 Z" fill="#ff8aa8"/><rect x="92" y="20" width="16" height="140" rx="8" fill="#c9d6ea" opacity=".7"/>'); c.face(100, 96, .7, { blush: false }); };
module.exports = lib;
