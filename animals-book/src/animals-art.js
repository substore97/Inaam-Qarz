// Extra 3D animals for "حيواناتي الجميلة". Extends the shared art library of book 1.
const lib = require('../../arabic-kids-book/src/art');
const { A } = lib;

const whiskers = (c, cx, cy) => {
  c.line(`M${cx - 14} ${cy} L${cx - 34} ${cy - 4} M${cx - 14} ${cy + 5} L${cx - 33} ${cy + 8}`, '#6b5a4a', 1.6);
  c.line(`M${cx + 14} ${cy} L${cx + 34} ${cy - 4} M${cx + 14} ${cy + 5} L${cx + 33} ${cy + 8}`, '#6b5a4a', 1.6);
};

A.cat = c => {
  c.shadow(100, 188, 55);
  c.ell(150, 150, 10, 32, '#ff9f43', { rot: 35 });
  c.ell(100, 152, 42, 34, '#ff9f43');
  c.ell(100, 160, 22, 22, '#fff1df');
  c.path('M60 74 L68 28 L94 58 Z', '#ff9f43').path('M140 74 L132 28 L106 58 Z', '#ff9f43');
  c.path('M67 64 L71 40 L86 58 Z', '#ffb0c8', { flat: true, noEdge: true }).path('M133 64 L129 40 L114 58 Z', '#ffb0c8', { flat: true, noEdge: true });
  c.ball(100, 92, 40, '#ffab57');
  c.line('M90 56 L92 64 M100 53 L100 62 M110 56 L108 64', '#e0782a', 3);
  c.ell(91, 108, 10, 7, '#fff1df', { noEdge: true }).ell(109, 108, 10, 7, '#fff1df', { noEdge: true });
  c.ell(100, 102, 4.5, 3.2, '#ff7fa5', { noEdge: true });
  whiskers(c, 100, 108);
  c.face(100, 92, 1, { mouth: false });
  c.ell(82, 184, 13, 7, '#ff9f43').ell(118, 184, 13, 7, '#ff9f43');
};

A.lion = c => {
  c.shadow(100, 190, 60);
  c.line('M138 168 Q170 160 172 132', '#e8a53c', 6);
  c.ball(172, 128, 9, '#b8601e');
  c.ell(100, 165, 40, 26, '#ffc857');
  c.ell(80, 186, 13, 7, '#ffbe45').ell(120, 186, 13, 7, '#ffbe45');
  for (let i = 0; i < 14; i++) {
    const a = i * Math.PI * 2 / 14;
    c.ball((100 + 46 * Math.cos(a)).toFixed(1), (94 + 44 * Math.sin(a)).toFixed(1), 20, '#d9782a', { shine: false });
  }
  c.ball(70, 64, 11, '#ffc857', { shine: false }).ball(130, 64, 11, '#ffc857', { shine: false });
  c.ball(100, 96, 40, '#ffcc5c');
  c.ell(91, 112, 11, 8, '#fff1d6', { noEdge: true }).ell(109, 112, 11, 8, '#fff1d6', { noEdge: true });
  c.ell(100, 105, 7, 5, '#6b3e1f');
  c.face(100, 94, 1, { mouth: false });
  c.line('M94 118 Q100 123 106 118', '#2b2340', 2.4);
};

A.elephant = c => {
  c.shadow(100, 190, 62);
  c.ell(100, 158, 46, 30, '#9fb4cc');
  c.cyl(66, 160, 20, 24, '#93a8c2', 5).cyl(114, 160, 20, 24, '#93a8c2', 5);
  for (const s of [-1, 1]) {
    c.ell(100 + s * 48, 92, 34, 40, '#a9bdd6', { rot: s * 15 });
    c.ell(100 + s * 48, 94, 22, 28, '#f5c2d3', { rot: s * 15, noEdge: true });
  }
  c.ball(100, 92, 42, '#adc1da');
  c.path('M88 108 Q84 150 98 168 Q110 178 118 166 Q104 150 112 108 Z', '#a3b8d1', { cyl: true });
  c.face(100, 86, 1, { mouth: false });
  c.ell(80, 120, 5, 10, '#ffffff', { rot: 20 }).ell(120, 120, 5, 10, '#ffffff', { rot: -20 });
};

