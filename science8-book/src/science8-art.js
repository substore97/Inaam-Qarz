// Art for "علومي ٨": blood vessels, blood cells, flask, pH scale, transverse wave, spring wave, water cycle.
const lib = require('../../math8-book/src/math8-art');
const { A } = lib;
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const put = (c, name, x, y, s) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c); c.raw('</g>'); };
A.vessels = c => { c.shadow(100, 188, 70, 6); c.raw('<path d="M100 20 C60 60 140 90 100 130 S60 170 100 186" stroke="#e8392b" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M60 20 C30 70 90 110 50 186" stroke="#3d6fe0" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M140 20 C170 80 120 120 152 186" stroke="#c2364f" stroke-width="8" fill="none" stroke-linecap="round"/>'); };
A.blood = c => { c.shadow(100, 186, 70, 6); c.raw('<rect x="14" y="20" width="172" height="160" rx="30" fill="#ffe3e3"/>');
  for (const [x, y] of [[50, 60], [110, 50], [150, 90], [70, 120], [130, 140], [40, 160]]) { c.ell(x, y, 22, 16, '#e8392b'); c.ell(x, y, 9, 6, '#b8202a'); }
  c.ball(100, 100, 18, '#f4f6ff'); c.ball(100, 100, 8, '#9b6bff', { shine: false }); for (const [x, y] of [[160, 40], [30, 100], [170, 160]]) c.ball(x, y, 6, '#ffb020', { shine: false }); };
A.flask = c => { c.shadow(100, 188, 60, 7); c.raw('<path d="M82 20 H118 V70 L170 170 Q174 182 160 182 H40 Q26 182 30 170 L82 70 Z" fill="#e9f6ff" stroke="#9fc9e8" stroke-width="5"/><path d="M58 120 H142 L166 170 Q168 178 158 178 H42 Q32 178 34 170 Z" fill="#7be08f"/>');
  for (const [x, y, r] of [[80, 150, 7], [110, 135, 5], [125, 160, 6], [95, 105, 5], [104, 80, 4]]) c.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity=".85"/>`); };
A.phscale = c => { const cols = ['#e8392b', '#ff6b2a', '#ff9a2e', '#ffc93c', '#ffe94d', '#c7e85a', '#36c45d', '#2fb3a0', '#2f9be0', '#2f6fe0', '#4b4fd0', '#6a3fd0', '#8a2fc0', '#a02f9a'];
  cols.forEach((col, k) => c.raw(`<rect x="${10 + k * 13}" y="60" width="13" height="70" fill="${col}"/>`));
  c.raw('<rect x="10" y="60" width="182" height="70" rx="4" fill="none" stroke="#2b2340" stroke-width="3"/>');
  for (const [k, t] of [[0, 0], [7, 7], [14, 14]]) c.raw(`<text x="${10 + k * 13}" y="160" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="20" fill="#2b2340">${AR(t)}</text>`); };
A.wave = c => { let d = 'M10 100'; for (let x = 10; x <= 190; x += 4) d += ` L${x} ${100 - Math.sin((x - 10) / 180 * 4 * Math.PI) * 50}`;
  c.raw(`<path d="M10 100 H190" stroke="#c9d6ea" stroke-width="3" stroke-dasharray="6 6"/><path d="${d}" stroke="#2f7de8" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M32 40 H77" stroke="#e8392b" stroke-width="4"/><path d="M32 32 v16 M77 32 v16" stroke="#e8392b" stroke-width="4"/>`); };
A.spring = c => { let d = 'M10 100'; const xs = [12, 18, 24, 30, 50, 70, 90, 96, 102, 108, 128, 148, 168, 174, 180, 186];
  xs.forEach((x, k) => d += ` L${x} ${k % 2 ? 70 : 130}`); c.raw(`<path d="${d}" stroke="#ff8a1f" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="M20 160 H180" stroke="#2f55c4" stroke-width="5"/><path d="M180 160 l-12 -8 v16 Z M20 160 l12 -8 v16 Z" fill="#2f55c4"/>`); };
A.watercycle = c => { c.raw('<rect x="0" y="0" width="200" height="200" rx="20" fill="#dff2ff"/><path d="M0 160 Q50 140 100 160 T200 160 V200 H0 Z" fill="#4fa8ff"/>'); put(c, 'sun', 4, 4, .32); put(c, 'raincloud', 110, 0, .42);
  c.raw('<path d="M60 140 Q50 100 80 70" stroke="#ff8a1f" stroke-width="5" fill="none" stroke-dasharray="7 6"/><path d="M74 66 l10 2 l-4 10 Z" fill="#ff8a1f"/><path d="M150 96 Q160 120 150 146" stroke="#2f55c4" stroke-width="5" fill="none" stroke-dasharray="7 6"/><path d="M142 140 l8 10 l6 -10 Z" fill="#2f55c4"/>'); };
module.exports = lib;
