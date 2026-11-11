// 3D body parts for "جسمي الجميل". Extends the shared art library.
const lib = require('../../school-book/src/school-art');
const { A } = lib;
const SKIN = '#ffcfa8', SKIN2 = '#f2b48a';

A.kidface = c => {
  c.shadow(100, 190, 56, 7);
  c.ball(36, 104, 16, SKIN).ball(164, 104, 16, SKIN);
  c.ball(100, 104, 66, SKIN);
  c.path('M36 96 Q34 34 100 32 Q166 34 164 96 Q150 70 128 66 Q120 50 100 58 Q80 48 70 66 Q48 70 36 96 Z', '#5a3a22', { shine: [80, 44, 16, 5, -10, .5] });
  c.face(100, 118, 1.2);
};
A.eye = c => {
  c.shadow(100, 168, 70, 7, .15);
  c.line('M36 56 Q100 22 164 56', '#5a3a22', 9);
  c.path('M18 106 Q100 28 182 106 Q100 184 18 106 Z', '#ffffff', { vert: true });
  c.ball(100, 106, 40, '#4fa8ff', { shine: false });
  c.ball(100, 106, 20, '#2b2340', { shine: false });
  c.raw('<circle cx="88" cy="94" r="9" fill="#fff"/><circle cx="112" cy="118" r="4" fill="#fff" opacity=".8"/>');
  c.line('M40 82 L30 66 M64 66 L58 48 M100 60 V40 M136 66 L142 48 M160 82 L170 66', '#2b2340', 4);
};
A.ear = c => {
  c.shadow(100, 186, 46, 7);
  c.path('M70 40 Q140 20 150 90 Q154 130 120 150 Q104 160 104 178 Q90 192 76 178 Q70 150 90 130 Q60 110 70 40 Z', SKIN, { shine: [96, 54, 14, 6, -20, .6] });
  c.line('M90 60 Q130 50 130 96 Q130 120 110 130', SKIN2, 9);
};
A.nose = c => {
  c.shadow(100, 176, 60, 7);
  c.path('M100 30 Q118 30 124 90 Q160 110 150 140 Q140 162 100 160 Q60 162 50 140 Q40 110 76 90 Q82 30 100 30 Z', SKIN, { shine: [86, 64, 8, 20, 0, .6] });
  c.raw(`<ellipse cx="80" cy="140" rx="11" ry="7" fill="${SKIN2}"/><ellipse cx="120" cy="140" rx="11" ry="7" fill="${SKIN2}"/>`);
};
A.mouth = c => {
  c.shadow(100, 170, 76, 7, .15);
  c.path('M14 92 Q60 60 100 80 Q140 60 186 92 Q150 162 100 162 Q50 162 14 92 Z', '#ff6b7a', { shine: [60, 80, 18, 5, -10, .6] });
  c.path('M32 96 Q100 104 168 96 Q140 124 100 124 Q60 124 32 96 Z', '#ffffff', { flat: true });
  c.raw('<path d="M60 100 V118 M80 102 V122 M100 103 V124 M120 102 V122 M140 100 V118" stroke="#e6ebf3" stroke-width="2"/>');
};
A.tongue = c => {
  c.shadow(100, 186, 70, 7, .15);
  c.path('M20 70 Q100 30 180 70 Q160 120 100 122 Q40 120 20 70 Z', '#ff6b7a');
  c.path('M44 76 Q100 60 156 76 Q140 104 100 106 Q60 104 44 76 Z', '#7a1f30', { flat: true });
  c.path('M66 92 Q100 82 134 92 L132 150 Q130 184 100 184 Q70 184 68 150 Z', '#ff8fab', { shine: [84, 120, 6, 18, 0, .6] });
  c.line('M100 100 V160', '#e56a8a', 3);
};
A.tooth = c => {
  c.shadow(100, 190, 56, 7);
  c.path('M44 60 Q40 24 74 26 Q88 28 100 36 Q112 28 126 26 Q160 24 156 60 Q154 96 144 120 Q136 170 122 184 Q110 190 106 168 Q102 146 100 146 Q98 146 94 168 Q90 190 78 184 Q64 170 56 120 Q46 96 44 60 Z', '#ffffff', { shine: [70, 50, 10, 5, -20, .8] });
  c.star(154, 30, 12, '#ffe680');
  c.face(100, 84, 1);
};
A.hand = c => {
  c.shadow(100, 190, 56, 7);
  for (const [x, y, h, r] of [[52, 82, 34, -18], [78, 56, 44, -6], [104, 50, 48, 2], [130, 58, 42, 10]]) c.ell(x, y, 13, h, SKIN, { rot: r });
  c.ell(162, 116, 13, 34, SKIN, { rot: 48 });
  c.path('M44 100 Q44 84 64 84 L140 84 Q156 84 156 104 L152 150 Q148 182 100 184 Q52 182 48 150 Z', SKIN, { shine: [70, 104, 14, 6, -10, .6] });
  c.face(100, 132, .9);
};
A.foot = c => {
  c.shadow(100, 186, 70, 7);
  for (const [x, y, r] of [[60, 58, 10], [80, 48, 11], [102, 44, 12], [126, 46, 14], [150, 56, 17]]) c.ball(x, y, r, SKIN);
  c.path('M48 80 Q50 62 90 62 Q140 60 156 84 Q166 130 146 166 Q126 190 94 182 Q52 172 48 126 Z', SKIN, { shine: [80, 80, 14, 6, -20, .6] });
  c.face(100, 118, .9);
};
A.organheart = c => { c.shadow(100, 186, 60, 8); c.heart(100, 104, 70, '#e8264d'); c.face(100, 98, 1.1); };
module.exports = lib;
