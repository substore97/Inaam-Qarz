// Art for "علومي ٩": chromosome, fossil, rock strata, charges, ball on hill, light spectrum, factory.
const lib = require('../../science8-book/src/science8-art');
const { A } = lib;
const put = (c, name, x, y, s) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c); c.raw('</g>'); };
A.chromo = c => { c.shadow(100, 188, 50, 6); c.raw('<g transform="rotate(-20 100 100)"><rect x="60" y="20" width="32" height="160" rx="16" fill="#ff6b8a"/><rect x="108" y="20" width="32" height="160" rx="16" fill="#4fa8ff"/><rect x="84" y="88" width="32" height="24" rx="10" fill="#ffd23f"/>');
  for (const y of [45, 65, 135, 155]) c.raw(`<path d="M64 ${y} h24 M112 ${y} h24" stroke="#ffffff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>`); c.raw('</g>'); };
A.fossil = c => { c.shadow(100, 186, 76, 7); c.path('M24 170 Q20 60 100 40 Q180 50 176 170 Z', '#c9b48f', { vert: true }); let d = 'M100 110'; for (let t = 0; t < 14; t += .2) { const r = 6 + t * 4.2; d += ` L${100 + Math.cos(t) * r} ${110 + Math.sin(t) * r}`; }
  c.raw(`<path d="${d}" fill="none" stroke="#7a5a32" stroke-width="7" stroke-linecap="round"/>`); };
A.strata = c => { c.shadow(100, 190, 86, 6); const cols = ['#e8c88f', '#c99a5e', '#a8734a', '#8a5a3a', '#6e4630'];
  cols.forEach((col, k) => c.raw(`<path d="M10 ${40 + k * 30} Q100 ${30 + k * 30} 190 ${40 + k * 30} V${70 + k * 30} Q100 ${60 + k * 30} 10 ${70 + k * 30} Z" fill="${col}"/>`));
  put(c, 'fossil', 120, 130, .22); put(c, 'shell', 30, 70, .2); };
A.charges = c => { c.shadow(100, 186, 70, 6); c.ball(60, 100, 40, '#e8392b'); c.ball(140, 100, 40, '#2f7de8');
  c.raw('<path d="M44 100 h32 M60 84 v32" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M124 100 h32" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M90 60 Q100 50 110 60" stroke="#ffb020" stroke-width="5" fill="none"/><path d="M90 140 Q100 150 110 140" stroke="#ffb020" stroke-width="5" fill="none"/>'); };
A.hillball = c => { c.shadow(100, 188, 86, 6); c.raw('<path d="M10 60 Q60 60 100 140 Q130 180 190 180 V190 H10 Z" fill="#7ed99a"/>'); c.ball(34, 44, 16, '#ff6b4a'); c.raw('<path d="M60 30 q20 -10 30 10" stroke="#2f55c4" stroke-width="4" fill="none" stroke-dasharray="6 5"/><path d="M86 38 l6 6 l2 -9 Z" fill="#2f55c4"/>'); c.ball(160, 168, 12, '#ff6b4a', { shine: false }); };
A.spectrum = c => { c.shadow(100, 186, 70, 6); c.raw('<path d="M10 100 L80 96" stroke="#ffffff" stroke-width="8"/><path d="M80 96 L10 100" stroke="#e0e6f0" stroke-width="3"/>');
  c.path('M70 150 L110 50 L150 150 Z', '#d8f0ff', { vert: true }); ['#e8392b', '#ff8a1f', '#ffd23f', '#36c45d', '#2f7de8', '#4b4fd0', '#8a2fc0'].forEach((col, k) => c.raw(`<path d="M122 ${96 + k * 3} L196 ${62 + k * 14}" stroke="${col}" stroke-width="7"/>`)); };
A.factory = c => { c.shadow(100, 188, 86, 6); c.raw('<rect x="20" y="110" width="160" height="76" rx="6" fill="#9aa3b5"/><path d="M20 110 L60 86 V110 L100 86 V110 L140 86 V110" fill="#7f889a"/><rect x="140" y="50" width="22" height="70" fill="#5a6478"/>');
  for (const [x, y, r] of [[150, 36, 14], [166, 20, 18], [186, 6, 20]]) c.ball(x, y, r, '#6f6a7a', { shine: false });
  for (const x of [36, 72, 108]) c.raw(`<rect x="${x}" y="130" width="22" height="22" rx="4" fill="#ffd23f"/>`); };
module.exports = lib;
