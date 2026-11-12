// Art for "علومي ٥": cells, brain, solution, wind turbine. Extends the shared chain.
const lib = require('../../english4-book/src/english4-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
A.cellplant = c => { c.shadow(100, 188, 70, 6); c.raw(`<rect x="24" y="30" width="152" height="150" rx="16" fill="${c.vg('#9be07a')}" stroke="#2e9e4a" stroke-width="8"/><rect x="38" y="44" width="124" height="122" rx="10" fill="#d9f7c8"/>`);
  c.ell(110, 110, 34, 40, '#c9eefc', { noEdge: true }); c.ball(70, 76, 16, '#8b5ad6'); for (const [x, y] of [[60, 140], [140, 60], [140, 150], [56, 110]]) c.ell(x, y, 10, 6, '#36c45d'); };
A.cellanimal = c => { c.shadow(100, 188, 70, 6); c.path('M30 100 Q30 30 100 32 Q172 36 170 104 Q166 172 98 170 Q34 168 30 100 Z', '#ffc2d6', { vert: true }); c.ball(100, 100, 24, '#8b5ad6'); for (const [x, y] of [[60, 70], [140, 80], [70, 140], [140, 140]]) c.ell(x, y, 9, 5, '#ff8a1f'); };
A.brain = c => { c.shadow(100, 186, 60, 6); c.path('M40 110 Q30 50 90 44 Q110 30 140 50 Q178 66 166 112 Q160 150 120 150 L110 176 L96 176 L94 150 Q46 152 40 110 Z', '#ff9fc0', { vert: true });
  c.raw('<path d="M60 80 q20 -10 30 6 M110 60 q20 0 22 20 M70 116 q20 10 40 -6 M130 100 q14 6 20 -6" stroke="#e8508f" stroke-width="5" fill="none" stroke-linecap="round"/>'); c.face(100, 120, .45, { blush: false }); };
A.sugarwater = c => { c.shadow(100, 186, 46, 6); c.raw(`<path d="M60 40 L70 180 H130 L140 40 Z" fill="#e6f6ff" stroke="#9fd8ff" stroke-width="5"/><path d="M63 70 L72 178 H128 L137 70 Z" fill="${c.vg('#9fdcff')}"/>`);
  c.raw('<path d="M100 20 L100 160" stroke="#c98a4e" stroke-width="6" stroke-linecap="round"/><ellipse cx="100" cy="160" rx="14" ry="6" fill="#c98a4e"/>'); for (const [x, y] of [[84, 110], [116, 130], [90, 150], [112, 96]]) c.raw(`<rect x="${x}" y="${y}" width="7" height="7" fill="#ffffff" opacity=".8"/>`); };
A.turbine = c => { c.ell(100, 188, 80, 10, '#9be07a', { shine: true }); c.raw(`<path d="M94 100 L88 186 H112 L106 80 Z" fill="${c.lg('#e6ebf3')}" stroke="#c5ccd8" stroke-width="2"/>`);
  for (const a of [0, 120, 240]) c.raw(`<path d="M100 96 L${(100 + 62 * Math.sin(a * Math.PI / 180)).toFixed(1)} ${(96 - 62 * Math.cos(a * Math.PI / 180)).toFixed(1)}" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/><path d="M100 96 L${(100 + 62 * Math.sin(a * Math.PI / 180)).toFixed(1)} ${(96 - 62 * Math.cos(a * Math.PI / 180)).toFixed(1)}" stroke="#d5dbe6" stroke-width="3"/>`);
  c.ball(100, 96, 10, '#9aa3b5'); };
A.gravity = c => { put(c, 'gtree', -20, 0, .9); put(c, 'apple', 120, 110, .3); c.raw('<path d="M140 70 V104" stroke="#ff4757" stroke-width="5" stroke-dasharray="6 6"/><path d="M140 110 l-8 -12 h16 Z" fill="#ff4757"/>'); };
A.friction = c => { c.raw('<rect x="10" y="150" width="180" height="20" rx="6" fill="#c98a4e"/><path d="M10 150 h180" stroke="#8b5a2b" stroke-width="4" stroke-dasharray="4 6"/>'); put(c, 'box', 10, 60, .55); c.raw('<path d="M190 110 h-50 l12 -10 M140 110 l12 10" stroke="#ff4757" stroke-width="6" fill="none" stroke-linecap="round"/>'); };
A.oilbarrel = c => { c.shadow(100, 188, 50, 6); c.raw(`<rect x="56" y="40" width="88" height="140" rx="10" fill="${c.lg('#2b2340')}"/><path d="M56 80 h88 M56 140 h88" stroke="#5a5470" stroke-width="6"/>`); c.drop(100, 110, .5, '#111'); };
module.exports = lib;
