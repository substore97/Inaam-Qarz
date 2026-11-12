// Art for "رياضياتي ٣": arrays, polygons, perimeter, angles. Extends the grade-3 art.
const lib = require('../../lughati3-book/src/grade3-art');
const { A } = lib;
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
// param "rows,cols": dots arranged in an array
A.array = (c, p = '3,4') => { const [r, k] = p.split(',').map(Number); const g = Math.min(160 / k, 160 / r);
  c.raw(`<rect x="10" y="10" width="180" height="180" rx="22" fill="#ffffff" stroke="#c9b2ff" stroke-width="5"/>`);
  for (let i = 0; i < r; i++) for (let j = 0; j < k; j++) c.ball(100 - (k - 1) * g / 2 + j * g, 100 - (r - 1) * g / 2 + i * g, g * .36, ['#ff4757', '#4fa8ff', '#36c45d', '#ffb627', '#b05cff'][i % 5]); };
// param "n": regular polygon with n sides
A.poly = (c, n = '5') => { n = +n; const pts = Array.from({ length: n }, (_, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / n; return `${(100 + 78 * Math.cos(a)).toFixed(1)} ${(104 + 78 * Math.sin(a)).toFixed(1)}`; });
  c.shadow(100, 190, 60, 6); c.path('M' + pts.join(' L') + ' Z', ['#ff6b6b', '#4fa8ff', '#36c45d', '#ffb627', '#b05cff', '#2ec4b6', '#ff8a1f'][n % 7], { vert: true }); c.face(100, 112, .55); };
// param "w,h": rectangle with labelled sides (cm)
A.perim = (c, p = '6,3') => { const [w, h] = p.split(',').map(Number); const W = 124, H = Math.max(50, 124 * h / w);
  const x = 100 - W / 2, y = 100 - H / 2; c.raw(`<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="6" fill="${c.vg('#9fe0b4')}" stroke="#1f8f4f" stroke-width="5"/>`);
  const lab = (tx, ty, t) => c.raw(`<text x="${tx}" y="${ty}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="20" fill="#1f5a36">${t}</text>`);
  lab(100, y - 8, `${AR(w)} سم`); lab(100, y + H + 24, `${AR(w)} سم`); lab(x - 16, 106, AR(h)); lab(x + W + 16, 106, AR(h)); };
A.rightangle = c => { c.raw('<path d="M40 30 V160 H170" stroke="#2f55c4" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="40" y="130" width="30" height="30" fill="none" stroke="#ff4757" stroke-width="5"/>'); };
A.scale = c => { c.shadow(100, 188, 60, 7); c.raw(`<rect x="40" y="120" width="120" height="64" rx="14" fill="${c.vg('#e6ebf3')}" stroke="#9aa3b5" stroke-width="3"/><rect x="60" y="134" width="80" height="30" rx="6" fill="#bfe6ff"/><text x="100" y="158" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="22" fill="#1f3a8f">١ كجم</text><rect x="30" y="108" width="140" height="14" rx="6" fill="#9aa3b5"/>`); A.group(c, 'apple,1'); };
module.exports = lib;
