// 3D sea creatures for "بحري الجميل". Extends the shared art library.
const lib = require('../../space-book/src/space-art');
const { A } = lib;

A.dolphin = c => {
  c.path('M150 96 L184 70 Q176 96 186 118 Z', '#4f8fd4');
  c.path('M96 70 Q112 42 132 52 Q120 62 118 76 Z', '#4f8fd4');
  c.path('M20 112 Q30 70 96 66 Q150 64 166 100 Q170 124 140 134 Q90 148 50 132 Q20 124 20 112 Z', '#6aa8ec', { vert: true, shine: [70, 80, 22, 6, -8, .7] });
  c.path('M24 114 Q60 140 130 130 Q100 122 60 124 Q36 122 24 114 Z', '#dceeff', { noEdge: true });
  c.path('M24 104 Q8 104 6 112 Q14 116 24 114 Z', '#6aa8ec');
  c.ell(90, 132, 16, 7, '#4f8fd4', { rot: 30 });
  c.face(60, 98, .85);
  c.shadow(100, 180, 60, 6, .12);
};
A.shark = c => {
  c.path('M150 96 L190 62 Q182 98 190 132 Z', '#7d8aa8');
  c.path('M84 66 Q98 22 118 58 Z', '#7d8aa8');
  c.path('M14 106 Q30 62 100 60 Q150 60 164 96 Q166 126 120 138 Q60 150 26 128 Q12 118 14 106 Z', '#98a6c2', { vert: true, shine: [70, 76, 22, 6, -8, .7] });
  c.path('M18 112 Q60 140 140 126 Q90 128 50 124 Q28 120 18 112 Z', '#eef2f8', { noEdge: true });
  c.raw('<path d="M28 116 l6 6 l6 -6 l6 6 l6 -6 l6 6" stroke="#ffffff" stroke-width="2.4" fill="none"/>');
  c.ell(96, 132, 18, 7, '#7d8aa8', { rot: 30 });
  c.face(58, 96, .85, { mouth: false });
  c.shadow(100, 180, 60, 6, .12);
};
A.octopus = c => {
  c.shadow(100, 188, 66, 7);
  for (let i = 0; i < 8; i++) {
    const x = 38 + i * 17.7, dir = i < 4 ? -1 : 1;
    c.line(`M${x} 110 Q${x + dir * 6} 150 ${x - dir * 10} 168 Q${x - dir * 18} 178 ${x - dir * 8} 184`, '#b05cff', 15);
  }
  for (let i = 0; i < 8; i++) { const x = 38 + i * 17.7; c.raw(`<circle cx="${x}" cy="140" r="3" fill="#e8c8ff"/><circle cx="${x + (i < 4 ? 2 : -2)}" cy="156" r="2.6" fill="#e8c8ff"/>`); }
  c.ell(100, 82, 62, 58, '#b874ff', { shine: true });
  c.face(100, 92, 1.1);
};
A.crab = c => {
  c.shadow(100, 186, 72, 7);
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) c.line(`M${100 + s * 40} ${128 + k * 10} Q${100 + s * 70} ${130 + k * 14} ${100 + s * 80} ${150 + k * 12}`, '#e8573a', 7);
  for (const s of [-1, 1]) {
    c.line(`M${100 + s * 40} 110 Q${100 + s * 62} 92 ${100 + s * 66} 70`, '#e8573a', 9);
    c.path(`M${100 + s * 66} 74 Q${100 + s * 96} 66 ${100 + s * 84} 40 Q${100 + s * 72} 30 ${100 + s * 62} 46 Q${100 + s * 74} 52 ${100 + s * 66} 60 Z`, '#ff6b4a');
  }
  c.line('M86 92 V70 M114 92 V70', '#e8573a', 5);
  c.ball(86, 66, 9, '#ffffff', { shine: false }).ball(114, 66, 9, '#ffffff', { shine: false });
  c.raw('<circle cx="87" cy="67" r="4.5" fill="#2b2340"/><circle cx="115" cy="67" r="4.5" fill="#2b2340"/>');
  c.ell(100, 124, 52, 36, '#ff6b4a', { shine: true });
  c.line('M90 130 Q100 138 110 130', '#2b2340', 2.6);
  c.raw('<ellipse cx="72" cy="124" rx="7" ry="4" fill="#ff9aa8" opacity=".6"/><ellipse cx="128" cy="124" rx="7" ry="4" fill="#ff9aa8" opacity=".6"/>');
};
A.starfish = c => { c.shadow(100, 184, 66, 7); c.star(100, 102, 84, '#ff8a6b', 0); for (const [x, y] of [[100, 50], [148, 92], [130, 150], [70, 150], [52, 92], [100, 80], [120, 110], [80, 110]]) c.raw(`<circle cx="${x}" cy="${y}" r="3" fill="#ffc7b8"/>`); c.face(100, 110, 1); };
A.jellyfish = c => {
  for (let i = 0; i < 5; i++) { const x = 60 + i * 20; c.raw(`<path d="M${x} 110 Q${x - 10} 140 ${x} 160 Q${x + 10} 180 ${x - 2} 196" stroke="#ffb3d9" stroke-width="5" fill="none" opacity=".85" stroke-linecap="round"/>`); }
  c.raw(`<path d="M30 112 Q30 36 100 34 Q170 36 170 112 Q150 104 135 114 Q118 104 100 114 Q82 104 65 114 Q50 104 30 112 Z" fill="${c.rg('#ff8fd0')}" opacity=".88" stroke="#e05aa8" stroke-opacity=".4"/>`);
  c.shine(70, 58, 18, 8, -25, .7);
  c.face(100, 84, 1);
};
A.seahorse = c => {
  c.shadow(100, 190, 40, 6);
  c.line('M100 120 Q90 160 112 172 Q130 180 128 162 Q126 150 114 156', '#ffb627', 14);
  c.path('M112 54 Q150 58 150 80 Q150 92 138 94 L130 92 Q140 110 128 128 Q110 150 92 132 Q78 116 86 96 Q72 86 74 70 Q78 50 112 54 Z', '#ffc93b', { shine: [92, 66, 10, 5, -20, .7] });
  c.path('M144 76 Q160 72 166 77 Q168 83 161 85 Q152 87 146 86 Z', '#ffb627');
  c.path('M100 56 L106 40 L112 54 L120 42 L122 58 Z', '#ff9f1c');
  c.path('M86 80 Q70 90 74 112 Q80 100 90 96 Z', '#ff9f1c');
  for (let k = 0; k < 4; k++) c.raw(`<path d="M${96 - k * 4} ${100 + k * 10} h10" stroke="#e8a11a" stroke-width="2.4"/>`);
  c.face(118, 74, .7);
};
A.shell = c => {
  c.shadow(100, 176, 70, 7);
  c.path('M100 160 L30 100 Q30 40 100 36 Q170 40 170 100 Z', '#ffb3c7', { shine: [74, 64, 14, 6, -30, .7] });
  c.line('M100 160 L60 50 M100 160 L80 40 M100 160 L100 36 M100 160 L120 40 M100 160 L140 50', '#ff8fab', 3);
  c.path('M80 156 L120 156 L112 174 L88 174 Z', '#ff9ab8');
  c.ball(100, 118, 12, '#ffffff');
  c.face(100, 96, .75, { blush: false });
};
A.clownfish = c => {
  c.path('M146 100 L186 74 Q176 100 186 126 Z', '#ff8a1f');
  c.path('M84 64 Q106 40 128 66 Z', '#ff8a1f');
  c.raw(`<clipPath id="${c.id}cf"><ellipse cx="100" cy="100" rx="56" ry="40"/></clipPath>`);
  c.ell(100, 100, 56, 40, '#ff8a1f');
  c.raw(`<g clip-path="url(#${c.id}cf)"><rect x="74" y="56" width="16" height="90" fill="#ffffff" stroke="#2b2340" stroke-width="2.5"/><rect x="118" y="56" width="14" height="90" fill="#ffffff" stroke="#2b2340" stroke-width="2.5"/></g>`);
  c.shine(72, 78, 14, 6, -20, .7);
  c.face(66, 98, .8);
  c.shadow(100, 176, 50, 6, .12);
};
A.pufferfish = c => {
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; c.path(`M${100 + 60 * Math.cos(a - .1)} ${100 + 60 * Math.sin(a - .1)} L${100 + 78 * Math.cos(a)} ${100 + 78 * Math.sin(a)} L${100 + 60 * Math.cos(a + .1)} ${100 + 60 * Math.sin(a + .1)} Z`, '#e8b83a', { flat: true }); }
  c.path('M156 100 L182 82 Q176 100 182 118 Z', '#ffc93b');
  c.ball(100, 100, 62, '#ffd84d');
  c.ell(100, 128, 40, 24, '#fff6c9', { noEdge: true });
  c.face(92, 98, 1.05, { mouth: 'open' });
};
A.seal = c => {
  c.ell(100, 182, 84, 12, '#dff1ff', { shine: true });
  c.ell(48, 170, 22, 9, '#7d8aa8', { rot: -20 }).ell(150, 170, 26, 9, '#7d8aa8', { rot: 25 });
  c.path('M40 172 Q40 110 82 98 Q112 92 136 112 Q170 140 168 172 Z', '#98a6c2', { vert: true });
  c.ball(86, 82, 40, '#a8b5cf');
  c.ell(86, 98, 16, 11, '#c9d3e6', { noEdge: true });
  c.ell(86, 92, 6, 4, '#2b2340');
  c.raw('<path d="M74 98 L54 94 M74 102 L56 104 M98 98 L118 94 M98 102 L116 104" stroke="#5a5a6e" stroke-width="1.6"/>');
  c.face(86, 78, .9, { mouth: false });
  c.ball(150, 52, 18, '#ff4757'); c.line('M140 44 Q150 58 162 46', '#ffffff', 3);
};
A.coral = c => {
  c.ell(100, 184, 84, 12, '#f2d9a8', { shine: true });
  c.line('M60 182 V120 M60 150 L36 120 M60 140 L80 108 M36 120 V96 M80 108 V84', '#ff6b8a', 14);
  c.line('M140 182 V110 M140 150 L164 124 M140 130 L120 100 M164 124 V96 M120 100 V80', '#ff9a3c', 14);
  c.line('M100 182 V90 M100 130 L82 104', '#c77dff', 12);
  for (const [x, y, col] of [[36, 94, '#ff6b8a'], [80, 82, '#ff6b8a'], [164, 94, '#ff9a3c'], [120, 78, '#ff9a3c'], [100, 88, '#c77dff'], [82, 102, '#c77dff']]) c.ball(x, y, 9, col);
  c.ball(100, 140, 22, '#ffb3c7');
  c.face(100, 142, .8);
};
A.stingray = c => {
  c.shadow(100, 186, 70, 7, .14);
  c.line('M100 150 Q110 176 140 190', '#7d6a9a', 4);
  c.path('M100 50 Q130 70 186 98 Q140 120 100 150 Q60 120 14 98 Q70 70 100 50 Z', '#9b84c8', { vert: true, shine: [70, 86, 16, 6, -20, .6] });
  for (const [x, y] of [[80, 84], [120, 84], [100, 112], [70, 104], [130, 104]]) c.raw(`<circle cx="${x}" cy="${y}" r="3.4" fill="#cdbff0"/>`);
  c.face(100, 96, .9);
};
A.seaturtle = c => A.turtle(c);
module.exports = lib;