A.chicken = c => {
  c.shadow(100, 188, 55);
  c.ell(152, 172, 15, 19, '#fff0d6');
  c.line('M86 168 L84 186 M80 186 L90 186 M114 168 L116 186 M110 186 L120 186', '#ff8a1a', 4);
  c.ball(90, 66, 10, '#ff3b4f').ball(102, 58, 12, '#ff3b4f').ball(114, 66, 10, '#ff3b4f');
  c.ell(54, 124, 15, 26, '#f4ece0', { rot: 15 }).ell(146, 124, 15, 26, '#f4ece0', { rot: -15 });
  c.ball(100, 118, 50, '#fffaf0');
  c.ell(100, 132, 6, 9, '#ff3b4f');
  c.path('M91 112 L109 112 L100 126 Z', '#ff9f1c');
  c.face(100, 100, 1, { mouth: false });
};

A.cow = c => {
  c.shadow(100, 190, 58);
  c.ell(100, 166, 44, 24, '#f7f7f7');
  c.ell(84, 160, 12, 8, '#3d3d5c', { flat: true, noEdge: true });
  c.ell(70, 52, 6, 13, '#fff0c2', { rot: -30 }).ell(130, 52, 6, 13, '#fff0c2', { rot: 30 });
  c.ell(54, 84, 18, 9, '#efefef', { rot: -20 }).ell(146, 84, 18, 9, '#efefef', { rot: 20 });
  c.ell(56, 85, 10, 4, '#ffb3c7', { rot: -20, noEdge: true }).ell(144, 85, 10, 4, '#ffb3c7', { rot: 20, noEdge: true });
  c.ball(100, 92, 42, '#fbfbfb');
  c.raw(`<clipPath id="${c.id}h"><circle cx="100" cy="92" r="41"/></clipPath><g clip-path="url(#${c.id}h)"><ellipse cx="76" cy="66" rx="18" ry="14" fill="#3d3d5c"/><ellipse cx="132" cy="96" rx="12" ry="16" fill="#3d3d5c"/></g>`);
  c.ell(100, 120, 30, 19, '#ffb3c7');
  c.ell(90, 118, 4, 5, '#c2607e', { flat: true, noEdge: true }).ell(110, 118, 4, 5, '#c2607e', { flat: true, noEdge: true });
  c.line('M92 129 Q100 134 108 129', '#2b2340', 2.2);
  c.face(100, 88, 1, { mouth: false });
  c.ball(100, 146, 9, '#ffd23f');
};

A.monkey = c => {
  c.shadow(100, 190, 52);
  c.line('M132 168 Q172 166 168 136 Q164 118 150 126', '#a0663a', 7);
  c.ell(100, 165, 36, 25, '#a0663a');
  c.ell(100, 168, 20, 16, '#f2c9a0', { noEdge: true });
  c.ball(56, 92, 16, '#a0663a').ball(144, 92, 16, '#a0663a');
  c.ball(56, 92, 9, '#f2c9a0', { shine: false }).ball(144, 92, 9, '#f2c9a0', { shine: false });
  c.ball(100, 92, 42, '#a86d3f');
  c.ball(86, 88, 17, '#f2c9a0', { shine: false }).ball(114, 88, 17, '#f2c9a0', { shine: false });
  c.ell(100, 113, 25, 17, '#f2c9a0');
  c.path('M96 52 Q100 40 108 46 Q102 48 104 54 Z', '#8a5530', { flat: true });
  c.face(100, 90, 1, { mouthDy: 14 });
};

A.snail = c => {
  c.shadow(100, 186, 70);
  c.path('M24 176 Q26 150 56 150 L150 152 Q176 156 172 178 Z', '#a8e6a1');
  c.ball(116, 112, 46, '#ff9f43');
  c.line('M116 112 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 0 a18 18 0 1 1 34 0 a26 26 0 1 1 -50 0', '#d9661a', 3.5);
  c.line('M44 128 L36 98 M56 128 L62 98', '#7fcf7a', 4);
  c.ball(36, 96, 6, '#7fcf7a').ball(62, 96, 6, '#7fcf7a');
  c.ell(50, 144, 22, 26, '#b3ecac');
  c.face(50, 144, .75);
};

A.mouse = c => {
  c.shadow(100, 190, 52);
  c.line('M132 172 Q172 176 170 150 Q168 132 182 128', '#ffa3bb', 4);
  c.ell(100, 162, 36, 26, '#b8b8c8');
  c.ball(60, 62, 25, '#c2c2d2').ball(140, 62, 25, '#c2c2d2');
  c.ball(60, 62, 15, '#ffb3c7', { shine: false }).ball(140, 62, 15, '#ffb3c7', { shine: false });
  c.ball(100, 100, 40, '#c8c8d8');
  c.ball(100, 112, 5, '#ff7fa5');
  whiskers(c, 100, 114);
  c.face(100, 98, 1, { mouth: false });
  c.line('M95 122 Q100 126 105 122', '#2b2340', 2.2);
  c.ell(82, 186, 11, 6, '#ffb3c7').ell(118, 186, 11, 6, '#ffb3c7');
};

