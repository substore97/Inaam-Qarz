// Art for "رياضياتي ٦": number line, circle parts, coin, dice. Extends the shared chain.
const lib = require('../../science5-book/src/science5-art');
const { A } = lib;
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
A.numline = c => { c.raw('<path d="M10 110 H190" stroke="#2b2340" stroke-width="5"/><path d="M190 110 l-12 -8 v16 Z M10 110 l12 -8 v16 Z" fill="#2b2340"/>');
  for (let k = -3; k <= 3; k++) { const x = 100 + k * 26; c.raw(`<path d="M${x} 100 V120" stroke="#2b2340" stroke-width="4"/><text x="${x}" y="148" direction="ltr" unicode-bidi="bidi-override" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="20" fill="${k < 0 ? '#e8392b' : k > 0 ? '#1f8f4f' : '#2b2340'}">${k < 0 ? '−' : ''}${AR(Math.abs(k))}</text>`); }
  c.ball(48, 110, 9, '#e8392b'); c.ball(152, 110, 9, '#36c45d'); };
A.circ = (c, m = 'r') => { c.shadow(100, 188, 60, 6); c.raw('<circle cx="100" cy="100" r="76" fill="#e3f0ff" stroke="#2f55c4" stroke-width="6"/>'); c.ball(100, 100, 6, '#2b2340', { shine: false });
  if (m === 'r') c.raw('<path d="M100 100 L176 100" stroke="#e8392b" stroke-width="7" stroke-linecap="round"/>');
  if (m === 'd') c.raw('<path d="M24 100 L176 100" stroke="#e8392b" stroke-width="7" stroke-linecap="round"/>');
  if (m === 'c') c.raw('<circle cx="100" cy="100" r="76" fill="none" stroke="#e8392b" stroke-width="9" stroke-dasharray="14 8"/>'); };
A.coin = c => { c.shadow(100, 186, 56, 7); c.ell(100, 110, 70, 70, '#e8b830'); c.ball(100, 100, 66, '#ffd84d'); c.raw('<circle cx="100" cy="100" r="50" fill="none" stroke="#c99a20" stroke-width="4"/>'); c.star(100, 100, 22, '#e8b830'); };
A.dice = c => { c.shadow(100, 188, 60, 7); c.path('M40 70 L100 40 L160 70 L100 100 Z', '#ffffff', { flat: true }); c.path('M40 70 L100 100 L100 176 L40 146 Z', '#eef1f7', { vert: true }); c.path('M100 100 L160 70 L160 146 L100 176 Z', '#dfe4ee', { vert: true });
  for (const [x, y] of [[100, 70]]) c.ball(x, y, 7, '#e8392b', { shine: false }); for (const [x, y] of [[55, 95], [85, 150], [70, 122]]) c.ball(x, y, 6, '#2b2340', { shine: false }); for (const [x, y] of [[118, 105], [145, 92], [118, 150], [145, 137]]) c.ball(x, y, 6, '#2b2340', { shine: false }); };
A.scale2 = c => { c.raw('<path d="M100 40 V170 M40 60 H160" stroke="#8b5a2b" stroke-width="7" stroke-linecap="round"/><path d="M60 170 H140" stroke="#8b5a2b" stroke-width="10" stroke-linecap="round"/>');
  c.raw('<path d="M40 60 L20 110 H60 Z M160 60 L140 110 H180 Z" fill="none" stroke="#9aa3b5" stroke-width="3"/>'); c.ell(40, 112, 26, 8, '#ffd23f'); c.ell(160, 112, 26, 8, '#ffd23f');
  c.raw('<text x="40" y="104" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="22" fill="#2f55c4">س</text><text x="160" y="104" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="22" fill="#2f55c4">٧</text>'); };
module.exports = lib;
