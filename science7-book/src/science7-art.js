// Art for "علومي ٧": DNA, germ, syringe, atmosphere layers, volcano, earthquake, lever, pulley, ramp, periodic table, pan.
const lib = require('../../math7-book/src/math7-art');
const { A } = lib;
A.dna = c => { c.shadow(100, 190, 40, 6); let a = '', b = '';
  for (let y = 10; y <= 180; y += 4) { const x = Math.sin(y / 18) * 40; a += `${y === 10 ? 'M' : 'L'}${100 + x} ${y} `; b += `${y === 10 ? 'M' : 'L'}${100 - x} ${y} `; }
  for (let y = 18; y < 180; y += 14) { const x = Math.sin(y / 18) * 40; c.raw(`<path d="M${100 + x} ${y} L${100 - x} ${y}" stroke="${y % 28 ? '#ffb020' : '#36c45d'}" stroke-width="6" stroke-linecap="round"/>`); }
  c.raw(`<path d="${a}" fill="none" stroke="#2f7de8" stroke-width="9" stroke-linecap="round"/><path d="${b}" fill="none" stroke="#e8508f" stroke-width="9" stroke-linecap="round"/>`); };
A.germ = c => { c.shadow(100, 186, 50, 7);
  for (let k = 0; k < 12; k++) { const t = k * Math.PI / 6, x = 100 + Math.cos(t) * 62, y = 100 + Math.sin(t) * 62; c.raw(`<path d="M${100 + Math.cos(t) * 44} ${100 + Math.sin(t) * 44} L${x} ${y}" stroke="#2e9b4f" stroke-width="6"/>`); c.ball(x, y, 8, '#ffd23f'); }
  c.ball(100, 100, 50, '#5fd17a'); c.face(100, 100, .8, { blush: false }); };
A.syringe = c => { c.shadow(100, 176, 70, 6); c.raw('<g transform="rotate(-30 100 100)">');
  c.raw(`<rect x="40" y="82" width="110" height="36" rx="8" fill="${c.vg('#e9f6ff')}" stroke="#7fb3dd" stroke-width="4"/><rect x="44" y="88" width="62" height="24" rx="5" fill="#7cc8ff"/>`);
  c.raw('<path d="M150 100 H190" stroke="#9aa3b5" stroke-width="5"/><path d="M20 100 H40 M20 82 V118" stroke="#5a6478" stroke-width="8" stroke-linecap="round"/>');
  for (const x of [60, 80, 100, 120]) c.raw(`<path d="M${x} 82 v10" stroke="#5a6478" stroke-width="3"/>`); c.raw('</g>'); };
A.layers = c => { const L = [['#0b1d4f', 'Exo'], ['#1f3fa0'], ['#3d6fe0'], ['#7cb6ff'], ['#bfe3ff']];
  L.forEach(([col], k) => c.raw(`<rect x="10" y="${10 + k * 34}" width="180" height="36" fill="${col}"/>`));
  c.raw('<rect x="10" y="10" width="180" height="170" rx="16" fill="none" stroke="#fff" stroke-width="0"/>');
  c.raw('<path d="M10 190 Q100 160 190 190 V200 H10 Z" fill="#36c45d"/>'); c.star(40, 30, 6, '#ffffff'); c.star(150, 24, 5, '#ffffff');
  c.raw('<path d="M70 150 q10 -10 20 0 q10 -10 20 0 z" fill="#ffffff"/>'); put(c, 'plane', 120, 120, .22); put(c, 'satellite', 100, 20, .2); };
const put = (c, name, x, y, s) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c); c.raw('</g>'); };
A.volcano = c => { c.shadow(100, 186, 86, 8); c.path('M14 184 L80 60 L120 60 L186 184 Z', '#8b5a3c', { vert: true });
  c.path('M80 60 L92 82 L100 70 L110 86 L120 60 Z', '#ff6b1a', { flat: true }); c.raw('<path d="M96 72 Q90 120 70 160 M104 72 Q112 110 128 150" stroke="#ff8a1f" stroke-width="7" fill="none" stroke-linecap="round"/>');
  for (const [x, y, r] of [[100, 36, 18], [80, 22, 13], [122, 18, 14]]) c.ball(x, y, r, '#9aa3b5', { shine: false }); c.ball(100, 52, 9, '#ff4a1a'); };
