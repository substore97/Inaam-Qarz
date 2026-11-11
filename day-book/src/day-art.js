// 3D clock that can show any time, for "يومي الجميل".
const lib = require('../../islam-book/src/islam-art');
const { A } = lib;
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

// param: "h:m" (e.g. "6:30"), or "" for an empty clock face (children draw the hands)
A.clockt = (c, t = '3:00') => {
  c.shadow(100, 190, 60, 7);
  c.ball(100, 100, 84, '#4fa8ff');
  c.ball(100, 100, 70, '#ffffff', { shine: false });
  for (let k = 1; k <= 12; k++) {
    const a = k * Math.PI / 6;
    c.raw(`<text x="${(100 + 56 * Math.sin(a)).toFixed(1)}" y="${(100 - 56 * Math.cos(a) + 7).toFixed(1)}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="19" fill="#2b2340">${AR(k)}</text>`);
  }
  if (t) {
    const [h, m] = t.split(':').map(Number);
    const am = (m / 60) * 2 * Math.PI, ah = ((h % 12) + m / 60) / 12 * 2 * Math.PI;
    c.line(`M100 100 L${(100 + 30 * Math.sin(ah)).toFixed(1)} ${(100 - 30 * Math.cos(ah)).toFixed(1)}`, '#ff4757', 8);
    c.line(`M100 100 L${(100 + 46 * Math.sin(am)).toFixed(1)} ${(100 - 46 * Math.cos(am)).toFixed(1)}`, '#2b2340', 5);
  }
  c.ball(100, 100, 7, '#ffd23f');
};
module.exports = lib;
