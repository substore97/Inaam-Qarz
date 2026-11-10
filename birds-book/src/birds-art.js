// 3D birds & insects for "طيوري وحشراتي". Extends the shared art library.
const lib = require('../../toys-book/src/toys-art');
const { A } = lib;

const eyeBig = (c, x, y, r = 11) => { c.ball(x, y, r, '#ffffff', { shine: false }); c.raw(`<circle cx="${x + 1}" cy="${y + 1}" r="${r * .55}" fill="#2b2340"/><circle cx="${x + r * .3}" cy="${y - r * .3}" r="${r * .22}" fill="#fff"/>`); };
const legs = (c, x1, x2, y, col = '#ff9f1c', len = 18) => c.line(`M${x1} ${y} V${y + len} M${x1 - 7} ${y + len} H${x1 + 7} M${x2} ${y} V${y + len} M${x2 - 7} ${y + len} H${x2 + 7}`, col, 4);

A.parrot = c => {
  c.raw(`<rect x="20" y="168" width="160" height="12" rx="6" fill="${c.vg('#8b5a2b')}"/>`);
  c.path('M88 150 L70 196 L92 196 L104 152 Z', '#2f7de8'); c.path('M104 150 L112 198 L128 192 L114 148 Z', '#ffd23f');
  legs(c, 88, 112, 156, '#8a93a8', 12);
  c.ell(100, 112, 40, 50, '#36c45d', { shine: true });
  c.ell(76, 116, 18, 34, '#2f9e45', { rot: 15 });
  c.ball(104, 62, 34, '#ff4757');
  c.path('M128 60 Q150 62 146 84 Q140 78 126 76 Z', '#ffd23f');
  c.path('M128 74 Q140 80 136 90 Q128 86 124 80 Z', '#3d3d5c', { flat: true });
  eyeBig(c, 110, 54, 10);
  c.raw('<ellipse cx="92" cy="72" rx="7" ry="4" fill="#ff9aa8" opacity=".7"/>');
};
A.eagle = c => {
  c.shadow(100, 190, 60, 7);
  c.ell(50, 110, 30, 58, '#7a4f2a', { rot: -30 }).ell(150, 110, 30, 58, '#7a4f2a', { rot: 30 });
  c.ell(100, 124, 40, 54, '#8b5a2b', { shine: true });
  c.path('M80 170 L100 194 L120 170 Z', '#ffffff');
  legs(c, 88, 112, 174, '#ffc93b', 10);
  c.ball(100, 62, 32, '#ffffff');
  c.path('M100 64 Q124 62 124 82 Q116 78 104 78 Z', '#ffc93b');
  eyeBig(c, 88, 58, 8); eyeBig(c, 112, 58, 8);
  c.raw('<ellipse cx="78" cy="72" rx="6" ry="3.5" fill="#ff9aa8" opacity=".6"/><ellipse cx="122" cy="72" rx="6" ry="3.5" fill="#ff9aa8" opacity=".6"/>');
};
A.peacock = c => {
  c.shadow(100, 190, 70, 7);
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (1.08 + i * .105), x = 100 + 86 * Math.cos(a), y = 140 + 86 * Math.sin(a);
    c.line(`M100 140 L${x} ${y}`, '#2e9e45', 4);
    c.ell(x, y, 13, 16, '#36c45d'); c.ball(x, y, 7, '#2f7de8', { shine: false }); c.raw(`<circle cx="${x}" cy="${y}" r="3" fill="#ffd23f"/>`);
  }
  c.ell(100, 142, 26, 34, '#2f6fe0', { shine: true });
  legs(c, 92, 108, 172, '#8a93a8', 14);
  c.line('M100 120 Q96 96 104 80', '#2f6fe0', 16);
  c.ball(106, 74, 16, '#3d7ff0');
  c.line('M104 58 L100 44 M108 58 L110 44 M112 60 L120 48', '#2f6fe0', 2.5);
  c.ball(100, 43, 3.5, '#2f6fe0').ball(110, 43, 3.5, '#2f6fe0').ball(121, 47, 3.5, '#2f6fe0');
  c.path('M120 74 L132 78 L120 82 Z', '#ffc93b');
  c.face(106, 76, .5, { mouth: false });
};
A.sparrow = c => {
  c.raw(`<path d="M10 160 Q100 150 190 160" stroke="#8b5a2b" stroke-width="10" stroke-linecap="round" fill="none"/>`);
  c.ell(140, 162, 16, 7, '#45d36a', { rot: -20 });
  c.path('M46 112 L14 102 L22 124 Z', '#8b5a2b');
  legs(c, 92, 110, 142, '#ff9f1c', 12);
  c.ell(100, 112, 54, 40, '#c98a4e', { shine: true });
  c.ell(108, 124, 30, 18, '#f2d2a8', { noEdge: true });
  c.ell(84, 108, 26, 18, '#a8693a', { rot: 20 });
  c.path('M146 98 L166 104 L146 110 Z', '#ffc93b');
  c.face(126, 98, .75, { mouth: false });
};
A.dove = c => {
  c.shadow(100, 188, 64, 7);
  c.ell(40, 90, 22, 44, '#f4f6fb', { rot: -50 });
  c.path('M44 130 L10 120 L20 146 Z', '#e6ebf3');
  c.ell(100, 124, 54, 40, '#ffffff', { shine: true });
  c.ell(80, 116, 30, 20, '#e6ebf3', { rot: 15 });
  legs(c, 92, 110, 160, '#ff8a9a', 14);
  c.ball(140, 84, 26, '#ffffff');
  c.path('M162 82 L184 88 L162 94 Z', '#ffb627');
  c.line('M182 84 Q196 74 192 62 M186 88 Q200 90 196 78', '#45d36a', 3);
  c.face(140, 86, .7, { mouth: false });
};
A.ostrich = c => {
  c.shadow(100, 192, 50, 7);
  c.line('M84 120 L80 160 L70 188 M112 120 L118 160 L126 188', '#ffb3a0', 7);
  c.line('M64 188 H78 M120 188 H134', '#ffb3a0', 6);
  for (const [x, y, r] of [[70, 98, 24], [96, 88, 30], [124, 98, 24], [100, 112, 28]]) c.ball(x, y, r, '#3d3d5c');
  c.ball(56, 100, 14, '#ffffff', { shine: false });
  c.line('M120 86 Q132 50 126 30', '#ffc2b0', 11);
  c.ball(124, 28, 16, '#ffc2b0');
  c.path('M136 28 L152 34 L136 38 Z', '#ff9f1c');
  c.face(124, 28, .55, { mouth: false });
};
A.ant = c => {
  c.shadow(100, 176, 70, 6);
  for (const [x, d] of [[78, -1], [100, 0], [122, 1]]) c.line(`M${x} 126 L${x + d * 10 - 14} 166 M${x} 126 L${x + d * 10 + 14} 166`, '#3d3d5c', 4);
  c.ball(52, 118, 22, '#c2364f').ball(98, 118, 18, '#c2364f').ball(146, 102, 26, '#d9464f');
  c.line('M156 80 Q160 52 176 44 M144 78 Q136 52 146 38', '#3d3d5c', 3);
  c.ball(176, 44, 4, '#3d3d5c').ball(146, 38, 4, '#3d3d5c');
  c.face(148, 106, .75);
};
A.ladybug = c => {
  c.shadow(100, 184, 66, 7);
  for (const s of [-1, 1]) for (const y of [96, 120, 144]) c.line(`M${100 + s * 50} ${y} L${100 + s * 70} ${y + 10}`, '#3d3d5c', 5);
  c.ball(100, 64, 30, '#3d3d5c');
  c.line('M88 40 Q80 20 70 16 M112 40 Q120 20 130 16', '#3d3d5c', 3); c.ball(70, 16, 5, '#3d3d5c').ball(130, 16, 5, '#3d3d5c');
  c.raw(`<clipPath id="${c.id}lb"><ellipse cx="100" cy="124" rx="62" ry="56"/></clipPath>`);
  c.ell(100, 124, 62, 56, '#ff3b30', { shine: true });
  c.raw(`<g clip-path="url(#${c.id}lb)"><rect x="98" y="60" width="4" height="130" fill="#2b2340"/>${[[72, 104, 11], [128, 104, 11], [66, 140, 9], [134, 140, 9], [100, 164, 10], [86, 126, 7], [114, 126, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2b2340"/>`).join('')}</g>`);
  for (const sx of [-1, 1]) c.raw(`<ellipse cx="${100 + sx * 13}" cy="60" rx="7" ry="8" fill="#fff"/><circle cx="${100 + sx * 13 + 1}" cy="62" r="4" fill="#2b2340"/>`);
  c.line('M92 74 Q100 80 108 74', '#ffffff', 2.6);
};
A.caterpillar = c => {
  c.ell(100, 176, 90, 12, '#7ed99a', { shine: true });
  [[30, 150, 20], [56, 140, 22], [84, 134, 24], [112, 136, 24], [140, 144, 22]].forEach(([x, y, r], i) => { c.ball(x, y, r, i % 2 ? '#8be04e' : '#6fd03a'); c.line(`M${x - 6} ${y + r - 4} V${y + r + 8} M${x + 6} ${y + r - 4} V${y + r + 8}`, '#3d8a2a', 3); });
  c.ball(164, 120, 28, '#9be05a');
  c.line('M156 94 Q150 70 140 64 M172 94 Q180 70 190 66', '#3d8a2a', 3); c.ball(140, 64, 5, '#ff6fae').ball(190, 66, 5, '#ff6fae');
  c.face(164, 124, .85);
};
A.grasshopper = c => {
  c.shadow(100, 186, 76, 6);
  c.line('M64 128 L40 96 L20 170 M136 134 L150 170 M110 136 L104 172', '#4cae4c', 6);
  c.ell(80, 118, 56, 22, '#6fd03a', { shine: true });
  c.ell(76, 108, 46, 12, '#4cae4c', { rot: -6, opacity: .8 });
  c.ball(146, 104, 24, '#7ee04a');
  c.line('M150 82 Q160 40 186 26 M140 82 Q138 46 154 24', '#4cae4c', 3);
  c.face(150, 108, .7);
};
A.dragonfly = c => {
  c.shadow(100, 186, 50, 6, .12);
  for (const [x, y, r] of [[60, 78, -20], [140, 78, 20], [64, 106, 18], [136, 106, -18]]) c.ell(x, y, 42, 14, '#bfe9ff', { rot: r, opacity: .85 });
  c.raw('<path d="M30 70 Q60 64 92 80 M170 70 Q140 64 108 80" stroke="#7fcff5" stroke-width="1.5" fill="none"/>');
  c.raw(`<rect x="94" y="94" width="12" height="96" rx="6" fill="${c.lg('#2ec4b6')}"/>`);
  c.ell(100, 86, 14, 20, '#2ec4b6');
  c.ball(100, 58, 18, '#36d4c4');
  for (const sx of [-1, 1]) c.ball(100 + sx * 11, 52, 9, '#2f6fe0');
  c.face(100, 62, .5, { mouth: true, blush: false });
};
A.firefly = c => {
  c.raw(`<radialGradient id="${c.id}fg"><stop offset="0" stop-color="#fff6b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff6b0" stop-opacity="0"/></radialGradient><circle cx="100" cy="146" r="60" fill="url(#${c.id}fg)"/>`);
  c.ell(70, 84, 26, 40, '#e3f5ff', { rot: -30, opacity: .85 }).ell(130, 84, 26, 40, '#e3f5ff', { rot: 30, opacity: .85 });
  c.ell(100, 146, 26, 30, '#ffe14d', { shine: true });
  c.ell(100, 104, 26, 26, '#5a5a6e');
  c.ball(100, 70, 22, '#3d3d5c');
  c.line('M92 52 Q84 30 74 26 M108 52 Q116 30 126 26', '#3d3d5c', 3);
  for (const sx of [-1, 1]) c.raw(`<ellipse cx="${100 + sx * 9}" cy="68" rx="5" ry="6" fill="#fff"/><circle cx="${100 + sx * 9}" cy="70" r="3" fill="#2b2340"/>`);
  c.line('M94 80 Q100 85 106 80', '#ffffff', 2.4);
};
A.chrysalis = c => {
  c.line('M40 30 Q100 20 160 30', '#8b5a2b', 10);
  c.line('M100 28 V44', '#8b5a2b', 3);
  c.path('M100 44 Q132 70 128 120 Q122 168 100 184 Q78 168 72 120 Q68 70 100 44 Z', '#8bd06a', { shine: [86, 80, 6, 18, 10, .6] });
  c.line('M80 90 Q100 98 120 90 M76 120 Q100 128 124 120 M80 150 Q100 158 120 150', '#6ab04a', 2.5);
  c.face(100, 114, .7, { mode: 'sleep', keep: true });
};
A.eggleaf = c => {
  c.path('M20 140 Q60 60 180 70 Q150 160 20 140 Z', '#45d36a', { shine: [70, 104, 18, 6, -15, .5] });
  c.line('M28 138 Q100 110 172 74', '#2fae52', 3);
  for (const [x, y] of [[80, 112], [100, 106], [120, 100], [92, 124], [112, 118]]) c.ball(x, y, 9, '#fff6e0');
};
module.exports = lib;