A.quake = c => { c.shadow(100, 186, 86, 7); c.path('M10 120 L190 120 L190 180 L10 180 Z', '#b5733f', { vert: true }); c.raw('<path d="M10 120 H190" stroke="#36c45d" stroke-width="10"/>');
  c.raw('<path d="M100 120 L88 140 L108 152 L94 180" stroke="#3a2210" stroke-width="7" fill="none" stroke-linejoin="round"/>');
  put(c, 'house', 20, 42, .36); put(c, 'house', 112, 46, .36); c.raw('<path d="M14 60 l8 -8 M178 60 l-8 -8 M14 80 l10 0 M176 80 l-10 0" stroke="#e8392b" stroke-width="5" stroke-linecap="round"/>'); };
A.lever = c => { c.shadow(100, 186, 86, 7); c.path('M86 180 L100 150 L114 180 Z', '#ff6b4a', { vert: true }); c.raw('<rect x="14" y="140" width="172" height="12" rx="6" fill="#c98a4e" transform="rotate(-10 100 146)"/>');
  put(c, 'box', 6, 92, .3); c.raw('<path d="M170 96 v28" stroke="#2f55c4" stroke-width="8" stroke-linecap="round"/><path d="M160 116 l10 14 l10 -14 Z" fill="#2f55c4"/>'); };
A.pulley = c => { c.shadow(100, 188, 60, 6); c.raw('<path d="M40 14 H160" stroke="#5a6478" stroke-width="10" stroke-linecap="round"/><path d="M100 14 V40" stroke="#5a6478" stroke-width="6"/>');
  c.ball(100, 62, 26, '#ffb020'); c.ball(100, 62, 8, '#5a6478', { shine: false }); c.raw('<path d="M74 62 V150 M126 62 V110" stroke="#8b5a2b" stroke-width="5"/>');
  put(c, 'box', 40, 140, .32); c.raw('<path d="M126 110 l-8 0 l8 14 l8 -14 Z" fill="#2f55c4"/>'); };
A.ramp = c => { c.shadow(100, 186, 86, 7); c.path('M10 180 L190 180 L190 80 Z', '#7ed99a', { vert: true }); c.raw('<g transform="rotate(-29 110 130)">'); put(c, 'box', 90, 92, .3); c.raw('</g>'); };
A.ptable = c => { c.shadow(100, 186, 86, 6); const cols = ['#ff8a8a', '#ffd23f', '#7cc8ff', '#9be07a'];
  for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) { if (r === 0 && k > 0 && k < 6) continue; c.raw(`<rect x="${12 + k * 25}" y="${40 + r * 30}" width="22" height="26" rx="4" fill="${cols[(k + r) % 4]}" stroke="#ffffff" stroke-width="2"/>`); }
  c.raw('<text x="24" y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="14" fill="#2b2340">H</text><text x="174" y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="13" fill="#2b2340">He</text>'); };
A.pan = c => { c.shadow(100, 186, 70, 7); put(c, 'flame', 60, 110, .4); c.raw(`<rect x="30" y="96" width="110" height="20" rx="8" fill="${c.vg('#5a6478')}"/><rect x="138" y="100" width="56" height="10" rx="5" fill="#2b2340"/>`);
  c.raw('<path d="M60 86 q6 -10 0 -20 q-6 -10 0 -20 M90 86 q6 -10 0 -20 q-6 -10 0 -20 M120 86 q6 -10 0 -20" stroke="#ff8a8a" stroke-width="5" fill="none" stroke-linecap="round"/>'); };
module.exports = lib;
