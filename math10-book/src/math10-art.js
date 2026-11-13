// Art for "رياضياتي ١٠": parabola, two crossing lines, staircase sequence, right triangle with angle θ.
const lib = require('../../science9-book/src/science9-art');
const { A } = lib;
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const axes = c => c.raw('<rect x="14" y="14" width="172" height="172" rx="10" fill="#ffffff"/><path d="M100 20 V180 M20 120 H180" stroke="#9aa3b5" stroke-width="3"/>');
A.parabola = c => { c.shadow(100, 194, 80, 5); axes(c); let d = ''; for (let x = -3; x <= 3.01; x += .1) { const X = 100 + x * 24, Y = 150 - x * x * 13; if (Y < 22) continue; d += `${d ? 'L' : 'M'}${X.toFixed(1)} ${Y.toFixed(1)} `; }
  c.raw(`<path d="${d}" stroke="#e8392b" stroke-width="6" fill="none" stroke-linecap="round"/>`); c.ball(100, 150, 8, '#2f55c4'); };
A.twolines = c => { c.shadow(100, 194, 80, 5); axes(c); c.raw('<path d="M24 170 L176 40" stroke="#2f7de8" stroke-width="6" stroke-linecap="round"/><path d="M24 50 L176 160" stroke="#36c45d" stroke-width="6" stroke-linecap="round"/>');
  const t = (50 - 170) / ((176 - 24) * ((40 - 170) / 152 - (160 - 50) / 152)); c.ball(100, 105, 9, '#e8392b'); };
A.stairs = c => { c.shadow(100, 188, 80, 6); for (let k = 0; k < 5; k++) { c.raw(`<rect x="${20 + k * 32}" y="${160 - k * 28}" width="32" height="${24 + k * 28}" rx="4" fill="${['#ffd23f', '#ffb020', '#ff8a1f', '#ff6b4a', '#e8392b'][k]}"/>`);
  c.raw(`<text x="${36 + k * 32}" y="${152 - k * 28}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="20" fill="#2b2340">${AR(2 + 3 * k)}</text>`); } };
A.trig = c => { c.shadow(100, 186, 80, 6); c.path('M30 170 L170 170 L170 60 Z', '#9fd8ff', { vert: true }); c.raw('<path d="M156 170 v-14 h14" fill="none" stroke="#2b2340" stroke-width="3"/><path d="M70 170 A40 40 0 0 0 63 145" fill="none" stroke="#e8392b" stroke-width="4"/>');
  c.raw('<text x="80" y="162" font-family="Baloo" font-weight="800" font-size="22" fill="#e8392b">θ</text>'); };
module.exports = lib;