A.owl = c => {
  c.raw(`<rect x="20" y="172" width="160" height="16" rx="8" fill="${c.vg('#8b5a2b')}"/>`);
  c.ell(140, 170, 14, 6, '#45d36a', { rot: -20 });
  c.path('M58 70 L62 36 L84 58 Z', '#7d5fb8').path('M142 70 L138 36 L116 58 Z', '#7d5fb8');
  c.ell(52, 122, 13, 34, '#8366c4', { rot: 10 }).ell(148, 122, 13, 34, '#8366c4', { rot: -10 });
  c.ell(100, 112, 52, 62, '#9b7ad1', { shine: true });
  c.ell(100, 140, 32, 34, '#ece4ff', { noEdge: true });
  c.line('M88 130 l6 6 l6 -6 M100 130 l6 6 l6 -6 M94 146 l6 6 l6 -6', '#b9a6e6', 2);
  for (const x of [80, 120]) {
    c.ball(x, 92, 20, '#ffffff', { shine: false });
    c.raw(`<circle cx="${x}" cy="94" r="10" fill="#2b2340"/><circle cx="${x + 3.5}" cy="89.5" r="3.5" fill="#fff"/>`);
  }
  c.path('M93 104 L107 104 L100 118 Z', '#ff9f1c');
  c.ell(84, 172, 9, 6, '#ff9f1c').ell(116, 172, 9, 6, '#ff9f1c');
};

A.penguin = c => {
  c.ell(100, 184, 80, 12, '#dff1ff', { shine: true });
  c.ell(52, 122, 11, 32, '#2f3a56', { rot: 22 }).ell(148, 122, 11, 32, '#2f3a56', { rot: -22 });
  c.ell(82, 182, 15, 7, '#ff9f1c').ell(118, 182, 15, 7, '#ff9f1c');
  c.ell(100, 112, 50, 68, '#34405f', { shine: true });
  c.ell(100, 128, 34, 50, '#ffffff', { noEdge: true });
  c.ball(87, 82, 17, '#ffffff', { shine: false }).ball(113, 82, 17, '#ffffff', { shine: false });
  c.face(100, 86, .85, { mouth: false });
  c.ell(100, 98, 9, 6, '#ff9f1c');
};

A.butterfly = c => {
  c.ell(62, 80, 40, 32, '#ff6fae', { rot: -25, shine: true }).ell(138, 80, 40, 32, '#ff6fae', { rot: 25, shine: true });
  c.ell(70, 132, 27, 24, '#b05cff', { rot: 20 }).ell(130, 132, 27, 24, '#b05cff', { rot: -20 });
  for (const [x, y, r] of [[52, 76, 10], [148, 76, 10], [72, 134, 7], [128, 134, 7]]) c.ball(x, y, r, '#ffe14d');
  c.line('M94 62 Q84 34 72 28 M106 62 Q116 34 128 28', '#3d3d5c', 3);
  c.ball(72, 28, 5, '#ff6fae').ball(128, 28, 5, '#ff6fae');
  c.ell(100, 112, 11, 44, '#7b5cd6');
  c.ball(100, 66, 18, '#8b6be6');
  c.face(100, 67, .65);
  c.shadow(100, 188, 40, 6, .12);
};

A.turtle = c => {
  c.shadow(100, 184, 72);
  c.ell(56, 160, 15, 11, '#9be09a').ell(144, 160, 15, 11, '#9be09a');
  c.ell(30, 150, 9, 6, '#9be09a');
  c.ball(160, 116, 24, '#a8e6a1');
  c.ell(100, 146, 66, 13, '#7ed99a');
  c.path('M36 146 C36 84 164 84 164 146 Z', '#2fae52', { shine: [70, 104, 16, 7, -25, .6] });
  c.line('M100 98 L82 112 L86 134 L114 134 L118 112 Z M82 112 L58 110 M118 112 L142 110 M86 134 L70 146 M114 134 L130 146 M100 98 L100 90', '#8fe3a5', 3);
  c.face(162, 114, .72);
};

module.exports = lib;
