// Art for "علومي ١٢": hydrocarbon chain, galvanic cell, radiation sign, circular orbit, neuron.
const lib = require('../../math12-book/src/math12-art');
const { A } = lib;
A.hydro = c => { c.shadow(100, 186, 80, 6); const C = [[50, 100], [100, 100], [150, 100]];
  const H = [[50, 52], [50, 148], [14, 100], [100, 52], [100, 148], [150, 52], [150, 148], [186, 100]];
  C.forEach(([x, y], i) => { if (i) c.raw(`<path d="M${C[i - 1][0]} ${y} H${x}" stroke="#5a6478" stroke-width="8"/>`); });
  H.forEach(([x, y]) => { const n = C.reduce((b, p) => Math.hypot(p[0] - x, p[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? p : b); c.raw(`<path d="M${n[0]} ${n[1]} L${x} ${y}" stroke="#5a6478" stroke-width="6"/>`); });
  C.forEach(([x, y]) => c.ball(x, y, 20, '#3b3f4a')); H.forEach(([x, y]) => c.ball(x, y, 12, '#f2f4f8')); };
A.galvanic = c => { c.shadow(100, 190, 86, 6);
  for (const [x, col, met] of [[20, '#9fd4ff', '#b0b6c2'], [116, '#7ce0b0', '#d98c4a']]) c.raw(`<path d="M${x} 90 V170 Q${x} 180 ${x + 10} 180 H${x + 54} Q${x + 64} 180 ${x + 64} 170 V90" fill="#f0f8ff" stroke="#9fc9e8" stroke-width="4"/><rect x="${x + 3}" y="120" width="58" height="57" rx="6" fill="${col}"/><rect x="${x + 24}" y="70" width="16" height="90" rx="3" fill="${met}"/>`);
  c.raw('<path d="M52 70 V30 H148 V70" stroke="#e8392b" stroke-width="4" fill="none"/><path d="M60 110 Q100 80 140 110" stroke="#ffffff" stroke-width="14" fill="none"/><path d="M60 110 Q100 80 140 110" stroke="#e9e1c8" stroke-width="10" fill="none"/>');
  c.ball(100, 30, 14, '#ffd23f'); };
A.radio = c => { c.shadow(100, 186, 70, 6); c.raw('<circle cx="100" cy="100" r="80" fill="#ffd23f" stroke="#2b2340" stroke-width="6"/>');
  for (let k = 0; k < 3; k++) { const a = -90 + k * 120; const p = (r, d) => [100 + r * Math.cos((a + d) * Math.PI / 180), 100 + r * Math.sin((a + d) * Math.PI / 180)];
    const [x1, y1] = p(22, -30), [x2, y2] = p(68, -30), [x3, y3] = p(68, 30), [x4, y4] = p(22, 30);
    c.raw(`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} A68 68 0 0 1 ${x3.toFixed(1)} ${y3.toFixed(1)} L${x4.toFixed(1)} ${y4.toFixed(1)} A22 22 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="#2b2340"/>`); }
  c.raw('<circle cx="100" cy="100" r="13" fill="#2b2340"/>'); };
A.orbit = c => { c.raw('<rect x="10" y="10" width="180" height="180" rx="20" fill="#1d2550"/><circle cx="100" cy="100" r="66" fill="none" stroke="#8fa3ff" stroke-width="3" stroke-dasharray="8 6"/>');
  c.ball(100, 100, 32, '#3f8cff'); c.raw('<path d="M80 92 q10 -12 22 -4 q8 6 16 0 M86 114 q12 6 22 -2" stroke="#36c45d" stroke-width="7" fill="none" stroke-linecap="round"/>');
  c.ball(147, 53, 11, '#c9d1e0'); c.raw('<path d="M147 53 L175 81" stroke="#ffb020" stroke-width="4"/><path d="M147 53 L125 75" stroke="#e8392b" stroke-width="4"/>'); };
A.neuron = c => { c.shadow(100, 186, 80, 6);
  c.raw('<path d="M60 100 L172 100" stroke="#ffb98a" stroke-width="12" stroke-linecap="round"/>');
  for (const x of [92, 116, 140]) c.raw(`<rect x="${x}" y="90" width="18" height="20" rx="9" fill="#ffe08a"/>`);
  for (const [x, y] of [[20, 60], [24, 140], [40, 40], [44, 164], [16, 100]]) c.raw(`<path d="M56 100 Q${(56 + x) / 2} ${(100 + y) / 2 + 6} ${x} ${y}" stroke="#c77dff" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  for (const y of [80, 100, 120]) c.raw(`<path d="M172 100 L190 ${y}" stroke="#ffb98a" stroke-width="6" stroke-linecap="round"/>`);
  c.ball(56, 100, 26, '#b45cf0'); c.ball(56, 100, 10, '#6b2aa8', { shine: false }); };
module.exports = lib;
