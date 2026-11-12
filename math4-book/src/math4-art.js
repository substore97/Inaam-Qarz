// Art for "رياضياتي ٤": angles and area grids. Extends the grade-3 art.
const lib = require('../../science3-book/src/science3-art');
const { A } = lib;
// param: angle in degrees
A.angle = (c, d = '45') => { d = +d; const r = (d * Math.PI) / 180, L = d > 90 ? 90 : 130, x0 = d > 90 ? 100 : 40, y0 = 160;
  const x1 = x0 + L * Math.cos(r), y1 = y0 - L * Math.sin(r);
  c.raw(`<path d="M${x0 + L} ${y0} L${x0} ${y0} L${x1.toFixed(1)} ${y1.toFixed(1)}" stroke="#2f55c4" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  if (d === 90) c.raw(`<rect x="${x0}" y="${y0 - 30}" width="30" height="30" fill="none" stroke="#ff4757" stroke-width="5"/>`);
  else c.raw(`<path d="M${x0 + 40} ${y0} A40 40 0 0 0 ${(x0 + 40 * Math.cos(r)).toFixed(1)} ${(y0 - 40 * Math.sin(r)).toFixed(1)}" stroke="#ff4757" stroke-width="5" fill="none"/>`);
  c.ball(x0, y0, 8, '#ffd23f'); };
// param "w,h": grid of unit squares
A.areagrid = (c, p = '4,3') => { const [w, h] = p.split(',').map(Number); const s = Math.min(150 / w, 150 / h), x0 = 100 - w * s / 2, y0 = 100 - h * s / 2;
  for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) c.raw(`<rect x="${(x0 + i * s).toFixed(1)}" y="${(y0 + j * s).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="${(i + j) % 2 ? '#9fe0b4' : '#c9f2d4'}" stroke="#1f8f4f" stroke-width="2.5"/>`); };

// param "n,d": n dots in rows of d, leftovers highlighted (division with remainder)
A.remdots = (c, p = '17,5') => { const [n, d] = p.split(',').map(Number); const rows = Math.ceil(n / d), g = Math.min(150 / d, 150 / rows);
  c.raw('<rect x="10" y="10" width="180" height="180" rx="22" fill="#ffffff" stroke="#c9b2ff" stroke-width="5"/>');
  for (let k = 0; k < n; k++) { const i = Math.floor(k / d), j = k % d, full = i < Math.floor(n / d);
    c.ball(100 - (d - 1) * g / 2 + j * g, 100 - (rows - 1) * g / 2 + i * g, g * .34, full ? ['#4fa8ff', '#36c45d', '#ffb627', '#b05cff'][i % 4] : '#ff4757'); } };
module.exports = lib;
