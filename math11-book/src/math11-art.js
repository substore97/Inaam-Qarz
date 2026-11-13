// Art for "رياضياتي ١١": exponential curve, matrix brackets, circle on grid, growing squares.
const lib = require('../../science10-book/src/science10-art');
const { A } = lib;
const axes = c => c.raw('<rect x="14" y="14" width="172" height="172" rx="10" fill="#ffffff"/><path d="M40 20 V180 M20 160 H180" stroke="#9aa3b5" stroke-width="3"/>');
A.expo = c => { c.shadow(100, 194, 80, 5); axes(c); let d = ''; for (let x = -1; x <= 3.01; x += .1) { const X = 40 + (x + 1) * 34, Y = 160 - Math.pow(2, x) * 16; if (Y < 20) continue; d += `${d ? 'L' : 'M'}${X.toFixed(1)} ${Y.toFixed(1)} `; }
  c.raw(`<path d="${d}" stroke="#36c45d" stroke-width="6" fill="none" stroke-linecap="round"/>`); };
A.matrix = c => { c.shadow(100, 186, 70, 6); c.raw('<path d="M44 40 h-14 v120 h14 M156 40 h14 v120 h-14" stroke="#2b2340" stroke-width="7" fill="none"/>');
  const t = (x, y, s, col) => c.raw(`<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="38" fill="${col}">${s}</text>`);
  t(72, 88, '٢', '#e8392b'); t(128, 88, '١', '#2f55c4'); t(72, 142, '٣', '#36c45d'); t(128, 142, '٤', '#ff8a1f'); };
A.circgrid = c => { c.shadow(100, 194, 80, 5); c.raw('<rect x="14" y="14" width="172" height="172" rx="10" fill="#ffffff"/><path d="M100 20 V180 M20 100 H180" stroke="#9aa3b5" stroke-width="3"/><circle cx="100" cy="100" r="56" fill="none" stroke="#2f7de8" stroke-width="6"/><path d="M100 100 L140 60" stroke="#e8392b" stroke-width="5"/>'); c.ball(100, 100, 6, '#2b2340', { shine: false }); };
A.geo = c => { c.shadow(100, 188, 80, 6); [8, 16, 32, 64].forEach((s, k) => c.raw(`<rect x="${20 + [0, 14, 36, 76][k]}" y="${170 - s}" width="${s}" height="${s}" rx="4" fill="${['#ffd23f', '#ffb020', '#ff8a1f', '#e8392b'][k]}"/>`)); };
module.exports = lib;
