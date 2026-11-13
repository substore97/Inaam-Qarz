// Art for "رياضياتي ٨": coordinate grid, slope line, 3-4-5 triangle, prism, inequality line, square grid.
const lib = require('../../science7-book/src/science7-art');
const { A } = lib;
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const grid = (c, n = 6, s = 26, x0 = 22, y0 = 18) => { let g = ''; for (let k = 0; k <= n; k++) g += `M${x0 + k * s} ${y0} V${y0 + n * s} M${x0} ${y0 + k * s} H${x0 + n * s} `;
  c.raw(`<rect x="${x0}" y="${y0}" width="${n * s}" height="${n * s}" fill="#ffffff"/><path d="${g}" stroke="#c9d6ea" stroke-width="2"/><path d="M${x0} ${y0} V${y0 + n * s} H${x0 + n * s}" stroke="#2b2340" stroke-width="4" fill="none"/>`); };
A.coords = c => { c.shadow(100, 192, 80, 6); grid(c); const x = 22 + 3 * 26, y = 18 + (6 - 2) * 26;
  c.raw(`<path d="M22 ${y} H${x} V174" stroke="#e8392b" stroke-width="3" stroke-dasharray="6 5" fill="none"/>`); c.ball(x, y, 9, '#e8392b'); };
A.slope = c => { c.shadow(100, 192, 80, 6); grid(c); c.raw('<path d="M22 174 L178 44" stroke="#2f7de8" stroke-width="7" stroke-linecap="round"/><path d="M74 131 H126 V87" stroke="#ff8a1f" stroke-width="5" fill="none" stroke-dasharray="7 5"/>'); c.ball(74, 131, 7, '#2f7de8'); c.ball(126, 87, 7, '#2f7de8'); };
A.tri345 = c => { c.shadow(100, 186, 80, 6); c.path('M30 170 L170 170 L30 50 Z', '#7cc8ff', { vert: true }); c.raw('<path d="M30 156 h14 v14" fill="none" stroke="#2b2340" stroke-width="3"/>');
  const t = (x, y, s, col) => c.raw(`<text x="${x}" y="${y}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="26" fill="${col}">${s}</text>`);
  t(18, 118, AR(3), '#2f55c4'); t(100, 196, AR(4), '#2f55c4'); t(112, 104, AR(5), '#e8392b'); };
A.prism = c => { c.shadow(100, 186, 80, 7); c.path('M30 160 L130 160 L80 80 Z', '#ffb84d', { vert: true }); c.path('M130 160 L180 130 L130 50 L80 80 Z', '#ff9a2e', { vert: true }); c.path('M80 80 L130 50 L180 130 L130 160 Z', '#ffcf80', { flat: true }); };
A.ineq = c => { c.raw('<path d="M10 110 H190" stroke="#2b2340" stroke-width="5"/><path d="M10 110 l12 -8 v16 Z" fill="#2f7de8"/>');
  for (let k = 0; k <= 6; k++) { const x = 22 + k * 26; c.raw(`<path d="M${x} 100 V120" stroke="#2b2340" stroke-width="4"/><text x="${x}" y="148" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="20" fill="#2b2340">${AR(k)}</text>`); }
  c.raw('<path d="M126 110 H14" stroke="#2f7de8" stroke-width="9" stroke-linecap="round"/><circle cx="126" cy="110" r="9" fill="#ffffff" stroke="#2f7de8" stroke-width="5"/>'); };
A.sqgrid = c => { c.shadow(100, 186, 70, 6); const n = 5, s = 28, x0 = 30, y0 = 20; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c.raw(`<rect x="${x0 + i * s}" y="${y0 + j * s}" width="${s - 3}" height="${s - 3}" rx="4" fill="${(i + j) % 2 ? '#9be07a' : '#7ed067'}"/>`); };
module.exports = lib;
